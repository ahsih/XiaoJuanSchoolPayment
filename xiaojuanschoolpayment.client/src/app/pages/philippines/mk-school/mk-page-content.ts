// Text and data of the MK Language Training Center page, from MK's 2027 price list, its course guide, the 2025
// brochure, the school introduction, the 2026 and 2027 promotion notices, its 2026 business permit, TESDA and
// Bureau of Immigration papers and its 2027 holiday list (all received 2026-11-23). The shared Philippine school
// template reads it through mk-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini
// program can reuse it. Never add the school's phone, address, website, social accounts or bank details.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  FaqItem,
  GalleryImage,
  HolidayCalendar,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';

/** Closes every content section once; the same line as on every Philippine school page. */
export const MK_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const MK_PAGE_TEXT = {
  heroLead: '伊洛伊洛市的老牌语言学校，2002年成立，有自己的校园和宿舍，课程覆盖综合英语、雅思保分、实习和亲子课程。',
  advisorText: 'MK 在伊洛伊洛办学二十多年，教室、宿舍、餐厅和泳池都在同一个校园。伊洛伊洛有70多所大学，老师资源充足，城市游客较少，适合想安心学习的成人和带孩子的家庭。2026年抵达学费和住宿半价，2027年抵达住满8周三人间住宿免费，预算有限的学生很值得比一比。',
  campusIntro: '2009年建成的自有校园，2024年翻新；教室、宿舍、餐厅和泳池都在校内。',
  galleryIntro: '按区域查看校园、教室、住宿和餐厅；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课45分钟，每天另有2小时晚自习。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认 MK 的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数和想住的房型，我们帮你确认房间并做一份完整报价。',
} as const;

export const MK_QUICK_INFO = [
  { icon: 'location_on', title: '伊洛伊洛市', text: '到SM City约5分钟、机场约20分钟车程' },
  { icon: 'history_edu', title: '2002年成立', text: '自有校园，可住约300名学生' },
  { icon: 'school', title: '每节45分钟', text: '一对一和1:5小组课，每天2小时晚自习' },
  { icon: 'pool', title: '校内泳池', text: '教室、宿舍、餐厅和泳池都在校内' },
  { icon: 'bed', title: '单人间到四人间', text: '含打扫和一日三餐；四人间限家庭或团体' },
  { icon: 'savings', title: '2026／2027优惠', text: '思达启航9折；2026年抵达半价；2027年住满8周三人间住宿免费' },
];

/** Key facts under the hero title (compact layout); what each area has is in MK_CAMPUS_BUILDINGS. */
export const MK_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾班乃岛伊洛伊洛市 Mandurriao 区，到SM City约5分钟、机场约20分钟车程' },
  { icon: 'history_edu', label: '学校', value: '2002年成立，2009年建成自有校园，2024年翻新；可住约300名学生' },
  { icon: 'menu_book', label: '课程', value: '综合英语、雅思（含保分班）、商务、打工度假、实习、生存英语，以及青少年和家长课程' },
  { icon: 'schedule', label: '课时', value: '每节45分钟，一对一和1:5小组课；每天另有2小时晚自习' },
  { icon: 'bed', label: '住宿', value: '校内单人间到四人间，含打扫和一日三餐；四人间只接受家庭或团体' },
  { icon: 'event', label: '入学', value: '每周日入住；马尼拉飞伊洛伊洛约50分钟，卡利博机场开车约3小时' },
];

export const MK_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'MK Language Training Center（MK）' },
  { label: '位置', value: '菲律宾伊洛伊洛市 Mandurriao 区' },
  { label: '成立', value: '2002年；2009年建成自有校园，2024年翻新' },
  { label: '课程', value: '综合英语、雅思、商务、打工度假、实习、生存英语、青少年和家长课程' },
  { label: '住宿', value: '校内单人间到四人间（四人间限家庭或团体）' },
  { label: '入学', value: '每周日入住' },
];

export const MK_SUITABLE_FOR = [
  '想在安静的大学城专心学英语的成人',
  '带孩子游学、想一起上课的亲子家庭',
  '准备雅思、想读保分班的学生',
  '想边学英语边实习，或准备打工度假的学生',
];

