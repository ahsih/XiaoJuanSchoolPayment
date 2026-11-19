// Static text and data of the Burlington School page. Pure data (no Angular, DOM or `this`), so the
// WeChat mini program can reuse it later like cia-page-content.ts. Prices come from
// burlington-pricing.ts; facts come from the school's 2027 price list, 2027 group packages,
// brochure and the managing director's partner email (received 2026-11-19).
// Never add agent commission, and never publish the school's phone, email, WhatsApp, website or street
// address here (user decision 2026-11-19: students must enrol through Sida, not contact the school directly).
// Layout decisions (user, 2026-11-19): adult programmes come before the junior programme, no single
// headline price, each fact is stated once, and each section carries at most one "仅供参考" note.
import { SIDA_PHILIPPINES_CONSULTANTS, SidaConsultant } from '../../../../components/sida-consultants';
import {
  BURLINGTON_ADULT_COURSES,
  BURLINGTON_APARTMENT_ROOMS,
  BURLINGTON_HOMESTAY_PRICES,
  BURLINGTON_HOMESTAY_SUPPLEMENTS,
  BURLINGTON_JUNIOR_SEASONS,
  BURLINGTON_ONE_TO_ONE,
  BURLINGTON_FAST_TRACK,
  BURLINGTON_ONSITE_ROOMS,
  BURLINGTON_SUMMER_RESIDENCE,
} from './burlington-pricing';

export type BurlingtonGalleryCategory = '全部' | '校园' | '宿舍' | '食堂' | '课堂和活动' | '公寓' | '城堡';

export interface BurlingtonGalleryImage {
  category: Exclude<BurlingtonGalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
  /** A collage of photos already in its tab: shown under 全部 and on the page, not again in the tab. */
  coverOnly?: boolean;
}

export interface BurlingtonVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  src: string;
  poster: string;
  vertical: boolean;
  /** Which programme the video shows; adult and junior tags use their zone colour. */
  tag: { label: string; zone?: BurlingtonZone };
}

export type BurlingtonZone = 'adult' | 'junior';

const asset = (name: string) => `/assets/burlington/${name}.jpg`;
const video = (name: string) => ({ src: `/assets/burlington/videos/${name}.mp4`, poster: `/assets/burlington/videos/poster-${name}.jpg` });

export const BURLINGTON_PAGE_COPY = {
  breadcrumb: '海外游学 / 英国游学 / Burlington School',
  title: '伦敦 Burlington School',
  lead: 'Burlington School 1990年在伦敦创办，英国文化协会认证。校舍在伦敦南部 Balham，由老建筑翻新，上课、吃饭、住宿和社交都在同一栋楼里；学校还有自己的巴斯城堡，可以把伦敦学习和英格兰乡村体验连在一起。',
  tags: [
    { icon: 'school', text: '成人16岁以上 · 全年每周开课' },
    { icon: 'groups', text: '青少年11–17岁 · 四季项目' },
    { icon: 'restaurant', text: '校内食堂 · 每天现做三餐' },
    { icon: 'workspace_premium', text: 'Trinity 考试中心' },
  ],
  trustNote: '页面为2027年价格。正式报名以学校确认的学位、房间和当期价格为准。',
  sideCard: { title: 'Burlington School', text: '选项目、日期和住宿，马上算出费用。' },
};

/** One "仅供参考" note per section, placed at the end of the section it covers. */
const referenceNote = (subject: string) => `${subject}仅供参考，学校可能随时调整，以学校当期安排为准。`;
export const BURLINGTON_REFERENCE_NOTES = {
  adult: referenceNote('课程时间和社交活动'),
  accommodation: referenceNote('住宿规定、设施、食堂安排和寄宿家庭审核流程'),
  residence: referenceNote('公寓设施和服务'),
  junior: referenceNote('日程、活动和外出规定'),
  about: '学校规模、学生国籍和设施仅供参考，以学校当期情况为准。',
};

/** Section headings, in page order. */
export const BURLINGTON_SECTIONS = {
  programmes: {
    eyebrow: '项目和价格 · 2027年',
    title: '三类项目，先按年龄和时间选',
    intro: '16岁以上可以报成人课程（全年开课）或成人暑期公寓套餐；11–17岁可以报青少年项目。16–17岁两类都能报，可以先对比再定。',
  },
  highlights: { eyebrow: '学校亮点', title: '为什么推荐 Burlington？' },
  fit: { eyebrow: '适合 / 需要考虑', title: '先判断 Burlington 是不是你的优先选择' },
  ageTable: { title: '按年龄看能报什么、住哪里' },
  gallery: { eyebrow: '图片', title: '校舍、宿舍、食堂、公寓和城堡', intro: '校舍由老建筑翻新；成人暑期公寓和巴斯城堡的照片也在这里。' },
  videos: { eyebrow: '视频', title: '看看学生在 Burlington 的一天', intro: '学校介绍、成人和青少年项目、公寓和城堡的实拍视频。' },
  // Sections inside a programme zone carry the zone pill (成人项目 / 青少年项目) before their eyebrow.
  adult: {
    zone: 'adult' as BurlingtonZone,
    eyebrow: '课程和学费',
    title: '标准课、强化课、速成课和一对一',
    intro: '零基础到C2都有班，雅思和剑桥考试备考需达到B1。学费按报名总周数分档，报得越久每周越便宜。',
  },
  accommodation: {
    zone: 'adult' as BurlingtonZone,
    eyebrow: '住宿和餐食',
    title: '校内宿舍、寄宿家庭和公寓',
    intro: '成人课程按周单独订住宿，下面是每周价格。',
  },
  residence: {
    zone: 'adult' as BurlingtonZone,
    eyebrow: '暑期公寓套餐 · 2027年6月27日–8月22日',
    title: '16岁以上，课程＋公寓单人间一次包好',
    intro: '住在 iQ Vega 公寓，每人一间卧室。报的周数越多，每周越便宜。',
  },
  castle: { eyebrow: '巴斯城堡体验 · 成人和青少年都可参加', title: '在城堡住两晚，游览巴斯和英格兰乡村' },
  quote: { eyebrow: '在线报价', title: '选项目、日期和住宿，马上算出费用', intro: '算好后可以直接保存报价图片，发给家人一起看。' },
  fees: { eyebrow: '其他费用', title: '注册、教材、接送机和交通' },
  about: { eyebrow: '学校资料', title: 'Burlington School 基本资料' },
  faq: { eyebrow: '报名前常见问题', title: '报名 Burlington 前，先确认这些' },
  service: {
    eyebrow: '为什么选择思达启航',
    title: '从选方案到学成回国，思达全程跟进',
    intro: '报名 Burlington 不只是交一份报名表。思达从帮你选方案开始，到了英国也一直和学校保持沟通，直到学习结束、学生回国，服务才算结束。',
  },
};

