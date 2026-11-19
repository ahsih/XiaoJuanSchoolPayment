/**
 * Static text and data of the EV main-campus page (2026 brochure and new-student guide).
 * Pure data only: no Angular, DOM or storage, so the WeChat mini program can reuse it.
 * Prices, fees and quote rules live in ev-content-config.ts.
 */

export type EvGalleryCategory = '全部' | '校园' | '教室' | '住宿' | '餐厅' | '设施';

export interface EvQuickInfo { icon: string; title: string; text: string; }
export interface EvGalleryImage { category: Exclude<EvGalleryCategory, '全部'>; title: string; description: string; src: string; contentType?: string; featured?: boolean; }
export interface EvVideo { title: string; description: string; duration: string; src: string; poster: string; orientation: 'landscape' | 'portrait'; }
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

export const EV_REFERENCE_NOTE = '以上安排仅供参考，学校可能随时调整。';

export const EV_PAGE_COPY = {
  heroLead: '2004年创办的宿务老牌英语学校，学习强度可严可松，课后生活在度假村式校园里就能解决。',
  trustNote: '告诉顾问斯巴达或半斯巴达偏好、课程、房型和入学日期，思达启航会帮你确认空房、优惠和正式报价。',
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
  eopNote: '教学区（1至3楼及走廊）实行English Only，被老师或职员发现说母语一次，周五加1小时自习。',
  otherPlansNote: '另有校外公寓课程（仅限半斯巴达，无门禁）和走读课程，适合需要更自由安排的学生，具体请咨询顾问。',
  priceNote: '本页价格更新时间：2026年11月19日。课程费、住宿费、到校费用和优惠可能调整，报名时以顾问向学校确认的正式报价为准。',
  finalCtaTitle: '想知道 EV 当前是否有空房和优惠？',
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
  photo('校园', '校园草坪', '开放式户外空间，课后休息和活动。', 'campus-lawn'),
  photo('校园', '大堂', '学生日常出入和办事的地方。', 'lobby'),
  photo('校园', '花园休闲区', '课间和课后可以在这里放松。', 'garden-lounge'),
  photo('教室', '一对一教室', '口语、写作和考试专项都在一对一教室上。', 'mtm-classroom', true),
  photo('教室', '团体课', '小团体最多5人，大团体最多8人。', 'group-class'),
  photo('教室', 'Westudy学习区与雅思资源中心', '自习、查资料和雅思备考的地方。', 'westudy-idp', true),
  photo('教室', '大教室', '用于讲座、考试和大型活动。', 'lecture-room'),
  photo('教室', '图书馆', '安静的阅读和自习空间。', 'library'),
  photo('住宿', '单人间', '一人一间，适合重视隐私的学生。', 'single-room'),
  photo('住宿', '双人间', '朋友同行或兼顾预算的选择。', 'double-room', true),
  photo('住宿', '三人间', '三人一间，每人有独立书桌。', 'triple-room'),
  photo('住宿', '四人间', '上下铺房型，预算较低。', 'quad-room'),
  photo('住宿', '校外公寓', '带小厨房的公寓房，仅限半斯巴达课程。', 'condo'),
  photo('餐厅', '学生餐厅', '一日三餐自助供应，周末也有。', 'dining-hall', true),
  photo('餐厅', 'EV Bucks咖啡店', '咖啡、零食、电话卡和打印。', 'ev-bucks'),
  photo('设施', '游泳池', '每天06:00–23:00开放（上课时间除外）。', 'swimming-pool', true),
  photo('设施', '泳池休闲区', '泳池边的休息区。', 'pool-lounge'),
  photo('设施', '健身房', '课后运动和体能训练。', 'gym'),
  photo('设施', '休闲娱乐室', '台球、飞镖和投篮机。', 'game-room'),
  photo('设施', '电影院', '校内放映室，用于电影课和活动。', 'cinema'),
];

const video = (name: string, title: string, description: string, duration: string, orientation: EvVideo['orientation']): EvVideo =>
  ({ title, description, duration, orientation, src: `/assets/ev/videos/${name}.mp4`, poster: `/assets/ev/videos/poster-${name}.jpg` });

/** Main-campus videos, transcoded to 720p H.264 and loaded only when played. */
export const EV_VIDEOS: EvVideo[] = [
  video('campus-tour', '主校区导览', '教学楼、宿舍、泳池、健身房和雅思资源中心。', '1:48', 'landscape'),
  video('dinner-buffet', '餐厅自助晚餐', '校内餐厅的一顿晚饭。', '1:24', 'landscape'),
  video('power-speaking', '口语强化课学员访谈', '学员聊一对一和小组课的收获（英文）。', '6:23', 'landscape'),
  video('eop-tik-talk', '英语环境 EOP', '学生聊English Only规定（英文）。', '1:03', 'portrait'),
  video('ielts-student', '雅思学员分享', '在雅思资源中心聊备考经历（英文）。', '2:20', 'portrait'),
  video('graduation', '毕业典礼', '每周五的毕业典礼和合影。', '0:21', 'portrait'),
  video('oslob-tour', '周末Oslob之旅', '学校组织的周末活动：看鲸鲨和瀑布。', '0:48', 'portrait'),
];

