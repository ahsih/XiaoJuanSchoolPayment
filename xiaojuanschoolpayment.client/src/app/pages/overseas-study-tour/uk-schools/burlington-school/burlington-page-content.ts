// Static text and data of the Burlington School page. Pure data (no Angular, DOM or `this`), so the
// WeChat mini program can reuse it later like cia-page-content.ts. Prices come from
// burlington-pricing.ts; facts come from the school's 2027 price list, 2027 group packages,
// brochure and the managing director's partner email (received 2026-11-19).
// Never add agent commission, and never publish the school's phone, email, WhatsApp, website or street
// address here (user decision 2026-11-19: students must enrol through Sida, not contact the school directly).
import {
  BURLINGTON_ADULT_COURSES,
  BURLINGTON_APARTMENT_ROOMS,
  BURLINGTON_HOMESTAY_PRICES,
  BURLINGTON_HOMESTAY_SUPPLEMENTS,
  BURLINGTON_JUNIOR_SEASONS,
  BURLINGTON_ONSITE_ROOMS,
  BURLINGTON_SUMMER_RESIDENCE,
} from './burlington-pricing';

export type BurlingtonGalleryCategory = '全部' | '校园' | '宿舍' | '餐饮' | '课堂和活动' | '公寓' | '城堡';

export interface BurlingtonGalleryImage {
  category: Exclude<BurlingtonGalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
}

export interface BurlingtonVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  src: string;
  poster: string;
  vertical: boolean;
}

const asset = (name: string) => `/assets/burlington/${name}.jpg`;
const video = (name: string) => ({ src: `/assets/burlington/videos/${name}.mp4`, poster: `/assets/burlington/videos/poster-${name}.jpg` });

export const BURLINGTON_PAGE_COPY = {
  breadcrumb: '海外游学 / 英国游学 / Burlington School',
  title: '伦敦 Burlington School',
  lead: 'Burlington School 1990年在伦敦创办，是英国文化协会认证的独立语言学校。学校在伦敦南部Balham，由老建筑翻新的校舍里有教室、餐厅、学生宿舍和休息室，学生上课、吃饭、住宿和社交都在同一栋楼里。学校还自有巴斯城堡，可以把伦敦学习和英格兰乡村体验连在一起。',
  tags: [
    { icon: 'verified', text: '英国文化协会认证' },
    { icon: 'apartment', text: '学习住宿同一栋楼' },
    { icon: 'groups', text: '青少年11–17岁 · 成人16岁以上' },
    { icon: 'castle', text: '自有巴斯城堡' },
  ],
  trustNote: '页面为2027年价格。正式报名以学校确认的学位、房间和当期价格为准。',
  priceCard: {
    label: '2027暑期',
    price: '每周1,195英镑',
    caption: '青少年住校全包',
    points: ['课程＋学校宿舍＋三餐＋出游活动', '注册费55英镑；机票、签证、保险另计'],
  },
};

/** Shown beside detailed school rules (timetables, curfew, room rules, vetting, facilities): the school can change them at any time. */
export const BURLINGTON_REFERENCE_NOTE = '以上规定仅供参考，学校可能随时调整，以学校当期安排为准。';

export const BURLINGTON_QUICK_INFO = [
  { icon: 'school', label: '学校定位', value: '伦敦寄宿式语言学校', note: '成人英语全年开课；青少年有春、夏、秋、冬四季项目。' },
  { icon: 'location_city', label: '所在区域', value: '伦敦南部 Balham', note: '步行5分钟到 Balham 地铁和地上铁站，约15分钟到伦敦市中心；附近有公园、商业街和带泳池的体育中心。' },
  { icon: 'groups', label: '适合年龄', value: '青少年11–17岁 · 成人16岁以上', note: '青少年英语需达到A2；成人从零基础到C2都有班。' },
  { icon: 'menu_book', label: '课堂', value: '每节45分钟，每班最多18人', note: '成人平均每班12人，青少年平均15人；入学先做分级测试，按水平分班。' },
  { icon: 'bed', label: '住宿', value: '校内宿舍 / 公寓 / 寄宿家庭', note: '男女分房住，校内宿舍有员工24小时住校照看。' },
  { icon: 'workspace_premium', label: '认证', value: '英国文化协会认证', note: 'English UK 会员、English UK 青少年会员，Trinity 考试中心。' },
];

