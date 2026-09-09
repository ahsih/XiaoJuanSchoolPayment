import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import {
  TARGET_COURSES,
  TARGET_QUOTE_WEEK_OPTIONS,
  TARGET_ROOMS,
  TargetCourseId,
  TargetRoomId,
  targetCampaignRate,
  targetCourse,
  targetPackageSegmentPrice,
  targetRoom,
} from './target-pricing';

export type TargetVisaType = 'tourist30' | 'tourist59';
export type TargetUpgradeChoice = 'final-course-upgrade' | 'weekend-trips';

export interface TargetPackageRow {
  id: number;
  courseId: TargetCourseId;
  roomId: TargetRoomId;
  weeks: number;
  startDate: string;
}

const DAY = 86_400_000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const localToday = () => localDate(new Date());
const nextSunday = () => {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return localDate(date);
};

const VISA_CUMULATIVE_FEES = [0, 5140, 11550, 15990, 20430, 24870] as const;

export class TargetStudentQuote {
  selectedRegistrationDate = localToday();
  visaType: TargetVisaType = 'tourist59';
  pickupRequested = false;
  upgradeChoice: TargetUpgradeChoice = 'final-course-upgrade';
  readonly weekOptions = TARGET_QUOTE_WEEK_OPTIONS;
  packages: TargetPackageRow[] = [{ id: 1, courseId: 'target4', roomId: 'six', weeks: 4, startDate: nextSunday() }];
  private nextId = 2;

