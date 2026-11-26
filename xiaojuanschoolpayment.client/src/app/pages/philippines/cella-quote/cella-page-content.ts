// Text and data of the two CELLA campus pages (Uni Sparta and Premium) on the shared Philippine school template.
// Prices and offers come from cella-pricing.ts and the published content document, not from this file.
// Photos and videos are CELLA's own or from Korean partner agencies, cut so that no agency watermark, logo or
// contact detail shows (user decision 2026-11-21); each one shows exactly the campus, room or facility it names.
// Keep this file pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it later.
import type {
  BasicInfoRow,
  CampusBuildingCard,
  CourseDetailGuide,
  FaqItem,
  GalleryImage,
} from '../cia-school/cia-page-content';
import type { PhRoomProfile, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import type { CellaCampus } from './cella-pricing';

export const CELLA_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export interface CellaPageContent {
  /** Short name in headings, e.g. 'CELLA Uni'. */
  shortName: string;
  /** Full name in the hero title. */
  title: string;
  breadcrumb: string;
  heroLead: string;
  heroTags: ReadonlyArray<{ icon: string; text: string }>;
  overviewTitle: string;
  advisorText: string;
  campusIntro: string;
  galleryIntro: string;
  coursesIntro: string;
  roomsPhotoIntro: string;
  finalCtaTitle: string;
  finalCtaText: string;
  overviewFacts: ReadonlyArray<{ icon: string; label: string; value: string }>;
  quickInfo: ReadonlyArray<{ icon: string; title: string; text: string }>;
  basicInfo: readonly BasicInfoRow[];
  suitableFor: readonly string[];
  notSuitableFor: readonly string[];
  campusBuildings: readonly CampusBuildingCard[];
  galleryImages: readonly GalleryImage[];
  albumDescriptions: { 校园: string; 教室: string; 住宿: string; 餐厅: string; 设施: string };
  heroCategories: ReadonlyArray<'校园' | '教室' | '住宿' | '餐厅' | '设施'>;
  /** Hero album video chips, in order; the first video opens the album. */
  videoTabs: ReadonlyArray<{ label: string; videos: readonly string[] }>;
  videos: Readonly<Record<string, PhVideoItem>>;
  /** Room profile id → the clip of exactly that room type. */
  roomVideos: Readonly<Record<string, string>>;
  roomProfiles: readonly PhRoomProfile[];
  courseGroups: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }>;
  courseHighlights: Readonly<Record<string, { badge: string; label: string; text: string }>>;
  courseDetailGuides: readonly CourseDetailGuide[];
  compareShortcutCourseHint: string;
  faqs: readonly FaqItem[];
}

const uni = (file: string) => `assets/cella-uni/${file}.webp`;
const premium = (file: string) => `assets/cella-premium/${file}.webp`;
const video = (
  campus: 'uni' | 'premium', name: string, title: string, text: string, duration: string, shape: 'wide' | 'tall' = 'wide',
): PhVideoItem => ({
  title,
  text,
  src: `/assets/cella-${campus}/videos/${name}.mp4`,
  poster: `/assets/cella-${campus}/videos/${name}.webp`,
  duration,
  shape,
});
const room = (
  campus: 'uni' | 'premium', id: string, label: string, location: '校内' | '校外', gallery: readonly string[],
  suitable: string, note: string, highlights: string[], rateIds: readonly string[] = [id],
): PhRoomProfile => ({
  id, label, location, suitable, note, highlights, rateIds,
  image: gallery[0] ?? '',
  gallery,
  imageAlt: `CELLA ${campus === 'uni' ? 'Uni' : 'Premium'}${label}实景`,
});