export const MK_NOT_SUITABLE_FOR = [
  '想住海边或热闹大城市的学生（伊洛伊洛游客较少）',
  '一个人想住四人间的学生：四人间只接受家庭或团体',
];

export const MK_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一对一教室和1:5小组教室', '自习室和图书休息区', '可开讲座的大厅'] },
  { code: 'DORM', title: '校内宿舍', icon: 'bed', facilities: ['主楼宿舍：单人间到四人间', '亲子家庭宿舍', '含打扫和一日三餐'] },
  { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['校内泳池', '大堂和前台', '校内咖啡厅'] },
  { code: 'DINING', title: '餐厅', icon: 'restaurant', facilities: ['学生餐厅，一日三餐', '每月月末活动和BBQ派对'] },
];

/** Licence strip: text only, the documents themselves carry addresses and are never published. */
export const MK_LICENSE = {
  title: '办学资质已核验',
  items: [
    '2026年伊洛伊洛市营业执照（教学辅导服务，2026年1月21日签发，有效1年）',
    '菲律宾技术教育与技能发展署（TESDA）英语课程登记（有效至2027年12月12日）',
    '菲律宾移民局外国学生招收资格认证（学生据此办理SSP学习许可）',
  ],
  note: '证件可向思达启航顾问索取查看',
};

const campus = (file: string) => `assets/mk/campus/${file}.webp`;
const classroom = (file: string) => `assets/mk/class/${file}.webp`;
const dining = (file: string) => `assets/mk/dining/${file}.webp`;
const rooms = (file: string) => `assets/mk/rooms/${file}.webp`;

/** MK's own photos only (school introduction and brochure); each matches its label. */
export const MK_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: 'MK主楼', description: '学校正门和主楼，教室和宿舍都在校园里。', src: campus('main-building') },
  { category: '校园', title: '学校入口', description: '从入口进入校园。', src: campus('entrance') },
  { category: '校园', title: '大堂', description: '主楼一楼大堂。', src: campus('lobby') },
  { category: '校园', title: '前台', description: '主楼前台。', src: campus('reception') },
  { category: '教室', title: '一对一教室', description: '一对一课在独立小教室上。', src: classroom('one-to-one-01') },
  { category: '教室', title: '一对一上课', description: '老师和学生面对面上课。', src: classroom('one-to-one-02') },
  { category: '教室', title: '一对一教室', description: '每节课45分钟。', src: classroom('one-to-one-03') },
  { category: '住宿', title: '主楼双人间', description: '两人一间。', src: rooms('two-bed-01') },
  { category: '住宿', title: '主楼双人间', description: '两人一间。', src: rooms('two-bed-02') },
  { category: '住宿', title: '主楼三人间', description: '三人一间。', src: rooms('three-bed-01') },
  { category: '住宿', title: '四人间', description: '只接受家庭或团体入住。', src: rooms('four-bed-01') },
  { category: '住宿', title: '宿舍卫生间', description: '主楼宿舍的卫生间。', src: rooms('dorm-bathroom') },
  { category: '住宿', title: '亲子家庭宿舍', description: '带孩子来的家庭住的宿舍。', src: rooms('family-08') },
  { category: '住宿', title: '亲子家庭宿舍', description: '带孩子来的家庭住的宿舍。', src: rooms('family-09') },
  { category: '住宿', title: '亲子家庭宿舍', description: '带孩子来的家庭住的宿舍。', src: rooms('family-10') },
  { category: '住宿', title: '亲子家庭宿舍', description: '带孩子来的家庭住的宿舍。', src: rooms('family-11') },
  { category: '餐厅', title: '学生餐厅', description: '同时报课程和宿舍的学生在这里吃一日三餐。', src: dining('cafeteria') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: dining('meal-01') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: dining('meal-02') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: dining('meal-03') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: dining('meal-04') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: dining('meal-05') },
  { category: '餐厅', title: '学生餐', description: '每天的菜色会更换。', src: dining('meal-06') },
  { category: '餐厅', title: 'BBQ派对', description: '学校组织的烧烤派对。', src: dining('bbq') },
  { category: '餐厅', title: '校内咖啡厅', description: '课后休息、聊天的地方。', src: dining('cafe') },
  { category: '设施', title: '校内泳池', description: '课后游泳放松。', src: campus('pool') },
  { category: '设施', title: '大厅', description: '可开讲座和活动的大厅。', src: campus('hall') },
  { category: '设施', title: '图书休息区', description: '可以看书、休息的地方。', src: campus('library') },
  { category: '设施', title: '自习室', description: '学生自习的地方。', src: campus('study-hall') },
];

