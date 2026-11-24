// All text and data of the ATC Language Schools page (Ireland). Pure data module (mini program compatible):
// no Angular, DOM, storage or regex lookbehind. Prices come from atc-pricing.ts.
import { BRAND_ADVANTAGES } from '../../../about-sida/about/brand-facts';
import { SCHOOL_REFERENCE_NOTE } from '../../../philippines/school-page/school-reference-note';
import { WestImage, WestPriceTable, WestSchoolProfile } from '../../west-school-page/west-school-profile';
import {
  ATC_BLACK_NOVEMBER,
  ATC_CAMBRIDGE_SESSIONS,
  ATC_COURSE_TIERS,
  ATC_FEES,
  ATC_EXAMS,
  ATC_RENEWAL,
  AtcCampusId,
  AtcPriceKey,
} from './atc-pricing';

export const ATC_ROUTE = '/overseas-study-tour/ireland/atc-language-schools';

function photo(name: string, alt: string, caption?: string): WestImage {
  return { src: `/assets/atc/${name}.webp`, alt, caption };
}

function money(value: number): string {
  return value.toLocaleString('en-US');
}

function dateText(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
}

function priceRange(campus: AtcCampusId, key: AtcPriceKey): string {
  const values = ATC_COURSE_TIERS[campus].map(tier => tier[key]).filter((value): value is number => value !== null);
  return `${Math.min(...values)}–${Math.max(...values)}`;
}

function tierLabel(min: number, max: number): string {
  return max >= 999 ? `${min}周及以上` : `${min}–${max}周`;
}

function priceTable(campus: AtcCampusId, label: string): WestPriceTable {
  const tiers = ATC_COURSE_TIERS[campus];
  const last = tiers[tiers.length - 1];
  return {
    id: campus,
    label,
    caption: `${label}，单位：欧元／周`,
    columns: ['报名总周数', '综合英语16课时', '综合英语20课时', '强化英语26课时'],
    rows: [
      ...tiers.map(tier => ({
        label: tierLabel(tier.minWeeks, tier.maxWeeks),
        values: [tier.ge16 === null ? '8周起报' : money(tier.ge16), money(tier.ge20), money(tier.ie26)],
        highlight: tier === last,
      })),
      {
        label: '25周学费合计',
        values: [money((last.ge16 ?? 0) * 25), money(last.ge20 * 25), money(last.ie26 * 25)],
      },
    ],
    note: '雅思备考和20课时课程同价。每周价格按报名总周数定档，全部周数按同一价格计算。',
  };
}

const HERO = photo('bray-aerial', 'ATC布雷校区所在的海边小镇布雷，背后是布雷海角', '布雷海边小镇，ATC布雷校区就在海边');

export const ATC_GALLERY = {
  bray: [
    photo('bray-school-front', 'ATC布雷校区的海边校舍', '布雷校区：学校拥有4栋相连的维多利亚式楼房'),
    photo('bray-school-steps', 'ATC布雷校区门口的学生', '布雷校区门口'),
    photo('bray-students', '在ATC布雷校区学习的学生', '布雷校区的学生'),
    photo('bray-seafront', 'ATC学生在布雷海边', '布雷海边'),
    HERO,
  ],
  dublin: [
    photo('dublin-building', 'ATC都柏林新校舍：市中心的乔治亚风格建筑', '都柏林新校舍（2027年1月启用）'),
    photo('dublin-classroom', 'ATC都柏林新校舍的教室', '都柏林新校舍的教室'),
    photo('trip-dublin-city', 'ATC学生在都柏林市区出游', '学生在都柏林市区出游'),
  ],
  classes: [
    photo('class-teacher', 'ATC老师在课堂上讲课', 'ATC的课堂'),
    photo('class-student', 'ATC学生在课堂上', 'ATC的课堂'),
  ],
  residence: [
    photo('dublin-residence-bedroom', 'From Here学生公寓的带卫浴单人间', '带卫浴单人间'),
    photo('dublin-residence-kitchen', 'From Here学生公寓的厨房', '公寓共用厨房'),
    photo('dublin-residence-living', 'From Here学生公寓的客厅', '公寓共用客厅和餐厅'),
    photo('dublin-residence-desk', 'From Here学生公寓卧室的书桌', '卧室书桌和储物'),
    photo('dublin-residence-lounge', 'From Here学生公寓楼里的公共休息区', '楼里的公共休息区'),
    photo('dublin-residence-rooftop', 'From Here学生公寓的天台', '天台'),
  ],
};

