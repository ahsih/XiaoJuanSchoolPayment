// Text and data of the Genius English Academy page, from the school's pack received 2026-11-25: the Chinese
// brochure (2024–2025), the 2026 student rules (学生守则), the September 2026–2027 price list, the 2026 family
// price list (updated 2026-10-30) and the two September–December 2026 offer posters. Photos and videos are in
// genius-page-media.ts. The shared Philippine school template reads both through genius-page-profile.ts.
// Keep it pure data (no Angular, DOM or storage), so the WeChat mini program can reuse it. Never add the school's
// address, website, email, Telegram group, staff names or its nationality chart, and never agency terms.
import type {
  BasicInfoRow,
  CampusPracticalGuide,
  CourseDetailGuide,
  DailyScheduleRow,
  FaqItem,
} from '../cia-school/cia-page-content';
import type { PhOfferCard, PhStudyMode } from '../school-page/ph-school-profile';
import { SCHOOL_REFERENCE_NOTE } from '../school-page/school-reference-note';
import {
  GENIUS_FALL_OFFER,
  GENIUS_FAMILY_IDS,
  GENIUS_PROMO_999,
  GENIUS_RETURNING_RULE_ID,
  GENIUS_SIDA_RULE_ID,
} from './genius-content-config';

/** Closes every content section once; the same line as on every Philippine school page. */
export const GENIUS_REFERENCE_NOTE = SCHOOL_REFERENCE_NOTE;

export const GENIUS_PAGE_TEXT = {
  heroLead: 'Genius 在宿务麦克坦岛的海边，离海滩几步路。一对一由本地老师上，小组课由外教上；可以选常规（没有门禁）、半斯巴达或斯巴达管理，也有带孩子来读的亲子课程。',
  advisorText: 'Genius 是宿务少见的海边学校：宿舍每间都有阳台和小厨房，校内有游泳池、健身房和海滩。课程按每天课时分A、B、C、D，一般英语和强化口语同价，商务和考试课程贵一些。默认是常规管理，没有门禁，适合自律、想边学边体验宿务生活的成人；想被管着学，可以每4周加100美元选半斯巴达，或加125美元选斯巴达。常规课程13岁以上可以报；6岁以上的孩子可以和家长一起报亲子课程，价格已含住宿和三餐。',
  campusIntro: '学校在海边，宿舍、教室、餐厅和设施都在校园内；每间宿舍有阳台、小厨房、冰箱、空调和WiFi。',
  galleryIntro: '按区域查看校园、教室、住宿、餐厅和设施；相册内用左右箭头或缩略图切换，点击主图可放大。',
  coursesIntro: '按学习目标分组，每门课下面是每天的课时；点开可看适合人群和说明。每节课50分钟，周一至周五上课。',
  roomsPhotoIntro: '同一间房会按人数增减床位，房型以入住时学校安排为准；海景房视空房安排。',
  finalCtaTitle: '想确认 Genius 的空房、管理方式和优惠？',
  finalCtaText: '告诉顾问你的入学日期、周数、课程和想住的房型，我们帮你确认空房和优惠，并做一份完整报价。',
} as const;

export const GENIUS_QUICK_INFO = [
  { icon: 'beach_access', title: '海边校园', text: '麦克坦岛海边，校内有海滩和游泳池' },
  { icon: 'record_voice_over', title: '一对一＋外教小组课', text: '一对一由本地老师上，小组课由外教上' },
  { icon: 'tune', title: '管理方式可选', text: '常规没有门禁，也可选半斯巴达或斯巴达' },
  { icon: 'menu_book', title: '课程', text: '一般英语、强化口语、生存英语、商务、托业、托福、雅思' },
  { icon: 'kitchen', title: '房间有厨房和阳台', text: '每间都有小厨房、冰箱、空调和WiFi' },
  { icon: 'family_restroom', title: '亲子课程', text: '孩子每天8节课，价格含住宿和三餐' },
];

/** Key facts under the hero title (compact layout). */
export const GENIUS_OVERVIEW_FACTS: ReadonlyArray<{ icon: string; label: string; value: string }> = [
  { icon: 'location_on', label: '位置', value: '宿务麦克坦岛拉普拉普市 Maribago，海边，离海滩几步路' },
  { icon: 'tune', label: '管理', value: '常规没有门禁；可选半斯巴达（每4周加100美元）或斯巴达（加125美元）' },
  { icon: 'menu_book', label: '课程', value: '一般英语、强化口语、生存英语、商务英语、托业、托福、雅思和亲子课程' },
  { icon: 'record_voice_over', label: '老师', value: '老师都有TESOL证书；一对一由本地老师上，小组课由外教上' },
  { icon: 'bed', label: '住宿', value: '校内单人间到四人间，另有海景房；每间有阳台、小厨房和冰箱' },
  { icon: 'pool', label: '设施', value: '游泳池、健身房、海滩、自习室、休闲吧和每周两次的诊所' },
];

