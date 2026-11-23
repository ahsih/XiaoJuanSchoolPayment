/**
 * Static text and data of the EV main-campus page (2026 brochure and new-student guide).
 * Pure data only: no Angular, DOM or storage, so the WeChat mini program can reuse it.
 * Prices, fees and quote rules live in ev-content-config.ts.
 */

import type { HolidayCalendar } from '../cia-school/cia-page-content';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

export type EvGalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

export interface EvQuickInfo { icon: string; title: string; text: string; }
export interface EvGalleryImage { category: Exclude<EvGalleryCategory, '全部'>; title: string; description: string; src: string; contentType?: string; featured?: boolean; }
/** section: 'tour' = large video cards; 'life' and 'interview' = the short-clip rows. */
export interface EvVideo { title: string; description: string; duration: string; src: string; poster: string; orientation: 'landscape' | 'portrait'; section: 'tour' | 'life' | 'interview'; }
export interface EvInfoRow { label: string; value: string; }
export interface EvFitItem { title: string; }
export interface EvCourseItem { name: string; type: string; suitable: string; }
export interface EvStudyPlanTimeBlock { label: string; time: string; text: string; icon: string; type: 'required' | 'flexible'; }
export interface EvStudyPlan {
  code: string;
  name: string;
  title: string;
  contrastTitle: string;
  timeBlocks: EvStudyPlanTimeBlock[];
  curfew: Array<{ day: string; time: string }>;
}
export interface EvScheduleItem { time: string; title: string; text: string; appliesTo: string; icon: string; highlighted?: boolean; }
export interface EvElectiveGroup { period: string; level: string; courses: string[]; }
export interface EvGuaranteeTarget { level: string; entry: string; eightWeeks: string; twelveWeeks: string; }
export interface EvFaqItem { question: string; answer: string; }
export interface EvNavItem { label: string; target: string; icon: string; }
export interface EvRule { title: string; text: string; }

/** Closes every content section of the EV page (user decisions 2026-11-20 and 2026-11-21). */
export const EV_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const EV_PAGE_COPY = {
  heroLead: '2004年创办的宿务老牌英语学校，学习强度可严可松，课后生活在度假村式校园里就能解决。',
  trustNote: '告诉顾问斯巴达或半斯巴达偏好、课程、房型和入学日期，思达启航会帮你确认空房和正式报价。',
  galleryLead: '先看校园、教室、宿舍、餐厅和设施，再判断EV的学习与生活环境是否适合你。',
  videoLead: '校园导览、餐厅、课堂和学生生活；部分访谈为英文原声。',
  overviewTitle: '30 秒看懂 EV',
  advisorTitle: '思达启航顾问点评',
  suitableTitle: '适合优先看 EV',
  notSuitableTitle: '不太适合的情况',
  advisorText: 'EV最重要的不是只看价格，而是先判断斯巴达还是半斯巴达。想冲刺考试、自律较弱或希望被学习节奏推动，优先看斯巴达；想兼顾学习和宿务生活，选半斯巴达，喜欢独立生活还可以选校外公寓。顾问会同时帮你核对课程强度、房型、到校费用和未成年规则。',
  coursesLead: '先按学习目标选课程类型，每门课的4周费用和每日课时见下方费用表。',
  studyPlanLead: '两种模式白天的课程一样，区别在早晚课、晚自习和平日能不能外出。',
  dailyLead: '每节课45分钟，课间休息5分钟。所有学生都可以免费参加早晚选修课；周末和假日上午另有4节选修团体课，需提前报名。',
  eopNote: '教学区（1至3楼及走廊）实行English Only，被老师或职员发现说母语会收到罚单；每张罚单加1小时自习，在周五17:10后或周六、周日完成。',
  otherPlansNote: '另有校外公寓课程（仅限半斯巴达，无门禁）和走读课程，适合需要更自由安排的学生，具体请咨询顾问。',
  priceNote: '本页价格更新时间：2026年11月19日。课程费、住宿费和到校费用可能调整，报名时以顾问向学校确认的正式报价为准。',
  finalCtaTitle: '想知道 EV 当前是否有空房？',
  finalCtaText: '把入学日期、学习周数、斯巴达或半斯巴达偏好、课程方向和房型发给顾问，可以更快得到准确报价。',
} as const;

