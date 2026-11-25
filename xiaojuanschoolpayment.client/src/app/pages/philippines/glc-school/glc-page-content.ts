// Text and data of the GLC (Global Language Cebu) page, from GLC's 2026-11 school pack: 2026 Chinese brochure,
// 2027 price list, 2027 winter/summer notice, 2026 school rules, new-student guide, self-managed orientation,
// 2027 calendar and activity poster, Chinese cancellation rules and the school's Drive photo folders (received
// 2026-11-24). The shared Philippine school template reads this module through glc-page-profile.ts. Keep it pure
// data (no Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's address, phone, email, website, social accounts, the agency payment deadline or any rule
// about commission. The brochure's “宿务唯一获CELTA认证” is not repeated (no absolute claims).
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
import type { CiaShortVideo, CiaVideoCard } from '../cia-school/cia-page-content';
import type { PhRoomProfile, PhStudyMode, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const GLC_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const GLC_PAGE_TEXT = {
  heroLead: 'GLC 在宿务市区 Mabolo，以口语课程见长，也有雅思、托业、商务英语和亲子课程；以自律型管理为主，想被严格管理的学生可以选斯巴达课程。',
  advisorText: 'GLC 适合想在宿务市区学口语、课后自己安排时间的成人：一对一课多、免费选修课多，ESL 全部用线上教材，要自带平板或笔记本电脑。雅思是学术类，托业和商务英语也有专门的一对一科目。带5–14岁孩子的家庭可以报亲子套餐，全家同住一间房。校园里有泳池、健身房和篮球场；2027年寒暑假只收18岁以上成人和少量家庭。',
  campusIntro: '校园分主楼和副楼 Annex2，两栋之间有天桥相连：主楼有教室、宿舍、餐厅、儿童娱乐室和泳池；副楼有教室、宿舍、健身房、篮球场和游戏室。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课50分钟，每周一开课，可读1–48周。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。合作酒店暂时没有照片。',
  finalCtaTitle: '想确认 GLC 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const GLC_QUICK_INFO = [
  { icon: 'location_on', title: '宿务市区', text: 'Mabolo 区，离 Ayala 和 SM City 商场都不远' },
  { icon: 'record_voice_over', title: '口语为主', text: '一对一4–8节，下午和晚上有免费选修课' },
  { icon: 'tablet_mac', title: '线上教材', text: 'ESL 全部线上教材，要带平板或笔记本电脑' },
  { icon: 'rule', title: '两种管理', text: '自律型建议23:00前回校；斯巴达课程平日不外出' },
  { icon: 'family_restroom', title: '亲子套餐', text: '2–4人家庭同住一间，家长可以不上课' },
  { icon: 'pool', title: '校园设施', text: '泳池、健身房、篮球场和儿童娱乐室' },
];

/** Key facts under the hero title (compact layout); what each building has is in GLC_CAMPUS_BUILDINGS. */
export const GLC_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务市 Mabolo 区，市区学校' },
  { icon: 'groups', label: '规模', value: '可住约500名学生；2012年成立，2022年12月搬到现在的校园' },
  { icon: 'rule', label: '管理', value: '自律型为主，建议23:00前回校；斯巴达课程住副楼，周一至周五不外出' },
  { icon: 'menu_book', label: '课程', value: '口语 ESL、雅思（学术类）、托业、商务英语、儿童／青少年和亲子课程' },
  { icon: 'tablet_mac', label: '教材', value: 'ESL 全部线上教材，须自带平板或笔记本电脑' },
  { icon: 'event', label: '入学', value: '每周日入住，周一开课；可读1–48周' },
  { icon: 'bed', label: '住宿', value: '主楼豪华单人间到四人间，副楼单人间和双人间，另有校外合作酒店' },
  { icon: 'public', label: '学员', value: '来自日本、中国大陆、中国台湾、泰国、俄罗斯、越南等国家和地区' },
];

export const GLC_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'GLC（Global Language Cebu）' },
  { label: '位置', value: '菲律宾宿务市 Mabolo 区' },
  { label: '管理方式', value: '自律型为主；斯巴达课程另有严格管理' },
  { label: '课程', value: '口语 ESL、雅思、托业、商务英语、儿童／青少年和亲子课程' },
  { label: '住宿', value: '主楼和副楼 Annex2 宿舍；校外合作酒店' },
  { label: '入学', value: '每周日入住，周一开课' },
];

export const GLC_SUITABLE_FOR = [
  '想集中练口语、课后自己安排时间的成人',
  '准备学术类雅思或托业考试的学生',
  '带5–14岁孩子一起来读书的家庭',
  '需要严格管理、愿意住副楼的斯巴达学生',
];

export const GLC_NOT_SUITABLE_FOR = [
  '不想带平板或笔记本电脑的学生（ESL 全部线上教材）',
  '想住海边度假的学生（学校在宿务市区）',
  '想在2027年寒暑假带未满18岁孩子单独来读的家庭（寒暑假只收成人和少量家庭）',
];

