// Text and data that the two GITC campus pages share (programs, rules, refunds, offers and FAQ), from GITC's 2026 and
// 2027 brochures and the 2026 orientation guides (docs/gitc-source-2026-11-26.md). Campus-only text is in
// gitc-iloilo-page-content.ts and gitc-cebu-page-content.ts. Keep it pure data (no Angular, DOM or storage). Never add
// the school's phone, e-mail, website, street address, messenger accounts or any agency term.
import type { CampusPracticalGuide, CourseDetailGuide, DailyScheduleRow, FaqItem } from '../cia-school/cia-page-content';
import type { PhOfferCard, PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import type { GitcCampus } from './gitc-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const GITC_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

/** Score guarantee tables and the other programs both campuses run (2027 brochure, pages 10–19). */
export const GITC_PROGRAM_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '托业保分（TOEIC Guarantee）',
    subtitle: '最低报名12周，按入学分数和周数保分',
    facts: [
      { label: '零基础入学', value: '24周：LC+RC 550分以上，或托业口语 IL 以上' },
      { label: '400分起入学', value: '12周：650分以上（口语 IM1）；16周：750分以上（口语 IM3）' },
      { label: '500分起入学', value: '12周：750分以上（口语 IM3）；20周：850分以上（口语 AL）；24周：950分以上（口语 AM）' },
    ],
    points: [
      '保分条件（学校规定）：出勤100%（病假等正当理由除外）、完成全部作业、遵守校规、每天课后夜间自习、每月最后一个周五参加月考。',
      '满足全部条件仍未达到保证分数时，学校免学费继续上课直到达到目标分数；考试费由学生自付，到外地考试的交通和住宿自理；回国考试30天内未返校的，保分条件失效。',
    ],
    notice: '具体分数要求以学校书面保分规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'workspace_premium',
    title: '雅思保分（IELTS Guarantee）',
    subtitle: '最低报名12周，Iloilo校区可参加官方考试',
    facts: [
      { label: '零基础入学', value: '24周：6.0分以上' },
      { label: '4.0分起入学', value: '12周：5.5分以上' },
      { label: '5.0分起入学', value: '12周：6.0分以上；20周：6.5分以上；24周：7.0分以上' },
    ],
    points: [
      '保分条件与托业保分相同：全勤、完成作业、遵守校规、每天夜间自习和每月月考；考试费由学生自付。',
      '官方雅思考试可在GITC Iloilo校区（IDP雅思官方考点）参加。',
    ],
    notice: '具体分数要求以学校书面保分规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'add_circle',
    title: '加课与周末外出课',
    subtitle: '自愿报名，另付费',
    facts: [
      { label: '加一对一', value: '每天加1节一对一：每4周150美元' },
      { label: '周末外出课', value: '和老师一起逛街、城市观光并练英语：每4小时1,000比索，在学校办公室申请和付款' },
    ],
    points: ['老师的空档以学校安排为准；学生不能和老师私下交易。'],
  },
  {
    icon: 'laptop_chromebook',
    title: '免费线上英语课',
    subtitle: '学校提供，学习期间',
    facts: [
      { label: '安排', value: '学习期间每周2次，每次25分钟（每4周8次）' },
      { label: '用法', value: '可用于出发前预习或回国后复习；也可以转给家人使用' },
    ],
    points: [],
  },
  {
    icon: 'school',
    title: 'TESOL 课程',
    subtitle: '和语言课同时进行',
    facts: [
      { label: '方式', value: '与西米沙鄢州立大学（West Visayas State University）合作，周末线上40节' },
      { label: '时长和费用', value: '4周以上；12,000比索（以学校当期价格为准）' },
    ],
    points: ['具体课表按大学的学期安排。'],
  },
];

/** Family and junior camps (2027 brochure pages 15–17); seasonal programs quoted by the adviser, not by the calculator. */
export const GITC_CAMP_GUIDE: CourseDetailGuide = {
  icon: 'family_restroom',
  title: '亲子课程与青少年营地',
  subtitle: '季节性项目，报价向顾问索取',
  facts: [
    { label: '亲子课程', value: '孩子每天4节一对一 + 2节小组课 + 2节活动，家长每天2节一对一 + 1节小组课；1名孩子 + 1名家长每4周：Cebu 3,500美元、Iloilo 2,500美元' },
    { label: '青少年营地', value: '暑期（6–8月）和寒假（12–1月）；每天4节一对一 + 2节小组课 + 2节活动；每4周：Cebu 2,600美元、Iloilo 2,300美元' },
    { label: '营地住宿', value: '3名学生和1名老师同住一间；异性学生不能进入彼此房间' },
  ],
  points: ['营地价格包含课程、住宿、教材、活动和SSP；机票、保险等不含。日期、名额和每周活动以学校当期方案为准。'],
};

/** The rules both campuses share (orientation guides 2026-07-16, 2027 brochure pages 28 and 39). */
export const GITC_RULES_GUIDE: CampusPracticalGuide = {
  icon: 'rule',
  eyebrow: 'SCHOOL RULES',
  title: '学习与生活规定',
  facts: [
    { label: '夜间自习', value: '周日至周四19:00–21:00；保分课程必修，其他课程自选' },
    { label: '门禁', value: '自习日（周日至周四）21:00后不能外出；周五、周六和假日前一天可外出或外宿，须提交行程' },
    { label: '月考', value: '每月最后一个周五（托业／雅思模考、面试和写作）；不参加不发结业证书' },
    { label: '上课', value: '每节45分钟，迟到20分钟以上算缺课；每4周最多申请2次换课或换老师' },
    { label: '演讲', value: '回国前须完成一次至少3分钟的英语演讲，学校录像后发给学生' },
    { label: '保险', value: '须购买保险后才能入学' },
  ],
  note: '宿舍内禁止饮酒和吸烟；损坏物品从押金扣除。以学校当期规定为准。',
};

