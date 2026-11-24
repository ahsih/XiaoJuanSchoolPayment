// Text and data of the HANA Academy page, from HANA's 2026–27 Chinese brochures (adult, family, junior camp,
// low-season promotion, price list), the new-student orientation, the school's confirmed message of 2026-11-23
// and its public map reviews. The shared Philippine school template reads it through hana-page-profile.ts.
// Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it. Never add the
// school's phone, address, website, application link, social accounts or staff names, and never cite sources.
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
import type { PhRoomProfile, PhTextReview } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import { HANA_PEAK_SEASONS } from './hana-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const HANA_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const HANA_PAGE_TEXT = {
  heroLead: '克拉克安静的花园式校园，以菲律宾老师一对一为主，另有美国外教；成人、亲子家庭和50岁以上乐龄学员都能来读。',
  advisorText: 'HANA 校园像一座带泳池的花园，出门步行1分钟就有超市、餐厅、按摩店和高尔夫练习场，生活很方便。课程以菲律宾老师一对一为主，每门成人课都有外教小班，想多跟外教练可以选Native ESL或Native Only。18岁以上没有门禁，适合想轻松学英语的成人；亲子家庭可以让孩子读Junior或幼儿园，家长按需上课，淡季还能不上课。旺季不加价，淡季住得越久折扣越多。',
  campusIntro: '教学楼、宿舍、餐厅、泳池和花园都在同一个校园里，宿舍每间都有空调。',
  galleryIntro: '按区域查看校园、教室和住宿；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习对象分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟。',
  roomsPhotoIntro: '点选房型查看实景；目前有双人间的照片，其他房型照片学校补充后再放上来。',
  finalCtaTitle: '想确认 HANA 的空房和淡季优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、同行人数和想住的房型，我们帮你确认房间并做一份完整报价。',
};

export const HANA_QUICK_INFO = [
  { icon: 'location_on', title: '克拉克', text: '安吉利斯市，距克拉克国际机场约25分钟车程' },
  { icon: 'record_voice_over', title: '一对一为主', text: '菲师一对一＋外教小班，每节45分钟' },
  { icon: 'family_restroom', title: '成人与亲子', text: '成人、Junior、幼儿园和乐龄课程' },
  { icon: 'pool', title: '花园泳池', text: '泳池、凉亭和自习室都在校内' },
  { icon: 'sports_golf', title: '英语＋高尔夫', text: '步行1分钟到高尔夫练习场' },
  { icon: 'event_available', title: '旺季不加价', text: '淡季住得越久折扣越多' },
];

/** Key facts under the hero title (compact layout); what each area has is in HANA_CAMPUS_BUILDINGS. */
export const HANA_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾克拉克－安吉利斯市，距克拉克国际机场约25分钟车程；出校门步行1分钟有超市、餐厅和高尔夫练习场' },
  { icon: 'rule', label: '管理', value: '18岁及以上没有门禁（23:00后大门上锁，用密码进门）；未满18岁外出须由老师或管理人员陪同' },
  { icon: 'menu_book', label: '课程', value: '成人ESL、托业、雅思、英语＋高尔夫、50岁以上乐龄课程；7–17岁Junior、3–6岁幼儿园、寒暑假青少年英语营' },
  { icon: 'record_voice_over', label: '老师', value: '以菲律宾老师一对一为主，另有美国外教一对一和小班课' },
  { icon: 'event', label: '入学', value: '周六17:00起可入住，多数学生周日抵达；周一分级测试后开课' },
  { icon: 'bed', label: '住宿', value: '校内单人间、双人间、三人间和3–5人家庭房，每间有空调和独立卫浴；含餐、清洁和洗衣' },
  { icon: 'event_available', label: '旺季', value: '2027年1/3–2/27、6/27–8/28为旺季，不另收附加费；淡季有长住折扣' },
  { icon: 'verified', label: '资质', value: '持有菲律宾移民局外国学生就读许可（SSP），并获TESDA认证' },
];