/** What each building has (brochure aerial view, school rules and new-student guide). */
export const GLC_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'MAIN', title: '主楼', icon: 'apartment', facilities: ['一对一和团体教室', '宿舍：豪华单人间到四人间', '2楼儿童娱乐室和乒乓球', '学生餐厅'] },
  { code: 'A2', title: '副楼 Annex2', icon: 'domain', facilities: ['一对一和团体教室、研讨室', '宿舍：单人间和双人间（斯巴达学生住这里）', '健身房', '篮球场和游戏室'] },
  { code: 'POOL', title: '公共区域', icon: 'pool', facilities: ['游泳池', '第二用餐区', '小卖部', '两栋楼之间的天桥（23:00–06:00关闭）'] },
];

const asset = (path: string) => `assets/glc/${path}.webp`;
export const GLC_QUOTE_IMAGE_HERO = '/assets/glc/campus-main.webp';

export const GLC_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'GLC 校园', description: '学校在宿务市 Mabolo 区。', src: GLC_QUOTE_IMAGE_HERO.slice(1) },
  { category: '校园', title: '副楼 Annex2', description: '斯巴达学生住在副楼。', src: asset('campus/annex2-building') },
  { category: '校园', title: '游泳池', description: '平日16:00–21:00、周末09:00–20:00开放。', src: asset('campus/pool-day') },
  { category: '校园', title: '夜晚的泳池', description: '下课后可以在泳池边放松。', src: asset('campus/pool-night') },
  { category: '校园', title: '泳池边', description: '未满14岁须有20岁以上成人陪同。', src: asset('campus/pool-side') },
  { category: '校园', title: '露台', description: '校园里的休息区。', src: asset('campus/terrace') },
  { category: '校园', title: '周末活动：浮潜', description: '学校每月大约安排两次周末活动。', src: asset('life/weekend-snorkel') },
  { category: '校园', title: '周末活动：巧克力山', description: '学校组织的周末出游。', src: asset('life/weekend-chocolate-hills') },
  { category: '校园', title: '周末活动：出海', description: '跳岛一日游。', src: asset('life/weekend-boat') },
  { category: '校园', title: '周末活动：海岛', description: '学校组织的周末出游。', src: asset('life/weekend-island') },
  { category: '校园', title: '课后活动：舞蹈', description: '课后的学生活动。', src: asset('life/activity-dance') },
  { category: '校园', title: '课后活动：瑜伽', description: '课后的学生活动。', src: asset('life/activity-yoga') },
  { category: '教室', title: '主楼团体课', description: '团体课教室。', src: asset('study/main-group') },
  { category: '教室', title: '主楼一对一', description: '每节课50分钟。', src: asset('study/main-one-to-one') },
  { category: '教室', title: '副楼团体课', description: '副楼的团体课教室。', src: asset('study/annex2-group') },
  { category: '教室', title: '副楼一对一', description: '副楼的一对一教室。', src: asset('study/annex2-one-to-one') },
  { category: '教室', title: '副楼研讨室', description: '副楼的研讨室。', src: asset('study/seminar-a') },
  { category: '教室', title: '副楼研讨室', description: '副楼的另一间研讨室。', src: asset('study/seminar-b') },
  { category: '住宿', title: '主楼豪华单人间', description: '空间更大的单人间。', src: asset('rooms/deluxe-01') },
  { category: '住宿', title: '主楼单人间', description: '房内有卫生间和热水淋浴。', src: asset('rooms/single-01') },
  { category: '住宿', title: '主楼双人间', description: '两张单人床。', src: asset('rooms/twin-01') },
  { category: '住宿', title: '主楼三人间', description: '三张单人床。', src: asset('rooms/triple-01') },
  { category: '住宿', title: '主楼四人间', description: '上下铺。', src: asset('rooms/quad-01') },
  { category: '住宿', title: '副楼单人间', description: '斯巴达学生住副楼。', src: asset('rooms/annex2-single-01') },
  { category: '住宿', title: '副楼双人间', description: '斯巴达学生住副楼。', src: asset('rooms/annex2-twin-01') },
  { category: '餐厅', title: '学生餐厅', description: '平日07:00–09:00、11:00–13:30、17:30–19:30供餐。', src: asset('life/dining-hall') },
  { category: '餐厅', title: '自助取餐', description: '周末和假日08:00–09:00、12:00–13:00、18:00–19:00供餐。', src: asset('life/dining-buffet') },
  { category: '餐厅', title: '学校餐食', description: '每天三餐。', src: asset('life/meal-1') },
  { category: '餐厅', title: '学校餐食', description: '每天三餐。', src: asset('life/meal-2') },
  { category: '餐厅', title: '学校餐食', description: '每天三餐。', src: asset('life/meal-3') },
  { category: '餐厅', title: '学校餐食', description: '每天三餐。', src: asset('life/meal-4') },
  { category: '设施', title: '健身房', description: '副楼，每天07:00–23:00开放，18岁以上可用。', src: asset('campus/gym-cardio') },
  { category: '设施', title: '健身房器械区', description: '使用前须签署责任免除协议。', src: asset('campus/gym-weights') },
  { category: '设施', title: '健身房', description: '有空调。', src: asset('campus/gym-machines') },
  { category: '设施', title: '篮球场', description: '平日下课后和周末下午开放。', src: asset('campus/basketball') },
  { category: '设施', title: '台球', description: '游戏室。', src: asset('campus/billiards') },
  { category: '设施', title: '副楼台球区', description: '副楼的游戏室。', src: asset('campus/annex2-billiards') },
  { category: '设施', title: '副楼休息区', description: '课后休息的地方。', src: asset('campus/annex2-lounge') },
  { category: '设施', title: '乒乓球', description: '主楼2楼。', src: asset('campus/table-tennis') },
  { category: '设施', title: '按摩椅', description: '学生休息区。', src: asset('campus/massage-chairs') },
  { category: '设施', title: '儿童娱乐室', description: '主楼2楼，周一至周五08:00–17:00，5–10岁儿童使用。', src: asset('campus/kids-room') },
  { category: '设施', title: '阅读角', description: '课后看书的地方。', src: asset('campus/library') },
  { category: '设施', title: '小卖部', description: '买零食和日用品。', src: asset('campus/store') },
];