export const BURLINGTON_GALLERY_CATEGORIES: BurlingtonGalleryCategory[] = ['全部', '校园', '宿舍', '餐饮', '课堂和活动', '公寓', '城堡'];

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
  { category: '餐饮', title: '学校餐厅', description: '早、午、晚三餐都在校内餐厅，厨房每天现做。', src: asset('dining-coffee-bar') },
  { category: '餐饮', title: '早餐', description: '学校餐厅的早餐。', src: asset('dining-breakfast') },
  { category: '餐饮', title: '午餐', description: '每天有几种热菜可选。', src: asset('dining-lunch') },
  { category: '餐饮', title: '沙拉吧', description: '自助沙拉。', src: asset('dining-salad') },
  { category: '餐饮', title: '现做热食', description: '鸡肉、牛肉和羊肉为清真，有素食选择。', src: asset('dining-chef') },
  { category: '餐饮', title: '甜点', description: '学校厨房做的甜点。', src: asset('dining-dessert') },
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
export const BURLINGTON_GALLERY_FEATURED = ['campus-courtyard', 'campus-games-room', 'residence-dorm-hero', 'residence-single', 'dining-coffee-bar', 'dining-lunch', 'yl-classroom-project', 'yl-group-museum', 'iq-vega-bedroom', 'castle-exterior', 'castle-shared-room', 'castle-woodland-dining'];

/** Complete school videos, transcoded to 720p H.264 and loaded only when played. */
export const BURLINGTON_VIDEOS: BurlingtonVideo[] = [
  { id: 'school-promo', title: '学校宣传片', description: '伦敦、校园、宿舍、餐厅和课堂，一分钟看完学校。', duration: '0:48', vertical: false, ...video('school-promo') },
  { id: 'school-film', title: '学校完整介绍', description: '学校介绍片（无声），包括课堂、住宿、学生活动和城堡。', duration: '4:33', vertical: false, ...video('school-film') },
  { id: 'campus-food', title: '校园和餐饮', description: '校舍、餐厅和每天的餐食。', duration: '0:38', vertical: true, ...video('campus-food') },
  { id: 'young-learners', title: '青少年项目的一天', description: '早餐、上午出游、下午上课和晚间活动。', duration: '0:35', vertical: true, ...video('young-learners') },
  { id: 'social-programme', title: '伦敦社交活动', description: '学校员工带学生游览伦敦。', duration: '1:28', vertical: true, ...video('social-programme') },
  { id: 'iq-vega', title: 'iQ Vega 公寓', description: '成人暑期公寓：卧室、健身房和空中休息室。', duration: '0:35', vertical: true, ...video('iq-vega') },
  { id: 'bath-castle', title: '巴斯城堡体验', description: '城堡、巴斯游览、林间用餐和篝火。', duration: '0:58', vertical: true, ...video('bath-castle') },
  { id: 'student-story', title: '学生分享', description: '在校学生讲她在 Burlington 的学习和生活（英文字幕）。', duration: '1:28', vertical: true, ...video('student-story') },
];

export const BURLINGTON_BASIC_INFO = [
  { label: '学校名称', value: 'Burlington School（Burlington School of English）' },
  { label: '创办时间', value: '1990年' },
  { label: '所在区域', value: '伦敦南部 Balham，介于市中心和郊区之间' },
  { label: '认证', value: '英国文化协会认证；English UK 会员；English UK 青少年会员；Trinity 考试中心' },
  { label: '规模', value: '可容纳约200名学生，9间教室，2间自习室（仅供参考）' },
  { label: '学生国籍', value: '欧洲约43%，中南美洲17%，东亚和东南亚17%，中亚12%，中东北非6%，南亚3%，非洲2%（仅供参考）' },
  { label: '校内设施', value: '自习室、带电视和 Netflix 的休息室、乒乓球台、图书角、洗衣房；前台每周7天开放（仅供参考）' },
  { label: '开课时间', value: '成人每周一开课（遇英国法定假日改周二）；青少年按季节项目入学' },
  { label: '2027年停课', value: '英国法定假日；12月20日–31日圣诞假期' },
];

export const BURLINGTON_ADVISOR = {
  heading: '先定年龄和预算，再选项目和住宿',
  text: 'Burlington 最大的特点是学习和住宿在同一栋楼，对第一次出国的青少年来说，管理和安全感都更好。青少年套餐把课程、三餐和伦敦出游打包在一起，家长算账也简单；成人可以按周灵活报名，报满4周还送巴斯城堡两晚。要提醒的是英国整体费用比亚洲游学高，暑期房间也紧张，最好提前确认学位。',
  name: 'Jenny',
  advice: '先告诉我们学生年龄、出发时间、英语水平和预算，我们帮你在学校宿舍、寄宿家庭和公寓之间选合适的方案。',
};