export const EV_FINAL_CTA_BADGES = ['快速响应', '专业顾问一对一', '方案与报价免费', '从申请到入学全程协助'];

export const EV_QUICK_INFO: EvQuickInfo[] = [
  { icon: 'location_on', title: '位置', text: '宿务市区Talamban区，去市中心和商场都方便' },
  { icon: 'verified_user', title: '管理模式', text: '斯巴达或半斯巴达，按自律程度和学习目标选择' },
  { icon: 'villa', title: '校园', text: '度假村式校园，最多380名学生，175间一对一教室' },
  { icon: 'fact_check', title: '雅思', text: '校内有IDP官方考点，可考机考和纸笔考试' },
  { icon: 'school', title: '课程方向', text: '综合英语、口语、雅思、托业，另有商务和社交媒体英语' },
  { icon: 'bed', title: '食宿', text: '校内宿舍含一日三餐和清洁；半斯巴达可选校外公寓' },
];

const photo = (category: EvGalleryImage['category'], title: string, description: string, file: string, featured = false): EvGalleryImage =>
  ({ category, title, description, src: `assets/ev/${file}.webp`, ...(featured ? { featured } : {}) });

/** Photos marked featured form the first, folded view of the "全部" tab. */
export const EV_GALLERY_FEATURED_COUNT = 6;
export const EV_GALLERY_IMAGES: EvGalleryImage[] = [
  photo('校园', 'EV校园外观', '2017年启用的新校区，度假村式校园。', 'campus-exterior', true),
  photo('校园', '校园导览图', '1–4教学区域，5–11校园设施，12–13学生宿舍和洗衣房。', 'campus-map'),
  photo('校园', '傍晚的校园', '主楼和校门，傍晚学生在草坪上休息。', 'campus-sunset'),
  photo('校园', '夜晚的校园', '晚上主楼、餐厅和草坪步道都有照明。', 'campus-night'),
  photo('校园', '校园草坪', '开放式户外空间，课后休息和活动。', 'campus-lawn'),
  photo('校园', '大堂', '学生日常出入和办事的地方。', 'lobby'),
  photo('校园', '花园休闲区', '课间和课后可以在这里放松。', 'garden-lounge'),
  photo('校园', '中庭花园', '校园中庭的花园和台阶。', 'life/garden-steps'),
  photo('校园', 'EV老师', '菲律宾老师在校内授课，也参加学校活动。', 'life/teachers'),
  photo('教室', '一对一教室', '口语、写作和考试专项都在一对一教室上。', 'mtm-classroom', true),
  photo('教室', '团体课', '小团体最多5人，大团体最多8人。', 'group-class'),
  photo('教室', '团体课堂', '小组讨论和上台发言练习。', 'life/group-class-2'),
  photo('教室', '一对一课堂', '老师和学生面对面练口语。', 'life/mtm-class-2'),
  photo('教室', 'Westudy学习区与雅思资源中心', '自习、查资料和雅思备考的地方。', 'westudy-idp', true),
  photo('教室', '大教室', '用于讲座、考试和大型活动。', 'lecture-room'),
  photo('教室', '图书馆', '安静的阅读和自习空间。', 'library'),
  photo('教室', 'Westudy休息区', '课后看书、自习和小组讨论。', 'life/westudy-lounge'),
  photo('教室', 'Westudy长桌区', '课后自习常用的位置。', 'life/westudy-tables'),
  photo('教室', '自习室', '斯巴达晚自习和补自习在这里签到。', 'life/study-room'),
  photo('住宿', '单人间', '一人一间，适合重视隐私的学生。', 'single-room'),
  photo('住宿', '双人间', '朋友同行或兼顾预算的选择。', 'double-room', true),
  photo('住宿', '三人间', '三人一间，每人有独立书桌。', 'triple-room'),
  photo('住宿', '四人间', '上下铺房型，预算较低。', 'quad-room'),
  photo('住宿', '校外公寓', '带小厨房的公寓房，仅限半斯巴达课程。', 'condo'),
  photo('住宿', '宿舍走廊', '男生住2–3楼，女生住5–8楼。', 'life/dorm-corridor'),
  photo('住宿', '宿舍浴室', '干湿分离，带热水器。', 'rooms/dorm-bathroom'),
  photo('餐厅', '学生餐厅', '一日三餐自助供应，周末也有。', 'dining-hall', true),
  photo('餐厅', 'EV Bucks咖啡店', '咖啡、零食、电话卡和打印。', 'ev-bucks'),
  photo('餐厅', '自助取餐', '每餐自己取，想吃多少拿多少。', 'life/buffet-line'),
  photo('餐厅', '每日菜色', '主菜、蔬菜和汤每天更换。', 'life/buffet-dishes'),
  photo('餐厅', '自助菜色', '肉类、蔬菜和米饭的常见搭配。', 'life/buffet-dishes-2'),
  photo('餐厅', '主菜', '每餐有几道热菜可选。', 'life/buffet-mains'),
  photo('餐厅', '水果', '餐后水果。', 'life/buffet-fruit'),
  photo('餐厅', '炸鸡', '学生餐厅的常见菜。', 'life/fried-chicken'),
  photo('餐厅', '汉堡', '餐厅有时供应西式餐点。', 'life/burgers'),
  photo('餐厅', '用餐时间', '午饭时间的学生餐厅。', 'life/dining-hall-busy'),
  photo('餐厅', 'EV Bucks店内', '平日07:00–24:00，周末11:00–23:00营业。', 'life/cafe-shop'),
  photo('餐厅', '咖啡店点心', '咖啡、面包和小点心。', 'life/cafe-pastries'),
  photo('设施', '游泳池', '每天06:00–23:00开放（上课时间除外）。', 'swimming-pool', true),
  photo('设施', '泳池休闲区', '泳池边的休息区。', 'pool-lounge'),
  photo('设施', '夜晚的泳池', '晚上下课后也能游泳。', 'life/pool-night'),
  photo('设施', '泳池瀑布', '泳池一角的小瀑布。', 'life/pool-waterfall'),
  photo('设施', '泳池与宿舍楼', '泳池紧挨宿舍楼。', 'life/pool-building'),
  photo('设施', '健身房', '课后运动和体能训练。', 'gym'),
  photo('设施', '健身房器械', '每周两晚有健身指导。', 'life/gym-2'),
  photo('设施', '瑜伽课', '晚间免费瑜伽课。', 'life/yoga'),
  photo('设施', '乒乓球', '球拍可向大堂保安借用。', 'life/ping-pong'),
  photo('设施', '休闲娱乐室', '台球、飞镖和投篮机。', 'game-room'),
  photo('设施', '电影院', '校内放映室，用于电影课和活动。', 'cinema'),
];

