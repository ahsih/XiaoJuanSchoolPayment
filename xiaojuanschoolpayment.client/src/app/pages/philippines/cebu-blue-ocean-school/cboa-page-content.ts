// Text and data of the Cebu Blue Ocean Academy (蓝海CBOA) page, from the school's November 2026 pack: the Chinese
// brochure, the 2027 price list and price notes, the 2027 promotion sheet, the minor-student notice, and the school's
// own photos and Ocean Suites videos (Google Drive, received 2026-11-23). The shared Philippine school template reads
// it through cboa-page-profile.ts. Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse
// it. Never add the school's phone, address, website or social accounts, and nothing from the agency-only notices
// (payment deadlines, agency refund handling, visits, commission). Post-entry refund ratios are student-facing.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CampusPracticalGuide,
  CourseDetailGuide,
  FaqItem,
  GalleryImage,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import { CBOA_FAMILY_COURSE_IDS, CBOA_SENIOR_COURSE_ID, CBOA_SURVIVAL_COURSE_ID } from './cboa-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const CBOA_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const CBOA_PAGE_TEXT = {
  heroLead: '宿务麦克坦岛海边的度假型语言学校，采用碧瑶PINES的课程体系；可住校内宿舍，也可住校外Ocean Suites单人公寓。',
  advisorText: '蓝海CBOA最大的特点是海边环境和Ocean Suites单人公寓：一人一间、每天含早餐、平日有免费校车，适合想认真学英语、又想住得舒服安静的成人和上班族。课程沿用PINES体系，一对一课多。要注意：2026/08/23起入学，未满18岁不能报成人课程；暑期旺季每周另收附加费。',
  campusIntro: '上课在海边校区；住宿可选校内EGI宿舍，或校外的Ocean Suites单人公寓，平日有免费校车往返。',
  galleryIntro: '按区域查看课堂、学生活动、Ocean Suites房间和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和课程内容。小组课为4:1。',
  roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
  finalCtaTitle: '想确认蓝海CBOA的空房和最新优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数和想住的房型，我们帮你确认房间，并按你的报名日期做一份完整报价。',
} as const;

export const CBOA_QUICK_INFO = [
  { icon: 'beach_access', title: '宿务海边', text: '麦克坦岛海边的度假型校区' },
  { icon: 'menu_book', title: 'PINES课程体系', text: '采用碧瑶PINES的课程体系' },
  { icon: 'school', title: '一对一为主', text: '每天4–7节一对一，小组课4:1' },
  { icon: 'apartment', title: 'Ocean Suites', text: '校外单人公寓，含早餐、平日免费校车' },
  { icon: 'elderly', title: '40岁以上课程', text: '只收40岁及以上学生的专门课程' },
  { icon: 'event_note', title: '按报名日期定价', text: '2027/01/31前报名按2026年价格' },
];

/** Key facts under the hero title (compact layout). */
export const CBOA_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '菲律宾宿务麦克坦岛海边' },
  { icon: 'menu_book', label: '课程', value: 'ESL、托业、雅思、商务英语、40岁以上课程；7–15岁青少年家庭课程' },
  { icon: 'school', label: '上课', value: '采用碧瑶PINES的课程体系；一对一加4:1小组课' },
  { icon: 'bed', label: '住宿', value: '校内EGI宿舍（双人间、三人间）；校外Ocean Suites单人公寓' },
  { icon: 'event', label: '入学', value: '每周日入住，课程结束后的周六离校' },
  { icon: 'wb_sunny', label: '旺季', value: '暑期旺季每个学习或住宿周另收附加费' },
];

export const CBOA_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'Cebu Blue Ocean Academy（蓝海CBOA）' },
  { label: '位置', value: '菲律宾宿务麦克坦岛海边' },
  { label: '课程体系', value: '采用碧瑶PINES的课程体系' },
  { label: '课程', value: 'ESL、托业、雅思、商务英语、40岁以上课程、青少年和家长家庭课程' },
  { label: '住宿', value: '校内EGI宿舍；校外Ocean Suites单人公寓' },
  { label: '入学', value: '每周日入住，课程结束后的周六离校' },
];

export const CBOA_SUITABLE_FOR = [
  '想在海边学习、生活节奏轻松一点的成人',
  '想一人一间、住得安静的上班族和长期学生',
  '40岁以上、想按自己节奏学的学生',
  '带7–15岁孩子、非暑期旺季出发的家庭',
];

export const CBOA_NOT_SUITABLE_FOR = [
  '未满18岁、想读成人课程的学生（2026/08/23起不接受）',
  '只看最低预算的学生（Ocean Suites单人公寓价格较高）',
  '想按平时价格在暑期读家庭课程的家庭（旺季另有安排）',
];

