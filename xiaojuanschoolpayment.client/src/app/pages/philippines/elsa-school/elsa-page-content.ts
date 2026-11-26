// Text and data of the ELSA page, from ELSA's Google Drive pack (received 2026-11-25): the 2026 comprehensive
// brochure, the 2026-09 adult ESL brochure, the junior/schooling/family brochure, the 2026-10 new-student
// orientation, the 2026-10-14 pre-departure guide with its local-fee sheet, the 2027 ESL calendar, the permits and
// the school's photos and aerial video. The shared Philippine school template reads this module through
// elsa-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it.
// Never add the school's address, phone, KakaoTalk or other contact channels, website or social accounts, its
// expulsion list's wording about discounts, or any agency terms.
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
import type { PhRoomProfile, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const ELSA_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const ELSA_PAGE_TEXT = {
  heroLead: 'ELSA 2004年创立，在宿务北部的 Compostela，离市区远、离海边近，是带泳池和花园的度假式校园。课程价已含住宿和三餐；成人每天最多6节一对一，也有青少年、幼儿园、插班上学和家长陪读课程，适合想安静学习的成人和带孩子来的家庭。',
  advisorText: 'ELSA 校园大、人少、安静，周边没有夜生活，平日适合专心上课，周末可以去商场或海边放松。成人课程按一对一节数分五档，晚自习和单词测试自愿参加、不罚款。学校同时办有菲律宾教育部认可的本地学校，孩子可以读青少年英语、幼儿园，也可以进本地学校的班级随班上课，有影子老师陪同；家长可以一起上课，也可以只陪读。离宿务市区较远，平日想出去逛街吃饭的学生不太合适。',
  campusIntro: '校园由A楼（前台、办公室、医务室、幼儿园、电脑室、餐厅和小卖部）、ESL教学中心（72间一对一教室、6间小组教室和1间自习室）、本地学校的教学楼和A、B、C三栋宿舍组成；户外有游泳池、羽毛球场、乒乓球台、篮球场和单双杠。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '课程价含课程、住宿和三餐，按五人间计算；住其他房型见下方住宿加价。每节课50分钟，点开课程可看适合人群和说明。',
  roomsPhotoIntro: '照片按宿舍楼分：A栋是4–5人的大房间，B栋和C栋是2–3人的房间（单人间是一人住B栋或C栋的房间）。具体房间由学校安排。',
  finalCtaTitle: '想确认 ELSA 的空房、课程和优惠？',
  finalCtaText: '告诉顾问入学日期、周数、谁来读和想住的房型，我们帮你向学校确认，并做一份完整报价。',
} as const;

export const ELSA_QUICK_INFO = [
  { icon: 'location_on', title: '宿务北部', text: 'Compostela，离宿务机场约30分钟车程' },
  { icon: 'restaurant', title: '课程含食宿', text: '课程价已含住宿和三餐' },
  { icon: 'record_voice_over', title: '成人一对一', text: '每天3–6节一对一，分五档' },
  { icon: 'school', title: '本地学校随班', text: '孩子可进本地学校班级上课，有影子老师' },
  { icon: 'family_restroom', title: '家长陪读', text: '家长可上课，也可以只陪读' },
  { icon: 'pool', title: '度假式校园', text: '泳池、花园和球场，离海边约4分钟' },
];

/** Key facts under the hero title (compact layout); the buildings are in ELSA_CAMPUS_BUILDINGS. */
export const ELSA_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务北部 Compostela，离宿务机场约30分钟车程；到 Liloan 的 Gaisano Grand 商场约15分钟' },
  { icon: 'history_edu', label: '创立', value: '2004年；同校另有菲律宾教育部认可的幼儿园至高中' },
  { icon: 'menu_book', label: '课程', value: '成人ESL五档、青少年ESL、幼儿园、本地学校随班课程和家长课程' },
  { icon: 'restaurant', label: '含食宿', value: '课程价已含住宿和一日三餐，按五人间计算' },
  { icon: 'nights_stay', label: '晚自习', value: '周一至周四晚上，自愿参加，不罚款' },
  { icon: 'event_busy', label: '2027旺季', value: '寒假旺季已满；暑假旺季另收附加费，金额学校还在确定' },
];