const video = (
  name: string, title: string, description: string, duration: string, orientation: EvVideo['orientation'], section: EvVideo['section'],
): EvVideo =>
  ({ title, description, duration, orientation, section, src: `/assets/ev/videos/${name}.mp4`, poster: `/assets/ev/videos/poster-${name}.jpg` });

/** Main-campus videos, transcoded to 720p H.264 and loaded only when played. */
export const EV_VIDEOS: EvVideo[] = [
  video('promo-film', '主校区宣传片', '自习区、电影院、宿舍、自助餐、咖啡店、泳池和每周活动。', '2:55', 'landscape', 'tour'),
  video('campus-tour', '主校区导览', '教学楼、宿舍、泳池、健身房和雅思资源中心。', '1:48', 'landscape', 'tour'),
  video('dinner-buffet', '餐厅自助晚餐', '校内餐厅的一顿晚饭。', '1:24', 'landscape', 'tour'),
  video('yoga-class', '晚间瑜伽课', '免费瑜伽课的一节。', '1:04', 'landscape', 'tour'),
  video('power-speaking', '口语强化课学员访谈', '学员聊一对一和小组课的收获（英文）。', '6:23', 'landscape', 'tour'),
  // Short clips from the 2026-11 EV collection, cut out of their vertical frames.
  video('campus-walk', '校门与大堂', '从校门走进大堂。', '0:21', 'landscape', 'tour'),
  video('office-windows', '办公室窗口', '大厅每个窗口办不同的事，后面是一楼教室走廊。', '0:08', 'landscape', 'tour'),
  video('shop-pool', '咖啡店与泳池', 'EV Bucks咖啡店和校内泳池。', '0:19', 'landscape', 'tour'),
  video('gym', '健身房', '4楼健身房的器械。', '0:20', 'landscape', 'tour'),
  video('classes', '一对一与团体课教室', '一对一听力课和团体课教室。', '0:17', 'landscape', 'tour'),
  video('business-presentation', '学生演讲', '商务英语和口语强化课的学生演讲。', '0:09', 'landscape', 'tour'),
  video('exam-hall', '大教室与考场', '大教室，也用作考试教室。', '0:06', 'landscape', 'tour'),
  video('ielts-centre', '雅思资源室', 'Westudy雅思学习资源中心。', '0:06', 'portrait', 'life'),
  video('dining-hall', '学生餐厅', '自助取餐和餐厅环境。', '0:51', 'landscape', 'tour'),
  video('dorm-rooms', '校内宿舍', '单人间、四人间和三人间。', '0:22', 'portrait', 'life'),
  video('condo-single', '校外公寓单人间', '厨房、卫浴、空调和书桌。', '0:51', 'portrait', 'life'),
  video('dance-challenge', '舞蹈挑战', '各国学生和老师一起跳舞。', '1:32', 'portrait', 'life'),
  video('eop-tik-talk', '英语环境 EOP', '学生聊English Only规定（英文）。', '1:03', 'portrait', 'life'),
  video('graduation', '毕业典礼', '每周五的毕业典礼和合影。', '0:21', 'portrait', 'life'),
  video('oslob-tour', '周末Oslob之旅', '学校组织的周末活动：看鲸鲨和瀑布。', '0:48', 'portrait', 'life'),
  video('ielts-student', '雅思学员分享', '在雅思资源中心聊备考经历（英文）。', '2:20', 'portrait', 'interview'),
  video('ielts-nili', '雅思学员 Nili', '蒙古学员聊在EV备考雅思（英文字幕）。', '3:21', 'portrait', 'interview'),
  video('tik-talk-student', '学员访谈', '学员在娱乐室聊EV的学习和生活（英文字幕）。', '2:04', 'portrait', 'interview'),
];