  date(value: string): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parsed = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value ? parsed : null;
  }

  end(row: TargetPackageRow): string {
    const start = this.date(row.startDate);
    return start === null ? '' : new Date(start + (row.weeks * 7 - 1) * DAY).toISOString().slice(0, 10);
  }

  get packageWeeks(): number { return this.packages.reduce((sum, row) => sum + Number(row.weeks || 0), 0); }
  get startDate(): string { return this.packages.map((row) => row.startDate).filter((value) => this.date(value) !== null).sort()[0] ?? ''; }
  get endDate(): string { return this.packages.map((row) => this.end(row)).filter(Boolean).sort().at(-1) ?? ''; }
  get stayDays(): number {
    const start = this.date(this.startDate);
    const end = this.date(this.endDate);
    return start === null || end === null ? 0 : Math.floor((end - start) / DAY) + 1;
  }
  get stayWeeks(): number { return Math.ceil(this.stayDays / 7); }

  private occupiedDays(): Set<number> {
    const days = new Set<number>();
    for (const row of this.packages) {
      const start = this.date(row.startDate);
      if (start === null || !Number.isInteger(row.weeks) || row.weeks < 1 || row.weeks > 52) continue;
      for (let offset = 0; offset < row.weeks * 7; offset += 1) days.add(start + offset * DAY);
    }
    return days;
  }

  get quoteError(): string {
    if (!this.packages.length) return '请至少选择一项课程＋房型套餐。';
    if (this.packages.some((row) => !TARGET_COURSES.some((course) => course.id === row.courseId))) return '请重新选择有效课程。';
    if (this.packages.some((row) => !TARGET_ROOMS.some((room) => room.id === row.roomId))) return '请重新选择有效房型。';
    if (this.packages.some((row) => !Number.isInteger(row.weeks) || row.weeks < 1 || row.weeks > 52)) return '每段套餐请选择1–52个完整周。';
    if (this.packages.some((row) => this.date(row.startDate) === null || new Date(this.date(row.startDate)!).getUTCDay() !== 0)) return '套餐开始日期请选择周日。';
    if (this.occupiedDays().size !== this.packageWeeks * 7) return '套餐日期有重叠，请调整后再保存报价。';
    if (this.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!['tourist30', 'tourist59'].includes(this.visaType)) return '请选择30天或59天初始旅游签证。';
    if (this.packages.some((row) => row.courseId === 'ielts-guarantee' && row.weeks !== 12)) return 'IELTS Guarantee请按12周完整方案选择。';
    return '';
  }

  get warning(): string {
    return !this.quoteError && this.stayWeeks > this.packageWeeks
      ? '套餐日期之间存在空档；签证按包含空档的完整停留跨度估算，空档期间住宿及生活安排需另行确认。'
      : '';
  }

  canAddPackage(): boolean { return true; }

  addPackage(): void {
    if (!this.canAddPackage()) return;
    const last = [...this.packages].sort((a, b) => this.end(a).localeCompare(this.end(b))).at(-1)!;
    const lastEnd = this.date(this.end(last));
    this.packages.push({
      id: this.nextId++,
      courseId: last.courseId,
      roomId: last.roomId,
      weeks: 4,
      startDate: lastEnd === null ? last.startDate : new Date(lastEnd + DAY).toISOString().slice(0, 10),
    });
  }

  removePackage(id: number): void {
    if (this.packages.length <= 1) return;
    const index = this.packages.findIndex((row) => row.id === id);
    if (index >= 0) this.packages.splice(index, 1);
  }

  packagePrice(row: TargetPackageRow): number {
    return rounded(targetPackageSegmentPrice(row.courseId, row.roomId, this.packageWeeks, row.weeks));
  }

  get packageTotal(): number { return rounded(this.packages.reduce((sum, row) => sum + this.packagePrice(row), 0)); }
  get registrationFee(): number { return 150; }

  private weekStarts(): number[] {
    const starts: number[] = [];
    for (const row of this.packages) {
      const start = this.date(row.startDate);
      if (start === null) continue;
      for (let week = 0; week < row.weeks; week += 1) starts.push(start + week * 7 * DAY);
    }
    return starts;
  }

  private isPeakWeek(weekStart: number): boolean {
    const ranges = [
      ['2026-06-28', '2026-08-22'],
      ['2027-06-27', '2027-08-21'],
    ] as const;
    return ranges.some(([from, to]) => {
      const start = this.date(from)!;
      const end = this.date(to)!;
      return weekStart <= end && weekStart + 6 * DAY >= start;
    });
  }

  get campaignRate(): number { return targetCampaignRate(this.packageWeeks); }
  get peakWeeks(): number { return this.weekStarts().filter((week) => this.isPeakWeek(week)).length; }
  get campaignEligibleWeeks(): number { return this.campaignRate ? Math.max(0, this.packageWeeks - this.peakWeeks) : 0; }
  get campaignDiscount(): number { return rounded(this.campaignEligibleWeeks * this.campaignRate); }
  get sidaDiscountBase(): number { return Math.max(0, rounded(this.packageTotal - this.campaignDiscount)); }
  get sidaDiscount(): number { return rounded(this.sidaDiscountBase * 0.1); }
  get quoteUsd(): number { return Math.max(0, rounded(this.registrationFee + this.packageTotal - this.campaignDiscount - this.sidaDiscount)); }

  get primaryPackage(): TargetPackageRow {
    return [...this.packages].sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  }

  get courseUpgradeLabel(): string {
    const upgrades: Partial<Record<TargetCourseId, string>> = {
      target4: 'TARGET 4 → TARGET 5',
      target5: 'TARGET 5 → TARGET 6',
      target6: 'TARGET 6 → ULTIMATE 8或符合等级要求的IELTS',
    };
    return upgrades[this.primaryPackage.courseId] ?? '';
  }

  get roomUpgradeLabel(): string {
    const upgrades: Partial<Record<TargetRoomId, string>> = {
      six: '六人房 → 四人房',
      quad: '四人房 → 三人房',
      triple: '三人房 → 双人房',
      twin: '双人房 → 单人房',
    };
    return upgrades[this.primaryPackage.roomId] ?? '当前选择为单人房，无更高房型可自动推定';
  }

  get upgradeDurationEligible(): boolean {
    return this.packageWeeks === 4 || this.packageWeeks === 8 || this.packageWeeks >= 12;
  }

  get upgradeDateEligible(): boolean {
    const registration = this.date(this.selectedRegistrationDate);
    const start = this.date(this.startDate);
    return registration !== null && start !== null
      && registration <= this.date('2026-11-30')!
      && start >= this.date('2026-08-23')!
      && start <= this.date('2027-01-01')!;
  }

  get upgradeEligible(): boolean {
    return this.upgradeDurationEligible && this.upgradeDateEligible && !!this.courseUpgradeLabel;
  }

  get upgradeBenefitText(): string {
    if (!this.upgradeEligible) return '';
    const course = `免费升级一档课程（${this.courseUpgradeLabel}）`;
    if (this.packageWeeks === 4) return course;
    const room = `免费升级一档房型（${this.roomUpgradeLabel}，以实际空位为准）`;
    if (this.packageWeeks === 8) return `${course}；${room}`;
    const choice = this.upgradeChoice === 'weekend-trips'
      ? '另选免费参加2次TARGET周末活动'
      : '另选最后4周免费升级为ULTIMATE 8或符合等级要求的IELTS';
    return `${course}；${room}；${choice}`;
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...(this.campaignDiscount ? [{
        icon: '惠', label: '学校现金优惠', value: -this.campaignDiscount,
        note: `${this.packageWeeks}周按每个非旺季学习周${this.campaignRate}美元计算：${this.campaignEligibleWeeks}周符合，共减${this.campaignDiscount}美元；${this.peakWeeks}个旺季重叠周不参与。`,
        promotionKey: 'target-campaign',
      }] : []),
      {
        icon: '思', label: '思达启航9折', value: -this.sidaDiscount,
        note: `学校现金优惠后剩余套餐金额${this.sidaDiscountBase.toLocaleString('en-US', { maximumFractionDigits: 2 })}美元打9折；注册费和比索学杂费不参与。`,
        promotionKey: 'sida-90-percent',
      },
    ];
  }

  get statusLines(): QuoteImagePaymentItem[] {
    const campaignStatus: QuoteImagePaymentItem[] = this.campaignDiscount ? [] : [{
      icon: '惠', label: '学校现金优惠', amount: '未减免',
      note: this.campaignRate === 0
        ? '1–2周不在学校现金优惠档位；3周每周减20美元、4–11周每周减30美元、12周及以上每周减35美元。'
        : `所选${this.packageWeeks}周全部与学校旺季重叠，因此当前没有现金减免。`,
    }];
    const upgradeStatus: QuoteImagePaymentItem = this.upgradeEligible
      ? {
          icon: '升', label: '限时尊享升级计划', amount: '符合条件', note: `${this.upgradeBenefitText}。报名截止2026/11/30，名额有限；等级、房型和最终资格由学校确认。`,
        }
      : {
          icon: '升', label: '限时尊享升级计划', amount: '当前未适用', note: '须在2026/11/30前报名，入学日在2026/8/23–2027/1/1内，选择4周、8周或12周及以上，并由TARGET 4、TARGET 5或TARGET 6按学校列明路径升级。',
        };
    return [...campaignStatus, upgradeStatus];
  }

  get visaLabel(): string { return this.visaType === 'tourist30' ? '30天初始旅游签证' : '59天初始旅游签证'; }
  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.stayDays - initialDays) / 30));
  }
  get visaExtensionTotal(): number {
    const listedExtensions = VISA_CUMULATIVE_FEES.length - 1;
    if (this.visaExtensionCount <= listedExtensions) return VISA_CUMULATIVE_FEES[this.visaExtensionCount];
    return VISA_CUMULATIVE_FEES[listedExtensions] + (this.visaExtensionCount - listedExtensions) * 4440;
  }
  get textbookTotal(): number {
    if (this.packageWeeks <= 0) return 0;
    if (this.packageWeeks === 1) return 500;
    if (this.packageWeeks === 2) return 1000;
    if (this.packageWeeks <= 4) return 2000;
    if (this.packageWeeks <= 8) return 3000;
    return 3000 + Math.ceil((this.packageWeeks - 8) / 4) * 1000;
  }

  get localFees(): SchoolLocalFee[] {
    const acrQuantity = this.stayWeeks >= 9 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800比索／次', quantity: 1, total: 7800, note: '由移民局收取，不论学习时长均需办理；转学时通常需要重新办理。' },
      { item: 'SSP E-CARD', unitLabel: '4,500比索／次', quantity: 1, total: 4500, note: '由移民局收取，入学时与SSP同时办理，只收一次。' },
      { item: 'ACR I-CARD外国人身份证', unitLabel: '4,300比索／次', quantity: acrQuantity, total: 4300 * acrQuantity, note: `按${this.visaLabel}和${this.stayWeeks}周完整停留跨度估算；学校费用页列明9周及以上需要办理。` },
      { item: '签证续签', unitLabel: '学校累计档位', quantity: this.visaExtensionCount, total: this.visaExtensionTotal, note: this.visaExtensionNote },
      { item: '教材费', unitLabel: '按学习周数', quantity: 1, total: this.textbookTotal, note: `按${this.packageWeeks}周估算：1周500、2周1,000、3–4周2,000、5–8周3,000比索，之后每增加4周加1,000比索；实际按购买教材为准。` },
      { item: '电费', unitLabel: '600比索／周', quantity: this.packageWeeks, total: 600 * this.packageWeeks, note: '每周基本费用；超过学校规定用量时会追加收费。' },
      { item: '水费', unitLabel: '200比索／周', quantity: this.packageWeeks, total: 200 * this.packageWeeks, note: '按套餐住宿周数计算。' },
      { item: '共益费', unitLabel: '500比索／周', quantity: this.packageWeeks, total: 500 * this.packageWeeks, note: '校园公共设施及维护费用，按套餐住宿周数计算。' },
    ];
  }

  get visaExtensionNote(): string {
    const base = `按${this.visaLabel}及${this.stayDays}天完整停留跨度估算；`;
    if (this.visaExtensionCount <= VISA_CUMULATIVE_FEES.length - 1) {
      return `${base}学校当前档位为首次5,140比索、两次累计11,550比索，之后按学校累计表计算。`;
    }
    return `${base}学校当前公布的累计表列至5次，超出部分暂按每次4,440比索估算，最终以学校实际收取为准。`;
  }
}