/**
 * Videos from MK's own YouTube and Facebook accounts (720p H.264 with posters in public/assets/mk/videos/). Each title
 * carries its year. The 2026 campus tour and campus-life clips had the street address blurred; the 2017 aerial clip ends
 * before its address card. The 2019 facilities tour is left out because the campus was renovated in 2024.
 */
export interface MkVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  /** Hero album group. */
  topic: '校园' | '课堂' | '活动';
}

export const mkVideoSrc = (video: MkVideo) => `/assets/mk/videos/${video.name}.mp4`;
export const mkVideoPoster = (video: MkVideo) => `/assets/mk/videos/poster-${video.name}.jpg`;

export const MK_VIDEOS: MkVideo[] = [
  {
    name: 'campus-tour-2026', title: '校园速览（2026年）', duration: '0:17', orientation: 'landscape', topic: '校园',
    description: '主楼外观、大堂、大礼堂、教室走廊和学生餐厅。',
  },
  {
    name: 'aerial-2017', title: '校园航拍（2017年）', duration: '0:55', orientation: 'landscape', topic: '校园',
    description: '从空中看教学楼、篮球场和校园周边。',
  },
  {
    name: 'typical-day-2023', title: '校园的一天（2023年）', duration: '0:17', orientation: 'portrait', topic: '课堂',
    description: '校门、教学楼、一对一课、大教室上课和篮球场。',
  },
  {
    name: 'programs-2023', title: '课程与活动一览（2023年）', duration: '0:21', orientation: 'portrait', topic: '课堂',
    description: '小组课、一对一课、实习、结业典礼、课后出游和雅思课。',
  },
  {
    name: 'graduation-2026', title: '结业典礼（2026年11月）', duration: '0:21', orientation: 'portrait', topic: '活动',
    description: '学生在大堂领取结业证书，最后全体合影。',
  },
  {
    name: 'talent-show-2026', title: '月度活动：MK达人秀（2026年9月）', duration: '0:48', orientation: 'portrait', topic: '活动',
    description: '老师和学生在教学楼前同台表演。',
  },
  {
    name: 'campus-life-2026', title: '课余时光（2026年）', duration: '0:23', orientation: 'landscape', topic: '活动',
    description: '大堂、户外活动、篮球场和图书角里的学生日常。',
  },
  {
    name: 'year-end-party-2024', title: '年终派对（2024年）', duration: '0:57', orientation: 'landscape', topic: '活动',
    description: '在学生餐厅玩游戏、聚餐和抽奖。',
  },
];

export const MK_ALBUM_DESCRIPTIONS = {
  校园: '主楼、入口、大堂与前台',
  教室: '一对一教室',
  住宿: '主楼宿舍与亲子家庭宿舍',
  餐厅: '学生餐厅、三餐、BBQ与咖啡厅',
  设施: '泳池、大厅、图书区与自习室',
} as const;

const ROOM_SERVICE = '含打扫和一日三餐；水电和洗衣另付';
const mainRoom = (id: string, label: string, code: string, gallery: string[], suitable: string, note: string): PhRoomProfile => ({
  id, label, bookingCode: code, location: '校内', service: ROOM_SERVICE, suitable, note,
  image: gallery[0], gallery, imageAlt: `MK${label}实景`,
});

/**
 * Photos only where MK's own material names the room type. The single room has no photo; the bathroom and the
 * family-dormitory photos do not say which room type they show, so they stay in the hero album only.
 */
export const MK_ROOM_PROFILES: PhRoomProfile[] = [
  mainRoom('two-bed', '双人间', 'MK-2', [rooms('two-bed-01'), rooms('two-bed-02')], '朋友同行或想兼顾预算的学生', '两人一间。'),
  mainRoom('three-bed', '三人间', 'MK-3', [rooms('three-bed-01')], '预算优先的学生；2027年住满8周住宿免费', '三人一间。'),
  mainRoom('four-bed', '四人间', 'MK-4', [rooms('four-bed-01')], '一家人或团体同住', '只接受家庭或团体入住。'),
];

