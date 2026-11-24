// Text and data of the PINES school page, from the school's 2026-11 pack (Morgan's notice, the 2027 price list
// and promotions, the 2026-10 Chinese brochure, the before-registration and payment/check-in guides, the IELTS
// mock-exam and guarantee notes, the 2023 IELTS Q&A, the Global Youth IELTS introduction, the minor policy, the
// 2027 March/April holiday notice) and the school's 2026 floor-by-floor campus video. The shared Philippine school
// template reads it through pines-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat
// mini program can reuse it. Never add the school's phone, email, address, website or social accounts, pass
// rates, teacher statistics or internal agency rules.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  FaqItem,
  GalleryImage,
  HolidayCalendar,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import {
  PINES_GLOBAL_YOUTH_COURSE_ID,
  PINES_JUNIOR_COURSE_ID,
  PINES_PARENTS_COURSE_ID,
  PINES_ROOM_LOCATION,
} from './pines-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const PINES_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const PINES_IELTS_GUARANTEE_IDS = [
  'ielts-guarantee-8-weeks-5-5-6-0',
  'ielts-guarantee-8-weeks-6-5-7-0',
  'ielts-guarantee-12-weeks-5-5-6-0',
  'ielts-guarantee-12-weeks-6-5-7-0',
] as const;
const IELTS_REGULAR_IDS = ['pre-ielts', 'ielts-regular', 'ielts-intensive'];

export const PINES_PAGE_TEXT = {
  heroLead: '碧瑶2001年创办的学习型语言学校，口语和雅思分区上课，校内有雅思和托业官方考点，适合想认真学英语、考雅思的学生。',
  advisorText: 'PINES在菲律宾北部山城碧瑶，学习氛围浓。教室、宿舍、餐厅和健身房都在一栋主楼里，口语课程在2楼、雅思课程在4楼分区上课；单人间、Twin A和亲子房在教学楼后面的Condo公寓楼。校内有雅思和托业官方考点。成人课程只收18岁以上；13–17岁可报青少年雅思营，7–15岁可由家长陪同读亲子课程。想管得更严，可以加报EB Pro晚间管理。',
  campusIntro: '一栋主楼按楼层分区：一楼是前台、考点和洗衣房，2楼口语区，3楼咖啡厅和学生服务台，4楼雅思区，5楼餐厅和健身房；单人间等房型在教学楼后面的Condo公寓楼。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 PINES 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const PINES_QUICK_INFO = [
  { icon: 'location_on', title: '菲律宾碧瑶', text: '北部山城，适合专心学习' },
  { icon: 'history_edu', title: '2001年创办', text: '口语区和雅思区分区上课' },
  { icon: 'workspace_premium', title: '校内官方考点', text: '雅思和托业都可以在学校考' },
  { icon: 'apartment', title: '一栋楼里生活', text: '教室、宿舍、餐厅、健身房都在主楼' },
  { icon: 'restaurant', title: '含三餐', text: '周一至周五三餐和周六早餐' },
  { icon: 'family_restroom', title: '青少年与亲子', text: '13–17岁青少年雅思营；7–15岁亲子课程' },
];

/** Key facts under the hero title (compact layout); what each floor has is in PINES_CAMPUS_BUILDINGS. */
export const PINES_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾北部山城碧瑶，2001年创办' },
  { icon: 'workspace_premium', label: '考点', value: '校内有雅思和托业官方考点' },
  { icon: 'menu_book', label: '课程', value: '口语、综合英语、商务、托业和雅思（含保分班）；亲子课程和青少年雅思营' },
  { icon: 'event', label: '入学', value: '每周日入住；入学前完成线上分级测试，周一10:00开课' },
  { icon: 'bed', label: '住宿', value: '主楼宿舍和Condo公寓楼，含周一至周五三餐和周六早餐' },
  { icon: 'rule', label: '管理', value: '想管得更严，可加报EB Pro晚间管理（每4周5,000比索）' },
  { icon: 'cake', label: '年龄', value: '成人课程18岁以上；13–17岁只可报青少年雅思营' },
];

export const PINES_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'PINES International Academy' },
  { label: '位置', value: '菲律宾碧瑶' },
  { label: '创办', value: '2001年' },
  { label: '课程', value: '口语、综合英语、商务、托业、雅思和保分班；亲子课程、青少年雅思营' },
  { label: '住宿', value: '主楼宿舍和Condo公寓楼' },
  { label: '入学', value: '每周日入住，周一开课' },
];