export const ELSA_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'ELSA 国际语言学校（宿务）' },
  { label: '创立', value: '2004年' },
  { label: '位置', value: '菲律宾宿务省 Compostela' },
  { label: '课程', value: '成人ESL、青少年ESL、幼儿园、本地学校随班课程、家长课程' },
  { label: '住宿', value: '校内宿舍，单人间到五人间，含三餐' },
  { label: '入学', value: '周日入住，周一入学说明会，周二开始上课' },
];

export const ELSA_SUITABLE_FOR = [
  '想在安静环境里专心学习的成人',
  '带孩子来读书、想一起上课或只陪读的家长',
  '想让孩子进本地学校班级、体验英语授课的家庭',
  '零基础、想全部上一对一的学生',
];

export const ELSA_NOT_SUITABLE_FOR = [
  '平日下课后想去市区逛街、吃饭的学生',
  '想报托福或雅思之外考试课程的学生',
  '想读到C1、C2高级水平的学生',
];

/** The campus map of the 2026 adult ESL brochure; shown as the campus strip in the hero. */
export const ELSA_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'A', title: 'A楼', icon: 'apartment', facilities: ['前台和办公室', '医务室', '幼儿园和电脑室', '餐厅和小卖部'] },
  { code: 'ESL', title: 'ESL教学中心', icon: 'school', facilities: ['72间一对一教室', '6间小组教室', '1间自习室'] },
  { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['A栋：14间，每间4–5人', 'B栋：10间，每间2–3人', 'C栋：20间，每间2–3人'] },
  { code: 'OUT', title: '户外设施', icon: 'pool', facilities: ['游泳池', '羽毛球场和乒乓球台', '篮球场', '单杠和双杠'] },
];

const campus = (file: string) => `assets/elsa/campus/${file}.webp`;
const study = (file: string) => `assets/elsa/study/${file}.webp`;
const life = (file: string) => `assets/elsa/life/${file}.webp`;
const rooms = (file: string) => `assets/elsa/rooms/${file}.webp`;
export const ELSA_QUOTE_IMAGE_HERO = '/assets/elsa/campus/aerial-01.webp';