export const GLC_ALBUM_DESCRIPTIONS = {
  校园: '校舍、泳池和学校活动',
  教室: '主楼和副楼的一对一、团体课和研讨室',
  住宿: '主楼和副楼 Annex2 宿舍',
  餐厅: '学生餐厅和每天的餐食',
  设施: '健身房、篮球场、游戏室和儿童娱乐室',
} as const;

const DORM_SERVICE = '每周打扫1次；每周9公斤免费洗衣';
const DORM_HIGHLIGHTS = ['空调、电扇、热水淋浴和卫生间', '小冰箱、烧水壶、吹风机', '带锁的衣柜、书桌和台灯', 'Wi-Fi'];
const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => asset(`rooms/${prefix}-${String(index + 1).padStart(2, '0')}`));

/** Photos come only from GLC's own room folders and match the labelled room type (see public/assets/glc). */
export const GLC_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'main-deluxe-single', rateIds: ['main-deluxe-single'], label: '主楼豪华单人间', location: '校内', service: DORM_SERVICE,
    suitable: '想要更大空间、长期就读的学生', note: '比普通单人间更宽敞。', highlights: DORM_HIGHLIGHTS,
    image: asset('rooms/deluxe-01'), gallery: numbered('deluxe', 6), imageAlt: 'GLC主楼豪华单人间实景',
  },
  {
    id: 'main-single', rateIds: ['main-single'], label: '主楼单人间', location: '校内', service: DORM_SERVICE,
    suitable: '重视隐私、需要安静学习空间的学生', note: '一人一间，房内有卫生间。', highlights: DORM_HIGHLIGHTS,
    image: asset('rooms/single-01'), gallery: numbered('single', 6), imageAlt: 'GLC主楼单人间实景',
  },
  {
    id: 'main-double', rateIds: ['main-double'], label: '主楼双人间', location: '校内', bed: '两张单人床', service: DORM_SERVICE,
    suitable: '朋友同行，或想兼顾预算和练口语的学生', note: '两人一间，两人家庭也可以住。', highlights: DORM_HIGHLIGHTS,
    image: asset('rooms/twin-01'), gallery: numbered('twin', 6), imageAlt: 'GLC主楼双人间实景',
  },
  {
    id: 'main-triple', rateIds: ['main-triple'], label: '主楼三人间', location: '校内', bed: '三张单人床', service: DORM_SERVICE,
    suitable: '想控制预算的学生、三人家庭', note: '三人家庭和独自就读的12–14岁学生住三人间。', highlights: DORM_HIGHLIGHTS,
    image: asset('rooms/triple-01'), gallery: numbered('triple', 6), imageAlt: 'GLC主楼三人间实景',
  },
  {
    id: 'main-quad', rateIds: ['main-quad'], label: '主楼四人间', location: '校内', bed: '上下铺', service: DORM_SERVICE,
    suitable: '预算优先、喜欢热闹的学生，四人家庭', note: '四人家庭住四人间。', highlights: DORM_HIGHLIGHTS,
    image: asset('rooms/quad-01'), gallery: numbered('quad', 4), imageAlt: 'GLC主楼四人间实景',
  },
  {
    id: 'annex-single', rateIds: ['annex-single'], label: '副楼单人间', location: '校内', service: DORM_SERVICE,
    suitable: '斯巴达课程学生，或想住单人间的学生', note: '斯巴达课程学生只能住副楼。', highlights: DORM_HIGHLIGHTS,
    image: asset('rooms/annex2-single-01'), gallery: numbered('annex2-single', 6), imageAlt: 'GLC副楼Annex2单人间实景',
  },
  {
    id: 'annex-double', rateIds: ['annex-double'], label: '副楼双人间', location: '校内', bed: '两张单人床', service: DORM_SERVICE,
    suitable: '斯巴达课程学生，或朋友同行', note: '斯巴达课程学生只能住副楼。', highlights: DORM_HIGHLIGHTS,
    image: asset('rooms/annex2-twin-01'), gallery: numbered('annex2-twin', 5), imageAlt: 'GLC副楼Annex2双人间实景',
  },
];

/** One video in public/assets/glc/videos/: <name>.mp4 with its poster-<name>.jpg. */
export interface GlcVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  topic: 'campus' | 'rooms' | 'classes' | 'life' | 'interview';
}

const glcVideoSrc = (video: GlcVideo) => `/assets/glc/videos/${video.name}.mp4`;
const glcVideoPoster = (video: GlcVideo) => `/assets/glc/videos/poster-${video.name}.jpg`;