/** Sub-headings and table columns inside the sections, shared with the mini program page. */
export const BURLINGTON_LABELS = {
  ageColumns: ['入学时年龄', '可以报的项目', '可以住哪里'],
  fitSuitable: '适合优先考虑',
  fitLessSuitable: '可能需要再比较',
  courseFacts: { hours: '课时', time: '时间', price: '学费' },
  tiers: { title: '标准课程和强化课程：按报名总周数分档', columns: ['报名周数', '标准课程（每周15小时）', '强化课程（每周22.5小时）', '举例'] },
  adultDay: '成人一天的安排',
  onsite: '校内宿舍（16岁以上）',
  dining: '校内食堂',
  apartment: 'Wandsworth 公寓（18岁以上）',
  homestay: '寄宿家庭（16岁以上）：两种有什么区别',
  homestayPrices: { title: '寄宿家庭每周价格', columns: ['类型', '不含餐', '含早餐', '含早晚餐'] },
  homestayVetting: '精选寄宿家庭怎么审核',
  residencePrices: { title: '套餐价格（每人每周，以下内容全部包含）', columns: ['报名周数', '每周价格', '总价'] },
  residenceIncludes: '每周价格已包含',
  juniorSeasons: { title: '青少年项目：各季节日期和每周价格', columns: ['季节', '日期', '周数', '只上课', '宿舍或寄宿家庭全包', '巴斯城堡加购'] },
  juniorIncludes: { title: '青少年项目：三种住宿方式包含什么', firstColumn: '内容' },
  juniorDay: '青少年住校的一天（示例）',
  juniorProjects: '青少年项目课做什么',
  juniorSafety: '青少年安全和外出规定',
};

/**
 * The adult and junior programmes are separate page zones with their own colour and banner, so a
 * reader always knows which programme a timetable, room or price belongs to (user review 2026-11-19).
 * Banners are text only: the user found photos and small vertical videos inside them cramped, so
 * every video stays in the video section with a programme tag instead.
 */
export const BURLINGTON_ZONES = {
  adult: {
    id: 'adult-zone',
    label: '成人项目',
    age: '16岁以上',
    title: '成人项目：上午上课，全年每周一开课',
    text: '这一部分是成人课程、成人住宿和暑期公寓套餐。成人上午小班上课，下午参加学校社交活动或自己逛伦敦；青少年项目的安排不同，在后面单独介绍。',
    facts: ['最短1周，报得越久每周越便宜', '校内宿舍、寄宿家庭或公寓任选', '报满4周送巴斯城堡两晚'],
    links: [
      { label: '课程和学费', target: 'adult' },
      { label: '住宿和餐食', target: 'accommodation' },
      { label: '暑期公寓套餐', target: 'summer-residence' },
    ],
  },
  junior: {
    id: 'junior',
    label: '青少年项目',
    age: '11–17岁',
    title: '青少年项目：课程、住宿、三餐和出游一次包好',
    text: '这一部分只介绍青少年项目，和成人项目的安排不同：春、夏、秋、冬四季开课，最短1周，英语需达到A2；上午由员工带队游览伦敦，下午14:45–17:30上项目式英语课。注册费55英镑另付。',
    facts: ['住学校宿舍（11岁起）或寄宿家庭（14岁起）', '每天三餐、每周5次半日游和周六全天出游', '宿舍有员工24小时住校照看'],
    links: [
      { label: '季节和价格', target: 'junior-seasons' },
      { label: '包含内容', target: 'junior-includes' },
      { label: '一天的安排', target: 'junior-day' },
    ],
  },
};

export const BURLINGTON_GALLERY_CATEGORIES: BurlingtonGalleryCategory[] =['全部', '校园', '宿舍', '食堂', '课堂和活动', '公寓', '城堡'];

