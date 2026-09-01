import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EMPTY, Subject, catchError, filter, takeUntil } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import {
  QuoteImageCardData,
  QuoteImageLocalFeeItem,
  QuoteImagePaymentItem,
  QuoteImageDownloadButtonComponent,
} from './quote-image-download-button.component';

interface ParsedMoney {
  value: number;
  currency: 'USD' | 'PHP' | null;
}

/**
 * One export surface for every Philippines school calculator.
 *
 * School pages keep their own pricing rules. This component reads the result
 * already calculated by the active page and feeds it into the shared quote
 * image renderer, so visual changes do not need to be copied to every school.
 */
@Component({
  selector: 'app-philippines-quote-image-exporter',
  standalone: true,
  imports: [CommonModule, QuoteImageDownloadButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside *ngIf="quote" class="export-dock" aria-label="生成当前学校报价单图片">
      <div class="export-dock__copy">
        <strong>当前报价可生成图片</strong>
        <span>已套用统一的菲律宾学校报价单版式</span>
      </div>
      <div class="export-dock__actions">
        <app-quote-image-download-button
          [quote]="quote"
          label="保存报价单图片"
          icon="image"
          buttonClass="export-action export-action--primary"
        ></app-quote-image-download-button>
        <app-quote-image-download-button
          [quote]="quote"
          mode="email"
          label="发送到邮箱"
          icon="mail"
          buttonClass="export-action export-action--secondary"
        ></app-quote-image-download-button>
      </div>
    </aside>
  `,
  styles: [
    `
      :host {
        position: fixed;
        right: 22px;
        bottom: 22px;
        z-index: 950;
        display: block;
      }

      .export-dock {
        display: flex;
        align-items: center;
        gap: 16px;
        width: min(590px, calc(100vw - 44px));
        padding: 13px 14px 13px 17px;
        border: 1px solid rgba(6, 66, 46, 0.18);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.97);
        box-shadow: 0 16px 44px rgba(15, 35, 27, 0.18);
        backdrop-filter: blur(12px);
      }

      .export-dock__copy {
        display: grid;
        min-width: 0;
        gap: 2px;
        flex: 1;
      }

      .export-dock__copy strong {
        color: #06422e;
        font-size: 14px;
        font-weight: 900;
      }

      .export-dock__copy span {
        overflow: hidden;
        color: #64748b;
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .export-dock__actions {
        display: flex;
        gap: 8px;
      }

      :host ::ng-deep .export-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 40px;
        border-radius: 8px;
        padding: 0 14px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 850;
        cursor: pointer;
      }

      :host ::ng-deep .export-action mat-icon {
        width: 18px;
        height: 18px;
        font-size: 18px;
      }

      :host ::ng-deep .export-action--primary {
        border: 1px solid #f25518;
        background: #f25518;
        color: #ffffff;
      }

      :host ::ng-deep .export-action--secondary {
        border: 1px solid #cbd8d1;
        background: #ffffff;
        color: #06422e;
      }

      @media (max-width: 720px) {
        :host {
          right: 10px;
          bottom: 10px;
          left: 10px;
        }

        .export-dock {
          width: auto;
          padding: 10px;
        }

        .export-dock__copy {
          display: none;
        }

        .export-dock__actions {
          width: 100%;
        }

        :host ::ng-deep .export-action {
          flex: 1;
          min-height: 44px;
          padding-inline: 10px;
        }
      }
    `,
  ],
})
export class PhilippinesQuoteImageExporterComponent implements OnInit, OnDestroy {
  quote: QuoteImageCardData | null = null;

  private readonly destroyed$ = new Subject<void>();
  private usdToCny = 0;
  private phpPerCny = 0;
  private refreshTimer: number | undefined;

  private readonly documentInteractionHandler = (): void => this.scheduleRefresh(30);

  constructor(
    private readonly router: Router,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.exchangeRateService
      .getLatestCnyRates()
      .pipe(catchError(() => EMPTY), takeUntil(this.destroyed$))
      .subscribe((rates) => {
        this.usdToCny = rates.usdToCny;
        this.phpPerCny = rates.phpPerCny;
        this.scheduleRefresh(0);
      });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroyed$),
      )
      .subscribe(() => this.scheduleRefresh(180));

    document.addEventListener('change', this.documentInteractionHandler, true);
    document.addEventListener('click', this.documentInteractionHandler, true);
    this.scheduleRefresh(180);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    if (this.refreshTimer !== undefined) {
      window.clearTimeout(this.refreshTimer);
    }
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('change', this.documentInteractionHandler, true);
      document.removeEventListener('click', this.documentInteractionHandler, true);
    }
  }

  private scheduleRefresh(delay: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.refreshTimer !== undefined) {
      window.clearTimeout(this.refreshTimer);
    }
    this.refreshTimer = window.setTimeout(() => {
      this.quote = this.buildQuoteFromPage();
      this.changeDetectorRef.markForCheck();
    }, delay);
  }

  private buildQuoteFromPage(): QuoteImageCardData | null {
    if (!this.router.url.startsWith('/philippines-study/')) {
      return null;
    }

    const quoteSection = document.querySelector<HTMLElement>('#quote');
    if (!quoteSection) {
      return null;
    }

    // CIA already owns the same shared renderer inside its quote actions.
    if (quoteSection.querySelector('app-quote-image-download-button')) {
      return null;
    }

    const totalElement = this.findQuoteTotalElement(quoteSection);
    const totalMoney = this.parseMoney(totalElement?.textContent ?? '');
    if (!totalElement || totalMoney.currency !== 'USD' || totalMoney.value <= 0) {
      return null;
    }

    const now = new Date();
    const dateText = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const schoolCode = this.extractSchoolCode(quoteSection);
    const weeks = this.extractSelectedWeeks(quoteSection);
    const paymentItems = this.extractPaymentItems(quoteSection, totalMoney.value);
    const localFeeData = this.extractLocalFees(weeks);
    const displayedCny = this.cleanText(
      quoteSection.querySelector<HTMLElement>('.quote-result em')?.textContent ?? '',
    );
    const cnyAmount = this.usdToCny > 0
      ? Math.round((totalMoney.value * this.usdToCny) / 100) * 100
      : this.parseFirstNumber(displayedCny);
    const fileSafeCode = schoolCode.replace(/[\\/:*?"<>|\s]+/g, '-');

    return {
      layout: 'cia-detailed',
      fileName: `${fileSafeCode}-${weeks}周报价单-${dateText.replaceAll('/', '')}.png`,
      logoSrc: '/assets/sida-qihang-quote-header-logo-transparent.png',
      heroSrc: this.extractHeroSource(),
      schoolCode,
      title: `${weeks}周`,
      subtitle: '',
      quoteDateText: dateText,
      updatedAtText: dateText,
      studentItems: [
        { icon: '价', label: '报价日期', value: dateText },
        {
          icon: '日',
          label: '预计入学日期',
          value: this.extractSelectedStartDate(quoteSection) || '待确认',
        },
      ],
      paymentSectionTitle: '学校费用明细（到校前支付给学校的费用）',
      paymentItems,
      totalLabel: '最终应付学校金额',
      totalUsd: `${this.formatNumber(totalMoney.value)} 美元`,
      totalCny: cnyAmount > 0
        ? `人民币预计金额：约 ${Math.round(cnyAmount).toLocaleString('zh-CN')} 元`
        : '人民币预计金额：生成时按实时汇率核算',
      totalNote: '按实时汇率预估，最终以支付当日汇率为准',
      localFeeTitle: `到校后${weeks}周学杂费明细参考（学校及政府相关部门收取）`,
      localFeeAmount: localFeeData.total > 0
        ? `₱${Math.round(localFeeData.total).toLocaleString('en-US')}`
        : '逐项参考',
      localFeeDescription: localFeeData.total > 0
        ? '根据当前学习周期和页面已公布项目预估。'
        : '页面未提供完整计算规则，需由顾问逐项核算。',
      localFeeNote: '不含可选费用，实际以学校及相关部门现场收取为准。',
      localFeeItems: localFeeData.items,
      localFeeCny:
        localFeeData.total > 0 && this.phpPerCny > 0
          ? `人民币预计金额：约 ${Math.round(localFeeData.total / this.phpPerCny).toLocaleString('zh-CN')} 元`
          : '人民币预计金额：以实时汇率预估',
      exchangeRateText: '按实时汇率预估',
      optionalFeeItems: localFeeData.optionalItems,
      benefitItems: [
        { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
        { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
        { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
        { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
      ],
      serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
      alumniBenefitItems: [
        {
          title: '老学员权益',
          subtitle: '',
          text: '老学员结业后可享线上一对一英语课程专属优惠，留学爱尔兰及欧美英语学校专属奖学金和优惠。',
        },
      ],
      importantNotes: [
        '人民币金额按实时汇率预估，最终以支付当日汇率为准。',
        '学杂费为到校后比索现金参考，实际以学校及相关部门收费为准。',
        `本报价最终以 ${schoolCode} 最新价格、空房、优惠及思达启航顾问确认为准。`,
      ],
      note: `人民币金额按实时汇率预估；本报价最终以 ${schoolCode} 最新价格、空房、优惠及思达启航顾问确认为准。`,
      contact: {
        name: 'Jenny',
        phone: '132 4982 7686',
        avatarSrc: '/assets/contact/jenny-avatar.jpg',
        qrSrc: '/assets/contact/jenny-wechat-qr.png',
      },
    };
  }

  private extractSchoolCode(quoteSection: HTMLElement): string {
    const eyebrow = this.cleanText(
      quoteSection.querySelector<HTMLElement>('.section-heading > span')?.textContent ?? '',
    )
      .replace(/费用快速报价.*$/u, '')
      .replace(/快速报价.*$/u, '')
      .trim();
    if (eyebrow) {
      return eyebrow.slice(0, 28);
    }

    const quoteHeading = this.cleanText(
      quoteSection.querySelector<HTMLElement>('.section-heading h2')?.textContent ?? '',
    );
    const quoteNameMatch = quoteHeading.match(/估算\s*([^，。]+?)(?:主费用|套餐价|课程住宿费|费用)/u);
    if (quoteNameMatch?.[1]) {
      return quoteNameMatch[1].replace(/公开(?:价目表|价格表|价格)$/u, '').trim().slice(0, 28);
    }

    const heading = this.cleanText(document.querySelector<HTMLElement>('main h1')?.textContent ?? '');
    const simplified = heading
      .replace(/菲律宾|宿务|碧瑶|克拉克|马尼拉|伊洛伊洛|长滩岛|巴科洛德|语言学校|英语学校|游学|学校详情|校区/gu, ' ')
      .split(/\s{2,}|[｜|·]/u)[0]
      .trim();
    return (simplified || '菲律宾学校').slice(0, 28);
  }

  private extractSelectedWeeks(quoteSection: HTMLElement): number {
    const select = Array.from(quoteSection.querySelectorAll<HTMLSelectElement>('select')).find((item) =>
      /学习周数|周数/u.test(this.cleanText(item.closest('label')?.textContent ?? '')),
    );
    const selectedText = select?.selectedOptions[0]?.textContent ?? select?.value ?? '';
    return Math.max(1, Math.round(this.parseFirstNumber(selectedText) || 4));
  }

  private extractSelectedStartDate(quoteSection: HTMLElement): string {
    const dateInputs = Array.from(quoteSection.querySelectorAll<HTMLInputElement>('input[type="date"]'));
    const startDateInput = dateInputs.find((input) =>
      /入学|开课/u.test(this.cleanText(input.closest('label')?.textContent ?? '')),
    );
    return (startDateInput?.value ?? '').replaceAll('-', '/');
  }

  private extractPaymentItems(quoteSection: HTMLElement, finalTotal: number): QuoteImagePaymentItem[] {
    const candidates = Array.from(
      quoteSection.querySelectorAll<HTMLElement>('.quote-breakdown > div, .quote-breakdown > article'),
    );
    const rows: QuoteImagePaymentItem[] = [];

    for (const candidate of candidates) {
      const label = this.cleanText(candidate.querySelector<HTMLElement>('span')?.textContent ?? '');
      const value = this.cleanText(candidate.querySelector<HTMLElement>('strong')?.textContent ?? '');
      if (!label || !value || /计算规则|当前课程|当前房型|当前选择|提醒|平均每周|备注|预计.*合计/u.test(label)) {
        continue;
      }

      const money = this.parseMoney(value);
      const isDiscount = /折扣|优惠/u.test(label);
      if (isDiscount && /未适用|不适用|未生效/u.test(value)) {
        continue;
      }
      if (money.currency !== 'USD' && !isDiscount) {
        continue;
      }

      rows.push({
        icon: label.slice(0, 1),
        label: this.normalizePaymentLabel(label),
        amount: isDiscount && /95/u.test(`${label}${value}`)
          ? '95折'
          : money.currency === 'USD'
            ? `${isDiscount ? '- ' : ''}${this.formatNumber(money.value)} 美元`
            : value,
        note: this.paymentNote(label, quoteSection, value),
        accent: isDiscount,
      });
    }

    const sectionText = this.cleanText(quoteSection.textContent ?? '');
    if (/95折/u.test(sectionText) && !rows.some((row) => row.label === '思达折扣')) {
      const preDiscount = rows
        .filter((row) => !row.accent)
        .reduce((total, row) => total + this.parseMoney(row.amount).value, 0);
      const discount = Math.max(0, preDiscount - finalTotal);
      rows.push({
        icon: '折',
        label: '思达折扣',
        amount: '95折',
        note: discount > 0
          ? `优惠金额：${this.formatNumber(discount)}美元`
          : '优惠金额已计入最终报价',
        accent: true,
      });
    }

    const activeDiscountRows = rows.filter((row) => row.accent && row.amount !== '95折');
    if (activeDiscountRows.length > 1) {
      const firstDiscountIndex = rows.findIndex((row) => row === activeDiscountRows[0]);
      const discountTotal = activeDiscountRows.reduce(
        (total, row) => total + this.parseMoney(row.amount).value,
        0,
      );
      const appliedLabels = activeDiscountRows.map((row) => row.label).join('、');
      const nonDiscountRows = rows.filter((row) => !activeDiscountRows.includes(row));
      nonDiscountRows.splice(firstDiscountIndex, 0, {
        icon: '惠',
        label: '优惠合计',
        amount: `- ${this.formatNumber(discountTotal)} 美元`,
        note: `${appliedLabels}已自动计入`,
        accent: true,
      });
      rows.splice(0, rows.length, ...nonDiscountRows);
    }

    if (rows.length === 0) {
      rows.push({
        icon: '费',
        label: '课程住宿费',
        amount: `${this.formatNumber(finalTotal)} 美元`,
        note: '已按当前课程、房型和学习周期计算',
      });
    }

    return rows.slice(0, 6);
  }

  private normalizePaymentLabel(label: string): string {
    if (/95折/u.test(label)) return '思达折扣';
    if (/注册.*优惠/u.test(label)) return '注册费优惠';
    if (/淡季.*优惠/u.test(label)) return '淡季优惠';
    if (/长期.*优惠/u.test(label)) return '长期学习优惠';
    if (/圣诞|节日/u.test(label)) return '节日优惠';
    if (/注册/u.test(label)) return '注册费';
    if (/课程住宿|课程.*食宿|套餐/u.test(label)) return '课程住宿费';
    if (/主费用/u.test(label)) return '课程住宿费';
    if (/课程/u.test(label)) return '课程费';
    if (/食宿|住宿/u.test(label)) return '住宿费';
    if (/旺季/u.test(label)) return '旺季附加费';
    if (/折扣|优惠/u.test(label)) return '思达折扣';
    return label.replace(/[：:]$/u, '').slice(0, 16);
  }

  private paymentNote(label: string, quoteSection: HTMLElement, value: string): string {
    if (/折扣|优惠/u.test(label)) return /95/u.test(`${label}${value}`) ? '优惠金额已计入最终报价' : value;
    if (/注册/u.test(label)) return '一次性学校注册费';
    if (/课程/u.test(label) && !/住宿|食宿|套餐/u.test(label)) {
      return this.extractSelectedOption(quoteSection, '课程') || '按当前选择计算';
    }
    if (/住宿|房型|食宿/u.test(label)) {
      return this.extractSelectedOption(quoteSection, '房型') || '按当前选择计算';
    }
    if (/旺季/u.test(label)) return '已按当前入学日期和学习周期计算';
    return '按当前选择计算';
  }

  private extractSelectedOption(quoteSection: HTMLElement, fieldLabel: string): string {
    const select = Array.from(quoteSection.querySelectorAll<HTMLSelectElement>('select')).find((item) =>
      this.cleanText(item.closest('label')?.textContent ?? '').startsWith(fieldLabel),
    );
    return this.cleanText(select?.selectedOptions[0]?.textContent ?? '');
  }

  private extractLocalFees(weeks: number): {
    items: QuoteImageLocalFeeItem[];
    optionalItems: Array<{ label: string; amount: string; note: string }>;
    total: number;
  } {
    const allGrids = Array.from(document.querySelectorAll<HTMLElement>('.local-fee-grid'));
    const grid = allGrids.find((item) => !item.closest('details')) ?? allGrids[0];
    const localFeeContainer = grid ?? document.querySelector<HTMLElement>('#local-fees');

    const rawRows = Array.from(
      localFeeContainer?.querySelectorAll<HTMLElement>('article') ?? [],
    )
      .map((article) => ({
        label: this.cleanText(
          article.querySelector<HTMLElement>('span, h3')?.textContent ?? '',
        ),
        unit: this.cleanText(article.querySelector<HTMLElement>('strong')?.textContent ?? ''),
        note: this.cleanText(article.querySelector<HTMLElement>('p')?.textContent ?? ''),
        optional: article.dataset['optional'] === 'true',
        quantity: article.dataset['quantity'] === undefined ? Number.NaN : Number(article.dataset['quantity']),
        total: article.dataset['total'] === undefined ? Number.NaN : Number(article.dataset['total']),
      }))
      .filter((row) => row.label && row.unit);

    if (rawRows.length === 0) {
      return {
        items: [
          { label: 'SSP学习许可', unit: '待确认', quantity: '—', amount: '待确认', note: '按学校最新当地费用清单核算。' },
          { label: '证件及身份卡', unit: '待确认', quantity: '—', amount: '待确认', note: '是否办理取决于学习周期及签证政策。' },
          { label: '签证及续签', unit: '待确认', quantity: '—', amount: '待确认', note: '按学习周期和最新移民政策核算。' },
          { label: '教材水电及管理', unit: '待确认', quantity: '—', amount: '待确认', note: '以学校实际使用及现场收费为准。' },
        ],
        optionalItems: [],
        total: 0,
      };
    }

    const hasExplicitOptionalState = rawRows.some((row) => row.optional || Number.isFinite(row.quantity));
    const optionalRows = rawRows.filter((row) => hasExplicitOptionalState ? row.optional : /接机|押金/u.test(row.label));
    const includedRows = rawRows.filter((row) => hasExplicitOptionalState ? !row.optional : !/接机|押金/u.test(row.label));
    let total = 0;
    const items = includedRows.slice(0, 10).map((row) => {
      const amount = Number.isFinite(row.total) ? row.total : this.calculateLocalFeeAmount(row.label, row.unit, row.note, weeks);
      const quantity = Number.isFinite(row.quantity) ? row.quantity : amount > 0 ? 1 : 0;
      total += amount;
      return {
        label: row.label,
        unit: row.unit,
        quantity: `${quantity}`,
        amount: amount > 0 ? `₱${Math.round(amount).toLocaleString('en-US')}` : '₱0',
        note: this.shortenLocalFeeNote(row.note),
      };
    });

    return {
      items,
      total,
      optionalItems: optionalRows.slice(0, 2).map((row) => ({
        label: row.label,
        amount: row.unit,
        note: row.note || '按需选择，不计入学杂费合计。',
      })),
    };
  }

  private calculateLocalFeeAmount(label: string, unit: string, note: string, weeks: number): number {
    const source = `${unit} ${note}`;
    const baseAmount = this.parseMoney(source).currency === 'PHP'
      ? this.parseMoney(source).value
      : /[₱₱]|PHP|比索/iu.test(source)
        ? this.parseFirstNumber(source)
        : 0;
    if (baseAmount <= 0) return 0;

    if (/ACR[ -]?I|外国人身份证/iu.test(label) && weeks <= 4) return 0;
    if (/签证续签|续签费/u.test(label)) {
      if (weeks <= 8) return 0;
      const amounts = this.extractNumbers(source).filter((value) => value >= 500);
      const firstRenewal = amounts[0] || baseAmount;
      const laterRenewal = amounts[1] || firstRenewal;
      return firstRenewal + Math.max(0, Math.ceil((weeks - 12) / 4)) * laterRenewal;
    }

    const perWeeksMatch = source.match(/\/\s*(\d+)\s*周/u);
    if (perWeeksMatch) {
      const period = Number(perWeeksMatch[1]);
      return baseAmount * Math.max(1, Math.ceil(weeks / period));
    }
    if (/\/\s*周|每周/u.test(source)) return baseAmount * weeks;
    if (/\/\s*月|每月/u.test(source)) return baseAmount * Math.max(1, Math.ceil(weeks / 4));
    if (/教材/u.test(label)) return baseAmount * Math.max(1, Math.ceil(weeks / 8));
    return baseAmount;
  }

  private shortenLocalFeeNote(note: string): string {
    if (!note) return '以学校及相关部门实际收取为准。';
    return note
      .replace(/最终以学校实际收取为准[。.]?/gu, '')
      .replace(/具体以学校[^。；;]*[。；;]?/gu, '')
      .trim()
      .slice(0, 74) || '以学校及相关部门实际收取为准。';
  }

  private extractHeroSource(): string {
    const candidates = Array.from(document.querySelectorAll<HTMLImageElement>('main img'))
      .filter((image) => {
        const source = image.currentSrc || image.src;
        const box = image.getBoundingClientRect();
        const isSameOrigin = (() => {
          try {
            return new URL(source, window.location.href).origin === window.location.origin;
          } catch {
            return false;
          }
        })();
        return isSameOrigin && !/logo|icon|qr|wechat|二维码/iu.test(`${source} ${image.alt}`) && box.width >= 240 && box.height >= 110;
      })
      .sort((left, right) => {
        const leftBox = left.getBoundingClientRect();
        const rightBox = right.getBoundingClientRect();
        return rightBox.width * rightBox.height - leftBox.width * leftBox.height;
      });
    return candidates[0]?.currentSrc || candidates[0]?.src || this.cityHeroFallback();
  }

  private cityHeroFallback(): string {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/baguio/')) return '/assets/philippines/baguio-study-hero.jpg';
    if (path.includes('/clark/')) return '/assets/philippines/clark-study-hero.jpg';
    if (path.includes('/manila/')) return '/assets/philippines/manila-study-hero.jpg';
    if (path.includes('/cebu/')) return '/assets/philippines/cebu-study-hero.jpg';
    return '/assets/study-hero-collage.png';
  }

  private findQuoteTotalElement(quoteSection: HTMLElement): HTMLElement | null {
    const directResult = quoteSection.querySelector<HTMLElement>('.quote-result strong');
    if (directResult) {
      return directResult;
    }

    const breakdownRows = Array.from(
      quoteSection.querySelectorAll<HTMLElement>('.quote-breakdown > div, .quote-breakdown > article'),
    );
    const totalPatterns = [/预计USD合计/u, /预计.*合计/u, /前期支付参考/u, /预计主费用/u, /预计USD套餐价/u];
    for (const pattern of totalPatterns) {
      const row = breakdownRows.find((item) =>
        pattern.test(this.cleanText(item.querySelector<HTMLElement>('span')?.textContent ?? '')),
      );
      const value = row?.querySelector<HTMLElement>('strong') ?? null;
      if (value && this.parseMoney(value.textContent ?? '').currency === 'USD') {
        return value;
      }
    }
    return null;
  }

  private parseMoney(text: string): ParsedMoney {
    const normalized = this.cleanText(text).replace(/,/g, '');
    const value = this.parseFirstNumber(normalized);
    if (/USD|美元/iu.test(normalized)) return { value, currency: 'USD' };
    if (/PHP|比索|₱/iu.test(normalized)) return { value, currency: 'PHP' };
    return { value, currency: null };
  }

  private parseFirstNumber(text: string): number {
    const match = text.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/u);
    return match ? Math.abs(Number(match[0])) : 0;
  }

  private extractNumbers(text: string): number[] {
    return Array.from(text.replace(/,/g, '').matchAll(/\d+(?:\.\d+)?/gu), (match) => Number(match[0]));
  }

  private formatNumber(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  private cleanText(value: string): string {
    return value.replace(/\s+/gu, ' ').trim();
  }
}