/**
 * Videos from GLC's official YouTube channel (2026 uploads) and the school's own social-media clips it shared on Google
 * Drive (the 2026 campus tour, face-ID entry, meals, October 2026 activities, a 2024 weekend-trips reel and a 2026
 * kids' art workshop), all 720p H.264. The Annex2 tour starts in the Annex2
 * courtyard, because the walk there passes another company's branded school vans; the young student's interview
 * leaves out the question about his friends, whose subtitle lists classmates by nationality. Students' names are not
 * written on the page.
 */
export const GLC_VIDEOS: GlcVideo[] = [
  { name: 'glc-promo', title: 'GLC 学校宣传片', duration: '2:05', orientation: 'landscape', topic: 'campus', description: '学校官方宣传片：泳池、宿舍、餐厅、健身房和台球室。' },
  { name: 'glc-campus-2026', title: '2026 校园一览', duration: '1:10', orientation: 'portrait', topic: 'campus', description: '2026年拍的校园：主楼和泳池、自助餐厅、泳池边餐区、资料墙、副楼餐厅和会议室、乒乓球、尊巴舞场地和健身房。' },
  { name: 'glc-campus-fpv', title: '无人机穿梭校园', duration: '3:25', orientation: 'landscape', topic: 'campus', description: '无人机穿过主楼大门、餐厅、办公室、儿童娱乐室和休息区，再飞到健身房外、游戏室和教室。' },
  { name: 'glc-annex2-tour', title: '副楼 Annex2 导览', duration: '1:51', orientation: 'landscape', topic: 'campus', description: '学校老师带你走一遍副楼：篮球场、一对一课室、团体教室、研讨室、线上课座位、宿舍、健身房和台球室。' },
  { name: 'glc-campus-short', title: '一分钟看校园', duration: '1:04', orientation: 'portrait', topic: 'campus', description: '泳池、餐厅、小卖部、教室、儿童娱乐室、乒乓球、桌上足球、健身房、按摩椅和台球。' },
  { name: 'glc-face-id', title: '刷脸门禁：怎么进出校园', duration: '2:12', orientation: 'landscape', topic: 'campus', description: '在校内要一直佩戴学生证；进出校门、往来主楼和副楼都要刷脸，门口有保安。还没录入刷脸的新生先用临时门禁卡。' },
  { name: 'glc-rooms-short', title: '宿舍房型实拍', duration: '1:01', orientation: 'portrait', topic: 'rooms', description: '主楼单人间、双人间、三人间，副楼单人间、双人间，以及豪华间和四人间。' },
  { name: 'glc-single-room', title: '主楼单人间实拍', duration: '0:39', orientation: 'portrait', topic: 'rooms', description: '冰箱、电扇、烧水壶、独立卫浴、大床、休息角、空调、书桌和衣柜，窗外能看到泳池。' },
  { name: 'glc-classes-short', title: '上课实拍', duration: '0:57', orientation: 'portrait', topic: 'classes', description: '一对一课和团体课；电子教材用手机、平板或电脑都能打开。' },
  { name: 'glc-business-course', title: '商务英语课介绍', duration: '2:11', orientation: 'landscape', topic: 'classes', description: '商务英语课的老师介绍上课内容、教材和适合的学生。' },
  { name: 'glc-weekday-electives', title: '平日免费选修课', duration: '3:51', orientation: 'landscape', topic: 'classes', description: '老师逐一介绍平日下午和晚上的免费选修课：英文电影、句型、语法复习、英文歌、英语游戏和发音。' },
  { name: 'glc-saturday-electives', title: '周六选修课', duration: '1:50', orientation: 'landscape', topic: 'classes', description: '老师介绍周六上午的选修课：求职英语、发音和跟名人学英语。' },
  { name: 'glc-meals', title: '自助餐实拍', duration: '0:57', orientation: 'portrait', topic: 'life', description: '早、中、晚餐都是自助：沙拉、水果、意面、炸鸡、烤肉和果汁，每道菜都标了鸡肉、牛奶、海鲜、小麦等过敏原。' },
  { name: 'glc-day-in-life', title: '学员的一天', duration: '5:23', orientation: 'landscape', topic: 'life', description: '跟拍一位学员的一天：6点起床、早餐、一对一课、午餐、团体课、晚饭和晚自习。' },
  { name: 'glc-october-highlights', title: '2026年10月活动集锦', duration: '1:34', orientation: 'portrait', topic: 'life', description: '学校一个月的活动：宿务话体验课、跳岛游、手工课、羽毛球赛、Oslob 出游、舞蹈课和万圣节派对。' },
  { name: 'glc-weekend-trips', title: '周末出游', duration: '0:40', orientation: 'portrait', topic: 'life', description: '2024年学员的周末出游：Oslob 看鲸鲨、Moalboal 浮潜看海龟、Mantayupan 瀑布、跳岛、香蕉船、高空自行车和溪降。' },
  { name: 'glc-kids-art', title: '亲子手工课', duration: '0:40', orientation: 'portrait', topic: 'life', description: '2026年的儿童手工课：家长陪孩子用扭扭棒做花和小饰品，老师一桌一桌指导。' },
  { name: 'glc-interview-china', title: '中国小学员访谈', duration: '4:04', orientation: 'landscape', topic: 'interview', description: '来自中国的小学员用英语聊在 GLC 的学习和生活：每天上的选修课、餐食、泳池和校内诊所。' },
  { name: 'glc-interview-ielts', title: '雅思学员访谈', duration: '1:46', orientation: 'landscape', topic: 'interview', description: '来自俄罗斯的雅思学员聊课外怎么练英语、目标分数、周六模考和备考方法。' },
  { name: 'glc-interview-sparta-ielts', title: '斯巴达雅思学员访谈', duration: '3:21', orientation: 'landscape', topic: 'interview', description: '来自泰国、读斯巴达雅思的学员聊课外练口语、雅思课的感受和老师的教法。' },
];

