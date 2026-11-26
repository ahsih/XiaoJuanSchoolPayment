// Static text and data of the Canadian Education College (Singapore) page. Pure data (no Angular, DOM or
// `this`), so the WeChat mini program can reuse it later. Every course fact comes from the school's own
// posters and term calendar that the user forwarded on 2026-11-23 (kids winter camp 2026-2027, IELTS
// preparation, beginner Certificate in English, the full-time term table, and the course posters on the
// school's wall); nothing is inferred. Never add the school's phone, e-mail, WhatsApp, website, QR code or
// street address: students enrol through 思达启航 (user decision 2026-11-19).
import { SCHOOL_REFERENCE_NOTE } from '../../../philippines/school-page/school-reference-note';

export interface CecPhoto {
  title: string;
  description: string;
  src: string;
  /** CSS object-position for the 4:3 gallery crop of portrait photos. */
  position?: string;
}

export interface CecVideo {
  title: string;
  description: string;
  duration: string;
  src: string;
  poster: string;
  vertical: boolean;
}

export interface CecTerm {
  name: string;
  /** ISO dates; a row is hidden once its end date has passed. */
  start: string;
  end: string;
  dates: string;
  test: string;
  isBreak?: boolean;
}

export interface CecCampFee {
  label: string;
  /** Singapore dollars. */
  amount: number;
  unit: string;
  note?: string;
}

const asset = (name: string) => `/assets/canadian-education-sg/${name}.webp`;
const video = (name: string) => ({
  src: `/assets/canadian-education-sg/videos/${name}.mp4`,
  poster: `/assets/canadian-education-sg/videos/poster-${name}.jpg`,
});

export const CEC_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const CEC_PAGE_COPY = {
  breadcrumb: '海外游学 / 新加坡游学 / 加拿大教育学院',
  title: '新加坡加拿大教育学院',
  englishName: 'Canadian Education College',
  lead: '加拿大教育学院（Canadian Education College）是新加坡的英语学校，校区在乌节（Orchard）一带。学校开设全日制英语证书课程、雅思预备课程、TESOL英语教学文凭和兼读英语课，也有儿童英语课程；2026年12月21日至2027年2月26日开办儿童冬季营。',
  tags: [
    { icon: 'location_city', text: '新加坡 · 乌节一带' },
    { icon: 'menu_book', text: '成人英语 · 雅思 · 儿童英语' },
    { icon: 'badge', text: '全日制课程可协助办理学生签证' },
    { icon: 'schedule', text: '全日制每周15小时' },
  ],
  trustNote: '开课日期、学位和学费以学校最新通知为准，报名前由思达启航顾问跟学校确认。',
  photoNote: '所有图片和视频仅供参考，具体安排以学校为准。',
};

export const CEC_HERO_PHOTO = 'adult-class-flag';
export const CEC_HERO_STRIP = ['kids-class-kimono', 'classroom', 'temple-outing'];

export const CEC_GALLERY: CecPhoto[] = [
  { title: '成人英语课堂', description: '小组讨论，老师在旁讲解。', src: asset('adult-class-flag') },
  { title: '教室', description: '白色长桌和黄色座椅，配电视屏和投影。', src: asset('classroom') },
  { title: '成人英语课堂', description: '成人学生在课堂上。', src: asset('adult-class') },
  { title: '成人英语课堂', description: '课堂讨论。', src: asset('adult-class-discussion') },
  { title: '儿童英语课堂', description: '老师带孩子们做练习。', src: asset('kids-class-teacher'), position: '50% 55%' },
  { title: '儿童英语课堂', description: '用屏幕讲解日本和服主题。', src: asset('kids-class-kimono') },
  { title: '儿童英语课堂', description: '孩子们在小组里写作和发言。', src: asset('kids-class-writing') },
  { title: '儿童营课堂', description: '孩子们在做课堂练习。', src: asset('kids-camp-class') },
  { title: '儿童英语夏令营', description: '夏令营结业，孩子们展示做好的环保主题纸袋。', src: asset('kids-summer-camp') },
  { title: '万圣节活动', description: '学生们在学校大堂过万圣节。', src: asset('halloween') },
  { title: '参观佛牙寺', description: '学生们一起参观新加坡佛牙寺。', src: asset('temple-outing') },
  { title: '佛牙寺里合影', description: '学生们在佛牙寺里合影。', src: asset('temple-inside'), position: '50% 72%' },
];

export const CEC_VIDEOS: CecVideo[] = [
  { title: '学员手持证书合影', description: '学生们在学校大堂举起证书合影。', duration: '0:05', vertical: false, ...video('certificates') },
  { title: '课堂实拍', description: '老师和学生面对面讲解练习。', duration: '0:19', vertical: true, ...video('class') },
];

export const CEC_CERTIFICATE = {
  name: '英语证书课程',
  englishName: 'Certificate in English',
  badge: '全日制 · 可协助办理学生签证',
  facts: [
    { label: '上课时间', value: '周一至周五，每周15小时；上午9:30–12:30或下午1:30–4:30' },
    { label: '级别', value: '分1–6级' },
    { label: '入学', value: '免费测试和咨询' },
    { label: '学费', value: '请咨询思达启航顾问' },
  ],
  beginner: {
    title: '零基础初级班招生中',
    points: ['2026年12月14日开课', '周一至周五 下午1:30–4:30', '可办理学生签证'],
  },
};

