// Text and data of the Philinter page, from the school's Google Drive pack “Philinter 2026-2027” (2026 brochure,
// 2026-10-19 student handbook, new-student guides for the dormitory and Azon, 2026-10-19 local-fee sheet, 2027
// holiday poster, December 2026 make-up notice, business permit, immigration accreditation and TESDA program
// registration) and the 2025 Chinese brochure; received 2026-11-24. The shared Philippine school template reads this
// module through philinter-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini
// program can reuse it. Never add the school's phone, address, website, social accounts, Wi-Fi passwords or its
// nationality chart, nor the handbook's agency rules (extensions only through the original agency).
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
import type { PhRoomProfile, PhScheduleColumn, PhStudyMode } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const PHILINTER_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const PHILINTER_PAGE_TEXT = {
  heroLead: '2003年创办的老牌学校，在宿务麦克坦岛，离机场很近。斯巴达和半斯巴达课程都有，雅思、托业和口语课程完整，校内可考官方雅思。',
  advisorText: 'Philinter 适合重视老师和学习风气的成人：每位学生有一位一对一老师做 Buddy Teacher，跟进出勤和学习；雅思、托业都有保分班，雅思官方考试可以在校内考。强化ESL、雅思等斯巴达课程周一至周四晚上有必修晚自习，综合ESL、轻松ESL、商务和托业常规是半斯巴达，下课后时间自己安排。校内宿舍有门禁，想要更自由可以住校外的 Azon 公寓。',
  campusIntro: '教学楼、宿舍、餐厅和泳池都在一个校园里，自习室每天开到午夜；校外的 Azon 公寓在 Marina Mall 附近，上课日有接送车。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。斯巴达课程周一至周四晚上有必修晚自习。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 Philinter 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const PHILINTER_QUICK_INFO = [
  { icon: 'history_edu', title: '2003年创办', text: '宿务的老牌语言学校' },
  { icon: 'flight_land', title: '近宿务机场', text: '在麦克坦岛拉普拉普市，步行约5分钟到商场' },
  { icon: 'rule', title: '斯巴达／半斯巴达', text: '按所选课程，斯巴达课程有必修晚自习' },
  { icon: 'workspace_premium', title: '雅思和托业保分班', text: '校内可考官方雅思（学术类纸笔考试）' },
  { icon: 'support_agent', title: 'Buddy Teacher', text: '一位一对一老师跟进出勤、请假和换课' },
  { icon: 'bed', title: '2类住宿', text: '校内宿舍单人到三人间，校外 Azon 公寓' },
];

/** Key facts under the hero title (compact layout). */
export const PHILINTER_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务麦克坦岛拉普拉普市，离宿务机场很近' },
  { icon: 'rule', label: '管理', value: '斯巴达课程周一至周四19:00–21:00必修晚自习；半斯巴达课后自由安排' },
  { icon: 'menu_book', label: '课程', value: 'ESL、口语、雅思、托业、商务英语、PTE和青少年课程' },
  { icon: 'workspace_premium', label: '考试', value: '雅思、托业保分班；每周雅思和托业模考；校内可考官方雅思' },
  { icon: 'event', label: '入学', value: '每周日入住，周一入学测验，周二开课' },
  { icon: 'bed', label: '住宿', value: '校内单人、双人、三人间；校外 Azon 公寓没有门禁' },
  { icon: 'schedule', label: '门禁', value: '校内宿舍周日至周四22:00，周五、周六和假日前一天24:00' },
];

export const PHILINTER_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'Philinter Academy（菲律宾宿务Philinter语言学校）' },
  { label: '位置', value: '菲律宾宿务麦克坦岛拉普拉普市' },
  { label: '创办', value: '2003年' },
  { label: '管理方式', value: '斯巴达和半斯巴达，按所选课程' },
  { label: '课程', value: 'ESL、口语、雅思、托业、商务英语、PTE和青少年课程' },
  { label: '住宿', value: '校内宿舍；校外 Azon 公寓' },
];

export const PHILINTER_SUITABLE_FOR = [
  '想考雅思或托业、需要保分班的学生',
  '希望有老师跟进出勤和学习的成人',
  '想住得离机场近、周末方便出行的学生',
  '想住校外公寓、自己安排生活的成人',
];

export const PHILINTER_NOT_SUITABLE_FOR = [
  '想住新建度假村式校园的学生（Philinter是老牌校园）',
  '不想遵守门禁和出勤规定的学生（Azon公寓没有门禁）',
  '未满18岁、没有监护人陪读的学生',
];

/** What each area of the campus has (2026 handbook and new-student guides); shown as the campus strip in the hero. */
export const PHILINTER_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'SCHOOL', title: '教学楼', icon: 'school', facilities: ['1楼一对一教室、视听教室、办公室', '2楼一对一教室和团体教室', '自习室每天06:00–24:00'] },
  { code: 'DORM', title: '校内宿舍', icon: 'bed', facilities: ['单人、双人、三人间', '每周打扫1–2次', '门禁22:00（周五、周六24:00）'] },
  { code: 'DINING', title: '餐厅与咖啡厅', icon: 'restaurant', facilities: ['每天三餐自助', '素食和清真餐报名时申请', '咖啡厅（另付费）'] },
  { code: 'POOL', title: '泳池', icon: 'pool', facilities: ['平日17:00–21:00', '周末和假日10:00–21:00', '须穿泳衣，禁止跳水'] },
];

