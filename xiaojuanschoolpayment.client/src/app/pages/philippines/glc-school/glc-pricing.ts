/** GLC 2026 weekly prices supplied by the user. Currency codes remain internal. */
export interface GlcCourse {
  id: string;
  name: string;
  englishName?: string;
  chineseName: string;
  type: string;
  lessons: string;
  suitable: string;
  weeklyTuition: number;
  offSeasonEligible: boolean;
  annexOnly?: boolean;
  family?: boolean;
  textbook: 'esl' | 'ielts';
}

export interface GlcRoom {
  id: string;
  name: string;
  note: string;
  weeklyAccommodation: number;
}

export const GLC_COURSES: readonly GlcCourse[] = [
  { id: 'light-power-speaking', name: 'Light Power Speaking', chineseName: '轻量口语', type: '一般英语', lessons: '一对一3节 + 小组2节（选修课）', suitable: '15岁以上', weeklyTuition: 165, offSeasonEligible: false, textbook: 'esl' },
  { id: 'power-speaking', name: 'Power Speaking', chineseName: '标准口语', type: '一般英语', lessons: '一对一4节 + 小组2节（选修课）', suitable: '综合英语与口语训练', weeklyTuition: 215, offSeasonEligible: true, textbook: 'esl' },
  { id: 'intensive-power-speaking', name: 'Intensive Power Speaking', chineseName: '强化口语', type: '一般英语', lessons: '一对一5节 + 小组2节（选修课）', suitable: '增加一对一口语训练', weeklyTuition: 270, offSeasonEligible: true, textbook: 'esl' },
  { id: 'ultra7-power-speaking', name: 'Ultra7 Power Speaking', chineseName: '高强度口语7', type: '一般英语', lessons: '一对一7节 + 小组1节（选修课）', suitable: '高密度一对一学习', weeklyTuition: 375, offSeasonEligible: true, textbook: 'esl' },
  { id: 'ultra-sparta-esl', name: 'Ultra Sparta ESL', chineseName: '高强度斯巴达英语', type: '一般英语', lessons: '一对一5节 + 小组3节 + 词汇与写作测试 + 晚课2节 + 自习1节 + 周六上午课程', suitable: '仅限副楼住宿', weeklyTuition: 280, offSeasonEligible: true, annexOnly: true, textbook: 'esl' },
  ...([['2', 410, 8], ['3', 590, 12], ['4', 775, 16]] as const).map(([size, price, lessons]): GlcCourse => ({
    id: `family-package-${size}`, name: `Family Package ${size}`, chineseName: `亲子共享套餐${size}`, type: '亲子', lessons: `一对一${lessons}节（青少年与监护人共享）+ 小组课2节（仅限监护人）`, suitable: '儿童5–11岁；青少年12–14岁', weeklyTuition: price, offSeasonEligible: false, family: true, textbook: 'esl',
  })),
  ...([[6, 335], [7, 400], [8, 465]] as const).map(([lessons, price]): GlcCourse => ({
    id: `kids-english-${lessons}`, name: `Kids English ${lessons}`, chineseName: `儿童英语${lessons}`, type: '儿童英语', lessons: `一对一${lessons}节`, suitable: '5–11岁', weeklyTuition: price, offSeasonEligible: false, textbook: 'esl',
  })),
  ...([[6, 325], [7, 375], [8, 430]] as const).map(([lessons, price]): GlcCourse => ({
    id: `junior-power-speaking-${lessons}`, name: `Junior Power Speaking ${lessons}`, chineseName: `青少年口语${lessons}`, type: '青少年英语', lessons: `一对一${lessons}节`, suitable: '12–14岁', weeklyTuition: price, offSeasonEligible: false, textbook: 'esl',
  })),
  { id: 'general-ielts', name: 'General IELTS', chineseName: '标准雅思', type: '雅思', lessons: '一对一4节 + 小组2节 + 选修课', suitable: '', weeklyTuition: 240, offSeasonEligible: true, textbook: 'ielts' },
  { id: 'intensive-ielts', name: 'Intensive IELTS', chineseName: '强化雅思', type: '雅思', lessons: '一对一5节 + 小组2节 + 选修课', suitable: '', weeklyTuition: 300, offSeasonEligible: true, textbook: 'ielts' },
  { id: 'ultra8-ielts', name: 'Ultra8 IELTS', chineseName: '高强度雅思8', type: '雅思', lessons: '一对一8节 + 选修课', suitable: '', weeklyTuition: 430, offSeasonEligible: true, textbook: 'ielts' },
  { id: 'ultra-ielts-sparta', name: 'Ultra IELTS斯巴达', englishName: 'Ultra IELTS Sparta', chineseName: '高强度雅思斯巴达', type: '雅思', lessons: '一对一5节 + 小组3节（雅思强制）+ 词汇与写作测试 + 晚课2节 + 自习1节 + 周六上午模考', suitable: '仅限副楼住宿', weeklyTuition: 355, offSeasonEligible: true, annexOnly: true, textbook: 'ielts' },
  { id: 'business-course', name: 'Business course', chineseName: '商务英语', type: '商务', lessons: '一对一4节 + 小组2节（选修课）', suitable: '', weeklyTuition: 300, offSeasonEligible: true, textbook: 'esl' },
  { id: 'ultra7-business', name: 'Ultra7 Business', chineseName: '高强度商务7', type: '商务', lessons: '一对一7节 + 小组1节（选修课）', suitable: '', weeklyTuition: 465, offSeasonEligible: true, textbook: 'esl' },
];

export const GLC_ROOMS: readonly GlcRoom[] = [
  { id: 'main-deluxe-single', name: '主楼豪华单人间', weeklyAccommodation: 645, note: '斯巴达管理学生不能选择主楼住宿' },
  { id: 'main-single', name: '主楼单人间', weeklyAccommodation: 385, note: '斯巴达管理学生不能选择主楼住宿' },
  { id: 'main-double', name: '主楼双人间', weeklyAccommodation: 270, note: '斯巴达管理学生不能选择主楼住宿' },
  { id: 'main-triple', name: '主楼三人间', weeklyAccommodation: 220, note: '斯巴达管理学生不能选择主楼住宿' },
  { id: 'annex-double', name: '副楼双人间', weeklyAccommodation: 250, note: '斯巴达管理学生仅可选择副楼住宿' },
  { id: 'annex-single', name: '副楼单人间', weeklyAccommodation: 360, note: '斯巴达管理学生仅可选择副楼住宿' },
];

export const GLC_REGISTRATION_NOTE = '一次性费用，老学员返校免费';
export const GLC_LOCAL_FEE_INTRO = '学杂费由学校及相关部门直接收取，和思达游学无关；均为预估金额，仅供准备比索现金参考，具体以到校实收为准。';
export const glcCourseName = (course: GlcCourse) => `${course.chineseName}（${course.englishName ?? course.name}）`;
