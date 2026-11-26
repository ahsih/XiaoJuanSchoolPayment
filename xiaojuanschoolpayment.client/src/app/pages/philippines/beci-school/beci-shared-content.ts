// Text and data that the three BECI campus pages share (2027 holidays, BESA pickup, refund rules, all-campus programs,
// offers), from the school's 2027 info update (2026-11-25), its 2027 calendar and the 2027 BESA pickup calendar.
// Campus-only text is in beci-eop-page-content.ts, beci-city-page-content.ts and beci-sparta-page-content.ts.
// Keep it pure data (no Angular, DOM or storage). Never add the school's phone, address, website, social accounts or
// any agency term (commission, agency rules, agency-only offers).
import type { CampusPracticalGuide, CourseDetailGuide, DailyScheduleRow, FaqItem, HolidayCalendar } from '../cia-school/cia-page-content';
import type { PhOfferCard, PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import { BECI_PROMOTION_IDS, type BeciCampus } from './beci-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const BECI_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

/** BESA group pickup Sundays in 2027 (BECI's 2027 BESA calendar). */
export const BECI_BESA_PICKUP_2027 = [
  '1/10', '1/24', '2/7', '2/21', '3/7', '3/21', '4/4', '4/18', '5/2', '5/16', '5/30', '6/13', '6/27',
  '7/11', '7/25', '8/8', '8/22', '9/5', '9/19', '10/3', '10/17', '10/31', '11/14', '11/28', '12/12', '12/26',
];

/** The three all-campus programs and the Coffee ESL workshop (2027 info update, section 04). */
export const BECI_PROGRAM_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'record_voice_over',
    title: 'SP Program 口语诊断',
    subtitle: 'Speaking Prescription，所有校区',
    facts: [
      { label: '每周五', value: '录视频完成口语测试' },
      { label: '反馈', value: '老师检查口语内容，指出语法、发音、词汇和表达问题' },
      { label: '每月', value: '与SP教练一对一咨询学习情况和改进方向' },
    ],
    points: ['Sparta ESL、24 ESL 和 Junior ESL 每天有1节SP课，为必修，不可取消或替换。'],
  },
  {
    icon: 'public',
    title: 'LIVE ESL 主题式英语',
    subtitle: '适合 CEFR A2 及以上',
    facts: [
      { label: '话题', value: '电影、文化、旅行、K-POP、体育和世界新闻等' },
      { label: '方式', value: '每天围绕不同主题，做讨论、阅读、听力和表达练习' },
    ],
    points: [],
  },
  {
    icon: 'smart_toy',
    title: 'AI Coaching 口语辅导',
    subtitle: '课外自主练习',
    facts: [{ label: '方式', value: '按自己的水平与AI教练做口语交流，获得即时反馈，不受上课时间限制' }],
    points: [],
  },
  {
    icon: 'local_cafe',
    title: 'Coffee ESL 英语咖啡师',
    subtitle: '自愿报名，另付费',
    facts: [
      { label: '内容', value: '咖啡英语词汇、咖啡文化、冲煮方法、饮品制作和拉花' },
      { label: '时间', value: '4周，共4个周六' },
      { label: '费用', value: '8,000比索' },
      { label: '开班', value: '至少5人；结业发 TESDA Certificate' },
    ],
    points: ['适合计划在咖啡店工作、打工度假或海外就业的学生；开班时间以学校实际安排为准。'],
  },
];

/** BESA pickup and arrival, the same for all three campuses. */
export const BECI_ARRIVAL_GUIDE: CampusPracticalGuide = {
  icon: 'directions_bus',
  eyebrow: 'ARRIVAL',
  title: '入学与接机',
  facts: [
    { label: '入住', value: '周日入住，周一入学测试和说明会；课程结束后的周六中午前退房' },
    { label: 'BESA 团体接机', value: '马尼拉或克拉克机场，在指定周日统一接机，3,000比索' },
    { label: '马尼拉机场', value: '周日 01:00、08:00、14:00、20:00' },
    { label: '克拉克机场', value: '周日 12:00、17:00，周一 01:30' },
    { label: '2027年接机日', value: BECI_BESA_PICKUP_2027.join('、') },
  ],
  note: '接机时间和地点以学校当期通知为准；其他日期到校，交通请先和顾问确认。',
};