export const PHILINTER_QUOTE_IMAGE_HERO = '/assets/philinter/campus-main.webp';
const asset = (file: string) => `assets/philinter/${file}.webp`;
const gallery = (file: string) => `assets/philinter/gallery/${file}.webp`;
const room = (file: string) => `assets/philinter/rooms/${file}.webp`;

export const PHILINTER_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'Philinter 校园', description: '教学楼、宿舍和餐厅都在校内。', src: PHILINTER_QUOTE_IMAGE_HERO.slice(1) },
  { category: '校园', title: '宿舍楼与泳池', description: '红白相间的宿舍楼就在泳池旁。', src: gallery('campus-dorm-pool-01') },
  { category: '校园', title: '泳池', description: '在宿舍和咖啡厅之间，平日17:00–21:00开放。', src: asset('campus-pool') },
  { category: '校园', title: '教学楼一楼大厅', description: '旋转楼梯和服务台。', src: gallery('lobby-1f-01') },
  { category: '校园', title: '教学楼二楼大厅', description: '课间可以在这里休息。', src: gallery('lobby-2f-01') },
  { category: '校园', title: '瑜伽课', description: '课后的瑜伽活动。', src: gallery('yoga-01') },
  { category: '校园', title: '尊巴舞活动', description: '学员和老师一起在校园里跳尊巴舞。', src: gallery('zumba-01') },
  { category: '校园', title: '尊巴舞活动', description: '宿舍楼前的户外舞蹈。', src: gallery('zumba-02') },
  { category: '校园', title: '尊巴舞活动合影', description: '参加活动的师生合影。', src: gallery('zumba-03') },
  { category: '校园', title: '音乐社', description: '学员拿着话筒唱歌，同学在一旁看。', src: gallery('music-club-01') },
  { category: '校园', title: '音乐社', description: '在视听教室里唱歌。', src: gallery('music-club-02') },
  { category: '校园', title: '音乐社', description: '学员在大家面前演唱。', src: gallery('music-club-03') },
  { category: '校园', title: 'English Day', description: '学员穿上希腊神话服装上台。', src: gallery('english-day-01') },
  { category: '校园', title: 'English Day', description: '学员在台上用英语主持和发言。', src: gallery('english-day-02') },
  { category: '校园', title: 'English Day', description: '情人节主题活动。', src: gallery('english-day-03') },
  { category: '教室', title: '一对一教室', description: '小隔间里一张桌子、两把椅子。', src: gallery('one-on-one-room-01') },
  { category: '教室', title: '一对一课堂', description: '老师和学员一对一上课。', src: gallery('one-on-one-class-01') },
  { category: '教室', title: '小组课教室', description: '课桌椅、电视和白板。', src: gallery('group-room-01') },
  { category: '教室', title: '小组课课堂', description: '老师给一组学员上课。', src: gallery('group-class-01') },
  { category: '教室', title: '视听教室', description: '大班课和活动用的阶梯式教室。', src: gallery('av-room-01') },
  { category: '教室', title: '斯巴达晚间辅导', description: '老师在白板前讲解。', src: gallery('sparta-evening-01') },
  { category: '教室', title: '斯巴达晚间辅导', description: '学员在计时下做练习。', src: gallery('sparta-evening-02') },
  { category: '教室', title: '雅思模拟考', description: '屏幕计时，按正式考试流程作答。', src: gallery('ielts-mock-01') },
  { category: '教室', title: '雅思模拟考', description: '从窗外看考场。', src: gallery('ielts-mock-02') },
  { category: '教室', title: '青少年课堂', description: '孩子们在课上画画、做手工。', src: gallery('sgc-junior-01') },
  { category: '教室', title: '青少年课堂', description: '老师拿着手工面具讲解。', src: gallery('sgc-junior-02') },
  { category: '教室', title: '商务英语演讲', description: '学员在视听教室听商务演讲。', src: gallery('business-presentation-01') },
  { category: '教室', title: '商务英语演讲', description: '学员拿着话筒做演讲。', src: gallery('business-presentation-02') },
  { category: '住宿', title: '宿舍走廊', description: '校内宿舍楼的走廊和楼梯。', src: gallery('dorm-corridor-01') },
  { category: '住宿', title: '宿舍大厅', description: '宿舍楼大厅的服务台和楼梯。', src: gallery('dorm-lobby-01') },
  { category: '住宿', title: 'Azon 公寓大楼', description: '校外公寓，上课日和周六上午有接送车。', src: asset('condo-room') },
  { category: '住宿', title: 'Azon 公寓健身房', description: '公寓二楼的健身房。', src: gallery('azon-gym-01') },
  { category: '餐厅', title: '学生餐厅', description: '每天三餐自助。', src: gallery('dining-hall-01') },
  { category: '餐厅', title: '自助餐菜品', description: '炸鸡腿。', src: gallery('meal-01') },
  { category: '餐厅', title: '自助餐菜品', description: '蔬菜炒面。', src: gallery('meal-02') },
  { category: '餐厅', title: '自助餐菜品', description: '酱汁豆腐。', src: gallery('meal-03') },
  { category: '餐厅', title: '自助餐水果', description: '山竹。', src: gallery('meal-04') },
  { category: '餐厅', title: '素食餐', description: '紫菜饭卷、玉米、青菜和木瓜。', src: gallery('vegetarian-01') },
  { category: '餐厅', title: '素食餐', description: '米饭、豆腐、鸡蛋、菠菜和橙子。', src: gallery('vegetarian-02') },
  { category: '餐厅', title: '咖啡厅', description: '和泳池相连，另付费。', src: gallery('cafe-01') },
  { category: '餐厅', title: '咖啡厅外露台', description: '对面是宿舍楼。', src: gallery('cafe-02') },
  { category: '设施', title: '泳池夜景', description: '晚上亮灯的泳池和宿舍楼。', src: gallery('pool-night-01') },
  { category: '设施', title: '泳池夜景', description: '泳池边的海豚雕塑。', src: gallery('pool-night-02') },
  { category: '设施', title: '自习室', description: '每天06:00–24:00开放，也是校内雅思考场。', src: gallery('study-room-01') },
  { category: '设施', title: '洗衣房', description: '送洗按公斤收费。', src: gallery('laundry-01') },
];