/** Shared answers; each campus adds its own. */
const offersFaq = (campus: CellaCampus): FaqItem => ({
  question: '2027年有哪些优惠？',
  answer: [
    '2027/02/14–12/31入学：双人、三人、四人间每住1周减25美元（2027/05/30–08/28暑期周除外）。',
    '2027年入学读满12／16／20／24周，再减100／150／200／250美元。',
    ...(campus === 'premium' ? ['Premium六人间读4／8／12周，课程和住宿七五折（暑期周除外），和2027长期优惠二选一，报价自动取较多的一项。'] : []),
    '2027/01/02前结束的入学还可用2026年下半年的淡季优惠。报价器会按入学日期和周数自动计算。',
  ].join(''),
});
const SOCIAL_FAQ: FaqItem = {
  question: '6+2／9+3活动是什么？',
  answer: '首次报名的新学员住四人间，读8周只收6周的课程和住宿费，读12周只收9周；到校学杂费仍按实际周数。须在入学第一个月发4篇小红书和抖音内容，先经学校中文经理审核；除思达启航9折和学校圣诞优惠外，不能和其他优惠同用；没完成学校可以追回优惠。报价器“学生情况”里可以选择。',
};
const PEAK_FAQ: FaqItem = {
  question: '暑期要加钱吗？',
  answer: '要。2027/07/04–08/28的学习周每周加收60美元，2028年为07/02–08/26；同一周课程和住宿只算一次，暑期附加费不参与任何优惠。',
};
const FEES_FAQ: FaqItem = {
  question: '页面上的报价包含哪些费用？',
  answer: '学校费用（注册费、课程费、住宿费、暑期附加费和优惠）以美元计；到校后学杂费（SSP学习许可、签证续签、水电、管理费、教材、学生证等）以比索在学校缴纳，两部分分开显示。接机、洗衣和可退押金另列，不计入合计。',
};
const RETURNING_FAQ: FaqItem = {
  question: '老学员回来读要交注册费吗？',
  answer: '不用。老学员返校免注册费150美元，在报价器“学生情况”里选“老学员返校”即可。',
};