export const EV_BASIC_INFO: EvInfoRow[] = [
  { label: '办学历史', value: '2004年创办，2017年10月启用现校区，校友超过2.5万名' },
  { label: '学校资质', value: 'CALA会员、TESDA、菲律宾旅游部（DOT）认证' },
  { label: '班级人数', value: '一对一；小团体1:5；大团体1:8；选修课1:12' },
  { label: '上课时间', value: '周一至周五 08:00–17:10，每节45分钟' },
  { label: '校园设施', value: '泳池、健身房、娱乐室、电影院、图书馆、咖啡店' },
];

/** Text only; the documents themselves carry addresses and are never published (as on the CIA page). */
export const EV_LICENSE = {
  title: '办学资质已核验',
  items: [
    '2026–2027年度宿务市营业执照（英语教学、学生宿舍、餐厅，2026年5月11日签发）',
    '菲律宾移民局外国学生招收资格认证（学生据此办理SSP学习许可）',
  ],
  note: '证件可向思达启航顾问索取查看',
};

/**
 * EV's 2027 holiday poster: weekday holidays only, because the weekend ones (Lunar New Year 2/6, Black
 * Saturday and Easter 3/27–28, Labor Day 5/1, Independence Day 6/12, Ninoy Aquino Day 8/21, Christmas
 * 12/25) do not take a class day.
 */
export const EV_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '24日', name: '宿务市宪章日（仅主校区）' }] },
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节', provisional: true },
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 5, holidays: [{ day: '17日', name: '宰牲节', provisional: true }] },
      {
        month: 8,
        holidays: [
          { day: '6日', name: '宿务省宪章日' },
          { day: '30日', name: '国家英雄日' },
        ],
      },
      { month: 9, holidays: [{ day: '9日', name: '奥斯梅尼亚日' }] },
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
          { day: '8日', name: '圣母无染原罪瞻礼' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];
export const EV_HOLIDAY_FOOTNOTE = '只列平日的假期，周末的节日不影响上课；开斋节、宰牲节日期待官方确认，政府可能临时增加或调整假期，以EV当期通知为准。';

export const EV_SUITABLE_FOR: EvFitItem[] = [
  { title: '目标清楚、想被学习节奏推动（选斯巴达）' },
  { title: '想兼顾学习和宿务市区生活（选半斯巴达）' },
  { title: '重视一对一口语，每天6至8节' },
  { title: '准备雅思、托业或商务英语' },
];