export const PHILINTER_ALBUM_DESCRIPTIONS = {
  校园: '校园、大厅和课外活动',
  教室: '一对一、小组课和模拟考',
  住宿: '校内宿舍与 Azon 公寓',
  餐厅: '自助餐、素食和咖啡厅',
  设施: '泳池、自习室与洗衣房',
} as const;

/**
 * A Philinter clip in public/assets/philinter/videos/ (H.264, poster `<name>-poster.webp`), from the school's own
 * pack and channels. Clips were cut before social-media handles, a website card, shop signs and an email address,
 * or the handles were removed with ffmpeg delogo (IELTS course, Timmy); Sunny's interview ends before its outreach
 * scene with local children; the 中国台湾 bar in the pronunciation interview is covered with a gray mosaic. Check every frame of a new clip for
 * other companies, contact details and the Taiwan wording rule.
 */
export interface PhilinterVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  /** Hero album group. */
  topic: '校园' | '宿舍' | '课程' | '活动' | '学员访谈';
  /** Room profile whose photo album this clip opens; only a clip of exactly that room type. */
  roomProfileId?: string;
}

export const PHILINTER_VIDEOS: PhilinterVideo[] = [
  {
    name: 'campus-tour-2026', title: '2026校园航拍导览', topic: '校园', duration: '1:10', orientation: 'landscape',
    description: '2026年航拍：教学楼、宿舍楼、泳池和 CBT 楼（一楼咖啡厅和洗衣店，楼上是雅思官方考点）。',
  },
  {
    name: 'school-overview-2026', title: '学校全览：课程、老师与住宿', topic: '校园', duration: '2:06', orientation: 'landscape',
    description: '2026年：一对一和小组课、晚自习、商务演讲、雅思和托业模考，再看老师团队、校内宿舍和 Azon 公寓。',
  },
  {
    name: 'international-staff', title: '国际管理团队', topic: '校园', duration: '1:57', orientation: 'landscape',
    description: '2026年：有负责中国学员的经理，也有越南、日本、蒙古和泰国学员的工作人员，从接机到日常咨询都有人帮忙。',
  },
  {
    name: 'campus-facilities', title: '校园设施速览', topic: '校园', duration: '0:20', orientation: 'landscape',
    description: '泳池、大小班教室、一对一教室、视听教室、自习室、休息区、宿舍、餐厅和咖啡厅。',
  },
  {
    name: 'azon-condo', title: 'Azon 公寓', topic: '宿舍', duration: '0:24', orientation: 'landscape',
    description: '公寓外观、双人间、单人间、厨房、洗衣、健身房、泳池和顶层露台。',
  },
  {
    name: 'azon-condo-portrait', title: 'Azon 公寓（竖版）', topic: '宿舍', duration: '0:45', orientation: 'portrait',
    description: '房间、厨房、卫生间、两种床型、二楼健身房和接送车。',
  },
  {
    name: 'ielts-course', title: '雅思课程介绍', topic: '课程', duration: '1:30', orientation: 'landscape',
    description: '2025年，雅思课负责人 Goen 老师介绍：35位老师雅思7.5–8.0分；一对一练阅读和口语，小组课练听力、词汇和语法；每周模考后有学习咨询。',
  },
  {
    name: 'sgc-speech-and-sound', title: '精品小组课：发音', topic: '课程', duration: '0:33', orientation: 'landscape',
    description: 'Speech and Sound 发音课的课堂片段。',
  },
  {
    name: 'junior-speaking-week1', title: '青少年精品口语：第一周', topic: '课程', duration: '1:05', orientation: 'landscape',
    description: '孩子们轮流上台读自己写的故事，老师逐一提问点评。',
  },
  {
    name: 'junior-pe-class', title: '青少年精品口语：体育课', topic: '课程', duration: '1:09', orientation: 'landscape',
    description: '用英语说说体育课的意义，再到场地上做球类活动。',
  },
  {
    name: 'business-presentation', title: '进阶商务英语：演讲', topic: '课程', duration: '0:59', orientation: 'landscape',
    description: '2024年，进阶商务英语学员在视听教室做商务演讲。',
  },
  {
    name: 'english-day-feud-off', title: 'English Day 问答竞赛', topic: '活动', duration: '0:54', orientation: 'landscape',
    description: '2024年9月 English Day，学员分队参加问答比赛。',
  },
  {
    name: 'review-serena', title: '越南学员：进阶商务英语的演讲练习', topic: '学员访谈', duration: '1:58', orientation: 'landscape',
    description: '2026年，越南学员说说进阶商务英语课的演讲练习，她在学校做完演讲后收到另一家公司的讲师邀请。',
  },
  {
    name: 'review-timmy', title: '中国大陆学员：两周口语进步', topic: '学员访谈', duration: '1:11', orientation: 'landscape',
    description: '2026年，中国大陆学员学了两周，说说口语的进步，以及他喜欢的自习室、泳池边学习区和自助餐。',
  },
  {
    name: 'review-sunny-hayoon', title: '学员访谈：老学员带女儿回来', topic: '学员访谈', duration: '1:52', orientation: 'landscape',
    description: '2024年，15年前在这里读过书的妈妈带女儿回来上课，说说老师怎样按需求安排重点，以及为什么再次选这里。',
  },
  {
    name: 'review-olivia-luna', title: '学员访谈：亲子家庭', topic: '学员访谈', duration: '1:41', orientation: 'landscape',
    description: '2024年，妈妈带女儿一起来上课，两人分别说说上课和校园生活的感受。',
  },
  {
    name: 'review-amy', title: '中国大陆学员：在校学习感受', topic: '学员访谈', duration: '1:09', orientation: 'landscape',
    description: '2024年，中国大陆学员说说在校学习的感受，穿插上课画面。',
  },
  {
    name: 'review-sand', title: '泰国学员：兼顾学习和放松', topic: '学员访谈', duration: '0:48', orientation: 'landscape',
    description: '2024年，泰国学员（综合ESL）说说怎么兼顾学习和放松。',
  },
  {
    name: 'review-zombi', title: '蒙古学员：泳池边聊学习', topic: '学员访谈', duration: '0:45', orientation: 'landscape',
    description: '2024年，蒙古学员在泳池边分享学习体验。',
  },
  {
    name: 'review-sgc-pronunciation', title: '学员访谈：发音小组课', topic: '学员访谈', duration: '1:44', orientation: 'landscape',
    description: '中国大陆、韩国和中国台湾的三位学员说说发音小组课。',
  },
];
export const philinterVideoSrc = (video: PhilinterVideo) => `/assets/philinter/videos/${video.name}.mp4`;
export const philinterVideoPoster = (video: PhilinterVideo) => `/assets/philinter/videos/${video.name}-poster.webp`;

