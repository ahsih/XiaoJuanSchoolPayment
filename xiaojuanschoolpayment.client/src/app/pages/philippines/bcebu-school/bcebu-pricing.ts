export interface BCebuCourse { id: string; name: string; tuition: number; suitable: string; note: string; }
export interface BCebuRoom { id: string; name: string; fee: number; note: string; }

// User-supplied 2026 four-week catalog. Names also identify the seeded API rows.
export const BCEBU_COURSES: BCebuCourse[] = [
  { id: 'speed-esl', name: 'Speed ESL', tuition: 900, suitable: '4节一对一 + 2节小组课 + 2节晚课（选修）', note: '初级到高级学生' },
  { id: 'intensive-esl', name: 'Intensive ESL', tuition: 1050, suitable: '6节一对一 + 2节晚课（选修）', note: '基础到高级，希望增加一对一课程的学生' },
  { id: 'ielts', name: 'IELTS', tuition: 1000, suitable: '4节一对一 + 2节团体课 + 1节选修早课 + 2节模拟测试（选修）', note: '不熟悉雅思考试体系、准备深入学习的学生' },
  { id: 'ielts-sparta', name: 'IELTS Sparta', tuition: 1050, suitable: '4节一对一 + 2节团体课 + 1节早课（强制）+ 2节模拟测试（强制）+ 自习', note: '自习有老师，22:00结束' },
  { id: 'ielts-guarantee', name: 'IELTS GUARANTEE', tuition: 1150, suitable: '4节一对一 + 2节团体课 + 1节选修早课 + 2节模拟测试（强制）', note: '需雅思官方成绩，12周起报；模拟测试20:40结束' },
  { id: 'b-sparta', name: "B'SPARTA", tuition: 1050, suitable: '5节一对一 + 2节小组课 + 3节强制晚课 + 2节强制自习', note: '斯巴达模式，强制参加' },
  { id: 'business-english', name: '商务英语', tuition: 1050, suitable: '4节一对一 + 2节小组课 + 2节必修课', note: '' },
  { id: 'junior-esl', name: 'Junior ESL', tuition: 1250, suitable: '6节一对一', note: '青少年学生（6–16岁）' },
  { id: 'lite-esl4', name: 'Lite ESL4', tuition: 750, suitable: '4节一对一', note: '喜欢慢节奏学习的学生' },
  { id: 'lite-esl2-40-plus', name: 'Lite ESL2（40岁以上）', tuition: 400, suitable: '2节一对一', note: '只适用于40岁以上学生' },
  { id: 'kindergarten', name: '幼儿园', tuition: 950, suitable: '08:30–12:20 / 13:30–17:00', note: '3–6岁' },
];

export const BCEBU_ROOMS: BCebuRoom[] = [
  { id: 'single-newtown-view', name: '单人间外景（马克坦新城）', fee: 1400, note: '50岁以上只能选择单人间' },
  { id: 'single-garden-view', name: '单人间内景（校内花园）', fee: 1350, note: '50岁以上只能选择单人间' },
  { id: 'double', name: '双人间', fee: 950, note: '标准双人间' },
  { id: 'double-living-room', name: '双人间+客厅', fee: 1250, note: '旺季仅限家庭；已婚夫妻、兄弟姐妹、朋友同时报名且同一学习市场，不接受个人入住' },
  { id: 'family-triple-extra-bed', name: '双人间+客厅（加床亲子3人）', fee: 1000, note: '亲子3人入住；旺季仅限家庭，同一学习市场，不接受个人入住' },
  { id: 'two-plus-one', name: '2+1宿舍（上下铺）', fee: 900, note: '只限女生，仅在淡季开放' },
  { id: 'triple-bunk', name: '三人间（上下铺）', fee: 750, note: '上下铺' },
];

export const BCEBU_REGISTRATION_NOTE = '一次性费用，老学员返校免费';
export const BCEBU_PROMOTION_DATES = '2026/2/16–6/29、2026/8/17–12/28入学';
export const BCEBU_REPORTER_NOTE = '4周起，每周优惠25美元，每天额外增加1节一对一课程；国内社交平台（小红书、抖音、快手等）需有500粉丝，发帖不少于100字；亲子家庭不参加。记者优惠在淡季折扣前计算，由中介预收，完成活动毕业后退叠加淡季及思达折扣后的实际差价。';
export const BCEBU_LONG_STAY_NOTE = '8周50美元、12周100美元、16周200美元、20周300美元、24周400美元；之后每满4周增加100美元，可与其他符合条件的优惠叠加。';
export const BCEBU_LOCAL_FEE_INTRO = '学杂费为到校后学校及相关部门收取的费用，与思达游学无关，仅供参考，以到校比索现金实收为准。接机费和可退房间押金另列，不计入学杂费合计。';
export const bcebuMultiplier = (weeks: number) => ({ 1: 0.4, 2: 0.6, 3: 0.8 }[weeks] ?? weeks / 4);
export const bcebuLongStay = (weeks: number) => weeks < 8 ? 0 : weeks < 12 ? 50 : 100 + Math.floor((weeks - 12) / 4) * 100;
export const bcebuOffSeason = (entry: string) => (entry >= '2026-02-16' && entry <= '2026-06-29') || (entry >= '2026-08-17' && entry <= '2026-12-28');