export const GENIUS_BASIC_INFO: BasicInfoRow[] = [
  { label: '学校', value: 'Genius English Academy（天才英语学院）' },
  { label: '位置', value: '菲律宾宿务麦克坦岛拉普拉普市 Maribago' },
  { label: '管理方式', value: '常规（没有门禁）、半斯巴达、斯巴达三选一' },
  { label: '课程', value: '一般英语、强化口语、生存英语、商务英语、托业、托福、雅思、专项英语、亲子课程' },
  { label: '住宿', value: '校内单人间、双人间、三人间、四人间，另有海景房' },
  { label: '入学', value: '周日入住，周一分班测试后开课' },
];

export const GENIUS_SUITABLE_FOR = [
  '想住在海边、边学英语边体验宿务生活的成人',
  '自律、不想被门禁管着的学生',
  '想多上一对一的学生（B课程每天6节一对一）',
  '带孩子来读书的家长',
];

export const GENIUS_NOT_SUITABLE_FOR = [
  '想要严格封闭管理、又不想另付管理费的学生',
  '想报雅思保分课程的学生（价格表上没有）',
];

/**
 * Semi-Sparta and Sparta from the brochure and the 2026 student rules (the rules' curfew times win over the
 * older brochure). Regular is the default and has no curfew, so it is described in the section note.
 */
export const GENIUS_STUDY_MODES: PhStudyMode[] = [
  {
    code: '斯巴达',
    name: '严格管理，每4周加125美元',
    title: '适合想快速提高、需要被督促的学生',
    contrastTitle: '斯巴达的强制学习时段',
    timeBlocks: [
      { label: '早晨单词测试', time: '周一至周五 07:30–08:00', text: '每天考新单词', icon: 'wb_sunny', type: 'required' },
      { label: '作业与选修课', time: '18:00–20:30', text: '完成作业，参加选修课', icon: 'edit_note', type: 'required' },
      { label: '自主学习', time: '20:30–23:00', text: '可选，按自己的节奏复习', icon: 'menu_book', type: 'flexible' },
      { label: '周末外出', time: '每周成绩80%以上', text: '低于80%留校完成额外作业', icon: 'directions_walk', type: 'required' },
    ],
    curfew: [
      { day: '周一至周五', time: '不能外出' },
      { day: '周六', time: '可外出，没有门禁' },
      { day: '周日', time: '23:00前回校' },
    ],
  },
  {
    code: '半斯巴达',
    name: '弹性管理，每4周加100美元',
    title: '想集中学习，也想留一些自由时间的学生',
    contrastTitle: '半斯巴达的学习要求',
    timeBlocks: [
      { label: '早晨单词测试', time: '周一至周五 07:30–08:00', text: '每天考新单词', icon: 'wb_sunny', type: 'required' },
      { label: '作业时间', time: '每天2小时', text: '完成作业、复习当天课程', icon: 'edit_note', type: 'required' },
      { label: '平日外出', time: '每周成绩70%以上', text: '低于70%平日不能外出', icon: 'directions_walk', type: 'flexible' },
    ],
    curfew: [
      { day: '周日至周四', time: '23:00前回校' },
      { day: '周五、周六', time: '没有门禁' },
      { day: '假日前一天', time: '没有门禁' },
    ],
  },
];

export const GENIUS_STUDY_MODE_COPY = {
  title: '常规、半斯巴达还是斯巴达？',
  intro: '报名时选管理方式，课程和价格不变，只是管理费和外出规定不同。每周成绩按出勤、课堂参与、作业和测试计算。',
  note: '不选就是常规：没有门禁，只需遵守23:00–06:00的安静时段；单词测试和月考自愿参加。半斯巴达和斯巴达学生必须有带流量的当地电话卡，出校时把通行卡交给保安并说明去哪里。',
};

/**
 * Weekday timetable from the brochure's sample (classes 50 minutes). A courses have 6 classes a day and library
 * (homework) time in the afternoon; B courses have 2 more one-to-one classes instead.
 */