export const EV_NOT_SUITABLE_FOR: EvFitItem[] = [
  { title: '只想轻松度假，不想守门禁和English Only' },
  { title: '预算非常紧：单人间、公寓较贵，到校还要付学杂费' },
  { title: '临近暑假才决定：热门房型易满，另收旺季附加费' },
  { title: '未满15岁（学校不接收），或未成年且周末没有监护人陪同' },
];

/** Course chooser cards; class composition is shown once, in the fee tables. */
export const EV_COURSES: EvCourseItem[] = [
  { name: '经典ESL', type: '半斯巴达', suitable: '综合英语，学习与宿务生活兼顾。' },
  { name: '密集ESL', type: '斯巴达', suitable: '综合英语，用更强纪律快速进入状态。' },
  { name: '口语强化6', type: '斯巴达 / 半斯巴达', suitable: '每天6节一对一，集中练会话和表达。' },
  { name: '口语强化8', type: '斯巴达 / 半斯巴达', suitable: '每天8节一对一，加练流利口语和演讲。' },
  { name: '雅思 / 雅思保分班', type: '仅斯巴达', suitable: '保分班考学术类雅思，8周起。' },
  { name: '托业', type: '斯巴达 / 半斯巴达', suitable: '求职、升学需要TOEIC成绩。' },
  { name: '商务英语', type: '斯巴达 / 半斯巴达', suitable: '商务讨论、演示和谈判。' },
  { name: '社交媒体英语', type: '斯巴达 / 半斯巴达', suitable: 'Digital English：Vlog、播客和内容创作。' },
];

/** Entry score → guaranteed score; from 6.0 each 0.5 band takes 8 weeks. */
export const EV_IELTS_GUARANTEE_TARGETS: EvGuaranteeTarget[] = [
  { level: 'G1', entry: '3.5', eightWeeks: '5.0', twelveWeeks: '5.5' },
  { level: 'G2', entry: '4.0', eightWeeks: '5.5', twelveWeeks: '6.0' },
  { level: 'G3', entry: '5.0', eightWeeks: '6.0', twelveWeeks: '—' },
  { level: 'G4', entry: '5.5', eightWeeks: '—', twelveWeeks: '6.5' },
  { level: 'G5', entry: '6.0', eightWeeks: '6.5', twelveWeeks: '—' },
  { level: 'G6', entry: '6.5', eightWeeks: '7.0', twelveWeeks: '—' },
  { level: 'G7', entry: '7.0', eightWeeks: '7.5', twelveWeeks: '—' },
  { level: 'G8', entry: '7.5', eightWeeks: '8.0', twelveWeeks: '—' },
];
export const EV_IELTS_GUARANTEE_NOTE = '入学时按雅思分数分级，最高保至8.0分；保分须遵守学校保分条款。';

export const EV_STUDY_PLANS: EvStudyPlan[] = [
  {
    code: '斯巴达',
    name: '严格管理',
    title: '适合目标明确、想被学习节奏督促的学生',
    contrastTitle: '斯巴达多出的强制学习时段',
    timeBlocks: [
      { label: '词汇早课', time: '周一至周五 07:00–08:00内25分钟', text: '周五测验，低于60分须先补自习才能外出', icon: 'wb_sunny', type: 'required' },
      { label: '句型晚课', time: '周一至周四 19:00–20:00内25分钟', text: '晚饭后进行', icon: 'school', type: 'required' },
      { label: '晚自习', time: '20:00–22:00', text: '按要求签到完成', icon: 'edit_note', type: 'required' },
    ],
    curfew: [
      { day: '周一至周四', time: '不可外出' },
      { day: '周五', time: '05:00–24:00' },
      { day: '周六', time: '05:00–24:00' },
      { day: '周日', time: '05:00–22:00' },
    ],
  },
  {
    code: '半斯巴达',
    name: '弹性管理',
    title: '适合想学英语，也想体验宿务生活的学生',
    contrastTitle: '半斯巴达没有这些强制时段',
    timeBlocks: [
      { label: '早上', time: '无强制早课', text: '正常早餐与晨间准备', icon: 'free_breakfast', type: 'flexible' },
      { label: '晚上', time: '无强制晚课和自习', text: '晚饭后自由安排', icon: 'event_available', type: 'flexible' },
      { label: '外出', time: '17:10后可外出', text: '周一至周四22:00前返校', icon: 'directions_walk', type: 'flexible' },
    ],
    curfew: [
      { day: '周一至周四', time: '17:10–22:00' },
      { day: '周五', time: '05:00–24:00' },
      { day: '周六', time: '05:00–24:00' },
      { day: '周日', time: '05:00–22:00' },
    ],
  },
];

