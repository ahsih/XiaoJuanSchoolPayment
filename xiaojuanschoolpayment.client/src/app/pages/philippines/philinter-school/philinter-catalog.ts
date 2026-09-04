export interface CourseFee { id: string; name: string; lookupName: string; tuition: number; suitable: string; }
export interface RoomFee { id: string; name: string; fee: number; note: string; }

export const PHILINTER_COURSES: CourseFee[] = [
  { id: 'light-esl', name: '轻量综合英语 Light ESL', lookupName: 'Light ESL', tuition: 790, suitable: '2节一对一 + 2节小团体 + 2节大团体选修 + 选修活动' },
  { id: 'general-esl', name: '常规综合英语 General ESL', lookupName: 'General ESL', tuition: 900, suitable: '3节一对一 + 1节小团体 + 2节小团体 + 2节大团体选修 + 选修活动' },
  { id: 'intensive-esl', name: '强化综合英语 Intensive ESL', lookupName: 'Intensive ESL', tuition: 1030, suitable: '4节一对一 + 1节小团体 + 2节精品团体 + 1节大团体 + 2节夜间辅导选修 + 选修活动；斯巴达管理，周一至周四强制自习，老师监督' },
  { id: 'intensive-power-speaking', name: '强化口语 Intensive Power Speaking', lookupName: 'Intensive Power Speaking', tuition: 1170, suitable: '4节一对一 + 2节小团体 + 2节精品小团体 + 2节夜间自习选修 + 选修活动；雅思2分起，每周口语测试' },
  { id: 'ielts-intensive', name: '雅思强化 IELTS Intensive', lookupName: 'IELTS Intensive', tuition: 1200, suitable: '4节一对一 + 4节小团体 + 2节强制夜间辅导 + 每周六上午模考；雅思3分起，周一至周四强制自习，老师监督' },
  { id: 'ielts-guarantee-8-weeks', name: '雅思8周保证班 IELTS Guarantee 8 Weeks', lookupName: 'IELTS Guarantee 8 Weeks', tuition: 1580, suitable: '4节一对一 + 4节小团体 + 2节强制夜间辅导 + 每周六上午模考；8周保证班；周一至周四强制自习，老师监督；目标4→5.5、5.5→6.5、6.5→7分' },
  { id: 'ielts-guarantee-12-weeks', name: '雅思12周保证班 IELTS Guarantee 12 Weeks', lookupName: 'IELTS Guarantee 12 Weeks', tuition: 1420, suitable: '4节一对一 + 4节小团体 + 2节强制夜间辅导 + 每周六上午模考；12周保证班；周一至周四强制自习，老师监督；目标4→5.5、5.5→6.5、6.5→7分' },
  { id: 'toeic-regular', name: '常规托业 TOEIC Regular', lookupName: 'TOEIC Regular', tuition: 1100, suitable: '4节一对一 + 2节小团体 + 2节大团体 + 选修活动 + 每周五模考；托业250–340分起，最多3节托业课可改为商务课' },
  { id: 'focus-industry', name: '行业英语 Focus Industry（可定制）', lookupName: 'Focus Industry（可定制）', tuition: 1280, suitable: '3节一对一 + 2节小团体 + 2节精品小团体 + 1节大团体选修 + 选修活动' },
  { id: 'basic-business', name: '基础商务英语 Basic Business', lookupName: 'Basic Business', tuition: 1150, suitable: '3节一对一 + 2节小团体 + 2节精品小团体 + 1节大团体选修 + 选修活动；雅思3分起' },
  { id: 'advanced-business', name: '进阶商务英语 Advanced Business', lookupName: 'Advanced Business', tuition: 1200, suitable: '3节一对一 + 2节小团体 + 2节精品小团体 + 1节大团体选修 + 选修活动；雅思3.5–4分起；商务演讲，每周模拟商务写作和口语' },
  { id: 'junior-esl-12-17-years', name: '青少年综合英语 Junior ESL（12–17岁）', lookupName: 'Junior ESL（12–17岁）', tuition: 1340, suitable: '3节一对一 + 2节小团体 + 2节选修自习课；放学后2小时主题或任务学习（课堂、自学、讨论等），周一至周四必修' },
  { id: 'junior-ielts-12-17-years', name: '青少年雅思 Junior IELTS（12–17岁）', lookupName: 'Junior IELTS（12–17岁）', tuition: 1490, suitable: '4节一对一 + 4节小团体 + 2节雅思强制自习 + 每周六上午模考；雅思3分起；放学后2小时主题或任务学习，周一至周四必修' },
  { id: 'speaking', name: '口语 Speaking', lookupName: 'Speaking', tuition: 1400, suitable: '8节口语团体课 + 2节晚课 + 2节选修课；最长8周' },
  { id: 'junior-speaking', name: '青少年口语 Junior Speaking', lookupName: 'Junior Speaking', tuition: 1400, suitable: '7节口语团体课 + 2节晚课 + 2节选修课；最长8周' },
];

export const PHILINTER_ROOMS: RoomFee[] = [
  { id: 'in-campus-triple', name: '校内三人房', fee: 810, note: '上下铺三人房；按每人床位计费' },
  { id: 'in-campus-twin', name: '校内双人房', fee: 970, note: '适合朋友同行或希望兼顾预算与舒适度' },
  { id: 'in-campus-single', name: '校内单人房', fee: 1400, note: '隐私最好，预算较高，热门档期需早确认' },
  { id: 'azon-triple', name: '校外公寓三人房', fee: 890, note: 'Azon Condo三人房；接送、门禁和空房需顾问确认' },
  { id: 'azon-twin', name: '校外公寓双人房', fee: 1100, note: 'Azon Condo双人房；适合重视生活品质的成人或家庭' },
  { id: 'azon-single', name: '校外公寓单人房', fee: 1690, note: 'Azon Condo单人房；接送、门禁和空房需顾问确认' },
];
