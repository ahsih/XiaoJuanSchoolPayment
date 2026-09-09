export type FellaCampus = 'campus1' | 'campus2';
export type FellaAirportPickup = 'none' | 'sunday' | 'other';

export interface FellaCourseFee {
  id: string;
  name: string;
  tuition: number;
  campuses: readonly FellaCampus[];
  schedule: string;
  requirement: string;
  familyCourse?: boolean;
}

export interface FellaRoomFee {
  id: string;
  name: string;
  fee: number;
  campuses: readonly FellaCampus[];
  note: string;
}

export const FELLA_CAMPUS_OPTIONS = [
  { value: 'campus1' as const, label: '第一校区（斯巴达）', management: '斯巴达' },
  { value: 'campus2' as const, label: '第二校区（自律型／半斯巴达）', management: '自律型、半斯巴达' },
];

export const FELLA_WEEK_OPTIONS = [4, 8, 12, 16, 20, 24] as const;
export const FELLA_DEFAULT_START_DATE = '2026-09-13';

const BOTH_CAMPUSES: readonly FellaCampus[] = ['campus1', 'campus2'];

export const FELLA_COURSE_FEES: FellaCourseFee[] = [
  { id: 'pic-4', name: 'PIC-4 一般英语课程', tuition: 950, campuses: BOTH_CAMPUSES, schedule: '一对一4节＋四人课2节＋八人课1节＋选修课（自由参加）', requirement: '自律型／半斯巴达可参加EOC挑战' },
  { id: 'pic-5', name: 'PIC-5 一般英语课程', tuition: 1000, campuses: BOTH_CAMPUSES, schedule: '一对一5节＋四人课1节＋八人课1节＋选修课（自由参加）', requirement: '无附加分数或年龄要求' },
  { id: 'pic-6', name: 'PIC-6 Power Speaking', tuition: 1050, campuses: BOTH_CAMPUSES, schedule: '一对一6节＋八人课1节＋选修课（自由参加）', requirement: '无附加分数或年龄要求' },
  { id: 'toeic-esl', name: 'TOEIC ESL 托业入门班', tuition: 1050, campuses: BOTH_CAMPUSES, schedule: '托业一对一2节＋ESL一对一2节＋ESL四人课2节＋ESL八人课1节＋选修课（自由参加）', requirement: '无附加分数或年龄要求' },
  { id: 'toeic-practice', name: 'TOEIC 托业实战班', tuition: 1050, campuses: BOTH_CAMPUSES, schedule: '一对一4节＋四人课2节＋ESL八人课1节＋选修课（自由参加）', requirement: '无附加分数或年龄要求' },
  { id: 'toeic-guarantee', name: 'TOEIC 托业保证班', tuition: 1100, campuses: ['campus1'], schedule: '一对一4节＋四人课2节＋ESL八人课1节＋强制晚自习及词汇测试', requirement: '仅第一校区' },
  { id: 'pift-e', name: 'PIFT-E 雅思实战班', tuition: 1050, campuses: BOTH_CAMPUSES, schedule: 'ESL一对一4节＋雅思四人课2节＋ESL八人课1节＋选修课（自由参加）', requirement: '入学参考1–2分' },
  { id: 'pift', name: 'PIFT 雅思实战班', tuition: 1050, campuses: BOTH_CAMPUSES, schedule: '一对一4节＋四人课2节＋八人课1节＋选修课（自由参加）', requirement: '入学参考2.5分以上' },
  { id: 'pirc', name: 'PIRC 雅思培训班', tuition: 1100, campuses: BOTH_CAMPUSES, schedule: '一对一5节＋四人课2节＋选修课（自由参加）', requirement: '入学参考2.5分以上' },
  { id: 'pigi', name: 'PIGI 雅思保证班', tuition: 1100, campuses: ['campus1'], schedule: '一对一4节＋四人课2节＋八人课1节＋强制晚自习及词汇测试', requirement: '仅第一校区' },
  { id: 'ppt', name: 'PPT 托福入门班', tuition: 1050, campuses: BOTH_CAMPUSES, schedule: '托福一对一2节＋ESL一对一2节＋ESL四人课2节＋ESL八人课1节＋选修课（自由参加）', requirement: '无附加分数或年龄要求' },
  { id: 'ptft', name: 'PTFT 托福实战班', tuition: 1050, campuses: BOTH_CAMPUSES, schedule: '托福一对一4节＋ESL四人课2节＋ESL八人课1节＋选修课（自由参加）', requirement: '无附加分数或年龄要求' },
  { id: 'ssc', name: 'SSC 乐龄会话课', tuition: 1100, campuses: ['campus2'], schedule: '一对一6节＋选修课（自由参加）', requirement: '第二校区自律型' },
  { id: 'p-jec', name: 'P-JEC 儿童课程', tuition: 1100, campuses: ['campus2'], schedule: '一对一课程4节＋选修课（自由参加）', requirement: '5–6岁', familyCourse: true },
  { id: 'jec', name: 'JEC 儿童课程', tuition: 1100, campuses: ['campus2'], schedule: '一对一课程4节＋四人课程2节＋选修课（自由参加）', requirement: '7–15岁', familyCourse: true },
  { id: 'gec', name: 'GEC 家长课程', tuition: 800, campuses: ['campus2'], schedule: '一对一课程3节＋选修课（自由参加）', requirement: '家长课程', familyCourse: true },
  { id: 'ebc', name: 'EBC 商业英文课程', tuition: 1050, campuses: ['campus2'], schedule: '一对一课程5节＋四人课程2节＋选修课（自由参加）', requirement: '无附加分数或年龄要求' },
];

export const FELLA_ROOM_FEES: FellaRoomFee[] = [
  { id: 'premium-1p', name: 'Premium 1P 单人间', fee: 1200, campuses: BOTH_CAMPUSES, note: '第一、第二校区均可选择；空房需确认' },
  { id: 'single-1a', name: '1A 单人间', fee: 1000, campuses: BOTH_CAMPUSES, note: '第一、第二校区均可选择；空房需确认' },
  { id: 'single-1b', name: '1B’ 单人间', fee: 950, campuses: BOTH_CAMPUSES, note: '第一、第二校区均可选择；空房需确认' },
  { id: 'twin-2a', name: '2A 双人间', fee: 850, campuses: BOTH_CAMPUSES, note: '第一、第二校区均可选择；空房需确认' },
  { id: 'triple-3a', name: '3A 三人间', fee: 750, campuses: BOTH_CAMPUSES, note: '第一、第二校区均可选择；空房需确认' },
];

export const FELLA_FAMILY_COURSE_IDS = new Set(['p-jec', 'jec', 'gec']);