export const CBOA_CAMPUS_BUILDINGS: CampusBuildingCard[] = [
  { code: 'STUDY', title: '海边校区', icon: 'school', facilities: ['采用碧瑶PINES的课程体系', '一对一课和4:1小组课', '每周毕业典礼和课外活动'] },
  { code: 'EGI', title: 'EGI校内宿舍', icon: 'bed', facilities: ['海景双人间、城景双人间', '三人间，费用最低', '电费水费按电表从押金扣除'] },
  { code: 'SUITES', title: 'Ocean Suites公寓', icon: 'apartment', facilities: ['一人一间：海景、豪华、高级单人间', '每天免费早餐', '周一至周五免费校车往返校区'] },
  { code: 'LIFE', title: '公寓设施', icon: 'pool', facilities: ['中庭泳池、健身房', '空中休息室和自习室', '屋顶露台、按摩室'] },
];

const campus = (file: string) => `assets/cebu-blue-ocean/campus/${file}.webp`;
const suites = (file: string) => `assets/cebu-blue-ocean/suites/${file}.webp`;
const rooms = (file: string) => `assets/cebu-blue-ocean/rooms/${file}.webp`;

/** Every photo is the school's own (its Google Drive pack) and shows what its title says. The small EGI dorm photos
 *  from the brochure appear only under the EGI room prices (CBOA_ROOM_PROFILES), not in this album. */
export const CBOA_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: '校园活动', description: '学生在校区广场参加团队活动。', src: campus('plaza-event') },
  { category: '校园', title: '庭院尊巴', description: '课后在庭院一起跳尊巴。', src: campus('courtyard-activity') },
  { category: '校园', title: '新生说明会', description: '入学第一天的说明会。', src: campus('orientation') },
  { category: '校园', title: '毕业典礼', description: '结业学员领取证书。', src: campus('graduation') },
  { category: '校园', title: '周末出游', description: '学生周末结伴出游。', src: campus('weekend-trip') },
  { category: '教室', title: '上课中', description: '学生在教室上课。', src: campus('classroom') },
  { category: '教室', title: '课堂活动', description: '课堂上的互动活动。', src: campus('listening-activity') },
  { category: '住宿', title: 'Ocean Suites大堂', description: '校外单人公寓的大堂。', src: suites('lobby') },
  { category: '住宿', title: '海景单人间', description: '一人一间，大床，正对海景。', src: rooms('ocean-view-01') },
  { category: '住宿', title: '豪华单人间', description: '一人一间，大床。', src: rooms('deluxe-01') },
  { category: '住宿', title: '高级单人间', description: '一人一间，双人床。', src: rooms('superior-01') },
  { category: '住宿', title: '公寓走廊', description: 'Ocean Suites的客房走廊。', src: suites('hallway') },
  { category: '餐厅', title: 'Ocean Suites餐厅', description: '住Ocean Suites每天在这里吃免费早餐。', src: suites('restaurant') },
  { category: '餐厅', title: '早餐', description: '每天的免费早餐。', src: suites('breakfast') },
  { category: '设施', title: '中庭泳池', description: '周二至周日12:00–21:00开放，周一清洁。', src: suites('pool') },
  { category: '设施', title: '泳池边', description: '公寓中庭的泳池。', src: suites('pool-courtyard') },
  { category: '设施', title: '空中休息室', description: '看海的休息和自习空间，每天08:00–24:00开放。', src: suites('sky-lounge') },
  { category: '设施', title: '空中休息室一角', description: '课后看书、聊天的地方。', src: suites('sky-lounge-2') },
  { category: '设施', title: '自习室', description: '每天08:00–24:00开放。', src: suites('study-lounge') },
  { category: '设施', title: '健身房', description: '每天06:00–21:00开放。', src: suites('gym') },
  { category: '设施', title: '健身房器械', description: '公寓健身房。', src: suites('gym-2') },
];

export const CBOA_ALBUM_DESCRIPTIONS = {
  校园: '学生活动与校园生活',
  教室: '课堂与小组课',
  住宿: 'Ocean Suites单人公寓',
  餐厅: 'Ocean Suites餐厅与早餐',
  设施: '泳池、健身房和空中休息室',
} as const;