export const PINES_SUITABLE_FOR = [
  '想在安静、专注的环境认真学英语的成人',
  '准备雅思或托业、想在校内官方考点考试的学生',
  '13–17岁想集中学雅思的青少年（青少年雅思营）',
  '带7–15岁孩子一起学习的家长',
];

export const PINES_NOT_SUITABLE_FOR = [
  '想在海边上学、边玩边学的学生（碧瑶是山城）',
  '未满18岁、想读普通成人课程的学生（只能报青少年雅思营或亲子课程）',
  '想自己指定上课时间或老师的学生（由学校统一安排）',
];

/** Floors of the main building and the Condo, from the school's campus illustration and 2026 campus video. */
export const PINES_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'GF', title: '一楼', icon: 'door_front', facilities: ['前台和活动中心', '雅思、托业考试中心', '打印店、洗衣中心'] },
  { code: '2F', title: '2楼 口语区', icon: 'record_voice_over', facilities: ['一对一和小组教室', '图书室、医务室', '宿舍'] },
  { code: '3F', title: '3楼 咖啡厅与服务台', icon: 'local_cafe', facilities: ['咖啡厅、学生休息区', '国际学生服务台、财务室', '教室和宿舍'] },
  { code: '4F', title: '4楼 雅思区', icon: 'school', facilities: ['雅思教务台', '一对一和小组教室', '宿舍'] },
  { code: '5F', title: '5楼 餐厅与运动', icon: 'restaurant', facilities: ['学生餐厅', '健身房、瑜伽室', '乒乓球'] },
  { code: 'CONDO', title: 'Condo公寓楼', icon: 'apartment', facilities: ['教学楼后面一栋', '单人房A、B、C和双人房A', '亲子房'] },
];

const campus = (file: string) => `assets/pines/campus/${file}.webp`;
const rooms = (file: string) => `assets/pines/rooms/${file}.webp`;

export const PINES_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'PINES校园外观', description: '学校主楼和周围的松树林。', src: campus('exterior') },
  { category: '校园', title: '校园楼层示意图', description: '学校提供的示意图：一楼到5楼的分区和教学楼后面的Condo公寓楼。', src: campus('campus-floor-map') },
  { category: '校园', title: '一楼前台', description: '到校报到、问事情先到这里。', src: campus('welcome-desk') },
  { category: '校园', title: '一楼大厅', description: '主楼一楼大厅。', src: campus('ground-lobby') },
  { category: '校园', title: '一楼走廊', description: '落地玻璃走廊，外面是树林。', src: campus('ground-corridor') },
  { category: '校园', title: '学生服务台', description: '学生办事、咨询的柜台。', src: campus('international-service-desk') },
  { category: '校园', title: '学生休息区', description: '课间休息、聊天的地方。', src: campus('student-lounge') },
  { category: '校园', title: '学生休息区', description: '休息区的另一角。', src: campus('student-lounge-2') },
  { category: '教室', title: '一对一教室', description: '一位老师对一位学生。', src: campus('one-to-one-classroom') },
  { category: '教室', title: '小组课教室', description: '4:1小组课的教室。', src: campus('group-classroom') },
  { category: '教室', title: '新装修的小组教室', description: '有大屏幕的小组教室。', src: campus('new-group-classroom') },
  { category: '教室', title: '教室走廊', description: '教室集中在同一层。', src: campus('classroom-corridor') },
  { category: '教室', title: '雅思教务台', description: '4楼雅思区的教务台。', src: campus('ielts-academic-desk') },
  { category: '教室', title: '电脑考试室', description: '每个座位有隔板和耳机。', src: campus('ielts-speaking-room') },
  { category: '教室', title: '笔试考试室', description: '单人桌椅成排摆放。', src: campus('toeic-test-room') },
  { category: '教室', title: '自习区', description: '有桌椅的开放学习区。', src: campus('ielts-resource-center') },
  { category: '住宿', title: '单人房A', description: 'Condo公寓楼，房内有卫生间和淋浴。', src: rooms('single-a-1') },
  { category: '住宿', title: '双人房B', description: '主楼双人房。', src: rooms('twin-b-1') },
  { category: '住宿', title: '五人间（床位分隔）', description: '每人一个带门的小隔间。', src: rooms('five-br-solo-1') },
  { category: '住宿', title: '四人间／六人间', description: '床在上层、书桌在下层。', src: rooms('dorm-4-6-1') },
  { category: '住宿', title: '亲子房', description: 'Condo公寓楼的三床房。', src: rooms('family-3br-1') },
  { category: '餐厅', title: '自助餐', description: '5楼学生餐厅。', src: campus('buffet') },
  { category: '餐厅', title: '学生餐厅', description: '一日三餐在这里吃。', src: campus('dining-hall') },
  { category: '餐厅', title: '学生餐厅', description: '餐厅的另一侧。', src: campus('dining-hall-2') },
  { category: '餐厅', title: '咖啡厅', description: '3楼的咖啡厅。', src: campus('cafe') },
  { category: '设施', title: '健身房', description: '5楼健身房，平日晚上有免费教练。', src: campus('gym') },
  { category: '设施', title: '健身房', description: '器械区。', src: campus('gym-2') },
  { category: '设施', title: '瑜伽室', description: '瑜伽选修课在这里上。', src: campus('yoga-room') },
  { category: '设施', title: '乒乓球', description: '5楼，免费使用。', src: campus('table-tennis') },
  { category: '设施', title: '洗衣中心', description: '一楼，按次收费。', src: campus('laundry') },
];