const glcVideo = (name: string) => GLC_VIDEOS.find(video => video.name === name) as GlcVideo;
const albumVideo = (video: GlcVideo): PhVideoItem => ({
  title: video.title,
  text: video.description,
  src: glcVideoSrc(video),
  poster: glcVideoPoster(video),
  duration: video.duration,
  shape: video.orientation === 'landscape' ? 'wide' : 'tall',
});
const videosOn = (topic: GlcVideo['topic']) => GLC_VIDEOS.filter(video => video.topic === topic).map(albumVideo);

/** Videos of the hero album, one chip per topic; the school film opens it. */
export const GLC_VIDEO_TABS: PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: videosOn('campus') },
  { label: '宿舍视频', icon: 'videocam', items: videosOn('rooms') },
  { label: '课程视频', icon: 'videocam', items: videosOn('classes') },
  { label: '生活视频', icon: 'videocam', items: videosOn('life') },
  { label: '访谈视频', icon: 'videocam', items: videosOn('interview') },
];

/** First item of a room's photo album: only a clip of exactly that room type (the room-types clip shows several). */
export const GLC_ROOM_VIDEOS: Record<string, PhVideoItem> = {
  'main-single': albumVideo(glcVideo('glc-single-room')),
};

export const GLC_VIDEO_CARDS: CiaVideoCard[] = GLC_VIDEOS.filter(video => video.orientation === 'landscape' && video.topic !== 'interview').map(video => ({
  code: 'GLC',
  label: 'GLC',
  title: video.title,
  text: video.description,
  poster: glcVideoPoster(video),
  videoSrc: glcVideoSrc(video),
  contentType: 'video/mp4',
  details: [`时长 ${video.duration}`],
}));

const shortVideo = (video: GlcVideo): CiaShortVideo => ({
  title: video.title,
  text: video.description,
  src: glcVideoSrc(video),
  poster: glcVideoPoster(video),
  duration: video.duration,
  ...(video.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});
export const GLC_LIFE_VIDEOS: CiaShortVideo[] = GLC_VIDEOS.filter(video => video.orientation === 'portrait').map(shortVideo);
export const GLC_INTERVIEW_VIDEOS: CiaShortVideo[] = GLC_VIDEOS.filter(video => video.topic === 'interview').map(shortVideo);

export const GLC_DORM_RULES = [
  { title: '门禁', text: '自律型学生建议23:00前回校；斯巴达学生周一至周五不能外出，周六不设门禁，周日23:00前回校。' },
  { title: '进出校园', text: '只能走大门；外出时把 Gate Pass 交给门卫，并刷脸进出，没有刷脸可能会收到警告。' },
  { title: '副楼通道', text: '主楼和副楼之间的天桥23:00–06:00关闭，这段时间住主楼的学生不能进副楼。' },
  { title: '访客', text: '访客不能进入校园。' },
  { title: '吸烟和喝酒', text: '只能在指定吸烟区吸烟（含电子烟）；在房间吸烟罚款10,000比索，并作为开除前的最后一次警告。校内禁止喝酒。' },
  { title: '未成年人', text: '高中生和未成年学生周一至周五不能外出；周末和假日须有20岁以上成人陪同，20:00前回校，不能外宿。' },
  { title: '电器和换房', text: '宿舍禁止明火和大功率电器；房间由学校分配，不能私自换房。' },
  { title: '警告和开除', text: '书面警告达到次数就会被开除且不退费：就读1–3周2次，4–8周3次，9–16周4次，17周以上5次。' },
];

/** One weekday of a self-managed student (school sample; each student's timetable differs). */
const GLC_SCHEDULE_SELF: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐（07:30–08:00单词测验，自由参加）', kind: 'meal' },
  { time: '08:00–08:50', activity: '团体课', kind: 'class' },
  { time: '09:00–09:50', activity: '一对一', kind: 'class' },
  { time: '10:00–10:50', activity: '休息', kind: 'free' },
  { time: '11:00–11:50', activity: '一对一', kind: 'class' },
  { time: '12:00–12:50', activity: '午餐', kind: 'meal' },
  { time: '13:00–13:50', activity: '一对一', kind: 'class' },
  { time: '14:00–14:50', activity: '团体课', kind: 'class' },
  { time: '15:00–15:50', activity: '休息', kind: 'free' },
  { time: '16:00–16:50', activity: '一对一', kind: 'class' },
  { time: '16:00–20:00', activity: '免费选修课（自由参加）', kind: 'activity' },
  { time: '18:00–18:50', activity: '晚餐', kind: 'meal' },
  { time: '19:00–21:50', activity: '自习（自由参加）', kind: 'free' },
];