export const HANA_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'HANA Academy（哈娜语言学校）' },
  { label: '位置', value: '菲律宾克拉克－安吉利斯市' },
  { label: '创立', value: '2019年' },
  { label: '管理方式', value: '成人自我管理，没有门禁；未成年人由老师或管理人员陪同外出' },
  { label: '课程', value: '成人ESL、托业、雅思、高尔夫、乐龄；Junior、幼儿园、青少年英语营' },
  { label: '住宿', value: '校内宿舍：单人间、双人间、三人间、家庭房' },
  { label: '入学', value: '每周日抵达，周一分级测试后开课' },
];

export const HANA_SUITABLE_FOR = [
  '想轻松学英语、生活方便的成人',
  '带3–17岁孩子的亲子家庭',
  '50岁以上、想边旅行边学英语的乐龄学员',
  '想边学英语边打高尔夫的学员',
];

export const HANA_NOT_SUITABLE_FOR = [
  '想要严格斯巴达管理的学生：成人没有门禁，靠自我管理',
  '想住单人间又想用“付4周读8周”的学生：优惠只限双人间',
  '旺季（1–2月、7–8月）才临时报名：房间紧张，乐龄课程和“家长不上课”也不开放',
];

export const HANA_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['空调一对一教室', '小班教室和幼儿园教室', '自习室每天08:00–23:00'] },
  { code: 'DORM', title: '校内宿舍', icon: 'bed', facilities: ['单人间、双人间、三人间和3–5人家庭房', '空调、WiFi、独立卫浴和书桌', '每周2次清洁和洗衣'] },
  { code: 'LIFE', title: '花园与泳池', icon: 'pool', facilities: ['泳池：平日13:00–21:00，周末08:00–21:00', '花园竹凉亭和公共休息区', '步行1分钟到高尔夫练习场和羽毛球场'] },
  { code: 'DINING', title: '餐厅', icon: 'restaurant', facilities: ['平日三餐，周末和假日1餐（早午餐）', '韩国、日本、中国大陆、中国台湾、越南、菲律宾等多国菜色', '餐食只在规定时间供应'] },
];

const campus = (file: string) => `assets/hana/campus/${file}.webp`;
const rooms = (file: string) => `assets/hana/rooms/${file}.webp`;

/** Only HANA's own photos, each labelled with what it surely shows. */
export const HANA_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: '花园泳池', description: '校园中间的泳池，池中有小岛和拱桥。', src: campus('pool-fountain') },
  { category: '校园', title: '校园花园', description: '泳池边的草地、树木和竹凉亭。', src: campus('garden-gazebo') },
  { category: '校园', title: '泳池与花园', description: '课后可以在泳池游泳放松。', src: campus('pool') },
  { category: '校园', title: '花园一角', description: '泳池旁的草地和树荫。', src: campus('garden') },
  { category: '教室', title: '一对一教室', description: '有空调的一对一教室，每节课45分钟。', src: campus('class-one-to-one') },
  { category: '教室', title: '一对一上课', description: '菲律宾老师一对一上课。', src: campus('class-one-to-one-02') },
  { category: '教室', title: '小班教室', description: '小班课和外教小班课的教室。', src: campus('class-group') },
  { category: '教室', title: '教室走廊', description: '教室所在的走廊。', src: campus('class-corridor') },
  { category: '教室', title: '自习室', description: '每天08:00–23:00开放。', src: campus('study-hall') },
  { category: '教室', title: '自习室座位', description: '有隔板的自习座位。', src: campus('study-hall-02') },
  { category: '教室', title: '幼儿园教室', description: '3–6岁幼儿园孩子上课的教室。', src: campus('kindergarten') },
  { category: '教室', title: '幼儿园小教室', description: '铺着软垫的小教室。', src: campus('kindergarten-02') },
  { category: '住宿', title: '双人间', description: '两张单人床，有空调。', src: rooms('double-01') },
  { category: '住宿', title: '双人间（另一间）', description: '两张单人床，房间整洁明亮。', src: rooms('double-02') },
  { category: '住宿', title: '双人间书桌和衣柜', description: '两人共用的书桌和衣柜。', src: rooms('double-desk') },
  { category: '住宿', title: '宿舍卫浴', description: '房间内的独立卫浴。', src: rooms('bathroom') },
  { category: '住宿', title: '宿舍走廊', description: '宿舍楼的走廊。', src: rooms('corridor') },
  { category: '设施', title: '泳池', description: '泳池和拱桥。', src: campus('pool-02') },
  { category: '设施', title: '竹凉亭', description: '花园里的竹凉亭，可以坐着看书、聊天。', src: campus('gazebo') },
  { category: '设施', title: '凉亭座位', description: '凉亭里有桌椅。', src: campus('gazebo-inside') },
  { category: '设施', title: '公共休息区', description: '有桌椅和沙发的公共空间。', src: campus('lounge') },
  { category: '设施', title: '公共休息区（另一角）', description: '可以休息、聊天的地方。', src: campus('lounge-02') },
];

