// All text and data of the Babel Academy of English page (Dublin, Ireland).
// Pure data: no Angular, DOM, storage or regex lookbehind, so the WeChat mini program can reuse it.
// Never add the school's phone, email, street address, website or social accounts here.
import { BABEL_ACCOMMODATIONS, BABEL_DIETS, BABEL_EXTRAS, BABEL_SHORT_COURSES, BABEL_WORK_STUDY_COURSES, BABEL_WORK_STUDY_FEES } from './babel-pricing';

export const BABEL_ROUTE = '/overseas-study-tour/ireland/babel-academy-of-english';

export const BABEL_REFERENCE_NOTE = '以上内容仅供参考，最终解释权归学校；学校可能随时调整课程、活动和住宿安排，以学校最新通知为准。';

export const BABEL_PAGE_COPY = {
  breadcrumb: '海外游学 / 爱尔兰游学 / Babel Academy of English',
  title: 'Babel Academy of English 都柏林市中心语言学校',
  lead: '学校在都柏林市中心，步行约2分钟到圣殿酒吧区和半便士桥，约5分钟到圣三一学院。成人17岁起可报短期英语课程，18岁起可报25周半工半读。',
  tags: [
    { icon: 'location_city', text: '都柏林市中心' },
    { icon: 'groups', text: '每班最多16人' },
    { icon: 'event_available', text: '每周一开课，最短1周' },
    { icon: 'work', text: '25周半工半读' },
  ],
  trustNote: '全体老师有大学学历和CELTA英语教学资格，平均教学经验超过10年；学校参加爱尔兰QQI在读学生保障计划（PEL）。',
  priceCard: {
    label: '短期成人英语',
    price: '每周210欧元起',
    caption: '通用英语下午班学校价格；12周以上学费85折。',
    points: ['注册费50欧元、教材费50欧元起另付', '住宿和接机可在报价里一起算'],
  },
  offerCard: {
    label: '黑五优惠 · 2026年11月30日前报名',
    price: '短期课程每周150欧元起',
    caption: '半工半读25周学费2,300欧元起，最晚可于2028年2月底开课。',
    points: ['注册、教材等其他费用不变', '在线报价已自动按黑五价格计算'],
  },
};

export const BABEL_QUICK_INFO = [
  { icon: 'place', label: '学校位置', value: '都柏林市中心', note: 'Eden Quay 和 Capel Street 两个教学点' },
  { icon: 'person', label: '入学年龄', value: '成人17岁起', note: '半工半读18岁起' },
  { icon: 'groups', label: '班级人数', value: '每班最多16人', note: '英语水平A1–C1分班' },
  { icon: 'event', label: '开课时间', value: '每周一开课', note: '最短报1周；遇公共假期改为周二' },
];

export interface BabelGalleryImage {
  name: string;
  src: string;
  title: string;
  description: string;
}

function photo(name: string, title: string, description: string): BabelGalleryImage {
  return { name, src: `/assets/babel/${name}.webp`, title, description };
}

export const BABEL_GALLERY: BabelGalleryImage[] = [
  photo('school-entrance', '学校门口', '学员和老师在学校门口合影'),
  photo('adult-class-teacher', '成人课堂', '老师带着全班做口语练习'),
  photo('adult-class-discussion', '小组讨论', '成人学员分组讨论'),
  photo('adult-class-pair', '两人练习', '课堂上两人一组练习对话'),
  photo('adult-class-group', '班级合影', '成人班学员和老师合影'),
  photo('capel-street-class', 'Capel Street 教学点', '围坐上课，方便互相交流'),
  photo('capel-street-speaking', '课堂发言', '学员轮流发言，老师现场纠正'),
  photo('class-certificates', '结课证书', '学员拿着结课证书和老师合影'),
  photo('school-corridor', '学校走廊', '教室之间的走廊和公告栏'),
  photo('halloween-party', '万圣节派对', '学校组织的节日社交活动'),
];

export const BABEL_BASIC_INFO = [
  { label: '学校名称', value: 'Babel Academy of English' },
  { label: '所在城市', value: '爱尔兰首都都柏林，市中心' },
  { label: '创办时间', value: '2017年，独立语言学校' },
  { label: '教学点', value: 'Eden Quay 和 Capel Street' },
  { label: '学生来源', value: '巴西、奥地利、德国、蒙古、意大利、墨西哥、阿根廷、日本、西班牙、中国、泰国、法国、智利、哥伦比亚等国家和地区' },
  { label: '资质', value: '参加QQI在读学生保障计划（PEL）；ELT Ireland 会员；2025年 LanguageCourse.net 卓越奖' },
];