/** Certificate in English full-time terms (school table); past rows are hidden by the page. */
export const CEC_TERMS: CecTerm[] = [
  { name: '第1学期', start: '2026-01-05', end: '2026-03-27', dates: '2026年1月5日–3月27日', test: '2026年3月6日' },
  { name: '第2学期', start: '2026-03-30', end: '2026-06-19', dates: '2026年3月30日–6月19日', test: '2026年5月29日' },
  { name: '假期', start: '2026-06-22', end: '2026-06-26', dates: '2026年6月22日–6月26日', test: '学期假期', isBreak: true },
  { name: '第3学期', start: '2026-06-29', end: '2026-09-18', dates: '2026年6月29日–9月18日', test: '2026年8月28日' },
  { name: '第4学期', start: '2026-09-21', end: '2026-12-11', dates: '2026年9月21日–12月11日', test: '2026年11月20日' },
  { name: '第5学期', start: '2026-12-14', end: '2027-03-12', dates: '2026年12月14日–2027年3月12日', test: '2027年2月19日' },
  { name: '假期', start: '2026-12-28', end: '2027-01-01', dates: '2026年12月28日–2027年1月1日', test: '学期假期', isBreak: true },
];

export const CEC_IELTS = {
  name: '雅思预备课程',
  englishName: 'IELTS Preparation',
  badge: '全日制 · 小班授课，每日练习',
  facts: [
    { label: '上课时间', value: '周一至周五 13:30–16:30，每周15小时' },
    { label: '新生招生', value: '2026年9月28日开始' },
    { label: '学生签证', value: '可协助办理学生签证（3–9个月）' },
    { label: '入学', value: '需参加分班考试' },
    { label: '学费', value: '请咨询思达启航顾问' },
  ],
  content: [
    '涵盖雅思听力、阅读、写作、口语四项技能',
    '语法和词汇积累',
    '雅思模拟考试＋内部评估',
    '考试技巧和时间管理',
    '建立信心并熟悉真实考试形式',
  ],
};

export const CEC_WINTER_CAMP = {
  name: '儿童冬季营 2026–2027',
  dates: '2026年12月21日–2027年2月26日',
  age: '6–13岁，需参加分班测试',
  sessions: [
    { label: '上午', time: '9:30–12:30', hours: '3小时' },
    { label: '下午', time: '1:30–3:30', hours: '2小时' },
  ],
  fees: [
    { label: '全天（5小时）', amount: 850, unit: '每周' },
    { label: '半天 · 上午（3小时）', amount: 550, unit: '每周' },
    { label: '半天 · 下午（2小时）', amount: 450, unit: '每周' },
    { label: '教材费', amount: 30, unit: '' },
    { label: '报名费', amount: 100, unit: '', note: '新学生' },
  ] as CecCampFee[],
  highlights: [
    '通过趣味游戏和互动学习英语',
    '提高英语口语自信心',
    '鼓励学生之间建立友谊和团队合作精神',
    '创造积极愉快的英语学习体验',
  ],
  earlyBird: '提前报名可享优惠，适用于3周或以上的课程；优惠详情请咨询思达启航顾问。',
  family: '可选附加：家庭成员学习计划，家长可报成人英语课程（需额外付费）。',
};

export const CEC_OTHER_COURSES = [
  { icon: 'workspace_premium', title: 'Diploma in TESOL 英语教学文凭', text: '有全日制、兼读和网课；可协助办理学生签证。' },
  { icon: 'schedule', title: '兼读英语课程（Part-time）', text: '通用英语每周3次，口语会话每周2次，商务英语每周1次。' },
  { icon: 'child_care', title: '儿童英语课程（Kids English Course）', text: '有假期课程和小组课。' },
];

export const CEC_SERVICE = [
  { icon: 'route', title: '选课程', text: '根据年龄、英语基础、出发时间和预算，比较证书课程、雅思课程和冬季营。' },
  { icon: 'event_available', title: '确认开课和学位', text: '跟学校确认开课日期、分班测试安排和当期学费。' },
  { icon: 'assignment', title: '协助报名和付款', text: '整理报名资料和付款信息，报名进度随时同步。' },
  { icon: 'flight_takeoff', title: '出发前逐项提醒', text: '学生签证材料、机票、保险和行李清单都会提醒。' },
];

export const CEC_MOBILE_ANCHORS = [
  { label: '照片', target: 'gallery', icon: 'photo_library' },
  { label: '视频', target: 'videos', icon: 'smart_display' },
  { label: '成人课程', target: 'adult-courses', icon: 'menu_book' },
  { label: '冬季营', target: 'winter-camp', icon: 'child_care' },
  { label: '顾问', target: 'consultants', icon: 'support_agent' },
];

/** Terms that have not ended on the given ISO date. */
export function cecCurrentTerms(today: string, terms: CecTerm[] = CEC_TERMS): CecTerm[] {
  return terms.filter(term => term.end >= today);
}