export const ELSA_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'ELSA 校园航拍', description: '校园在海边附近，四周是树林。', src: campus('aerial-01') },
  { category: '校园', title: 'ELSA 校园航拍', description: '红顶的平房教学楼和宿舍散布在绿地里。', src: campus('aerial-02') },
  { category: '校园', title: '校园入口', description: '校门内的 ELSA 字母和主楼。', src: campus('main-building') },
  { category: '校园', title: '校园小路', description: '教学楼之间的步道和花园。', src: campus('garden-path') },
  { category: '校园', title: '校园一角', description: '画着壁画的教学楼。', src: campus('mural-building') },
  { category: '校园', title: '附近海边', description: '学校附近的海边日落。', src: campus('beach-sunset') },
  { category: '教室', title: '一对一教学楼', description: 'ESL教学中心，72间一对一教室。', src: study('one-on-one-building') },
  { category: '教室', title: '一对一教室', description: '一位老师对一位学生，每节课50分钟。', src: study('one-on-one-room') },
  { category: '教室', title: '一对一上课', description: '成人一对一课堂。', src: study('adult-class-01') },
  { category: '教室', title: '一对一上课', description: '成人一对一课堂。', src: study('adult-class-02') },
  { category: '教室', title: '一对一上课', description: '成人一对一课堂。', src: study('adult-class-03') },
  { category: '教室', title: '教室走廊', description: '一对一教室沿走廊排开。', src: study('corridor') },
  { category: '教室', title: '小组教室', description: '小组课教室。', src: study('group-room-01') },
  { category: '教室', title: '小组教室', description: '小组课教室。', src: study('group-room-02') },
  { category: '教室', title: '小组教室', description: '小组课教室。', src: study('group-room-03') },
  { category: '教室', title: '大教室', description: '可容纳较多学生的教室。', src: study('large-classroom') },
  { category: '教室', title: '幼儿园', description: '幼儿园教室门口。', src: study('kindergarten') },
  { category: '教室', title: '本地学校课堂', description: '本地学校的手工课，随班上课的孩子和本地学生一起上。', src: study('school-class') },
  { category: '教室', title: '本地学校活动', description: '本地学校在图书馆办的辩论比赛。', src: study('school-library') },
  { category: '住宿', title: 'A栋宿舍', description: '每间住4–5人。', src: rooms('dorm-a-01') },
  { category: '住宿', title: 'B栋宿舍', description: '每间住2–3人。', src: rooms('dorm-b-03') },
  { category: '住宿', title: 'C栋宿舍', description: '每间住2–3人，最新的一栋。', src: rooms('dorm-c-02') },
  { category: '餐厅', title: '餐厅', description: '一日三餐都在这里吃。', src: campus('dining-area') },
  { category: '餐厅', title: '小卖部', description: '零食、饮料和日用品。', src: campus('canteen-01') },
  { category: '餐厅', title: '小卖部', description: '小卖部的座位区。', src: campus('canteen-02') },
  { category: '餐厅', title: '零食吧', description: '晚上可以买罐装啤酒（每人最多2罐）。', src: campus('snack-bar') },
  { category: '餐厅', title: '学校餐食', description: '学校的一份餐。', src: life('meal-01') },
  { category: '餐厅', title: '学校餐食', description: '学校的一份餐。', src: life('meal-02') },
  { category: '餐厅', title: '学校餐食', description: '学校的一份餐。', src: life('meal-03') },
  { category: '餐厅', title: '学校餐食', description: '学校的一份餐。', src: life('meal-04') },
  { category: '餐厅', title: '学校餐食', description: '学校的一份餐。', src: life('meal-05') },
  { category: '餐厅', title: '学校餐食', description: '学校的一份餐。', src: life('meal-06') },
  { category: '设施', title: '游泳池', description: '平日18:00–22:00，周末10:00–22:00开放，周一不开。', src: campus('pool-01') },
  { category: '设施', title: '游泳池', description: '泳池和周围的草地。', src: campus('pool-02') },
  { category: '设施', title: '游泳池', description: '孩子游泳须有家长看护。', src: campus('pool-03') },
  { category: '设施', title: '羽毛球', description: '校内草地上的羽毛球场。', src: campus('badminton') },
  { category: '设施', title: '乒乓球', description: '校内乒乓球台。', src: campus('table-tennis') },
  { category: '设施', title: '高尔夫练习场', description: '校内的高尔夫练习打位。', src: campus('golf-practice') },
  { category: '设施', title: '周末出游', description: '成人学员周末去峡谷溯溪（自费）。', src: life('weekend-canyoneering') },
  { category: '设施', title: '周末出游', description: '成人学员周末去海岛（自费）。', src: life('weekend-island') },
];

export const ELSA_ALBUM_DESCRIPTIONS = {
  校园: '校园航拍、入口、花园与附近海边',
  教室: '一对一教室、小组教室、幼儿园与本地学校课堂',
  住宿: 'A栋、B栋与C栋宿舍',
  餐厅: '餐厅、小卖部与学校餐食',
  设施: '游泳池、球场、高尔夫练习场与周末出游',
} as const;

/**
 * The school's aerial campus video, 720p-class H.264 in public/assets/elsa/videos/. The top of the frame, which
 * carried the school's website as a watermark, was cropped off, and the closing credits were cut.
 */
export const ELSA_CAMPUS_VIDEO: PhVideoItem = {
  title: '校园航拍', text: '学校拍的校园和附近海边；海边离学校约4分钟。',
  src: '/assets/elsa/videos/campus-aerial.mp4', poster: '/assets/elsa/videos/campus-aerial.webp', duration: '1:58', shape: 'wide',
};

const elsaVideo = (file: string, title: string, text: string, duration: string, shape: 'wide' | 'tall'): PhVideoItem => ({
  title, text, src: `/assets/elsa/videos/${file}.mp4`, poster: `/assets/elsa/videos/${file}.webp`, duration, shape,
});

/**
 * Clips from ELSA's own YouTube channel, all from 2026 (user request 2026-11-26), 720p H.264 in
 * public/assets/elsa/videos/; each ends with the school's logo only. None needed a cut.
 */