export const GENIUS_SCHEDULE: DailyScheduleRow[] = [
  { time: '07:00–08:00', activity: '早餐', kind: 'meal' },
  { time: '07:30–08:00', activity: '单词测试（半斯巴达、斯巴达必须参加）', kind: 'test' },
  { time: '08:00–08:50', activity: '第1节课', kind: 'class' },
  { time: '09:00–09:50', activity: '第2节课', kind: 'class' },
  { time: '10:00–10:50', activity: '第3节课', kind: 'class' },
  { time: '11:00–11:50', activity: '第4节课', kind: 'class' },
  { time: '12:00–13:00', activity: '午餐', kind: 'meal' },
  { time: '13:00–13:50', activity: '第5节课', kind: 'class' },
  { time: '14:00–14:50', activity: '第6节课', kind: 'class' },
  { time: '15:00–16:50', activity: 'A课程：图书馆时间（做作业）／B课程：第7、8节课', kind: 'class' },
  { time: '17:00–18:00', activity: '晚餐', kind: 'meal' },
  { time: '18:00–20:30', activity: '斯巴达：作业与选修课；电影之夜每周二、周四', kind: 'activity' },
  { time: '20:30–23:00', activity: '自由时间或自主学习', kind: 'free' },
];

export const GENIUS_COURSE_GROUPS = [
  { icon: 'forum', title: '一般英语／强化口语', text: '本地老师一对一＋外教小组课，按课时分A–D', courseIds: ['ge-a', 'ge-b', 'ge-c', 'ge-d'] },
  { icon: 'storefront', title: '生存英语', text: '给初学者，有超市、咖啡馆等户外实践课', courseIds: ['survival-a', 'survival-b'] },
  { icon: 'business_center', title: '商务与考试英语', text: '商务英语、托业、托福、雅思、专项英语', courseIds: ['exam-a', 'exam-b'] },
  { icon: 'family_restroom', title: '亲子课程', text: '价格含学费、住宿和三餐', courseIds: [...GENIUS_FAMILY_IDS] },
];