export const HANA_ALBUM_DESCRIPTIONS = {
  校园: '花园、泳池与校园环境',
  教室: '一对一、小班、自习室与幼儿园',
  住宿: '双人间与宿舍',
  餐厅: '学生餐厅',
  设施: '泳池、竹凉亭与公共休息区',
};

/**
 * A video from HANA's own material, never from an agency. The school film's first seconds showed an agency logo
 * and were cut out; check every frame of a new clip for other companies or contact details.
 */
export interface HanaVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  label: string;
  details: string[];
}

export const hanaVideoSrc = (video: HanaVideo) => `/assets/hana/videos/${video.name}.mp4`;
export const hanaVideoPoster = (video: HanaVideo) => `/assets/hana/videos/poster-${video.name}.jpg`;

export const HANA_VIDEOS: HanaVideo[] = [
  {
    name: 'school-film', title: 'HANA 学校介绍片', duration: '1:43', label: 'SCHOOL FILM',
    description: '学校老师带你走一圈：厨房、幼儿园、教室、宿舍、泳池和花园凉亭。',
    details: ['幼儿园与教室', '宿舍、泳池与花园'],
  },
  {
    name: 'teacher-interview', title: '美国外教采访', duration: '0:35', label: 'NATIVE TEACHER',
    description: '学校的美国外教在泳池边介绍自己和上课方式，英文原声。',
    details: ['外教一对一和小班课', '英文原声'],
  },
];

/** Photos come only from HANA's own material and match the labelled room. */
export const HANA_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'double',
    label: '双人间',
    englishName: 'DOUBLE ROOM',
    location: '校内',
    bed: '两张单人床',
    service: '每周2次清洁和洗衣',
    suitable: '成人学员、想控制预算的学生；“付4周读8周”只限这个房型',
    note: '两人一间，室友由学校安排，通常来自不同国家和地区。',
    highlights: ['空调、WiFi、独立卫浴、书桌', '含餐'],
    image: rooms('double-01'),
    gallery: [rooms('double-01'), rooms('double-02'), rooms('double-desk'), rooms('bathroom'), rooms('corridor')],
    imageAlt: 'HANA双人间实景',
    rateIds: ['double'],
  },
  {
    // A single bed plus a bunk bed: HANA's dormitory has only 1-, 2- and 3-bed rooms besides family rooms.
    id: 'triple',
    label: '三人间',
    englishName: 'TRIPLE ROOM',
    location: '校内',
    bed: '一张单人床 + 一张上下铺',
    service: '每周2次清洁和洗衣',
    suitable: '家长带孩子、青少年学员',
    note: '供家长和孩子或青少年入住；成人学员住单人间或双人间。',
    highlights: ['空调、WiFi、独立卫浴、书桌', '含餐'],
    image: rooms('triple-01'),
    gallery: [rooms('triple-01'), rooms('triple-02'), rooms('triple-03'), rooms('bathroom'), rooms('corridor')],
    imageAlt: 'HANA三人间实景',
    rateIds: ['triple'],
  },
];

