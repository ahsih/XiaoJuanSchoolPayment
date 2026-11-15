export type SmeagCampus = 'capital' | 'encanto';

export interface SmeagHolidaySession {
  period: '上午' | '下午' | '全天';
  time: string;
  title: string;
  titleEn: string;
}

export interface SmeagCampusHolidaySchedule {
  status: 'closed' | 'special';
  label: string;
  sessions: SmeagHolidaySession[];
}

export interface SmeagHoliday2027 {
  date: string;
  month: number;
  day: number;
  weekday: string;
  holidayZh: string;
  holidayEn: string;
  capital: SmeagCampusHolidaySchedule;
  encanto: SmeagCampusHolidaySchedule;
}

const closed = (): SmeagCampusHolidaySchedule => ({
  status: 'closed',
  label: '全天停课',
  sessions: [],
});

const capitalClasses = (
  morningZh: string,
  morningEn: string,
  afternoonZh: string,
  afternoonEn: string,
): SmeagCampusHolidaySchedule => ({
  status: 'special',
  label: '假日特别课程',
  sessions: [
    { period: '上午', time: '09:00–12:00', title: morningZh, titleEn: morningEn },
    { period: '下午', time: '13:00–16:00', title: afternoonZh, titleEn: afternoonEn },
  ],
});

const encantoClasses = (): SmeagCampusHolidaySchedule => ({
  status: 'special',
  label: 'Best Holiday Classes 假日特别课程',
  sessions: [
    {
      period: '全天',
      time: '09:00–12:00 / 13:00–16:00',
      title: 'Best Holiday Classes（主题以学校通知为准）',
      titleEn: 'Best Holiday Classes',
    },
  ],
});

export const SMEAG_HOLIDAYS_2027: SmeagHoliday2027[] = [
  {
    date: '2027-01-01', month: 1, day: 1, weekday: '周五',
    holidayZh: '元旦', holidayEn: "New Year's Day",
    capital: closed(), encanto: closed(),
  },
  {
    date: '2027-01-18', month: 1, day: 18, weekday: '周一',
    holidayZh: '圣婴节庆典后校休日', holidayEn: 'After Sinulog Festival',
    capital: capitalClasses('托福备考', 'TOEFL Preparation', '发音训练', 'Pronunciation'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-02-26', month: 2, day: 26, weekday: '周五',
    holidayZh: '人民力量革命纪念日', holidayEn: 'People Power Anniversary',
    capital: capitalClasses('英语句型', 'Pattern English', '商务英语', 'Business English'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-03-12', month: 3, day: 12, weekday: '周五',
    holidayZh: '开斋节', holidayEn: 'Eid al-Fitr',
    capital: capitalClasses('托福模考练习（阅读与写作）', 'TOEFL Test Practices (Reading & Writing)', '托福模考练习（听力与口语）', 'TOEFL Test Practices (Listening & Speaking)'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-03-25', month: 3, day: 25, weekday: '周四',
    holidayZh: '圣周四', holidayEn: 'Maundy Thursday',
    capital: closed(), encanto: encantoClasses(),
  },
  {
    date: '2027-03-26', month: 3, day: 26, weekday: '周五',
    holidayZh: '耶稣受难日', holidayEn: 'Good Friday',
    capital: closed(), encanto: encantoClasses(),
  },
  {
    date: '2027-04-09', month: 4, day: 9, weekday: '周五',
    holidayZh: '英勇日', holidayEn: 'Day of Valor',
    capital: capitalClasses('托业应试技巧', 'TOEIC Test Tips', '习语与表达', 'Idioms & Expressions'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-05-21', month: 5, day: 21, weekday: '周五',
    holidayZh: '古尔邦节（宰牲节）', holidayEn: 'Eid al-Adha (Feast of Sacrifice)',
    capital: capitalClasses('托福备考', 'TOEFL Preparation', '发音训练', 'Pronunciation'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-08-14', month: 8, day: 14, weekday: '周六',
    holidayZh: 'SME-AG创校21周年纪念日', holidayEn: '21st SME-AG Founding Anniversary',
    capital: closed(), encanto: encantoClasses(),
  },
  {
    date: '2027-08-27', month: 8, day: 27, weekday: '周五',
    holidayZh: '国家英雄日', holidayEn: 'National Heroes Day',
    capital: capitalClasses('托福备考', 'TOEFL Preparation', '发音训练', 'Pronunciation'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-10-29', month: 10, day: 29, weekday: '周五',
    holidayZh: '诸圣节校休日', holidayEn: 'All Saints Day',
    capital: capitalClasses('口语强化', 'Speaking Master', '口语强化', 'Speaking Master'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-11-26', month: 11, day: 26, weekday: '周五',
    holidayZh: '博尼法西奥日', holidayEn: 'Bonifacio Day',
    capital: capitalClasses('雅思练习', 'IELTS Practices', '雅思练习', 'IELTS Practices'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-12-24', month: 12, day: 24, weekday: '周五',
    holidayZh: '平安夜', holidayEn: 'Christmas Eve',
    capital: closed(), encanto: encantoClasses(),
  },
  {
    date: '2027-12-30', month: 12, day: 30, weekday: '周四',
    holidayZh: '黎刹日', holidayEn: 'Rizal Day',
    capital: capitalClasses('词汇课', 'Vocabulary Class', '英语句型', 'Pattern English'),
    encanto: encantoClasses(),
  },
  {
    date: '2027-12-31', month: 12, day: 31, weekday: '周五',
    holidayZh: '跨年夜', holidayEn: "New Year's Eve",
    capital: closed(), encanto: encantoClasses(),
  },
];

export const SMEAG_MONTH_LABELS: Record<number, string> = {
  1: '1月', 2: '2月', 3: '3月', 4: '4月', 5: '5月', 8: '8月', 10: '10月', 11: '11月', 12: '12月',
};

export function getSmeagHolidaySchedule(holiday: SmeagHoliday2027, campus: SmeagCampus): SmeagCampusHolidaySchedule {
  return holiday[campus];
}
