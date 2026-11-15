// Source and unresolved source-table discrepancies: docs/cip-source-audit-2026-09-20.md.
// September 2026 CNY tuition; June 2026 PHP local fees. Never convert the other market's USD tuition.
export type CipCourseGroup = '日常英语' | '考试与商务' | '亲子与青少年';
export interface CipCourse {
  id: string; name: string; group: CipCourseGroup; tuition: number | null;
  mode: '轻量' | '半斯巴达' | '斯巴达' | '青少年'; maxWeeks: number; fixedWeeks?: number;
  ages?: [number, number]; schedule: string; note: string; confirmation?: string;
}
export interface CipRoom {
  id: string; name: string; fee: number; hotel: boolean; familyOnly?: boolean;
  sharedHotel?: boolean; detail: string;
}
export const CIP_REGISTRATION = 600;
export const CIP_WEEKS = [1, 2, 3, 4, 8, 12, 16, 20, 24];
export const CIP_COURSES: CipCourse[] = [
  { id: 'light-esl', name: 'Light ESL', group: '日常英语', tuition: 4320, mode: '轻量', maxWeeks: 24, schedule: '菲师一对一4节 + 大组1节', note: '适合希望兼顾学习与自由时间的学生。' },
  { id: 'native-light', name: 'Premium Native Light', group: '日常英语', tuition: 8220, mode: '轻量', maxWeeks: 24, schedule: '母语外教一对一4节 + 大组1节', note: '侧重口语与发音；入门水平须由学校评估。' },
  { id: 'regular-esl', name: 'Regular ESL', group: '日常英语', tuition: 4920, mode: '半斯巴达', maxWeeks: 24, schedule: '菲师一对一3节 + 小组3节 + 大组2节', note: '听说读写均衡学习。' },
  { id: 'native-esl', name: 'Native ESL', group: '日常英语', tuition: 6420, mode: '半斯巴达', maxWeeks: 24, schedule: '菲师一对一3节 + 母语一对一1节 + 小组3节 + 大组1节', note: '兼顾综合英语与母语外教口语；入门水平须评估。' },
  { id: 'speaking-master', name: 'Speaking Master', group: '日常英语', tuition: 7200, mode: '半斯巴达', maxWeeks: 8, schedule: '菲师一对一5节 + 母语一对一1节 + 小组1节 + 大组1节', note: '一对一为主的短期口语训练。' },
  { id: 'native-master', name: 'Native Master', group: '日常英语', tuition: 8200, mode: '半斯巴达', maxWeeks: 8, schedule: '菲师一对一4节 + 母语一对一2节 + 小组1节 + 大组1节', note: '增加母语外教口语练习。', confirmation: '此课程费用需顾问向学校确认。' },
  { id: 'intensive-esl', name: 'Intensive ESL', group: '日常英语', tuition: 5640, mode: '斯巴达', maxWeeks: 24, schedule: '菲师一对一5节 + 小组2节 + 大组1节', note: '另有必修晚课、自习及周六课；入门水平须评估。' },
  { id: 'speak-up', name: 'Speak Up', group: '日常英语', tuition: 7620, mode: '半斯巴达', maxWeeks: 2, schedule: '菲师一对一7节 + 母语一对一1节', note: '仅1—2周。手册列每周40节、节假日授课；报名时确认实际课表。' },
  { id: 'advanced-business', name: 'Advanced Business', group: '考试与商务', tuition: 6960, mode: '半斯巴达', maxWeeks: 12, schedule: '菲师一对一3节 + 母语一对一1节 + 小组2节 + 大组1节', note: '需专业面试；参考门槛IELTS 4.5 / TOEIC 690。' },
  { id: 'toeic-regular', name: 'TOEIC Regular', group: '考试与商务', tuition: 5280, mode: '半斯巴达', maxWeeks: 16, schedule: '菲师一对一5节 + 小组2节 + 大组1节', note: '需专业面试；参考门槛TOEIC 250。' },
  { id: 'ielts-intensive', name: 'IELTS Intensive', group: '考试与商务', tuition: 6180, mode: '斯巴达', maxWeeks: 16, schedule: '菲师一对一4节 + 小组4节', note: '参考IELTS 3.5；需专业面试，另有晚课、自习及周六课。' },
  { id: 'ielts-native', name: 'IELTS Native', group: '考试与商务', tuition: 7200, mode: '斯巴达', maxWeeks: 16, schedule: '菲师一对一3节 + 母语一对一1节 + 小组4节', note: '参考IELTS 3.5；需专业面试，另有晚课、自习及周六课。' },
  { id: 'ielts-basic', name: 'IELTS Basic', group: '考试与商务', tuition: 5820, mode: '斯巴达', maxWeeks: 4, fixedWeeks: 4, schedule: '菲师一对一4节 + 小组3节 + 大组1节', note: '固定4周，参考IELTS 2.5—3.0；测试与面试流程待确认。另有晚课和自习。' },
  { id: 'ielts-guarantee-8', name: 'IELTS Guarantee · 8周', group: '考试与商务', tuition: 7920, mode: '斯巴达', maxWeeks: 8, fixedWeeks: 8, schedule: '菲师一对一4节 + 小组4节', note: '须面试。目标分数、入学成绩及出勤等保分条件须逐项确认；另有晚课和自习。' },
  { id: 'ielts-guarantee-12', name: 'IELTS Guarantee · 12周', group: '考试与商务', tuition: 7200, mode: '斯巴达', maxWeeks: 12, fixedWeeks: 12, schedule: '菲师一对一4节 + 小组4节', note: '须面试并确认保分条件；另有晚课和自习。', confirmation: '12周保分项目费用需顾问向学校确认。' },
  { id: 'toefl-intensive', name: 'TOEFL Intensive', group: '考试与商务', tuition: null, mode: '斯巴达', maxWeeks: 24, schedule: '菲师一对一5节 + 小组2节 + 大组1节', note: '另有晚课与自习；本期人民币价格及最新入学面试流程需咨询。', confirmation: '本期尚无已确认的TOEFL人民币价格。' },
  { id: 'primary-english', name: 'Primary English', group: '亲子与青少年', tuition: 7380, mode: '青少年', maxWeeks: 16, ages: [7, 11], schedule: '菲师一对一5节 + 小组1节', note: '7—11岁，另有2节可选晚间作业辅导。' },
  { id: 'junior-esl', name: 'Junior ESL', group: '亲子与青少年', tuition: 7920, mode: '青少年', maxWeeks: 16, ages: [12, 15], schedule: '菲师一对一5节 + 小组2节', note: '12—15岁，另有2节可选晚间作业辅导。' },
  { id: 'junior-native', name: 'Junior Native', group: '亲子与青少年', tuition: 8940, mode: '青少年', maxWeeks: 16, ages: [12, 15], schedule: '菲师一对一4节 + 母语一对一1节 + 小组2节', note: '12—15岁，母语外教课需相应基础，另有2节可选晚间辅导。' },
];
export const CIP_ROOMS: CipRoom[] = [
  { id: 'in-campus-single-a', name: '校内单人A', fee: 6480, hotel: false, detail: '独住；A型布局与配置见实景，独立卫浴。' },
  { id: 'in-campus-single-b', name: '校内单人B', fee: 5580, hotel: false, detail: '独住；B型布局与A型不同，独立卫浴，预算较低。' },
  { id: 'in-campus-double', name: '校内双人间', fee: 4680, hotel: false, detail: '2人合住，共用房内卫浴。' },
  { id: 'in-campus-triple', name: '校内三人间', fee: 4020, hotel: false, detail: '3人合住，共用房内卫浴，适合控制预算。' },
  { id: 'd4', name: '校内家庭四人间', fee: 3420, hotel: false, familyOnly: true, detail: '仅限家庭，三人房加床；按每位就读成员参考，须确认家庭床位安排。' },
  { id: 'deluxe-king-single', name: '酒店King · 单人使用', fee: 11564, hotel: true, detail: '约28㎡，一张大床，单人使用价格。' },
  { id: 'deluxe-king-double', name: '酒店King · 双人使用', fee: 6874, hotel: true, sharedHotel: true, detail: '约28㎡，一张大床；入住人数与收费口径须确认。' },
  { id: 'deluxe-twin-double', name: '酒店Twin · 双人使用', fee: 7571, hotel: true, sharedHotel: true, detail: '约28㎡，一张双人床和一张单人床。' },
  { id: 'deluxe-twin-triple', name: '酒店Twin · 三人使用', fee: 5688, hotel: true, sharedHotel: true, detail: '约28㎡，一张双人床和一张单人床。' },
  { id: 'executive-suite-triple', name: '酒店双卧套房 · 三人使用', fee: 8275, hotel: true, sharedHotel: true, detail: '约63㎡，两卧两卫、小厨房及沙发床。' },
  { id: 'executive-suite-quad', name: '酒店双卧套房 · 四人使用', fee: 6626, hotel: true, sharedHotel: true, detail: '约63㎡，两卧两卫、小厨房；容量不代表全人数已定价。' },
];
export function cipAllowedWeeks(course: CipCourse): number[] {
  return CIP_WEEKS.filter(w => course.fixedWeeks ? w === course.fixedWeeks : w <= course.maxWeeks);
}
export function cipDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}
export function cipEndDate(start: string, weeks: number): string | null {
  const date = cipDate(start);
  if (!date || date.getUTCDay() !== 0 || !CIP_WEEKS.includes(weeks)) return null;
  date.setUTCDate(date.getUTCDate() + weeks * 7 - 1);
  return date.toISOString().slice(0, 10);
}
export function cipNextSunday(today = new Date()): string {
  const d = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  d.setUTCDate(d.getUTCDate() + (7 - d.getUTCDay()) % 7);
  return d.toISOString().slice(0, 10);
}
export interface CipLocalFees { weeks: number; hotel: boolean; rows: { label: string; amount: number }[]; subtotal: number; deposit: number; total: number; }
export function cipLocalFees(weeks: number, hotel: boolean): CipLocalFees | null {
  const index = CIP_WEEKS.indexOf(weeks);
  if (index < 0) return null;
  const rows = [
    { label: '签证延期（学校参考）', amount: [0, 0, 0, 0, 5640, 13060, 18000, 23450, 29400][index] },
    { label: 'SSP学习许可', amount: weeks === 24 ? 13600 : 6800 },
    { label: 'SSP I-Card', amount: weeks === 24 ? 8000 : 4000 },
    { label: 'ACR I-Card', amount: weeks >= 12 ? 4000 : 0 },
    ...(!hotel ? [{ label: '宿舍基础电费', amount: 600 * weeks }] : []),
    { label: '公共设施费', amount: 500 * weeks },
    { label: '学生证', amount: 250 },
  ];
  const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const deposit = hotel ? 0 : [2000, 2000, 3000, 3000, 4000, 5000, 5000, 5000, 5000][index];
  return { weeks, hotel, rows, subtotal, deposit, total: subtotal + deposit };
}
export function cipPickup(airport: 'clark' | 'manila', people: number): number | null {
  if (!Number.isInteger(people) || people < 1) return null;
  return (airport === 'clark' ? [1000, 1500, 2000] : [4500, 5500, 6500])[Math.min(people, 3) - 1];
}