export const PINES_ALBUM_DESCRIPTIONS = {
  校园: '校园外观、楼层示意图、前台与休息区',
  教室: '一对一、小组教室和考试室',
  住宿: '主楼宿舍与Condo公寓楼',
  餐厅: '5楼学生餐厅与咖啡厅',
  设施: '健身房、瑜伽室、乒乓球和洗衣中心',
} as const;

/**
 * The school's own 2026 campus video (from the school's 2026-11 Drive folder), cut to the floor-by-floor tour.
 * Left out: a skit, a coffee-chain shot, a pass-rate quiz, a score report with a student's name, a test-centre
 * logo and the sign-off. Check every frame of a new clip for other companies, contact details and names.
 */
export const PINES_CAMPUS_TOUR = {
  title: 'PINES 2026 校园导览',
  description: '从一楼到5楼逐层走一遍：考点、口语和雅思教室、学生服务台、休息区、咖啡厅、五人间、餐厅、健身房和瑜伽室。',
  src: '/assets/pines/videos/campus-tour-2026.mp4',
  poster: '/assets/pines/videos/campus-tour-2026.jpg',
  duration: '1:01',
  details: ['逐层介绍教室、宿舍和餐厅', '中英文字幕', '2026年拍摄'],
} as const;

const DORM_PHOTOS = ['dorm-4-6-1', 'dorm-4-6-2', 'dorm-4-6-3', 'dorm-4-6-bathroom'];

/**
 * Short clips from the user's PINES 视频号 pack (2026-11-24), checked frame by frame: the laundry clip stops before a
 * room list with students' names, the test-room clip before the IELTS banners, and the first-day video blurs a
 * British Council poster at its edge. The two landscape clips were cut out of their vertical frame.
 */
const pinesVideo = (id: string, title: string, text: string, duration: string, shape: 'wide' | 'tall' = 'tall'): PhVideoItem => ({
  title, text, duration, shape, src: `/assets/pines/videos/${id}.mp4`, poster: `/assets/pines/videos/${id}.jpg`,
});

export const PINES_CAMPUS_VIDEOS: readonly PhVideoItem[] = [
  pinesVideo('first-day', '到校第一天', '新学期第一天：欢迎会、认识学生经理、参观校园，10点开始正式上课。', '0:52', 'wide'),
  pinesVideo('front-desk', '前台和办公区', '报到、咨询和日常手续在这里办理。', '0:25'),
  pinesVideo('canteen-cafe', '咖啡厅和餐厅', '校内咖啡厅和学生餐厅。', '0:18'),
  pinesVideo('gym', '健身房和乒乓球', '校内健身房和乒乓球桌。', '0:13', 'wide'),
  pinesVideo('laundry', '洗衣房', '学校洗衣房，洗衣按次收费。', '0:11'),
  pinesVideo('ielts-test-room', '雅思官方考场', '校内的雅思官方机考考场。', '0:08'),
];