export const BURLINGTON_GALLERY: BurlingtonGalleryImage[] = [
  { category: '校园', title: '学校主楼和庭院', description: '学校主楼前的露天庭院。', src: asset('campus-courtyard') },
  { category: '校园', title: '学校外观', description: '由老建筑翻新的校舍，门口就是学校名牌。', src: asset('campus-exterior') },
  { category: '校园', title: '校内花园', description: '校舍里的户外花园和座位区。', src: asset('campus-garden') },
  { category: '校园', title: '公共休息区', description: '有沙发、电视和乒乓球台。', src: asset('campus-games-room') },
  { category: '校园', title: '学生休息室', description: '带书架和沙发的休息室。', src: asset('campus-lounge') },
  { category: '校园', title: '自习室', description: '安静的自习空间，可以复习和写作业。', src: asset('campus-study-room') },
  { category: '宿舍', title: '校内多人间', description: '带玫瑰花窗的多人间，青少年住校项目住3–6人间。', src: asset('residence-dorm-hero') },
  { category: '宿舍', title: '6人间', description: '上下铺，每张床有编号。', src: asset('residence-dorm') },
  { category: '宿舍', title: '双人间', description: '成人可选，上下铺，有共用或独立卫生间。', src: asset('residence-twin') },
  { category: '宿舍', title: '单人间', description: '成人可选，有共用或独立卫生间。', src: asset('residence-single') },
  { category: '宿舍', title: '豪华单人间', description: '带独立卫生间的大房间。', src: asset('residence-deluxe') },
  { category: '宿舍', title: '卫生间', description: '校内宿舍的淋浴卫生间。', src: asset('residence-bathroom') },
  // Collage of the breakfast, hot-dish, salad-bar and dessert photos below.
  { category: '食堂', title: '校内食堂', description: '早餐、现做热菜、沙拉吧和甜点，厨房每天现做。', src: asset('dining-collage'), coverOnly: true },
  { category: '食堂', title: '用餐区', description: '老建筑翻新的用餐区，早、午、晚三餐都开。', src: asset('dining-coffee-bar') },
  { category: '食堂', title: '早餐', description: '食堂的早餐。', src: asset('dining-breakfast') },
  { category: '食堂', title: '午餐', description: '每天有几种热菜可选。', src: asset('dining-lunch') },
  { category: '食堂', title: '晚餐', description: '晚餐也是现做的热菜。', src: asset('dining-dinner') },
  { category: '食堂', title: '沙拉吧', description: '自助沙拉。', src: asset('dining-salad') },
  { category: '食堂', title: '现做热食', description: '鸡肉、牛肉和羊肉为清真，有素食选择。', src: asset('dining-chef') },
  { category: '食堂', title: '甜点', description: '食堂每天做的甜点。', src: asset('dining-dessert') },
  { category: '课堂和活动', title: '小班课堂', description: '成人每班最多18人；青少年平均每班15人。', src: asset('campus-classroom') },
  { category: '课堂和活动', title: '青少年项目课', description: '分组完成主题项目，周五做展示。', src: asset('yl-classroom-project') },
  { category: '课堂和活动', title: '课堂讨论', description: '项目式学习，练口语和合作。', src: asset('yl-classroom') },
  { category: '课堂和活动', title: '大英博物馆', description: '青少年上午出游，员工带队。', src: asset('yl-group-museum') },
  { category: '课堂和活动', title: '伦敦塔桥', description: '伦敦塔和塔桥徒步。', src: asset('yl-tower-bridge') },
  { category: '课堂和活动', title: '伦敦街头', description: '在红色电话亭前合影。', src: asset('yl-phone-box') },
  { category: '课堂和活动', title: '泰晤士河边', description: '出游时沿河散步。', src: asset('yl-thames') },
  { category: '课堂和活动', title: '课余时间', description: '公共区的乒乓球台和沙发。', src: asset('campus-common-room') },
  { category: '公寓', title: 'iQ Vega 公寓卧室', description: '成人暑期公寓套餐，每人一间卧室。', src: asset('iq-vega-bedroom') },
  { category: '公寓', title: '卧室书桌', description: '卧室里有书桌和收纳。', src: asset('iq-vega-desk') },
  { category: '公寓', title: '公寓厨房', description: '3间卧室共用1个厨房，学校提供餐具、锅和电水壶。', src: asset('iq-vega-kitchen') },
  { category: '公寓', title: '公寓卫生间', description: '3间卧室共用2个卫生间，学校每周清洁。', src: asset('iq-vega-bathroom') },
  { category: '公寓', title: '空中休息室', description: '高层休息室，可以看伦敦夜景。', src: asset('iq-vega-sky-lounge') },
  { category: '公寓', title: '游戏室', description: '有台球和桌上足球。', src: asset('iq-vega-games') },
  { category: '公寓', title: '健身房', description: '公寓套餐含健身房会员。', src: asset('iq-vega-gym') },
  { category: '城堡', title: '巴斯城堡', description: '学校自有的城堡，离巴斯约11公里，有四英亩草坪和林地。', src: asset('castle-exterior') },
  { category: '城堡', title: '城堡学生房', description: '2–4人一间，房间带卫生间。', src: asset('castle-shared-room') },
  { category: '城堡', title: '城堡客房', description: '城堡里的双人床客房。', src: asset('castle-bedroom') },
  { category: '城堡', title: '城堡客厅', description: '城堡里的客厅。', src: asset('castle-living-room') },
  { category: '城堡', title: '林间用餐', description: '在城堡林地里用餐。', src: asset('castle-woodland-dining') },
  { category: '城堡', title: '草坪瑜伽', description: '城堡活动之一。', src: asset('castle-garden-yoga') },
  { category: '城堡', title: '户外项目', description: '在城堡户外做英语项目。', src: asset('castle-outdoor-project') },
  { category: '城堡', title: '篝火夜', description: '围着篝火烤棉花糖。', src: asset('castle-firepit') },
  { category: '城堡', title: '露天电影', description: '在城堡草坪上看露天电影。', src: asset('castle-outdoor-cinema') },
];

/** Photos shown under 全部: a few per category; the tabs show every photo. */
export const BURLINGTON_GALLERY_FEATURED = ['campus-courtyard', 'campus-games-room', 'residence-dorm-hero', 'residence-single', 'dining-collage', 'dining-lunch', 'yl-classroom-project', 'yl-group-museum', 'iq-vega-bedroom', 'castle-exterior', 'castle-shared-room', 'castle-woodland-dining'];

/** Complete school videos, transcoded to 720p H.264 and loaded only when played. */
export const BURLINGTON_VIDEOS: BurlingtonVideo[] = [
  { id: 'school-promo', title: '学校宣传片', description: '伦敦、校园、宿舍、食堂和课堂，一分钟看完学校。', duration: '0:48', vertical: false, tag: { label: '学校介绍' }, ...video('school-promo') },
  { id: 'school-film', title: '学校完整介绍', description: '学校介绍片（无声），包括课堂、住宿、学生活动和城堡。', duration: '4:33', vertical: false, tag: { label: '学校介绍' }, ...video('school-film') },
  { id: 'campus-food', title: '校园和餐饮', description: '校舍、食堂和每天的餐食。', duration: '0:38', vertical: true, tag: { label: '校园生活' }, ...video('campus-food') },
  { id: 'social-programme', title: '伦敦社交活动', description: '学校员工带学生游览伦敦。', duration: '1:28', vertical: true, tag: { label: '成人项目', zone: 'adult' }, ...video('social-programme') },
  { id: 'iq-vega', title: 'iQ Vega 公寓', description: '卧室、健身房和空中休息室。', duration: '0:35', vertical: true, tag: { label: '成人暑期公寓', zone: 'adult' }, ...video('iq-vega') },
  { id: 'young-learners', title: '青少年项目的一天', description: '早餐、上午出游、下午上课和晚间活动。', duration: '0:35', vertical: true, tag: { label: '青少年项目', zone: 'junior' }, ...video('young-learners') },
  { id: 'bath-castle', title: '巴斯城堡体验', description: '城堡、巴斯游览、林间用餐和篝火。', duration: '0:58', vertical: true, tag: { label: '巴斯城堡' }, ...video('bath-castle') },
  { id: 'student-story', title: '学生分享', description: '在校学生讲她在 Burlington 的学习和生活（英文字幕）。', duration: '1:28', vertical: true, tag: { label: '学生分享' }, ...video('student-story') },
];

