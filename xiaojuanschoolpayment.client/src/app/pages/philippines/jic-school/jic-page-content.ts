// Text and data of the two JIC campus pages (Challenger and Premium, Baguio) on the shared Philippine school template.
// Prices and offers come from jic-pricing.ts and the published content document, not from this file.
// Facts come from JIC's 2026-09 orientation pack, its 2027 calendar, the December 2026 holiday notice and the BESA
// pickup schedule. Photos and videos are JIC's own (its school pack and its official YouTube channel); each shows exactly the
// campus, room, class or facility it names.
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
import type { PhRoomProfile, PhStudyMode, PhVideoItem } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import type { JicCampus } from './jic-pricing';

export const JIC_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export interface JicPageContent {
  shortName: string;
  title: string;
  breadcrumb: string;
  heroLead: string;
  heroTags: ReadonlyArray<{ icon: string; text: string }>;
  overviewTitle: string;
  advisorText: string;
  campusIntro: string;
  coursesIntro: string;
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
  videoTabs: ReadonlyArray<{ label: string; videos: readonly string[] }>;
  videos: Readonly<Record<string, PhVideoItem>>;
  roomVideos: Readonly<Record<string, string>>;
  roomProfiles: readonly PhRoomProfile[];
  courseGroups: ReadonlyArray<{ icon: string; title: string; text: string; courseIds: readonly string[] }>;
  courseHighlights: Readonly<Record<string, { badge: string; label: string; text: string }>>;
  courseDetailGuides: readonly CourseDetailGuide[];
  studyModes: readonly PhStudyMode[];
  scheduleColumns: ReadonlyArray<{ code: string; title: string; rows: readonly DailyScheduleRow[] }>;
  scheduleIntro: string;
  scheduleBadge: string;
  practicalGuides: readonly CampusPracticalGuide[];
  compareRoomHint: string;
  compareCourseHint: string;
  faqs: readonly FaqItem[];
}

const asset = (file: string) => `/assets/philippines/${file}`;
const video = (name: string, title: string, text: string, duration: string, shape: PhVideoItem['shape'] = 'wide'): PhVideoItem => ({
  title,
  text,
  src: asset(`${name}.mp4`),
  poster: asset(`jic-posters/${name}.webp`),
  duration,
  shape,
});
const room = (
  campus: JicCampus, id: string, label: string, gallery: readonly string[], suitable: string, note: string,
  highlights: string[], rateIds: readonly string[] = [id],
): PhRoomProfile => ({
  id, label, location: '校内', suitable, note, highlights, rateIds,
  image: gallery[0] ?? '',
  gallery,
  imageAlt: `JIC ${campus === 'challenger' ? 'Challenger' : 'Premium'} ${label}实景`,
});
const row = (time: string, activity: string, kind: DailyScheduleRow['kind']): DailyScheduleRow => ({ time, activity, kind });

/** 2027 term starts (every second Sunday) and monthly tests (every fourth Friday, no classes that day). */
export const JIC_TERM_STARTS_2027 = '1/10、1/24、2/7、2/21、3/7、3/21、4/4、4/18、5/2、5/16、5/30、6/13、6/27、7/11、7/25、8/8、8/22、9/5、9/19、10/3、10/17、10/31、11/14、11/28、12/12、12/26';
export const JIC_MONTHLY_TESTS_2027 = '1/7（晚上）、2/5、3/5、4/2、4/30、5/28、6/25、7/23、8/20、9/17、10/15、11/12、12/10';

/** Philippine holidays on JIC's 2027 school calendar (no classes). */
export const JIC_HOLIDAYS_2027: HolidayCalendar = {
  year: 2027,
  label: 'JIC 2027年校历',
  months: [
    { month: 1, holidays: [{ day: '1/1', name: '元旦' }] },
    { month: 2, holidays: [{ day: '2/17', name: '春节' }] },
    { month: 3, holidays: [{ day: '3/25', name: '濯足节' }, { day: '3/26', name: '耶稣受难日' }, { day: '3/27', name: '复活节前夕' }] },
    { month: 4, holidays: [{ day: '4/9', name: '英勇日' }] },
    { month: 5, holidays: [{ day: '5/1', name: '劳动节' }] },
    { month: 6, holidays: [{ day: '6/12', name: '独立日' }] },
    { month: 8, holidays: [{ day: '8/21', name: '尼诺·阿基诺纪念日' }, { day: '8/30', name: '国家英雄日' }] },
    { month: 11, holidays: [{ day: '11/1', name: '万圣节' }, { day: '11/2', name: '万灵节' }] },
    { month: 12, holidays: [
      { day: '12/8', name: '圣母无原罪瞻礼' }, { day: '12/24', name: '平安夜' },
      { day: '12/30', name: '黎刹纪念日' }, { day: '12/31', name: '除夕' },
    ] },
  ],
};

