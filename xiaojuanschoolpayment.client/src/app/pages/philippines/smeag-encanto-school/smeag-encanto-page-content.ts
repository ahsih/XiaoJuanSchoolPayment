// Text and data of the SMEAG Encanto page on the shared Philippine school template.
// Sources: the school pack received 2026-11-23 (2027 Family Camp guide, 2–4-year-old timetable, Family Support
// posters, adult ESL guide, orientation guide, resort map and the Encanto photo/video folders); see
// docs/smeag-encanto-source-2026-11-23.md. Prices and offers come from smeag-encanto-pricing.ts, not from here.
// Never add the school's address, website, phone, QR codes, Wi-Fi details, bank details or agent commission.
// Keep this file pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it later.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
  GalleryImage,
  HolidayCalendar,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile, PhScheduleColumn, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import { SMEAG_HOLIDAYS_2027 } from '../smeag-holidays-2027';

export const ENCANTO_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

const asset = (folder: string, file: string) => `assets/smeag-encanto/${folder}/${file}.webp`;
/** A vertical phone clip in public/assets/smeag-encanto/videos/, with its poster frame. */
const clip = (file: string, title: string, text: string, duration: string): PhVideoItem => ({
  title, text, duration, shape: 'tall',
  src: `/assets/smeag-encanto/videos/${file}.mp4`,
  poster: `/assets/smeag-encanto/videos/${file}-poster.webp`,
});

const FAMILY_CAMP_IDS = ['family-2', 'family-3', 'family-4'] as const;
const SUPPORT_IDS = ['support-1g1c', 'support-2g1c', 'support-1g2c', 'support-2g2c', 'support-1g3c'] as const;
const ADULT_IDS = ['esl', 'esl2'] as const;