export const BABEL_ADVISOR = {
  name: 'Jenny',
  heading: '想在爱尔兰边学边打工，可以先看 Babel',
  text: 'Babel 在都柏林市中心，上课、打工、生活都方便；班级不超过16人，每6周有一次进度测试和老师一对一反馈，还有中文工作人员。短期学员可以每周一入学，报1周也行；想长住的成年学生可以报25周半工半读。',
  advice: '先确定是短期提升还是长期半工半读，再选上午班或下午班；第一次出国建议先订寄宿家庭。',
};

export const BABEL_HIGHLIGHTS = [
  { title: '市中心位置', text: '步行约2分钟到圣殿酒吧区、邮政总局和半便士桥，约5分钟到圣三一学院。' },
  { title: '老师经验足', text: '全体老师有大学学历和CELTA资格，平均教学经验超过10年，以长期合约老师为主。' },
  { title: '进度看得见', text: '每6周一次进度测试，老师一对一反馈；GELNET平台可以随时查看出勤和学习进度。' },
  { title: '有中文支持', text: '驻校学生顾问、中文工作人员和24小时紧急电话，生活上的问题也能找到人。' },
];

export const BABEL_FIT = {
  suitable: [
    { title: '想在欧洲英语国家学英语', text: '爱尔兰以英语为日常语言，同学来自多个国家和地区，课后也在说英语。' },
    { title: '18岁以上想长住', text: '25周半工半读课程，符合爱尔兰相关学生移民许可条件时，可以在规定时间内兼职工作。' },
    { title: '时间灵活的成年人', text: '每周一入学，最短1周，可以选上午班、下午班或30小时强化班。' },
  ],
  lessSuitable: [
    { title: '只想要一对一', text: 'Babel 以小班课为主，一对一按小时另外付费（每小时95欧元）。' },
    { title: '17岁以下', text: '短期成人课程17岁起，半工半读18岁起。' },
    { title: '预算很紧', text: '住宿每周260欧元起，加上学费和机票，建议先用在线报价算清楚。' },
  ],
};

export const BABEL_SHORT_COURSE_ROWS = BABEL_SHORT_COURSES.map(course => ({
  name: course.name,
  english: course.english,
  hours: course.hours,
  schedule: course.schedule,
  level: course.level,
  regular: `${course.regular}欧元`,
  blackFriday: `${course.blackFriday}欧元`,
}));

export const BABEL_COURSE_DETAILS = [
  { title: '通用英语', text: '听、说、读、写和语法词汇一起练，用小组讨论、情景模拟把英语用到生活里。A1 零基础起步。' },
  { title: '雅思备考', text: '听力专项、阅读技巧、学术写作和口语模拟，学考试策略和时间管理。B1+ 起，建议有雅思5.0基础。' },
  { title: '商务英语模块', text: '商务邮件、会议沟通、客户交流、电话和视频会议。B1 起，周二、周四下午上课。' },
  { title: '口语强化模块', text: '日常对话、俚语、动词短语、发音和角色扮演，提高流利度。A2 起，周一、周三下午上课。' },
  { title: '雅思模块', text: '在通用英语之外再加雅思练习：听力、阅读、写作结构和口语模拟。B1 起，周一至周五午间上课。' },
];

export const BABEL_WORK_STUDY_ROWS = BABEL_WORK_STUDY_COURSES.map(course => ({
  name: course.name,
  english: course.english,
  hours: course.hours,
  regular: `${course.regular.toLocaleString('en-US')}欧元`,
  blackFriday: `${course.blackFriday.toLocaleString('en-US')}欧元`,
  renewal: course.renewal,
}));

export const BABEL_WORK_STUDY_FACTS = [
  { label: '课程长度', value: '25周英语课程' },
  { label: '入学要求', value: '18岁以上，英语A1–C1' },
  { label: '每周课时', value: '通用英语每周15小时；也可以选每周20小时（加商务英语、雅思或口语模块）' },
  { label: '打工', value: '符合爱尔兰相关学生移民许可条件的学生，可以在规定时间内兼职工作' },
  { label: '结业考试', value: '课程结束要参加TIE英语考试，学校帮你报名，考试费已在必付费用里' },
];