/**
 * A video from the school's own pack (its Ocean Suites tour and room clips), transcoded to 720p H.264 in
 * public/assets/cebu-blue-ocean/videos/. The tour's room shots and its bank ATM shot were cut out; the room clips
 * are the tour's own room segments. Check every frame of a new clip for other companies or contact details.
 *
 * Five more are from the school's own YouTube channel (2026-11-25, user request for videos that build trust):
 * the 2025 school tour (its flag shot was cut because one flag is the Taiwan authorities'), a Chinese student's
 * interview (cut after his self-introduction, so no student name is shown), a teacher interview, the textbooks
 * and classes film (the IELTS logo and the PINES logo shots were cut) and the airport pickup film (its road and
 * airport shop shots were cut). The EGI room clip is the tour's own twin and triple room shots. Each clip ends
 * before the school's end card.
 */
export interface CboaVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
}

export const cboaVideoSrc = (video: CboaVideo) => `/assets/cebu-blue-ocean/videos/${video.name}.mp4`;
export const cboaVideoPoster = (video: CboaVideo) => `/assets/cebu-blue-ocean/videos/poster-${video.name}.jpg`;

export const CBOA_VIDEOS: CboaVideo[] = [
  {
    name: 'campus-tour', title: '蓝海CBOA 校园导览', duration: '2:22',
    description: '走一遍主校区：大堂、教室、一对一教室、自习室、餐厅、图书馆和诊所，再到EGI校内宿舍和泳池。',
  },
  {
    name: 'pickup-first-day', title: '机场接机和入学报到', duration: '1:44',
    description: '学校工作人员在宿务机场到达口举牌接机，坐校车到校，当天办理报到和入学说明。',
  },
  {
    name: 'textbooks-one-on-one', title: '教材和课堂实况', duration: '1:10',
    description: '蓝海CBOA的口语、语法、雅思和托业教材，以及一对一和小组课的上课实况。',
  },
  {
    name: 'teacher-method', title: '老师谈上课方法', duration: '1:29',
    description: '蓝海CBOA一位月度优秀教师讲她怎么上课：按学生的节奏走，鼓励开口，用活动练口语。英文访谈，带英文字幕。',
  },
  {
    name: 'student-china', title: '中国学员分享', duration: '1:27',
    description: '一位中国学员讲为什么选菲律宾和蓝海CBOA、每天的课表、一对一课的感受和口语进步。英文访谈，带英文字幕。',
  },
  { name: 'egi-rooms', title: 'EGI校内宿舍房间', duration: '0:06', description: 'EGI校内宿舍的双人间和三人间，取自学校的校园导览。' },
  {
    name: 'ocean-suites-tour', title: 'Ocean Suites 公寓导览', duration: '1:31',
    description: '走一遍校外单人公寓：大堂、中庭泳池、餐厅、健身房、空中休息室、自习室和屋顶露台。',
  },
  { name: 'ocean-suites-ocean-view', title: '海景单人间', duration: '0:25', description: '大床、分体空调，窗外是海；共10间。' },
  { name: 'ocean-suites-deluxe', title: '豪华单人间', duration: '0:17', description: '大床、分体空调；共15间。' },
  { name: 'ocean-suites-superior', title: '高级单人间', duration: '0:17', description: '双人床、窗式空调；共29间。' },
];

const SUITES_SERVICE = '酒店式管理，每天免费早餐';
const SUITES_HIGHLIGHTS = ['中庭泳池、健身房', '空中休息室和自习室', '周一至周五免费校车'];
const suiteRoom = (id: string, label: string, englishName: string, rateId: string, bed: string, file: string, suitable: string, note: string): PhRoomProfile => {
  const gallery = ['01', '02', '03', '04'].map(n => rooms(`${file}-${n}`));
  return {
    id, label, englishName, location: '校外', bed, service: SUITES_SERVICE, suitable, note, highlights: SUITES_HIGHLIGHTS,
    image: gallery[0], gallery, imageAlt: `蓝海CBOA Ocean Suites${label}实景`, rateIds: [rateId],
  };
};

/**
 * The EGI dorm photos are the brochure's three embedded room photos at their native size (281, 144 and 134 px wide),
 * placed by the brochure at the user's request (2026-11-24) until the school checks them and sends originals. They do
 * not say which EGI room type they show, so all three EGI price cards open the same photos (as CIA's suites do).
 */
const EGI_GALLERY = ['egi-01', 'egi-02', 'egi-03'].map(rooms);