export const MK_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'workspace_premium',
    title: '雅思保分班',
    subtitle: '至少12周 · 送1次官方雅思考试',
    courseIds: ['ielts-guarantee'],
    facts: [
      { label: '目标5.5分', value: '入学雅思4.0或托福60分' },
      { label: '目标6.0分', value: '入学雅思5.0或托福80分' },
      { label: '目标6.5分', value: '入学雅思6.0或托福90分' },
      { label: '模考', value: '每月4次' },
    ],
    points: [
      '没有官方成绩的用分级测试代替；达不到入学分数的改读雅思常规课程。',
      '保分条件：上课和自习出勤率90%以上，模考全部参加，遵守MK规定。',
      '读满12周没达到目标分，可以免学费继续上课到达标（住宿费和其他费用照付）。',
    ],
    notice: '保分条件以学校当期规定为准，报名前顾问会和你逐项确认。',
  },
  {
    icon: 'family_restroom',
    title: '亲子课程怎么报',
    subtitle: '孩子和家长分别报课',
    courseIds: ['junior-basic', 'junior-premium', 'guardian'],
    facts: [
      { label: '青少年基础', value: '4节一对一 + 1节1:5小组课' },
      { label: '青少年高级', value: '6节一对一 + 1节1:5小组课' },
      { label: '家长课程', value: '4节一对一，最多可把3节转给孩子' },
      { label: '住宿', value: '四人间只接受家庭或团体入住' },
    ],
    points: ['孩子入学后按分级测试分班。'],
  },
  {
    icon: 'work',
    title: '商务英语与打工度假',
    subtitle: '18岁以上 · 至少4周',
    courseIds: ['business', 'working-holiday'],
    facts: [
      { label: '商务英语', value: '须达到中级水平；学看合同、报告等商务文件，学金融和市场营销用语、写电子邮件' },
      { label: '打工度假', value: '一步步学写求职信和简历' },
      { label: '工作体验', value: '可选1–2周当地工作体验' },
    ],
    points: ['打工度假学生可获得当地工作体验证书。'],
  },
  {
    icon: 'badge',
    title: '英语实习',
    subtitle: '边学英语边积累工作经验',
    courseIds: ['internship'],
    facts: [
      { label: '前4周', value: '4节一对一 + 3节1:5小组课' },
      { label: '4周以后', value: '4节一对一 + 3小时实习' },
      { label: '实习单位', value: '酒店、旅行社、公立和私立学校、汽车经销商、餐厅、私人办公室、律师事务所、政府机关' },
    ],
    points: [],
  },
  {
    icon: 'co_present',
    title: '加报TESOL英语教师课程',
    subtitle: '4周 · 350美元',
    facts: [
      { label: '搭配', value: '任意综合英语或雅思课程' },
      { label: '时间', value: '每周六8小时西米沙鄢州立大学（WVSU）TESOL课程，共4周' },
      { label: '结业', value: '以模拟教学作为结业考试' },
      { label: '另付', value: 'WVSU课程所需的SSP费用，以学校通知为准' },
    ],
    points: ['在报价的“学生情况”里选择加报TESOL，费用会加进学校费用。'],
  },
  {
    icon: 'stairs',
    title: '分级与课时',
    subtitle: '所有课程通用',
    facts: [
      { label: '分级', value: '采用欧盟语言等级体系，配有MK自己的教材' },
      { label: '课时', value: '每节45分钟；每天另有2小时晚自习' },
    ],
    points: [],
  },
];