const DORM_COMMON = ['每周打扫1–2次，每两周可免费换一次床单', '用电每人每周20度，超出每度25比索', '门禁周日至周四22:00，周五、周六和假日前一天24:00'];
const AZON_COMMON = ['没有门禁', '可以自己做饭：微波炉、炉具、厨具和餐具', '房内有洗衣机', '没有Wi-Fi，可向学校租随身Wi-Fi', '上课日和周六上午有接送车'];
const AZON_SUITABLE = '想要更自由、自己安排生活的成人';
const AZON_NOTE = '步行约8–9分钟到 Marina Mall；公寓的泳池和健身房由物业决定是否开放。';
/** Photos of the whole Azon unit and building, shown after each Azon room's own photos. */
const AZON_SHARED_PHOTOS = [room('azon-kitchen-01'), room('azon-bathroom-01'), room('azon-shower-01'), gallery('azon-gym-01'), asset('condo-room')];

export const PHILINTER_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'dorm-single', rateIds: ['in-campus-single'], label: '校内单人间', location: '校内',
    suitable: '重视隐私、想安静学习的学生', note: '房间按报名房型分配，不能指定楼层和朝向；各房间墙色和布置略有不同。',
    highlights: DORM_COMMON, image: room('in-campus-single-01'),
    gallery: [room('in-campus-single-01'), room('in-campus-single-02'), room('in-campus-single-03'), room('in-campus-single-04'), room('in-campus-single-bath-01')],
    imageAlt: 'Philinter 校内单人间',
  },
  {
    id: 'dorm-twin', rateIds: ['in-campus-twin'], label: '校内双人间', location: '校内',
    suitable: '朋友同行，或想兼顾预算和隐私的学生', note: '房间按报名房型分配，不能指定室友。',
    highlights: DORM_COMMON, image: room('in-campus-twin-01'), gallery: [room('in-campus-twin-01'), room('in-campus-twin-02')],
    imageAlt: 'Philinter 校内双人间',
  },
  {
    id: 'dorm-triple', rateIds: ['in-campus-triple'], label: '校内三人间', location: '校内',
    suitable: '预算优先、想多和同学交流的学生', note: '一张上下铺加一张单人床；房间按报名房型分配，不能指定室友。',
    highlights: DORM_COMMON, image: room('in-campus-triple-01'), gallery: [room('in-campus-triple-01'), room('in-campus-triple-02')],
    imageAlt: 'Philinter 校内三人间',
  },
  {
    id: 'azon-single', rateIds: ['azon-single'], label: 'Azon 公寓单人间', location: '校外',
    suitable: AZON_SUITABLE, note: `一张大床。${AZON_NOTE}`,
    highlights: AZON_COMMON, image: room('azon-single-01'),
    gallery: [room('azon-single-01'), room('azon-single-02'), room('azon-single-03'), ...AZON_SHARED_PHOTOS],
    imageAlt: 'Philinter Azon 公寓单人间',
  },
  {
    id: 'azon-twin', rateIds: ['azon-twin'], label: 'Azon 公寓双人间', location: '校外',
    suitable: AZON_SUITABLE, note: `两张分开的单人床。${AZON_NOTE}`,
    highlights: AZON_COMMON, image: room('azon-twin-01'),
    gallery: [room('azon-twin-01'), ...AZON_SHARED_PHOTOS],
    imageAlt: 'Philinter Azon 公寓双人间',
  },
  {
    id: 'azon-triple', rateIds: ['azon-triple'], label: 'Azon 公寓三人间', location: '校外',
    suitable: AZON_SUITABLE, note: `三张单人床。${AZON_NOTE}`,
    highlights: AZON_COMMON, image: room('azon-triple-01'),
    gallery: [room('azon-triple-01'), ...AZON_SHARED_PHOTOS],
    imageAlt: 'Philinter Azon 公寓三人间',
  },
];