/** The couple room has no photo yet. */
export const CBOA_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'egi', label: 'EGI校内宿舍', englishName: 'EGI DORMITORY', location: '校内',
    suitable: '想住在校内、预算较低的学生',
    note: '照片未标明具体房型，房型以学校安排为准；电费水费按电表从押金扣除。',
    image: EGI_GALLERY[0], gallery: EGI_GALLERY, imageAlt: '蓝海CBOA EGI校内宿舍房间',
    rateIds: ['egi-twin-ocean', 'egi-twin-city', 'egi-triple-ocean'],
    variants: {
      'EGI-TO': { label: '海景双人间', suitable: '两人一间，窗外是海' },
      'EGI-TC': { label: '城景双人间', suitable: '两人一间，窗外是城区' },
      'EGI-3': { label: '三人间', suitable: '三人一间，费用最低' },
    },
  },
  suiteRoom('ocean-view', '海景单人间', 'OCEAN VIEW ROOM', 'ocean-suite-ocean', '大床，分体空调', 'ocean-view',
    '想一人一间、看海景的学生', '共10间，最先订满，建议尽早确认。'),
  suiteRoom('deluxe', '豪华单人间', 'DELUXE ROOM', 'ocean-suite-deluxe', '大床，分体空调', 'deluxe',
    '想一人一间、床大一点的学生', '共15间。'),
  suiteRoom('superior', '高级单人间', 'SUPERIOR ROOM', 'ocean-suite-superior', '双人床，窗式空调', 'superior',
    '想一人一间、预算适中的学生', '共29间，Ocean Suites里最实惠的单人间。'),
];

/**
 * Refunds (user rule 2026-11-24): 思达启航's 2,000-yuan deposit rule in the same words as every other school page,
 * the peak family-camp deposit from the brochure, then the school's own post-entry refund rule. The school's
 * agency-facing payment and refund terms stay private.
 */
export const CBOA_REFUND_COPY = {
  summaryTitle: '蓝海CBOA 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后退款比例',
  eyebrow: 'CANCELLATION & REFUND',
  title: '蓝海CBOA 取消与退款规定',
  intro: '到校后因任何原因离校：头两周的费用不退，之后的剩余费用按70%退。',
  alert: '报名前请确认',
  groups: [
    {
      title: '报名与入学前',
      note: '',
      rules: [
        { when: '报名定金', text: '通过思达启航报名时预收定金2,000元人民币，为学生向学校订位；定金交了以后不退。' },
        { when: '改期与保留', text: '入学4周前告诉顾问，可以免费改入学日期，或申请把定金保留1年。' },
        { when: '暑期家庭营', text: '每个家庭预订押金300美元，报名完成后改期或取消不退。' },
      ],
      footnote: '',
    },
    {
      title: '到校以后',
      note: '',
      rules: [
        { when: '入学头两周', text: '费用不退。' },
        { when: '两周之后', text: '剩余费用按70%退。' },
      ],
      footnote: CBOA_REFERENCE_NOTE,
    },
  ],
};

export const CBOA_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'family_restroom',
    title: '家庭课程怎么报',
    subtitle: '7–15岁孩子 + 陪读家长',
    courseIds: CBOA_FAMILY_COURSE_IDS,
    facts: [
      { label: '孩子', value: '每天5节一对一 + 2节小组课，另有1节选修课（1小时）' },
      { label: '家长', value: '每天3节一对一，可另加小组课' },
      { label: '转课', value: '家长的一对一可以有1节转给孩子上' },
    ],
    points: [
      '页面价格不适用于暑期旺季；旺季学校另有家庭营安排，价格和内容请咨询顾问。',
      '孩子在校的日常管理和课程事务由学校直接对接孩子本人，报名前顾问会和家长确认学校能提供的服务。',
    ],
  },
  {
    icon: 'elderly',
    title: '40岁以上课程',
    subtitle: '只收40岁及以上的学生',
    courseIds: [CBOA_SENIOR_COURSE_ID],
    facts: [{ label: '课量', value: '每天4节一对一 + 1节小组提升课（4:1）' }],
    points: [],
  },
  {
    icon: 'timer',
    title: '生存ESL',
    subtitle: '最多读4周',
    courseIds: [CBOA_SURVIVAL_COURSE_ID],
    facts: [{ label: '课量', value: '每天4节一对一 + 2节小组口语课（4:1）' }],
    points: [],
  },
  {
    icon: 'rule',
    title: '报名年龄',
    subtitle: '2026/08/23起入学适用',
    facts: [
      { label: '成人课程', value: '只收18周岁及以上' },
      { label: '青少年家庭课程', value: '7–15岁' },
    ],
    points: ['未满18岁的学生只能报青少年家庭课程。'],
  },
];