const juniorSeason = (id: string) => BURLINGTON_JUNIOR_SEASONS.find(season => season.id === id)!;
const dateRange = (start: string, end: string) => {
  const [y1, m1, d1] = start.split('-').map(Number);
  const [y2, m2, d2] = end.split('-').map(Number);
  return y1 === y2 ? `${y1}年${m1}月${d1}日–${m2}月${d2}日` : `${y1}年${m1}月${d1}日–${y2}年${m2}月${d2}日`;
};
const money = (value: number) => value.toLocaleString('en-US');
const residenceRates = BURLINGTON_SUMMER_RESIDENCE.tiers.map(tier => tier.rate);
const standard = BURLINGTON_ADULT_COURSES[0];
const intensive = BURLINGTON_ADULT_COURSES[1];
const rateRange = (rates: number[]) => `${Math.min(...rates)}–${Math.max(...rates)}`;

/** The three programmes, adults first; each card links to its detailed section. */
export const BURLINGTON_PROGRAMME_CARDS = [
  {
    zone: 'adult' as BurlingtonZone,
    type: '成人 · 16岁以上',
    name: '成人英语课程',
    dates: '全年每周一开课，最短1周',
    price: `标准课程每周${standard.tiers[0].rate}英镑`,
    sub: `1–4周的价格；5周起每周${standard.tiers[1].rate}英镑，报得越久越便宜。住宿另选。`,
    points: ['上午上课：标准课08:45–12:15，强化课到14:35', '通用英语、雅思备考、剑桥考试备考', '报满4周送巴斯城堡两晚'],
    target: 'adult',
    action: '看成人课程和价格',
  },
  {
    zone: 'adult' as BurlingtonZone,
    type: '成人 · 16岁以上 · 暑期',
    name: '成人暑期公寓套餐',
    dates: `${dateRange(BURLINGTON_SUMMER_RESIDENCE.start, BURLINGTON_SUMMER_RESIDENCE.end)}，2–8周`,
    price: `每周${rateRange(residenceRates)}英镑`,
    sub: '课程、公寓单人间、工作日午餐和活动都含，报得越久每周越便宜。',
    points: ['iQ Vega 公寓单人间，学校员工同住', '坐地铁约25分钟到学校，员工带学生上学', '报满4周含巴斯城堡两晚'],
    target: 'summer-residence',
    action: '看公寓套餐',
  },
  {
    zone: 'junior' as BurlingtonZone,
    type: '青少年 · 11–17岁',
    name: '青少年项目',
    dates: '春季、暑期、秋季、冬季开课，最短1周',
    price: `每周${money(juniorSeason('spring').prices.residence)}–${money(juniorSeason('summer').prices.residence)}英镑`,
    sub: `暑期每周${money(juniorSeason('summer').prices.residence)}英镑，春秋冬季每周${money(juniorSeason('spring').prices.residence)}英镑；课程、住宿、三餐和出游都含。`,
    points: ['上午员工带队出游，下午上英语课', '住学校宿舍（11岁起）或寄宿家庭（14岁起）', '巴斯城堡两晚可以加购'],
    target: 'junior',
    action: '看青少年项目',
  },
];

export const BURLINGTON_HIGHLIGHTS = [
  { icon: 'apartment', title: '上课、吃饭、住宿在同一栋楼', text: '教室、食堂、宿舍和休息室都在校舍里。住校内宿舍的学生不用每天通勤，下课就能回房间休息。' },
  { icon: 'restaurant', title: '校内食堂，三餐现做', text: '厨房每天现做早、午、晚三餐，有沙拉吧和甜点，肉类清真，也有素食。住校内宿舍含工作日早晚餐和周末早餐，在伦敦能省下不少吃饭的钱和时间。' },
  { icon: 'schedule', title: '成人上午上课，小班教学', text: '标准课程08:45–12:15，每班最多18人、平均12人；下午参加学校社交活动，或者自己逛伦敦。全年每周一开课，最短1周。' },
  { icon: 'workspace_premium', title: '圣三一（Trinity）考试中心', text: '学校2011年起是 Trinity College London 注册考试中心，可以在熟悉的学校参加圣三一英语考试（考试类型和日期提前跟学校确认）；另有雅思和剑桥考试备考课。' },
  { icon: 'castle', title: '自有巴斯城堡', text: '成人课程报满4周免费送城堡两晚；游览巴斯、巨石阵和科茨沃尔德小镇，体验英格兰乡村。' },
  { icon: 'train', title: '交通方便的伦敦社区', text: '学校在伦敦南部 Balham，步行5分钟到地铁和地上铁站，约15分钟到市中心；附近有公园、商业街和带泳池的体育中心。' },
];

/** `junior` marks items about younger students; the mini program lists them after the adult ones. */
export const BURLINGTON_FIT: { suitable: Array<{ title: string; text: string; junior?: boolean }>; lessSuitable: Array<{ title: string; text: string; junior?: boolean }> } = {
  suitable: [
    { title: '想上午上课、下午逛伦敦的成人', text: '16岁以上全年每周一开课，最短1周；住校内宿舍含工作日早晚餐，吃住都在学校。' },
    { title: '第一次出国的11–17岁学生', text: '课程、住宿、三餐和出游一次包好；住学校宿舍有员工照看，外出有员工带队。', junior: true },
    { title: '准备雅思、剑桥或圣三一考试', text: '有雅思和剑桥考试备考课（雅思需达到B1）；学校是圣三一（Trinity）考试中心，可以在学校参加考试。' },
    { title: '暑期想住单人间的成人', text: '成人暑期公寓套餐住 iQ Vega 单人间，含工作日午餐和健身房，学校员工也住在公寓。' },
  ],
  lessSuitable: [
    { title: '预算比较紧', text: '英国游学整体费用较高，同样周数可以同时比较菲律宾、马来西亚等方案。' },
    { title: '希望孩子上午上课', text: '青少年项目上午出游、下午上课；16–17岁可以改报成人课程，上午上课。', junior: true },
    { title: '想上大量一对一', text: `Burlington 以小班为主，一对一每小时${BURLINGTON_ONE_TO_ONE.rate}英镑另付。` },
    { title: '不到11岁的孩子', text: '青少年项目从11岁开始，更小的孩子需要另找亲子项目。', junior: true },
    { title: '暑期临时才报名', text: '暑期是最热门的时段，宿舍和寄宿家庭都要尽早确认。' },
  ],
};