export const ENCANTO_PAGE = {
  shortName: 'SMEAG Encanto',
  title: '菲律宾宿务 SMEAG Encanto 海滨校区',
  breadcrumb: '菲律宾游学 / 宿务学校 / SMEAG Encanto',
  heroLead: '宿务麦克坦岛的海滨度假村校区，离机场约20分钟车程。寒暑假（1–2月、7–8月）是家长和孩子一起上课的全包亲子营；3–6月和9–12月开设淡季亲子和成人ESL课程。',
  heroTags: [
    { icon: 'beach_access', text: '麦克坦岛海滨' },
    { icon: 'family_restroom', text: '寒暑假亲子营' },
    { icon: 'school', text: '淡季成人ESL' },
    { icon: 'pool', text: '泳池有救生员' },
  ],
  overviewTitle: '30 秒看懂 SMEAG Encanto',
  advisorText: 'Encanto 是 SMEAG 在麦克坦岛的度假村校区，主打亲子游学：寒暑假是家长和孩子都上课的亲子营，整家一个价格，SSP、水电、洗衣和接机都已包含；淡季可以只让孩子上课、家长陪读。成人ESL只在淡季开课，不是斯巴达管理，晚上没有自习。想要斯巴达式管理或寒暑假读成人课程，可以看宿务市区的 SMEAG Capital 校区。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '寒暑假和淡季的课程不同：先看来的月份，再看谁上课。每门课下面是每天的课时，点开可看说明。',
  roomsPhotoIntro: '点选房型查看实景；成人课程住宿价格见上方住宿费表，亲子课程的家庭房已含在整家价格里。',
  finalCtaTitle: '想确认 SMEAG Encanto 的空房和正式报价？',
  finalCtaText: '把入学日期、周数、家里几位大人和孩子（孩子年龄）发给顾问，我们帮你核对学校当期价格、空房、优惠和到校费用。',
  overviewFacts: [
    { icon: 'location_on', label: '位置', value: '宿务麦克坦岛 Maribago，近 J Park，离机场约20分钟车程' },
    { icon: 'family_restroom', label: '寒暑假', value: '亲子营（1–2月、7–8月）：家长和孩子都上课，整家全包价' },
    { icon: 'event_available', label: '淡季', value: '3–6月、9–12月：淡季亲子（家长可不上课）或成人ESL／ESL2' },
    { icon: 'child_care', label: '孩子', value: '5岁以上上少儿课程，2–4岁上幼儿园课程' },
    { icon: 'rule', label: '管理', value: '非斯巴达，没有早晚自习；宵禁23:00–05:00' },
    { icon: 'event', label: '入学', value: '每周日入住，周一分级测试后开课；周六13:00前离校' },
    { icon: 'pool', label: '设施', value: '泳池（有救生员）、健身房、模拟高尔夫、图书馆、儿童游戏区' },
  ],
  quickInfo: [
    { icon: 'beach_access', title: '麦克坦岛海滨', text: '度假村校区，离机场约20分钟' },
    { icon: 'family_restroom', title: '寒暑假亲子营', text: '家长和孩子都上课，整家全包' },
    { icon: 'school', title: '淡季成人ESL', text: '3–6月、9–12月，非斯巴达' },
    { icon: 'pool', title: '度假村设施', text: '泳池、健身房和儿童游戏区' },
  ],
  basicInfo: [
    { label: '学校', value: 'SMEAG Global Education · Encanto 海滨校区' },
    { label: '位置', value: '菲律宾宿务麦克坦岛 Maribago 区' },
    { label: '管理方式', value: '非斯巴达，宵禁23:00–05:00' },
    { label: '课程', value: '寒暑假亲子营；淡季亲子、成人ESL和ESL2' },
    { label: '住宿', value: '成人单人、双人、三人间；亲子家庭房' },
    { label: '入学', value: '每周日入住' },
  ] satisfies BasicInfoRow[],
  suitableFor: ['寒暑假想带孩子一起学英语的家庭', '淡季想让孩子上课、家长陪读的家庭', '2–4岁幼儿也想一起来的家庭', '想在海边度假村轻松学英语的成年人'],
  notSuitableFor: ['想要斯巴达式早晚自习的人', '寒暑假想读成人课程的人（这时只开亲子营）', '想住在宿务市区、方便逛商场的人'],
  campusBuildings: [
    { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一对一隔间教室和小组教室', '图书馆和自习区', 'I CAN TALK 口语挑战区'] },
    { code: 'ROOMS', title: '住宿', icon: 'bed', facilities: ['成人单人、双人、三人间', '亲子家庭房，按家庭人数安排', '每周清洁一次（需申请）'] },
    { code: 'DINING', title: '餐厅与咖啡厅', icon: 'restaurant', facilities: ['学生餐厅（周一至周六三餐）', '户外餐吧 Resto bar', '咖啡厅'] },
    { code: 'LIFE', title: '休闲与儿童设施', icon: 'pool', facilities: ['泳池（有救生员）', '健身房、模拟高尔夫', '儿童游戏区和活动室'] },
  ] satisfies CampusBuildingCard[],
  galleryImages: [
    { category: '校园', title: 'Encanto 校区', description: '教学楼和泳池在同一个度假村里。', src: asset('campus', 'campus-pool-building') },
    { category: '校园', title: '校区入口', description: '进门就是泳池区。', src: asset('campus', 'campus-entrance-pool') },
    { category: '校园', title: '泳池', description: '度假村的泳池。', src: asset('campus', 'campus-pool') },
    { category: '校园', title: '草坪', description: '校区里的草坪。', src: asset('campus', 'campus-lawn') },
    { category: '校园', title: '校区步道', description: '连接各区域的步道。', src: asset('campus', 'campus-walkway') },
    { category: '校园', title: '前台', description: '学校前台。', src: asset('campus', 'reception') },
    { category: '校园', title: '校区平面图', description: '入口、宿舍、餐厅、泳池、儿童泳池和健身房的位置。', src: asset('campus', 'resort-map') },
    { category: '教室', title: '一对一教室', description: '一排一对一隔间教室。', src: asset('classroom', 'one-to-one-booths') },
    { category: '教室', title: '一对一隔间', description: '一位老师对一位学生。', src: asset('classroom', 'one-to-one-booth') },
    { category: '教室', title: '小组教室', description: '1:4和1:8小组课的教室。', src: asset('classroom', 'group-classroom') },
    { category: '教室', title: '教室', description: '小组课教室。', src: asset('classroom', 'classroom') },
    { category: '教室', title: '自习区', description: '课后可以在这里自习。', src: asset('classroom', 'study-lounge') },
    { category: '教室', title: '图书馆', description: '开放时间07:00–22:00。', src: asset('classroom', 'library') },
    { category: '教室', title: '图书馆自习区', description: '图书馆里的桌椅。', src: asset('classroom', 'library-study') },
    { category: '教室', title: 'I CAN TALK', description: 'I CAN TALK 英语口语挑战的展台。', src: asset('classroom', 'i-can-talk') },
    { category: '住宿', title: '三人间', description: '三张单人床和餐桌。', src: asset('rooms', 'triple-01') },
    { category: '住宿', title: '三人间', description: '三人间的床位。', src: asset('rooms', 'triple-02') },
    { category: '住宿', title: '三人间卫生间', description: '房间内的洗手台和淋浴间。', src: asset('rooms', 'triple-06') },
    { category: '住宿', title: '房间窗外', description: '从宿舍窗口看出去的泳池和草坪。', src: asset('rooms', 'triple-08') },
    { category: '住宿', title: '5–8人间', description: '多张单人床、餐桌和电视；两人家庭或人数多的家庭都可以安排，以学校分配为准。', src: asset('rooms', 'large-02') },
    { category: '住宿', title: '5–8人间', description: '床位和储物柜。', src: asset('rooms', 'large-03') },
    { category: '住宿', title: '5–8人间', description: '床位一侧。', src: asset('rooms', 'large-01') },
    { category: '住宿', title: '5–8人间卫生间', description: '房间内的卫生间。', src: asset('rooms', 'large-06') },
    { category: '餐厅', title: '学生餐厅', description: '周一至周六三餐，周日早午餐和晚餐。', src: asset('dining', 'dining-hall') },
    { category: '餐厅', title: '学生餐厅', description: '餐厅的另一侧。', src: asset('dining', 'dining-hall-2') },
    { category: '餐厅', title: '户外餐吧', description: 'Resto bar，每天12:00–23:00。', src: asset('dining', 'dining-terrace') },
    { category: '餐厅', title: '咖啡厅', description: '工作日08:00–20:00。', src: asset('dining', 'cafe') },
    { category: '设施', title: '泳池', description: '开放时间09:00–22:00，有救生员值守。', src: asset('facility', 'pool-lifeguard') },
    { category: '设施', title: '健身房', description: '06:00–23:00开放，13岁以下不能使用。', src: asset('facility', 'gym') },
    { category: '设施', title: '模拟高尔夫', description: '08:00–22:00，按小时收费。', src: asset('facility', 'screen-golf') },
    { category: '设施', title: '钢琴休息区', description: '课后坐坐的地方。', src: asset('facility', 'lounge') },
    { category: '设施', title: '洗衣房', description: '自助洗衣08:00–18:00。', src: asset('facility', 'laundry') },
    { category: '设施', title: '儿童游戏区', description: '给孩子玩的区域。', src: asset('facility', 'kids-zone') },
    { category: '设施', title: '儿童活动室', description: '孩子的室内活动空间。', src: asset('facility', 'kids-playroom') },
    { category: '设施', title: '儿童房', description: '孩子的室内空间。', src: asset('facility', 'kids-room') },
  ] satisfies GalleryImage[],
  albumDescriptions: {
    校园: '度假村校区、泳池与平面图',
    教室: '一对一、小组教室与图书馆',
    住宿: '三人间与5–8人间',
    餐厅: '学生餐厅、户外餐吧与咖啡厅',
    设施: '泳池、健身房和儿童设施',
  },
  heroCategories: ['校园', '设施', '住宿'] as const,
  // Short clips from the school's own video channel (宿务SMEAG). The 亲子活动课 clip is left out: a child's
  // T-shirt in it shows the flag of the Taiwan authorities (see AGENTS.md, Taiwan wording).
  // The two wide films come from SMEAG's official YouTube channels: the 2025 film is cut (no student names,
  // office screens, third-party brands or logo/website end card) and the campus tour has its www.smeag.com
  // tag covered and its end card removed; see docs/smeag-encanto-source-2026-11-23.md.
  videoTabs: [
    { label: '校园视频', videos: ['encanto-film-2025', 'campus-tour', 'entrance-lobby', 'pool', 'gym'] },
    { label: '课程视频', videos: ['one-to-one', 'group-class', 'classroom-area', 'textbooks'] },
    { label: '宿舍视频', videos: ['sea-view-room'] },
  ],
  videos: {
    'encanto-film-2025': {
      title: 'SMEAG Encanto 校园影片（2025）',
      text: '学校2025年官方影片：前台、教室、餐厅、泳池、海景宿舍和晚间活动；活动以学校实际安排为准。',
      src: '/assets/smeag-encanto/videos/encanto-film-2025.mp4',
      poster: '/assets/smeag-encanto/videos/encanto-film-2025-poster.webp',
      duration: '2:53',
      shape: 'wide',
    },
    'campus-tour': {
      title: 'SMEAG Encanto 校园导览',
      text: '跟着镜头看度假村校区的宿舍、教室、健身房、泳池和餐厅。',
      src: '/assets/smeag-encanto/videos/campus-tour.mp4',
      poster: '/assets/smeag-encanto/videos/campus-tour-poster.webp',
      duration: '2:35',
      shape: 'wide',
    },
    'entrance-lobby': clip('entrance-lobby', '校园入口和前台', '从草坪和教学楼外观，一路走进前台和大厅。', '0:29'),
    pool: clip('pool', '泳池和休息区', '泳池边的休息座椅和大草坪。', '0:23'),
    gym: clip('gym', '健身房', '器械区和自由重量区；13岁以下不能使用。', '0:26'),
    'one-to-one': clip('one-to-one', '一对一教室', '一对一隔间：一位老师对一位学生。', '0:26'),
    'group-class': clip('group-class', '小组课', '透过玻璃门看小组课上课的样子。', '0:26'),
    'classroom-area': clip('classroom-area', '教室区域', '教学区走廊和正在上课的隔间教室。', '0:14'),
    textbooks: clip('textbooks', '亲子课程教材', '亲子课程的教材书架，按等级分类摆放。', '0:13'),
    'sea-view-room': clip('sea-view-room', '海景房', '宿舍楼高层朝海的房间：床位、衣柜、窗外的海和卫生间。房型和楼层由学校安排。', '0:52'),
  } satisfies Record<string, PhVideoItem>,
  roomProfiles: [
    {
      id: 'encanto-triple',
      label: '三人间',
      location: '校内',
      suitable: '想控制预算、又想有自己床位和储物空间的成人学生',
      note: '三人一间，含三餐；另收度假村设施费50美元／周。',
      highlights: ['空调、衣柜、书桌和小冰箱', '房间内卫生间和淋浴'],
      rateIds: ['triple'],
      image: asset('rooms', 'triple-01'),
      gallery: ['01', '02', '03', '04', '05', '06', '07', '08'].map(n => asset('rooms', `triple-${n}`)),
      imageAlt: 'SMEAG Encanto 三人间实景',
    },
  ] satisfies PhRoomProfile[],
  courseGroups: [
    { icon: 'family_restroom', title: '亲子课程（家长和孩子都上课）', text: '寒暑假是全包亲子营，淡季整家价更低', courseIds: FAMILY_CAMP_IDS },
    { icon: 'escalator_warning', title: '淡季亲子（家长不上课）', text: '3–6月、9–12月，只孩子上课', courseIds: SUPPORT_IDS },
    { icon: 'school', title: '成人ESL（淡季）', text: '3–6月、9–12月，仅限成人', courseIds: ADULT_IDS },
  ],
  courseHighlights: {
    'family-2': { badge: '寒暑假全包价' },
    'family-3': { badge: '寒暑假全包价' },
    'family-4': { badge: '寒暑假全包价' },
  } as Readonly<Record<string, { badge: string; icon?: string; label?: string; text?: string }>>,
  courseDetailGuides: [
    {
      icon: 'family_restroom', title: '亲子课程（家长和孩子都上课）', subtitle: 'Family Camp', courseIds: FAMILY_CAMP_IDS,
      facts: [
        { label: '寒暑假', value: '2027/01/03–02/27、06/27–08/28，整家全包价' },
        { label: '淡季', value: '同样的课程，整家价格更低，到校学杂费按每人另付' },
        { label: '寒暑假包含', value: '注册、课程、宿舍、三餐、管理费、每周清洁、洗衣、SSP、SSP I-Card、5周以上签证、水电和接机' },
        { label: '不含', value: '机票、保险、周末活动、零花钱和送机' },
      ],
      points: [
        '孩子：4节一对一（听说读写）＋2节1:4讨论＋2节1:8词汇，另有游泳、讲故事、烹饪、美术、舞蹈等活动课，不留作业。',
        '家长：2节一对一＋2节1:8，下午自由安排，也可以免费参加特别课程。',
        '2–4岁孩子上幼儿园课程：自然拼读、主题探索、故事、音乐律动和午休。',
        '寒暑假1–3周按4周价格的45%／65%／85%计算；淡季至少4周，可报4–8周，按4周价格折算。家人读的周数不同时，每人按自己的周数计算，请让顾问报价。',
      ],
    },
    {
      icon: 'escalator_warning', title: '淡季亲子（家长不上课）', subtitle: 'Family Support', courseIds: SUPPORT_IDS,
      facts: [
        { label: '开设时间', value: '2027/03/01–06/25、08/30–12/31' },
        { label: '周数', value: '4–8周' },
        { label: '整家价格包含', value: '注册、孩子课程、宿舍和三餐' },
        { label: '另付', value: '到校学杂费按每人计算；首套教材免费' },
      ],
      points: [
        '孩子的课程和亲子营一样，2–4岁孩子上幼儿园课程。',
        '家长不上课，可以免费参加下午的特别课程。',
        '淡季亲子的价格没有额外折扣；老学员每人免100美元注册费。',
      ],
    },
    {
      icon: 'school', title: '成人ESL／ESL2', subtitle: '仅限淡季、成人', courseIds: ADULT_IDS,
      facts: [
        { label: '等级', value: 'Beginner（A1）到 Advanced（C1）共五级' },
        { label: '管理', value: '非斯巴达，没有早晚自习' },
        { label: '度假村设施费', value: '单人间100、双人间75、三人间50美元／周，不打折' },
      ],
      points: [
        'ESL2比ESL多晚上2节一对一口语（19:00–20:35）；周四模拟考试、周五毕业典礼，这两晚没有。',
        '下午的特别课程有音乐与情景喜剧、英语表达、口语提升、电影和发音等，自愿参加。',
        '课程顺序仅供参考，具体以学校课表为准。',
      ],
    },
    {
      icon: 'fact_check', title: '分级测试、模拟考试与换课', subtitle: '所有课程',
      facts: [
        { label: '第一天', value: '周一09:00–10:30分级测试，周二08:40开始上课' },
        { label: '模拟考试', value: '周四19:00；成人ESL每周必考，亲子课程每4周的第2、4周必考' },
        { label: '换课', value: '拿到课表1周后可申请，周四09:00–18:00提交，不另收费' },
        { label: '结业', value: '最后一周周五18:30毕业典礼，出勤率80%以上发结业证书' },
      ],
      points: [
        '小组课不能改成一对一；想多上一对一可以另付费加课。',
        'BEST 课外计划：少儿按等级完成写作宾果任务，成人做20天英文写作，在一对一课上复习。',
        '迟到超过5分钟算缺勤；菲律宾公共假期不上正课，学校视情况开假日特别课程。',
      ],
    },
  ] satisfies CourseDetailGuide[],
  compareShortcutCourseHint: '如ESL和ESL2',
  faqs: [
    {
      question: '亲子营和淡季亲子有什么区别？',
      answer: '亲子营在寒暑假（2027/01/03–02/27、06/27–08/28），家长和孩子都要上课，整家一个全包价，SSP、签证、水电、洗衣和接机都已包含。淡季（3–6月、9–12月）可以选家长也上课，或只让孩子上课（淡季亲子），整家价格含注册、课程、宿舍和三餐，到校学杂费按每人另付。',
    },
    {
      question: '思达启航有什么优惠？',
      answer: '成人ESL／ESL2的课程费和住宿费享思达启航9折（度假村设施费和注册费不打折），另有学校的淡季每周优惠。寒暑假亲子营每人每周优惠25美元（每人每4周100美元）。淡季亲子课程学校规定不能再打折。学习期间涉及2026/12/20–2027/01/02且至少4周的，成人和亲子课程每人再减100美元圣诞优惠。报价器会自动计算。',
    },
    {
      question: '度假村设施费是什么？',
      answer: '成人ESL学生住宿另收的度假村设施费（Resort Fee）：单人间100、双人间75、三人间50美元／周，用于海滨校区的环境和设施，不参与任何折扣。亲子课程的整家价格已含，不另收。',
    },
    {
      question: '页面上的报价包含哪些费用？',
      answer: '学校费用（注册费、课程费、住宿费、度假村设施费和优惠）以美元计；到校后学杂费（SSP学习许可、签证续签、管理费、水电等）以比索在学校缴纳，两部分分开显示。寒暑假亲子营的学杂费已含在整家价格里。接机、押金和教材另列，不计入合计。',
    },
    {
      question: '送机怎么安排？',
      answer: '学校2027年3月起不再提供免费送机，需要自己安排或另付费请学校安排。寒暑假亲子营含接机，不含送机。去机场打车约200–400比索，建议用 Grab。',
    },
    {
      question: '家里每个人读的周数不一样怎么算？',
      answer: '每位家庭成员按自己实际学习的周数计算：读4周的按4周价格，读3周的按85%，读1周的按45%。寒暑假和淡季跨在一起时，两段分别按各自价格计算，SSP、SSP I-Card和接机只交一次。这类报价请发给顾问计算。',
    },
    {
      question: '老学员回来读要交注册费吗？',
      answer: '不用。老学员每人免100美元注册费；亲子课程按家庭里的老学员人数扣减，在报价器“学生情况”里选择即可。',
    },
    {
      question: '寒暑假可以读成人ESL吗？',
      answer: '不可以。Encanto 寒暑假（1–2月、7–8月）只开亲子营，成人ESL和ESL2只在3–6月、9–12月开课。寒暑假想读成人课程，可以看宿务市区的 SMEAG Capital 校区。',
    },
  ] satisfies FaqItem[],
};

/** Daily timetables (school files: Family Camp guide, 2–4-year-old timetable, adult ESL guide). */
const row = (time: string, activity: string, kind: DailyScheduleRow['kind']): DailyScheduleRow => ({ time, activity, kind });

export const ENCANTO_SCHEDULE_COLUMNS: readonly PhScheduleColumn[] = [
  {
    code: 'CHILD', title: '孩子（5岁以上）', rows: [
      row('07:45–09:00', '早餐', 'meal'),
      row('08:40–12:00', '4节一对一（听、说、读、写）', 'class'),
      row('12:00–13:00', '午餐', 'meal'),
      row('13:00–14:35', '2节1:4讨论课', 'class'),
      row('14:45–16:20', '2节1:8词汇课', 'class'),
      row('16:30–18:05', '活动课：游泳、讲故事、烹饪、美术、舞蹈等', 'activity'),
      row('18:05–19:00', '晚餐', 'meal'),
    ],
  },
  {
    code: 'PARENT', title: '家长', rows: [
      row('07:45–09:00', '早餐', 'meal'),
      row('上午', '2节一对一＋2节1:8（具体时间以课表为准）', 'class'),
      row('12:00–13:00', '午餐', 'meal'),
      row('下午', '自由安排，可免费参加特别课程', 'free'),
      row('17:45–19:00', '晚餐', 'meal'),
    ],
  },
  {
    code: 'TODDLER', title: '幼儿园（2–4岁）', rows: [
      row('07:45–08:40', '早餐', 'meal'),
      row('08:40–09:30', '签到、晨间活动', 'activity'),
      row('09:30–10:20', '自然拼读启蒙', 'class'),
      row('10:20–11:00', '拼读练习册', 'class'),
      row('11:00–11:50', '主题探索：艺术、科学、手工、烹饪、电影', 'class'),
      row('12:00–13:00', '午餐', 'meal'),
      row('13:00–13:20', '故事时间', 'class'),
      row('13:20–14:50', '午休', 'free'),
      row('14:50–15:20', '加餐', 'meal'),
      row('15:20–15:45', '音乐律动', 'class'),
      row('16:00–17:00', '活动课', 'activity'),
      row('17:00–18:00', '离开准备', 'free'),
    ],
  },
  {
    code: 'ADULT', title: '成人ESL', rows: [
      row('07:45–09:00', '早餐', 'meal'),
      row('08:40–12:00', '4节一对一（口语、听力、阅读、写作）', 'class'),
      row('12:00–13:00', '午餐', 'meal'),
      row('13:00–14:35', '2节1:4讨论课', 'class'),
      row('14:45–18:05', '特别课程：音乐与情景喜剧、英语表达、口语提升、电影、发音', 'activity'),
      row('17:45–19:00', '晚餐', 'meal'),
      row('19:00–20:35', 'ESL2：2节一对一口语（周一至周三）', 'class'),
    ],
  },
];

/** Encanto's 2027 holidays: only New Year's Day is a full day off; the others have Best Holiday Classes. */
export const ENCANTO_HOLIDAY_CALENDARS: HolidayCalendar[] = [{
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: Array.from({ length: 12 }, (_, index) => index + 1)
    .map(month => ({
      month,
      holidays: SMEAG_HOLIDAYS_2027
        .filter(holiday => holiday.month === month)
        .map(holiday => ({
          day: `${holiday.day}日`,
          name: `${holiday.holidayZh}${holiday.encanto.status === 'closed' ? '（停课）' : '（假日特别课）'}`,
        })),
    }))
    .filter(month => month.holidays.length),
}];

export const ENCANTO_DORM_RULES: ReadonlyArray<{ title: string; text: string }> = [
  { title: '宵禁', text: '23:00–05:00不能外出；校内24小时监控。' },
  { title: '饮食', text: '不能把食物带进房间；咖啡厅、校内餐厅和公用冰箱不能放酒。' },
  { title: '房卡与换房', text: '房卡丢失补办1,000比索；换房500比索，家庭1,000比索。' },
  { title: '清洁与洗衣', text: '每周可申请打扫房间一次；工作日08:00–10:00交洗衣，2–3天取回，自助洗衣08:00–18:00。' },
  { title: '泳池与健身房', text: '泳池09:00–22:00有救生员，孩子在深水区须穿救生衣；健身房13岁以下不能使用。' },
];

export const ENCANTO_PRACTICAL_GUIDES: readonly CampusPracticalGuide[] = [
  {
    icon: 'flight_land', eyebrow: 'ARRIVAL', title: '到校第一天',
    facts: [
      { label: '入住', value: '周日；周一09:00分级测试，之后有监护人说明会' },
      { label: '接机', value: '1,200比索／人（寒暑假亲子营已含）' },
      { label: '送机', value: '2027年3月起学校不再免费送机' },
    ],
    note: '周一下午拍SSP学习许可的照片；SSP申请表上的姓名和签名须和护照完全一致。',
  },
  {
    icon: 'restaurant', eyebrow: 'MEALS', title: '用餐与校内消费',
    facts: [
      { label: '工作日', value: '早餐07:45–09:00，午餐11:45–13:00，晚餐17:45–19:00' },
      { label: '周日', value: '早午餐10:30–13:00，晚餐17:45–19:00' },
      { label: '校内付款', value: '无现金校园，用E-money卡（比索充值）' },
    ],
    note: '咖啡厅工作日08:00–20:00，户外餐吧每天12:00–23:00；到校学杂费也可以用E-money卡缴纳。',
  },
  {
    icon: 'sports_golf', eyebrow: 'FACILITIES', title: '校内设施',
    facts: [
      { label: '泳池', value: '09:00–22:00，有救生员' },
      { label: '健身房', value: '06:00–23:00，13岁以下不能使用' },
      { label: '模拟高尔夫', value: '08:00–22:00，每小时600比索（1–6人），孩子须由监护人陪同' },
      { label: '图书馆', value: '07:00–22:00' },
    ],
    note: '孩子的游泳活动课要冲澡换衣，会比原定时间早约30分钟结束。',
  },
  {
    icon: 'logout', eyebrow: 'CHECK-OUT', title: '离校与额外住宿',
    facts: [
      { label: '离校手续', value: '周四14:00到周五17:00办理' },
      { label: '离校时间', value: '周六13:00前' },
      { label: '额外住宿', value: '因航班提前到或延后走1,500比索／人／晚；访客2,000比索／人／晚' },
    ],
    note: '办离校手续时退还E-money卡余额、结算押金并归还护照；实际用电超出已缴电费需另付。',
  },
  {
    icon: 'local_taxi', eyebrow: 'GOING OUT', title: '周末出行',
    facts: [
      { label: '去 SM Seaside', value: '出租车约400–700比索' },
      { label: '去机场', value: '出租车约200–400比索' },
    ],
    note: '建议用 Grab 叫车；跟司机说 Maribago 的 Encanto，近 J Park。周末活动另付实际费用。',
  },
];