const SHUTTLE_POINTS = [
  '去校区：周一至周四07:30、08:30、09:30、10:20、11:20，周五07:30、08:30、09:15、10:10、11:00；下午14:00–17:00每小时一班。',
  '回公寓：12:00起到19:00大约每小时一班（周五下午时间略有不同）；21:30一班只在有学生上晚间课程或活动时开。',
];

export const CBOA_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'apartment',
    eyebrow: 'OCEAN SUITES',
    title: 'Ocean Suites 公寓生活',
    facts: [
      { label: '早餐', value: '每天在公寓餐厅免费享用，周末也有' },
      { label: '校车', value: '周一至周五免费往返校区，周末没有' },
      { label: '泳池', value: '周二至周日12:00–21:00，周一清洁' },
      { label: '健身房', value: '每天06:00–21:00' },
      { label: '空中休息室和自习室', value: '每天08:00–24:00' },
      { label: '周边', value: '在大马路旁，步行约14分钟到Mactan New Town商业区' },
    ],
    note: '住Ocean Suites每周另付1,000比索电费水费，已算进到校学杂费。',
    points: SHUTTLE_POINTS,
  },
  {
    icon: 'event',
    eyebrow: 'ARRIVAL',
    title: '入住与接送机',
    facts: [
      { label: '入住', value: '周日' },
      { label: '离校', value: '课程结束后的周六' },
      { label: '接机', value: '周六10:00至周日凌晨02:00；一般1,200比索，单独接机1,500比索' },
      { label: '送机', value: '1,000比索' },
      { label: '提前入住或延住', value: '每晚三人间1,500、双人间2,500、单人间3,000比索' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
  {
    icon: 'payments',
    eyebrow: 'OTHER FEES',
    title: '其他收费',
    facts: [
      { label: '押金', value: '每个住宿周1,000比索，离校时退还余额' },
      { label: 'EGI宿舍电费水费', value: '按电表计算，每月从押金扣除' },
      { label: '洗衣烘干', value: '每次200比索，最多7公斤' },
      { label: '学生证补办', value: '170比索' },
    ],
    note: '教材按实际购买结算；报价里按学校价目表预估。',
  },
];

export const CBOA_FAQS: FaqItem[] = [
  {
    question: '蓝海CBOA和碧瑶PINES是什么关系？',
    answer: '蓝海CBOA借鉴碧瑶PINES的办学经验，采用PINES的课程体系；校区在宿务麦克坦岛海边，环境更像度假村。',
  },
  {
    question: '2026年和2027年的价格怎么算？',
    answer: '按报名日期算：2027/01/31前报名，无论哪天入学，都按2026年的课程费、住宿费和优惠；2027/02/01起报名按2027年价格。到校学杂费按入学日期，2027/02/01起入学按2027年标准（管理费和部分教材费上调）。报价器会按你填的日期自动计算。',
  },
  {
    question: '现在报名有什么优惠？',
    answer: '2027/01/31前报名：每满4个非暑期旺季的课程周减150美元；课程满12周再减100美元；满16周再减100美元，之后每多2周再减25美元。2027/02/01–06/30报名、2027/02/01起入学：每个非旺季学习周减25美元；课程满12周减100美元，之后每多1周再减25美元。通过思达启航报名，另免100美元注册费，课程费和住宿费享95折。',
  },
  {
    question: '暑期旺季要加钱吗？',
    answer: '要。2027/06/27–08/21是暑期旺季，学习或住宿周碰到旺季，每周另收60美元附加费。课程周和住宿周重叠只算一次，附加费不参与任何优惠。',
  },
  {
    question: 'Ocean Suites和EGI宿舍怎么选？',
    answer: 'EGI宿舍在校内，有海景双人间、城景双人间和三人间，费用较低，电费水费按电表从押金扣。Ocean Suites是校外单人公寓，一人一间，每天含早餐，平日有免费校车，有泳池、健身房和空中休息室，电费水费每周1,000比索。2027/02/01起报名还可以选情侣房（两人一起报名同住）。',
  },
  {
    question: '未成年可以报名吗？',
    answer: '2026/08/23起入学，未满18岁不能报成人课程；7–15岁的孩子可以报青少年家庭课程，家长可同时报家长课程。暑期旺季家庭课程不按页面价格，请咨询顾问。',
  },
  {
    question: '页面上的报价包含全部费用吗？',
    answer: '学校费用包含注册费、课程费、住宿费和旺季附加费，并自动扣除优惠；到校学杂费单独列出，押金、接送机和洗衣另外准备。两者分开显示，不相加。',
  },
  {
    question: '思达启航会协助签证和入境吗？',
    answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，你只需要按顾问指引准备个人资料。',
  },
];

export const CBOA_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];