export const MK_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'flight_land',
    eyebrow: 'ARRIVAL',
    title: '抵达与接机',
    facts: [
      { label: '入住', value: '每周日入住；周六较难安排接机' },
      { label: '航线', value: '马尼拉飞伊洛伊洛约50分钟；卡利博机场到伊洛伊洛开车约3小时' },
      { label: '接机', value: '当地工作人员在机场接你直接到学校；伊洛伊洛机场到学校约20分钟' },
      { label: '接机费', value: '按同车人数计总价：伊洛伊洛机场1–4人1,700–4,250比索，卡利博机场4,000–10,000比索' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'restaurant',
    eyebrow: 'MEALS & DORM',
    title: '用餐与宿舍服务',
    facts: [
      { label: '三餐', value: '同时报课程和宿舍才提供一日三餐，不吃也不退餐费' },
      { label: '打扫', value: '宿舍费已含打扫' },
      { label: '洗衣', value: '洗衣券150比索，每次最多8公斤' },
      { label: '水电', value: '电费按电表用量，约每月3,000比索；水费约每月1,000比索' },
      { label: '押金', value: '房间押金5,000比索（约100美元）、钥匙押金150比索，结业退房后退还' },
    ],
    note: '贵重物品请自己保管好。',
  },
  {
    icon: 'beach_access',
    eyebrow: 'ACTIVITIES',
    title: '课外与周末活动',
    facts: [
      { label: '学校活动', value: '每月月末活动和BBQ派对' },
      { label: '周末出游', value: '吉马拉斯岛、Gigantes群岛、长滩岛等，费用自付' },
      { label: '市区', value: 'SM City、Robinsons等商场，老城区教堂和海鲜市场' },
    ],
    note: '周末活动自愿参加、费用自付。',
  },
];

/**
 * MK's 2027 list of no-class days. Holy Week and Christmas fall on several consecutive days, so they are listed
 * as the school gives them.
 */
export const MK_HOLIDAY_CALENDARS: HolidayCalendar[] = [
  {
    year: 2027,
    label: '规划2027年入学时优先查看',
    months: [
      { month: 1, holidays: [{ day: '1日', name: '元旦' }, { day: '22–24日', name: '迪纳央节（Dinagyang）' }] },
      { month: 2, holidays: [{ day: '5日', name: '春节' }, { day: '11日', name: 'Evelio B. Javier纪念日' }] },
      {
        month: 3,
        holidays: [
          { day: '10日', name: '开斋节', provisional: true },
          { day: '18日', name: '班乃岛解放日' },
          { day: '25–27日', name: '圣周' },
        ],
      },
      { month: 4, holidays: [{ day: '9日', name: '勇士日' }] },
      { month: 5, holidays: [{ day: '1日', name: '劳动节' }, { day: '14日', name: '宰牲节', provisional: true }] },
      { month: 6, holidays: [{ day: '11日', name: '独立日' }] },
      {
        month: 8,
        holidays: [
          { day: '20日', name: '尼诺伊·阿基诺纪念日' },
          { day: '25日', name: '伊洛伊洛市宪章日' },
          { day: '30日', name: '国家英雄日' },
        ],
      },
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
          { day: '17日', name: 'Graciano Lopez Jaena纪念日' },
          { day: '23日', name: '平安夜' },
          { day: '24日', name: '圣诞节' },
          { day: '30日', name: '黎刹日' },
          { day: '31日', name: '除夕' },
        ],
      },
    ],
  },
];
export const MK_HOLIDAY_FOOTNOTE = '开斋节、宰牲节日期待官方确认；政府可能临时增加或调整假期，以MK当期通知为准。';

export const MK_FAQS: FaqItem[] = [
  { question: '伊洛伊洛是什么样的城市？', answer: '伊洛伊洛在菲律宾班乃岛，有70多所大学，老师资源充足；游客较少。从马尼拉坐飞机约50分钟，MK到SM City约5分钟、到机场约20分钟车程。' },
  { question: '2026–2027年有什么优惠？', answer: '2026/02/01–12/31抵达：学费和住宿费半价，报N周只付一半周数的价格（如4周付2周、5周付3周、8周付4周）。2027年抵达且同时报课程和宿舍：住满8周三人间住宿免费，单人间、双人间只付和三人间的差价；不满8周按学校公布的住宿特价。通过思达启航报名，课程费和住宿费另享9折。报价器会按你的日期自动计算。' },
  { question: 'MK适合带孩子去吗？', answer: '适合。孩子可读青少年基础或高级课程，家长可读家长课程，最多可把3节一对一转给孩子。四人间只接受家庭或团体入住，学校另有亲子家庭宿舍。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费和住宿费，并自动扣除优惠；到校学杂费单独列出，接机、押金、教材和洗衣另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。' },
];

export const MK_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];