export const CELLA_PAGE_CONTENT: Record<CellaCampus, CellaPageContent> = {
  uni: {
    shortName: 'CELLA Uni',
    title: '菲律宾宿务 CELLA Uni 斯巴达校区',
    breadcrumb: '菲律宾游学 / 宿务学校 / CELLA Uni',
    heroLead: '宿务市 Talamban 区的斯巴达校区：白天上课、晚上还有晚课和自习，主打口语强化、雅思、托业和TESOL英语教师课程。',
    heroTags: [
      { icon: 'location_on', text: '宿务市 Talamban' },
      { icon: 'verified', text: '斯巴达管理' },
      { icon: 'workspace_premium', text: '雅思 / 托业 / TESOL' },
      { icon: 'pool', text: '校内泳池' },
    ],
    overviewTitle: '30 秒看懂 CELLA Uni',
    advisorText: 'CELLA Uni 是斯巴达校区：白天是一对一和小组课，晚上还有晚课、跟读训练和自习，适合需要学习节奏推着走的人。课程集中在口语强化、雅思、托业和TESOL教师课程；校内有泳池、健身房和休息区，课后可以放松。想要更自由的课后时间，可以看同一所学校的 Premium 校区。',
    campusIntro: '教学楼、宿舍、餐厅、泳池和健身房都在同一个校园里；另有校外的 JDN 宿舍可选。',
    galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
    coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看说明。',
    roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
    finalCtaTitle: '想确认 CELLA Uni 的空房和正式报价？',
    finalCtaText: '把入学日期、周数、课程目标和想住的房型发给顾问，我们帮你核对学校当期价格、空房、优惠和到校费用。',
    overviewFacts: [
      { icon: 'location_on', label: '位置', value: '宿务市 Talamban 区' },
      { icon: 'rule', label: '管理', value: '斯巴达，每天有晚课、跟读训练和自习' },
      { icon: 'menu_book', label: '课程', value: '口语强化、雅思（含保证班）、托业、TESOL英语教师课程' },
      { icon: 'event', label: '入学', value: '每周日入住；TESOL按学校指定开课日入学' },
      { icon: 'bed', label: '住宿', value: '校内单人到四人间，另有 JDN 校外宿舍' },
      { icon: 'pool', label: '设施', value: '泳池、健身房、餐厅、小卖部、台球和乒乓球' },
    ],
    quickInfo: [
      { icon: 'location_on', title: '宿务市 Talamban', text: '宿务市北部的住宅和大学区' },
      { icon: 'verified', title: '斯巴达管理', text: '晚课、跟读训练和自习都排在课表里' },
      { icon: 'workspace_premium', title: '考试与教师课程', text: '雅思、托业和TESOL' },
      { icon: 'pool', title: '泳池和健身房', text: '课后在校内放松' },
    ],
    basicInfo: [
      { label: '学校', value: 'CELLA English Academy Uni Sparta Campus' },
      { label: '位置', value: '菲律宾宿务市 Talamban 区' },
      { label: '管理方式', value: '斯巴达' },
      { label: '课程', value: '口语强化、雅思、托业、TESOL' },
      { label: '住宿', value: '校内单人、双人、三人、四人间；JDN 校外宿舍' },
      { label: '入学', value: '每周日入住' },
    ],
    suitableFor: ['需要固定学习节奏推着走的人', '有雅思或托业目标分数的学生', '想读TESOL英语教师课程的人', '想住校内、生活简单省心的学生'],
    notSuitableFor: ['想要课后完全自由、不想上晚课的人', '只想住海边度假区的人'],
    campusBuildings: [
      { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一对一教室和小组教室', '大教室（会议室）', '电脑自习室', '前台和教务办公室'] },
      { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['校内单人、双人、三人、四人间', 'JDN 校外宿舍：单人、双人、三人间'] },
      { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['泳池和池边休息区', '健身房', '台球、乒乓球', '休息室和屋顶休息区'] },
      { code: 'DINING', title: '餐厅与小卖部', icon: 'restaurant', facilities: ['学生餐厅', '校内小卖部'] },
    ],
    galleryImages: [
      { category: '校园', title: 'CELLA Uni 校园', description: '教学楼和宿舍在同一个校园。', src: uni('campus-exterior') },
      { category: '校园', title: '校园俯瞰', description: '校舍旁边就是泳池，四周是 Talamban 的住宅区。', src: uni('campus-aerial') },
      { category: '校园', title: '教学楼', description: '多层教学楼，教室、宿舍和餐厅都在校内。', src: uni('campus-building') },
      { category: '校园', title: '前台', description: '学校前台，旁边是小卖部的饮料柜。', src: uni('campus-reception') },
      { category: '教室', title: '一对一教室', description: '一对一课在单独的小教室上。', src: uni('class-one-to-one') },
      { category: '教室', title: '小组课教室', description: '小组课的教室。', src: uni('class-small-group') },
      { category: '教室', title: '大教室', description: '团体课和讲座用的大教室。', src: uni('class-group') },
      { category: '教室', title: '会议室', description: '活动和大型课程用的会议室。', src: uni('class-conference') },
      { category: '教室', title: '教室走廊', description: '玻璃隔间的教室区。', src: uni('class-corridor') },
      { category: '教室', title: '电脑自习室', description: '可以在这里自习和上网。', src: uni('study-computer-room') },
      { category: '住宿', title: '单人间', description: '一人一间。', src: uni('room-single') },
      { category: '住宿', title: '双人间', description: '两张单人床。', src: uni('room-twin') },
      { category: '住宿', title: '三人间', description: '三张单人床，每人一个书桌位。', src: uni('room-triple') },
      { category: '住宿', title: '四人间', description: '四张单人床，费用最低。', src: uni('room-quad') },
      { category: '住宿', title: '宿舍卫生间', description: '房间内的卫生间和淋浴。', src: uni('room-bathroom') },
      { category: '住宿', title: 'JDN 校外宿舍', description: 'JDN 单人间。', src: uni('jdn-single') },
      { category: '住宿', title: 'JDN 客厅', description: 'JDN 宿舍的客厅。', src: uni('jdn-living') },
      { category: '餐厅', title: '学生餐厅', description: '学生在校内餐厅用餐。', src: uni('dining-hall') },
      { category: '餐厅', title: '小卖部', description: '零食、饮料和日用品。', src: uni('store') },
      { category: '设施', title: '泳池', description: '课后可以游泳放松。', src: uni('pool') },
      { category: '设施', title: '池边休息区', description: '泳池旁边的桌椅和遮阳伞。', src: uni('pool-terrace') },
      { category: '设施', title: '健身房', description: '跑步机和力量器械。', src: uni('gym') },
      { category: '设施', title: '休息室', description: '懒人沙发和书架。', src: uni('lounge') },
      { category: '设施', title: '屋顶休息区', description: '课间和课后坐坐的地方。', src: uni('rooftop-lounge') },
      { category: '设施', title: '台球', description: '课后娱乐。', src: uni('billiards') },
      { category: '设施', title: '乒乓球', description: '课后娱乐。', src: uni('table-tennis') },
    ],
    albumDescriptions: {
      校园: '校园、教学楼与前台',
      教室: '一对一、小组和大教室',
      住宿: '校内宿舍与 JDN 校外宿舍',
      餐厅: '学生餐厅与小卖部',
      设施: '泳池、健身房和娱乐区',
    },
    heroCategories: ['校园', '设施', '住宿'],
    videoTabs: [
      { label: '校园视频', videos: ['uni-campus-tour', 'uni-campus-walk', 'uni-pool', 'uni-dining'] },
      { label: '宿舍视频', videos: ['uni-single-room', 'uni-twin-room', 'uni-triple-room', 'uni-quad-room'] },
      { label: '学员访谈', videos: ['uni-student-interview', 'uni-sparta-ielts-interview'] },
    ],
    videos: {
      'uni-campus-tour': video('uni', 'uni-campus-tour', 'CELLA Uni 校园导览', '跟着镜头看教室、各类课程、宿舍、餐厅、泳池和健身房。', '3:15'),
      'uni-campus-walk': video('uni', 'uni-campus-walk', '走一圈 CELLA Uni', '从大门走进教学楼、宿舍和公共区域。', '1:48'),
      'uni-pool': video('uni', 'uni-pool', '泳池', '校内泳池和池边休息区。', '0:14'),
      'uni-dining': video('uni', 'uni-dining', '学生餐厅', '学生在餐厅用餐。', '0:06'),
      'uni-single-room': video('uni', 'uni-single-room', '单人间', '校内单人间实拍。', '0:13'),
      'uni-twin-room': video('uni', 'uni-twin-room', '双人间', '校内双人间实拍。', '0:13'),
      'uni-triple-room': video('uni', 'uni-triple-room', '三人间', '校内三人间实拍。', '0:14'),
      'uni-quad-room': video('uni', 'uni-quad-room', '四人间', '校内四人间实拍。', '0:14'),
      // CELLA's own YouTube, 2026-01 (user request 2026-11-26). She talks about the Sparta program, so it is Uni Sparta.
      // The opening with her full name was cut, and the website and Instagram strip at the top is blurred.
      'uni-student-interview': video('uni', 'uni-student-interview', '蒙古学员采访', '蒙古学员讲为什么来菲律宾、斯巴达课程和在CELLA的生活（英文）。', '2:06', 'tall'),
      // CELLA's own YouTube, 2026-03 (user request 2026-11-27). She calls herself a Sparta IELTS student, so it is Uni
      // Sparta. The opening card with her full name was cut, and the website and social strip at the bottom is blurred.
      'uni-sparta-ielts-interview': video('uni', 'uni-sparta-ielts-interview', '韩国学员采访（雅思）', '韩国学员讲为什么选斯巴达雅思课程、严格的作息和作业制度，以及备考雅思机考的经验（英文）。', '2:52', 'tall'),
    },
    roomVideos: {
      'uni-single': 'uni-single-room',
      'uni-twin': 'uni-twin-room',
      'uni-triple': 'uni-triple-room',
      'uni-quad': 'uni-quad-room',
    },
    roomProfiles: [
      room('uni', 'uni-single', '单人间', '校内', [uni('room-single'), uni('room-bathroom')],
        '重视隐私、需要安静学习空间的学生', '一人一间。', ['空调、书桌、衣柜', '房间内卫生间']),
      room('uni', 'uni-twin', '双人间', '校内', [uni('room-twin'), uni('room-twin-02'), uni('room-twin-03'), uni('room-bathroom')],
        '朋友同行或想兼顾预算的学生', '两人一间。', ['空调、书桌、衣柜', '房间内卫生间']),
      room('uni', 'uni-triple', '三人间', '校内', [uni('room-triple'), uni('room-triple-02'), uni('room-triple-03'), uni('room-triple-04'), uni('room-bathroom')],
        '想控制预算、又想有书桌位的学生', '三人一间。', ['空调、书桌、衣柜', '房间内卫生间']),
      room('uni', 'uni-quad', '四人间', '校内', [uni('room-quad'), uni('room-quad-02'), uni('room-bathroom')],
        '预算优先、喜欢热闹的学生', '四人一间，费用最低；6+2／9+3活动指定房型。', ['空调、书桌、衣柜', '房间内卫生间']),
      room('uni', 'uni-jdn-single', 'JDN 校外单人间', '校外', [uni('jdn-single'), uni('jdn-single-02'), uni('jdn-living'), uni('jdn-bathroom')],
        '想住校外、要更多私人空间的学生', 'JDN 是校外宿舍，到校上课需通勤；空房和接驳请先让顾问确认。', ['有客厅', '价格和校内单人间相同']),
      room('uni', 'uni-jdn-twin', 'JDN 校外双人间', '校外', [uni('jdn-twin'), uni('jdn-living'), uni('jdn-bathroom')],
        '朋友同行、想住校外的学生', 'JDN 是校外宿舍，到校上课需通勤；空房和接驳请先让顾问确认。', ['有客厅', '价格和校内双人间相同']),
      room('uni', 'uni-jdn-triple', 'JDN 校外三人间', '校外', [uni('jdn-triple'), uni('jdn-living'), uni('jdn-bathroom')],
        '三人同行、想住校外的学生', 'JDN 是校外宿舍，到校上课需通勤；空房和接驳请先让顾问确认。', ['有客厅', '价格和校内三人间相同']),
    ],
    courseGroups: [
      { icon: 'record_voice_over', title: '口语强化', text: '多开口、多练听说', courseIds: ['uni-power-speaking-1', 'uni-power-speaking-2'] },
      {
        icon: 'workspace_premium', title: '雅思 IELTS', text: '预备、强化和保证班',
        courseIds: ['uni-ielts-guarantee', 'uni-ielts-pre', 'uni-ielts-intensive'],
      },
      { icon: 'fact_check', title: '托业 TOEIC', text: '预备和强化', courseIds: ['uni-toeic-pre', 'uni-toeic-intensive'] },
      { icon: 'school', title: 'TESOL 英语教师课程', text: '4周一期，指定开课日', courseIds: ['uni-tesol'] },
    ],
    courseHighlights: {},
    courseDetailGuides: [
      {
        icon: 'workspace_premium', title: '雅思保证班', subtitle: 'IELTS Guarantee', courseIds: ['uni-ielts-guarantee'],
        facts: [{ label: '时长', value: '8周或12周' }, { label: '每天', value: '6节一对一＋1节小组课＋1节大团体课' }],
        points: ['入学条件、保证分数和指定入学日须由顾问向学校确认。', '晚课、跟读训练、选修课和自习也排在课表里。'],
      },
      {
        icon: 'school', title: 'TESOL 英语教师课程', subtitle: 'TESOL', courseIds: ['uni-tesol'],
        facts: [{ label: '时长', value: '每期4周' }, { label: '入学', value: '须先通过线上面试' }],
        points: [
          '2027年开课日：1/3、1/31、2/28、3/28、4/25、5/23、6/20、7/18、8/15、9/5、10/3、10/31，按开课日入学。',
          '每天6节2:8课程和2节线上学习，另有晚课、跟读训练、选修课和自习。',
        ],
      },
    ],
    compareShortcutCourseHint: '如口语强化1和2、雅思预备和强化',
    faqs: [
      {
        question: 'CELLA Uni 和 Premium 校区怎么选？',
        answer: 'Uni 是斯巴达校区，晚上有晚课和自习，适合想被学习节奏推着走、准备雅思托业或读TESOL的人；Premium 不是斯巴达校区，课后更自由，主打口语、商务、空乘和打工度假课程，房型也更多。两个校区价格和优惠分开计算。',
      },
      FEES_FAQ,
      offersFaq('uni'),
      SOCIAL_FAQ,
      PEAK_FAQ,
      {
        question: '雅思保证班和TESOL有什么限制？',
        answer: '雅思保证班只开8周或12周；TESOL每期4周，须先通过线上面试并在学校指定开课日入学。报价器选了不符合的周数或日期会提示。',
      },
      {
        question: 'JDN 校外宿舍和校内宿舍有什么不同？',
        answer: 'JDN 是校外宿舍，同房型价格和校内相同，房间带客厅；到校上课需要通勤，空房和接驳安排请先让顾问向学校确认。',
      },
      RETURNING_FAQ,
    ],
  },
  premium: {
    shortName: 'CELLA Premium',
    title: '菲律宾宿务 CELLA Premium 校区',
    breadcrumb: '菲律宾游学 / 宿务学校 / CELLA Premium',
    heroLead: '宿务市 Banilad 区的酒店式校区：不是斯巴达管理，课后更自由；主打口语强化、商务英语、空乘英语和打工度假课程。',
    heroTags: [
      { icon: 'location_on', text: '宿务市 Banilad' },
      { icon: 'self_improvement', text: '非斯巴达，课后自由' },
      { icon: 'business_center', text: '口语 / 商务 / 空乘' },
      { icon: 'pool', text: '校内泳池' },
    ],
    overviewTitle: '30 秒看懂 CELLA Premium',
    advisorText: 'CELLA Premium 是酒店式校区，不是斯巴达管理，课后时间更自由，适合想学习和生活兼顾的成人。课程以口语强化为主，也有商务英语、空乘英语和打工度假课程；Light ESL 只上半天。房型从六人间到单人间都有，另有校外的 STACIA HOTEL。想要更严格的学习管理，可以看同一所学校的 Uni 斯巴达校区。',
    campusIntro: '教学区、宿舍、餐厅、咖啡厅和泳池都在校区内；另有校外的 STACIA HOTEL 宿舍可选。',
    galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
    coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看说明。',
    roomsPhotoIntro: '点选房型查看实景；各房型价格见上方住宿费表。',
    finalCtaTitle: '想确认 CELLA Premium 的空房和正式报价？',
    finalCtaText: '把入学日期、周数、课程目标和想住的房型发给顾问，我们帮你核对学校当期价格、空房、优惠和到校费用。',
    overviewFacts: [
      { icon: 'location_on', label: '位置', value: '宿务市 Banilad 区' },
      { icon: 'rule', label: '管理', value: '非斯巴达，课后时间自由安排' },
      { icon: 'menu_book', label: '课程', value: '轻松半天课、口语强化、商务英语、空乘英语、打工度假' },
      { icon: 'event', label: '入学', value: '每周日入住' },
      { icon: 'bed', label: '住宿', value: '校内单人间到六人间，另有 STACIA HOTEL 校外宿舍' },
      { icon: 'pool', label: '设施', value: '泳池、咖啡厅、餐厅、乒乓球和活动室' },
    ],
    quickInfo: [
      { icon: 'location_on', title: '宿务市 Banilad', text: '宿务市区的生活圈' },
      { icon: 'self_improvement', title: '非斯巴达', text: '课后时间自由安排' },
      { icon: 'business_center', title: '口语和职业英语', text: '商务、空乘、打工度假' },
      { icon: 'bed', title: '房型多', text: '六人间到单人间，另有校外酒店宿舍' },
    ],
    basicInfo: [
      { label: '学校', value: 'CELLA English Academy Premium Campus' },
      { label: '位置', value: '菲律宾宿务市 Banilad 区' },
      { label: '管理方式', value: '非斯巴达' },
      { label: '课程', value: 'Light ESL、口语强化、商务英语、空乘英语、打工度假' },
      { label: '住宿', value: '校内单人、半单人、双人、四人、六人间；STACIA HOTEL 校外宿舍' },
      { label: '入学', value: '每周日入住' },
    ],
    suitableFor: ['想学习和生活兼顾的成人', '想多开口练口语的学生', '准备商务英语、空乘或打工度假的人', '重视住宿舒适度的学生'],
    notSuitableFor: ['需要严格管理、晚上有人盯自习的人', '只想住海边度假区的人'],
    campusBuildings: [
      { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一对一教室和小组教室', '大教室（会议室）', '学习区'] },
      { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['校内单人、半单人、双人、四人、六人间', 'STACIA HOTEL 校外宿舍：单人、双人间'] },
      { code: 'LIFE', title: '休闲设施', icon: 'pool', facilities: ['泳池和池边躺椅', '乒乓球', '活动室'] },
      { code: 'DINING', title: '餐厅与咖啡厅', icon: 'restaurant', facilities: ['学生餐厅（自助取餐）', '校内咖啡厅 CellaC'] },
    ],
    galleryImages: [
      { category: '校园', title: 'CELLA Premium 泳池与校舍', description: '校舍围着泳池和花园。', src: premium('pool-garden') },
      { category: '校园', title: '大堂', description: '学校大堂和前台。', src: premium('lobby') },
      { category: '校园', title: 'CELLA 招牌', description: '大堂里的 CELLA 招牌。', src: premium('lobby-sign') },
      { category: '校园', title: '学习区', description: '教学区入口。', src: premium('academic-area') },
      { category: '教室', title: '一对一教室', description: '一对一课在单独的小教室上。', src: premium('class-one-to-one') },
      { category: '教室', title: '小组课教室', description: '小组课每班最多4人。', src: premium('class-small-group') },
      { category: '教室', title: '大教室', description: '团体课和活动用的大教室。', src: premium('class-conference') },
      { category: '教室', title: '教室走廊', description: '教室集中在同一层。', src: premium('class-corridor') },
      { category: '住宿', title: '双人间', description: '两张单人床。', src: premium('room-twin-02') },
      { category: '住宿', title: '四人间', description: '四张单人床。', src: premium('room-quad') },
      { category: '住宿', title: '六人间', description: '上床下桌，费用最低。', src: premium('room-six') },
      { category: '住宿', title: '宿舍卫生间', description: '房间内的卫生间和淋浴。', src: premium('room-bathroom') },
      { category: '住宿', title: 'STACIA HOTEL 单人间', description: '校外酒店宿舍。', src: premium('stacia-single') },
      { category: '住宿', title: 'STACIA HOTEL 双人间', description: '校外酒店宿舍。', src: premium('stacia-twin') },
      { category: '餐厅', title: '学生餐厅', description: '学生在校内餐厅用餐。', src: premium('dining-hall') },
      { category: '餐厅', title: '自助取餐区', description: '餐厅的取餐台。', src: premium('dining-buffet') },
      { category: '餐厅', title: '咖啡厅 CellaC', description: '校内咖啡厅。', src: premium('cafe') },
      { category: '设施', title: '泳池', description: '课后可以游泳放松。', src: premium('pool') },
      { category: '设施', title: '池边躺椅', description: '泳池边的躺椅和遮阳伞。', src: premium('pool-deck') },
      { category: '设施', title: '泳池一角', description: '泳池和校舍。', src: premium('pool-side') },
      { category: '设施', title: '乒乓球', description: '课后娱乐。', src: premium('table-tennis') },
      { category: '设施', title: '活动室', description: '活动和自习用的空间。', src: premium('activity-room') },
    ],
    albumDescriptions: {
      校园: '泳池花园、大堂与学习区',
      教室: '一对一、小组和大教室',
      住宿: '校内宿舍与 STACIA HOTEL',
      餐厅: '学生餐厅与咖啡厅',
      设施: '泳池、乒乓球和活动室',
    },
    heroCategories: ['校园', '设施', '住宿'],
    videoTabs: [
      { label: '校园视频', videos: ['premium-campus-tour', 'premium-campus-walk'] },
      { label: '宿舍视频', videos: ['premium-single-twin-room', 'premium-semi-single-room', 'premium-quad-room'] },
      { label: '课程视频', videos: ['premium-family-course'] },
      { label: '活动视频', videos: ['premium-quiz-bee', 'premium-island-hopping', 'premium-christmas-party-2025'] },
    ],
    videos: {
      'premium-campus-tour': video('premium', 'premium-campus-tour', 'CELLA Premium 校园导览', '跟着镜头看学习区、教室、宿舍、餐厅和泳池。', '3:05'),
      'premium-campus-walk': video('premium', 'premium-campus-walk', '走一圈 CELLA Premium', '从大堂走进教学区、宿舍和泳池。', '2:22'),
      'premium-single-twin-room': video('premium', 'premium-single-twin-room', '单人／双人间', '校内单人或双人入住的房间实拍。', '0:07'),
      'premium-semi-single-room': video('premium', 'premium-semi-single-room', '半单人间', '校内半单人间实拍。', '0:03'),
      'premium-quad-room': video('premium', 'premium-quad-room', '四人间', '校内四人间实拍。', '0:12'),
      // CELLA's own YouTube, 2026 (user request 2026-11-26). In the family-course video the tennis court with sponsor
      // boards and the outdoor trips (zipline, a restaurant, canyoneering) are covered by a still of the interview, so
      // the answers stay whole; the party video lost a speaker close-up that showed its brand.
      'premium-family-course': video('premium', 'premium-family-course', '亲子课程', '在Premium校区上亲子课程的一家人，孩子和家长讲上课和进步（英文）。', '2:52'),
      'premium-christmas-party-2025': video('premium', 'premium-christmas-party-2025', '2025圣诞派对', '学校给Premium校区学员办的圣诞派对。', '2:15'),
      // CELLA's own YouTube, 2026-01 (user request 2026-11-27). Green-chair classroom, CELLA neon room and industrial
      // ceiling match Premium's own tour videos. A 5-second shot captioned "only here at CELLA" was cut.
      'premium-quiz-bee': video('premium', 'premium-quiz-bee', '英语知识竞赛（Quiz Bee）', '学校在Premium校区办的英语知识竞赛，学员分组上台答题。', '2:00'),
      // CELLA's own YouTube, 2025-11 (user decision 2026-11-27 to show this outside trip). The junior camp sets off from
      // the Premium entrance. Every shot with the tour operator's name (office wall, close-up life jackets, staff shirt
      // backs with its website and staff names) or another tour boat's name was cut; 8 clean parts remain.
      'premium-island-hopping': video('premium', 'premium-island-hopping', '跳岛游', '学校给Premium校区青少年营学员组织的跳岛游：出海浮潜、船上用餐和游戏；活动安排和费用以学校当期通知为准。', '2:14'),
    },
    roomVideos: {
      'premium-single': 'premium-single-twin-room',
      'premium-twin': 'premium-single-twin-room',
      'premium-semi-single': 'premium-semi-single-room',
      'premium-quad': 'premium-quad-room',
    },
    roomProfiles: [
      room('premium', 'premium-single', '单人间', '校内', ['assets/cella-premium/videos/premium-single-twin-room.webp', premium('room-bathroom')],
        '重视隐私、需要安静学习空间的学生', '一人一间；同一类房间也可两人入住（双人间）。', ['空调、书桌', '房间内卫生间']),
      room('premium', 'premium-semi-single', '半单人间', '校内', ['assets/cella-premium/videos/premium-semi-single-room.webp', premium('room-bathroom')],
        '想要独立空间、预算比单人间低的学生', '半独立的个人空间，价格介于单人间和双人间之间。', ['空调', '房间内卫生间']),
      room('premium', 'premium-twin', '双人间', '校内', [premium('room-twin'), premium('room-twin-02'), premium('room-twin-03'), premium('room-twin-04'), premium('room-bathroom')],
        '朋友同行或想兼顾预算的学生', '两人一间。', ['空调、书桌、衣柜', '房间内卫生间']),
      room('premium', 'premium-quad', '四人间', '校内', [premium('room-quad'), premium('room-bathroom')],
        '预算优先、喜欢热闹的学生', '四人一间；6+2／9+3活动指定房型。', ['空调', '房间内卫生间']),
      room('premium', 'premium-six', '六人间', '校内', [premium('room-six')],
        '预算优先的学生', '上床下桌的六人间，费用最低；2027年入学读4／8／12周可享课程和住宿七五折。', ['上床下桌']),
      room('premium', 'premium-alicia-single', 'STACIA HOTEL 单人间', '校外', [premium('stacia-single'), premium('stacia-single-02'), premium('stacia-bathroom')],
        '想住酒店式房间、要更多私人空间的学生', 'STACIA HOTEL 是校外宿舍，到校上课需通勤；空房请先让顾问确认。2027年起不收押金，电费按固定金额收取。', ['酒店式房间', '房间内卫生间']),
      room('premium', 'premium-alicia-twin', 'STACIA HOTEL 双人间', '校外', [premium('stacia-twin'), premium('stacia-bathroom')],
        '夫妻或朋友同行、想住酒店式房间的学生', 'STACIA HOTEL 是校外宿舍，到校上课需通勤；空房请先让顾问确认。2027年起不收押金，电费按固定金额收取。', ['酒店式房间', '房间内卫生间']),
    ],
    courseGroups: [
      {
        icon: 'record_voice_over', title: '口语与综合英语', text: '半天轻松课或全天口语强化',
        courseIds: ['premium-light-esl', 'premium-power-speaking-1', 'premium-power-speaking-2'],
      },
      { icon: 'business_center', title: '商务英语', text: '面试、会议和职场沟通', courseIds: ['premium-business-preparation', 'premium-business-intensive'] },
      {
        icon: 'flight', title: '空乘与打工度假', text: '空乘英语、打工度假前的英语准备',
        courseIds: ['premium-ace', 'premium-working-holiday', 'premium-working-holiday-2'],
      },
    ],
    courseHighlights: {},
    courseDetailGuides: [
      {
        icon: 'wb_sunny', title: 'Light ESL 半天课程', subtitle: 'Light ESL', courseIds: ['premium-light-esl'],
        facts: [{ label: '上课时间', value: '上午班或下午班二选一' }],
        points: ['另一半天自由安排，适合想边学边放松的成人。'],
      },
      {
        icon: 'flight', title: 'ACE 空乘英语', subtitle: 'ACE', courseIds: ['premium-ace'],
        facts: [{ label: '每天', value: '4节一对一＋3节4人小组课＋1节8人大团体课＋2节自习课' }],
        points: [
          '2027年起含校外专业培训中心的空乘和安全培训；带实习的课程同价。',
          '2027年实习开始日：1/10、2/7、3/7、4/4、5/2、5/30、6/27、7/25、8/22、9/19、10/17、11/14、12/12。',
          '入学条件须由顾问向学校确认。',
        ],
      },
    ],
    compareShortcutCourseHint: '如 Light ESL 和口语强化、商务预备和强化',
    faqs: [
      {
        question: 'CELLA Premium 和 Uni 校区怎么选？',
        answer: 'Premium 不是斯巴达校区，课后更自由，主打口语、商务、空乘和打工度假课程，房型从六人间到单人间都有；Uni 是斯巴达校区，晚上有晚课和自习，适合准备雅思托业或读TESOL的人。两个校区价格和优惠分开计算。',
      },
      FEES_FAQ,
      offersFaq('premium'),
      SOCIAL_FAQ,
      PEAK_FAQ,
      {
        question: '可以带孩子一起读吗？',
        answer: '可以。Premium 有2027家庭套餐，家长和孩子同住家庭房，校内宿舍或 STACIA HOTEL 都有：1位家长＋1位孩子4周5,900美元（STACIA 4,900美元），已含注册费、课程、食宿和到校学杂费；通过思达启航报名，除注册费外再打9折。STACIA 套餐不含家长课程。在下方报价的课程里选“家庭套餐”，可算1–4周的全家总价；更长时间请问思达启航顾问。',
      },
      {
        question: 'STACIA HOTEL 校外宿舍怎么样？',
        answer: 'STACIA HOTEL 是 Premium 校区的校外酒店式宿舍，有单人间和双人间，价格和校内同类房型相同；2027年起不收房间押金，电费按每周1,000比索固定收取。到校上课需要通勤，空房请先让顾问确认。',
      },
      RETURNING_FAQ,
    ],
  },
};