/** Every adult course type in one place, including Fast Track and one-to-one lessons. */
export const BURLINGTON_ADULT_COURSE_TYPES = [
  {
    name: '标准课程', english: 'Standard Course', hours: '每周15小时（20节）', time: '08:45–12:15',
    price: `每周${rateRange(standard.tiers.map(tier => tier.rate))}英镑`,
    note: '主课＋听说工作坊。可选通用英语、雅思备考或剑桥考试备考；按报名总周数分档，见下表。',
  },
  {
    name: '强化课程', english: 'Intensive Course', hours: '每周22.5小时（30节）', time: '08:45–14:35',
    price: `每周${rateRange(intensive.tiers.map(tier => tier.rate))}英镑`,
    note: '标准课程再加读写、语法词汇两个工作坊，适合想多上课的学生；同样按总周数分档。',
  },
  {
    name: 'Fast Track 速成课', english: 'Fast Track English', hours: '每周20节小班课＋5次1小时迷你课程', time: '上午小班课，迷你课程另排',
    price: `${BURLINGTON_FAST_TRACK}英镑`,
    note: '小班课和标准课程一样；迷你课程按个人需要安排一对一或小组辅导，由学校教学团队和学生沟通后定制。具体安排和价格请咨询顾问。',
  },
  {
    name: '一对一课程', english: 'One-to-One', hours: '按小时', time: '全天可约',
    price: `每小时${BURLINGTON_ONE_TO_ONE.rate}英镑`,
    note: `${BURLINGTON_ONE_TO_ONE.discountFromHours}小时以上每小时${BURLINGTON_ONE_TO_ONE.discountedRate}英镑。可以单独上，也可以加在小班课程之外。`,
  },
];

export const BURLINGTON_ADULT_TIER_ROWS = standard.tiers.map((tier, index) => {
  const weeks = tier.maxWeeks === null ? `${tier.minWeeks}周以上` : `${tier.minWeeks}–${tier.maxWeeks}周`;
  const exampleWeeks = tier.maxWeeks ?? 36;
  return {
    weeks,
    standard: `${tier.rate}英镑/周`,
    intensive: `${intensive.tiers[index].rate}英镑/周`,
    example: `${exampleWeeks}周：标准课${money(tier.rate * exampleWeeks)}英镑`,
  };
});

export const BURLINGTON_ADULT_NOTES = [
  `整段课程都按总周数对应的档位计价，例如报5周，5周都按每周${standard.tiers[1].rate}英镑算。另收注册费55英镑、教材每学期45英镑；订住宿再加住宿预订费55英镑。`,
  '2027年英国法定假日（3月29日、5月3日、5月31日、8月30日）那一周改为周二开课；12月20日–31日圣诞停课。学校也有线上课程，价格另询。',
];

export const BURLINGTON_ADULT_TIMETABLE = [
  { time: '08:00', title: '早餐', text: '住校内宿舍的学生在学校食堂吃早餐。' },
  { time: '08:45', title: '主课', text: '通用英语、雅思备考或剑桥考试备考，到11:15。' },
  { time: '11:30', title: '听说工作坊', text: '练发音、口语和听力，到12:15。标准课程到这里结束。' },
  { time: '12:15', title: '午餐', text: '食堂午餐时间（校内宿舍房费不含午餐）。' },
  { time: '13:00', title: '读写工作坊', text: '强化课程才有，到13:45。' },
  { time: '13:50', title: '语法词汇工作坊', text: '强化课程才有，到14:35。' },
  { time: '14:45', title: '成人社交活动', text: '周一至周五下午，例如威斯敏斯特徒步、大英博物馆、自然历史博物馆、科文特花园；部分活动要买票，周六一日游（如牛津、坎特伯雷、汉普顿宫）约20–40英镑。' },
];

/** Who can live where, by age: answers "where do students under 16 stay?". */
export const BURLINGTON_AGE_STAY = [
  { age: '11–13岁', programme: '青少年项目', stay: '学校宿舍（3–6人间），或只上课不住宿' },
  { age: '14–15岁', programme: '青少年项目', stay: '学校宿舍或寄宿家庭，或只上课不住宿' },
  { age: '16–17岁', programme: '青少年项目或成人课程', stay: '青少年项目：学校宿舍或寄宿家庭。成人课程：校内宿舍或寄宿家庭，每周都加30英镑，寄宿家庭必须含早晚餐。暑期也可以选成人公寓套餐。' },
  { age: '18岁以上', programme: '成人课程', stay: '校内宿舍、寄宿家庭或 Wandsworth 公寓；暑期也可以选成人公寓套餐。' },
];

export const BURLINGTON_DINING = [
  '早餐、午餐、晚餐都开，白天还有小吃和咖啡。',
  '厨房每天现做，有汤、热菜、素食、沙拉吧和甜点。',
  '鸡肉、牛肉和羊肉都是清真，有素食和纯素选择。',
  '住校内宿舍：周一至周五早餐和晚餐、周六日早餐已含在房费里。',
];

/** One row of four dishes (breakfast, hot dinner dishes, salad bar, brownies) for the canteen card. */
export const BURLINGTON_DINING_STRIP = asset('dining-strip');

export const BURLINGTON_ONSITE_ROWS = BURLINGTON_ONSITE_ROOMS.map(room => ({ name: room.name, price: `${room.price}英镑/周` }));
export const BURLINGTON_APARTMENT_ROWS = BURLINGTON_APARTMENT_ROOMS.map(room => ({ name: room.name, price: `${room.price}英镑/周` }));
export const BURLINGTON_HOMESTAY_ROWS = (['standard', 'collection'] as const).flatMap(tier =>
  (['single', 'twin'] as const).map(room => ({
    name: `${tier === 'standard' ? '标准寄宿家庭' : '精选寄宿家庭'} ${room === 'single' ? '单人间' : '双人间'}`,
    self: `${BURLINGTON_HOMESTAY_PRICES[tier][room].self}英镑`,
    bb: `${BURLINGTON_HOMESTAY_PRICES[tier][room].bb}英镑`,
    hb: `${BURLINGTON_HOMESTAY_PRICES[tier][room].hb}英镑`,
  })));