export const BURLINGTON_HIGHLIGHTS = [
  { title: '学习、住宿、吃饭在同一栋楼', text: '教室、餐厅、宿舍和休息室都在校舍里，住校的青少年不用每天通勤。' },
  { title: '小班教学', text: '每班最多18人，平均12人；入学先分级测试，按水平分班。' },
  { title: '青少年全包套餐', text: '暑期每周1,195英镑，包含课程、住宿、三餐、每周5次半日游和周六全天出游。' },
  { title: '自有巴斯城堡', text: '可以加两晚城堡体验，游览巴斯、巨石阵和科茨沃尔德小镇；成人报满4周免费送。' },
  { title: '全年都能报', text: '成人每周一开课，最短1周；青少年有春、夏、秋、冬四季项目。' },
];

export const BURLINGTON_FIT = {
  suitable: [
    { title: '第一次出国的11–17岁学生', text: '住校内宿舍有员工24小时照看，外出活动都有员工带队。' },
    { title: '想体验英式生活的成人', text: '按周报名，上午上课，下午参加社交活动；报满4周送巴斯城堡两晚。' },
    { title: '准备雅思或剑桥考试', text: '有雅思和剑桥考试备考课，雅思要求英语达到B1。' },
    { title: '暑期想住单人间的成人', text: '成人暑期公寓套餐住 iQ Vega 公寓单人间，含午餐和健身房。' },
  ],
  lessSuitable: [
    { title: '预算比较紧', text: '英国游学整体费用较高，同样周数可以同时比较菲律宾、马来西亚等方案。' },
    { title: '想上大量一对一', text: 'Burlington 以小班为主，一对一每小时75英镑另付。' },
    { title: '不到11岁的孩子', text: '青少年项目从11岁开始，更小的孩子需要另找亲子项目。' },
    { title: '暑期临时才报名', text: '暑期是最热门的时段，宿舍和寄宿家庭都要尽早确认。' },
  ],
};

const juniorSeason = (id: string) => BURLINGTON_JUNIOR_SEASONS.find(season => season.id === id)!;
const dateRange = (start: string, end: string) => {
  const [y1, m1, d1] = start.split('-').map(Number);
  const [y2, m2, d2] = end.split('-').map(Number);
  return y1 === y2 ? `${y1}年${m1}月${d1}日–${m2}月${d2}日` : `${y1}年${m1}月${d1}日–${y2}年${m2}月${d2}日`;
};

export const BURLINGTON_PROGRAMME_CARDS = [
  {
    type: '11–17岁',
    name: '青少年暑期项目',
    dates: dateRange(juniorSeason('summer').start, juniorSeason('summer').end),
    weeks: '1–13周，最短1周',
    price: `宿舍或寄宿家庭全包每周${juniorSeason('summer').prices.residence.toLocaleString('en-US')}英镑`,
    sub: `只上课不住宿每周${juniorSeason('summer').prices.day}英镑`,
    points: ['每周15节项目式英语课', '三餐、每周5次半日游、周六全天出游', '住宿舍的学生还有晚间活动'],
  },
  {
    type: '11–17岁',
    name: '青少年春 / 秋 / 冬季项目',
    dates: `春季${dateRange(juniorSeason('spring').start, juniorSeason('spring').end)}；秋季${dateRange(juniorSeason('autumn').start, juniorSeason('autumn').end)}；冬季${dateRange(juniorSeason('winter').start, juniorSeason('winter').end)}`,
    weeks: '春季1–6周，秋冬季1–4周',
    price: `宿舍或寄宿家庭全包每周${juniorSeason('spring').prices.residence.toLocaleString('en-US')}英镑`,
    sub: `只上课不住宿每周${juniorSeason('spring').prices.day}英镑`,
    points: ['分11–13岁、14–17岁两个年龄组', '包含内容和暑期项目相同', '可加巴斯城堡两晚（395英镑）'],
  },
  {
    type: '16岁以上',
    name: '成人英语课程',
    dates: '全年每周一开课',
    weeks: '最短1周，报得越久每周越便宜',
    price: `标准课程每周${BURLINGTON_ADULT_COURSES[0].tiers[0].rate}英镑起`,
    sub: `强化课程每周${BURLINGTON_ADULT_COURSES[1].tiers[0].rate}英镑起`,
    points: ['通用英语、雅思备考、剑桥考试备考', '住宿可选校内宿舍、公寓或寄宿家庭', '报满4周送巴斯城堡两晚'],
  },
  {
    type: '16岁以上',
    name: '成人暑期公寓套餐',
    dates: dateRange(BURLINGTON_SUMMER_RESIDENCE.start, BURLINGTON_SUMMER_RESIDENCE.end),
    weeks: '2–8周',
    price: `每周${BURLINGTON_SUMMER_RESIDENCE.tiers.map(tier => tier.rate).join(' / ')}英镑`,
    sub: '分别对应2周、4周、6周起',
    points: ['标准课程＋iQ Vega 公寓单人间', '周一至周五学校午餐、健身房、社交活动', '注册费、教材、住宿预订费都已含'],
  },
];

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