export const BABEL_WORK_STUDY_FEE_ROWS = [
  { label: '注册费', value: `${BABEL_WORK_STUDY_FEES.registration}欧元` },
  { label: '教材费', value: `${BABEL_WORK_STUDY_FEES.materials}欧元` },
  { label: 'TIE英语考试费', value: `${BABEL_WORK_STUDY_FEES.tieExam}欧元` },
  { label: '学生保障费（Learner Protection）', value: `${BABEL_WORK_STUDY_FEES.learnerProtection}欧元` },
  { label: '医疗保险（学校代办，可选）', value: `${BABEL_WORK_STUDY_FEES.insurance}欧元` },
  { label: '雅思考试费（可选）', value: `${BABEL_WORK_STUDY_FEES.ieltsExam}欧元` },
];

export const BABEL_ACCOMMODATION_ROWS = BABEL_ACCOMMODATIONS.map(item => ({ name: `${item.name}（${item.detail}）`, price: `${item.price}欧元/周` }));

export const BABEL_DIET_ROWS = BABEL_DIETS.filter(diet => diet.price).map(diet => ({ name: diet.name, price: `每周加${diet.price}欧元` }));

export const BABEL_ACCOMMODATION_NOTES = {
  homestay: '住在爱尔兰家庭，每天有早餐和晚餐，可以多练英语、了解当地生活。可选合住房间或单人间。',
  residence: '学生公寓独立卫浴单间，自己做饭，适合喜欢独立生活的成年学生。',
  booking: '订住宿需另付住宿预订费75欧元（一次性，不退）。',
};

export const BABEL_SUPPORT = [
  { icon: 'support_agent', title: '驻校学生顾问', text: '学习和生活问题都可以找学生顾问，非学业问题也会帮忙。' },
  { icon: 'fact_check', title: '每6周进度测试', text: '测试后老师一对一反馈，告诉你哪里进步了、下一步练什么。' },
  { icon: 'translate', title: '中文工作人员', text: '刚到都柏林时可以用中文沟通，减少语言障碍。' },
  { icon: 'phone_in_talk', title: '24小时紧急电话', text: '晚上和周末遇到紧急情况也能联系到学校。' },
  { icon: 'laptop', title: 'GELNET 学习平台', text: '行前指导、出勤、学习目标和进度都在平台上，还有分级题库和牛津大学出版社的数字资源。' },
  { icon: 'celebration', title: '社交和文化活动', text: '参观《凯尔经》、博物馆和美术馆，学生派对、周末短途旅行和爱尔兰文化体验，还有求职指导。' },
];

export const BABEL_FEE_ROWS = [
  { item: '短期课程注册费', amount: '50欧元', note: '一次性，不退' },
  { item: '短期课程教材费', amount: '50／85欧元', note: '1–11周50欧元，12周及以上85欧元' },
  { item: '半工半读注册费', amount: `${BABEL_WORK_STUDY_FEES.registration}欧元`, note: '一次性，不退' },
  { item: '住宿预订费', amount: '75欧元', note: '订住宿时收，不退' },
  { item: '机场接送', amount: `单程${BABEL_EXTRAS.transferOneWay}／往返${BABEL_EXTRAS.transferReturn}欧元`, note: '可选' },
  { item: '社交活动套餐', amount: `每周${BABEL_EXTRAS.socialPerWeek}欧元`, note: '预付，可选' },
  { item: '一对一课', amount: `每小时${BABEL_EXTRAS.oneToOnePerHour}欧元`, note: '可选' },
  { item: '实习安排服务', amount: `${BABEL_EXTRAS.internship}欧元`, note: '无薪工作体验，可选' },
  { item: '交通卡', amount: BABEL_EXTRAS.transportAdult.join('／') + '欧元', note: '1／2／3／4周，公交、火车、电车通用' },
];

export const BABEL_CALENDAR = [
  { date: '1月1日（周五）', title: '元旦', note: '不上课' },
  { date: '2月1日（周一）', title: '圣布里吉德节', note: '当周周二开课' },
  { date: '3月17日（周三）', title: '圣帕特里克节', note: '不上课' },
  { date: '3月29日（周一）', title: '复活节星期一', note: '当周周二开课' },
  { date: '5月3日（周一）', title: '五月公共假期', note: '当周周二开课' },
  { date: '6月7日（周一）', title: '六月公共假期', note: '当周周二开课' },
  { date: '8月2日（周一）', title: '八月公共假期', note: '当周周二开课' },
  { date: '10月25日（周一）', title: '十月公共假期', note: '当周周二开课' },
  { date: '12月18日–次年1月3日', title: '圣诞假期', note: '12月17日（周五）最后一天上课，2028年1月4日（周二）复课' },
];