export const HANA_DORM_RULES = [
  { title: '门禁', text: '18岁及以上没有门禁，外宿1晚以上要提前告诉学校；23:00前有工作人员值守，之后用密码进大门。' },
  { title: '未成年人', text: '未满18岁离开学校，须由老师或学校管理人员陪同。' },
  { title: '室友', text: '成人住单人间或双人间；双人间室友由学校安排，通常来自不同国家和地区；只有已婚或订婚的情侣可以同住。' },
  { title: '换房', text: '不能自行换房；双人间可申请升级单人间（视空房），不能降级。' },
  { title: '访客', text: '未经学校许可不能带外人进宿舍，严禁外人留宿。' },
  { title: '禁止事项', text: '校内和宿舍禁止喝酒、赌博和药物；不能进异性房间；室内禁烟，请到入口的吸烟区。' },
  { title: '警告与开除', text: '违规每次警告一次，累计3次开除；严重违规立即开除，不退费。' },
  { title: '退房', text: '最后一个周六中午12点前退房，学校检查房间后退押金；损坏物品照价赔偿。' },
];

/** One weekday of General ESL; the profile shows the morning and the afternoon side by side. */
export const HANA_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:30–08:30', activity: '早餐', kind: 'meal' },
  { time: '08:30–12:35', activity: '一对一 5节（口语、阅读、写作、语法、词汇）', kind: 'class' },
  { time: '12:35–13:30', activity: '午餐', kind: 'meal' },
  { time: '13:30–14:15', activity: '菲师小班课', kind: 'class' },
  { time: '14:20–15:05', activity: '外教小班课', kind: 'class' },
  { time: '15:10–17:00', activity: '自习、泳池、高尔夫或健身', kind: 'free' },
  { time: '17:00–18:30', activity: '晚餐', kind: 'meal' },
  { time: '18:30–23:00', activity: '自由时间（自习室开到23:00）', kind: 'free' },
];

