import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  BrowseAlertPageDTO,
  BrowseAlertViewDTO,
  WECOM_SIDEBAR_PATH,
  WeComSidebarCardDTO,
  WeComSidebarConfigDTO,
  WeComSidebarContactDTO,
  WeComSidebarSessionDTO,
  WeComSidebarSignatureDTO,
} from '../../../interfaces/browse-alert.dto';
import { markStaffBrowser } from '../../../services/browse-alert-tracker';
import { WeComJs, isInsideWeCom, weComOAuthUrl } from './wecom-js-sdk';

const API = '/browse-alerts/sidebar';
const TOKEN_KEY = 'sida:wecom-sidebar-token';
const LOGIN_TRIES_KEY = 'sida:wecom-sidebar-login-tries';

type Stage = 'loading' | 'outside' | 'not-configured' | 'unlinked' | 'no-contact' | 'ready' | 'error';

/**
 * The WeCom chat sidebar (/wecom-sidebar): in a one-to-one chat with a student, the consultant taps a
 * school page and the page goes into the chat as a link card carrying that student's personal link, so
 * every school page the student then opens reminds the consultant. Server: BrowseAlertSidebarController.
 */
@Component({
  selector: 'app-wecom-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wecom-sidebar.component.html',
  styleUrl: './wecom-sidebar.component.css',
})
export class WeComSidebarComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  stage: Stage = 'loading';
  errorText = '';
  unlinkedAccount = '';
  consultantName = '';

  pages: BrowseAlertPageDTO[] = [];
  search = '';
  contact: WeComSidebarContactDTO | null = null;
  studentName = '';
  editingName = false;

  sendingPath = '';
  sentPaths = new Set<string>();
  toast = '';
  toastIsError = false;

  private token = '';
  private externalUserId = '';
  private sdk: WeComJs | null = null;
  private toastTimer = 0;

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    markStaffBrowser();
    void this.start();
  }

  get filteredPages(): BrowseAlertPageDTO[] {
    const words = this.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) {
      return this.pages;
    }
    return this.pages.filter((page) => {
      const text = `${page.name} ${page.path}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }

  get recentViews(): BrowseAlertViewDTO[] {
    return this.contact?.recentViews ?? [];
  }

  async send(page: BrowseAlertPageDTO): Promise<void> {
    if (!this.sdk || this.sendingPath) {
      return;
    }
    this.sendingPath = page.path;
    try {
      const card = await this.post<WeComSidebarCardDTO>('send', {
        externalUserId: this.externalUserId,
        path: page.path,
        studentName: this.studentName.trim() || null,
      });
      await this.sdk.sendNews({ link: card.url, title: card.title, desc: card.description, imgUrl: card.imageUrl });
      this.sentPaths.add(page.path);
      this.showToast(card.tracked ? `已发送：${card.title}` : `已发送，但这位学生的提醒已停用，打开不会提醒你。`, !card.tracked);
      void this.loadContact();
    } catch (error) {
      this.showToast(this.messageOf(error, '发送失败，请重试。'), true);
    } finally {
      this.sendingPath = '';
    }
  }

  saveName(): void {
    this.editingName = false;
    this.studentName = this.studentName.trim() || this.contact?.studentName || '';
  }

  ago(iso: string): string {
    const minutes = Math.floor((Date.now() - Date.parse(iso)) / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return days < 30 ? `${days}天前` : new Date(iso).toLocaleDateString('zh-CN');
  }

  reload(): void {
    window.location.replace(WECOM_SIDEBAR_PATH);
  }

  private async start(): Promise<void> {
    try {
      const config = await firstValueFrom(this.http.get<WeComSidebarConfigDTO>(`${API}/config`));
      if (!config.enabled || !config.corpId || !config.agentId) {
        this.stage = 'not-configured';
        return;
      }

      this.token = sessionStorage.getItem(TOKEN_KEY) ?? '';
      if (!this.token) {
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) {
          this.signIn(config.corpId, config.agentId);
          return;
        }
        const session = await this.post<WeComSidebarSessionDTO>('session', { code });
        if (!session.token) {
          this.unlinkedAccount = session.weComUserId ?? '';
          this.stage = 'unlinked';
          return;
        }
        this.token = session.token;
        sessionStorage.setItem(TOKEN_KEY, session.token);
        sessionStorage.removeItem(LOGIN_TRIES_KEY);
        this.consultantName = session.consultantName ?? '';
      }

      const [pages, sdk] = await Promise.all([
        this.get<BrowseAlertPageDTO[]>('pages'),
        WeComJs.connect((url) => this.post<WeComSidebarSignatureDTO>('signature', { url })),
      ]);
      this.pages = [...pages].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
      this.sdk = sdk;

      const entry = await sdk.entry().catch(() => '');
      if (entry === 'group_chat_tools') {
        this.stage = 'no-contact';
        return;
      }
      try {
        this.externalUserId = await sdk.currentContact();
      } catch {
        this.stage = 'no-contact';
        return;
      }

      await this.loadContact();
      this.studentName = this.contact?.studentName ?? '';
      this.stage = 'ready';
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        this.reload();
        return;
      }
      this.errorText = this.messageOf(error, '侧边栏打开失败，请关掉再重新打开。');
      this.stage = 'error';
    }
  }

  /** Sends the page through WeCom's silent sign-in; gives up after two tries so it never loops. */
  private signIn(corpId: string, agentId: number): void {
    if (!isInsideWeCom()) {
      this.stage = 'outside';
      return;
    }
    const tries = Number(sessionStorage.getItem(LOGIN_TRIES_KEY) ?? '0');
    if (tries >= 2) {
      this.errorText = '企业微信登录没有成功，请检查应用的可信域名设置，或关掉侧边栏再试。';
      this.stage = 'error';
      return;
    }
    sessionStorage.setItem(LOGIN_TRIES_KEY, String(tries + 1));
    window.location.replace(weComOAuthUrl(corpId, agentId, `${window.location.origin}${WECOM_SIDEBAR_PATH}`));
  }

  private async loadContact(): Promise<void> {
    this.contact = await this.post<WeComSidebarContactDTO>('contact', { externalUserId: this.externalUserId });
  }

  private get<T>(path: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${API}/${path}`, { headers: this.headers() }));
  }

  private post<T>(path: string, body: unknown): Promise<T> {
    return firstValueFrom(this.http.post<T>(`${API}/${path}`, body, { headers: this.headers() }));
  }

  private headers(): HttpHeaders {
    return new HttpHeaders(this.token ? { 'X-Sidebar-Token': this.token } : {});
  }

  private showToast(text: string, isError: boolean): void {
    window.clearTimeout(this.toastTimer);
    this.toast = text;
    this.toastIsError = isError;
    this.toastTimer = window.setTimeout(() => (this.toast = ''), 3500);
  }

  private messageOf(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      return typeof message === 'string' && message ? message : fallback;
    }
    return error instanceof Error && error.message ? error.message : fallback;
  }
}