/** BECI's 2027 calendar: weekday holidays only (weekend ones do not take a class day). */
export const BECI_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节' },
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 5, holidays: [{ day: '17日', name: '宰牲节' }] },
      { month: 7, holidays: [{ day: '15日', name: '科迪勒拉日（地方假日）' }] },
      { month: 8, holidays: [{ day: '30日', name: '国家英雄日' }] },
      {
        month: 9,
        holidays: [
          { day: '1日', name: '碧瑶日（地方假日）' },
          { day: '13日', name: '和平协议纪念日（地方假日）' },
        ],
      },
      {
        month: 11,
        holidays: [
          { day: '1日', name: '诸圣节' },
          { day: '2日', name: '万灵节' },
          { day: '30日', name: '博尼法西奥日' },
        ],
      },
      {
        month: 12,
        holidays: [
          { day: '8日', name: '圣母无原罪瞻礼' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];

export const BECI_HOLIDAY_FOOTNOTE = '只列平日的假期；周末的假期（春节2/6、复活节前的周六3/27、劳动节5/1、独立日6/12、尼诺伊·阿基诺日8/21、圣诞节12/25）不占上课日。特别假日可能按菲律宾政府公告调整。学校每月一般提供至少18个上课日，不足时在周六或假日补课；天灾停课和个人原因缺课不补课。';

/**
 * The school's refund rules after arrival plus 思达启航's own deposit rule (user rule 2026-11-24). The school's
 * pre-departure cancellation penalties stay off the page.
 */
export const BECI_REFUND_COPY = {
  summaryTitle: 'BECI 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后退款和不退款的情况',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'BECI 取消与退款规定',
  intro: '到校后因个人原因取消，按剩余周数退还剩余学期费用的一部分；当地费用不退。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；临近入学改期或取消，学校可能收违约金，以学校确认为准。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '按剩余周数计算，不按提出申请的日期计算。',
      rules: [
        { when: '剩余8周以上', text: '退剩余学期费用的60%。' },
        { when: '剩余4–7周', text: '退剩余学期费用的50%。' },
        { when: '剩余不足4周', text: '不退款。' },
        { when: '申请与到账', text: '离校前一周以书面形式向学校申请；学校在课程结束4周后把退款汇入学员账户。' },
      ],
      footnote: '',
    },
    {
      title: '不退款的情况',
      note: '',
      rules: [
        { when: '晚到或缺课', text: '晚于开课日抵达或学习期间缺课，不退款，也不补课。' },
        { when: '当地费用', text: '到校缴纳的当地费用不退。' },
        { when: '转让和顺延', text: '学费和住宿费不能转让给他人，也不能顺延。' },
        { when: '被退学', text: '因违反校规被退学，学费和押金不退。' },
      ],
      footnote: BECI_REFERENCE_NOTE,
    },
  ],
};

/** Offer cards above the quote (PhOfferCard); a card hides from `until` or when none of its promotionIds is enabled. */
export function beciOffers(campus: BeciCampus): PhOfferCard[] {
  const sparta = campus === 'sparta';
  return [
    { icon: 'percent', title: '思达启航优惠', amount: '免注册费', text: '通过思达启航报名，每位学生免100美元注册费。', promotionIds: [BECI_PROMOTION_IDS.registration] },
    {
      icon: 'eco', title: '淡季九折', amount: '学费和住宿费9折', text: '2026/09/06–12/27入学，整个报名期间的学费和住宿费9折。',
      until: '2026-12-28', promotionIds: [BECI_PROMOTION_IDS.offSeason2026Second],
    },
    ...(sparta ? [] : [{
      icon: 'eco', title: '2027淡季九折', amount: '学费和住宿费9折',
      text: '2027/02/07–06/13或09/05–12/26入学，整个报名期间的学费和住宿费9折；按入学日判断，入学日不在期间内则不适用。',
      detail: 'EOP、City校区适用，Sparta校区不适用', until: '2027-12-27',
      promotionIds: [BECI_PROMOTION_IDS.offSeason2027First, BECI_PROMOTION_IDS.offSeason2027Second],
    }]),
    {
      icon: 'event_available', title: '长期学习优惠', amount: '最高减400美元', text: sparta ? '按课程周数减免。' : '按课程周数减免，可与淡季九折同时使用。',
      detail: '8周减50 · 12周100 · 16周200 · 20周300 · 24周400美元', promotionIds: [BECI_PROMOTION_IDS.longStay],
    },
    {
      icon: 'wb_sunny', title: '早鸟优惠', amount: '免2027暑期旺季附加费', text: '2026/11/30及之前确认报名，2027/06/27–08/21的旺季附加费全免（原每周60美元）。',
      until: '2026-12-01', promotionIds: [BECI_PROMOTION_IDS.earlyBird],
    },
    ...(sparta ? [] : [{
      icon: 'history', title: '2026年内报名按2026年价格', amount: '报名截至2026/12/31',
      text: campus === 'eop'
        ? '2026/12/31及之前报名，Mansion Master Single 按2026年价格每4周1,100美元；2027/01/01起报名为1,150美元。'
        : '2026/12/31及之前报名，Native ESL、Unlimited ESL 每4周900美元，Semi Master Single 1,050美元，Semi Regular Single 900美元；2027/01/01起报名按2027年价格。',
      until: '2027-01-01',
    }]),
  ];
}