export const HANA_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'redeem',
    title: '淡季大优惠：付4周读8周',
    subtitle: 'Light ESL＋双人间＋含餐 · 成人',
    courseIds: ['light-esl'],
    facts: [
      { label: '价格', value: '付4周1,470美元读8周；付8周2,940美元读16周；另付注册费100美元' },
      { label: '短一点', value: '付1周588美元读2周，付2周956美元读4周，付3周1,250美元读6周' },
      { label: '就读日期', value: '2026/8/30–2027/1/2、2027/2/28–6/26（周日抵达），旺季不适用' },
      { label: '谁可以', value: '成人个人学员；亲子家庭里选Light ESL的家长也可以' },
      { label: '房型', value: '只限双人间（亲子家长也可住3人家庭房），单人间不适用' },
    ],
    points: [
      '不能和淡季长住折扣或其他折扣同时使用。',
      '结课后要发布100词以上的英文评价，并附5张以上照片。',
      '只付1–2周的学生不用办SSP和E-Card，其他到校学杂费照付。',
    ],
    notice: '名额有限，额满即止；报名前顾问会帮你确认是否还有名额。',
  },
  {
    icon: 'quiz',
    title: '托业和雅思怎么上',
    subtitle: '每周一次模拟测试',
    courseIds: ['toeic', 'ielts'],
    facts: [
      { label: '每天', value: '菲师一对一3节＋外教一对一1节＋菲师小班1节＋外教小班1节' },
      { label: '托业', value: '一对一重点练阅读、听力和词汇' },
      { label: '雅思', value: '听说读写四项都练，外教一对一重点练口语和写作' },
      { label: '模考', value: '每周一次，追踪分数、补强弱项' },
    ],
    points: ['ESL学生到校后也可以加外教一对一，或改读考试课程。'],
  },
  {
    icon: 'sports_golf',
    title: '英语＋高尔夫',
    subtitle: '上午打高尔夫，下午上英语课',
    courseIds: ['golf-leisure', 'golf-intensive'],
    facts: [
      { label: '练习场', value: '步行1分钟的EG GOLF练习场，不限次数，练习球含在学费里（平日06:00–22:00，周末06:00–18:00）' },
      { label: '强化班', value: '比休闲班多每4周16次一对一高尔夫私教课，每次1小时' },
      { label: '球杆', value: '学校的公用球杆可以免费借，但状况一般，建议自带，尤其是7号铁杆' },
      { label: '周数', value: '两个班都是2周起，没有1周和3周；强化班建议4–12周，休闲班2–8周' },
      { label: '下场', value: '去真正的球场下场不含在学费里，果岭费等自己付' },
    ],
    points: ['夫妻和家庭可以搭配家长陪读或乐龄课程一起来。'],
  },
  {
    icon: 'elderly',
    title: '乐龄课程（50岁以上）',
    subtitle: '只在淡季开放 · 2周起',
    courseIds: ['senior'],
    facts: [
      { label: '每天', value: '菲师一对一3节＋菲师小班1节，学旅游、购物、就医等实用英语' },
      { label: '户外文化课', value: '每周三、周五和老师外出：咖啡厅、购物中心、博物馆、教堂' },
      { label: '周六行程', value: '如温泉、苏比克湾游艇、海洋公园、国家公园；满6人成行，可能另有费用' },
      { label: '已含', value: 'SSP、机场接送、水费和80度以内电费、平日三餐和周末1餐、每周2次清洁洗衣' },
      { label: '另付', value: '押金；报名费100美元／人' },
    ],
    points: ['夫妻可住乐龄夫妻房：两人4周合计3,000美元，含学费、住宿和当地费用。', '停留超过4周时的签证续签费用，报名时顾问会向学校确认。'],
  },
  {
    icon: 'child_care',
    title: 'Junior课程（7–17岁，家长陪同）',
    subtitle: '每天8节课 · A活动型／B学业型／C全一对一',
    courseIds: ['junior-a', 'junior-b', 'junior-c'],
    facts: [
      { label: '分班', value: '第一天分级测试，按8个级别安排' },
      { label: '活动课（A）', value: '游泳、羽毛球、篮球、烹饪、桌游、乒乓球、跳绳' },
      { label: '外教（B）', value: '每天1节美国外教小班课（4–6人）' },
      { label: '家长反馈', value: '第1周起每周五老师通过学校App反馈' },
      { label: '换课', value: '到校后可从A换成B（每4周加100美元），也可以加外教一对一' },
      { label: '淡季', value: 'Junior A、B平日晚上18:15–19:00免费晚间小班课' },
    ],
    points: ['孩子和家长同住双人间、三人间或家庭房；家长可报陪读课程，淡季也可以不上课。'],
  },
  {
    icon: 'toys',
    title: 'HANA幼儿园（3–6岁）',
    subtitle: '蒙特梭利教具 · 师生比1:3',
    courseIds: ['kinder-half', 'kinder-full'],
    facts: [
      { label: '年龄', value: '满3周岁到6–7岁（Nursery 3–4岁、Kinder 5–6岁）' },
      { label: '时间', value: '半日班08:30–12:35，全日班08:30–16:45' },
      { label: '内容', value: '英文歌曲律动、单词句子、数学、感官游戏、绘本阅读、美术和分享' },
      { label: '下午（全日班）', value: '幼儿园小班课和活动课（游泳、美术、烹饪）' },
      { label: '家长', value: '每天收到课堂照片和视频' },
    ],
    points: ['淡季入读的幼儿园孩子不用办SSP和E-Card。', '不上幼儿园的0–2岁婴幼儿同住，宿舍费减半；请让顾问单独报价。'],
  },
  {
    icon: 'family_restroom',
    title: '陪读家长怎么选',
    subtitle: '按自己的节奏学，或淡季不上课',
    courseIds: ['guardian', 'guardian-light', 'parent-no-class'],
    facts: [
      { label: '家长陪读', value: '菲师一对一3节＋菲师小班1节，可把部分一对一转给孩子' },
      { label: '家长陪读 Light', value: '菲师一对一2节，也可以全部转给孩子' },
      { label: '家长不上课', value: '只在淡季可选，只付住宿费，不用办SSP' },
      { label: '旺季', value: '1–2月、7–8月每位家长都要报一门课' },
      { label: '换外教', value: '2节菲师一对一可换1节外教一对一，转给孩子的课也可以' },
    ],
    points: ['家长也可以报成人课程；淡季选Light ESL的家长可参加“付4周读8周”。'],
  },
  {
    icon: 'cabin',
    title: '青少年英语营（孩子独自参加）',
    subtitle: '7–17岁 · 2人一间 · 24小时监护',
    courseIds: ['camp-a', 'camp-b'],
    facts: [
      { label: 'A营价格', value: '淡季4周2,000美元、旺季2,800美元；超过4周每周加400美元（淡季）或600美元（旺季）' },
      { label: 'B营价格', value: '淡季4周2,100美元、旺季2,900美元；超过4周每周加525美元（淡季）或725美元（旺季）' },
      { label: '已含', value: '学费、住宿、平日三餐和周末2餐、SSP等当地费用、机场接送、周末活动、每日照片和每周学习报告' },
      { label: '不含', value: '机票、零花钱、未成年人入境文件WEG、航空公司无陪伴儿童服务' },
      { label: '周末', value: '周六和老师外出（水上乐园、主题乐园、海滩等），周日逛商场' },
    ],
    points: ['报名费100美元另付；第5周起的签证续签另付。', '15岁以下孩子独自入境菲律宾要办WEG（无父母陪同未成年人入境文件），约3,120比索。'],
  },
  {
    icon: 'savings',
    title: '淡季长住折扣与福利',
    subtitle: '2026/8/30–2027/1/2、2027/2/28–6/26',
    facts: [
      { label: '折扣', value: '课程费和住宿费：淡季1–7周减10%，8–11周减11.5%，12–15周减13%，16周以上减14.5%' },
      { label: '乐龄课程', value: '淡季减10%' },
      { label: '成人福利', value: '淡季8–11周送按摩4次或健身房4周，12–15周8次／8周，16周以上12次／12周（成人1名）' },
      { label: '班车', value: '淡季平日有免费班车往返附近健身房' },
    ],
    points: ['不能和“付4周读8周”同时使用；青少年英语营另有淡季价格。', '旺季不加收附加费，旺季的周数按原价计算。'],
  },
  {
    icon: 'rule',
    title: '上课与换课规定',
    subtitle: '所有课程',
    facts: [
      { label: '每节课', value: '45分钟，课间休息5分钟' },
      { label: '老师', value: '由学校安排，不能指定；老师请假时有代课老师' },
      { label: '换老师', value: '每周三、周四13:00–15:00申请，下周生效' },
      { label: '加课', value: '菲师一对一每周2,000比索、外教一对一每周4,000比索' },
      { label: '小班换一对一', value: '2节菲师小班可免费换1节菲师一对一，或每4周8,000比索换1节外教一对一' },
      { label: '结业证书', value: '出勤率90%以上颁发' },
    ],
    points: ['国定假日停课，原则上不补课。', '教材在第一周内保持干净可以退换（买了5天以上不退）。'],
  },
];