export const EV_SCHEDULE: EvScheduleItem[] = [
  { time: '06:30–07:30', title: '免费选修课', text: '按兴趣自愿参加。', appliesTo: '所有学生', icon: 'edit' },
  { time: '07:00–08:00', title: '早餐', text: '学生餐厅自助。', appliesTo: '半斯巴达', icon: 'free_breakfast' },
  { time: '07:00–08:00', title: '早餐 + 词汇早课（周一至周五）', text: '词汇课约25分钟，周五含词汇测验。', appliesTo: '斯巴达', icon: 'wb_sunny', highlighted: true },
  { time: '08:00–12:05', title: '上午5节课', text: '一对一、小团体和大团体课。', appliesTo: '所有学生', icon: 'menu_book' },
  { time: '12:05–13:05', title: '午餐', text: '校内餐厅自助。', appliesTo: '所有学生', icon: 'restaurant' },
  { time: '13:05–17:10', title: '下午5节课', text: '含2节选修或自习课。', appliesTo: '所有学生', icon: 'menu_book' },
  { time: '17:10–18:00', title: '自由时间 / 免费选修课', text: '可休息、运动或上选修课。', appliesTo: '所有学生', icon: 'self_improvement' },
  { time: '18:00–19:00', title: '晚餐 / 瑜伽、尊巴', text: '晚间活动自愿参加。', appliesTo: '所有学生', icon: 'nightlife' },
  { time: '19:00–20:00', title: '句型晚课（周一至周四）', text: '约25分钟。', appliesTo: '斯巴达', icon: 'school', highlighted: true },
  { time: '20:00–22:00', title: '晚自习', text: '按要求签到。', appliesTo: '斯巴达', icon: 'edit_note', highlighted: true },
];

export const EV_ELECTIVE_GROUPS: EvElectiveGroup[] = [
  { period: '早上选修', level: '初级', courses: ['语法', '流利发音', '成语与短语动词'] },
  { period: '下午选修', level: '中级', courses: ['听力', '电影课', '讨论与辩论', '求职面试培训'] },
];

export const EV_SCHOOL_SERVICES = ['周末机场接机', '医务室（平日）', '校内保安'];
export const EV_SERVICE_FACTS: EvInfoRow[] = [
  { label: '房间清洁', value: '每周两次，每周换一次床单' },
  { label: '洗衣', value: '每袋5公斤以内150比索（2–3天取）、加急200比索（1天）；周一至周六07:30–20:00送到4楼' },
  { label: 'EV Bucks', value: '平日07:00–24:00，周末11:00–23:00；零食饮料、Globe电话卡，打印每页10比索' },
  { label: 'Wi-Fi', value: '覆盖宿舍、大堂、自习室、餐厅和咖啡店；教学区没有' },
  { label: '租借', value: '枕头、毯子、台灯、风扇每件每周100比索，押金1,000比索' },
];
export const EV_CAMPUS_ACTIVITIES = ['每月主题派对：泡沫派对、泼水节、户外电影、音乐之夜', '万圣节、圣诞等节日活动', '每周五毕业典礼', '志愿者活动'];
export const EV_WEEKEND_ACTIVITIES = ['跳岛游', 'Oslob看鲸鲨', '宿务市区观光', '海滩', '潜水'];
export const EV_ACTIVITY_TIMES: EvInfoRow[] = [
  { label: '晚间运动', value: '尊巴周二、周四18:30–19:30；瑜伽周二、周三18:00–18:30或18:30–19:00；健身指导周一、周四18:30–19:30' },
  { label: '电影', value: '每周六14:00–16:00' },
  { label: '篮球场', value: '平日17:05–19:00，周末12:00–19:00' },
];
export const EV_WEEKEND_SIGNUP = '周末活动在周四16:30前到大厅付款报名，天气不好取消会退款。';