export const ELSA_POOL_VIDEO = elsaVideo('pool-rules', '游泳池使用规则', '学校用中文介绍泳池：平日课后开放，周末和假日全天开放。', '1:19', 'wide');
export const ELSA_DORM_C_VIDEO = elsaVideo('dorm-c-building', 'C栋宿舍实拍', '学校拍的C栋宿舍走廊和三人间。', '0:43', 'tall');
export const ELSA_LUNCH_VIDEO = elsaVideo('lunch', '午餐时间', '学校餐厅的午餐。', '0:37', 'tall');
export const ELSA_ACTIVITY_VIDEOS: PhVideoItem[] = [
  elsaVideo('after-school-swim-golf', '课后游泳和高尔夫', '孩子们放学后的游泳课和高尔夫课，都在校内。', '1:13', 'wide'),
  elsaVideo('zumba', '周三尊巴舞课', '每周三晚上在餐厅上尊巴舞课，学员都可以参加。', '1:55', 'wide'),
];

const numbered = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => rooms(`${prefix}-${String(index + 1).padStart(2, '0')}`));
const ROOM_SERVICE = '每周打扫2次，每月换床单2次；每周免费洗衣2次，每人每次4公斤';

/**
 * The school's photos are sorted by dormitory building, not by room type: A holds the four- and five-person rooms,
 * B and C the twin and triple rooms (a single is one person in a B or C room). So the cards share two albums.
 */
export const ELSA_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'dorm-bc', rateIds: ['room-1', 'room-2', 'room-3'], label: 'B栋／C栋宿舍', location: '校内', bed: '单人床', service: ROOM_SERVICE,
    suitable: '想住得安静一些的学生和家庭', note: '单人间、双人间和三人间都在B栋（10间）或C栋（20间，最新），每间住2–3人；具体楼栋由学校安排。',
    highlights: ['房内有卫生间和淋浴', '书桌、衣柜和空调'],
    image: rooms('dorm-c-02'), gallery: [...numbered('dorm-c', 9), ...numbered('dorm-b', 6)], imageAlt: 'ELSA B栋和C栋宿舍实景',
  },
  {
    id: 'dorm-a', rateIds: ['room-4', 'room-5'], label: 'A栋宿舍', location: '校内', bed: '单人床', service: ROOM_SERVICE,
    suitable: '预算优先的学生，或一起来的大家庭', note: '四人间和五人间在A栋，共14间，每间住4–5人。',
    highlights: ['房内有卫生间和淋浴', '书桌和小冰箱'],
    image: rooms('dorm-a-01'), gallery: numbered('dorm-a', 7), imageAlt: 'ELSA A栋宿舍实景',
  },
];

/** From the 2026-10 new-student orientation; the full list of expulsion reasons is given by the school on arrival. */
export const ELSA_DORM_RULES = [
  { title: '门禁', text: '00:00–06:00不能外出；未满18岁、没有家长陪同的学生外出须经学校批准。' },
  { title: '外出和访客', text: '出入校门凭出入证；家人或朋友来访要提前一周告诉经理。' },
  { title: '喝酒和吸烟', text: '只能在零食吧17:00–22:00买罐装啤酒，每人最多2罐，不能带回宿舍；只能在指定区域吸烟。' },
  { title: '换宿舍', text: '换宿舍收4,000比索；旺季只有3人以上才能换到A栋。' },
  { title: '补办', text: '出入证或钥匙丢失补办400比索。' },
  { title: '宠物', text: '校内的宠物要拴绳。' },
  { title: '开除', text: '和员工私下外出或交易、进入异性房间、打架、违法等严重违规会立即开除，不退款；家长被开除时，同来的孩子也要离校。' },
];

/** The adult ESL weekday timetable of the 2026-09 brochure and the orientation; classes are 50 minutes. */
export const ELSA_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '08:10–09:00', activity: '第1节（一对一、小组课或空堂）', kind: 'class' },
  { time: '09:10–10:00', activity: '第2节', kind: 'class' },
  { time: '10:10–11:00', activity: '第3节', kind: 'class' },
  { time: '11:10–12:00', activity: '第4节', kind: 'class' },
  { time: '12:00–13:00', activity: '午餐', kind: 'meal' },
  { time: '13:10–14:00', activity: '第5节（一对一、小组课或空堂）', kind: 'class' },
  { time: '14:10–15:00', activity: '第6节', kind: 'class' },
  { time: '15:10–16:00', activity: '第7节', kind: 'class' },
  { time: '16:10–17:00', activity: '第8节', kind: 'class' },
  { time: '17:00–18:00', activity: '晚餐', kind: 'meal' },
  { time: '18:00–19:00', activity: '老师看管的晚自习（周一至周四，自愿）', kind: 'activity' },
  { time: '19:00–20:00', activity: '单词和造句测试（周一至周四，自愿）', kind: 'test' },
];