export const PINES_ROOM_VIDEOS = {
  singleBc: pinesVideo('single-bc', '单人房B和C', 'Condo公寓楼套间里的单人房B和C，共用客厅。', '1:00'),
  twinA: pinesVideo('twin-a', '双人房A', 'Condo公寓楼的双人房，房内有卫生间和淋浴。', '0:47'),
  quad: pinesVideo('quad', '四人间', '主楼四人间，床在上层、书桌在下层。', '0:43'),
  sextuple: pinesVideo('sextuple', '六人间', '主楼六人间，床在上层、书桌在下层。', '0:50'),
} as const;

export const PINES_COURSE_VIDEOS: readonly PhVideoItem[] = [
  pinesVideo('one-to-one', '一对一口语课', '一对一口语课的上课实况。', '0:32'),
  pinesVideo('group-classroom', '选修小组课教室', '选修小组课用的教室。', '0:08'),
  pinesVideo('yoga', '瑜伽晨课', '自愿参加的免费瑜伽课：每周三、周五早上6:45–7:30，新学期第一周周二报名；时间以学校安排为准。', '0:41'),
];

/** Photos come only from the school's own material and match the labelled room (see public/assets/pines). */
export const PINES_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'single-a', label: '单人房A', englishName: 'SINGLE A', location: PINES_ROOM_LOCATION, bed: '1张床',
    suitable: '想要独立卫浴、安静学习空间的学生', note: 'Condo公寓楼的独立单人房，房内有卫生间和淋浴。',
    image: rooms('single-a-1'), gallery: ['single-a-1', 'single-a-2', 'single-a-3', 'single-a-4', 'single-a-shower'].map(rooms),
    imageAlt: 'PINES单人房A实景', rateIds: ['single-a'],
  },
  {
    id: 'single-b', label: '单人房B', englishName: 'SINGLE B', location: PINES_ROOM_LOCATION, bed: '1张床',
    suitable: '想住单人间、有自己卫生间的学生', note: 'Condo公寓楼套间：和C房共用客厅，B房有自己的卫生间。',
    image: rooms('single-b-1'), gallery: ['single-b-1', 'single-bc-common-1', 'single-bc-common-2'].map(rooms),
    imageAlt: 'PINES单人房B实景', rateIds: ['single-b'],
  },
  {
    id: 'single-c', label: '单人房C', englishName: 'SINGLE C', location: PINES_ROOM_LOCATION, bed: '1张床',
    suitable: '想住单人间、预算有限的学生', note: 'Condo公寓楼套间：和B房共用客厅，用客厅的卫生间；价格最低的单人房。',
    image: rooms('single-c-1'), gallery: ['single-c-1', 'single-bc-common-1', 'single-bc-common-2'].map(rooms),
    imageAlt: 'PINES单人房C实景', rateIds: ['single-c'],
  },
  {
    id: 'twin-a', label: '双人房A', englishName: 'TWIN A', location: PINES_ROOM_LOCATION, bed: '2张单人床',
    suitable: '朋友同行、想要房内卫浴的学生', note: 'Condo公寓楼的双人房，房内有卫生间和淋浴。',
    image: rooms('twin-a-1'), gallery: ['twin-a-1', 'twin-a-2', 'twin-a-3', 'twin-a-bathroom'].map(rooms),
    imageAlt: 'PINES双人房A实景', rateIds: ['twin-a'],
  },
  {
    id: 'twin-b', label: '双人房B', englishName: 'TWIN B', location: PINES_ROOM_LOCATION, bed: '2张单人床',
    suitable: '想住双人间、离教室近的学生', note: '主楼双人房，两人同住。',
    image: rooms('twin-b-1'), gallery: ['twin-b-1', 'twin-b-2', 'twin-b-bathroom'].map(rooms),
    imageAlt: 'PINES双人房B实景', rateIds: ['twin-b'],
  },
  {
    id: 'family-3br', label: '亲子房', englishName: 'FAMILY 3BR', location: PINES_ROOM_LOCATION, bed: '3张床',
    suitable: '家长和孩子同住', note: 'Condo公寓楼的三床房，按每人计价。',
    image: rooms('family-3br-1'), gallery: ['family-3br-1', 'family-3br-2', 'family-3br-3'].map(rooms),
    imageAlt: 'PINES亲子房实景', rateIds: ['family-3br'],
  },
  {
    id: 'five-br-solo', label: '五人间（床位分隔）', englishName: '5-BR SOLO', location: PINES_ROOM_LOCATION, bed: '每人一个带门的小隔间',
    suitable: '想控制预算、又想要自己小空间的学生', note: '主楼新房型：五人共用一套房，床在上层、书桌在下层，共用客厅和卫浴。',
    image: rooms('five-br-solo-1'),
    gallery: ['five-br-solo-1', 'five-br-solo-2', 'five-br-solo-3', 'five-br-solo-common', 'five-br-solo-bathroom'].map(rooms),
    imageAlt: 'PINES五人间实景', rateIds: ['five-br-solo'],
  },
  // Each opens with its own labelled video (roomVideos). Both rooms have the same beds and differ only in size (user
  // 2026-11-24), so both albums show the same photos and say so.
  {
    id: 'dorm-4', label: '四人间', englishName: '4 BEDS', location: PINES_ROOM_LOCATION, bed: '上床下桌',
    suitable: '预算优先、喜欢热闹的学生', note: '主楼四人间，床在上层、书桌在下层。四人间和六人间床型一样，只是房间大小不同，照片是同款多人间。',
    image: rooms('dorm-4-6-1'), gallery: DORM_PHOTOS.map(rooms),
    imageAlt: 'PINES多人间实景', rateIds: ['quad'],
  },
  {
    id: 'dorm-6', label: '六人间', englishName: '6 BEDS', location: PINES_ROOM_LOCATION, bed: '上床下桌',
    suitable: '预算最低、喜欢热闹的学生', note: '主楼六人间，床在上层、书桌在下层。四人间和六人间床型一样，只是房间大小不同，照片是同款多人间。',
    image: rooms('dorm-4-6-1'), gallery: DORM_PHOTOS.map(rooms),
    imageAlt: 'PINES多人间实景', rateIds: ['sextuple'],
  },
];

