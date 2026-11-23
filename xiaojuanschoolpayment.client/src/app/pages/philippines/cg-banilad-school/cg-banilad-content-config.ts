// CG Banilad's versioned content document: courses, rooms, local fees, offers and quote-image copy. Course lines
// follow the school's 2026 price list and Banilad orientation guide (2026-11 pack). Prices stay the 2026 list,
// which the school has not replaced for 2027. Keep this file pure data (no Angular, DOM or storage, no
// structuredClone), so the WeChat mini program can bundle it.
import { CiaContentConfig, CiaCourseContent } from '../cia-school/cia-content-config';
import { ASSOCIATION_PEAK_POLICY_VERSION } from '../association-peak-surcharge';
import {
  CG_LOCAL_FEE_INTRO, CG_POLICY_VERSION, CG_SHORT_STAY_RATIOS, cloneCgContent, copyJson, createCgLocalFees, createCgQuoteImageSettings,
  type CgQuoteSettings,
} from '../cg-content-policy';

const course = (
  id: string, name: string, tuition: number, schedule: string, suitable: string, note: string, sortOrder: number,
  extra: Partial<CiaCourseContent> = {},
): CiaCourseContent => ({ id, name, tuition, tuition2027: tuition, schedule, suitable, note, enabled: true, sortOrder, ...extra });

const SEMI_SPARTA_NOTE = '每天早上单词测试（约15分钟），选修1作文课必上；空堂不能外出，作文课结束、通过单词测试后才能外出。';