/** FAQ lines every campus shares; campus pages put their own questions first. */
export const BECI_SHARED_FAQS: FaqItem[] = [
  { question: '暑期旺季要加钱吗？', answer: '要。2027/06/27–08/21期间每个学习周加60美元（2026年为每周40美元），附加费不打折；2026/11/30及之前确认报名的学生，2027年暑期附加费全免。' },
  { question: '1–3周可以报吗？', answer: '可以。1周按4周价的40%、2周60%、3周80%计算，4周以上按周数计算；雅思保分班最低12周，不适用短期价格。' },
  { question: '到校要交哪些费用？', answer: 'SSP特殊学习许可7,800比索、SSP E-Card 4,500比索、学生证200比索，每4周水电费3,000、维护费1,000、洗衣费1,500比索，教材每4周1,000–2,000比索；停留超过59天另付ACR I-Card 4,000比索和签证延期费，押金3,000比索离校前退还。报价器会按你的签证和周数逐项算出来。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const BECI_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

/**
 * A clip in public/assets/beci-<campus>/videos/ (720p H.264 with a jpg poster), from the school's Drive pack. Every
 * clip was checked at its opening and ending and sampled throughout: no contact details, street address or other
 * company (the Sparta film's opening address card and the City film's night street scene were cut).
 */
export interface BeciVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  topic: string;
}

/** Everything one campus page adds to the shared parts above; beci-page-profile.ts turns it into the profile. */
export interface BeciCampusPageContent {
  campus: BeciCampus;
  text: {
    breadcrumb: string;
    heroTitle: string;
    heroLead: string;
    heroTags: ReadonlyArray<{ icon: string; text: string }>;
    overviewTitle: string;
    advisorTitle: string;
    advisorText: string;
    campusTitle: string;
    campusIntro: string;
    galleryTitle: string;
    galleryIntro: string;
    coursesTitle: string;
    coursesIntro: string;
    detailHint: string;
    scheduleTitle: string;
    scheduleIntro: string;
    scheduleBadge: string;
    roomsPhotoIntro: string;
    finalCtaTitle: string;
    finalCtaText: string;
    quoteLabel: string;
    compareRoomHint: string;
    compareCourseHint: string;
  };
  quickInfo: ReadonlyArray<{ icon: string; title: string; text: string }>;
  overviewFacts: ReadonlyArray<{ icon: string; label: string; value: string }>;
  basicInfo: ReadonlyArray<{ label: string; value: string }>;
  suitableFor: readonly string[];
  notSuitableFor: readonly string[];
  campusAreas: ReadonlyArray<{ code: string; title: string; icon: string; facilities: string[] }>;
  galleryImages: ReadonlyArray<{ category: '校园' | '教室' | '住宿' | '餐厅' | '设施'; title: string; description: string; src: string }>;
  albumDescriptions: Readonly<Record<'校园' | '教室' | '住宿' | '餐厅' | '设施', string>>;
  videos: readonly BeciVideo[];
  /** Room profile id → name of a video showing exactly that room type. */
  roomVideoNames: Readonly<Record<string, string>>;
  roomProfiles: readonly PhRoomProfile[];
  roomGroupNotes: Readonly<Record<string, string>>;
  dormRules: ReadonlyArray<{ title: string; text: string }>;
  schedule: readonly DailyScheduleRow[];
  /** Time prefix of the first afternoon row; the timetable is shown as morning and afternoon columns. */
  afternoonFrom: string;
  courseGroups: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }>;
  courseDetailGuides: readonly CourseDetailGuide[];
  practicalGuides: readonly CampusPracticalGuide[];
  faqs: readonly FaqItem[];
}