export const BURLINGTON_HOMESTAY_SUPPLEMENT_ROWS = [
  { label: '独立卫生间', value: `${BURLINGTON_HOMESTAY_SUPPLEMENTS.privateBathroom}英镑/周` },
  { label: '特殊饮食', value: `${BURLINGTON_HOMESTAY_SUPPLEMENTS.specialDiet}英镑/周` },
  { label: '暑期附加费（6月13日–8月29日）', value: `${BURLINGTON_HOMESTAY_SUPPLEMENTS.summer}英镑/周` },
  { label: '16/17岁（必须选含早晚餐）', value: `${BURLINGTON_HOMESTAY_SUPPLEMENTS.minor}英镑/周` },
];

const homestayGap = BURLINGTON_HOMESTAY_PRICES.collection.single.hb - BURLINGTON_HOMESTAY_PRICES.standard.single.hb;
/** Standard Homestay versus Burlington Homestay Collection. */
export const BURLINGTON_HOMESTAY_TYPES = [
  { name: '标准寄宿家庭', text: '舒适实惠的伦敦寄宿家庭，部分由学校合作的寄宿家庭机构安排。' },
  { name: '精选寄宿家庭', text: `Burlington Homestay Collection：学校自己挑选、上门审核的房东，看重接待质量和到学校的交通，每周比标准寄宿家庭贵${homestayGap}英镑。` },
];

export const BURLINGTON_ACCOMMODATION_NOTES = {
  onsite: '和教室、食堂在同一栋楼。周一至周五含早餐和晚餐，周六日含早餐；16/17岁每周加30英镑。提供床单，毛巾需自备或另付；每天清洁。',
  apartment: '学校自有，可订2–24周。伦敦2区的学生公寓，靠近泰晤士河，坐公共交通到学校约30分钟；2间卧室带独立卫生间，3间共用2个卫生间；有厨房和花园，不含餐；水电网费和清洁都含，学校员工住在公寓。',
  homestay: '两种都提供床单和毛巾、每周清洁，每个寄宿家庭最多4名学生。',
};

/** Burlington Homestay Collection vetting steps from the school's 2026 homestay presentation. */
export const BURLINGTON_HOMESTAY_VETTING = [
  '房东要提交护照、协议、DBS无犯罪记录审查和两份推荐信。',
  '学校上门检查：燃气安全证书、一氧化碳和烟雾报警器、房间采光、通风和暖气、书桌和衣柜。',
  '还会看社区是否安全、到学校的路线是否方便；房东要接受安全保护培训。',
];

/** Every weekly tier of the summer residence with its totals, so the price reads as one table. */
export const BURLINGTON_SUMMER_RESIDENCE_TIER_ROWS = BURLINGTON_SUMMER_RESIDENCE.tiers.map((tier, index, tiers) => {
  const maxWeeks = index + 1 < tiers.length ? tiers[index + 1].minWeeks - 1 : 8;
  const weeks = Array.from({ length: maxWeeks - tier.minWeeks + 1 }, (_, offset) => tier.minWeeks + offset);
  return {
    weeks: `${tier.minWeeks}–${maxWeeks}周`,
    rate: `${tier.rate}英镑/周`,
    totals: weeks.map(count => `${count}周共${money(tier.rate * count)}英镑`).join(' · '),
  };
});

export const BURLINGTON_SUMMER_RESIDENCE_INCLUDES = [
  { title: '课程', items: ['标准课程每周15小时：主课08:45–11:15＋听说工作坊11:30–12:15', '可选通用英语、雅思备考或剑桥考试备考', '注册费、教材和结业证书'] },
  { title: '住宿和餐食', items: ['iQ Vega 公寓单人间，3间卧室共用1个厨房和2个卫生间', '男女分开住，18岁以上和16/17岁分开住', '床品（两周后可换新）、厨具包（餐具、锅和电水壶）和住宿预订费', '学校清洁团队每周打扫卫生间', '周一至周五在学校食堂吃午餐，其他餐在公寓厨房自己做'] },
  { title: '活动和服务', items: ['成人社交活动和健身房会员', '公寓有自习室、公共区、游戏室、影音室和屋顶露台', 'Burlington 员工住在公寓', '坐地铁约25分钟到学校，学校员工带学生上学', '报满4周含巴斯城堡两晚标准版'] },
];

export const BURLINGTON_SUMMER_RESIDENCE_EXTRAS = [
  `可升级强化课程：每周加${BURLINGTON_SUMMER_RESIDENCE.intensiveUpgradePerWeek}英镑（每周22.5小时）。`,
  `只订住宿：每周${BURLINGTON_SUMMER_RESIDENCE.roomOnlyPerWeek}英镑，含周一至周五学校午餐；另付厨具床品包${BURLINGTON_SUMMER_RESIDENCE.roomOnlyExtras.kitchenBedding}英镑、健身房${BURLINGTON_SUMMER_RESIDENCE.roomOnlyExtras.gym}英镑、住宿预订费${BURLINGTON_SUMMER_RESIDENCE.roomOnlyExtras.booking}英镑。`,
];

export const BURLINGTON_JUNIOR_SEASON_ROWS = BURLINGTON_JUNIOR_SEASONS.map(season => ({
  name: season.name,
  dates: dateRange(season.start, season.end),
  weeks: `1–${season.maxWeeks}周`,
  day: `${season.prices.day}英镑/周`,
  full: `${money(season.prices.residence)}英镑/周`,
  castle: `${season.castleUpgrade}英镑`,
}));