export const PHILINTER_DORM_RULES: ReadonlyArray<{ title: string; text: string }> = [
  { title: '门禁', text: '校内宿舍周日至周四22:00，周五、周六和假日前一天24:00；门禁后到早上6点不能进出校门。未满18岁外出须有成人陪同。' },
  { title: '上课时间外出', text: '08:00–17:00出校门须到办公室申请外出单（Gate pass）。护照由学校统一保管，周一至周五08:00–17:00可登记领取。' },
  { title: '房间分配', text: '按报名房型分配，不能指定楼层、朝向和室友；升级房型补差价，降级不退；换房须申请，批准后收3,000比索清洁费。' },
  { title: '用电', text: '每人每周20度，超出部分每度25比索，毕业前结算；Azon公寓每4周预收每人5,500比索电费，账单超出须补交。' },
  { title: '宿舍规定', text: '校内禁止使用热水壶、电磁炉等烹煮电器；22:00以后保持安静；不能进入其他学生房间（家庭房除外）；只能在吸烟区吸烟。' },
  { title: '钥匙与赔偿', text: '丢失钥匙须换锁，收2,000比索；损坏公物须赔偿；马桶堵塞疏通每次1,200比索。' },
  { title: 'Azon 公寓', text: '规定和校内宿舍基本相同，但没有门禁，可以自己做饭；只能在户外停车场的指定区域吸烟；退房时把钥匙交给公寓警卫。' },
];

/** Monday to Friday (2026-10-19 handbook); each period is 40–45 minutes. */
export const PHILINTER_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:00–08:45', activity: '第1节', kind: 'class' },
  { time: '08:50–09:35', activity: '第2节', kind: 'class' },
  { time: '09:40–10:25', activity: '第3节', kind: 'class' },
  { time: '10:30–11:15', activity: '第4节', kind: 'class' },
  { time: '11:20–12:00', activity: '第5节', kind: 'class' },
  { time: '11:40–12:40', activity: '午餐', kind: 'meal' },
  { time: '13:00–13:45', activity: '第6节', kind: 'class' },
  { time: '13:50–14:35', activity: '第7节', kind: 'class' },
  { time: '14:40–15:25', activity: '第8节', kind: 'class' },
  { time: '15:30–16:15', activity: '第9节', kind: 'class' },
  { time: '16:20–17:00', activity: '第10节', kind: 'class' },
  { time: '17:40–18:40', activity: '晚餐', kind: 'meal' },
  { time: '19:00–21:00', activity: '斯巴达课程必修晚自习（周一至周四）', kind: 'activity' },
];

const AFTERNOON_START = PHILINTER_SCHEDULE.findIndex(row => row.time.startsWith('13:00'));
export const PHILINTER_SCHEDULE_COLUMNS: PhScheduleColumn[] = [
  { code: 'MORNING', title: '上午', rows: PHILINTER_SCHEDULE.slice(0, AFTERNOON_START) },
  { code: 'AFTERNOON', title: '下午和晚上', rows: PHILINTER_SCHEDULE.slice(AFTERNOON_START) },
];

