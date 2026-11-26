// CG Sparta's versioned content document: courses, rooms, local fees, offers and quote-image copy. Course lines
// follow the school's 2026 Sparta price list, the Sparta orientation guide and the 2027 IELTS Guarantee schedule
// (2026-11 pack). Prices stay the 2026 list, which the school has not replaced for 2027. Keep this file pure data
// (no Angular, DOM or storage, no structuredClone), so the WeChat mini program can bundle it.
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

const EVENING = ' + 晚课 + 单词测试与作文 + 晚自习';

export const createDefaultCgSpartaContentConfig = (): CiaContentConfig => ({
  schemaVersion: 1,
  schoolCode: 'CG-SPARTA',
  courses: [
    course('sparta', '斯巴达（Sparta）', 800, `一对一4节 + 1:4小组课4节${EVENING}`, '想在全斯巴达环境里把听说读写打扎实的学生', '平日每天单词测试（通过线15分）。', 0),
    course('premier-sparta', '高阶斯巴达（Premier Sparta）', 850, `一对一5节 + 1:4小组课3节${EVENING}`, '想多上一节一对一的斯巴达学生', '平日每天单词测试（通过线15分）。', 1),
    course('toeic-sparta', '托业斯巴达（TOEIC Sparta）', 850, `一对一4节 + 1:4小组课4节${EVENING}`, '为求职或升学准备托业的学生', '每两周一次托业模考；单词测试通过线15分。', 2),
    course('toeic-premier', '高阶托业斯巴达（Premier TOEIC Sparta）', 900, `一对一5节 + 1:4小组课3节${EVENING}`, '托业目标明确、想多上一对一的学生', '每两周一次托业模考；单词测试通过线15分。', 3),
    course('ielts-basic', '雅思基础（IELTS Basic）', 850, `一对一4节（雅思、ESL）+ 1:4小组课4节（雅思、ESL）${EVENING}`, '准备考雅思、还需要打英语基础的学生', '每两周一次雅思模考；单词测试通过线15分。', 4),
    course('ielts-guarantee', '雅思保分班（IELTS Guarantee）', 1100, '一对一4节（口语、写作、阅读、语法）+ 小组课4节（雅思听力、雅思备考）+ 晚课 + 雅思单词测试 + 晚自习', '达到入学分数、要在12周内冲目标分的学生', '只能报12周（10周上课、2周等成绩），按学校指定日期开课；每周一次模考，晚课和单词测试都必上（通过线23分）。', 5),
    course('ielts-intensive', '雅思强化（IELTS Intensive）', 950, '一对一4节（口语、写作、阅读、语法）+ 小组课4节（雅思听力、雅思口语）+ 单词测试 + 晚自习', '目标雅思5.0–6.5、想集中备考的学生', '4周起报；每周一次模考；晚课自选，单词测试必上（通过线20分）。', 6, { minimumWeeks: 4 }),
    course('business-english', '商务英语（Business English）', 850, `一对一4节（商务英语、ESL）+ 1:4小组课4节（全球商务英语、ESL）${EVENING}`, '工作中要用英语开会、面试和写商务文件的成人', '单词测试通过线15分。', 7),
    course('booster', '短期冲刺（Booster ESL）', 640, '一对一8节（8位老师）+ 晚课或自习 + 单词测试与作文 + 晚自习', '只读1–2周的学生', '只能单独报1周或2周；周一下午开课，公众假期的课自选参加。', 8, { feeByWeeks: { '1': 370, '2': 640 } }),
  ],
  rooms: [
    { id: 'single', name: '单人间', label: '单人间', code: 'D-1', location: '校内', group: '校内宿舍', fee: 900, note: '一个人住，自带卫生间。', enabled: true, sortOrder: 0 },
    { id: 'twin', name: '双人间', label: '双人间', code: 'D-2', location: '校内', group: '校内宿舍', fee: 750, note: '两人同住，空调电费两人分摊。', enabled: true, sortOrder: 1 },
    { id: 'triple', name: '三人间', label: '三人间', code: 'D-3', location: '校内', group: '校内宿舍', fee: 700, note: '三人同住，空调电费按人数分摊。', enabled: true, sortOrder: 2 },
    { id: 'quad', name: '四人间', label: '四人间', code: 'D-4', location: '校内', group: '校内宿舍', fee: 650, note: '四人同住，预算最低。', enabled: true, sortOrder: 3 },
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
      { id: 'cg-sparta-sida-90', name: '思达启航折扣', description: '课程费和住宿费享9折。', enabled: true, sortOrder: 0, priority: 10, stackable: true, newStudentsOnly: false, discountType: 'percentage', discountValue: 10, appliesTo: 'tuition-and-accommodation', waiveRegistration: false, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
      { id: 'cg-sparta-off-season', name: '淡季优惠', description: '2026/08/30–2026/12/27入学，每满4周课程减150美元。', enabled: true, sortOrder: 1, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 150, coverageStart: '2026-08-30', coverageEnd: '2026-12-27', coverageTarget: 'course' },
      { id: 'cg-sparta-off-season-2027', name: '淡季优惠', description: '2027/02/14–2027/05/23入学，每满4周课程减150美元。', enabled: true, sortOrder: 4, priority: 20, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 150, coverageStart: '2027-02-14', coverageEnd: '2027-05-23', coverageTarget: 'course' },
      { id: 'cg-sparta-long-stay', name: '长期奖学金', description: '每段连续课程12/16/20/24周分别减50/100/150/200美元，最多200美元。', enabled: true, sortOrder: 2, priority: 30, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 50, appliesTo: 'tuition', waiveRegistration: false, minimumCourseWeeks: 12, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 50, coverageTarget: 'none' },
      { id: 'cg-sparta-returning-registration', name: '老学员返校', description: '老学员返校免收一次性注册费。', enabled: true, sortOrder: 3, priority: 40, stackable: true, newStudentsOnly: false, discountType: 'none', discountValue: 0, appliesTo: 'school-total', waiveRegistration: true, minimumCourseWeeks: 0, minimumAccommodationWeeks: 0, coverageTarget: 'none' },
    ],
    localFeeIntro: CG_LOCAL_FEE_INTRO,
    courseTableTitle: 'CG斯巴达校区课程价格（4周）',
    courseTableNote: '1–3周按4周价格的40%／60%／85%计算；雅思保分班只报12周，短期冲刺按周计价。',
    groupClassNote: '小组课每班最多4人（雅思保分班和雅思强化除外）；每节课45分钟。',
    roomTableTitle: '住宿费 / 4周',
    roomTableNote: '所有房间都在校内；房间空调电费按入住人数分摊。',
    stayPolicyTitle: 'CG斯巴达校区入住与退房',
    stayPolicies: [
      { label: '入住', value: '周日入住，周一开课', note: '第一天上午水平测试，下午新生说明会，之后到 Robinson 商场买日用品。' },
      { label: '退房', value: '课程结束那周的周六11:00前', note: '周日13:00以后才到校的学生，可以选周六或周日11:00退房。' },
      { label: '加住', value: '每人每晚1,500比索', note: '包括三餐、管理费和电费；须有空房，加住期间仍要遵守门禁等校规。' },
    ],
    extraNightRates: [],
    cgPolicyVersion: CG_POLICY_VERSION,
  } as CgQuoteSettings,
  quoteImageSettings: createCgQuoteImageSettings(),
  media: [],
});

export const cloneCgSpartaContentConfig = (value: CiaContentConfig): CiaContentConfig => {
  const defaults = createDefaultCgSpartaContentConfig();
  const clone = cloneCgContent(value, defaults, 'cg-sparta-off-season-2027');
  if ((clone.quoteSettings.peakSeasonPolicyVersion ?? 0) < ASSOCIATION_PEAK_POLICY_VERSION) {
    const confirmed = defaults.quoteSettings.peakSeasonRanges.find(range => range.id === 'summer-2027')!;
    const saved = clone.quoteSettings.peakSeasonRanges.find(range => range.id === confirmed.id || range.label.includes('2027'));
    if (saved) Object.assign(saved, confirmed); else clone.quoteSettings.peakSeasonRanges.push(copyJson(confirmed));
    clone.quoteSettings.peakSeasonPolicyVersion = ASSOCIATION_PEAK_POLICY_VERSION;
  }
  return clone;
};