const FIRST_WEEK = [
  { label: '周六17:00起', value: '可以入住（多数学生周日抵达）' },
  { label: '周一08:30–10:00', value: '分级测试' },
  { label: '周一16:00–18:00', value: '领教材、缴纳到校学杂费' },
  { label: '最后一周周四12:30', value: '毕业典礼' },
  { label: '最后一个周六12:00前', value: '退房' },
];

export const HANA_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'event', eyebrow: 'ARRIVAL', title: '到校与离校', facts: FIRST_WEEK,
    note: 'eTravel入境登记要在出发前72小时内完成，思达启航顾问会协助填写；接机请至少提前1周告诉顾问。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & HOURS',
    title: '用餐与开放时间',
    facts: [
      { label: '平日三餐', value: '07:30–08:30 / 12:35–13:30 / 17:00–18:30' },
      { label: '周末与假日', value: '供应1餐（早午餐）' },
      { label: '菜色', value: '韩国、日本、中国大陆、中国台湾、越南、菲律宾等多国菜' },
      { label: '自习室', value: '每天08:00–23:00' },
      { label: '泳池', value: '平日13:00–21:00，周末08:00–21:00' },
    ],
    note: '餐食只在规定时间供应。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'SCHOOL SERVICES',
    title: '清洁、洗衣与看病',
    facts: [
      { label: '清洁洗衣', value: '每周2次，同一天进行，按楼层安排；当天上午9点前把洗衣篮放在门口' },
      { label: 'WiFi', value: '宿舍和自习室都有，偶尔会断线' },
      { label: '打印复印', value: '每页5比索' },
      { label: '看病', value: '附近有24小时急诊的医院；需要时学校管理人员可以陪同（往返300比索）' },
    ],
    note: '贵重物品请自己保管好。',
  },
  {
    icon: 'storefront',
    eyebrow: 'NEIGHBORHOOD',
    title: '学校周边',
    facts: [
      { label: '步行1分钟', value: '按摩、美甲水疗、高尔夫练习场、羽毛球场、咖啡厅' },
      { label: '步行约2分钟', value: '超市、便利店、快餐店、医院和ATM' },
      { label: '车程10分钟', value: 'SM购物中心' },
      { label: '车程25分钟', value: '克拉克国际机场' },
    ],
    note: '周末也可以在附近换比索。',
  },
  {
    icon: 'beach_access',
    eyebrow: 'WEEKENDS',
    title: '周末活动',
    facts: [
      { label: '常见行程', value: '克拉克水上乐园（约1,800比索）、苏比克海洋公园、森林咖啡泳池、溜冰和保龄球、滑索冒险公园' },
      { label: '运动', value: '游泳课、高尔夫、跆拳道、羽毛球、乒乓球、健身房，按次或按月在当地付费' },
    ],
    note: '自愿参加、费用自付，通常满10人成行；目的地按季节和人数安排。',
  },
  {
    icon: 'receipt_long',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '延住', value: '每晚1,500比索（家庭房2,000比索），含餐，最多7晚，视空房而定' },
      { label: '签证逾期', value: '过期才续签，移民局罚款1,010比索' },
      { label: '延长学习', value: '原报8周以内、后来延长到59天以上的，要重新办SSP和I-CARD，另付9,700比索' },
      { label: '洗衣篮', value: '多要1个200比索' },
    ],
    note: '到校后用比索在学校缴纳。',
  },
];