export const ELSA_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'forum',
    title: '成人ESL：分级、教材和小组课',
    subtitle: 'A1–B2水平，按一对一节数分五档',
    courseIds: ['super-basic', 'basic', 'general', 'intensive', 'super-intensive'],
    facts: [
      { label: '级别', value: '按欧洲语言标准CEFR分级，另有零基础的Pre-A级；成人课程覆盖A1–B2，不开C1、C2课程' },
      { label: '教材', value: '一对一按口语、单词、阅读、写作、语法选书，从入门到高级每级都有' },
      { label: '小组课', value: 'Callan口语、讨论课、职场英语和生活英语' },
      { label: '雅思', value: '另有雅思课程（目标最高6.5分），每月、每两周或每周模考；价格请问顾问' },
    ],
    points: ['学校不开托福备考课程。'],
  },
  {
    icon: 'child_care',
    title: '青少年和幼儿园',
    subtitle: '7–14岁青少年ESL，4–7岁幼儿园',
    courseIds: ['junior-esl', 'kinder', 'nursery'],
    facts: [
      { label: '青少年ESL', value: '每天4节一对一和3节小组课，小组课每班最多8人，同学来自韩国、日本和中国等' },
      { label: '幼儿园', value: '一对一加小组活动课：编程、国家地理科学实验、烹饪、美术和音乐剧' },
      { label: '幼儿托管', value: '42–47个月的孩子，保姆陪同上4节小组课' },
      { label: '反馈', value: '入学一周后，学校会告诉家长孩子的适应情况和老师反馈' },
    ],
    points: ['幼儿园学生在校内要穿袜子，并自带水杯。'],
  },
  {
    icon: 'school',
    title: '本地学校随班课程',
    subtitle: '进 ELSA 本地学校的班级，和本地学生一起上课',
    courseIds: ['schooling-half', 'schooling-all'],
    facts: [
      { label: '学校', value: 'ELSA 本地学校有菲律宾教育部认可的幼儿园至高中，也是加拿大安大略省认可的学校' },
      { label: '半天', value: '上午随班上课，下午4节一对一' },
      { label: '全天', value: '全天随班上课；菲律宾语课时间改上1节一对一，至少读4周' },
      { label: '影子老师', value: '一对一的影子老师进课堂陪孩子，帮他跟上课' },
      { label: '另付', value: '校服（全天约4,000比索，半天约1,885比索）和讲义复印费（全天约1,500比索，半天约500–700比索）' },
    ],
    points: ['学校放假期间没有正规课，可能改上ESL。', '年纪较大、英语较弱的孩子可能跟不上全天课，建议先读半天。'],
  },
  {
    icon: 'family_restroom',
    title: '家长课程和陪读',
    subtitle: '陪孩子来的家长',
    courseIds: ['guardian-relax', 'guardian-esl', 'guardian-group', 'guardian-golf', 'guardian-stay'],
    facts: [
      { label: '上课', value: '家长可选只上小组课、2节一对一、2节一对一加2节小组课，或小组课加每周2次高尔夫球场课' },
      { label: '只陪读', value: '不上课，价格已含注册费和食宿，不参加优惠和折扣，只能住三人间到五人间' },
      { label: '幼儿照看', value: '0–47个月的孩子可请保姆，每天1,000比索' },
      { label: '游泳', value: '孩子游泳须有家长看护' },
    ],
    points: [],
  },
  {
    icon: 'rule',
    title: '入学、换课与晚自习',
    subtitle: '所有课程',
    facts: [
      { label: '入学前', value: '出发前约4周做线上测试（阅读、写作、单词，口语视频测试10–20分钟），学校据此提前备好教材和课表' },
      { label: '第一周', value: '周一入学说明会和商场采购，不上课；周二开始上课，第一周可以调整课程' },
      { label: '换课', value: '周二至周四09:00–17:00向办公室交换课申请' },
      { label: '晚自习', value: '周一至周四晚上，节假日前一晚不上；自愿参加，测试成绩不罚款；无故缺席一次会停一周，退出后只能再加入一次' },
      { label: '结业后', value: '可以预约原来的老师继续上线上一对一' },
    ],
    points: [],
  },
];