export const PINES_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: '固定8周或12周 · 课程期间含1次官方雅思考试',
    courseIds: PINES_IELTS_GUARANTEE_IDS,
    facts: [
      { label: '入学要求', value: '雅思4.0以上，入学前通过线上口语面试（思达启航顾问帮你预约）' },
      { label: '考试时间', value: '8周班在第8周考；12周班在第10–12周之间考' },
      { label: '每周模考', value: '周五晚上，口语在下周一考' },
      { label: '学校建议', value: '读12周；或8周后再加2周；或先读2周常规雅思再读8周保分班' },
    ],
    points: [
      '出勤、作业和每周模考都达标仍没到目标分，可免学费再读4周（住宿费和到校学杂费照付）。',
      '到校分级测试低于4.0会转到常规雅思或雅思预科；通过入学前面试的退还全部课程差价，没参加面试的只退50%。',
    ],
    notice: '保分条件以学校当期规定为准，报名前顾问会逐项和你确认。',
  },
  {
    icon: 'stairs',
    title: '雅思分级与成绩',
    subtitle: '按分数分级 · 常规课每4周重新排课',
    courseIds: IELTS_REGULAR_IDS,
    facts: [
      { label: '雅思预科', value: 'Head Start（雅思1.0–2.5）、Jump Start（3.0–3.5）' },
      { label: '常规雅思', value: 'Builder（4.0–5.5）、Enhancer（6.0以上）' },
      { label: '成绩', value: '模考成绩下周三在学生系统查看，周三至周五约15分钟学习面谈' },
      { label: '报告', value: '最后一周收到学习进度报告' },
    ],
    points: ['常规雅思和预科的课表每4周重新安排；保分班课表固定。'],
  },
  {
    icon: 'quiz',
    title: '雅思模考安排',
    subtitle: '所有雅思课程',
    courseIds: [...IELTS_REGULAR_IDS, ...PINES_IELTS_GUARANTEE_IDS],
    facts: [
      { label: '常规模考', value: '第2、6、10周，免费，纸笔考试；当周周二13:00前报名' },
      { label: '月考', value: '每4周最后一周的周二，纸笔或机考，免费' },
      { label: '周六模考', value: '周六上午开放给非保分班学生，500比索；周三17:00前报名' },
      { label: '官方考试', value: '碧瑶每周五、六、日有雅思机考，成绩约5–7天出' },
    ],
    points: [],
    notice: '官方考试日期以考试中心当期安排为准。',
  },
  {
    icon: 'diversity_3',
    title: '青少年雅思营（13–17岁）',
    subtitle: '6节一对一 + 2节晚间小组课 · 4周起',
    courseIds: [PINES_GLOBAL_YOUTH_COURSE_ID],
    facts: [
      { label: '入学', value: '按常规入学日，每两周一次，至少读4周' },
      { label: '宿舍', value: '按四人间价格收费；每间最多4名学生，住六人间，有菲律宾老师同住管理' },
      { label: '管理', value: '工作日不能外出或外宿；周末不能外宿，晚上8点前回校' },
      { label: '每周六', value: '上午词汇测验或雅思模考，下午休息' },
      { label: '家长', value: '可在学校系统查看出勤和成绩，每4周收到一份生活报告' },
    ],
    points: [
      '学费含住宿、工作日三餐、晚间小组课、老师辅导的晚自习（到22:00）和周六考试；注册费、到校学杂费、接机、洗衣和周末餐费另付。',
      '学校有24小时护士。13–14岁可用航空公司的无人陪伴儿童服务；未满15岁且没有父母同行入境，可能要提前申请特别许可（WEG），以航空公司和菲律宾入境规定为准。',
    ],
  },
  {
    icon: 'family_restroom',
    title: '亲子课程',
    subtitle: '7–15岁孩子和陪读家长',
    courseIds: [PINES_JUNIOR_COURSE_ID, PINES_PARENTS_COURSE_ID],
    facts: [
      { label: '孩子', value: '亲子青少年课程：5节一对一 + 2节4:1小组课' },
      { label: '家长', value: '家长课程：每天3节一对一，须和孩子一起报名' },
      { label: '住宿', value: '可住亲子房（Condo公寓楼三床房，按每人计价）' },
      { label: '暑期旺季', value: '课程价格不变，每个学习周另加旺季附加费（2026年40美元、2027年60美元）' },
    ],
    points: [],
  },
  {
    icon: 'nightlight',
    title: 'EB Pro 晚间管理（自愿加报）',
    subtitle: '每4周5,000比索（2周2,500）· 共60小时',
    facts: [
      { label: '早上', value: '07:00–07:40 词汇课' },
      { label: '白天', value: '08:10–18:00 正常上课' },
      { label: '晚上', value: '19:00–21:20 口语课、口语练习和每日／每周小测' },
      { label: '反馈', value: '21:30–22:00 老师当天反馈，每位老师带3名学生' },
    ],
    points: [
      '分Rookie和Expert两级。分数或出勤低于80%，周六09:00–11:00要来自习。',
      '每期前3名有表彰，第1名可以挑选一位老师。',
    ],
  },
  {
    icon: 'rule',
    title: '上课与分班规定',
    subtitle: '所有课程',
    facts: [
      { label: '上课时间', value: '08:00–18:00，每天最多10节；不能指定上课时间' },
      { label: '老师', value: '按级别安排，每4周换一次；可以申请更换，但不能指定某位老师' },
      { label: '小组课', value: '没有同级同学时，2节小组课改为1节一对一；换小组课老师须全组同意' },
      { label: '升级', value: '每2周有一次升级考试' },
      { label: '选修课', value: '每2周300比索，如即兴口语、雅思口语、语法、听力、健身和瑜伽' },
    ],
    points: [],
  },
];