const FEES_FAQ: FaqItem = {
  question: '页面上的报价包含哪些费用？',
  answer: '学校费用（注册费、课程费、住宿费、旺季附加费和优惠）以美元计；到校后学杂费（SSP学习许可、签证续签、水电、维护费、洗衣、教材、学生证、接机等）以比索在学校缴纳，两部分分开显示。可退押金3,000比索另列，不计入合计。',
};
const OFFERS_FAQ: FaqItem = {
  question: '现在有哪些优惠？',
  answer: [
    '通过思达启航报名免注册费100美元，老学员返校也免。',
    '淡季学习每满4周按房型优惠：2026/08/23–2027/01/09四人间150美元、单人间和双人间50美元；2027/02/21–06/26和2027/08/22–2028/01/08四人间100美元、双人间50美元（2027年单人间只有Premium单人雅房50美元）。',
    '读满12／16／20／24周再减300／400／500／600美元。',
    '圣诞优惠：2026/11/29、12/13、12/27或2027/01/10开学日入学减200美元，2027/11/28、12/12、12/26或2028/01/09入学减150美元，限双人间和四人间、读满4周。报价器会自动计算。',
  ].join(''),
};
const PEAK_FAQ: FaqItem = {
  question: '暑期要加钱吗？',
  answer: '要。JIC是BESA会员学校，2027/06/27–08/22的学习周每周加收60美元；同一周课程和住宿只算一次，旺季附加费不参与任何优惠。旺季周也不计入淡季优惠。',
};
const TERM_FAQ: FaqItem = {
  question: '可以任何一个周日入学吗？',
  answer: 'JIC每两周开一次新学期（2027年从1/10起每隔一周的周日），按开学日入学、在学期末的周六结业最合适。其他周日入学或学期中途结业，学校每次另收8,000比索，须先由顾问向学校确认。报价默认从下一个开学日开始。',
};
const PICKUP_FAQ: FaqItem = {
  question: '怎么从机场到碧瑶？',
  answer: '周日有BESA碧瑶学校联合接机，每人3,000比索：马尼拉机场01:00、08:00、14:00、20:00（一号航站楼B6、三号航站楼B7），克拉克机场周日12:00、17:00和周一01:30（3号候车区），航班须提前1小时以上落地；到碧瑶后换乘学校车辆。其他日子要单独派车，马尼拉1人12,000、2人每人6,000、3人以上每人4,000比索，克拉克1人7,000、2人每人4,000、3人以上每人3,000比索。',
};
const MEALS_FAQ: FaqItem = {
  question: '吃得怎么样？有素食吗？',
  answer: '平日三餐是半自助：主菜和一道菜分好，其他菜、白饭（也有紫米饭）和汤自取，以韩式为主，不定期有日式、越式和菲律宾菜，午餐有水果；周六周日只有早午餐（09:00–12:00自助）。学校不提供素食餐，提前告知可准备白粥。',
};
const RETURNING_FAQ: FaqItem = {
  question: '老学员回来读要交注册费吗？',
  answer: '不用。老学员返校免注册费，在报价器“学生情况”里选“老学员返校”即可；通过思达启航报名的新学员同样免注册费。',
};

const CHALLENGER_PHOTOS = {
  aerial: asset('jic-campus-hero.webp'),
  overview: asset('jic-main-campus-overview.webp'),
  courtyard: asset('jic-challenger-campus-courtyard.webp'),
  garden: asset('jic-challenger-west-garden.webp'),
};

