import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import {
  BrowseAlertChannelDTO,
  BrowseAlertLinkDTO,
  BrowseAlertPageDTO,
  BrowseAlertViewDTO,
  SHARED_BROWSE_CHANNEL,
  WECOM_SIDEBAR_PATH,
  WeComAppSettingDTO,
} from '../../../interfaces/browse-alert.dto';
import { AuthService } from '../../../services/auth.service';
import { BrowseAlertService } from '../../../services/browse-alert.service';
import { BROWSE_LINK_PARAM } from '../../../services/browse-alert-tracker';
import { SIDA_CONSULTANT_DAILY_ORDER } from '../../components/sida-consultants';

const CONSULTANT_STORAGE_KEY = 'sida:browse-alert-consultant';
const DEFAULT_LANDING_PATH = '/philippines-study/cebu/cia-cebu-international-academy';

interface ChannelRow {
  consultantName: string;
  label: string;
  saved?: BrowseAlertChannelDTO;
  webhookInput: string;
  mentionInput: string;
  weComUserIdInput: string;
  busy: boolean;
  message: string;
  messageIsError: boolean;
}

/**
 * Student browse reminders (/admin/browse-alerts): employees make a personal link for a student, see
 * which school pages each student opened, and owner Admins set where reminders go (the WeCom app, which
 * messages each consultant directly and runs the chat sidebar, and the group robots). The website side
 * is BrowseAlertTracker; the server side is BrowseAlertsController; the sidebar is WeComSidebarComponent.
 */
@Component({
  selector: 'app-admin-browse-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './admin-browse-alerts.component.html',
  styleUrl: './admin-browse-alerts.component.css',
})
export class AdminBrowseAlertsComponent implements OnInit {
  readonly consultants: string[] = [...SIDA_CONSULTANT_DAILY_ORDER];
  readonly isAdmin: boolean;

  pages: BrowseAlertPageDTO[] = [];
  links: BrowseAlertLinkDTO[] = [];
  isLoading = true;
  loadError = '';

  studentName = '';
  consultantName: string;
  landingPath = '';
  note = '';
  creating = false;
  createError = '';
  created: BrowseAlertLinkDTO | null = null;

  filterConsultant = 'all';
  search = '';

  expandedId: string | null = null;
  views: Record<string, BrowseAlertViewDTO[] | 'loading' | 'error'> = {};

  channelRows: ChannelRow[] = [];
  channelsError = '';

  weComApp: WeComAppSettingDTO | null = null;
  corpIdInput = '';
  agentIdInput = '';
  secretInput = '';
  appBusy = false;
  appMessage = '';
  appMessageIsError = false;

  constructor(
    private readonly service: BrowseAlertService,
    private readonly snackBar: MatSnackBar,
    authService: AuthService,
  ) {
    this.isAdmin = authService.getRoles().some((role) => role.toLowerCase() === 'admin');
    const remembered = localStorage.getItem(CONSULTANT_STORAGE_KEY) ?? '';
    this.consultantName = this.consultants.includes(remembered) ? remembered : this.consultants[0];
  }

  ngOnInit(): void {
    this.service.getPages().subscribe({
      next: (pages) => {
        this.pages = [...pages].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
        if (!this.landingPath) {
          this.landingPath = pages.some((page) => page.path === DEFAULT_LANDING_PATH)
            ? DEFAULT_LANDING_PATH
            : this.pages[0]?.path ?? '';
        }
      },
      error: () => this.loadError = '学校页面列表加载失败，请刷新重试。',
    });
    this.loadLinks();
    if (this.isAdmin) {
      this.loadChannels();
      this.loadWeComApp();
    }
  }

  get filteredLinks(): BrowseAlertLinkDTO[] {
    const search = this.search.trim().toLowerCase();
    return this.links.filter((link) =>
      (this.filterConsultant === 'all' || link.consultantName === this.filterConsultant)
      && (!search || link.studentName.toLowerCase().includes(search) || (link.note ?? '').toLowerCase().includes(search)));
  }