/** The school's 2027 public holidays (no classes); weekend dates are listed as the school sent them. */
export const HANA_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }] },
      { month: 2, holidays: [{ day: '5日', name: '春节' }] },
      { month: 3, holidays: [{ day: '25–26日', name: '圣周' }] },
      { month: 4, holidays: [{ day: '9日', name: '英勇日' }, { day: '30日', name: '劳动节' }] },
      { month: 6, holidays: [{ day: '11日', name: '独立日' }] },
      { month: 8, holidays: [{ day: '20日', name: '尼诺伊·阿基诺日' }, { day: '30日', name: '国家英雄日' }] },
      { month: 11, holidays: [{ day: '30日', name: '博尼法西奥日' }] },
      { month: 12, holidays: [{ day: '24日', name: '平安夜（半天）' }, { day: '25日', name: '圣诞节' }, { day: '31日', name: '除夕' }] },
    ],
  },
];

export const HANA_HOLIDAY_FOOTNOTE = '假期停课，原则上不补课；政府之后新增的假期学校另行通知。2026年末：在校度过12/24、12/25、12/31和2027/1/1全部假期的学生，12/14–12/18每天加1节菲师一对一补课，共5节。';

/** Peak seasons without a surcharge, marked on the calendar. */
export const HANA_PEAK_SEASON_RANGES = HANA_PEAK_SEASONS;