/** Monday of the first week. */
export const EV_FIRST_DAY: EvInfoRow[] = [
  { label: '07:00–07:50', value: '早餐' },
  { label: '08:00–12:00', value: '入学测试，免费拍学生证照片；带上护照原件、往返机票复印件、电子签证复印件和黑笔' },
  { label: '11:35–13:00', value: '午餐；12:10–13:00可带美元到会议室换汇' },
  { label: '13:30–15:30', value: '新生合影和新生说明会，由中国经理介绍校园生活和规定' },
  { label: '15:30–16:30', value: '学校带去附近商场换比索、买日用品' },
  { label: '16:30–17:00', value: '在大厅窗口缴纳到校费用，到书店领教材' },
  { label: '18:45–19:50', value: '语法测试（带手机）' },
];
export const EV_FIRST_DAY_NOTES = [
  '入学测试成绩13:00贴在大厅公布栏；当天安排以学校通知为准。',
  '提前想好英文名，准备好英文版家庭住址，填表时要用。',
];
export const EV_PACKING_NOTES = [
  '出发前72小时内要在线填写菲律宾eTravel，请联系思达启航顾问帮你填写。',
  '护照在抵达宿务时要有6个月以上有效期；入学通知书和往返机票打印两份英文纸质版，手机里也存一份。',
  '学校不提供毛巾和浴巾，建议带2–3条；宿舍被子较薄，怕冷可带一条薄毯。',
  '笔记本、黑蓝色原子笔和2B铅笔建议在国内买好；长期服用的药请带上英文医生证明。',
];
export const EV_OTHER_FEES: EvInfoRow[] = [
  { label: '送机', value: '1,200比索' },
  { label: '换房', value: '1,000比索，须有正当理由且有空房' },
  { label: '护照加急取回', value: '500比索，须提前两周申请' },
  { label: '补办学生证或房间钥匙', value: '各500比索' },
  { label: 'ECC出境清关', value: '在菲律宾停留超过6个月须办理，1,010比索' },
];

/** Dorm and condo rules shown with the room check-in rules. */
export const EV_DORM_RULES: EvRule[] = [
  { title: '楼层', text: '男生住2–3楼，女生住5–8楼；进入或停留异性房间、楼层会被开除。' },
  { title: '禁止事项', text: '校内禁止饮酒和带酒入校；宿舍不能做饭、不能用电磁炉；房间内禁烟。' },
  { title: '外宿旅行', text: '过夜旅行须在出发前一个工作日15:00前申请，并出示预订信息。' },
  { title: '校外公寓', text: '带任何人进房间、在房间吸烟（另罚10,000比索）、进入校内宿舍的异性房间、未请假缺席超过三天，都会被开除。每周清洁一次，衣物可带到学校洗；最晚可在学校待到23:00。' },
  { title: '公寓接驳车', text: '平日公寓到学校07:15、08:15，学校回公寓17:30、18:45、21:30，每月最后一个周五（教师培训日）13:45回公寓；周末和国定假日公寓到学校07:15、14:10，学校回公寓13:45。车准时开，错过可打车，约100比索。' },
];

export const EV_NOTES = [
  '斯巴达周一至周四不能外出，半斯巴达周一至周四17:10后可外出；先确认自己能接受的管理强度。',
  '雅思和雅思保分班只开设斯巴达；校外公寓只接受半斯巴达课程学生。',
  '出勤率低于90%不发结业证书；单周出勤低于50%周末不能外出，连续3周会被开除。',
  '违反校规会扣分，累计达到上限（1–12周学生10分、13–18周15分、19周以上20分）会被开除，学费和住宿费不退。',
  '入学后护照由学校保管至毕业；国定假日停课，不补课也不退费。',
  '暑期热门房型容易满，建议尽早确认空房。',
];