export const BABEL_REFUND = [
  '开课前4周以上取消：扣除不可退费用后全额退款。',
  '开课前4周内取消：扣除不可退费用后退50%。',
  '开课前24小时内取消或开课以后：不退款；入学后中途退学，无论什么原因都不退款。',
  '签证被拒：提供大使馆拒签信，扣除100欧元手续费和不可退费用后全额退款。拿到签证后，如要取消须至少提前4周通知学校；签证延误时学校保留学费。',
  '不可退费用：注册费（半工半读80欧元，短期课程50欧元）和住宿预订费75欧元。',
  '学校批准退款后，约20个工作日退回原付款账户。',
];

export const BABEL_SIDA_DEPOSIT = '通过思达启航报名时交的2,000元人民币定金不退；入学前4周以上可以申请改期，或保留定金1年。';

export const BABEL_REVIEWS = [
  { who: '奥地利学员', programme: '成人课程 2周', text: '两周里英语进步很明显，寄宿家庭也很好。' },
  { who: '阿根廷学员', programme: '成人课程', text: '学校工作人员很友善，组织的出游也很好玩。' },
];

export const BABEL_SERVICE = [
  { icon: 'route', title: '选课程和日期', text: '按年龄、英语水平和时间推荐短期课程或半工半读。' },
  { icon: 'request_quote', title: '确认学位和报价', text: '向学校确认开课日期、住宿空位和当期价格，费用逐项列清楚。' },
  { icon: 'description', title: '签证和行前准备', text: '提醒签证材料、保险、机票和接机安排，出发前逐项核对。' },
  { icon: 'support_agent', title: '在读期间跟进', text: '学习、住宿或生活上遇到问题，可以找思达启航顾问一起和学校沟通。' },
];

export const BABEL_FAQ = [
  { title: '英语零基础可以报吗？', text: '可以。通用英语A1起，第一天会做分级测试；雅思课程需要B1+，建议有雅思5.0基础。' },
  { title: '最短可以读多久？', text: '短期课程最短1周，每周一开课；遇爱尔兰公共假期，当周改为周二开课。' },
  { title: '半工半读一定能打工吗？', text: '要符合爱尔兰相关学生移民许可条件，才可以在规定时间内兼职工作。具体条件以爱尔兰移民部门最新规定为准，报名前顾问会帮你核对。' },
  { title: 'TIE考试是什么？', text: '半工半读课程结束要参加的英语考试，分笔试（1小时）和口试（30分钟），考前要完成一个小项目、读一本英文书、跟踪一条新闻。学校帮你报名，每月有免费考前辅导。' },
  { title: '上午班和下午班怎么选？', text: '上午班周一至周五09:00–12:15；下午班周一至周四13:00–17:00，价格更低。想下午打工的可以选上午班，想上午安排别的事可以选下午班。' },
  { title: '寄宿家庭还是学生公寓？', text: '第一次出国、想多说英语可以选寄宿家庭（含早晚餐）；习惯独立生活、想自己做饭可以选学生公寓独立卫浴单间。' },
  { title: '黑五优惠怎么用？', text: '2026年11月30日前报名有效。短期课程每周学费下调，半工半读学费2,300欧元起、最晚可于2028年2月底开课；在读学生续读另有优惠总价。具体以学校确认为准。' },
  { title: '学校方便轮椅出入吗？', text: '学校的无障碍政策写明教学楼、教室和卫生间可供轮椅出入，并有电梯；有特殊需要请在报名时告诉顾问，由学校安排。' },
];

export const BABEL_SIDE_NAV = [
  { target: 'gallery', icon: 'photo_library', label: '图片' },
  { target: 'courses', icon: 'menu_book', label: '短期课程' },
  { target: 'work-study', icon: 'work', label: '半工半读' },
  { target: 'accommodation', icon: 'hotel', label: '住宿' },
  { target: 'quote', icon: 'calculate', label: '在线报价' },
  { target: 'fees', icon: 'receipt_long', label: '其他费用' },
  { target: 'calendar', icon: 'event', label: '2027年日历' },
  { target: 'refund', icon: 'policy', label: '退款规定' },
  { target: 'faq', icon: 'help', label: '常见问题' },
];

export const BABEL_MOBILE_ANCHORS = [
  { target: 'courses', icon: 'menu_book', label: '课程' },
  { target: 'work-study', icon: 'work', label: '半工半读' },
  { target: 'accommodation', icon: 'hotel', label: '住宿' },
  { target: 'quote', icon: 'calculate', label: '报价' },
  { target: 'faq', icon: 'help', label: 'FAQ' },
];
