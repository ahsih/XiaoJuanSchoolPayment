import { CiaContentConfig, CiaMediaContent, CiaPromotionRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import {
  JIC_COURSE_FEES,
  JIC_LOCAL_FEE_COPY,
  JIC_PEAK_FEE_PER_WEEK,
  JIC_PROMOTION_COPY,
  JIC_REGISTRATION_FEE,
  JIC_ROOM_FEES,
  JicCampus,
} from './jic-pricing';

const promotion = (id: string, name: string, ruleKind: string, sortOrder: number): CiaPromotionRule => ({
  id,
  name,
  ruleKind,
  description: '',
  enabled: true,
  sortOrder,
  priority: 10 + sortOrder,
  stackable: true,
  newStudentsOnly: false,
  discountType: 'fixed',
  discountValue: 0,
  appliesTo: 'school-total',
  waiveRegistration: false,
  minimumCourseWeeks: 4,
  minimumAccommodationWeeks: 0,
  coverageTarget: 'none',
});

const twinAndQuadRoomIds = JIC_ROOM_FEES.filter(room => room.category !== 'single').map(room => room.id);

const staticMedia = (
  order: number,
  campus: 'challenger' | 'premium',
  category: 'Campus' | 'Classroom' | 'Accommodation' | 'Dining' | 'Facility',
  caption: string,
  altText: string,
  url: string,
  contentType = 'image/webp',
): CiaMediaContent => ({
  id: `jic-static-${String(order + 1).padStart(3, '0')}`,
  schoolId: 'b9eb0a1e-1b2a-4e9f-8f63-0bd6f0c4417a',
  url,
  originalFileName: url.split('/').pop(),
  contentType,
  category,
  caption,
  altText,
  displayOrder: order,
  campus,
  isActive: true,
});

/** School-issued September 2026 media, partitioned so both JIC pages are manageable from one school record. */
export const JIC_DEFAULT_MEDIA: CiaMediaContent[] = [
  staticMedia(0, 'challenger', 'Campus', 'Challenger 挑战校区官方介绍片', '学校最新有声官方介绍片，完整展示挑战校区的学习与生活环境。', '/assets/philippines/jic-challenger-campus-intro.mp4', 'video/mp4'),
  staticMedia(1, 'challenger', 'Campus', 'Challenger 校园航拍', '菲律宾碧瑶JIC语言学校 Challenger 校区整体环境。', '/assets/philippines/jic-campus-hero.webp'),
  staticMedia(2, 'challenger', 'Campus', 'Challenger 校区全景', 'Challenger／Main校区整体视角。', '/assets/philippines/jic-main-campus-overview.webp'),
  staticMedia(3, 'challenger', 'Campus', 'Challenger 校园中庭', '校舍、中庭与户外休息空间。', '/assets/philippines/jic-challenger-campus-courtyard.webp'),
  staticMedia(4, 'challenger', 'Classroom', 'Challenger 一对一教室', '学校课堂资料中的独立一对一教室实景。', '/assets/philippines/jic-challenger-one-on-one-classroom.webp'),
  staticMedia(5, 'challenger', 'Classroom', 'Challenger 一对一教学区', '多间独立一对一教室组成的教学区。', '/assets/philippines/jic-challenger-one-on-one-area.webp'),
  staticMedia(6, 'challenger', 'Classroom', 'Challenger 团体教室', '学校课堂资料中的标准团体课教室。', '/assets/philippines/jic-challenger-group-classroom.webp'),
  staticMedia(7, 'challenger', 'Classroom', 'Challenger 团体课堂实景', '团体课教室与学生课堂活动实景。', '/assets/philippines/jic-challenger-active-group-class.webp'),
  staticMedia(8, 'challenger', 'Classroom', 'Challenger 小组课教室', '适合小组讨论与互动课程的教室空间。', '/assets/philippines/jic-challenger-small-group-classroom.webp'),
  staticMedia(9, 'challenger', 'Classroom', 'Challenger 教学实景', 'East Building Classrooms资料中的教师授课场景。', '/assets/philippines/jic-challenger-teaching-scene.webp'),
  staticMedia(10, 'challenger', 'Classroom', 'Challenger 电脑教室', '配备电脑的学习与测试空间。', '/assets/philippines/jic-challenger-computer-room.webp'),
  staticMedia(11, 'challenger', 'Classroom', 'Challenger 口语测试区', '独立电脑口语测试席位。', '/assets/philippines/jic-challenger-speaking-test-room.webp'),
  staticMedia(12, 'challenger', 'Accommodation', 'Challenger 标准单人房（R1 Studio）', '标准单人房实景。', '/assets/philippines/jic-challenger-single-room.webp'),
  staticMedia(13, 'challenger', 'Accommodation', 'Challenger 标准单人房视频', 'R1 Studio学校原始房型实拍（原素材无配音）。', '/assets/philippines/jic-challenger-room-tour.mp4', 'video/mp4'),
  staticMedia(14, 'challenger', 'Accommodation', 'Challenger 标准双人房（R2 Studio）', '标准双人房实景。', '/assets/philippines/jic-challenger-double-room.webp'),
  staticMedia(15, 'challenger', 'Accommodation', 'Challenger 标准双人房视频', 'R2 Studio学校原始房型实拍（原素材无配音）。', '/assets/philippines/jic-challenger-double-room-video.mp4', 'video/mp4'),
  staticMedia(16, 'challenger', 'Accommodation', 'Challenger 四人复式房（R4 Loft）', '上下层复式四人房实景。', '/assets/philippines/jic-challenger-quad-duplex-room.webp'),
  staticMedia(17, 'challenger', 'Accommodation', 'Challenger 四人复式房视频', 'R4 Loft学校原始房型实拍（原素材无配音）。', '/assets/philippines/jic-challenger-quad-duplex-room-video.mp4', 'video/mp4'),
  staticMedia(18, 'challenger', 'Accommodation', 'Challenger 四人上下铺房（R4 Studio）', '标准四人上下铺房实景。', '/assets/philippines/jic-challenger-quad-bunk-room.webp'),
  staticMedia(19, 'challenger', 'Accommodation', 'Challenger 四人上下铺房视频', 'R4 Studio学校原始房型实拍（原素材无配音）。', '/assets/philippines/jic-challenger-quad-bunk-room-video.mp4', 'video/mp4'),
  staticMedia(20, 'challenger', 'Dining', 'Challenger 室内餐厅', '学校餐厅资料中的室内用餐空间。', '/assets/philippines/jic-challenger-cafeteria-indoor.webp'),
  staticMedia(21, 'challenger', 'Dining', 'Challenger 户外用餐区', '餐厅旁的半户外用餐与交流空间。', '/assets/philippines/jic-challenger-cafeteria-outdoor.webp'),
  staticMedia(22, 'challenger', 'Dining', 'Challenger 校餐实拍', '学校餐食资料中的一餐实拍，实际菜单以当期安排为准。', '/assets/philippines/jic-challenger-meal-set.webp'),
  staticMedia(23, 'challenger', 'Dining', 'Challenger 餐食参考', '学校展示的餐食搭配与菜品，实际供应会随菜单调整。', '/assets/philippines/jic-challenger-meal-variety.webp'),
  staticMedia(24, 'challenger', 'Facility', 'Challenger 公共厨房', '公共厨房配有烹饪区、水槽、餐具及常用电器。', '/assets/philippines/jic-challenger-common-kitchen.webp'),
  staticMedia(25, 'challenger', 'Facility', 'Challenger 公共厨房使用场景', '学生使用公共厨房进行简单烹饪的实景。', '/assets/philippines/jic-challenger-common-kitchen-use.webp'),
  staticMedia(26, 'challenger', 'Facility', 'Challenger 健身房', '校内健身房配有跑步机、综合训练器和自由重量器材。', '/assets/philippines/jic-challenger-gym.webp'),
  staticMedia(27, 'challenger', 'Facility', 'Challenger 运动场', '校内篮球、羽毛球等户外活动场地。', '/assets/philippines/jic-challenger-sports-court.webp'),
  staticMedia(28, 'challenger', 'Facility', 'Challenger K-Mart校内商店', '校内商店提供零食、饮料及常用生活用品。', '/assets/philippines/jic-challenger-campus-store.webp'),
  staticMedia(29, 'challenger', 'Facility', 'Challenger Terminal Cafe', '校内咖啡厅与课后交流空间。', '/assets/philippines/jic-challenger-terminal-cafe.webp'),
  staticMedia(30, 'challenger', 'Facility', 'Challenger West Garden安静区', 'West Garden户外桌椅与安静交流区域。', '/assets/philippines/jic-challenger-west-garden.webp'),
  staticMedia(31, 'challenger', 'Accommodation', 'Challenger Loft房型', 'Main Campus Rooms资料展示的Loft住宿空间。', '/assets/philippines/jic-main-room-loft.webp'),
  staticMedia(32, 'challenger', 'Facility', 'Challenger 自习与Library', '适合IELTS与长期备考学生的Library学习空间。', '/assets/philippines/jic-main-library.webp'),
  staticMedia(33, 'premium', 'Campus', 'Premium 高级校区官方介绍片', '学校最新有声官方介绍片，完整展示Premium校区的课堂、住宿与生活环境。', '/assets/philippines/jic-premium-campus-intro.mp4', 'video/mp4'),
  staticMedia(34, 'premium', 'Campus', 'JIC Premium Campus环境', 'Premium校区学习生活环境。', '/assets/philippines/jic-premium-campus-overview.jpg', 'image/jpeg'),
  staticMedia(35, 'premium', 'Classroom', 'Premium 小组互动课堂', 'Active Learning小组课堂实景。', '/assets/philippines/jic-premium-group-class.webp'),
  staticMedia(36, 'premium', 'Accommodation', 'Premium 单人间（无阳台）', 'Semi Single无阳台单人雅房实景。', '/assets/philippines/jic-premium-single-no-balcony.webp'),
  staticMedia(37, 'premium', 'Accommodation', 'Premium 单人间（无阳台）视频', 'Semi Single学校原始房型实拍（原素材无配音）。', '/assets/philippines/jic-premium-room-tour.mp4', 'video/mp4'),
  staticMedia(38, 'premium', 'Accommodation', 'Premium 单人间（带阳台）', '带阳台独立单人房实景。', '/assets/philippines/jic-premium-single-balcony.webp'),
  staticMedia(39, 'premium', 'Accommodation', 'Premium 单人间（带阳台）视频', '学校原始Premium Single Room房型实拍（原素材无配音）。', '/assets/philippines/jic-premium-single-balcony-video.mp4', 'video/mp4'),
  staticMedia(40, 'premium', 'Accommodation', 'Premium 双人间（无阳台）', '无阳台双人房实景。', '/assets/philippines/jic-premium-twin-no-balcony.webp'),
  staticMedia(41, 'premium', 'Accommodation', 'Premium 双人间（无阳台）视频', '学校原始双人房实拍（原素材无配音）。', '/assets/philippines/jic-premium-twin-no-balcony-video.mp4', 'video/mp4'),
  staticMedia(42, 'premium', 'Accommodation', 'Premium 双人间（带阳台）', '带阳台双人房实景。', '/assets/philippines/jic-premium-twin-balcony.webp'),
  staticMedia(43, 'premium', 'Accommodation', 'Premium 双人间（带阳台）视频', '学校原始双人房实拍（原素材无配音）。', '/assets/philippines/jic-premium-twin-balcony-video.mp4', 'video/mp4'),
  staticMedia(44, 'premium', 'Accommodation', 'Premium 四人间（无阳台）', '无阳台四人上下铺房实景。', '/assets/philippines/jic-premium-quad-no-balcony.webp'),
  staticMedia(45, 'premium', 'Accommodation', 'Premium 四人间（无阳台）视频', '学校原始四人房实拍（原素材无配音）。', '/assets/philippines/jic-premium-quad-no-balcony-video.mp4', 'video/mp4'),
  staticMedia(46, 'premium', 'Accommodation', 'Premium 四人间（带阳台）', '带阳台四人上下铺房实景。', '/assets/philippines/jic-premium-quad-balcony.webp'),
  staticMedia(47, 'premium', 'Accommodation', 'Premium 四人间（带阳台）视频', '学校原始四人房实拍（原素材无配音）。', '/assets/philippines/jic-premium-quad-balcony-video.mp4', 'video/mp4'),
  staticMedia(48, 'premium', 'Accommodation', 'Premium 四人房', 'Premium Campus Rooms资料展示的四人房。', '/assets/philippines/jic-premium-quad-room.webp'),
  staticMedia(49, 'premium', 'Dining', 'Premium 校区餐食', 'Premium Cafeteria & Meals资料展示的学校餐食。', '/assets/philippines/jic-premium-meal.webp'),
  staticMedia(50, 'premium', 'Dining', 'Premium Cafe', '校内Cafe课后休息和交流空间。', '/assets/philippines/jic-premium-cafe.webp'),
  staticMedia(51, 'premium', 'Facility', 'Premium Student Center', '学生中心与休息空间。', '/assets/philippines/jic-premium-student-center.webp'),
];

export const createDefaultJicContentConfig = (): CiaContentConfig => {
  const content: CiaContentConfig = {
  schemaVersion: 1,
  schoolCode: 'JIC',
  courses: JIC_COURSE_FEES.map((item, index) => ({
    id: item.id,
    name: item.displayName,
    englishName: item.name,
    courseType: item.campus === 'challenger' ? 'Challenger 挑战校区' : 'Premium 高级校区',
    campus: item.campus,
    tuition: item.tuition,
    tuition2027: item.tuition,
    schedule: item.suitable,
    suitable: item.suitable,
    note: item.suitable,
    minimumWeeks: 1,
    allowedWeeks: [1, 2, 3, 4, 6, 8, 12, 16, 20, 24],
    enabled: true,
    sortOrder: index,
  })),
  rooms: JIC_ROOM_FEES.map((item, index) => ({
    id: item.id,
    name: item.name,
    label: item.name,
    code: item.category,
    location: '校内',
    group: item.campus === 'challenger' ? 'Challenger 挑战校区' : 'Premium 高级校区',
    campus: item.campus,
    fee: item.fee,
    single: item.category === 'single',
    note: item.note,
    enabled: true,
    sortOrder: index,
  })),
  localFees: [
    { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', includeInTotal: true, note: '移民局收取，按报名学习时长办理；续费及换校需要重新办理。', enabled: true, sortOrder: 0 },
    { id: 'ssp-e-card', name: 'SSP-E CARD', currency: 'PHP', amount: 4500, billingRule: 'once', includeInTotal: true, note: '移民局收取，入学时与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 },
    { id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', includeInTotal: true, note: '30天旅游签证学习超过4周，或59天旅游签证学习达到8周时，在首次续签时办理，只收一次。', enabled: true, sortOrder: 2 },
    { id: 'maintenance', name: '维护管理费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '校内教学楼及其他设施维护费；超过4周按实际周数比例预估。', enabled: true, sortOrder: 3 },
    { id: 'utilities', name: '水电费', currency: 'PHP', amount: 3000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '超过4周按实际周数比例预估。', enabled: true, sortOrder: 4 },
    { id: 'manila-pickup', name: '马尼拉机场接机', currency: 'PHP', amount: 3000, billingRule: 'selected-manila-pickup', includeInTotal: true, note: '周日BESA团体接机3,000比索；非BESA接机参考：1人12,000、2人6,000／人、3人以上4,000／人，需顾问确认班次。', enabled: true, sortOrder: 5 },
    { id: 'clark-pickup', name: '克拉克机场接机', currency: 'PHP', amount: 2500, billingRule: 'selected-clark-pickup', includeInTotal: true, note: '周日BESA团体接机2,500比索；非BESA接机参考：1人7,000、2人4,000／人、3人以上3,000／人，需顾问确认班次。', enabled: true, sortOrder: 6 },
    { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 4940, rates: [4940, 6210, 4240, 4240, 4240], billingRule: 'visa-extension-schedule', includeInTotal: true, note: '30天旅游签证学习超过4周开始续签；59天旅游签证学习达到8周开始续签。之后每增加4周再估算1次；各次参考为4,940／6,210／4,240／4,240／4,240比索。', enabled: true, sortOrder: 7 },
    { id: 'books', name: '教材费', currency: 'PHP', amount: 0, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '按所选课程的学校教材表及每开始4周计算；不同课程金额不同，实际以到校领用为准。', enabled: true, sortOrder: 8 },
    { id: 'student-card', name: '学生证', currency: 'PHP', amount: 200, billingRule: 'once', includeInTotal: true, note: '一次性费用，包含拍摄照片。', enabled: true, sortOrder: 9 },
    { id: 'laundry', name: '洗衣服务', currency: 'PHP', amount: 1200, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '每周2次洗衣服务；超过4周按实际周数比例预估。', enabled: true, sortOrder: 10 },
    { id: 'challenger-elective', name: 'Challenger特别选修课', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'proportional', includeInTotal: true, note: '仅主动勾选Challenger特别选修课时计入。', enabled: true, sortOrder: 11 },
    { id: 'ielts-guarantee', name: 'IELTS保分班额外费用', currency: 'PHP', amount: 18000, billingRule: 'per-course-period', periodWeeks: 8, rounding: 'ceil', includeInTotal: true, note: '仅选择IELTS Guarantee时按每开始8周计入；保证条件需由顾问确认。', enabled: true, sortOrder: 12 },
    { id: 'room-deposit', name: '宿舍押金（可退）', currency: 'PHP', amount: 3000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: JIC_LOCAL_FEE_COPY.deposit, enabled: true, sortOrder: 13 },
    { id: 'odd-week-arrival', name: '非标准周抵离校参考费', currency: 'PHP', amount: 8000, billingRule: 'optional', includeInTotal: false, multiplyByStudents: true, note: '学校最新表列8,000比索／非标准周；仅非周日抵达或非周六离校时参考，标准周日报到、周六离校不收取。', enabled: true, sortOrder: 14 },
  ],
  quoteSettings: {
    registrationFee: JIC_REGISTRATION_FEE,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortStayRatios: { '1': 0.4, '2': 0.65, '3': 0.85 },
    peakSeasonFeePerWeek: JIC_PEAK_FEE_PER_WEEK,
    peakSeasonRanges: [
      { id: 'jic-peak-2026', label: '2026暑期旺季', start: '2026-06-28', end: '2026-08-22', enabled: true },
    ],
    promotions: [
      {
        ...promotion('jic-registration', '注册费优惠', 'jic-registration', 0),
        description: '老学员返校、在校延长或12周及以上学生免收一次性注册费。',
        discountType: 'none',
        waiveRegistration: true,
        minimumCourseWeeks: 12,
      },
      {
        ...promotion('jic-off-season-2026', '2026下半年淡季住宿优惠', 'jic-off-season-2026', 1),
        description: JIC_PROMOTION_COPY.offSeason,
        discountValue: 150,
        incrementValue: 50,
        incrementWeeks: 4,
        newStudentsOnly: true,
        arrivalStart: '2026-08-23',
        arrivalEnd: '2027-01-09',
        appliesTo: 'accommodation',
        minimumAccommodationWeeks: 4,
      },
      {
        ...promotion('jic-off-season-2027-a', '2027上半年淡季住宿优惠', 'jic-off-season-2027', 2),
        description: JIC_PROMOTION_COPY.offSeason,
        discountValue: 100,
        incrementValue: 50,
        incrementWeeks: 4,
        newStudentsOnly: true,
        arrivalStart: '2027-02-21',
        arrivalEnd: '2027-06-26',
        appliesTo: 'accommodation',
        minimumAccommodationWeeks: 4,
      },
      {
        ...promotion('jic-off-season-2027-b', '2027下半年淡季住宿优惠', 'jic-off-season-2027', 3),
        description: JIC_PROMOTION_COPY.offSeason,
        discountValue: 100,
        incrementValue: 50,
        incrementWeeks: 4,
        newStudentsOnly: true,
        arrivalStart: '2027-08-22',
        arrivalEnd: '2028-01-08',
        appliesTo: 'accommodation',
        minimumAccommodationWeeks: 4,
      },
      {
        ...promotion('jic-long-term', '长期学习优惠', 'jic-long-term', 4),
        description: JIC_PROMOTION_COPY.longTerm,
        discountTiers: { '12': 300, '16': 400, '20': 500, '24': 600 },
        registrationStart: '2026-03-08',
        arrivalStart: '2026-03-08',
        minimumCourseWeeks: 12,
      },
      {
        ...promotion('jic-besa', 'BESA优惠', 'jic-besa', 5),
        description: JIC_PROMOTION_COPY.besa,
        incrementWeeks: 4,
        incrementValue: 100,
        registrationStart: '2026-04-01',
        registrationEnd: '2026-06-30',
        arrivalStart: '2026-08-23',
        arrivalEnd: '2026-12-13',
        newStudentsOnly: true,
      },
      ...[
        ['jic-holiday-2026-a', '2026圣诞优惠第一档', '2026-11-29', '2026-12-13', 200],
        ['jic-holiday-2026-b', '2026圣诞优惠第二档', '2026-12-27', '2027-01-10', 200],
        ['jic-holiday-2027-a', '2027圣诞优惠第一档', '2027-11-28', '2027-12-12', 150],
        ['jic-holiday-2027-b', '2027圣诞优惠第二档', '2027-12-26', '2028-01-09', 150],
      ].map(([id, name, start, end, amount], index) => ({
        ...promotion(String(id), String(name), 'jic-holiday', 6 + index),
        description: JIC_PROMOTION_COPY.holiday,
        discountValue: Number(amount),
        arrivalStart: String(start),
        arrivalEnd: String(end),
        eligibleRoomIds: twinAndQuadRoomIds,
        newStudentsOnly: true,
      })),
    ],
    localFeeIntro: JIC_LOCAL_FEE_COPY.intro,
    courseTableTitle: 'JIC 2026年课程费 / 4周',
    courseTableNote: '两个校区分别展示；1／2／3周按4周价的40%／65%／85%，4周起按周数比例计算。',
    groupClassNote: 'Challenger偏ESL与IELTS强化，Premium偏口语、主题与职业英语；具体安排以所选课程说明为准。',
    roomTableTitle: 'JIC 2026年住宿费 / 4周',
    roomTableNote: 'Challenger与Premium房型不可跨校区混选；Premium 2027淡季单人房优惠仅适用于无阳台房型。',
    stayPolicyTitle: 'JIC入住与校区提醒',
    stayPolicies: [
      { label: '入住日期', value: '周日入住', note: '课程与住宿按完整周计算。' },
      { label: '退房日期', value: '周六退房', note: '延住及额外住宿需先确认空房和费用。' },
      { label: '双校区', value: 'Challenger / Premium', note: '每名学生须在同一校区选择课程和住宿。' },
    ],
    extraNightRates: [],
  },
  quoteImageSettings: {
    paymentSectionTitle: '学校费用明细',
    paymentNotes: { registration: '每名学生一次；符合条件时在优惠行抵扣', course: '', accommodation: '', promotion: '按当前日期、房型和周数自动核算' },
    localFeeSectionTitle: '到校后学杂费明细',
    localFeeIntro: '以下按当前签证、课程、住宿与接机选择预估；可退宿舍押金另列。',
    localFeeNotes: {},
    serviceSectionTitle: '为什么选择思达启航？',
    benefits: [
      { title: '0中介费', text: '学校合作价格，不额外加收服务费' },
      { title: '价格保护', text: '同条件可比价，核实更低价退差价' },
      { title: '全程报名协助', text: '选校、签证、付款及行前指导' },
      { title: '海外驻点售后', text: '学习期间持续跟进，问题有人协助' },
    ],
    serviceLocations: ['深圳总部', '菲律宾驻点', '欧洲驻点'],
    alumniBenefitTitle: 'JIC优惠提醒',
    alumniBenefitText: '淡季、长期、BESA与节日优惠按报名日、入学日、房型及周数自动核对；最终资格以学校确认为准。',
    noteSectionTitle: '报价说明',
    footerNotes: [
      '1／2／3周按4周价的40%／65%／85%；周日入住、周六退房。',
      '当前页面只提供对应校区的课程和住宿，不跨校区混选。',
      '人民币金额按生成当日参考汇率估算，最终以实际支付汇率为准。',
      '最终以学校价格、空房、优惠资格、移民局政策及顾问确认结果为准。',
    ],
  },
    media: structuredClone(JIC_DEFAULT_MEDIA),
  };
  content.campusQuoteImageSettings = {
    challenger: structuredClone(content.quoteImageSettings),
    premium: structuredClone(content.quoteImageSettings),
  };
  return content;
};

export const jicQuoteImageSettings = (content: CiaContentConfig, campus: JicCampus): CiaQuoteImageSettings =>
  content.campusQuoteImageSettings?.[campus] ?? content.quoteImageSettings;

export const cloneJicContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const cloned = structuredClone(value);
  const latest = createDefaultJicContentConfig();
  // Published employee content may predate the September 2026 school files.
  // Preserve editorial visibility/order, but always upgrade school-issued facts.
  cloned.courses = latest.courses.map((fallback) => {
    const existing = cloned.courses.find(item => item.id === fallback.id);
    return existing ? {
      ...fallback,
      ...existing,
      name: fallback.name,
      englishName: fallback.englishName,
      tuition: fallback.tuition,
      tuition2027: fallback.tuition2027,
      schedule: fallback.schedule,
      suitable: fallback.suitable,
      note: fallback.note,
      minimumWeeks: fallback.minimumWeeks,
      allowedWeeks: fallback.allowedWeeks,
    } : fallback;
  });
  cloned.rooms = latest.rooms.map((fallback) => {
    const existing = cloned.rooms.find(item => item.id === fallback.id);
    return existing ? { ...fallback, ...existing, fee: fallback.fee, note: fallback.note, campus: fallback.campus } : fallback;
  });
  cloned.localFees = latest.localFees.map((fallback) => {
    const existing = cloned.localFees.find(item => item.id === fallback.id);
    return existing ? {
      ...fallback,
      ...existing,
      name: fallback.name,
      amount: fallback.amount,
      rates: fallback.rates,
      billingRule: fallback.billingRule,
      periodWeeks: fallback.periodWeeks,
      rounding: fallback.rounding,
      includeInTotal: fallback.includeInTotal,
      multiplyByStudents: fallback.multiplyByStudents,
      note: fallback.note,
    } : fallback;
  });
  cloned.quoteSettings.shortStayRatios = { ...latest.quoteSettings.shortStayRatios };
  cloned.quoteSettings.courseTableNote = latest.quoteSettings.courseTableNote;
  cloned.campusQuoteImageSettings ??= {};
  for (const campus of ['challenger', 'premium'] as const) {
    const base = latest.campusQuoteImageSettings![campus];
    const saved = cloned.campusQuoteImageSettings[campus] ?? (campus === 'challenger' ? cloned.quoteImageSettings : undefined);
    cloned.campusQuoteImageSettings[campus] = {
      ...structuredClone(base),
      ...(saved ?? {}),
      paymentNotes: { ...base.paymentNotes, ...(saved?.paymentNotes ?? {}) },
      promotionNotes: { ...base.promotionNotes, ...(saved?.promotionNotes ?? {}) },
      localFeeNotes: { ...base.localFeeNotes, ...(saved?.localFeeNotes ?? {}) },
      supplementalFeeNotes: { ...base.supplementalFeeNotes, ...(saved?.supplementalFeeNotes ?? {}) },
      footerNotes: [...(saved?.footerNotes?.length ? saved.footerNotes : base.footerNotes)],
    };
    for (const fee of latest.localFees) delete cloned.campusQuoteImageSettings[campus].localFeeNotes[fee.id];
  }
  cloned.quoteImageSettings = cloned.campusQuoteImageSettings['challenger'];
  if (!cloned.media?.length) cloned.media = structuredClone(JIC_DEFAULT_MEDIA);
  return cloned;
};