/** One weekday of a Sparta student (school sample); everything is compulsory. */
const GLC_SCHEDULE_SPARTA: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:00–11:50', activity: '一对一（4节）', kind: 'class' },
  { time: '12:00–12:50', activity: '午餐', kind: 'meal' },
  { time: '13:00–13:50', activity: '一对一', kind: 'class' },
  { time: '14:00–17:50', activity: '团体课（4节）', kind: 'class' },
  { time: '18:00–18:50', activity: '晚餐', kind: 'meal' },
  { time: '19:00–19:50', activity: '晚间课', kind: 'class' },
  { time: '20:00–20:50', activity: '单词测验', kind: 'test' },
  { time: '21:00–21:50', activity: '自习', kind: 'activity' },
  { time: '周六 09:00–11:50', activity: '特别课程／模拟考试', kind: 'test' },
];

export const GLC_SCHEDULE_COLUMNS = [
  { code: 'SELF', title: '自律型课表', rows: GLC_SCHEDULE_SELF },
  { code: 'SPARTA', title: '斯巴达课表', rows: GLC_SCHEDULE_SPARTA },
];

export const GLC_STUDY_MODES: PhStudyMode[] = [
  {
    code: '斯巴达',
    name: '严格管理',
    title: '适合需要被督促、想把时间都用在学习上的学生',
    contrastTitle: '斯巴达必须参加的时段',
    timeBlocks: [
      { label: '晚间课', time: '周一至周五 19:00–19:50', text: '晚饭后上课', icon: 'school', type: 'required' },
      { label: '单词测验和自习', time: '20:00–21:50', text: '全部必须参加', icon: 'edit_note', type: 'required' },
      { label: '周六课程', time: '周六 09:00–11:50', text: '特别课程或模拟考试', icon: 'quiz', type: 'required' },
    ],
    curfew: [
      { day: '周一至周五', time: '不能外出' },
      { day: '周六', time: '不设门禁' },
      { day: '周日', time: '23:00前回校' },
    ],
  },
  {
    code: '自律型',
    name: '自主安排',
    title: '适合想学口语，也想体验宿务生活的学生',
    contrastTitle: '自律型没有强制时段',
    timeBlocks: [
      { label: '早上', time: '单词测验自由参加', text: '07:30–08:00', icon: 'free_breakfast', type: 'flexible' },
      { label: '下午和晚上', time: '免费选修课自由参加', text: '16:00–20:00', icon: 'event_available', type: 'flexible' },
      { label: '外出', time: '下课后可外出', text: '建议23:00前回校', icon: 'directions_walk', type: 'flexible' },
    ],
    curfew: [
      { day: '每天', time: '建议23:00前回校' },
    ],
  },
];

const POWER_SPEAKING_IDS = ['light-power-speaking', 'power-speaking', 'intensive-power-speaking', 'ultra7-power-speaking', 'ultra-sparta-esl'];
const IELTS_IDS = ['general-ielts', 'intensive-ielts', 'ultra8-ielts', 'ultra-ielts-sparta'];
const TOEIC_IDS = ['general-toeic', 'intensive-toeic', 'ultra8-toeic', 'ultra-toeic-sparta'];
const KIDS_IDS = ['kids-english-6', 'kids-english-7', 'kids-english-8', 'junior-power-speaking-6', 'junior-power-speaking-7', 'junior-power-speaking-8'];
const FAMILY_IDS = ['family-package-2', 'family-package-3', 'family-package-4'];
const SPARTA_IDS = ['ultra-sparta-esl', 'ultra-ielts-sparta', 'ultra-toeic-sparta'];