const FIRST_DAY = [
  { label: '07:20–08:00', value: '早餐' },
  { label: '07:50–08:10', value: '带护照办理入学' },
  { label: '08:10–08:50', value: '参观校园、入学说明' },
  { label: '08:50–09:50', value: '拍证件照、买教材' },
  { label: '10:00–18:00', value: '上课；13:00–17:00课间去交到校学杂费' },
  { label: '17:15–17:40', value: '欢迎会，之后晚餐' },
  { label: '22:00', value: '晚间点名' },
];

export const PINES_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'flight_land',
    eyebrow: 'BEFORE ARRIVAL',
    title: '出发前准备',
    facts: [
      { label: '分级测试', value: '入学前约3周收到线上测试，须在入学前1周完成' },
      { label: '接机', value: '学校周日在马尼拉或克拉克团体接机；航班信息在入学前一周的周五前交；周日19:00以后到达的航班不接' },
      { label: '到接机点', value: '比约定时间早1小时到；尽量不选周日凌晨1点那一班' },
      { label: '现金', value: '带比索或美元现金；碧瑶大多不收支付宝和微信，到校学杂费用现金交' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'event',
    eyebrow: 'FIRST DAY',
    title: '到校第一天（周一）',
    facts: FIRST_DAY,
    note: '完成线上分级测试的学生周一10:00开课；没完成的周一到校考试、周二开课，少上的一天不补。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS',
    title: '用餐与周末',
    facts: [
      { label: '平日', value: '周一至周五三餐含在住宿费里' },
      { label: '周六早餐', value: '包含，不能取消' },
      { label: '周六午晚餐、周日', value: '周五17:00前在学校系统预订，每餐179比索；当天订250比索' },
    ],
    note: '用餐时间以学校当期安排为准。',
  },
  {
    icon: 'fitness_center',
    eyebrow: 'FACILITIES',
    title: '设施开放时间',
    facts: [
      { label: '健身房', value: '周一12:00–22:00，周二至周日06:00–22:00；周一至周五18:00–22:30有免费教练' },
      { label: '健身课', value: '周二、周四19:00–19:40（选修）' },
      { label: '瑜伽课', value: '周三、周五06:45–07:30（选修）' },
      { label: '乒乓球', value: '免费；周一12:00–22:00，周二至周日08:00–22:00' },
      { label: '洗衣', value: '洗加烘每次200比索（最多7公斤），只洗或只烘130比索' },
    ],
    note: '学校系统（PINES Portal）可以看课表、通知、成绩、积分和缴费，也能和学校在线沟通。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费（2027年2月1日起入学）',
    facts: [
      { label: '加课', value: '一对一：ESL 8,000、托业／雅思9,000比索；4:1小组课3,500比索（计费周期报名时向学校确认）' },
      { label: '选修课', value: '每2周300比索' },
      { label: '多住一晚', value: '多人间1,500、单人房2,500比索' },
    ],
    note: '到校后用比索在学校缴纳。',
  },
  {
    icon: 'hiking',
    eyebrow: 'WEEKENDS',
    title: '周末活动',
    facts: [{ label: '常见行程', value: 'Mt. Ulap登山、San Juan La Union海边、Hundred Islands百岛、志愿者活动' }],
    note: '自愿参加、费用自付；行程以学校当期安排为准。',
  },
];