export const BURLINGTON_JUNIOR_SEASON_ROWS = BURLINGTON_JUNIOR_SEASONS.map(season => ({
  name: season.name,
  dates: dateRange(season.start, season.end),
  weeks: `1–${season.maxWeeks}周`,
  day: `${season.prices.day}英镑/周`,
  full: `${season.prices.residence.toLocaleString('en-US')}英镑/周`,
  castle: `${season.castleUpgrade}英镑`,
}));

export const BURLINGTON_JUNIOR_DAY = [
  { time: '08:30', title: '早餐', text: '在学校餐厅吃早餐。' },
  { time: '09:00', title: '上午活动', text: '员工带队游览伦敦，例如威斯敏斯特、维多利亚与艾伯特博物馆、自然历史博物馆、伦敦塔、泰晤士河游船、杜莎夫人蜡像馆。' },
  { time: '13:00', title: '午餐', text: '回学校餐厅吃午餐。' },
  { time: '14:30', title: '集会和英语课', text: '14:45–17:30 连上三节项目式英语课；周五做项目展示和结业集会。' },
  { time: '18:00', title: '晚餐', text: '在学校餐厅吃晚餐。' },
  { time: '18:30', title: '晚间活动', text: '运动之夜、桌游、购物、电影之夜、伦敦夜游等，到21:00；22:00熄灯。' },
  { time: '周六', title: '全天出游', text: '例如牛津、坎特伯雷、汉普顿宫、赫弗城堡，带打包午餐。' },
  { time: '周日', title: '入住和离开日', text: '新生入住、老生离开；在附近购物或玩桌游，带打包午餐。' },
];

export const BURLINGTON_JUNIOR_DAY_NOTE = '日程仅供参考，学校可能随时调整，以当期安排为准。入住当天只供晚餐，离开当天只供早餐；只上课不住宿的学生周一至周五 09:00–17:30 参加。';

export const BURLINGTON_JUNIOR_PROJECTS = [
  { group: '11–13岁', text: '设计一种幻想动物、建一座可持续城市、发明解决日常问题的小工具' },
  { group: '14–17岁', text: '创建一个国家、当电视新闻记者、设计并推销一款新产品' },
];

export const BURLINGTON_JUNIOR_SAFETY = [
  '16–17岁：家长在同意书上允许的话，可以自己外出，晚上22:00前回宿舍并在前台签到。',
  '14–15岁：家长同意后可以自己外出，18:00前回宿舍。',
  '14岁以下：不能单独离开学校。',
  '男女分房住，宿舍有员工24小时住校照看；外出活动都有员工带队。',
  '前台每周7天开放，校内有洗衣房。',
];

export const BURLINGTON_ADULT_TIER_ROWS = BURLINGTON_ADULT_COURSES[0].tiers.map((tier, index) => {
  const intensive = BURLINGTON_ADULT_COURSES[1].tiers[index];
  const weeks = tier.maxWeeks === null ? `${tier.minWeeks}周以上` : `${tier.minWeeks}–${tier.maxWeeks}周`;
  return {
    weeks,
    standard: `${tier.rate}英镑/周`,
    intensive: `${intensive.rate}英镑/周`,
    example: tier.maxWeeks === null ? `36周：标准课${(tier.rate * 36).toLocaleString('en-US')}英镑`
      : `${tier.maxWeeks}周：标准课${(tier.rate * tier.maxWeeks).toLocaleString('en-US')}英镑`,
  };
});