export const GLC_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'record_voice_over',
    title: '口语课程上什么',
    subtitle: 'Power Speaking，以口语和日常沟通为主',
    courseIds: POWER_SPEAKING_IDS,
    facts: [
      { label: '一对一', value: '综合（听说、阅读词汇、写作语法）和口语1–4' },
      { label: '团体课 1–5级', value: '沟通语法和听力、会话、互动课' },
      { label: '团体课 6级以上', value: '公开演讲、演示、讨论和新闻英语' },
      { label: '入学', value: '15岁以上，1级（Pre-A1）到12级（C2）都可报' },
    ],
    points: ['轻量口语只在下午和晚上上课，上午自由安排；也不参加学校年度优惠。'],
  },
  {
    icon: 'workspace_premium',
    title: '雅思课程',
    subtitle: '学术类（Academic）雅思',
    courseIds: IELTS_IDS,
    facts: [
      { label: '一对一', value: '口语1–2、写作1–2、词汇语法、听力和阅读' },
      { label: '团体课', value: '标准和强化雅思上 ESL 团体课；斯巴达雅思上雅思听力和阅读团体课' },
      { label: '题库', value: 'Global Exam 线上题库，有大量仿真模考题' },
      { label: '入学', value: '15岁以上，4级（约雅思3.0）到10级（约雅思6.5）' },
    ],
    points: [],
  },
  {
    icon: 'fact_check',
    title: '托业课程',
    subtitle: '求职、升学用的英语考试',
    courseIds: TOEIC_IDS,
    facts: [
      { label: '一对一', value: '阅读1–2、听力1–2、口语与词汇、语法和写作' },
      { label: '团体课', value: '标准和强化托业上 ESL 团体课；斯巴达托业上托业语法团体课' },
      { label: '题库', value: 'Global Exam 线上题库' },
      { label: '入学', value: '15岁以上，4级（约托业400分）到10级（约托业850分）' },
    ],
    points: [],
  },
  {
    icon: 'business_center',
    title: '商务英语',
    subtitle: '会议、营销等商务场景',
    courseIds: ['business-course', 'ultra7-business'],
    facts: [
      { label: '一对一', value: '商务综合1–2，商务词汇、听力、沟通、语法和写作' },
      { label: '入学', value: '18岁以上，5级（A2）到12级（C2）' },
    ],
    points: [],
  },
  {
    icon: 'gavel',
    title: '斯巴达课程的规定',
    subtitle: '全部行程必须参加',
    courseIds: SPARTA_IDS,
    facts: [
      { label: '外出', value: '周一至周五不能外出；周六不设门禁，周日23:00前回校' },
      { label: '必修', value: '晚间课、单词测验、自习和周六课程／模考' },
      { label: '积分', value: '缺课或违规扣分，每周日重新计算' },
      { label: '住宿', value: '只能住副楼 Annex2 单人间或双人间' },
    ],
    points: ['积分低于80%会改成自律型课程，差价不退；保持80%–100%有奖励。'],
  },
  {
    icon: 'family_restroom',
    title: '亲子套餐怎么报',
    subtitle: '2–4人家庭，全家一起上课',
    courseIds: FAMILY_IDS,
    facts: [
      { label: '条件', value: '两人以上的家庭，入学和离校日期相同，同住一间房' },
      { label: '房间', value: '2人住双人间，3人住主楼三人间，4人住主楼四人间' },
      { label: '家长', value: '可以不上课，套餐课时全家共用' },
      { label: '孩子', value: '未满15岁只上一对一，不上团体课' },
    ],
    points: [
      '亲子套餐只限 ESL；课程费是全家合用的价格，住宿、注册费和到校学杂费按人数计算。',
      '2027年寒暑假家庭名额有限，请尽早让顾问确认。',
    ],
  },
  {
    icon: 'child_care',
    title: '儿童和青少年课程',
    subtitle: '5–11岁儿童，12–14岁青少年',
    courseIds: KIDS_IDS,
    facts: [
      { label: '课程', value: '全部是一对一：综合1–4和口语1–4' },
      { label: '上课方式', value: '用影片、歌曲等互动方式上课，部分课程用纸本教材' },
      { label: '5–11岁', value: '须有家长陪读' },
      { label: '12–14岁独自就读', value: '另付监护费每周150美元，住主楼三人间，须往返接送机' },
    ],
    points: ['未成年学生周一至周五不能外出；周末须有20岁以上成人陪同，20:00前回校。'],
  },
  {
    icon: 'rule',
    title: '分级、测试与换课',
    subtitle: '所有课程',
    facts: [
      { label: '程度测试', value: '入学后每4周一次（周二线上）；最后一周有结业测试' },
      { label: '换课换老师', value: '周一08:00至周二16:00申请，周三面谈，下一周换新课表' },
      { label: '换老师之后', value: '4周内不能再换' },
      { label: '结业证书', value: '必修课出勤90%以上、书面警告不超过3次' },
    ],
    points: ['选修课不计出勤；学校假日的特别团体课也不计出勤。'],
  },
];

export const GLC_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '07:00–09:00、11:00–13:30、17:30–19:30' },
      { label: '周末和假日', value: '08:00–09:00、12:00–13:00、18:00–19:00' },
      { label: '泳池', value: '平日16:00–21:00，周末09:00–20:00；未满14岁须有20岁以上成人陪同' },
      { label: '健身房', value: '副楼，每天07:00–23:00，18岁以上' },
      { label: '儿童娱乐室', value: '主楼2楼，周一至周五08:00–17:00，5–10岁（5岁以下须家长陪同）' },
      { label: '篮球场和游戏室', value: '平日下课后到晚上，周末13:00–22:00' },
    ],
    note: '开放时间可能按学校安排调整。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫、洗衣与看病',
    facts: [
      { label: '打扫', value: '每周1次' },
      { label: '洗衣', value: '每人每周9公斤免费，超出每公斤100比索；一般第二天送回' },
      { label: '电费', value: '按房间电表每度20比索，多人房按实际入住人数平分，月底结算' },
      { label: '护士', value: '周一至周五08:00–17:00' },
      { label: '看医生', value: '平日下午有医生到校，须当天11:00前申请' },
    ],
    note: 'Wi-Fi 只在指定区域使用，网速有时较慢。',
  },
  {
    icon: 'directions_bus',
    eyebrow: 'FREE SHUTTLE',
    title: '免费购物班车',
    facts: [
      { label: '周一、三、五', value: '从学校开往 Ayala 商场' },
      { label: '周二、四、六', value: '从学校开往 SM City 商场' },
      { label: '平日和周六发车', value: '17:30、18:30、19:30、20:30（周一至周五另有16:30）' },
      { label: '周日和假日', value: '13:30、15:30、17:30开往 Ayala' },
    ],
    note: '班车只送不接，回校自行安排。',
  },
  {
    icon: 'celebration',
    eyebrow: 'ACTIVITIES',
    title: '选修课与活动',
    facts: [
      { label: '平日选修课', value: '16:00–20:00：英语游戏、英文歌、电影、语法复习、句型、发音' },
      { label: '周六选修课', value: '09:00–11:50：跟名人学英语、发音、求职英语' },
      { label: '周末活动', value: '大约每月两次：市区游、跳岛、Oslob 和 Sumilon、瀑布、Moalboal 等' },
      { label: '圣诞派对', value: '2027年12月23日' },
    ],
    note: '周末活动是否收费、能否报名，以学校当期通知为准。',
  },
  {
    icon: 'luggage',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '电脑', value: '带平板或笔记本电脑，ESL 全部是线上教材' },
      { label: '入住', value: '周日14:00以后；课程结束后的周六12:00前退房' },
      { label: '行李', value: '退房后可以把行李寄放在办公室旁' },
      { label: '延迟退房', value: '周六12:00到午夜：单人间1,500、双人间1,000、三人间700比索；到周日12:00：2,500／2,250／2,000比索' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
];

