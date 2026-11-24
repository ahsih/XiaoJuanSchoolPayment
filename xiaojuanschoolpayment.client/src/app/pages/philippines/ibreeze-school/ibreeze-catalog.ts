/**
 * User-confirmed 2026 catalog (4-week prices). IDs also match the database lookup aliases.
 * Course text follows the school's 2026-11-20 Chinese introduction only; nothing is inferred.
 * `lessons` gives only the daily one-to-one and group class counts.
 */
export const IBREEZE_COURSES = [
  {
    id: 'intensive-speaking', name: '密集口语 Intensive Speaking', tuition: 770,
    lessons: '每天4节一对一（无小组课）',
    suitable: '喜欢一对一、想在短时间内提升口语的学生',
    note: '一对一内容：口语、对话、语法、阅读。16岁以上（国际年龄）。',
  },
  {
    id: 'light-esl', name: '轻度ESL Light ESL', tuition: 840,
    lessons: '每天4节一对一 + 2节小组课',
    suitable: '想按平衡节奏提升英语的长期学习者',
    note: '一对一：口语、阅读、听力、语法；小组课：日常对话、辩论、讨论和实用表达。16岁以上（国际年龄）。',
  },
  {
    id: 'general-business-and-bec', name: '商务英语 General Business & BEC', tuition: 890,
    lessons: '每天4节一对一 + 2节小组课',
    suitable: '想练商务演示、商务邮件和专业词汇的职场人士',
    note: '一对一：商务函电、商务演示、商务阅读、商务语法；最后一周做专题展示。入学要求：雅思3.0、托业350或校内A2，未达要求改上轻度ESL且不退差价，也可第4周月考后再转入。商务小组课至少3人，不足时改上ESL小组课。最长4周。',
  },
  {
    id: 'power-esl', name: '强化英语 Power ESL', tuition: 990,
    lessons: '每天5节一对一 + 2节小组课 + 1节特色小组课',
    suitable: '有一定基础（A2及以上）、想课程密集、快速进步的学生',
    note: '一对一：阅读、写作、口语、听力、语法。小组课最多6人；特色小组课最多10人，由母语外教或资深主管教师授课（A1学生由资深主管教师授课）。报名8周及以上，最后2周可免费改为打工度假准备课（简历、面试、职场对话），视学校名额而定。',
  },
  {
    id: 'intensive-beginner', name: '零基础强化 Intensive Beginner', tuition: 990,
    lessons: '每天5节一对一 + 3节小组课',
    suitable: '零基础（Pre-A1到A1）、缺乏英语学习信心的学生',
    note: '一对一：发音与词汇、口语、阅读、听力、语法；小组课最多6人。须参加每日词汇测试、完成全部作业，主带老师每周反馈。与强化英语同价，入学测试后按水平互换。',
  },
  {
    id: 'ielts-starter', name: '雅思起步 IELTS Starter', tuition: 990,
    lessons: '每天4节一对一 + 3节小组课',
    suitable: '雅思零基础，之后想升入雅思目标课程的学生',
    note: '一对一：口语与发音、听力、阅读与词汇、写作。每两周一次模考和解析，由雅思主管老师跟进分数。入学要求：雅思2.5、托业250或校内A1。课程3–8周。',
  },
  {
    id: 'ielts-target', name: '雅思目标 IELTS Target', tuition: 1190,
    lessons: '每天5节一对一 + 3节小组课',
    suitable: '有雅思目标分数、需要系统备考的学生',
    note: '一对一：口语与发音、听力、阅读、写作；第一周制定个人学习计划。每周一次模考和解析。晚间雅思课18:30–20:00，报名12周以上必须参加。入学要求：雅思3.5、托业350或校内A2。最少4周。',
  },
  {
    id: 'toeic-target', name: '托业目标 TOEIC Target', tuition: 1020,
    lessons: '每天5节一对一 + 2节小组课',
    suitable: '为求职或学业准备托业的学生',
    note: '可按需要选托业2项（听力、阅读）或4项（加口语、写作）。每周一次模考和解析。入学要求：雅思3.5、托业350或校内A2，未达要求改上强化英语且不退差价，也可第4周月考后再转入。托业小组课至少3人，不足时改上ESL小组课。',
  },
  {
    id: 'junior-english', name: '青少年英语 Junior ESL & YLE', tuition: 1290,
    lessons: '每天4节一对一 + 2节小组课',
    suitable: '5–15岁与家长同行的孩子，以及单独来读的未成年学生',
    note: '一对一：Bricks阅读、口语、写作与语法、自然拼读与词汇、YLE；小组课：词汇和写作活动。每月水平测试，每周给家长发学习周报；没有家长陪同、单独来读的学生每月一次跳岛游。',
  },
];

/** On-campus dormitories: IB1 is the main campus, IB2 the Prime campus building. */
export const IBREEZE_ROOMS = [
  { id: 'quad-main', name: 'IB1四人间', fee: 720, note: 'IB1主校区，上下铺；女生住D栋，男生住E栋' },
  { id: 'triple-main', name: 'IB1三人间', fee: 790, note: 'IB1主校区' },
  { id: 'twin-main', name: 'IB1双人间', fee: 900, note: 'IB1主校区' },
  { id: 'single-main', name: 'IB1单人间', fee: 1270, note: 'IB1主校区，一人一间' },
  { id: 'quad-ib2', name: 'IB2四人间', fee: 750, note: 'IB2 Prime校区，上下铺' },
  { id: 'twin-ib2', name: 'IB2双人间', fee: 950, note: 'IB2 Prime校区' },
  { id: 'single-ib2', name: 'IB2单人间', fee: 1320, note: 'IB2 Prime校区，一人一间' },
  { id: 'off-campus-superior-single', name: '校外公寓高级单人间', fee: 1420, note: '1张大床（Queen），独立卧室和客厅；带厨房，含水费和Wi-Fi' },
  { id: 'off-campus-standard-single', name: '校外公寓标准单人间', fee: 1390, note: '一人入住，房内2张单人床；带厨房，含水费和Wi-Fi' },
  { id: 'off-campus-standard-twin', name: '校外公寓标准双人间', fee: 1050, note: '2张单人床；带厨房，含水费和Wi-Fi' },
  { id: 'off-campus-superior-twin', name: '校外公寓高级双人间', fee: 1070, note: '两人入住；带厨房，含水费和Wi-Fi' },
  { id: 'off-campus-family', name: '校外公寓家庭房', fee: 890, note: '2间卧室、2个卫生间和客厅，1张大床＋2张单人床，可住3–5人（至少3人）；带厨房，含水费和Wi-Fi' },
];