export const ELSA_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '三餐', value: '07:00–08:00、12:00–13:00、17:00–18:00，开饭后30分钟内供餐' },
      { label: '游泳池', value: '平日18:00–22:00，周末10:00–22:00，周一不开' },
      { label: '运动课', value: '尊巴舞每周1次、跆拳道每周2次免费；游泳课8节2,000比索' },
      { label: '周末', value: '学校可以免费帮你规划周末行程' },
    ],
    note: '游泳要穿防滑水鞋。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '打扫、洗衣和其他服务',
    facts: [
      { label: '洗衣', value: '每周免费2次，每人每次4公斤；超出每公斤25比索，加洗一次200比索' },
      { label: '打扫', value: '每周2次，每月换床单2次；加打扫或换床单一次500比索' },
      { label: '按摩', value: '每小时400比索' },
      { label: '停电', value: '有发电机，停电后5分钟内恢复供电' },
    ],
    note: '空调电费另算：使用小时×1.8度×25比索，平均每月约4,000比索。',
  },
  {
    icon: 'badge',
    eyebrow: 'VISA & PASSPORT',
    title: '签证与护照',
    facts: [
      { label: '护照', value: '至少还有6个月有效期；到校后由学校保管，用于办SSP和续签' },
      { label: '续签', value: '超过30天要在当地续签，学校代办' },
      { label: '学杂费', value: '到校后用比索现金交，周二前交齐' },
      { label: '转学', value: 'SSP和E-CARD只在本校有效，转到其他学校要重新办' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'flight',
    eyebrow: 'BEFORE YOU GO',
    title: '出发前准备',
    facts: [
      { label: '机票', value: '必须买往返或离境机票；周日00:00后入住，周六11:00前退房' },
      { label: '保险', value: '必须买英文版旅行保险，建议保额至少35,000美元' },
      { label: '带孩子', value: '带未满15岁的孩子入境，要准备英文版户籍证明' },
      { label: '行李', value: '教室空调较冷，带薄外套和长袖；带驱蚊液和常用药' },
    ],
    note: '提前入住或延住每人每天2,000比索，视空房而定，须提前申请。',
  },
];

/** ELSA's files give no refund ratios; only the expulsion rule is the school's. The rest is 思达启航's own rule. */
export const ELSA_REFUND_COPY = {
  summaryTitle: 'ELSA 定金、改期与退款',
  summaryHint: '报名定金、改期和到校后退款',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'ELSA 定金与退款',
  intro: '报名定金由思达启航收取；到校以后的退款按学校规定办理。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以改入学日期，或把定金保留1年；不足4周改期可能要扣违约金，以学校确认为准。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '申请退款', text: '退款比例按学校规定，由思达启航顾问协助向学校申请。' },
        { when: '被学校开除', text: '不退款。' },
      ],
      footnote: ELSA_REFERENCE_NOTE,
    },
  ],
};

export const ELSA_LICENSE = {
  title: '办学资质已核验',
  items: [
    '宿务省 Compostela 镇2026年营业执照，有效期至2026年12月31日',
    '菲律宾移民局批准学校招收外国学生学习英语，有效至2029年2月7日',
    '本地学校持有菲律宾教育部的小学、初中和高中办学许可',
  ],
  note: '证件可向思达启航顾问索取查看',
};