/** Weekday holidays of the school's 2027 calendar; pink is 停课, yellow is no regular class with 8 special group lessons. */
export const GLC_HOLIDAY_CALENDARS: HolidayCalendar[] = [{
  year: 2027,
  label: '规划2027年入学时优先查看',
  months: [
    { month: 1, holidays: [{ day: '1日', name: '元旦（停课）' }] },
    { month: 2, holidays: [{ day: '26日', name: '学校假日（特别团体课）' }] },
    {
      month: 3,
      holidays: [
        { day: '10日', name: '学校假日（特别团体课）' },
        { day: '25日', name: '濯足节（特别团体课）' },
        { day: '26日', name: '耶稣受难日（特别团体课）' },
      ],
    },
    {
      month: 4,
      holidays: [
        { day: '9日', name: '勇气日（特别团体课）' },
        { day: '30日', name: '学校假日（特别团体课）' },
      ],
    },
    { month: 5, holidays: [{ day: '14日', name: '学校假日（特别团体课）' }] },
    { month: 6, holidays: [{ day: '11日', name: '学校假日（特别团体课）' }] },
    { month: 8, holidays: [{ day: '20日', name: '学校假日（特别团体课）' }] },
    {
      month: 9,
      holidays: [
        { day: '3日', name: '学校假日（特别团体课）' },
        { day: '17日', name: '学校假日（特别团体课）' },
      ],
    },
    {
      month: 11,
      holidays: [
        { day: '1日', name: '诸圣节（停课）' },
        { day: '2日', name: '万灵节（特别团体课）' },
        { day: '26日', name: '学校假日（特别团体课）' },
      ],
    },
    {
      month: 12,
      holidays: [
        { day: '8日', name: '圣母无原罪瞻礼（特别团体课）' },
        { day: '30日', name: '黎刹纪念日（特别团体课）' },
        { day: '31日', name: '年末（停课）' },
      ],
    },
  ],
}];

/** 2027 winter and summer (school notice); no surcharge, shown on the calendar. */
export const GLC_PEAK_NOTE = '2027年寒假（1/3–2/27）和暑假（7/4–8/28）只收入学时满18岁的成人和少量家庭，暑假至少读4周；这些学习周按原价，不享受任何优惠，也不加收旺季附加费。';

export const GLC_REFUND_COPY = {
  summaryTitle: 'GLC 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后退款比例',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'GLC 取消与退款规定',
  intro: '到校后只退学费和住宿费，注册费和其他费用不退；按已读周数占全部课程的比例退剩余部分。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '已读25%以内', text: '退剩余课程费和住宿费的50%。' },
        { when: '已读26%–50%', text: '退剩余课程费和住宿费的20%。' },
        { when: '已读超过50%', text: '不退。' },
        { when: '报名4周或以下', text: '不退。' },
        { when: '取消已付费的续读', text: '退已付续读费用的50%。' },
        { when: '不退的情况', text: '被学校开除、自己缺课或缺考，或因天灾、疫情、战争等原因停课。' },
      ],
      footnote: GLC_REFERENCE_NOTE,
    },
  ],
};

export const GLC_FAQS: FaqItem[] = [
  { question: 'GLC 是斯巴达学校吗？', answer: '不是，GLC 以自律型管理为主：下课后可以外出，学校建议23:00前回校，早上单词测验、选修课和晚自习都自由参加。想被严格管理的学生可以报斯巴达英语、斯巴达雅思或斯巴达托业，住副楼，周一至周五不能外出。' },
  { question: '一定要带电脑吗？', answer: '要。GLC 的 ESL 教材全部是线上教材，请带平板或笔记本电脑；雅思、托业和商务英语用线上加纸本教材。' },
  { question: '寒暑假可以去吗？', answer: '2027年寒假（1/3–2/27）和暑假（7/4–8/28）只收入学时满18岁的成人和少量家庭，暑假至少读4周；这些学习周按原价，不享受优惠，也不加收旺季附加费。家庭名额很少，请尽早让顾问确认。' },
  { question: '有什么优惠？', answer: '学校年度优惠：适用课程在优惠期间每满连续4周减150美元；思达启航专属优惠：每满连续4周再减50美元；符合条件还送一次周日接机。寒暑假的学习周不计入优惠。报价器会按你的日期自动计算。' },
  { question: '只读1–3周可以吗？', answer: '可以。课程和住宿按周计算，另收每周60美元短期附加费；读满4周就不收。' },
  { question: '可以带孩子去吗？', answer: '可以。5–11岁的孩子报儿童英语，须有家长陪读；12–14岁报青少年口语，可以独自就读，但要另付每周150美元监护费、住三人间并往返接送机。一家人一起读可以报亲子套餐，家长可以不上课。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费、住宿费、接机费和短期附加费，并自动扣除优惠；到校学杂费用比索单独列出，押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const GLC_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];