/** 斯巴达 and 半斯巴达 courses (2026 brochure and handbook). */
export const PHILINTER_STUDY_MODES: PhStudyMode[] = [
  {
    code: '斯巴达',
    name: '强制晚自习',
    title: '强化ESL、所有雅思课程、青少年雅思；IPS报名时可选',
    contrastTitle: '斯巴达多出的学习时段',
    timeBlocks: [
      { label: '晚自习', time: '周一至周四 19:00–21:00', text: '在指定教室自习，有老师答疑', icon: 'edit_note', type: 'required' },
      { label: '周考或模考', time: '周三周考，周六雅思模考', text: '缺考记警告，成绩0分', icon: 'quiz', type: 'required' },
      { label: '外出', time: '周五、周六、周日和假日', text: '平日空闲时间可申请短暂外出', icon: 'directions_walk', type: 'required' },
    ],
    curfew: [
      { day: '周日至周四', time: '22:00' },
      { day: '周五、周六和假日前一天', time: '24:00' },
    ],
  },
  {
    code: '半斯巴达',
    name: '课后自由安排',
    title: '综合ESL、轻松ESL、商务英语、托业常规',
    contrastTitle: '半斯巴达没有这些强制时段',
    timeBlocks: [
      { label: '晚上', time: '没有必修晚自习', text: '可以在自习室或房间自习', icon: 'event_available', type: 'flexible' },
      { label: '外出', time: '17:00下课后可外出', text: '门禁前回校', icon: 'directions_walk', type: 'flexible' },
      { label: '升级', time: '到校后可改斯巴达', text: '每4周50美元，不足4周按4周算', icon: 'upgrade', type: 'flexible' },
    ],
    curfew: [
      { day: '周日至周四', time: '22:00' },
      { day: '周五、周六和假日前一天', time: '24:00' },
    ],
  },
];

export const PHILINTER_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: 'IELTS Guarantee 8周／12周',
    courseIds: ['ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks'],
    facts: [
      { label: '入学与目标', value: '雅思4.0→5.5、5.5→6.5、6.5→7.0（入学成绩须是开课前1年内的官方成绩）' },
      { label: '官方考试', value: '8周班第8周考，12周班第10或11周考；学术类纸笔考试，学校安排1次免费' },
      { label: '入学日期', value: '每周日入学；想在校内考官方雅思，请先确认指定入学日期' },
    ],
    points: [
      '每周六上午必须参加模考；官方考试前一周每天模考。',
      '模考连续3次退步、出勤率低于97%、旷课、缺考或违反校规，会取消保分资格，不退费。',
      '保分班只受理病假；出勤率低于90%不发结业证书和成绩单。',
      '官方考试可能在平日或周末，考完约两周出成绩。',
    ],
  },
  {
    icon: 'stairs',
    title: '雅思16周课程',
    subtitle: '先打英语基础，再上雅思',
    courseIds: ['ielts-16-weeks-6-5', 'ielts-16-weeks-5-5'],
    facts: [
      { label: '冲6.5', value: '雅思4.0左右入学：4周强化ESL + 12周雅思' },
      { label: '冲5.5', value: '雅思2.0左右入学：8周强化ESL + 8周雅思' },
      { label: '学费', value: '16周学费4,430美元（冲6.5）／4,260美元（冲5.5），住宿另计' },
    ],
    points: [
      '不是保分班，不含免费官方考试；可自费在校内参加官方雅思。',
      '雅思阶段和雅思强化一样：周一至周四晚自习，每周六上午模考。',
    ],
  },
  {
    icon: 'fact_check',
    title: '托业保分班',
    subtitle: 'TOEIC Guarantee 12周',
    courseIds: ['toeic-guarantee-12-weeks'],
    facts: [
      { label: '入学与目标', value: '托业550→700、670→800、800→900（入学成绩须是开课前1年内的官方成绩）' },
      { label: '入学日期', value: '按官方托业考试日期倒推，报名时确认' },
      { label: '模考', value: '每周五上午托业模考' },
    ],
    points: [
      '保分班只受理病假；出勤率低于90%不发结业证书和成绩单。',
      '托业常规课程每周五也有模考，最多3节托业课可改为商务课。',
    ],
  },
  {
    icon: 'record_voice_over',
    title: '精品口语小班',
    subtitle: 'Premium Speaking／Premium Junior Speaking',
    courseIds: ['speaking', 'junior-speaking'],
    facts: [
      { label: '班型', value: '团报课程，小组课每班4–6人' },
      { label: '周数', value: '成人固定8周；青少年固定4–6周' },
      { label: '入学程度', value: '成人Intermediate 301+；青少年Upper Elementary 201+' },
    ],
    points: [
      '由雅思7.5–8.0分的老师授课，重点练高级词汇、发音、公开演讲和辩论。',
      '团报课程须凑够人数开班，报名时向学校确认。',
    ],
  },
  {
    icon: 'family_restroom',
    title: '青少年与陪读家长',
    subtitle: 'Junior ESL／Junior IELTS',
    courseIds: ['junior-esl-12-17-years', 'junior-ielts-12-17-years', 'light-esl'],
    facts: [
      { label: '年龄', value: 'Junior ESL 7–17岁；Junior IELTS 12–17岁' },
      { label: '监护人', value: '须与监护人同住双人间或三人间，监护人只能报轻松ESL' },
      { label: '外出', value: '未满18岁外出须有成人陪同；使用泳池须有监护人陪同' },
    ],
    points: [
      '强化ESL和青少年ESL每周三有单词、句型和语法周考（第1周不考）。',
      '孩子和家长可以用多人报价一起算。',
    ],
  },
  {
    icon: 'tune',
    title: '分级、测试与换课',
    subtitle: '所有课程通用',
    facts: [
      { label: '入学测验', value: '第一周周一入学测验和说明会，周二08:00前领课表' },
      { label: '进步考', value: '报名4周以上的学生在第3或4周参加进步考' },
      { label: '换课', value: '换课或加课收3,000比索行政费，并补课程差价' },
    ],
    points: [
      'Buddy Teacher是你的一对一老师之一，帮你请假、换课，并跟进出勤。',
      '入学2周内可在任一上课日16:00前申请换课，之后只能周二和周五申请，最快下周一生效。',
      '每周缺课2次或迟到4次记一次警告，迟到超过15分钟算缺课；3次警告会被开除，不退费。',
      '基础较弱的ESL学生，前4周可能把团体课改为一对一（旺季不提供）。',
      '行业英语不能直接报名，须到校后经教务处面谈再转课；其他课程的学生参加雅思或托业模考每次300比索。',
    ],
  },
];