export const BURLINGTON_ADULT_TIMETABLE = [
  { time: '08:00', title: '早餐', text: '住校内宿舍的学生在学校餐厅吃早餐。' },
  { time: '08:45', title: '主课', text: '通用英语、雅思备考或剑桥考试备考，到11:15。' },
  { time: '11:30', title: '听说工作坊', text: '练发音、口语和听力，到12:15。标准课程到这里结束。' },
  { time: '13:00', title: '读写工作坊', text: '强化课程才有，到13:45。' },
  { time: '13:50', title: '语法词汇工作坊', text: '强化课程才有，到14:35。' },
  { time: '14:45', title: '成人社交活动', text: '周一至周五下午，例如威斯敏斯特徒步、大英博物馆、自然历史博物馆、科文特花园；部分活动要买票，周六一日游（如牛津、坎特伯雷、汉普顿宫）约20–40英镑。' },
];

export const BURLINGTON_ADULT_EXTRAS = [
  { label: '一对一课程', value: '每小时75英镑，10小时以上每小时65英镑', note: '可以单独上，也可以加在小班课程之外。' },
  { label: 'Fast Track 速成课', value: '645英镑', note: '每周20节小班课＋5小时迷你课程＋定制辅导；计价方式以学校确认为准。' },
  { label: '线上课程', value: '需咨询学校', note: '学校也有线上课程，价格另询。' },
];

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

export const BURLINGTON_ACCOMMODATION_NOTES = {
  onsite: '16岁以上可住。周一至周五含早餐和晚餐，周六日含早餐；16/17岁每周加30英镑。提供床单，毛巾需自备或另付；每天清洁。',
  apartment: 'Wandsworth 公寓由学校自有，18岁以上，可订2–24周。伦敦2区的学生公寓，靠近泰晤士河，坐公共交通到学校约30分钟；2间卧室带独立卫生间，3间共用2个卫生间；有厨房和花园，不含餐；水电网费和清洁都含，学校员工住在公寓。',
  homestay: '16岁以上可住，每个寄宿家庭最多4名学生。提供床单和毛巾，每周清洁。',
};

/** Burlington Homestay Collection vetting steps from the school's 2026 homestay presentation. */
export const BURLINGTON_HOMESTAY_VETTING = [
  '房东要提交护照、协议、DBS无犯罪记录审查和两份推荐信。',
  '学校上门检查：燃气安全证书、一氧化碳和烟雾报警器、房间采光、通风和暖气、书桌和衣柜。',
  '还会看社区是否安全、到学校的路线是否方便；房东要接受安全保护培训。',
];

export const BURLINGTON_SUMMER_RESIDENCE_INCLUDES = [
  { title: '课程', items: ['标准课程每周15小时：主课08:45–11:15＋听说工作坊11:30–12:15', '可选通用英语、雅思备考或剑桥考试备考', '注册费、教材和结业证书已含', '可升级强化课程，每周加80英镑（每周22.5小时）'] },
  { title: '住宿和餐食', items: ['iQ Vega 公寓单人间，3间卧室共用1个厨房和2个卫生间', '男女分开住，18岁以上和16/17岁分开住', '床品由学校提供（两周后可换新）；厨具包有餐具、锅和电水壶；学校清洁团队每周打扫卫生间', '住宿预订费、厨具和床品包已含', '周一至周五在学校吃午餐，其他餐在公寓厨房自己做'] },
  { title: '活动和服务', items: ['成人社交活动和健身房会员', '公寓有自习室、公共区、游戏室、影音室和屋顶露台', 'Burlington 员工住在公寓', '坐地铁约25分钟到学校，学校员工带学生上学', '报满4周含巴斯城堡两晚标准版'] },
];

export const BURLINGTON_SUMMER_RESIDENCE_ROOM_ONLY =
  `只订住宿：每周${BURLINGTON_SUMMER_RESIDENCE.roomOnlyPerWeek}英镑，含周一至周五学校午餐；另付厨具床品包${BURLINGTON_SUMMER_RESIDENCE.roomOnlyExtras.kitchenBedding}英镑、健身房${BURLINGTON_SUMMER_RESIDENCE.roomOnlyExtras.gym}英镑、住宿预订费${BURLINGTON_SUMMER_RESIDENCE.roomOnlyExtras.booking}英镑。`;

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