export const GENIUS_COURSE_DETAIL_GUIDES: CourseDetailGuide[] = [
  {
    icon: 'forum',
    title: '一般英语和强化口语',
    subtitle: '报名时二选一，价格相同',
    courseIds: ['ge-a', 'ge-b', 'ge-c', 'ge-d'],
    facts: [
      { label: '一般英语', value: '口语、听力、阅读、写作全面提高，适合所有水平；用新闻、视频和对话等真实材料上课' },
      { label: '强化口语', value: '练面试、视频日志、小组讨论、舞台演讲和演示，课上给出改进建议' },
      { label: '开课前', value: '一对一面谈和分级测试，老师按水平和目标安排课程' },
      { label: '老师', value: '一对一由本地老师上，小组课由外教上' },
    ],
    points: ['定期评估学习进度，告诉你哪里进步、哪里还要加强。'],
  },
  {
    icon: 'storefront',
    title: '生存英语',
    subtitle: '给初学者的实用课程',
    courseIds: ['survival-a', 'survival-b'],
    facts: [
      { label: '重点', value: '日常交流的基本能力，也适合想去旅行的学生' },
      { label: '户外课堂', value: '老师带着在超市、咖啡馆、药房等真实场景里练习' },
    ],
    points: [],
  },
  {
    icon: 'business_center',
    title: '商务与考试英语',
    subtitle: '报名时选一个方向，价格相同',
    courseIds: ['exam-a', 'exam-b'],
    facts: [
      { label: '商务英语', value: '求职面试、写专业邮件、做商务演示和行业用语' },
      { label: '托业', value: '听力、阅读和职场交流，做模拟测试和备考策略' },
      { label: '托福', value: '阅读、听力、口语和写作，做全真模拟和个别反馈' },
      { label: '雅思', value: '所有考试部分，做模拟测试、学答题策略并有个别反馈' },
      { label: '专项英语', value: '具体方向报名前请和顾问确认' },
    ],
    points: [],
  },
  {
    icon: 'family_restroom',
    title: '亲子课程怎么报',
    subtitle: '家长和孩子一起来读',
    courseIds: [...GENIUS_FAMILY_IDS],
    facts: [
      { label: '年龄', value: '孩子6岁以上可以参加；13岁以上也可以报常规课程' },
      { label: '孩子', value: '每天8节：一对一4节、小组课2节、特色课2节（音乐和美术），每节50分钟' },
      { label: '家长', value: '可以上课（每天一对一2节、小组课2节），也可以只陪读不上课' },
      { label: '价格', value: '每人一个价格，已含学费、住宿和三餐；同一家庭2个及以上孩子，每个孩子更便宜' },
      { label: '周数', value: '价格表有1–8周和12周' },
    ],
    points: ['亲子课程按学校2026年价格表；2027年入学的价格以学校确认为准。'],
  },
  {
    icon: 'add_circle',
    title: '加课和管理方式',
    subtitle: '每4周的附加费用',
    facts: [
      { label: '每天加1节一对一', value: '每4周125美元' },
      { label: '每天加1节小组课', value: '每4周100美元' },
      { label: '半斯巴达／斯巴达', value: '每4周100美元／125美元' },
      { label: '未成年独自来读', value: '每4周100美元管理费' },
    ],
    points: [],
  },
  {
    icon: 'quiz',
    title: '分班、考试与换课',
    subtitle: '所有课程',
    facts: [
      { label: '第一天', value: '分班测试和口语面试，第一周周一发课表' },
      { label: '月考', value: '第4周周三考；半斯巴达和斯巴达必须参加，常规课程自愿' },
      { label: '结业测试', value: '读4周以上包含在课程里；读2–3周想考要申请' },
      { label: '每周测试', value: '每周五考本周内容' },
      { label: '换课表或老师', value: '要有正当理由，周四交申请，批准后下周一生效' },
      { label: '换课程', value: '周三至周五申请，下周一生效；不能换成更便宜的课程' },
    ],
    points: ['学校会按人数调整课时、合并小班或调换班级。'],
  },
  {
    icon: 'event_available',
    title: '出勤、迟到与证书',
    subtitle: '所有课程',
    facts: [
      { label: '证书学时', value: '按实际上的课计算；单词测试和电影课也计入' },
      { label: '迟到', value: '一对一迟到15分钟算缺勤，30分钟以上不上；小组课迟到5分钟不能进教室' },
      { label: '缺课', value: '要提前书面请假；没请假第4次起每次罚500比索' },
      { label: '补课', value: '自己缺课、迟到不补；老师请假有代课老师' },
      { label: '假日', value: '菲律宾法定和地方假日不上课，不补课' },
    ],
    points: [
      '在线系统可以随时看自己的出勤、每周成绩和学习时数。',
      '近期平日的菲律宾法定假日：2026年11月30日、12月25日、12月30日；2027年1月1日、3月25–26日、4月9日、8月30日、11月30日、12月24日、12月30日。临时增加的假日和地方假日以菲律宾政府公告和学校通知为准。',
    ],
  },
];

export const GENIUS_DORM_RULES = [
  { title: '门禁', text: '常规课程没有门禁；半斯巴达周日至周四23:00；斯巴达平日不能外出、周日23:00。未成年学生和团体另按学校安排。' },
  { title: '违反门禁', text: '保安在通行卡上打孔：1个孔口头警告，2–4个孔书面警告，5个孔退学。' },
  { title: '安静时段', text: '每天23:00至次日06:00不大声喧哗；双人间、三人间里不打电话，听音乐看视频用耳机。室友投诉第一次书面警告，之后每次罚2,000比索。' },
  { title: '访客与异性', text: '没登记的访客不能进房间或留宿；异性学生不能进彼此房间，第一次罚2,000比索，第二次退学且不退费。' },
  { title: '吸烟与喝酒', text: '房间和教室禁烟；单人间可以在阳台吸烟（关好阳台门），多人间只能去校内吸烟区。校内禁止喝酒。' },
  { title: '水电与清洁', text: '离开房间关空调和灯，开空调时不开阳台门；水龙头没关好罚1,000比索；共用房间不打扫，经核实罚1,000比索。' },
  { title: '钥匙与赔偿', text: '退房时把钥匙交回前台，丢失收2,000比索；损坏东西按维修或更换费用赔偿。' },
  { title: '换房', text: '入住前4周原则上不换房，要经理和前台同意；换到不同房型按新房型价格算。' },
  { title: '自己准备', text: '餐具、毛巾、洗漱用品要自己带；衣架每人5个；学校不提供煤气罐或做饭的燃料。' },
];