export const BURLINGTON_JUNIOR_INCLUDES = {
  headers: ['只上课不住宿', '学校宿舍', '寄宿家庭（14岁以上）'],
  rows: [
    { label: '英语课程', values: ['每周15节（11小时15分钟）', '每周15节（11小时15分钟）', '每周15节（11小时15分钟）'] },
    { label: '住宿', values: ['不含', '3–6人间，上下铺，共用卫生间', '单人间或双人间，共用卫生间'] },
    { label: '三餐', values: ['只含周一至周五午餐', '每天三餐（入住当天只供晚餐，离开当天只供早餐）', '每天三餐（入住当天只供晚餐，离开当天只供早餐）'] },
    { label: '半日游', values: ['每周5次（周一至周五）', '每周5次（周一至周五）', '每周5次（周一至周五）'] },
    { label: '周六全天出游', values: ['另付80英镑/周', '包含', '包含'] },
    { label: '晚间活动', values: ['不含', '包含', '不含'] },
  ],
};

export const BURLINGTON_JUNIOR_NOTE = '14岁以下学生接送机必须加付无人陪伴费（每程50英镑）。';

export const BURLINGTON_JUNIOR_DAY = [
  { time: '08:30', title: '早餐', text: '在学校食堂吃早餐。' },
  { time: '09:00', title: '上午活动', text: '员工带队游览伦敦，例如威斯敏斯特、维多利亚与艾伯特博物馆、自然历史博物馆、伦敦塔、泰晤士河游船、杜莎夫人蜡像馆。' },
  { time: '13:00', title: '午餐', text: '回学校食堂吃午餐。' },
  { time: '14:30', title: '集会和英语课', text: '14:45–17:30 连上三节项目式英语课；周五做项目展示和结业集会。' },
  { time: '18:00', title: '晚餐', text: '在学校食堂吃晚餐。' },
  { time: '18:30', title: '晚间活动', text: '运动之夜、桌游、购物、电影之夜、伦敦夜游等，到21:00；22:00熄灯。' },
  { time: '周六', title: '全天出游', text: '例如牛津、坎特伯雷、汉普顿宫、赫弗城堡，带打包午餐。' },
  { time: '周日', title: '入住和离开日', text: '新生入住、老生离开；在附近购物或玩桌游，带打包午餐。' },
];

export const BURLINGTON_JUNIOR_DAY_NOTE = '只上课不住宿的学生周一至周五 09:00–17:30 参加。';

export const BURLINGTON_JUNIOR_PROJECT_NOTE = '每一到两周换一个主题，分组完成后周五展示；英语 A2–C1 都能参加，青少年平均每班15人。';

export const BURLINGTON_JUNIOR_PROJECTS = [
  { group: '11–13岁', text: '设计一种幻想动物、建一座可持续城市、发明解决日常问题的小工具' },
  { group: '14–17岁', text: '创建一个国家、当电视新闻记者、设计并推销一款新产品' },
];

export const BURLINGTON_JUNIOR_SAFETY = [
  '男女分房住，学校宿舍有员工24小时住校照看；外出活动都有员工带队。',
  '16–17岁：家长在同意书上允许的话，可以自己外出，晚上22:00前回宿舍并在前台签到。',
  '14–15岁：家长同意后可以自己外出，18:00前回宿舍。',
  '14岁以下：不能单独离开学校。',
];

export const BURLINGTON_CASTLE = {
  intro: 'Burlington Bath Castle 是学校自有的乡村城堡，在世界遗产城市巴斯以南约11公里，有四英亩草坪、花园和私人林地，历史可追溯到公元987年。城堡有37个学生床位，2–4人一间，房间带卫生间。',
  options: [
    { who: '成人课程报满4周', price: '免费', text: '两晚标准版：往返巴斯和索尔兹伯里的交通、住宿和早餐、巴斯和索尔兹伯里导览、城堡活动。' },
    { who: '成人升级高级版', price: '另付125英镑', text: '在标准版基础上，多2项高级活动（如巨石阵、巴斯温泉、飞碟射击、朗利特野生动物园、科茨沃尔德）、2次特色餐和1份打包午餐。' },
    { who: '成人不满4周', price: '395英镑', text: '城堡两晚＋高级版。' },
    { who: '青少年项目', price: '暑期445英镑，春秋冬季395英镑', text: '两晚城堡，三餐全包；含伦敦往返交通、巴斯导览、巨石阵门票、科茨沃尔德小镇游览、乡村徒步、热水浴池、篝火和露天电影。' },
  ],
  note: '城堡安排和活动仅供参考，会因天气、场地或其他原因调整。7月城堡有夏日节（Festival at Bath Castle Lodge），具体日期以学校通知为准。',
};

export const BURLINGTON_FEE_ROWS = [
  { item: '注册费', amount: '55英镑', note: '所有项目一次性收取；成人暑期公寓套餐已含。' },
  { item: '住宿预订费', amount: '55英镑', note: '成人订住宿时收取；成人暑期公寓套餐已含。' },
  { item: '教材费', amount: '45英镑/学期', note: '成人课程；通用英语每学期12或13周。' },
  { item: '考试报名费', amount: '300英镑', note: '需要在英国参加雅思或剑桥考试时。' },
  { item: '国际汇款手续费', amount: '20英镑', note: '国际汇款付款时收取。' },
  { item: '机场接送（单程1人）', amount: '140–190英镑', note: '希思罗150、盖特威克160、卢顿190、斯坦斯特德190、圣潘克拉斯火车站140；同行每多1人加55英镑。' },
  { item: '无人陪伴费', amount: '50英镑/程', note: '14岁以下学生接送机必须付。' },
  { item: '伦敦交通卡（1–3区）', amount: '60英镑/周', note: '青少年参加活动要坐公共交通；也可以用非接触式支付。' },
  { item: '寄宿家庭往返陪同', amount: '150英镑/周', note: '青少年住寄宿家庭，可申请员工陪同上下学。' },
];

export const BURLINGTON_BASIC_INFO = [
  { label: '学校全称', value: 'Burlington School（Burlington School of English）' },
  { label: '发展历程', value: '1990年创办；1993年获英国文化协会认证；2000年开办青少年项目；2011年成为 Trinity College London 注册考试中心；2019年在 Balham 购入现在更大的校舍' },
  { label: '认证和会员', value: '英国文化协会认证；English UK 会员；English UK 青少年会员' },
  { label: '规模', value: '可容纳约200名学生，9间教室，2间自习室；每节课45分钟' },
  { label: '学生国籍', value: '欧洲约43%，中南美洲17%，东亚和东南亚17%，中亚12%，中东北非6%，南亚3%，非洲2%' },
  { label: '校内设施', value: '食堂、自习室、带电视和 Netflix 的休息室、乒乓球台、图书角、洗衣房；前台每周7天开放' },
];