/** Weekday holidays of ELSA's 2027 ESL calendar; weekend holidays (2/6, 3/27, 5/1, 6/12, 8/21, 12/25) are left out. */
export const ELSA_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 3, holidays: [{ day: '25日', name: '濯足节' }, { day: '26日', name: '耶稣受难日' }] },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 8, holidays: [{ day: '30日', name: '国家英雄日（31日入学说明会）' }] },
      { month: 9, holidays: [{ day: '9日', name: '奥斯梅尼亚日' }] },
      {
        month: 11,
        holidays: [
          { day: '1日', name: '万圣节' },
          { day: '2日', name: '万灵节（3日入学说明会）' },
          { day: '30日', name: '博尼法西奥日' },
        ],
      },
      {
        month: 12,
        holidays: [
          { day: '8日', name: '圣母无原罪节' },
          { day: '24日', name: '平安夜' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '年末' },
        ],
      },
    ],
  },
];

export const ELSA_HOLIDAY_FOOTNOTE = '只列出周一至周五的假日；周末的假日不影响上课。2027年全年248个上课日。';

export const ELSA_FAQS: FaqItem[] = [
  { question: 'ELSA 的价格包含什么？', answer: '课程价已含课程、住宿和一日三餐，按五人间计算；住其他房型时每4周加50到650美元。另交一次性注册费100美元（老学员返校免费），到校后的签证、SSP、设施费和教材费用比索现金另付。' },
  { question: '2027年的价格和旺季怎么安排？', answer: '学校还没有公布2027年价格，现在按2026年价格报价。2027年寒假旺季已经报满；暑假旺季会另收附加费，金额学校还在确定，淡季优惠预计下个月公布。顾问拿到学校通知后会第一时间告诉你。' },
  { question: '现在报名有什么优惠？', answer: '2026年8月30日至12月26日期间上课的周：成人ESL课程的课程和食宿费半价；青少年和幼儿园课程全部在这段时间内的，报3周送1周、报8周送4周（读4周只付3周，读12周只付8周）。都是名额有限、报满即止。通过思达启航报名，课程和食宿费先享9折，再扣学校优惠（家长只陪读不上课的除外）。报价器会按你的日期自动计算。', until: '2026-12-21' },
  { question: '孩子可以进本地学校上课吗？', answer: '可以。ELSA 有菲律宾教育部认可的本地学校，孩子可以报半天（上午随班、下午4节一对一）或全天随班课程，有影子老师进课堂陪同。全天课程至少读4周，校服和讲义复印费另付。' },
  { question: '家长一定要上课吗？', answer: '不一定。家长可以选只上小组课、2节一对一或加高尔夫的课程，也可以只陪读不上课。只陪读的价格已含注册费，不参加优惠和折扣，只能住三人间到五人间，也不用办SSP。' },
  { question: '晚自习是强制的吗？', answer: '不是。周一至周四晚上有老师看管的晚自习和单词测试，成人自愿参加，成绩不罚款；但报名后无故缺席一次会停一周。' },
  { question: '到校学杂费大概多少？', answer: '主要是SSP 7,800和E-CARD 4,500比索（只办一次）、设施费每人每周1,500比索、教材每4周约2,000比索；读超过30天还要续签。空调电费按用量另算，平均每月约4,000比索；押金每个家庭5,000比索，退房时退。报价器会按你的周数和签证算出明细。' },
  { question: '离市区远吗？周末去哪儿？', answer: '学校在宿务北部 Compostela，离宿务机场约30分钟车程，到 Liloan 的 Gaisano Grand 商场约15分钟、SM Consolacion 约25分钟，海边约4分钟。学校可以免费帮你规划周末行程。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const ELSA_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];

/** Offer cards above the quote; each hides from its `until` date (the last Sunday a course can still qualify). */
export const ELSA_OFFERS = [
  {
    icon: 'sell', title: '2026淡季成人ESL半价', amount: '课程和食宿费半价',
    text: '2026年8月30日至12月26日期间上课的周，成人ESL五档课程都半价。',
    detail: '名额有限，报满即止；家长课程不参加。', until: '2026-12-21', promotionIds: ['elsa-off-season-adult-2026'],
  },
  {
    icon: 'redeem', title: '2026淡季青少年和幼儿送周', amount: '报3周送1周',
    text: '青少年、本地学校随班和幼儿园课程全部在2026年8月30日至12月26日期间：报3周送1周，报8周送4周（读4周只付3周，读12周只付8周）。',
    detail: '名额有限，报满即止。', until: '2026-11-30', promotionIds: ['elsa-off-season-kids-2026'],
  },
];