export const GENIUS_PRACTICAL_GUIDES: CampusPracticalGuide[] = [
  {
    icon: 'schedule',
    eyebrow: 'OPENING HOURS',
    title: '用餐与设施开放时间',
    facts: [
      { label: '餐厅', value: '每天三餐，本地和国际口味' },
      { label: '休闲吧', value: '平日07:00–22:00，周末10:00–22:00；游戏免费玩1小时，之后每小时100比索' },
      { label: '自习室', value: '07:00–23:00' },
      { label: '游泳池', value: '09:00–22:00' },
      { label: '健身房', value: '08:00–23:00' },
      { label: '海滩', value: '08:00–18:00' },
      { label: '活动大厅', value: '18:00–21:00' },
      { label: '儿童房', value: '08:00–15:00' },
      { label: '诊所', value: '每周开放两次，可以看医生' },
    ],
    note: '前台24小时有人。开放时间可能调整，以学校通知为准。',
  },
  {
    icon: 'cleaning_services',
    eyebrow: 'ROOM SERVICES',
    title: '打扫、洗衣与房间',
    facts: [
      { label: '打扫', value: '每周2次，按学校时间表；只打扫地面、垃圾桶、卫生间和桌面，自己的锅碗要自己洗' },
      { label: '床单', value: '每周换1次' },
      { label: '洗衣', value: '每周2次，周一至周六08:00–17:00按分配的时间送洗；自己分好颜色、掏空口袋，贵重衣物不要送洗' },
      { label: '房间', value: '有小厨房、冰箱、空调、WiFi、阳台和冷热水淋浴；每间有保险箱，饮用水不限量' },
    ],
    note: '房间有问题（水管、空调、灯）马上告诉前台。',
  },
  {
    icon: 'rule',
    eyebrow: 'CAMPUS RULES',
    title: '校内规定',
    facts: [
      { label: '学生证', value: '校内要一直佩戴，没戴不能进教室' },
      { label: '通行卡', value: '出校时交给保安，回来时领回' },
      { label: '主大厅', value: '18:00–22:00只说英语，违者罚100比索' },
      { label: '公共区域', value: '自习室、大厅、休闲吧和餐厅里不能把东西放着不管，被收走后领回罚1,000比索' },
      { label: '自习室', value: '不能睡觉、聊天或给充电宝充电，违者可能罚2,000比索' },
    ],
    note: '',
  },
  {
    icon: 'luggage',
    eyebrow: 'BEFORE YOU GO',
    title: '到校与费用',
    facts: [
      { label: '抵达', value: '周日入住，在前台交护照和押金' },
      { label: '电费', value: '按电表计，每度18比索，每周六交' },
      { label: '电话卡', value: '半斯巴达和斯巴达学生必须有带流量的当地电话卡' },
      { label: '签证', value: 'SSP和签证延期由学校代办，费用为学校估算' },
    ],
    note: '入境和签证材料由思达启航顾问逐项帮你核对；eTravel入境登记也由顾问协助填写。',
  },
];

/** Refund rules after arrival from the 2026 student rules, plus 思达启航's own deposit rule. */
export const GENIUS_REFUND_COPY = {
  summaryTitle: 'Genius 取消、改期与退款规定',
  summaryHint: '报名定金、改期、到校后的退款比例和不退款的情况',
  eyebrow: 'CANCELLATION & REFUND',
  title: 'Genius 退款规定',
  intro: '到校后按已读的周数算退款；注册费任何情况下都不退。',
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
      note: '注册费（125美元）任何情况下都不退。',
      rules: [
        { when: '读了不到总周数的一半', text: '退还剩余周数学费和住宿费的30%。' },
        { when: '读了一半以上', text: '不退款。' },
        { when: '不退的费用', text: 'SSP、ACR I-Card、签证延期费和教材；押金在正式申请退房一周后退还，扣除损坏赔偿或未付款项。' },
        { when: '本人重病、直系亲属重病或去世、重大事故', text: '有证明文件时，退还未使用住宿费的50%，不论已经住了多久。' },
      ],
      footnote: '',
    },
    {
      title: '不退款的情况',
      note: '',
      rules: [
        { when: '被学校开除', text: '严重违反宿舍规定或行为不当被开除的，不退款。' },
        { when: '换到更便宜的房型', text: '不退差价；有空房时可以换回单人间，按新价格算。' },
        { when: '航班、天灾和私自外出', text: '航班延误或取消、台风地震等天灾、未经允许的校外活动中的损失，学校不退款也不补偿。' },
        { when: '手续费', text: '退款的银行手续费从退款金额中扣除。' },
      ],
      footnote: GENIUS_REFERENCE_NOTE,
    },
  ],
};