export const JIC_PAGE_CONTENT: Record<JicCampus, JicPageContent> = {
  challenger: {
    shortName: 'JIC Challenger',
    title: '菲律宾碧瑶 JIC Challenger 挑战校区',
    breadcrumb: '菲律宾游学 / 碧瑶学校 / JIC Challenger',
    heroLead: '碧瑶的雅思和密集英语校区：每天4–6节一对一加2节团体课，入学第一天自选斯巴达或半斯巴达；校内有雅思官方机考考场。',
    heroTags: [
      { icon: 'location_on', text: '菲律宾碧瑶' },
      { icon: 'verified', text: '斯巴达／半斯巴达自选' },
      { icon: 'workspace_premium', text: '雅思与密集英语' },
      { icon: 'edit_note', text: '校内雅思机考考场' },
    ],
    overviewTitle: '30 秒看懂 JIC Challenger',
    advisorText: 'Challenger 是 JIC 的学术校区，约130名学生，主打雅思和密集英语：每天4到6节一对一，加2节10人以内的团体课。斯巴达免费参加，晚上有单词考试和老师监督的晚自习，平日外出只到19:00；半斯巴达课后更自由。碧瑶气候凉爽，适合长时间学习。想要课后更轻松、口语和小组课更多，可以看同一所学校的 Premium 校区。',
    campusIntro: '教室、宿舍、餐厅、健身房和24小时自习室都在校内；晚上22:00后公共区域保持安静。',
    coursesIntro: '雅思和一般英语各有三种强度，每门课下面是每天的课时；点开可看说明。',
    finalCtaTitle: '想确认 JIC Challenger 的空房和正式报价？',
    finalCtaText: '把入学日期、周数、课程目标和想住的房型发给顾问，我们帮你核对开学日、空房、优惠和到校费用。',
    overviewFacts: [
      { icon: 'location_on', label: '位置', value: '菲律宾碧瑶，气候凉爽' },
      { icon: 'groups', label: '规模', value: '约130名学生' },
      { icon: 'rule', label: '管理', value: '入学第一天自选斯巴达或半斯巴达，每两周可申请更换' },
      { icon: 'menu_book', label: '课程', value: '雅思（含保分班）、一般英语，每天4–6节一对一＋2节团体课' },
      { icon: 'event', label: '入学', value: '每两周的周日开学，第二天入学测试' },
      { icon: 'bed', label: '住宿', value: '单人间、双人间、四人间（上下铺／楼中楼）' },
      { icon: 'edit_note', label: '考试', value: '校内有雅思官方机考考场；每4周一次月考' },
      { icon: 'fitness_center', label: '设施', value: '健身房、羽毛球场、韩国超市、咖啡厅、24小时自习室' },
    ],
    quickInfo: [
      { icon: 'location_on', title: '菲律宾碧瑶', text: '山城气候凉爽，适合专心学习' },
      { icon: 'verified', title: '斯巴达免费参加', text: '单词考试、晚自习和每周模考' },
      { icon: 'workspace_premium', title: '雅思强项', text: '雅思保分班与校内官方机考考场' },
      { icon: 'person', title: '一对一为主', text: '每天4–6节一对一' },
    ],
    basicInfo: [
      { label: '学校', value: 'JIC Challenger Campus（挑战校区）' },
      { label: '位置', value: '菲律宾碧瑶' },
      { label: '规模', value: '约130名学生' },
      { label: '管理方式', value: '斯巴达或半斯巴达' },
      { label: '课程', value: '雅思、雅思保分班、一般英语' },
      { label: '入学年龄', value: '一般课程18岁以上' },
    ],
    suitableFor: ['有雅思目标分数、想集中冲分的学生', '想多上一对一、需要学习节奏推着走的人', '想住校内、生活简单省心的学生'],
    notSuitableFor: ['想要很多小组课和课后活动的人', '只想轻松游学、不想上晚自习的人（可选半斯巴达或 Premium 校区）'],
    campusBuildings: [
      { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一对一教室和团体教室', '电脑教室和口语测试区', '图书馆和24小时自习室', '雅思官方机考考场'] },
      { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['单人间、双人间', '四人间（上下铺）', '四人间（楼中楼）', '每间房有独立无线网络'] },
      { code: 'LIFE', title: '生活设施', icon: 'fitness_center', facilities: ['健身房、羽毛球场', '户外休息区和花园', '韩国超市、洗衣房', '公共厨房'] },
      { code: 'DINING', title: '餐厅与咖啡厅', icon: 'restaurant', facilities: ['室内和户外用餐区', '平日三餐，周末早午餐', '校内咖啡厅'] },
    ],
    galleryImages: [
      { category: '校园', title: 'Challenger 校园航拍', description: '碧瑶山坡上的 Challenger 校区。', src: CHALLENGER_PHOTOS.aerial },
      { category: '校园', title: '校区全景', description: '校舍和宿舍楼。', src: CHALLENGER_PHOTOS.overview },
      { category: '校园', title: '校园中庭', description: '校舍之间的中庭和户外休息区。', src: CHALLENGER_PHOTOS.courtyard },
      { category: '校园', title: 'West Garden', description: '户外桌椅和安静的交流区。', src: CHALLENGER_PHOTOS.garden },
      { category: '教室', title: '一对一教室', description: '一对一课在独立的小教室上。', src: asset('jic-challenger-one-on-one-classroom.webp') },
      { category: '教室', title: '一对一教学区', description: '多间独立一对一教室。', src: asset('jic-challenger-one-on-one-area.webp') },
      { category: '教室', title: '团体教室', description: '10人以内的团体课教室。', src: asset('jic-challenger-group-classroom.webp') },
      { category: '教室', title: '团体课', description: '团体课上的讨论和练习。', src: asset('jic-challenger-active-group-class.webp') },
      { category: '教室', title: '小组教室', description: '小组讨论用的教室。', src: asset('jic-challenger-small-group-classroom.webp') },
      { category: '教室', title: '上课实景', description: '老师授课中。', src: asset('jic-challenger-teaching-scene.webp') },
      { category: '教室', title: '电脑教室', description: '电脑学习和考试练习。', src: asset('jic-challenger-computer-room.webp') },
      { category: '教室', title: '口语测试区', description: '独立的电脑口语测试座位。', src: asset('jic-challenger-speaking-test-room.webp') },
      { category: '教室', title: '图书馆', description: '自习和备考的地方。', src: asset('jic-main-library.webp') },
      { category: '住宿', title: '单人间', description: '一人一间。', src: asset('jic-challenger-single-room.webp') },
      { category: '住宿', title: '双人间', description: '两人一间。', src: asset('jic-challenger-double-room.webp') },
      { category: '住宿', title: '四人间（楼中楼）', description: '上下两层的四人间。', src: asset('jic-challenger-quad-duplex-room.webp') },
      { category: '住宿', title: '楼中楼客厅', description: '楼中楼四人间楼下的客厅和小厨房。', src: asset('jic-main-room-loft.webp') },
      { category: '住宿', title: '四人间（上下铺）', description: '两张上下铺。', src: asset('jic-challenger-quad-bunk-room.webp') },
      { category: '餐厅', title: '室内餐厅', description: '学生餐厅。', src: asset('jic-challenger-cafeteria-indoor.webp') },
      { category: '餐厅', title: '户外用餐区', description: '餐厅旁的半户外座位。', src: asset('jic-challenger-cafeteria-outdoor.webp') },
      { category: '餐厅', title: '学校餐', description: '一餐实拍，菜单每天不同。', src: asset('jic-challenger-meal-set.webp') },
      { category: '餐厅', title: '餐食', description: '学校餐食的菜品。', src: asset('jic-challenger-meal-variety.webp') },
      { category: '设施', title: '健身房', description: '跑步机和力量器械。', src: asset('jic-challenger-gym.webp') },
      { category: '设施', title: '运动场', description: '羽毛球等户外运动。', src: asset('jic-challenger-sports-court.webp') },
      { category: '设施', title: '校内超市', description: '零食、饮料和日用品。', src: asset('jic-challenger-campus-store.webp') },
      { category: '设施', title: '咖啡厅', description: '课后休息和聊天。', src: asset('jic-challenger-terminal-cafe.webp') },
      { category: '设施', title: '公共厨房', description: '可以简单做饭。', src: asset('jic-challenger-common-kitchen.webp') },
      { category: '设施', title: '公共厨房使用中', description: '学生在公共厨房做饭。', src: asset('jic-challenger-common-kitchen-use.webp') },
    ],
    albumDescriptions: {
      校园: '校园与户外休息区',
      教室: '一对一、团体教室和图书馆',
      住宿: '单人、双人和两种四人间',
      餐厅: '学生餐厅和餐食',
      设施: '健身房、运动场、超市和咖啡厅',
    },
    heroCategories: ['校园', '教室', '住宿'],
    videoTabs: [
      { label: '校园视频', videos: ['jic-challenger-campus-intro'] },
      { label: '宿舍视频', videos: ['jic-challenger-room-tour', 'jic-challenger-double-room-video', 'jic-challenger-quad-bunk-room-video', 'jic-challenger-quad-duplex-room-video'] },
      { label: '课程视频', videos: ['jic-challenger-class-observation'] },
      { label: '学员访谈', videos: ['jic-challenger-taiwan-story', 'jic-challenger-ielts-story', 'jic-challenger-speaking-story'] },
    ],
    videos: {
      'jic-challenger-campus-intro': video('jic-challenger-campus-intro', 'JIC Challenger 校区介绍', '学校官方介绍片：课堂、宿舍和校园生活。', '2:10'),
      'jic-challenger-class-observation': video('jic-challenger-class-observation', '老师听课评估', '学校安排专人进课堂听课，从教学方式、学生参与、课程结构和沟通四方面给老师反馈（英文字幕）。', '1:01'),
      'jic-challenger-taiwan-story': video('jic-challenger-taiwan-story', '中国台湾学员：A1到A2+', '英语基础很弱的中国台湾学员，讲为什么选 JIC、每天8节课的节奏和只说英语的难处（英文字幕）。', '4:15'),
      'jic-challenger-ielts-story': video('jic-challenger-ielts-story', '日本学员：雅思4.5到6.0', '在 Challenger 读雅思的日本学员，讲学习经历和出国工作的打算（英文字幕）。', '3:33'),
      'jic-challenger-speaking-story': video('jic-challenger-speaking-story', '日本学员：A2到B1', '日本学员讲来学英语的原因、学术顾问怎样鼓励他，结尾是他的毕业英文演讲（英文字幕）。', '2:58'),
      'jic-challenger-room-tour': video('jic-challenger-room-tour', '单人间', '单人间实拍（原片无配音）。', '0:37'),
      'jic-challenger-double-room-video': video('jic-challenger-double-room-video', '双人间', '双人间实拍（原片无配音）。', '0:41'),
      'jic-challenger-quad-bunk-room-video': video('jic-challenger-quad-bunk-room-video', '四人间（上下铺）', '上下铺四人间实拍（原片无配音）。', '0:39'),
      'jic-challenger-quad-duplex-room-video': video('jic-challenger-quad-duplex-room-video', '四人间（楼中楼）', '楼中楼四人间实拍（原片无配音）。', '0:51'),
    },
    roomVideos: {
      'challenger-single': 'jic-challenger-room-tour',
      'challenger-twin': 'jic-challenger-double-room-video',
      'challenger-quad-bunk': 'jic-challenger-quad-bunk-room-video',
      'challenger-quad-duplex': 'jic-challenger-quad-duplex-room-video',
    },
    roomProfiles: [
      room('challenger', 'challenger-single', '单人间', [asset('jic-challenger-single-room.webp')],
        '重视隐私、需要安静学习空间的学生', '一人一间。', ['独立无线网络', '可以安静自习']),
      room('challenger', 'challenger-twin', '双人间', [asset('jic-challenger-double-room.webp')],
        '朋友同行或想兼顾预算的学生', '两人一间。', ['独立无线网络']),
      room('challenger', 'challenger-quad-duplex', '四人间（楼中楼）', [asset('jic-challenger-quad-duplex-room.webp'), asset('jic-main-room-loft.webp')],
        '想住大一点空间、又控制预算的学生', '上下两层，楼下有客厅和小厨房。', ['上下两层', '有客厅']),
      room('challenger', 'challenger-quad-bunk', '四人间（上下铺）', [asset('jic-challenger-quad-bunk-room.webp')],
        '预算优先的学生', '两张上下铺，费用最低。', ['费用最低']),
    ],
    courseGroups: [
      {
        icon: 'workspace_premium', title: '雅思 IELTS', text: '保分班和三种强度',
        courseIds: ['challenger-ielts-guarantee', 'challenger-ielts-lite', 'challenger-ielts-core', 'challenger-ielts-standard'],
      },
      { icon: 'record_voice_over', title: '一般英语 ESL', text: '听说读写全面提升', courseIds: ['challenger-esl-lite', 'challenger-esl-core', 'challenger-esl-standard'] },
    ],
    courseHighlights: {
      'challenger-ielts-guarantee': { badge: '保分', label: '雅思保分', text: '连续8周，按入学成绩保目标分' },
    },
    courseDetailGuides: [
      {
        icon: 'workspace_premium', title: '雅思保分班', subtitle: 'IELTS Guarantee', courseIds: ['challenger-ielts-guarantee'],
        facts: [
          { label: '时长', value: '连续8周' },
          { label: '每天', value: '6节一对一＋2节团体课，全程斯巴达' },
          { label: '另交', value: '到校后18,000比索' },
        ],
        points: [
          '学费与雅思Standard相同，须连续读8周；到校符合入学成绩条件后向学校申请，并另交18,000比索。',
          '入学成绩4.0／5.5／6.0／6.5／7.0／7.5分别对应目标5.5／6.0／6.5／7.0／7.5／8.0；目标5.5–6.0可用JIC入学测试成绩，目标6.5–8.0须提供6个月内的官方雅思成绩。',
          '保分期间至少在碧瑶考一次官方机考雅思，毕业前至少1周考完并提交成绩；出勤（含模考）90%以上，每周模考都要参加，期间不能换课。',
          '遵守规定仍未达标，学校补助4周学费（不含住宿、餐食、水电、签证和考试费）；官方成绩比最后一次模考低1–1.5分以上时，学校可取消保分资格。',
        ],
      },
      {
        icon: 'menu_book', title: '按程度分教材', subtitle: 'Starter / Master · IB / IA', courseIds: [
          'challenger-ielts-lite', 'challenger-ielts-core', 'challenger-ielts-standard',
          'challenger-esl-lite', 'challenger-esl-core', 'challenger-esl-standard',
        ],
        facts: [
          { label: '雅思', value: '入学测试4.0以下用Starter教材，4.5以上用Master教材' },
          { label: '一般英语', value: 'PreA1–A2用IB教材，B1–C1用IA教材' },
        ],
        points: ['团体课最多10人；团体课不能改成一对一。', '斯巴达雅思学生每周六模考，半斯巴达每两周一次。'],
      },
      {
        icon: 'school', title: '上课与考试', subtitle: '所有课程通用',
        facts: [
          { label: '付费特别课', value: '每天07:00和17:00各30分钟，2,000比索／4周' },
          { label: '月考', value: '每4周的周五，当天不上课' },
        ],
        points: [
          '特别课有单词、新闻听力、打工度假、雅思机考模拟等主题，每两周在公告栏报名。',
          '教学区鼓励只说英语；斯巴达学生每两周有一次个人学习咨询。',
          '加课参考（每4周）：一般英语一对一6,500、主题一对一7,000、雅思一对一7,500、团体课3,500比索，按当时空位确定。',
        ],
      },
    ],
    studyModes: [
      {
        code: '斯巴达', name: '免费参加', title: '适合目标明确、想被学习节奏推着走的学生',
        contrastTitle: '斯巴达多出的学习时段',
        timeBlocks: [
          { label: '单字考试', time: '周一至周五 19:30–20:00', text: '必须参加', icon: 'spellcheck', type: 'required' },
          { label: '晚自习', time: '20:00–22:00', text: '在一对一教室或图书馆，老师监督，不能中途离开或请假', icon: 'edit_note', type: 'required' },
          { label: '模考', time: '每周六上午', text: '一般英语和雅思每周一次，考完可外出', icon: 'quiz', type: 'required' },
        ],
        curfew: [
          { day: '周一至周五', time: '17:00–19:00' },
          { day: '周六', time: '06:00–01:00' },
          { day: '周日', time: '06:00–22:00' },
        ],
      },
      {
        code: '半斯巴达', name: '偏自律', title: '适合自律、想要更多课后时间的学生',
        contrastTitle: '半斯巴达没有这些强制时段',
        timeBlocks: [
          { label: '晚上', time: '没有单字考试和晚自习', text: '自习时间和地点自己安排', icon: 'event_available', type: 'flexible' },
          { label: '模考', time: '每两周一次', text: '周六上午，必须参加', icon: 'quiz', type: 'flexible' },
          { label: '外出', time: '平日17:00–22:00', text: '课后可以外出', icon: 'directions_walk', type: 'flexible' },
        ],
        curfew: [
          { day: '周一至周五', time: '17:00–22:00' },
          { day: '周六', time: '06:00–01:00' },
          { day: '周日', time: '06:00–22:00' },
        ],
      },
    ],
    scheduleColumns: [
      {
        code: 'SEMI-SPARTA', title: '半斯巴达',
        rows: [
          row('07:00–07:50', '早餐（07:00–07:30付费特别课）', 'meal'),
          row('07:50–11:55', '上午5节课（每节45分钟）', 'class'),
          row('11:00–12:50', '午餐（按课表错开）', 'meal'),
          row('12:50–17:45', '下午6节课（17:00–17:30付费特别课）', 'class'),
          row('17:00–18:40', '晚餐', 'meal'),
          row('17:00–22:00', '课后自由安排，可外出', 'free'),
        ],
      },
      {
        code: 'SPARTA', title: '斯巴达',
        rows: [
          row('07:00–07:50', '早餐（07:00–07:30付费特别课）', 'meal'),
          row('07:50–11:55', '上午5节课（每节45分钟）', 'class'),
          row('11:00–12:50', '午餐（按课表错开）', 'meal'),
          row('12:50–17:45', '下午6节课（17:00–17:30付费特别课）', 'class'),
          row('17:00–18:40', '晚餐', 'meal'),
          row('19:30–20:00', '单字考试', 'test'),
          row('20:00–22:00', '晚自习（老师监督）', 'activity'),
        ],
      },
    ],
    scheduleIntro: '每节课45分钟，课程按各自的课表排在07:50–17:45之间；午餐时段按课表错开。',
    scheduleBadge: '斯巴达多出单字考试和晚自习',
    practicalGuides: [],
    compareRoomHint: '如单人间、双人间和两种四人间',
    compareCourseHint: '如雅思Lite、Core和Standard',
    faqs: [
      {
        question: 'Challenger 和 Premium 校区怎么选？',
        answer: 'Challenger 是学术校区，约130人，主打雅思和一般英语，一对一多，可选斯巴达；Premium 约160人，只有半斯巴达，口语、主题课和小组课更多，课后更自由。两个校区课程和住宿分开报价，不能混选。',
      },
      {
        question: '斯巴达和半斯巴达怎么选？可以换吗？',
        answer: '入学第一天自己选，斯巴达免费参加：平日晚上有单字考试和老师监督的晚自习，平日外出只到19:00，每周六模考。半斯巴达平日可外出到22:00，每两周模考一次。之后每两周可以在更换时限内申请换。',
      },
      TERM_FAQ,
      FEES_FAQ,
      OFFERS_FAQ,
      PEAK_FAQ,
      {
        question: '雅思保分班怎么报？',
        answer: '学费与雅思Standard相同，须连续读8周；到校符合入学成绩条件后向学校申请，并另交18,000比索。保分期间全程斯巴达，每周模考，至少在碧瑶考一次官方机考雅思。条件见课程说明。',
      },
      PICKUP_FAQ,
      MEALS_FAQ,
      RETURNING_FAQ,
    ],
  },
  premium: {
    shortName: 'JIC Premium',
    title: '菲律宾碧瑶 JIC Premium 高级校区',
    breadcrumb: '菲律宾游学 / 碧瑶学校 / JIC Premium',
    heroLead: '碧瑶的口语和生活英语校区：半斯巴达管理，课后更自由；口语、主题英语（TEP）、托业、商务和打工度假课程，每门课都有2节选修课。',
    heroTags: [
      { icon: 'location_on', text: '菲律宾碧瑶' },
      { icon: 'self_improvement', text: '半斯巴达，课后自由' },
      { icon: 'record_voice_over', text: '口语与主题英语' },
      { icon: 'sports_golf', text: '高尔夫练习场' },
    ],
    overviewTitle: '30 秒看懂 JIC Premium',
    advisorText: 'Premium 是 JIC 的交流型校区，约160名学生，只有半斯巴达：平日下午五点后可以外出，周五周六可到凌晨一点。课程以口语为主，也有旅游、烹饪、IT等25个主题的TEP、托业、商务和打工度假，还有40岁以上的银发课程；每门课都有素描、尊巴、唱歌等2节选修课。想要更严格的学习管理或冲雅思分数，可以看同一所学校的 Challenger 校区。',
    campusIntro: '教室、宿舍、餐厅、咖啡厅、学生中心和高尔夫练习场都在校内；晚上22:00后公共区域保持安静。',
    coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看说明。',
    finalCtaTitle: '想确认 JIC Premium 的空房和正式报价？',
    finalCtaText: '把入学日期、周数、课程目标和想住的房型发给顾问，我们帮你核对开学日、空房、优惠和到校费用。',
    overviewFacts: [
      { icon: 'location_on', label: '位置', value: '菲律宾碧瑶，气候凉爽' },
      { icon: 'groups', label: '规模', value: '约160名学生' },
      { icon: 'rule', label: '管理', value: '半斯巴达：周一至周四可外出到22:00，周五周六到01:00' },
      { icon: 'menu_book', label: '课程', value: '口语、主题英语TEP、托业、商务、打工度假、银发课程' },
      { icon: 'event', label: '入学', value: '每两周的周日开学，第二天入学测试' },
      { icon: 'bed', label: '住宿', value: '单人阳台房、单人雅房、双人间和四人间（有阳台／无阳台）' },
      { icon: 'interests', label: '选修', value: '每门课都有2节选修课，另有自费社团' },
      { icon: 'sports_golf', label: '设施', value: '健身房、高尔夫练习场、学生中心、舞蹈教室、咖啡厅' },
    ],
    quickInfo: [
      { icon: 'location_on', title: '菲律宾碧瑶', text: '山城气候凉爽' },
      { icon: 'self_improvement', title: '半斯巴达', text: '课后时间自己安排' },
      { icon: 'record_voice_over', title: '口语和主题课', text: '25个TEP主题可选' },
      { icon: 'interests', title: '选修课和社团', text: '素描、尊巴、唱歌等' },
    ],
    basicInfo: [
      { label: '学校', value: 'JIC Premium Campus（高级校区）' },
      { label: '位置', value: '菲律宾碧瑶' },
      { label: '规模', value: '约160名学生' },
      { label: '管理方式', value: '半斯巴达' },
      { label: '课程', value: '口语、TEP主题英语、托业、商务、打工度假、银发课程' },
      { label: '入学年龄', value: '一般课程18岁以上；银发课程40岁以上' },
    ],
    suitableFor: ['想多开口、练日常和旅行口语的人', '想边学边体验生活、课后时间更自由的成人', '想学职场、商务或打工度假英语的人', '40岁以上想轻松学英语的学生'],
    notSuitableFor: ['想冲雅思高分、需要斯巴达管理的人（可看 Challenger 校区）'],
    campusBuildings: [
      { code: 'STUDY', title: '教学区', icon: 'school', facilities: ['一对一教室和团体教室', '舞蹈教室', '24小时自习室'] },
      { code: 'DORM', title: '宿舍', icon: 'bed', facilities: ['单人阳台房', '单人雅房（第二宿舍）', '双人间、四人间（有阳台／无阳台）', '每间房有独立无线网络'] },
      { code: 'LIFE', title: '生活设施', icon: 'sports_golf', facilities: ['健身房、高尔夫练习场', '学生中心、按摩椅', '借用桌球、羽毛球、台球和高尔夫用具', '小卖部、洗衣房'] },
      { code: 'DINING', title: '餐厅与咖啡厅', icon: 'restaurant', facilities: ['学生餐厅', '平日三餐，周末早午餐', '校内咖啡厅'] },
    ],
    galleryImages: [
      { category: '校园', title: 'Premium 校区', description: 'Premium 校区的学习和生活环境。', src: asset('jic-premium-campus-overview.jpg') },
      { category: '校园', title: '校园一角', description: 'Premium 校区户外一角。', src: asset('jic-premium-single-no-balcony.webp') },
      { category: '教室', title: '小组课', description: '小组互动课堂。', src: asset('jic-premium-group-class.webp') },
      { category: '住宿', title: '单人阳台房', description: '带阳台的单人房。', src: asset('jic-premium-single-balcony.webp') },
      { category: '住宿', title: '双人间（阳台）', description: '带阳台的双人房。', src: asset('jic-premium-twin-balcony.webp') },
      { category: '住宿', title: '双人间（无阳台）', description: '没有阳台的双人房。', src: asset('jic-premium-twin-no-balcony.webp') },
      { category: '住宿', title: '四人间（阳台）', description: '带阳台的四人上下铺房。', src: asset('jic-premium-quad-balcony.webp') },
      { category: '住宿', title: '四人间（无阳台）', description: '没有阳台的四人上下铺房。', src: asset('jic-premium-quad-no-balcony.webp') },
      { category: '住宿', title: '四人间', description: '四人上下铺房，床位有帘子。', src: asset('jic-premium-quad-room.webp') },
      { category: '餐厅', title: '学校餐', description: '学校餐食，菜单每天不同。', src: asset('jic-premium-meal.webp') },
      { category: '餐厅', title: '咖啡厅', description: '课后休息和交流。', src: asset('jic-premium-cafe.webp') },
      { category: '设施', title: '学生中心', description: '学生中心和休息空间。', src: asset('jic-premium-student-center.webp') },
    ],
    albumDescriptions: {
      校园: 'Premium 校区环境',
      教室: '小组课堂',
      住宿: '单人、双人和四人间',
      餐厅: '学校餐和咖啡厅',
      设施: '学生中心',
    },
    heroCategories: ['校园', '住宿', '餐厅'],
    videoTabs: [
      { label: '校园视频', videos: ['jic-premium-campus-intro'] },
      {
        label: '宿舍视频', videos: [
          'jic-premium-single-balcony-video', 'jic-premium-room-tour', 'jic-premium-twin-balcony-video',
          'jic-premium-twin-no-balcony-video', 'jic-premium-quad-balcony-video', 'jic-premium-quad-no-balcony-video',
        ],
      },
      { label: '课程视频', videos: ['jic-premium-sketching-class', 'jic-premium-zumba-class'] },
      { label: '学员视频', videos: ['jic-premium-day-in-life', 'jic-premium-taiwan-story', 'jic-premium-graduation'] },
    ],
    videos: {
      'jic-premium-campus-intro': video('jic-premium-campus-intro', 'JIC Premium 校区介绍', '学校官方介绍片：课堂、宿舍和校园生活。', '2:27'),
      'jic-premium-sketching-class': video('jic-premium-sketching-class', '素描选修课', '每门课附带的选修课之一：学素描技巧、练观察，用画表达想法（英文字幕）。', '0:53'),
      'jic-premium-zumba-class': video('jic-premium-zumba-class', '尊巴选修课', '跟着音乐跳舞和做有氧操，不同体能的学生都能参加（英文字幕）。', '1:05'),
      'jic-premium-day-in-life': video('jic-premium-day-in-life', '日本学员的一天', '跟着 Premium 的日本学员过一天：宿舍、早餐、一对一和小组课、课后生活（英文字幕）。', '3:56'),
      'jic-premium-taiwan-story': video('jic-premium-taiwan-story', '中国台湾学员：从想家到适应', '中国台湾学员讲刚来时想家、和老师同学变熟，以及慢慢敢用英语表达自己（英文字幕）。', '3:28'),
      'jic-premium-graduation': video('jic-premium-graduation', '毕业证书颁发', 'Premium 校区的毕业日：颁发结业证书，和老师同学合影。', '0:53'),
      'jic-premium-single-balcony-video': video('jic-premium-single-balcony-video', '单人阳台房', '带阳台的单人房实拍（原片无配音）。', '2:36'),
      'jic-premium-room-tour': video('jic-premium-room-tour', '单人雅房', '第二宿舍单人雅房实拍（原片无配音）。', '1:41'),
      'jic-premium-twin-balcony-video': video('jic-premium-twin-balcony-video', '双人间（阳台）', '带阳台的双人房实拍（原片无配音）。', '2:06'),
      'jic-premium-twin-no-balcony-video': video('jic-premium-twin-no-balcony-video', '双人间（无阳台）', '没有阳台的双人房实拍（原片无配音）。', '1:23', 'tall'),
      'jic-premium-quad-balcony-video': video('jic-premium-quad-balcony-video', '四人间（阳台）', '带阳台的四人房实拍（原片无配音）。', '1:27'),
      'jic-premium-quad-no-balcony-video': video('jic-premium-quad-no-balcony-video', '四人间（无阳台）', '没有阳台的四人房实拍（原片无配音）。', '1:29', 'tall'),
    },
    roomVideos: {
      'premium-single-balcony': 'jic-premium-single-balcony-video',
      'premium-single-no-balcony': 'jic-premium-room-tour',
      'premium-twin-balcony': 'jic-premium-twin-balcony-video',
      'premium-twin-no-balcony': 'jic-premium-twin-no-balcony-video',
      'premium-quad-balcony': 'jic-premium-quad-balcony-video',
      'premium-quad-no-balcony': 'jic-premium-quad-no-balcony-video',
    },
    roomProfiles: [
      room('premium', 'premium-single-balcony', '单人阳台房', [asset('jic-premium-single-balcony.webp')],
        '重视隐私、想要阳台的学生', '一人一间，带阳台；有两种格局，由学校分配。', ['带阳台', '独立无线网络']),
      room('premium', 'premium-single-no-balcony', '单人雅房', [asset('jic-posters/jic-premium-room-tour.webp')],
        '想住单人间、又想控制预算的学生', '第二宿舍的单人房，卫浴、客厅和冰箱共用；男生一楼、女生二楼。', ['卫浴和客厅共用', '2027年淡季也有优惠']),
      room('premium', 'premium-twin-balcony', '双人间（阳台）', [asset('jic-premium-twin-balcony.webp')],
        '朋友同行、想要阳台的学生', '两人一间，带阳台。', ['带阳台']),
      room('premium', 'premium-twin-no-balcony', '双人间（无阳台）', [asset('jic-premium-twin-no-balcony.webp')],
        '朋友同行或想兼顾预算的学生', '两人一间，没有阳台。', ['比阳台房便宜']),
      room('premium', 'premium-quad-balcony', '四人间（阳台）', [asset('jic-premium-quad-balcony.webp')],
        '预算优先、想要阳台的学生', '两张上下铺，带阳台。', ['带阳台']),
      room('premium', 'premium-quad-no-balcony', '四人间（无阳台）', [asset('jic-premium-quad-no-balcony.webp')],
        '预算优先的学生', '两张上下铺，没有阳台，费用最低。', ['费用最低']),
    ],
    courseGroups: [
      {
        icon: 'record_voice_over', title: '口语', text: '从日常对话到逻辑表达',
        courseIds: ['premium-speaking-starter-7', 'premium-speaking-pro-8', 'premium-speaking-master-8'],
      },
      { icon: 'travel_explore', title: '主题英语 TEP', text: '旅游、烹饪、艺术、IT等主题', courseIds: ['premium-tep-8', 'premium-tep-9', 'premium-tep-10'] },
      {
        icon: 'business_center', title: '托业／商务／打工度假', text: '考试与职场英语',
        courseIds: ['premium-toeic', 'premium-business-master-8', 'premium-working-holiday-8'],
      },
      { icon: 'elderly', title: '银发课程', text: '40岁以上，每天课少', courseIds: ['premium-active-senior-5', 'premium-active-senior-6'] },
    ],
    courseHighlights: {},
    courseDetailGuides: [
      {
        icon: 'record_voice_over', title: '口语课程', subtitle: 'Speaking Starter / Pro / Master',
        courseIds: ['premium-speaking-starter-7', 'premium-speaking-pro-8', 'premium-speaking-master-8'],
        facts: [
          { label: 'Starter', value: '适合初学者，从单词表达过渡到完整句型和日常对话' },
          { label: 'Master', value: '每天6节一对一，练逻辑表达和发音纠正' },
        ],
        points: ['每两周一次简报（presentation），Starter 初学者可以不做；Pro 和 Master 需要自备笔记本电脑做PPT。', '读完 Starter 后可以接 Pro，再升到 Master。'],
      },
      {
        icon: 'travel_explore', title: '主题英语', subtitle: 'TEP 8 / 9 / 10', courseIds: ['premium-tep-8', 'premium-tep-9', 'premium-tep-10'],
        facts: [{ label: '主题', value: '25个，如旅游、烹饪、艺术、IT、医疗、人力资源' }],
        points: ['一对一课里有2节是自选主题课，其余练一般英语。', '适合初学者到中级（PreA1–B2）。'],
      },
      {
        icon: 'business_center', title: '商务英语', subtitle: 'Business Master 8', courseIds: ['premium-business-master-8'],
        facts: [{ label: '每天', value: '6节一对一＋2节选修课' }],
        points: ['每两周有一次必须完成的简报。'],
      },
      {
        icon: 'elderly', title: '银发课程', subtitle: 'Active Senior 5 / 6', courseIds: ['premium-active-senior-5', 'premium-active-senior-6'],
        facts: [{ label: '年龄', value: '40岁以上' }, { label: '每天', value: '3或4节一对一＋2节选修课' }],
        points: ['用专门的教材，从基础会话和常用单词学起，适合想退休后去旅行的人。', '课少，每天约3–4小时，其余时间可以自己安排。'],
      },
      {
        icon: 'school', title: '上课与考试', subtitle: '所有课程通用',
        facts: [
          { label: '选修课', value: '每门课都有2节，如素描、尊巴、唱歌，全英文' },
          { label: '月考', value: '每4周的周五，当天不上课' },
        ],
        points: [
          '团体课最多10人；另有自费社团活动。',
          '单字考试（19:00–20:00）登记后可以参加。',
          '加课参考（每4周）：一般英语一对一6,500、主题一对一7,000、团体课3,500比索，按当时空位确定。',
        ],
      },
    ],
    studyModes: [],
    scheduleColumns: [
      {
        code: 'DAY', title: '平日',
        rows: [
          row('07:00–07:50', '早餐', 'meal'),
          row('07:50–11:55', '上午5节课（每节45分钟）', 'class'),
          row('11:30–12:50', '午餐', 'meal'),
          row('12:50–17:45', '下午课程，16:20起是选修课', 'class'),
          row('17:30–18:40', '晚餐', 'meal'),
          row('19:00–20:00', '单字考试（登记参加）', 'test'),
        ],
      },
    ],
    scheduleIntro: '每节课45分钟，课程按各自的课表排在07:50–17:45之间；周一至周四17:00后可以外出到22:00。',
    scheduleBadge: '半斯巴达，课后自由',
    practicalGuides: [],
    compareRoomHint: '如阳台房和无阳台房、双人间和四人间',
    compareCourseHint: '如口语Starter、Pro和Master',
    faqs: [
      {
        question: 'Premium 和 Challenger 校区怎么选？',
        answer: 'Premium 约160人，只有半斯巴达，口语、主题课、小组课和选修课更多，课后更自由；Challenger 约130人，主打雅思和一般英语，一对一多，可选斯巴达。两个校区课程和住宿分开报价，不能混选。',
      },
      {
        question: 'Premium 的外出时间是几点？',
        answer: '周一至周四17:00–22:00，周五17:00到凌晨01:00，周六06:00到凌晨01:00，周日06:00–22:00。新生入学当天（周日）不能外出。',
      },
      TERM_FAQ,
      FEES_FAQ,
      OFFERS_FAQ,
      PEAK_FAQ,
      {
        question: '单人雅房和单人阳台房有什么不同？',
        answer: '单人阳台房是独立单人房，带阳台，有两种格局由学校分配；单人雅房在第二宿舍，房间一人一间，卫浴、客厅和冰箱和其他房间共用，男生一楼、女生二楼，价格便宜一些。',
      },
      PICKUP_FAQ,
      MEALS_FAQ,
      RETURNING_FAQ,
    ],
  },
};

/** Practical guides shared by both campuses; the campus line is added per page. */
export function jicPracticalGuides(campus: JicCampus): CampusPracticalGuide[] {
  const challenger = campus === 'challenger';
  return [
    {
      icon: 'event', eyebrow: 'ARRIVAL', title: '入学第一天',
      facts: [
        { label: '入住', value: '开学日周日12:00后' },
        { label: '周一', value: challenger ? '新生训练、校园导览、拍照和入学测试' : '合照、资料、入学测试、拍照和新生训练' },
      ],
      note: challenger
        ? '新生周日和周一不能外出，周日22:00点名；周一晚上发教材和课表。'
        : '新生周日不能外出；周二上午领教材，课表在学生网站公布。',
      points: ['到校时已过晚餐时间，学校会给一份点心、泡面、纸巾和水的迎新小礼包。'],
    },
    {
      icon: 'flight_land', eyebrow: 'PICKUP', title: 'BESA周日联合接机',
      facts: [
        { label: '马尼拉', value: '01:00、08:00、14:00、20:00，一号航站楼B6／三号航站楼B7' },
        { label: '克拉克', value: '周日12:00、17:00，周一01:30，3号候车区' },
        { label: '费用', value: '每人3,000比索' },
      ],
      note: '航班须比接机时间提前1小时以上落地；到碧瑶后换乘车辆去学校。eTravel入境登记由思达启航顾问帮你填写。',
    },
    {
      icon: 'flight_takeoff', eyebrow: 'GOING HOME', title: '结业回程',
      facts: [
        { label: 'BESA送机', value: '克拉克机场每人1,600比索，周五19:00或周六05:00出发，约3.5小时' },
        { label: '包车', value: '克拉克6,000、马尼拉13,000比索／车，最多7人' },
        { label: '巴士', value: '克拉克约450–670、马尼拉约740–880比索' },
      ],
      note: 'BESA送机须在前一周17:00前到办公室预订；退房是周六13:00前。',
    },
    {
      icon: 'restaurant', eyebrow: 'MEALS', title: '用餐时间',
      facts: [
        { label: '平日', value: challenger ? '早餐07:00–07:50、午餐11:00–12:50、晚餐17:00–18:40' : '早餐07:00–07:50、午餐11:30–12:50、晚餐17:30–18:40' },
        { label: '周末', value: '早午餐09:00–12:00（自助）' },
      ],
      note: '以韩式为主，午餐有水果；不提供素食餐，提前告知可准备白粥。用餐结束前10分钟开始收拾。',
    },
    {
      icon: 'celebration', eyebrow: 'DECEMBER 2026', title: '2026年12月放假与补课',
      facts: [
        { label: '放假', value: '12/24、12/25、12/30、12/31、1/1' },
        { label: '补课', value: '12/19（周六）、12/27（周日）、1/8（周五）' },
        { label: '新生入学', value: '12/13、12/27' },
      ],
      note: '结业日为12/11、12/23和2027/01/08；1月月考改在1/7晚上19:00–22:00。',
    },
    {
      icon: 'gavel', eyebrow: 'RULES', title: '校规要点',
      facts: [
        { label: '安静时间', value: '22:00后公共区域不得逗留，24小时自习室可用' },
        { label: '月考', value: '每4周的周五，当天不上课，必须参加' },
      ],
      note: '无故缺课、缺考、晚归或违反斯巴达规定会扣分或罚款，累计扣分会禁足；赌博、暴力、偷窃和吸毒会被立即退学。',
      points: ['外出过夜要提前交旅行计划。', '不能把餐厅的食物带出餐厅。'],
    },
  ];
}