export const EV_BASIC_INFO: EvInfoRow[] = [
  { label: '办学历史', value: '2004年创办，2017年10月启用现校区，校友超过2.5万名' },
  { label: '学校资质', value: 'CALA会员、TESDA、菲律宾旅游部（DOT）认证' },
  { label: '班级人数', value: '一对一；小团体1:5；大团体1:8；选修课1:12' },
  { label: '上课时间', value: '周一至周五 08:00–17:10，每节45分钟' },
  { label: '校园设施', value: '泳池、健身房、娱乐室、电影院、图书馆、咖啡店' },
];

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
  { title: '未成年且周末没有监护人陪同' },
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
      { day: '周五', time: '17:10–24:00' },
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
      { day: '周五', time: '17:10–24:00' },
      { day: '周六', time: '05:00–24:00' },
      { day: '周日', time: '05:00–22:00' },
    ],
  },
];

export const EV_SCHEDULE: EvScheduleItem[] = [
  { time: '06:30–07:30', title: '免费选修课', text: '按兴趣自愿参加。', appliesTo: '所有学生', icon: 'edit' },
  { time: '07:00–08:00', title: '词汇早课（周一至周五）', text: '约25分钟，周五含词汇测验。', appliesTo: '斯巴达', icon: 'wb_sunny', highlighted: true },
  { time: '08:00–12:05', title: '上午5节课', text: '一对一、小团体和大团体课。', appliesTo: '所有学生', icon: 'menu_book' },
  { time: '12:05–13:05', title: '午餐', text: '校内餐厅自助。', appliesTo: '所有学生', icon: 'restaurant' },
  { time: '13:05–17:10', title: '下午5节课', text: '含2节选修或自习课。', appliesTo: '所有学生', icon: 'menu_book' },
  { time: '17:15–18:00', title: '免费选修课 / 自由时间', text: '可休息、运动或上选修课。', appliesTo: '所有学生', icon: 'self_improvement' },
  { time: '18:00–19:00', title: '晚餐 / 瑜伽、尊巴', text: '晚间活动自愿参加。', appliesTo: '所有学生', icon: 'nightlife' },
  { time: '19:00–20:00', title: '句型晚课（周一至周四）', text: '约25分钟。', appliesTo: '斯巴达', icon: 'school', highlighted: true },
  { time: '20:00–22:00', title: '晚自习', text: '按要求签到。', appliesTo: '斯巴达', icon: 'edit_note', highlighted: true },
];

export const EV_ELECTIVE_GROUPS: EvElectiveGroup[] = [
  { period: '早上选修', level: '初级', courses: ['语法', '流利发音', '成语与短语动词'] },
  { period: '下午选修', level: '中级', courses: ['听力', '电影课', '讨论与辩论', '求职面试培训'] },
];

export const EV_SCHOOL_SERVICES = ['周末机场接机', '周一分级测试与新生说明会', '每4周升级测试', '每周两次清洁、每周换床单', '洗衣服务（按次付费）', '医务室（平日）', '校内保安', '公共区和宿舍Wi-Fi'];
export const EV_CAMPUS_ACTIVITIES = ['每月主题派对：泡沫派对、泼水节、户外电影、音乐之夜', '瑜伽、尊巴和健身指导', '万圣节、圣诞等节日活动', '每周五毕业典礼', '志愿者活动'];
export const EV_WEEKEND_ACTIVITIES = ['跳岛游', 'Oslob看鲸鲨', '宿务市区观光', '海滩', '潜水'];

export const EV_NOTES = [
  '斯巴达平日不能外出，半斯巴达17:10后可外出；先确认自己能接受的管理强度。',
  '雅思和雅思保分班只开设斯巴达；校外公寓只接受半斯巴达课程学生。',
  '出勤率低于90%不发结业证书；教学区实行English Only。',
  '入学后护照由学校保管至毕业；国定假日停课，不补课也不退费。',
  '暑期热门房型容易满，建议尽早确认空房。',
];

export const EV_FAQS: EvFaqItem[] = [
  { question: '菲律宾宿务EV语言学校适合第一次菲律宾游学吗？', answer: '适合目标明确、能接受一定管理的学生。如果更想轻松体验宿务生活，可以选半斯巴达经典ESL。' },
  { question: 'EV的斯巴达和半斯巴达怎么选？', answer: '斯巴达有词汇早课、句型晚课和晚自习，周一至周四不能外出，适合冲刺型学生；半斯巴达没有早晚课和晚自习，平日17:10后可外出，22:00前返校。' },
  { question: '雅思保分班要学多久？', answer: '8周起，只开设斯巴达，考学术类雅思。学校按入学分数设定目标分，例如入学4.0分，8周目标5.5分、12周目标6.0分；6.0分以上每提高0.5分需要8周。' },
  { question: '校外公寓和校内宿舍有什么不同？', answer: '校外公寓只接受半斯巴达课程学生，没有门禁，每天有接驳车往返学校，可以使用校内所有设施，到校后的管理费比校内宿舍高。' },
  { question: '页面上的报价包含全部费用吗？', answer: '不包含全部。前期支付包含注册费、95折后的课程费和住宿费，以及适用的旺季附加费和未成年管理费；到校后还要付SSP、SSP E-CARD、管理费、水电费、教材费和学生证，停留超过59天要办ACR I-Card，旅游签证按停留时间续签，首次续签另收ARP外国人登记费。接机和可退押金单独列示。' },
  { question: 'EV适合未成年学生吗？', answer: '可以，但未成年学生平日不能外出，周末须监护人陪同，门禁21:00；未满18岁每4周另收100美元管理费。陪同和住宿安排请报名时与顾问确认。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名EV，思达启航顾问会免费协助菲律宾入境及签证相关手续，学生只需要按顾问指引准备个人资料。' },
];

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