/** Current offers above the quote; each card hides itself from its `until` date or when its rule is switched off. */
export const GENIUS_OFFERS: PhOfferCard[] = [
  {
    icon: 'loyalty',
    title: '思达启航9折',
    amount: '学费和住宿费9折',
    text: '通过思达启航报名，课程费和住宿费都打9折，亲子课程和海景房也一样。',
    detail: '先打9折，再减学校优惠，可以和9–12月特别优惠、999美元推广价叠加；注册费、管理费、加课费和学杂费不打折。',
    promotionIds: [GENIUS_SIDA_RULE_ID],
  },
  {
    icon: 'campaign',
    title: '999美元推广价',
    amount: '4周999美元',
    text: '一般英语或强化口语A＋四人间，2026年9–12月就读整4周，11月30日前报名。',
    detail: '海景四人间另加125美元；每周在社交媒体点赞分享学校帖子2次、在中国社交媒体发4条快拍；注册费和学杂费另付；不和学校其他优惠同享，可以再享思达启航9折。',
    until: '2026-12-01',
    promotionIds: [GENIUS_PROMO_999.id],
  },
  {
    icon: 'local_offer',
    title: '9–12月特别优惠',
    amount: '每4周减200美元',
    text: '正常课程在2026年9–12月上课，每读满4周减200美元。',
    detail: '亲子课程不参加；不和999美元推广价同享，可以和思达启航9折叠加。',
    until: '2026-12-07',
    promotionIds: [GENIUS_FALL_OFFER.id],
  },
  {
    icon: 'replay',
    title: '老学员返校',
    amount: '免注册费',
    text: '在 Genius 读过的学生再回来，免收125美元注册费。',
    promotionIds: [GENIUS_RETURNING_RULE_ID],
  },
];

export const GENIUS_OFFERS_COPY = {
  eyebrow: 'CURRENT OFFERS',
  title: 'Genius 报名优惠',
  intro: '报价器会按你的日期和选择自动计算。',
};


export const GENIUS_FAQS: FaqItem[] = [
  { question: 'Genius 在哪里？', answer: '在宿务麦克坦岛拉普拉普市的 Maribago，学校在海边，离海滩几步路；机场接机每人18美元。' },
  { question: 'Genius 有门禁吗？', answer: '默认的常规管理没有门禁，只需遵守23:00–06:00的安静时段。想被管着学，可以选半斯巴达（每4周加100美元，周日至周四23:00门禁，每周成绩70%以上平日才能外出）或斯巴达（每4周加125美元，平日不能外出，周日23:00门禁，每周成绩80%以上周末才能外出）。' },
  { question: '课程A、B、C、D有什么区别？', answer: `A每天6节（一对一4节＋小组课2节），B每天8节（一对一6节＋小组课2节），C每天4节一对一，D每天4节（一对一2节＋小组课2节）。一般英语和强化口语有A–D四种，生存英语和商务／考试课程有A、B两种。` },
  { question: '可以带孩子一起来吗？', answer: '可以报亲子课程，孩子6岁以上可以参加（13岁以上也可以报常规课程）：孩子每天8节课（含音乐和美术特色课），家长可以上课，也可以只陪读。价格按人算，已含学费、住宿和三餐，同一家庭2个以上孩子每个孩子更便宜。' },
  { question: '现在报名有什么优惠？', answer: '通过思达启航报名，课程费和住宿费都打9折，可以和学校优惠叠加。2026年9–12月上课的正常课程每读满4周再减200美元；11月30日前报名，还可以选999美元推广价（一般英语或强化口语A＋四人间，9–12月读整4周，须在社交媒体分享），两者不同享。老学员返校免注册费。报价器会按你的日期自动计算。', until: '2027-01-01' },
  { question: '到校学杂费大概多少？', answer: '按30天签证读4周A课程：SSP约11,800比索，教材、维护、洗衣和水费共约128美元；另交押金100美元，电费按电表每周六交。读到第5周要续签，费用按停留周数增加。报价器会按你的周数和签证算出明细。' },
  { question: '页面上的报价包含全部费用吗？', answer: '学校费用包含注册费、课程费、住宿费和你选的加课或管理费，并自动扣除优惠；到校学杂费单独列出，押金、接机和电费另外准备。两者分开显示，不相加。' },
  { question: '思达启航会协助签证和入境吗？', answer: '会。通过思达启航报名，顾问会免费协助菲律宾入境和签证相关手续，包括eTravel入境登记，你只需要按顾问指引准备个人资料。' },
];

export const GENIUS_FINAL_CTA_BADGES = ['免费选校建议', '确认空房和优惠', '签证与入境协助'];