/** The school's 2027 March/April holiday notice; other months follow later school notices. */
export const PINES_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '学校已公布3–4月',
    months: [
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节', provisional: true },
          { day: '25日', name: '圣周四' },
          { day: '26日', name: '耶稣受难日' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
    ],
  },
];

/** Saturday make-up classes for the March/April holidays, by four-week term. */
export const PINES_MAKEUP_NOTE = '3–4月假期补课：2027/03/08–04/02这一期在3月13日（周六）补课；2027/03/22–04/16这一期在4月3日（周六）补课。';

export const PINES_FAQS: FaqItem[] = [
  { question: 'PINES的2027年价格什么时候开始？', answer: '学费和房费按报名日期：2027年1月31日前报名按2026年价格，2月1日起报名按2027年价格。到校学杂费按入学日期：2027年2月1日起入学按2027年标准。报价器会按你填的日期自动计算。' },
  { question: '现在报名有什么优惠？', answer: '2027年1月31日前报名：暑期旺季以外的课程每满4周减150美元，课程满12周再减100美元，满16周再减100美元，之后每多2周再减25美元。2027年2月1日至6月30日报名并入学：旺季以外每个学习周减25美元，课程满12周减100美元，之后每多1周再减25美元。通过思达启航报名都免100美元注册费，课程和住宿按原价打95折。' },
  { question: 'PINES有旺季附加费吗？', answer: '有。2026/06/28–08/22每周40美元，2027/06/27–08/21每周60美元；课程和住宿在同一周只算一次，附加费不打折。' },
  { question: '雅思保分班选8周还是12周？', answer: '学校建议读12周，或8周后再加2周，或先读2周常规雅思再读8周保分班。入学须雅思4.0以上并通过线上口语面试，思达启航顾问帮你预约。' },
  { question: '未满18岁可以去PINES吗？', answer: '2026年8月23日起入学，18岁以下不能读成人课程。13–17岁可报青少年雅思营，和菲律宾老师同住管理；7–15岁可由家长陪同读亲子课程，家长同时报家长课程。' },
  { question: '去碧瑶要准备现金吗？', answer: '要。碧瑶大多不收支付宝和微信，到校学杂费用比索现金交给学校；也可以带美元现金在当地换。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机、预存积分和押金另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const PINES_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];