export const BURLINGTON_FAQ = [
  { title: '15岁可以报成人课程吗？', text: '成人课程和成人暑期公寓套餐要求16岁以上；11–17岁的学生报青少年项目。是否按入学当天的年龄计算，以学校确认为准。' },
  { title: '16–17岁报成人课程还是青少年项目？', text: '成人课程上午上课、可以只报1周，住校内宿舍或寄宿家庭每周加30英镑；青少年项目课程、住宿、三餐和出游全包，外出有员工带队，但上午出游、下午上课。想多上课、上午上课选成人课程；第一次出国、希望全程有人带的选青少年项目。' },
  { title: '需要办什么签证？', text: '中国学生去英国短期学习，一般申请英国标准访问签证（Standard Visitor），具体以英国签证要求为准。签证、机票和保险不在学校费用里。' },
  { title: '页面价格和规定会变吗？', text: '页面为2027年价格；课程安排、活动和住宿规定学校可能随时调整。报名时以学校确认的价格、学位和房间为准。' },
];

export const BURLINGTON_SERVICE = [
  { icon: 'route', title: '选方案', text: '按年龄、英语水平、出发时间和预算，对比成人课程、暑期公寓套餐和青少年项目，以及学校宿舍、寄宿家庭和公寓。' },
  { icon: 'calculate', title: '算清费用', text: '必付费用和可选费用分开算，生成报价单，方便家人一起看。' },
  { icon: 'assignment', title: '报名和确认学位', text: '跟学校确认学位和房间，协助填写报名资料、核对付款信息。' },
  { icon: 'flight_takeoff', title: '出发前准备', text: '签证材料、机票、保险、接机和行李清单逐项提醒。' },
  { icon: 'forum', title: '在英国学习期间', text: '学生到校后，顾问继续和学校保持沟通；学习、住宿或生活上遇到问题，帮你跟学校协调处理。' },
  { icon: 'home', title: '学成回国', text: '课程结束、学生平安回国，服务才算结束。' },
];

/** The review and contact section at the end of the page. */
export const BURLINGTON_ADVISOR = {
  eyebrow: '思达顾问点评',
  heading: '吃住学都在学校，成人和青少年都省心',
  paragraphs: [
    'Burlington 最大的特点是上课、吃饭、住宿都在同一栋校舍里。青少年住学校宿舍，有员工24小时住校照看，外出有员工带队，家长放心；成人住校内宿舍同样方便，不用每天通勤，周一至周五的早晚餐和周末早餐都含在房费里。',
    '校内食堂每天现做三餐。伦敦在外面吃饭不便宜，在学校吃既省心又划算。不想住校的成人可以选学校的 Wandsworth 公寓，坐公共交通到学校约30分钟；暑期还有成人公寓套餐，住 iQ Vega 单人间，坐地铁约25分钟到学校，学校员工也住在公寓、带学生上学，刚到伦敦也不用担心找路。',
    '要提醒的是，英国整体费用比亚洲游学高，暑期房间也紧张，最好提前确认学位。',
  ],
  contactTitle: '找思达顾问报名 Burlington',
  contactText: '扫码添加微信，发学生年龄、出发时间、英语水平和预算，顾问帮你确认学位和正式报价。',
};

/**
 * A consultant with a round-avatar crop: the square photo is scaled by `scale` around the point
 * `originY` from the top, so the face sits in the middle of the circle (Jenny's photo is full-length).
 */
export interface BurlingtonConsultant extends SidaConsultant {
  avatarCrop: { scale: number; originY: string };
}

const consultant = (name: string, displayName: string, description: string,
  avatarCrop: BurlingtonConsultant['avatarCrop']): BurlingtonConsultant => {
  const item = SIDA_PHILIPPINES_CONSULTANTS.find(entry => entry.name === name) ?? SIDA_PHILIPPINES_CONSULTANTS[0];
  return { ...item, name: displayName, description, avatarCrop };
};

/** Lemon, Perrin and Jenny, in the order the user chose (2026-11-19). */
export const BURLINGTON_CONSULTANTS: BurlingtonConsultant[] = [
  consultant('Lemon', 'Lemon', '还没定国家，想把英国和其他国家的费用、时间放在一起比较。', { scale: 1.5, originY: '5%' }),
  consultant('Penin', 'Perrin', '想把英国和菲律宾、东南亚的游学方案和预算放在一起比较。', { scale: 1.6, originY: '17%' }),
  consultant('Jenny', 'Jenny', '英国、爱尔兰游学和留学规划，以后想在英国或爱尔兰继续读书。', { scale: 2.6, originY: '9%' }),
];

export const BURLINGTON_SIDE_NAV = [
  { label: '项目和价格', target: 'programmes', icon: 'payments' },
  { label: '学校亮点', target: 'highlights', icon: 'stars' },
  { label: '照片和视频', target: 'gallery', icon: 'photo_library' },
  { label: '成人项目', target: 'adult-zone', icon: 'school' },
  { label: '成人住宿和餐食', target: 'accommodation', icon: 'bed' },
  { label: '成人暑期公寓', target: 'summer-residence', icon: 'apartment' },
  { label: '青少年项目', target: 'junior', icon: 'groups' },
  { label: '巴斯城堡', target: 'castle', icon: 'castle' },
  { label: '在线报价', target: 'quote', icon: 'calculate' },
  { label: '其他费用', target: 'fees', icon: 'receipt_long' },
  { label: '常见问题', target: 'faq', icon: 'help' },
  { label: '联系顾问', target: 'contact', icon: 'support_agent' },
];

export const BURLINGTON_MOBILE_ANCHORS = [
  { label: '项目', target: 'programmes', icon: 'payments' },
  { label: '照片', target: 'gallery', icon: 'photo_library' },
  { label: '视频', target: 'videos', icon: 'smart_display' },
  { label: '成人', target: 'adult-zone', icon: 'school' },
  { label: '成人住宿', target: 'accommodation', icon: 'bed' },
  { label: '青少年', target: 'junior', icon: 'groups' },
  { label: '报价', target: 'quote', icon: 'calculate' },
  { label: '顾问', target: 'contact', icon: 'support_agent' },
];