export const HANA_REFUND = {
  summaryTitle: 'HANA 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后的退款比例和不退款的情况',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'HANA退款规定',
  intro: '到校后申请退款要有正当理由，并填写学校的退款申请表；学校在30天内处理，退款通过思达启航支付。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。' },
        { when: '临近入学', text: '离入学不足4周时改期或取消，学校可能收取违约金，以学校确认为准。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '注册费（每人100美元）任何情况下都不退。',
      rules: [
        { when: '总期间的前50%内申请', text: '退还剩余学费和宿舍费的50%；总期间从入住宿舍那天算起。' },
        { when: '超过总期间的50%', text: '不退款。' },
        { when: '付4周读8周', text: '按实际付费的周数算50%：读8周（付4周）第2周内可以申请，第3周起不退；读12周（付6周）第3周内可以申请，第4周起不退。' },
        { when: '本人生病，或直系亲属重病、去世', text: '不论何时提出，退还剩余学费的50%，须有书面证明。' },
        { when: '剩余不足4周', text: '剩余1–3周的学费和宿舍费不退，可以在淡季回HANA读完。' },
      ],
      footnote: '剩余的课程和住宿不能转让或卖给其他学生。',
    },
    {
      title: '不退款的情况',
      note: '',
      rules: [
        { when: '被学校开除', text: '严重违反校规被开除的，不退任何费用。' },
        { when: '天灾、传染病停课', text: '原则上不退费。' },
        { when: '自己缺课', text: '因本人原因缺课不补课、不退费。' },
      ],
      footnote: '',
    },
  ],
};

/** Public map reviews, shortened; shown without the reviewers' names (brand rule). */
export const HANA_TEXT_REVIEWS: PhTextReview[] = [
  {
    who: '带孩子来读的家长',
    text: '孩子一开始我还担心适应不了，老师都很有耐心，会一直鼓励孩子开口。美国外教的课互动很多，短短一段时间孩子敢主动和外国老师聊天了。',
  },
  {
    who: '第二次来的家长',
    text: '一日三餐、打扫、洗衣都有人安排，白天孩子上课，我们可以安心做自己的事；学习和度假并不冲突。不是奢华路线，但舒服、踏实。',
  },
  {
    who: '带9岁和幼儿园孩子的家长',
    text: '幼儿园老师认真负责，小的每周都带回手工作品，还会唱新的英文歌；9岁的儿子上活动课，有游泳、烹饪和乒乓球。出门就有超市和餐厅。',
  },
  {
    who: '和女儿第二次来的家长',
    text: '老师认真负责，工作人员很热心；每顿饭都有汤，孩子下课可以游泳，学校旁边就是高尔夫练习场。周末学校也会组织出去玩。',
  },
  {
    who: '亲子家庭学员',
    text: '校园像度假庄园，绿树环绕，安静舒服；自习室明亮，双人宿舍舒适，有人打扫洗衣。老师亲和耐心，会按情况调整课程。',
  },
  {
    who: '独自前来的成人学员',
    text: '一个人来原本很担心，经理和老师们帮了我很多，度过了充实的一个月，希望还能再回来。',
  },
];

export const HANA_FAQS: FaqItem[] = [
  { question: 'HANA有旺季附加费吗？', answer: '没有。2027年旺季是1/3–2/27和6/27–8/28，按原价收费、不另加附加费；淡季住得越久折扣越多。青少年英语营另有淡季和旺季两种价格。' },
  { question: 'HANA有门禁吗？', answer: '18岁及以上没有门禁，外宿1晚以上提前告诉学校即可；23:00后用密码进大门。未满18岁外出须由老师或学校管理人员陪同。' },
  { question: '“付4周读8周”谁能参加？', answer: '成人个人学员，读Light ESL、住双人间，就读日期在2026/8/30–2027/1/2或2027/2/28–6/26之内；亲子家庭里选Light ESL的家长也可以。不能和其他折扣同时使用，结课后要发英文评价和照片。' },
  { question: '带孩子去怎么报？', answer: '7–17岁孩子读Junior A、B或C，3–6岁读幼儿园；家长可报陪读课程、成人课程，淡季也可以不上课。全家住双人间、三人间或3–5人家庭房。' },
  { question: '孩子可以自己去吗？', answer: '可以参加寒暑假和淡季开放的青少年英语营：2人一间，24小时监护，含当地费用、机场接送和周末活动。15岁以下孩子独自入境要办WEG。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机、押金和教材另外准备。两者分开显示，不相加。' },
  { question: '2027年的价格出来了吗？', answer: '学校将在2027年1月1日调整学费，新价格还没公布。2026年12月31日前付清学费的学生，可以保留现在的价格。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，包括eTravel入境登记，你只需要按顾问指引准备个人资料。' },
];

export const HANA_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];