/** The school's refund rules after arrival plus 思达启航's own deposit rule (user rule 2026-11-24). */
export const GITC_REFUND_COPY = {
  summaryTitle: 'GITC 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后退款和不退款的情况',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'GITC 取消与退款规定',
  intro: '到校后因个人原因取消，按已过去的学习时间计算退款；退款在学生回国后办理。',
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
      note: '',
      rules: [
        { when: '4周及以下', text: '报名4周及以下的课程和优惠课程，到校后不退款。' },
        { when: '已过不到30%', text: '退剩余期间学费的50%。' },
        { when: '已过30%以上', text: '不退款。' },
        { when: '学校原因', text: '因学校原因无法继续，退还剩余费用的100%。' },
        { when: '办理时间', text: '退款在学生回国后办理；其他细节按报名协议。' },
      ],
      footnote: '',
    },
    {
      title: '不退款的情况',
      note: '',
      rules: [
        { when: '被退学', text: '因个人原因被遣返或被退学，不退款。' },
        { when: '不可抗力', text: '天灾、疫情等原因无法上课，不退款。' },
      ],
      footnote: GITC_REFERENCE_NOTE,
    },
  ],
};

/** School programs shown above the quote (no promotionIds: they are standing programs, not discounts). */
export function gitcOffers(campus: GitcCampus): PhOfferCard[] {
  const other = campus === 'iloilo' ? 'Cebu' : 'Iloilo';
  return [
    {
      icon: 'swap_horiz', title: '两校区体验', amount: `${other}校区1周免费`,
      text: `在本校区报名并读满12周以上，可到${other}校区免费上1周课并住1周（学校的多校区项目）。`,
      detail: '机票自理；两校区之间的接送免费；Iloilo住两居室里的一间',
    },
    { icon: 'laptop_chromebook', title: '免费线上课', amount: '每周2次 × 25分钟', text: '学习期间学校提供线上英语课，可用于出发前预习或回国后复习。' },
  ];
}

/** FAQ lines both campuses share; campus pages put their own questions first. */
export const GITC_SHARED_FAQS: FaqItem[] = [
  { question: '2027年价格什么时候开始？', answer: '2027/02/15（周一）起开课的学生按2027年价格，也就是2027/02/14周日及以后入住；之前开课按2026年价格。报价器会按你选的入学日期自动判断。' },
  { question: '1–3周可以报吗？', answer: '可以。1周按4周价的40%、2周75%、3周90%计算，4周以上按周数计算；保分课程最低12周。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费100美元、课程费和住宿费（含三餐）；到校学杂费单独列出，押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const GITC_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和价格', '签证与入境协助'];

/** Everything one campus page adds to the shared parts above; gitc-page-profile.ts turns it into the profile. */
export interface GitcCampusPageContent {
  campus: GitcCampus;
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
  };
  quickInfo: ReadonlyArray<{ icon: string; title: string; text: string }>;
  overviewFacts: ReadonlyArray<{ icon: string; label: string; value: string }>;
  basicInfo: ReadonlyArray<{ label: string; value: string }>;
  suitableFor: readonly string[];
  notSuitableFor: readonly string[];
  campusAreas: ReadonlyArray<{ code: string; title: string; icon: string; facilities: string[] }>;
  galleryImages: ReadonlyArray<{ category: '校园' | '教室' | '住宿' | '餐厅' | '设施'; title: string; description: string; src: string }>;
  albumDescriptions: Readonly<Record<'校园' | '教室' | '住宿' | '餐厅' | '设施', string>>;
  roomProfiles: readonly PhRoomProfile[];
  roomGroupNotes: Readonly<Record<string, string>>;
  dormRules: ReadonlyArray<{ title: string; text: string }>;
  schedule: readonly DailyScheduleRow[];
  /** Time prefix of the first afternoon row; the timetable is shown as morning and afternoon columns. */
  afternoonFrom: string;
  courseGroups: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }>;
  practicalGuides: readonly CampusPracticalGuide[];
  faqs: readonly FaqItem[];
}

/** The daily reference timetable both campuses print (以学校实际安排为准). */
export const gitcSchedule = (shuttle: string): DailyScheduleRow[] => [
  { time: '07:00–08:00', activity: `早餐；${shuttle}`, kind: 'meal' },
  { time: '08:00–12:25', activity: '第1–5节（每节45分钟，课间10分钟；一对一或小组课按个人课表，空堂可自习）', kind: 'class' },
  { time: '12:25–13:25', activity: '午餐', kind: 'meal' },
  { time: '13:25–16:55', activity: '第6–9节（一对一或小组课按个人课表）', kind: 'class' },
  { time: '16:55–19:00', activity: '晚餐和休息', kind: 'meal' },
  { time: '19:00–21:00', activity: '夜间自习（周日至周四；保分课程必修）', kind: 'activity' },
  { time: '21:00', activity: '门禁（自习日）', kind: 'free' },
];