  loadLinks(): void {
    this.isLoading = true;
    this.service.getLinks().pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (links) => this.links = links,
      error: () => this.loadError = '链接列表加载失败，请刷新重试。',
    });
  }

  create(): void {
    this.createError = '';
    if (!this.studentName.trim()) {
      this.createError = '请填写学生名字。';
      return;
    }
    if (!this.landingPath) {
      this.createError = '请选择要发给学生的学校页面。';
      return;
    }
    localStorage.setItem(CONSULTANT_STORAGE_KEY, this.consultantName);
    this.creating = true;
    this.service.createLink({
      studentName: this.studentName.trim(),
      consultantName: this.consultantName,
      landingPath: this.landingPath,
      note: this.note.trim() || null,
    }).pipe(finalize(() => this.creating = false)).subscribe({
      next: (link) => {
        this.created = link;
        this.links = [link, ...this.links];
        this.studentName = '';
        this.note = '';
      },
      error: (error) => this.createError = this.errorText(error, '生成失败，请稍后再试。'),
    });
  }

  linkUrl(link: BrowseAlertLinkDTO): string {
    return `${window.location.origin}${link.landingPath}?${BROWSE_LINK_PARAM}=${link.code}`;
  }

  copy(link: BrowseAlertLinkDTO): void {
    const url = this.linkUrl(link);
    const done = () => this.snackBar.open(`已复制${link.studentName}的专属链接`, '关闭', { duration: 2500 });
    const failed = () => this.snackBar.open('复制失败，请长按链接手动复制', '关闭', { duration: 3500 });
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done, failed);
    } else {
      failed();
    }
  }

  toggleHistory(link: BrowseAlertLinkDTO): void {
    if (this.expandedId === link.id) {
      this.expandedId = null;
      return;
    }
    this.expandedId = link.id;
    this.views[link.id] = 'loading';
    this.service.getViews(link.id).subscribe({
      next: (views) => this.views[link.id] = views,
      error: () => this.views[link.id] = 'error',
    });
  }

  viewsOf(link: BrowseAlertLinkDTO): BrowseAlertViewDTO[] | null {
    const views = this.views[link.id];
    return Array.isArray(views) ? views : null;
  }

  setActive(link: BrowseAlertLinkDTO, active: boolean): void {
    this.service.updateLink(link.id, {
      studentName: link.studentName,
      consultantName: link.consultantName,
      note: link.note,
      landingPath: link.landingPath,
      active,
    }).subscribe({
      next: (updated) => Object.assign(link, updated),
      error: (error) => this.snackBar.open(this.errorText(error, '保存失败'), '关闭', { duration: 3500 }),
    });
  }

  remove(link: BrowseAlertLinkDTO): void {
    if (!window.confirm(`删除${link.studentName}的专属链接和全部浏览记录？删除后不能恢复，学生再打开这个链接也不会提醒。`)) {
      return;
    }
    this.service.deleteLink(link.id).subscribe({
      next: () => {
        this.links = this.links.filter((item) => item.id !== link.id);
        if (this.created?.id === link.id) {
          this.created = null;
        }
      },
      error: (error) => this.snackBar.open(this.errorText(error, '删除失败'), '关闭', { duration: 3500 }),
    });
  }

  ago(iso?: string | null): string {
    if (!iso) {
      return '';
    }
    const minutes = Math.floor((Date.now() - Date.parse(iso)) / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return days < 30 ? `${days}天前` : new Date(iso).toLocaleDateString('zh-CN');
  }

  loadChannels(): void {
    this.channelsError = '';
    this.service.getChannels().subscribe({
      next: (channels) => {
        const byName = new Map(channels.map((channel) => [channel.consultantName.toLowerCase(), channel]));
        this.channelRows = [SHARED_BROWSE_CHANNEL, ...this.consultants].map((name) => {
          const saved = byName.get(name.toLowerCase());
          return {
            consultantName: name,
            label: name === SHARED_BROWSE_CHANNEL ? '共用群机器人' : name,
            saved,
            webhookInput: '',
            mentionInput: saved?.mention ?? '',
            weComUserIdInput: saved?.weComUserId ?? '',
            busy: false,
            message: '',
            messageIsError: false,
          };
        });
      },
      error: () => this.channelsError = '提醒设置加载失败，请刷新重试。',
    });
  }

  get sharedRobotSet(): boolean {
    return !!this.channelRows.find((row) => row.consultantName === SHARED_BROWSE_CHANNEL)?.saved?.hasWebhook;
  }

  /** Neither the WeCom app nor the shared robot is set, so reminders cannot go out yet. */
  get remindersOff(): boolean {
    return this.channelRows.length > 0 && this.weComApp !== null && !this.sharedRobotSet && !this.weComApp.complete;
  }

  get sidebarUrl(): string {
    return `${window.location.origin}${WECOM_SIDEBAR_PATH}`;
  }

  copySidebarUrl(): void {
    const done = () => this.snackBar.open('已复制侧边栏地址', '关闭', { duration: 2500 });
    const failed = () => this.snackBar.open('复制失败，请手动复制', '关闭', { duration: 3500 });
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(this.sidebarUrl).then(done, failed);
    } else {
      failed();
    }
  }

  loadWeComApp(): void {
    this.service.getWeComApp().subscribe({
      next: (setting) => this.applyWeComApp(setting),
      error: () => this.setAppMessage('企业微信应用设置加载失败，请刷新重试。', true),
    });
  }

  saveWeComApp(removeSecret = false): void {
    const agentText = this.agentIdInput.trim();
    const agentId = agentText ? Number(agentText) : null;
    if (agentId !== null && (!Number.isInteger(agentId) || agentId <= 0)) {
      this.setAppMessage('AgentId 是应用详情页上的一串数字。', true);
      return;
    }
    this.appBusy = true;
    this.appMessage = '';
    this.service.saveWeComApp({
      corpId: this.corpIdInput.trim() || null,
      agentId,
      secret: removeSecret ? '' : this.secretInput.trim() || null,
    }).pipe(finalize(() => this.appBusy = false)).subscribe({
      next: (setting) => {
        this.applyWeComApp(setting);
        this.secretInput = '';
        if (setting.checkMessage) {
          this.setAppMessage(setting.checkOk ? `已保存，${setting.checkMessage}` : setting.checkMessage, !setting.checkOk);
        } else {
          this.setAppMessage(setting.complete ? '已保存。' : '已保存。企业ID、AgentId 和 Secret 都填好后才会启用。', false);
        }
      },
      error: (error) => this.setAppMessage(this.errorText(error, '保存失败。'), true),
    });
  }

  private applyWeComApp(setting: WeComAppSettingDTO): void {
    this.weComApp = setting;
    this.corpIdInput = setting.corpId ?? '';
    this.agentIdInput = setting.agentId ? String(setting.agentId) : '';
  }

  private setAppMessage(message: string, isError: boolean): void {
    this.appMessage = message;
    this.appMessageIsError = isError;
  }

  isShared(row: ChannelRow): boolean {
    return row.consultantName === SHARED_BROWSE_CHANNEL;
  }

  saveChannel(row: ChannelRow, removeWebhook = false): void {
    row.busy = true;
    row.message = '';
    const webhook = removeWebhook ? '' : row.webhookInput.trim() || null;
    this.service.saveChannel({
      consultantName: row.consultantName,
      webhookUrl: webhook,
      mention: this.isShared(row) ? null : row.mentionInput.trim() || null,
      weComUserId: this.isShared(row) ? null : row.weComUserIdInput.trim() || null,
    }).pipe(finalize(() => row.busy = false)).subscribe({
      next: (saved) => {
        row.saved = saved;
        row.webhookInput = '';
        row.mentionInput = saved.mention ?? '';
        row.weComUserIdInput = saved.weComUserId ?? '';
        this.setRowMessage(row, removeWebhook ? '已删除这个机器人。' : '已保存。', false);
      },
      error: (error) => this.setRowMessage(row, this.errorText(error, '保存失败。'), true),
    });
  }

  testChannel(row: ChannelRow): void {
    row.busy = true;
    row.message = '';
    this.service.testChannel(row.consultantName).pipe(finalize(() => row.busy = false)).subscribe({
      next: (result) => this.setRowMessage(row, result.message, false),
      error: (error) => this.setRowMessage(row, this.errorText(error, '发送失败。'), true),
    });
  }

  private setRowMessage(row: ChannelRow, message: string, isError: boolean): void {
    row.message = message;
    row.messageIsError = isError;
  }

  private errorText(error: unknown, fallback: string): string {
    const message = error instanceof HttpErrorResponse ? error.error?.message : null;
    return typeof message === 'string' && message ? message : fallback;
  }
}