export const BURLINGTON_CALENDAR = [
  { date: '2027年3月14日–4月25日', title: '青少年春季项目', note: '1–6周' },
  { date: '2027年5月30日–8月29日', title: '青少年暑期项目', note: '1–13周' },
  { date: '2027年6月13日–8月29日', title: '寄宿家庭暑期附加费期间', note: '每周加25英镑' },
  { date: '2027年6月27日–8月22日', title: '成人暑期公寓套餐', note: '2–8周' },
  { date: '2027年7月', title: '巴斯城堡夏日节', note: '具体日期以学校通知为准' },
  { date: '2027年10月10日–11月7日', title: '青少年秋季项目', note: '1–4周' },
  { date: '2028年1月2日–1月30日', title: '青少年冬季项目', note: '1–4周' },
  { date: '3月29日、5月3日、5月31日、8月30日', title: '英国法定假日', note: '成人课程那一周改为周二开课' },
  { date: '2027年12月20日–31日', title: '圣诞停课', note: '学校放假' },
];

export const BURLINGTON_SERVICE = [
  { icon: 'route', title: '选项目和住宿', text: '根据年龄、英语水平、出发时间和预算，比较青少年套餐、成人课程和公寓套餐。' },
  { icon: 'calculate', title: '提前算清费用', text: '必付费用和可选费用分开列，直接生成报价单发给家长。' },
  { icon: 'assignment', title: '协助报名和付款', text: '跟学校确认学位和房间，整理报名资料和付款信息。' },
  { icon: 'flight_takeoff', title: '出发前逐项提醒', text: '签证材料、机票、保险、接机和行李清单都会提醒。' },
];

export const BURLINGTON_FAQ = [
  { title: '15岁可以报成人课程吗？', text: '成人课程和成人暑期公寓套餐要求16岁以上；11–17岁的学生报青少年项目。是否按入学当天的年龄计算，以学校确认为准。' },
  { title: '青少年套餐包含什么？', text: '课程、住宿、每天三餐（入住当天只供晚餐，离开当天只供早餐）、每周5次半日游和周六全天出游；住学校宿舍的还有晚间活动。注册费55英镑另付；交通卡、接送机和巴斯城堡是可选项。' },
  { title: '青少年可以自己外出吗？', text: '要看年龄和家长同意书：16–17岁22:00前回宿舍，14–15岁18:00前回宿舍，14岁以下不能单独离开学校。以上规定仅供参考，以学校当期规定为准。' },
  { title: '巴斯城堡是免费的吗？', text: '成人课程报满4周免费送两晚标准版；青少年项目需要另付（暑期445英镑，春秋冬季395英镑）。' },
  { title: '学校宿舍有单人间吗？', text: '成人可以选单人间或豪华单人间；青少年项目的宿舍是3–6人间。青少年想住单人间，可以选寄宿家庭单人间（14岁以上）。' },
  { title: '需要办什么签证？', text: '中国学生去英国短期学习，一般申请英国标准访问签证（Standard Visitor），具体以英国签证要求为准。签证、机票和保险不在学校费用里。' },
  { title: '页面价格和规定会变吗？', text: '页面为2027年价格；课程安排、活动和住宿规定仅供参考，学校可能随时调整。报名时以学校确认的价格、学位和房间为准。' },
];

export const BURLINGTON_SIDE_NAV = [
  { label: '视频', target: 'videos', icon: 'smart_display' },
  { label: '学校亮点', target: 'highlights', icon: 'stars' },
  { label: '项目和价格', target: 'programmes', icon: 'payments' },
  { label: '住宿', target: 'accommodation', icon: 'bed' },
  { label: '巴斯城堡', target: 'castle', icon: 'castle' },
  { label: '在线报价', target: 'quote', icon: 'calculate' },
  { label: '其他费用', target: 'fees', icon: 'receipt_long' },
  { label: '常见问题', target: 'faq', icon: 'help' },
];

export const BURLINGTON_MOBILE_ANCHORS = [
  { label: '图片', target: 'gallery', icon: 'photo_library' },
  { label: '视频', target: 'videos', icon: 'smart_display' },
  { label: '项目', target: 'programmes', icon: 'menu_book' },
  { label: '住宿', target: 'accommodation', icon: 'bed' },
  { label: '报价', target: 'quote', icon: 'calculate' },
  { label: '费用', target: 'fees', icon: 'receipt_long' },
];