export const ATC_PROFILE: WestSchoolProfile = {
  schoolId: 'atc',
  hero: {
    eyebrow: '爱尔兰 · 布雷海边校区＋都柏林市中心校区',
    title: 'ATC 语言学校',
    englishName: 'ATC Language Schools · Ireland',
    subtitle:
      '1973年在爱尔兰创办，独立经营。成人英语课程1周起报、每周一开课，可住寄宿家庭或学校公寓；25周课程可申请学生签证，在读期间按规定打工。',
    image: HERO,
    photos: [ATC_GALLERY.dublin[0], ATC_GALLERY.classes[0], ATC_GALLERY.residence[0], photo('trip-coast', 'ATC学生周末出游，在海边山顶合影', '周末跟学校出游')],
    badges: ['ACELS 认证', 'Eaquals 认证', '每班最多16人', '1周起报，每周一开课'],
    stats: [
      { value: '1973年', label: '创办，50多年办学' },
      { value: '50多个', label: '国家和地区的学生' },
      { value: '10–12人', label: '平均每班人数，最多16人' },
      { value: '2个校区', label: '海边小镇布雷、都柏林市中心' },
    ],
    price: {
      label: '课程学费低至',
      value: '190',
      unit: '欧元／周',
      note: '布雷校区每周16课时、报25周以上的价格；4周以内每周320欧元起',
    },
  },
  promos: [
    {
      id: 'black-november',
      tag: '黑色11月',
      title: '11月30日前报名，课程学费9折',
      text: 'ATC 2027年成人课程学费按原价打9折，布雷和都柏林两个校区都适用。',
      points: ['2026年11月30日前报名', '在线报价已自动算上9折', '优惠细则以学校确认为准'],
      until: ATC_BLACK_NOVEMBER.until,
      untilText: '2026年11月30日截止',
    },
    {
      id: 'renewal',
      tag: '已在爱尔兰的学生',
      title: `续签套餐${money(ATC_RENEWAL.courses[0].price)}欧元起`,
      text: '给已在爱尔兰、要续签Stamp 2或打工度假（WHA）的非欧盟学生：25周课程＋8周假期，含第一本教材和学习平台、TIE考试、注册费、医疗保险和学费保障。',
      points: [
        ...ATC_RENEWAL.courses.map(course => `${course.name}：${money(course.price)}欧元（原价${money(course.was)}欧元）`),
        '2026年11月30日前报名，2027年1月31日前开课，费用一次付清',
        `ATC老学员再减${ATC_RENEWAL.returningDiscount}欧元，名额有限`,
      ],
      until: ATC_RENEWAL.bookBy,
      untilText: '2026年11月30日截止',
    },
  ],
  trust: {
    title: '为什么选 ATC',
    intro: 'ATC 1973年在爱尔兰创办，独立经营至今。课程通过爱尔兰和欧洲两套质量认证，老师都有学位和国际认可的教学资质。',
    badges: ['ACELS 爱尔兰英语教学认证', 'Eaquals 欧洲语言教育质量认证', 'Quality English 成员', 'English Education Ireland 创始成员'],
    items: [
      { icon: 'history_edu', title: '50多年老校', text: '1973年创办，学校独立经营，50多年来一直在爱尔兰教英语。' },
      { icon: 'groups', title: '小班，国际同学多', text: '每班最多16人，平均10–12人；学生来自50多个国家和地区，课堂和课后都用英语交流。' },
      { icon: 'trending_up', title: '进步看得见', text: '开课前在线分级测试，每周可做水平测试；免费一对一导师面谈，帮你定学习计划。' },
      { icon: 'laptop_mac', title: 'ATC Online 学习平台', text: '开课前1个月开通，可自学、做雅思和剑桥练习题、查出勤、报名活动；结课后还能用3个月。' },
      { icon: 'work', title: '免费求职俱乐部', text: '每周二有免费的求职俱乐部（Job Club），每年4月还有招聘会，适合想在爱尔兰打工的学生。' },
      { icon: 'event_available', title: '时间灵活', text: '综合和强化课程每周一开课，1周起报，最长可读一年；长期学生可以两个校区组合着读。' },
    ],
  },
  campuses: {
    title: '两个校区怎么选',
    intro: '同一所学校、同样的课程标准。想安静、省钱选布雷；想要城市生活、打工机会多选都柏林。都柏林学费每周贵5–50欧元。',
    items: [
      {
        id: 'bray',
        name: '布雷校区',
        englishName: 'ATC Bray',
        tag: '海边小镇 · 学费更低',
        image: ATC_GALLERY.bray[0],
        photos: ATC_GALLERY.bray.slice(1),
        summary: '学校面朝爱尔兰海，拥有4栋相连的维多利亚式楼房，17间教室。布雷是都柏林南边约3.3万人口的海边小镇，坐DART轻轨约40分钟到都柏林市中心，周末可以爬布雷海角。',
        facts: [
          { label: '最低年龄', value: '16岁' },
          { label: '教室', value: '17间，都有互动白板' },
          { label: '到都柏林', value: 'DART轻轨约40分钟到市中心；打车约45–60分钟到机场' },
          { label: '住宿', value: '寄宿家庭；学校隔壁的学生公寓和步行9分钟的学生宿舍' },
        ],
        suits: ['预算有限、想多读几周的学生', '喜欢安静、海边环境的学生', '16–17岁学生（都柏林17岁起）'],
        priceFrom: `20课时每周${priceRange('bray', 'ge20')}欧元`,
      },
      {
        id: 'dublin',
        name: '都柏林校区',
        englishName: 'ATC Dublin',
        tag: '市中心 · 2027年新校舍',
        image: ATC_GALLERY.dublin[0],
        photos: ATC_GALLERY.dublin.slice(1),
        summary: '2027年1月起搬进都柏林市中心一栋乔治亚风格的建筑，步行可到格拉夫顿街和圣三一学院，附近商店、餐厅、剧院和公交都很方便。',
        facts: [
          { label: '最低年龄', value: '17岁' },
          { label: '教室', value: '10间，都有互动白板' },
          { label: '到机场', value: '约12公里，坐公交约30分钟' },
          { label: '住宿', value: '寄宿家庭；From Here 学生公寓（带卫浴单人间）' },
        ],
        suits: ['想体验首都城市生活的学生', '想边读书边打工的半工半读学生', '喜欢周末逛博物馆、看演出的学生'],
        priceFrom: `20课时每周${priceRange('dublin', 'ge20')}欧元`,
      },
    ],
  },
  videos: {
    title: '先看视频，了解学校',
    intro: '学校拍摄的视频，英文原声、带英文字幕：课堂、老师和学生采访、两个校区和课外活动。',
    items: [
      {
        src: '/assets/atc/videos/atc-school-film.mp4',
        poster: '/assets/atc/videos/atc-school-film.jpg',
        title: 'ATC 学校介绍',
        duration: '2:48',
        text: '老师、学生和工作人员讲在ATC学习和生活的感受，有课堂、课外活动和两个校区的画面。',
        note: '片中也有学校青少年夏令营的画面。',
      },
      {
        src: '/assets/atc/videos/atc-bray.mp4',
        poster: '/assets/atc/videos/atc-bray.jpg',
        title: '布雷校区',
        duration: '0:59',
        text: '海边小镇布雷、教室和课堂，老师和学生说说在布雷上学的感受。',
      },
      {
        src: '/assets/atc/videos/atc-dublin.mp4',
        poster: '/assets/atc/videos/atc-dublin.jpg',
        title: '都柏林校区',
        duration: '0:48',
        text: '都柏林城市风貌、课堂、教学主管和学生采访，还有周末公园野餐。',
        note: '视频拍的是2027年搬迁前的旧校舍；新校舍照片见“两个校区怎么选”。',
      },
    ],
    note: SCHOOL_REFERENCE_NOTE,
  },
  courses: {
    title: '课程和学费',
    intro: '每节课60分钟，每班最多16人。学费按每周价格计算：报名总周数越多，每周越便宜，全部周数按同一档价格计算。',
    items: [
      {
        id: 'ge20',
        badge: '适合大多数人',
        name: '综合英语（每周20课时）',
        englishName: 'General English for Communication',
        text: '听说读写一起提高，以口语交流为主，适合旅行、工作或留学前打基础，零基础也能报。',
        facts: [
          { label: '上课', value: '周一至周五 9:00–13:20' },
          { label: '周数', value: '1周起' },
          { label: '级别', value: 'A1–C1' },
        ],
        points: ['下午时间自由，可参加学校活动'],
        priceFrom: `布雷每周${priceRange('bray', 'ge20')}欧元，都柏林${priceRange('dublin', 'ge20')}欧元`,
      },
      {
        id: 'ge16',
        badge: '学费最低',
        name: '综合英语（每周16课时）',
        englishName: 'General English for Communication (16 hours)',
        text: '周一至周四上课，周五空出来，适合长期读、想留时间打工或旅行的学生。2027年起都柏林也开设。',
        facts: [
          { label: '上课', value: '周一至周四 9:00–13:20' },
          { label: '周数', value: '8周起（8–11周需学校确认）' },
          { label: '级别', value: 'A1–C1' },
        ],
        points: ['报25周可申请学生签证（半工半读）'],
        priceFrom: `布雷每周${priceRange('bray', 'ge16')}欧元，都柏林${priceRange('dublin', 'ge16')}欧元`,
      },
      {
        id: 'ie26',
        badge: '进步更快',
        name: '强化英语（每周26课时）',
        englishName: 'Intensive English for Communication',
        text: '在20课时上午课的基础上，周二、周四下午各加3小时小班课，口语练习更多，适合时间短、想快速提高的学生。',
        facts: [
          { label: '上课', value: '周一至周五上午，加周二、周四 14:15–17:15' },
          { label: '周数', value: '1周起' },
          { label: '级别', value: 'A1–C1' },
        ],
        points: ['下午班平均5–10人'],
        priceFrom: `布雷每周${priceRange('bray', 'ie26')}欧元，都柏林${priceRange('dublin', 'ie26')}欧元`,
      },
      {
        id: 'ielts',
        badge: '18岁以上',
        name: '雅思备考',
        englishName: 'IELTS Preparation',
        text: '和20课时课程同一时间上课、同样价格，讲题型和答题技巧，定期模考。完整课程8周，任意周一都能插班。',
        facts: [
          { label: '上课', value: '周一至周五 9:00–13:20' },
          { label: '周数', value: '建议8周，少于8周学不完全部内容' },
          { label: '要求', value: '英语B2以上' },
        ],
        points: [`雅思考试费${ATC_EXAMS.find(exam => exam.id === 'ielts')!.price}欧元另付`, '人数不足时，完整课程可能不开班'],
        priceFrom: '价格同20课时课程',
      },
      {
        id: 'cambridge',
        badge: '固定日期开课',
        name: '剑桥 B2 First／C1 Advanced 备考',
        englishName: 'Cambridge B2 First & C1 Advanced',
        text: '固定日期开课，一期10–12周，课程结束参加剑桥官方考试，证书被很多大学和雇主认可。',
        facts: [
          { label: '开课', value: '2027年1月4日、3月15日、9月20日' },
          { label: '周数', value: '10周或12周' },
          { label: '要求', value: 'B2 First需B2，C1 Advanced需C1；18岁以上' },
        ],
        points: [`考试费另付：B2 First ${ATC_EXAMS[0].price}欧元，C1 Advanced ${ATC_EXAMS[1].price}欧元`],
        priceFrom: `整期布雷${money(ATC_CAMBRIDGE_SESSIONS[0].prices.bray)}欧元起，都柏林${money(ATC_CAMBRIDGE_SESSIONS[0].prices.dublin)}欧元起`,
      },
      {
        id: 'study-work',
        badge: '可以打工',
        name: '半工半读（25周）',
        englishName: 'Study and Work Programme',
        text: '非欧盟学生报25周16课时、20课时或考试备考课程，可申请爱尔兰学生签证，在读期间按规定打工。',
        facts: [
          { label: '周数', value: '25周起' },
          { label: '年龄', value: '18岁以上' },
          { label: '赠送', value: 'TIE考试，可付费改考剑桥或雅思' },
        ],
        points: ['可以两个校区组合着读'],
        priceFrom: `25周学费：布雷16课时${money((ATC_COURSE_TIERS.bray[6].ge16 ?? 0) * 25)}欧元起`,
      },
    ],
    priceTitle: '2027年课程学费（每周价格）',
    priceIntro: '例：在布雷报12周20课时课程，每周275欧元，学费共3,300欧元；另付注册费70欧元、教材和学习平台85欧元。',
    priceTables: [priceTable('bray', '布雷校区'), priceTable('dublin', '都柏林校区')],
    fixed: {
      title: '剑桥考试备考（固定开课，整期价格）',
      columns: ['开课日期', '周数', '布雷校区', '都柏林校区'],
      rows: ATC_CAMBRIDGE_SESSIONS.map(session => [
        dateText(session.start), `${session.weeks}周`, `${money(session.prices.bray)}欧元`, `${money(session.prices.dublin)}欧元`,
      ]),
      note: '每周20课时；人数不足可能不开班。纸笔考试如在结课后举行，可能需要多住一周。',
    },
  },
  stay: {
    title: '住宿：寄宿家庭或学校公寓',
    intro: '每周按7晚计算，周六或周日入住、离开。想练口语、体验当地生活选寄宿家庭；想自己做饭、更自由选学校公寓（18岁以上）。',
    items: [
      {
        id: 'homestay',
        campus: '布雷／都柏林',
        icon: 'cottage',
        name: '寄宿家庭',
        photos: [],
        price: `双人间每周260欧元，单人间每周300欧元`,
        priceNote: '含周一至周五早晚餐、周末三餐；两个校区同价',
        tags: ['单人间18岁以上', '双人间16岁以上', '1周起住'],
        points: [
          '布雷：大多数家庭步行可到学校，约20–60分钟，旺季可能更远',
          '都柏林：家庭在居民区，坐公共交通到学校约30–75分钟',
          '所有寄宿家庭都经过警方背景审查，学校有专门的住宿团队',
        ],
      },
      {
        id: 'bray-apartments',
        campus: '布雷校区',
        icon: 'apartment',
        name: '学校公寓／学生宿舍（自己做饭）',
        photos: [],
        price: '双人间每周270欧元，单人间每周325欧元',
        priceNote: '不含餐，有厨房和洗衣机',
        tags: ['18岁以上', '海边', '有学校员工同住'],
        points: [
          '学生公寓：学校隔壁两栋海边维多利亚式老房子，每套2–3间卧室，共用卫生间、厨房和客厅',
          '学生宿舍：海边，离学校约700米（步行9分钟），单人间和双人间都带独立卫浴',
          '床单和毛巾入住时提供；具体住哪一栋以学校安排为准',
        ],
      },
      {
        id: 'dublin-from-here',
        campus: '都柏林校区',
        name: 'From Here 学生公寓（带卫浴单人间）',
        image: ATC_GALLERY.residence[0],
        photos: ATC_GALLERY.residence.slice(1),
        price: '每周410欧元',
        priceNote: '不含餐，公寓有厨房',
        tags: ['18岁以上', '24小时安保', '健身房', '天台'],
        points: [
          '步行到学校约20–30分钟，附近有公交站',
          '每套公寓最多8名ATC学生，每人一间带卫浴的单人间，共用厨房和餐厅',
          '楼里有健身房、影音室、游戏间、自习区、天台和洗衣房（洗衣按次付费）',
          '暑期还会加开一栋带卫浴单人间的宿舍',
        ],
      },
    ],
    rules: [
      '住宿按每周7晚计，周六或周日入住、离开；多住几晚需提前申请，视房源而定。',
      '16–17岁学生只能住寄宿家庭双人间，与另一名学生同住；9月至次年5月最多住4周。',
      '16–17岁学生住学校安排的住宿，必须预订接机。',
      `有特殊饮食要求（素食、过敏等），寄宿家庭每周最多加${ATC_FEES.dietMax}欧元。`,
      'From Here 公寓16:00后入住、10:00前退房；提供一套床品和一条毛巾，公共区域地面每周有保洁打扫，其余自己打扫。',
      '所有住宿以学校确认的房源为准。',
    ],
  },
  quote: {
    title: '在线算报价',
    intro: '选校区、课程、周数和住宿，马上看到逐项费用和人民币估算；可以两个方案并排对比，保存成图片发给家人。',
    points: ['按学校2027年价格计算', '每一项费用都列出来', '两个方案并排对比', '一键保存报价图片'],
  },
  fees: {
    title: '其他费用一次说清',
    intro: '除了学费和住宿，下面是可能产生的全部费用；机票、签证和个人花费另计。',
    rows: [
      { label: '注册费', value: `${ATC_FEES.registration}欧元`, note: '一次性' },
      { label: '电子学习平台和第一本教材', value: `${ATC_FEES.elearning}欧元`, note: '一次性' },
      { label: '住宿安排费', value: `${ATC_FEES.accommodation}欧元`, note: '订学校住宿时付，一次性' },
      { label: '医疗保险和学费保障（MediPel）', value: `${ATC_FEES.medipel}欧元`, note: '非欧盟学生约3个月以上课程必买' },
      { label: '一对一私教', value: `每小时${ATC_FEES.privateOne}欧元`, note: `2人小班每小时${ATC_FEES.privateTwo}欧元` },
      ...ATC_EXAMS.map(exam => ({
        label: `${exam.name}考试`,
        value: `${exam.price}欧元`,
        note: exam.id === 'tie' ? '25周以上课程免费' : '含报名、协助和寄送',
      })),
      { label: '都柏林机场接机或送机', value: `每程${ATC_FEES.transferOne}欧元`, note: `2人同航班每人每程${ATC_FEES.transferShared}欧元；16–17岁住学校安排的住宿必须订接机` },
      { label: '特殊饮食（寄宿家庭）', value: `每周最多${ATC_FEES.dietMax}欧元` },
      { label: '课外活动和出游', value: '0–70欧元', note: '半日0–25欧元，全天0–70欧元；部分免费，自愿报名' },
    ],
    note: SCHOOL_REFERENCE_NOTE,
  },
  feature: {
    id: 'study-work',
    eyebrow: '非欧盟学生 · 18岁以上',
    title: '25周半工半读：边读语言边打工',
    intro: '在ATC报25周课程，可以申请爱尔兰学生签证（Stamp 2），在读期间按规定打工。课程赠送TIE考试，也可以付费改考剑桥或雅思；免费一对一辅导，学习平台结课后还能用3个月。',
    points: [
      { title: '每周20小时', text: '上课期间最多可打工的时间' },
      { title: '假期40小时', text: '学校假期每周最多可打工的时间' },
      { title: '8个月', text: '签证有效期，可续签两次' },
      { title: '出勤85%', text: '续签需要达到的出勤率' },
    ],
    note: '签证和打工规定以爱尔兰移民局最新规定为准；签证材料和办理流程，思达启航顾问免费协助。',
    image: photo('graduation', 'ATC学生拿着结业证书合影', 'ATC学生结业'),
    link: { label: '了解爱尔兰半工半读', route: '/ireland-study/work-study' },
  },
  life: {
    title: '课外生活：每周都有活动',
    intro: '学校每天都有活动，在 ATC Online 上报名，有些免费，有些需要付费；周末可以跟学校去爱尔兰各地一日游。',
    weekly: [
      { label: '周一', title: '城市徒步导览', icon: 'directions_walk' },
      { label: '周二', title: '求职俱乐部（Job Club）', text: '免费参加', image: photo('club-job', 'ATC求职俱乐部活动') },
      { label: '周三', title: '英语角（Conversation Club）', text: '和不同国家的同学聊天', image: photo('club-conversation', 'ATC英语角活动') },
      { label: '周四', title: '爱尔兰舞蹈', icon: 'music_note' },
      { label: '周末', title: '徒步俱乐部', image: photo('club-hiking', 'ATC徒步俱乐部的学生在户外') },
    ],
    monthly: [
      { label: '1月', title: '新年庆祝', image: photo('act-new-year', 'ATC新年活动') },
      { label: '2月', title: '圣布里吉德节', icon: 'local_florist' },
      { label: '3月', title: '圣帕特里克节', image: photo('act-st-patricks', 'ATC学生参加圣帕特里克节活动') },
      { label: '4月', title: '招聘会', image: photo('act-jobs-fair', 'ATC招聘会') },
      { label: '5月', title: '格兰达洛一日游', image: photo('act-glendalough', 'ATC学生在格兰达洛') },
      { label: '6月', title: '布卢姆日', image: photo('act-bloomsday', 'ATC学生参加布卢姆日活动') },
      { label: '7月', title: '夏日节', image: photo('act-summer', 'ATC夏日节活动') },
      { label: '8月', title: '戈尔韦一日游', image: photo('act-galway', 'ATC学生在戈尔韦') },
      { label: '9月', title: '文化之夜', icon: 'theater_comedy' },
      { label: '10月', title: '万圣节', image: photo('act-halloween', 'ATC万圣节活动') },
      { label: '12月', title: '圣诞颂歌', image: photo('act-christmas', 'ATC圣诞活动') },
    ],
    note: '以上为2027年活动示例，以学校当期安排为准。',
  },
  junior: {
    title: '青少年项目：Mini-stay 和夏令营',
    intro: 'ATC 也有青少年短期课程：全年在布雷和都柏林有 Mini-stay 小团课程，暑期在爱尔兰各地和英国剑桥有夏令营，住寄宿家庭或学生宿舍，上课、活动和出游一起安排。',
    points: ['团组和个人都可以报名', '上课、活动和出游一起安排', '价格和日期每年不同，请咨询顾问'],
    note: '青少年项目以学校当年安排为准。',
    video: {
      src: '/assets/atc/videos/atc-junior-ministay.mp4',
      poster: '/assets/atc/videos/atc-junior-ministay.jpg',
      title: 'Mini-stay 青少年短期课程',
      duration: '0:43',
      text: '布雷和都柏林的青少年小团课程：课堂、海边活动和学生采访。',
    },
  },
  calendar: {
    title: '2027年开课和假期',
    intro: '综合和强化课程每周一开课（公共假日和圣诞假期除外）；公共假日停课。',
    rows: [
      { date: '1月4日（周一）', name: '2027年开学' },
      { date: '2月1日（周一）', name: '圣布里吉德节', note: '公共假日停课' },
      { date: '3月17日（周三）', name: '圣帕特里克节', note: '公共假日停课' },
      { date: '3月29日（周一）', name: '复活节周一', note: '公共假日停课' },
      { date: '5月3日（周一）', name: '五月公共假日' },
      { date: '6月7日（周一）', name: '六月公共假日' },
      { date: '8月2日（周一）', name: '八月公共假日' },
      { date: '10月25日（周一）', name: '十月公共假日' },
      { date: '12月18日–2028年1月3日', name: '圣诞假期', note: '学校放假，2028年1月4日（周二）复课' },
    ],
    note: '公共假日缺课不退费。',
  },
  fit: {
    title: 'ATC 适合谁',
    good: [
      '想在英语国家学语言、又想控制预算的学生（布雷更便宜）',
      '想边读语言边打工的非欧盟学生（25周课程）',
      '准备雅思、剑桥考试，或出国读书前补英语的学生',
      '工作后想短期提升英语的成年人，1周起报',
      '想体验欧洲生活、周末去欧洲各国旅行的学生',
    ],
    consider: [
      '布雷16岁、都柏林17岁起；16–17岁9月至次年5月最多读4周',
      '公共假日和圣诞假期停课，缺课不退费',
      '暑期住宿紧张，建议提前2–3个月报名',
      '都柏林生活成本较高，打工收入能否覆盖生活费因人而异',
      '爱尔兰签证要提前办，长期学习签证需要准备资金证明等材料',
    ],
  },
  why: {
    title: '为什么通过思达启航报名',
    intro: '同样的学校和课程，通过思达启航报名不多花钱，费用逐项说清，有问题随时找顾问。',
    items: BRAND_ADVANTAGES.filter(item => [
      '0 中介服务费', '价格不高于学校官方报价', '全程保价', '费用逐项说明', '付款方式灵活', '免费签证协助', '顾问有当地学习经历', '服务到学生回国为止',
    ].includes(item.title)),
  },
  consultants: {
    title: '找顾问免费咨询',
    intro: '把想去的校区、课程和日期发给顾问，帮你核对价格、名额和签证材料。',
    names: ['Jenny', 'Lemon'],
  },
  faq: [
    {
      q: 'ATC 布雷校区和都柏林校区怎么选？',
      a: '布雷是海边小镇，环境安静，学费和学校公寓更便宜，坐轻轨约40分钟到都柏林市中心；都柏林校区在市中心，2027年1月搬进新校舍，生活方便、打工机会多，学费每周贵10–50欧元。两个校区课程标准相同，长期学生也可以两个校区组合着读。',
    },
    { q: '零基础可以去吗？', a: '可以。综合英语和强化英语从A1入门到C1高级都有，开课前做在线分级测试，按水平分班。' },
    {
      q: '最短读多久？什么时候开课？',
      a: '综合和强化英语1周起报，每周一开课（公共假日和圣诞假期除外）；16课时课程8周起；雅思建议读8周；剑桥备考在2027年1月4日、3月15日、9月20日固定开课。',
    },
    {
      q: '学费怎么算？',
      a: `学费是每周价格乘以周数，报名总周数决定价格档，全部周数按同一档计算。另付注册费${ATC_FEES.registration}欧元、教材和学习平台${ATC_FEES.elearning}欧元；订学校住宿另付住宿安排费${ATC_FEES.accommodation}欧元；非欧盟学生约3个月以上课程需买MediPel，${ATC_FEES.medipel}欧元。`,
    },
    {
      q: '可以边读书边打工吗？',
      a: '非欧盟学生报25周课程，可申请爱尔兰学生签证（Stamp 2），上课期间每周最多打工20小时、假期最多40小时，续签需要出勤率85%以上。以爱尔兰移民局最新规定为准。',
    },
    {
      q: '16、17岁可以去吗？',
      a: '可以。布雷校区16岁起，都柏林校区17岁起。9月至次年5月最多读4周，只能住寄宿家庭双人间，必须预订接机；雅思、剑桥和半工半读课程需要18岁以上。',
    },
    {
      q: '中国大陆学生去爱尔兰读语言要办什么签证？',
      a: '需要办签证：3个月以内的短期课程办短期学习签证，25周课程办长期学习签证，需要的材料不同。思达启航免费协助准备签证材料，以爱尔兰移民局最新规定为准。',
    },
    {
      q: '通过思达启航报名会更贵吗？',
      a: '不会。思达启航不向学生收中介服务费，价格不高于学校官方报价；报名后同样的条件别人拿到更低价，退还差价。',
    },
  ],
  closing: {
    title: '想知道去 ATC 一共要花多少钱？',
    text: '用上面的报价工具自己算，或者把校区、课程和日期发给顾问，帮你逐项核对价格和名额。',
  },
  referenceNote: SCHOOL_REFERENCE_NOTE,
  anchors: [
    { id: 'overview', label: '概览', icon: 'home' },
    { id: 'campuses', label: '校区', icon: 'apartment' },
    { id: 'courses', label: '课程学费', icon: 'menu_book' },
    { id: 'stay', label: '住宿', icon: 'bed' },
    { id: 'quote', label: '报价', icon: 'calculate' },
    { id: 'study-work', label: '半工半读', icon: 'work' },
    { id: 'life', label: '活动', icon: 'celebration' },
    { id: 'faq', label: '问答', icon: 'help' },
  ],
};