export const createDefaultCgBaniladContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'CG-BANILAD',
  courses: [
    course('semi-sparta', '半斯巴达（Semi-Sparta）', 800, '一对一4节 + 1:4小组课4节 + 单词测试 + 作文', '想学得更紧凑、又想住在市区的学生', SEMI_SPARTA_NOTE, 0),
    course('premier-semi-sparta', '高阶半斯巴达（Premier Semi-Sparta）', 850, '一对一5节 + 1:4小组课3节 + 单词测试 + 作文', '想多上一对一、又接受半斯巴达管理的学生', SEMI_SPARTA_NOTE, 1),
    course('light-esl', '轻松ESL（Light ESL）', 650, '一对一4节', '想留出自习、工作或休息时间的成人', '空堂可以外出；下午可以自选选修课。', 2),
    course('general-esl', '一般ESL（General ESL）', 700, '一对一4节 + 1:4小组课2节', '第一次来菲律宾、想兼顾口语和小组互动的学生', '空堂可以外出；下午可以自选选修课。', 3),
    course('intensive-esl', '强化ESL（Intensive ESL）', 750, '一对一5节 + 1:4小组课1节', '想多上一对一、集中练口语的学生', '空堂可以外出；下午可以自选选修课。', 4),
    course('power-esl', '一对一强化（Power ESL）', 800, '一对一6节', '想把时间都放在一对一纠错和表达上的学生', '空堂可以外出；下午可以自选选修课。', 5),
    course('booster', '短期冲刺（Booster ESL）', 640, '一对一8节（8位老师）', '15岁以上、只读1–2周的学生', '只能单独报1周或2周；周一下午开课，公众假期的课自选参加。', 6, { feeByWeeks: { '1': 370, '2': 640 } }),
    course('ielts-basic', '雅思基础（IELTS Basic）', 850, '一对一4节（雅思、ESL）+ 1:4小组课4节（雅思、ESL）+ 单词测试 + 作文', '准备考雅思、还需要打英语基础的学生', `每两周一次模考。${SEMI_SPARTA_NOTE}`, 7),
    course('toeic', '托业（TOEIC）', 850, '一对一4节（托业、ESL）+ 1:4小组课4节（托业、ESL）+ 单词测试 + 作文', '为求职或升学准备托业的学生', SEMI_SPARTA_NOTE, 8),
    course('business', '商务英语（Business English）', 850, '一对一4节（商务、ESL）+ 1:4小组课4节（商务、ESL）', '工作中要用英语开会、写邮件和做简报的成人', '空堂可以外出；下午可以自选选修课。', 9),
    course('guardian', '亲子课程·家长（Family ESL Guardian）', 750, '一对一4节', '陪孩子来读书、自己也想学英语的家长', '家长的课不点名，可以转给孩子上（最多2节），也可以放弃；亲子课程没有选修课。', 10),
    course('junior', '亲子课程·孩子（Family ESL Junior）', 1150, '一对一4节（写作、听力、口语、阅读）+ 1:4小组课2节', '家长陪同来读书的小学、初中和高中学生', '须由家长陪同；亲子课程没有选修课。', 11),
  ],
  rooms: [
    { id: 'single', name: '单人间', label: '单人间', code: 'B-1', location: '校内', group: '校内宿舍', fee: 1000, note: '一个人住，自带卫生间。', enabled: true, sortOrder: 0 },
    { id: 'twin', name: '双人间', label: '双人间', code: 'B-2', location: '校内', group: '校内宿舍', fee: 750, note: '两人同住，适合朋友或家人同行。', enabled: true, sortOrder: 1 },
    { id: 'triple', name: '三人间', label: '三人间', code: 'B-3', location: '校内', group: '校内宿舍', fee: 700, note: '三人同住。', enabled: true, sortOrder: 2 },
    { id: 'quad', name: '四人间', label: '四人间', code: 'B-4', location: '校内', group: '校内宿舍', fee: 650, note: '四人同住，预算最低。', enabled: true, sortOrder: 3 },
  ],
  localFees: createCgLocalFees(),
  quoteSettings: {
    registrationFee: 100,
    futurePriceRegistrationStart: '', futurePriceArrivalStart: '',
    shortStayRatios: { ...CG_SHORT_STAY_RATIOS },
    peakSeasonFeePerWeek: 40,
    peakSeasonPolicyVersion: ASSOCIATION_PEAK_POLICY_VERSION,
    peakSeasonRanges: [
      { id: 'summer-2026', label: '2026暑期', start: '2026-07-05', end: '2026-08-30', enabled: true },
      { id: 'summer-2027', label: '2027暑期旺季', start: '2027-07-04', end: '2027-08-28', enabled: true },
    ],
    promotions: [
      { id: 'cg-banilad-sida-90', name: '思达启航折扣', description: '课程费和住宿费享9折。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'cg-banilad-off-season', name: '淡季优惠', description: '2026/08/30–2026/12/27入学，每满4周课程减150美元。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 150, coverageStart: '2026-08-30', coverageEnd: '2026-12-27', coverageTarget: 'course' },
      { id: 'cg-banilad-off-season-2027', name: '淡季优惠', description: '2027/02/14–2027/05/23入学，每满4周课程减150美元。', enabled: true, sortOrder: 4, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 150, coverageStart: '2027-02-14', coverageEnd: '2027-05-23', coverageTarget: 'course' },
      { id: 'cg-banilad-long-stay', name: '长期奖学金', description: '课程12/16/20/24周分别减50/100/150/200美元。', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 50, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 12, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 50, coverageTarget: 'none' },
      { id: 'cg-banilad-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 3, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: CG_LOCAL_FEE_INTRO,
    courseTableTitle: 'CG Banilad 课程价格（4周）',
    courseTableNote: '1–3周按4周价格的40%／60%／85%计算；短期冲刺按周计价。',
    groupClassNote: '小组课每班最多4人；每节课45分钟。',
    roomTableTitle: '住宿费 / 4周',
    roomTableNote: '所有房间都在校内；旺季请先确认空房。',
    stayPolicyTitle: 'CG Banilad 入住与退房',
    stayPolicies: [
      { label: '入住', value: '周日入住，周一开课', note: '第一天上午水平测试，下午说明会，之后可以到附近换钱和买日用品。' },
      { label: '退房', value: '课程结束那周的周六11:00前', note: '周日13:00以后才到校的学生，可以住到结业后的周日11:00。' },
      { label: '加住', value: '每人每晚1,500比索', note: '包括三餐、管理费和电费；须有空房，请提前申请。' },
    ],
    extraNightRates: [],
    cgPolicyVersion: CG_POLICY_VERSION,
  } as CgQuoteSettings,
  quoteImageSettings: createCgQuoteImageSettings(),
  media: [],
});

export const cloneCgBaniladContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCgBaniladContentConfig();
  const clone = cloneCgContent(value, defaults, 'cg-banilad-off-season-2027');
  if ((clone.quoteSettings.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION) {
    const confirmed = defaults.quoteSettings.peakSeasonRanges.find(range => range.id === 'summer-2027')!;
    const saved = clone.quoteSettings.peakSeasonRanges.find(range => range.id === confirmed.id || range.label.includes('2027'));
    if (saved) Object.assign(saved, confirmed); else clone.quoteSettings.peakSeasonRanges.push(copyJson(confirmed));
    clone.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  return clone;
};