export const EV_FAQS: EvFaqItem[] = [
  { question: '菲律宾宿务EV语言学校适合第一次菲律宾游学吗？', answer: '适合目标明确、能接受一定管理的学生。如果更想轻松体验宿务生活，可以选半斯巴达经典ESL。' },
  { question: 'EV的斯巴达和半斯巴达怎么选？', answer: '斯巴达有词汇早课、句型晚课和晚自习，周一至周四不能外出，适合冲刺型学生；半斯巴达没有早晚课和晚自习，周一至周四17:10后可外出，22:00前返校。' },
  { question: '雅思保分班要学多久？', answer: '8周起，只开设斯巴达，考学术类雅思。学校按入学分数设定目标分，例如入学4.0分，8周目标5.5分、12周目标6.0分；6.0分以上每提高0.5分需要8周。' },
  { question: '校外公寓和校内宿舍有什么不同？', answer: '校外公寓在IT Park附近，只接受半斯巴达课程学生，没有门禁，带小厨房和冰箱；双人间须两位学生同时报名一起入住，例如夫妻或朋友。有接驳车往返学校，周末和国定假日班次较少；可以使用校内设施，晚上最晚可在学校待到23:00。到校后的管理费比校内宿舍高。' },
  { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付包含注册费、95折后的课程费和住宿费，以及适用的旺季附加费和未成年管理费；到校后还要付SSP、SSP E-CARD、管理费、水电费、教材费和学生证；旅游签证按停留时间续签，首次续签时另办ACR I-Card并收ARP外国人登记费。接机和可退押金单独列示。' },
  { question: 'EV适合未成年学生吗？', answer: 'EV主要招收成人，15至17岁可以报名，未满15岁学校不接收。未成年学生平日不能外出，周末须监护人陪同，门禁21:00，监护人要签未成年学生协议书；每4周另收100美元管理费。陪同和住宿安排请报名时与顾问确认。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名EV，思达启航顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
];

/**
 * Refunds after entry from EV's refund rules (2023-04-10), plus 思达启航's own deposit rule (user decision 2026-11-24).
 * The school's pre-entry penalties are agency terms and stay off the page.
 */
export const EV_REFUND_COPY = {
  summaryTitle: 'EV 取消、改期与退款规定',
  summaryHint: '报名定金、改期与尾款、到校后退款比例、不退款的情况',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'EV 取消与退款规定',
  intro: '到校后按剩余周数退部分学费和住宿费；注册费不退，剩余不足4周不退。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。' },
        { when: '尾款', text: '入学前2周还没有给学校付清尾款的，学校会直接取消学位，已预付的报名定金全部扣除。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '只报4周', text: '报名4周及以下，到校后不退款。' },
        { when: '到校4周内申请', text: '退剩余周数学费和住宿费的50%（例：12周课程第3周申请，退剩余9周费用的50%）。' },
        { when: '到校4周后申请', text: '退剩余周数学费和住宿费的25%（例：12周课程第5周申请，退剩余7周费用的25%）。' },
        { when: '剩余不足4周', text: '不退款。' },
        { when: '已享优惠', text: '申请退款后，已享受的优惠折扣取消。' },
        { when: '办理方式', text: '到校后填写退费申请单交到办公室才生效；学费和住宿费由思达启航退给学生，到校学杂费由学校退。' },
      ],
      footnote: '',
    },
    {
      title: '不退款的情况',
      note: '',
      rules: [
        { when: '晚到或缺席', text: '不在周六、周日入住，或晚到、缺席，学校都不退费；航班延误、取消或天气原因也一样。' },
        { when: '违规退学', text: '扣分满被开除，或学校按校规开除，不退款。' },
        { when: '假日与不可抗力', text: '国定假日停课不补课、不退费；自然灾害等不可抗力造成的延误或取消不退款。' },
      ],
      footnote: EV_REFERENCE_NOTE,
    },
  ],
};

export const EV_SIDE_NAV: EvNavItem[] = [
  { label: '30秒看懂', target: 'overview', icon: 'dashboard' },
  { label: '学校环境', target: 'gallery', icon: 'image' },
  { label: '视频', target: 'videos', icon: 'smart_display' },
  { label: '课程与管理模式', target: 'courses', icon: 'school' },
  { label: '校园生活', target: 'campus-life', icon: 'diversity_3' },
  { label: '课程与住宿费用', target: 'course-fees', icon: 'menu_book' },
  { label: '费用快速报价', target: 'quote', icon: 'calculate' },
  { label: '到校费用', target: 'local-fees', icon: 'payments' },
  { label: '常见问题', target: 'faq', icon: 'help' },
];

export const EV_MOBILE_ANCHORS: EvNavItem[] = [
  { label: '概览', target: 'overview', icon: 'dashboard' },
  { label: '环境', target: 'gallery', icon: 'image' },
  { label: '视频', target: 'videos', icon: 'smart_display' },
  { label: '课程', target: 'courses', icon: 'menu_book' },
  { label: '费用', target: 'quote', icon: 'calculate' },
  { label: 'FAQ', target: 'faq', icon: 'help' },
];