export const PHILINTER_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'event',
    eyebrow: 'FIRST WEEK',
    title: '第一周安排',
    facts: [
      { label: '周日', value: '08:00起入住' },
      { label: '周一', value: '入学测验、说明会、交到校学杂费、和老师一起去超市' },
      { label: '周二', value: '08:00前领课表，开始上课' },
      { label: '周三', value: '到办公室买教材' },
    ],
    note: '请带护照和4张2×2英寸照片；教材不能退，2天内凭收据可换一次。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '三餐', value: '07:00–08:00、11:40–12:40、17:40–18:40（周末和假日相同）' },
      { label: '自习室', value: '每天06:00–24:00' },
      { label: '泳池', value: '平日17:00–21:00，周末和假日10:00–21:00' },
      { label: '办公室', value: '周一至周五08:00–17:00' },
    ],
    note: '素食和清真餐须在报名时申请；校内不能叫外卖。',
  },
  {
    icon: 'local_laundry_service',
    eyebrow: 'LAUNDRY & CLEANING',
    title: '清洁与洗衣',
    facts: [
      { label: '打扫', value: '每周1–2次' },
      { label: '床单', value: '每两周免费换一次，额外每次500比索' },
      { label: '洗衣', value: '送洗按公斤收费，加急另付' },
    ],
    note: '洗衣房统一水洗烘干，贵重衣物请自己洗；Azon公寓房内有洗衣机。',
  },
  {
    icon: 'local_hospital',
    eyebrow: 'HEALTH & SAFETY',
    title: '看病与安全',
    facts: [
      { label: '到校医生', value: '每周二、周五，须提前预约' },
      { label: '校护', value: '周一至周五08:00–17:00，简单处理和常用药' },
      { label: '保险', value: '到校前须买好健康保险' },
    ],
    note: '外出建议用Grab叫车；贵重物品锁在房间抽屉或行李箱里。',
  },
  {
    icon: 'storefront',
    eyebrow: 'NEARBY',
    title: '学校周边',
    facts: [
      { label: '商场', value: '步行约5分钟到 Gaisano Mactan Island Mall' },
      { label: 'Marina Mall', value: '车程约10分钟，有超市、餐厅和药店' },
      { label: '换钱', value: 'Island Central Mall 1楼' },
    ],
    note: 'Azon 公寓步行约8–9分钟到 Marina Mall，对面有星巴克。',
  },
  {
    icon: 'apartment',
    eyebrow: 'AZON CONDO',
    title: '住 Azon 公寓',
    facts: [
      { label: '门禁', value: '没有门禁' },
      { label: '接送车', value: '上课日早上到校，晚饭后和晚自习后回公寓；周六上午也有' },
      { label: '网络', value: '没有Wi-Fi，可租随身Wi-Fi：押金2,000比索，流量每月1,399比索' },
    ],
    note: '煤气罐须向物业买，每罐约1,500–2,000比索；饮用水自己买。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '提早入住／延后退房', value: '每人每天3,500比索（含三餐），须提前申请' },
      { label: '换房', value: '3,000比索清洁费' },
      { label: '丢钥匙', value: '换锁2,000比索' },
      { label: '半斯巴达升斯巴达', value: '每4周50美元' },
    ],
    note: '学校会按移民局、水电和物业的收费调整学杂费。',
  },
];

/** The school's 2027 holiday poster: weekday holidays only (no class); weekend holidays are left out. */
export const PHILINTER_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '25日', name: 'EDSA革命纪念日', provisional: true }] },
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节', provisional: true },
          { day: '25日', name: '濯足节' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }, { day: '30日', name: '马克坦战役纪念日（4/27调到周五）' }] },
      { month: 5, holidays: [{ day: '17日', name: '宰牲节', provisional: true }] },
      { month: 6, holidays: [{ day: '17日', name: '拉普拉普市宪章日', provisional: true }] },
      { month: 8, holidays: [{ day: '6日', name: '宿务省宪章日' }] },
      { month: 9, holidays: [{ day: '3日', name: '国家英雄日（8/30调到周五）' }, { day: '10日', name: '奥斯梅纳纪念日（9/9调到周五）' }] },
      { month: 11, holidays: [{ day: '1日', name: '万圣节' }, { day: '2日', name: '万灵节' }, { day: '29日', name: '博尼法西奥纪念日（11/30调到周一）' }] },
      {
        month: 12,
        holidays: [
          { day: '10日', name: '圣母无染原罪节（12/8调到周五）' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹纪念日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];

export const PHILINTER_HOLIDAY_FOOTNOTE = '标“待定”的日期等政府公布。学校每月提供19天课程（12月除外），不足19天时在周六开团体课，自愿报名，不报名不另补课；以学校当期通知为准。';

export const PHILINTER_LICENSE = {
  title: '办学资质已核验',
  items: [
    '2026年拉普拉普市营业执照（英语语言学校、学生餐厅，有效至2026年12月31日）',
    '菲律宾移民局外国学生招收资格认证（学生据此办理SSP学习许可）',
    '菲律宾技术教育与技能发展局（TESDA）英语课程登记，有效至2029年1月',
  ],
  note: '证件可向思达启航顾问索取查看',
};

export const PHILINTER_REFUND_COPY = {
  summaryTitle: 'Philinter 取消、改期与退款规定',
  summaryHint: '报名定金、入学前取消或改期、到校后退款和保留',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'Philinter 取消与退款规定',
  intro: '到校后按剩余的完整周计算；提出申请的那一周算已使用。退款时扣除注册费和已经享受的优惠。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '付清费用', text: '入学14天前付清学费和住宿费。' },
        { when: '入学14天前取消', text: '收120美元取消费（与注册费等额，免注册费的学生也收），其余退还。' },
        { when: '入学前1–14天取消', text: '收120美元和2周住宿费。' },
        { when: '改期', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；学校只接受当年内改期一次，入学前1–14天改期收1周住宿费。' },
        { when: '换课程或房型', text: '入学前可免费换一次，之后每次100美元；名额不能转让给别人。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '读完不到一半', text: '剩余超过4周时，退剩余周数学费和住宿费的50%。' },
        { when: '读完一半以上', text: '或剩余4周以内：不退款。' },
        { when: '保留', text: '提前回国可保留剩余周数，扣2周学费和住宿费，1年内使用，不能退款或转让。' },
        { when: '到校学杂费', text: '剩余周数的学杂费全额退还；已交给移民局的费用不退。' },
      ],
      footnote: '',
    },
    {
      title: '其他情况',
      note: '',
      rules: [
        { when: '直系亲属过世', text: '凭证明退剩余周数费用的60%。' },
        { when: '违规开除', text: '3次警告会被开除，剩余费用不退。' },
        { when: '办理时间', text: '回国后3周内处理，由思达启航协助办理。' },
      ],
      footnote: PHILINTER_REFERENCE_NOTE,
    },
  ],
};

export const PHILINTER_FINAL_CTA_BADGES = ['确认空房', '雅思保分条件', '学杂费预估', '入学日期规划'];

export const PHILINTER_FAQS: FaqItem[] = [
  {
    question: 'Philinter 是斯巴达学校吗？',
    answer: '看课程。强化ESL、所有雅思课程和青少年雅思是斯巴达，周一至周四19:00–21:00有必修晚自习，平日主要在校内；综合ESL、轻松ESL、商务英语和托业常规是半斯巴达，17:00下课后可以外出。IPS报名时可选。',
  },
  {
    question: '雅思保分班没考到目标分数怎么办？',
    answer: '保分班有条件：每周六模考、出勤率不低于97%、不旷课缺考、不违反校规；模考连续3次退步也会取消资格。具体保分规则请在报名前让顾问向学校确认。',
  },
  {
    question: '可以在学校里考官方雅思吗？',
    answer: '可以。学校是雅思考点，校内考学术类纸笔考试；保分班包含1次免费官方考试，其他学生可以自费报名。考试日期请先向顾问确认。',
  },
  {
    question: '2027年入学按什么价格？',
    answer: '学校还没有通知2027年新价格从什么时候开始实施，所以目前报名，不论2026年还是2027年入学，都按页面上的价格计算。',
  },
  {
    question: '住校内宿舍还是 Azon 公寓？',
    answer: '想专心学习、上课方便选校内宿舍；想要更自由、自己做饭的成人可以选Azon公寓，没有门禁，上课日有接送车，但没有Wi-Fi，水电费比校内高。',
  },
  {
    question: '暑期和旺季要注意什么？',
    answer: '2027年7月4日至8月28日是暑期旺季，每个学习周加收60美元，不打折。暑假校内宿舍至少报8周、Azon至少4周，寒假校内宿舍至少6周，请尽早确认房间。',
  },
  {
    question: '未满18岁可以来吗？',
    answer: '可以报青少年课程（Junior ESL 7–17岁，Junior IELTS和青少年精品口语12–17岁），须与一位成年监护人同住，监护人报轻松ESL。未满18岁外出须有成人陪同。',
  },
  {
    question: '到校后要交哪些费用？',
    answer: 'SSP学习许可、ACR卡、签证续签、维护费、水电费、教材和学生证，到校后用比索交给学校。报价会按你的签证和住宿周数逐项预估；押金和接机另付。',
  },
];
