// CampusTop content for the shared Philippine school page (school-page/ph-school-page.component.*), one profile per
// campus. Text and data come from qq-page-content.ts; prices and rules from qq-content-config.ts and qq-pricing.ts.
// Keep it pure data (no Angular, DOM or storage), like the modules it reads.
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  CIA_CTA_CONSULTANTS,
  CIA_GALLERY_CATEGORIES,
  CIA_PAGE_COPY,
  CIA_SIDA_REASONS,
  CIA_SIDA_TRUST_BADGES,
  type RoomRateGroup,
} from '../cia-school/cia-page-content';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { PhPageCopy, PhSchoolProfile, PhVideoTab } from '../school-page/ph-school-profile';
import { createDefaultQqContentConfig, qqCampusContent } from './qq-content-config';
import {
  QQ_ALBUM_DESCRIPTIONS,
  QQ_CLOSED_DAYS_2027,
  QQ_COURSE_DETAIL_GUIDES,
  QQ_COURSE_GROUPS,
  QQ_FINAL_CTA_BADGES,
  QQ_PAGE_CONTENT,
  QQ_REFERENCE_NOTE,
  QQ_VIDEOS,
  qqVideoPoster,
  qqVideoSrc,
} from './qq-page-content';
import { QQ_PEAK_2027, type QqCampus } from './qq-pricing';

/** Database school name; both campuses share one school record and one content document. */
export const QQ_SCHOOL_NAME = '菲律宾宿务QQEnglish（Beachfront Campus）';

function qqCopy(campus: QqCampus): PhPageCopy {
  const page = QQ_PAGE_CONTENT[campus];
  const short = campus === 'itp' ? 'IT Park校区' : 'Beach Front校区';
  const brand = (text: string) => text.replace(/CIA/g, 'QQ English');
  return {
    swipeHint: CIA_PAGE_COPY.swipeHint,
    referenceNote: QQ_REFERENCE_NOTE,
    hero: {
      breadcrumb: page.breadcrumb,
      title: page.title,
      lead: page.heroLead,
      tags: page.heroTags.map(tag => ({ ...tag })),
      // “获取 CampusTop 最新报价” is cut off on a 375px phone.
      quoteLabel: '获取最新报价',
    },
    overview: { title: `30 秒看懂 ${short}` },
    advisorReview: {
      title: `顾问怎么看 ${short}`,
      text: page.advisorText,
      suitableTitle: '适合谁',
      notSuitableTitle: '报名前想清楚',
    },
    campus: { eyebrow: 'CAMPUS AT A GLANCE', title: `${page.shortName} 校园介绍`, intro: page.campusIntro },
    gallery: {
      title: `按区域查看 ${short} 环境`,
      intro: '相册内用左右箭头或缩略图切换，点击主图可放大。校区照片截自学校官方视频。',
      photoNote: CIA_PAGE_COPY.gallery.photoNote,
      roomComparisonTitle: '房型对比',
      roomDisclaimer: QQ_REFERENCE_NOTE,
    },
    courses: {
      title: '每天几节一对一？',
      intro: '课程只按每天的课时选：4、6或8节一对一，15岁以上还可以加2节小团课。每节课50分钟，课在学生App上自己约。',
      priceUnit: '/4周',
      fitLabel: '适合人群',
      noteLabel: '课程说明',
      detailSummaryTitle: '查看约课和孩子的规定',
      detailSummaryHint: '约课取消规则、小团课、孩子和家长',
      guideTitle: '报名前值得确认的课程细节',
    },
    schedule: {
      eyebrow: 'DAILY TIMETABLE',
      title: '每日课程表参考',
      intro: '4节一对一 + 2节小团课的例子；一对一的时段在App上自己约，小团课时间固定，以学校实际安排为准。',
      badge: '每节课50分钟',
    },
    planning: {
      summaryTitle: '2027年学校停课日',
      summaryHint: '停课日不上课，也不收课程费',
    },
    calendar: {
      eyebrow: 'ACADEMIC CALENDAR',
      title: 'QQ English 2027年停课日',
      intro: '下表是学校停课的日子，当天不上课，课程费按实际上课天数计算，不收这几天。其他菲律宾公众假期学校照常上课，按学校报价系统每天另收35美元假期上课费（报价器会自动算）。',
      peakEyebrow: '2027 PEAK SEASON',
      peakTitle: '2027年旺季',
      peakIntro: 'QQ English没有旺季附加费；7/11–8/14有用餐和陪同的特别规定，7/25–8/7入学最少报名2周。',
      peakNote: '旺季房间紧张，请尽早确认空房。',
      footnote: '政府可能临时增加或调整假期，以学校当期通知为准。',
    },
    videos: {
      eyebrow: 'SCHOOL VIDEOS',
      title: `用视频了解 ${short}`,
      intro: '学校官方频道的校园介绍和学员访谈。',
      badge: 'QQ English 视频',
    },
    rooms: {
      photoTitle: '房型实景',
      photoIntro: page.roomsPhotoIntro,
      rulesTitle: '入住、退房与住宿规定',
      rulesHint: '按晚计算的房费、入住退房时间、酒店房间人数',
      dormRulesTitle: '宿舍规定',
    },
    quote: {
      ...CIA_PAGE_COPY.quote,
      compareShortcuts: [
        { focus: 'room', label: '比住宿', hint: campus === 'itp' ? '如太空舱和Treewoods酒店' : '如太空舱和Savoy酒店' },
        { focus: 'course', label: '比课时', hint: '如4节、6节和8节一对一' },
        { focus: 'weeks', label: '比周数', hint: '如4周、8周、12周' },
      ],
    },
    fees: CIA_PAGE_COPY.fees,
    practicalGuide: {
      summaryTitle: '到校须知与学校服务',
      summaryHint: '用餐、洗衣、活动、看病、入学和接机',
      intro: '出发前和到校后最常问到的安排。',
    },
    sida: {
      ...CIA_PAGE_COPY.sida,
      title: brand(CIA_PAGE_COPY.sida.title),
      photoAlt: brand(CIA_PAGE_COPY.sida.photoAlt),
      photoCaption: brand(CIA_PAGE_COPY.sida.photoCaption),
    },
    faq: CIA_PAGE_COPY.faq,
    finalCta: {
      title: page.finalCtaTitle,
      text: page.finalCtaText,
      primaryLabel: '获取 QQ English 完整报价单',
      secondaryLabel: '咨询当前空房',
    },
  };
}

/** The campus's own part of the shared CampusTop document, filled up to the current schema. */
export function qqCampusDefaults(campus: QqCampus): CiaContentConfig {
  return qqCampusContent(createDefaultQqContentConfig(), campus);
}

export function qqPageProfile(campus: QqCampus): PhSchoolProfile {
  const page = QQ_PAGE_CONTENT[campus];
  const defaultContent = () => qqCampusDefaults(campus);
  const defaults = defaultContent();
  const initialPricing = createCiaQuotePricing(defaults);
  const videoIcons = { 校园视频: 'videocam', 学员访谈: 'record_voice_over' } as const;
  const videoTabs: PhVideoTab[] = (['校园视频', '学员访谈'] as const)
    .map(topic => ({
      label: topic,
      icon: videoIcons[topic],
      items: QQ_VIDEOS[campus]
        .filter(video => video.topic === topic)
        .map(video => ({
          title: video.title,
          text: video.description,
          src: qqVideoSrc(campus, video),
          poster: qqVideoPoster(campus, video),
          duration: video.duration,
          shape: 'wide' as const,
        })),
    }))
    .filter(tab => tab.items.length > 0);
  const initialRoomRateGroups: RoomRateGroup[] = [...new Set(defaults.rooms.map(room => room.group))].map(title => ({
    title,
    rooms: defaults.rooms
      .filter(room => room.enabled && room.group === title)
      .map(room => ({ id: room.id, label: room.label, code: room.code, location: room.location })),
  }));

  return {
    code: defaults.schoolCode,
    name: page.shortName,
    previewPrefix: `qq-${campus}`,
    pricingSchoolName: QQ_SCHOOL_NAME,
    copy: qqCopy(campus),
    compactLayout: true,
    videoTabs,
    overviewFacts: page.overviewFacts,
    courseHighlights: {},
    gallery: {
      categories: CIA_GALLERY_CATEGORIES,
      albumCategories: [...page.albumCategories],
      images: page.galleryImages.map(image => ({ ...image })),
      heroCategories: page.heroCategories,
      albumDescriptions: QQ_ALBUM_DESCRIPTIONS,
      uploadedPhotoTitle: `${page.shortName} 学校媒体`,
      uploadedPhotoDescription: `${page.shortName} 学校实景内容`,
      uploadedVideoTitle: `${page.shortName} 学校视频`,
    },
    snapshotCards: page.quickInfo,
    basicInfo: page.basicInfo,
    suitableFor: page.suitableFor.map(title => ({ title, text: '' })),
    notSuitableFor: page.notSuitableFor.map(title => ({ title, text: '' })),
    campusBuildings: page.campusBuildings,
    videoCards: [],
    campusLifeVideos: [],
    interviewVideos: [],
    courseGroups: QQ_COURSE_GROUPS,
    studyModes: [],
    courseDetailGuides: QQ_COURSE_DETAIL_GUIDES,
    scheduleColumns: page.scheduleColumns,
    initialCourseFees: initialPricing.courseFees,
    initialRoomFees: initialPricing.roomFees,
    initialRoomRateGroups,
    showRoomCodes: false,
    dormRules: [],
    roomProfiles: page.roomProfiles,
    shortStayRows: [
      { label: '4节一对一', text: '1周276美元，2周490美元，3周588美元，8周1,520美元' },
      { label: '怎么算', text: '按实际上课天数：读3–7周和8周以上每天的单价不同，学校停课日不收费' },
      { label: '住宿', text: '按晚：太空舱1–3周每晚17.15美元、4周以上每晚13美元；酒店按间计' },
    ],
    peakSeasonsWithoutSurcharge: {
      title: '2027年旺季（不收附加费）',
      ranges: [{ start: QQ_PEAK_2027.start, end: QQ_PEAK_2027.end, label: '用餐和陪同有特别规定；7/25–8/7入学最少2周' }],
    },
    ieltsResults: [],
    studentReviews: [],
    reviewPath: '',
    holidayCalendars: [QQ_CLOSED_DAYS_2027],
    ieltsComputerExamDates2027: [],
    studentCareServices: [],
    campusPracticalGuides: page.practicalGuides,
    studentTracks: [],
    sidaReasons: CIA_SIDA_REASONS.map(reason => ({ ...reason, alt: reason.alt.replace(/CIA/g, 'QQ English') })),
    sidaTrustBadges: CIA_SIDA_TRUST_BADGES,
    ctaBadges: QQ_FINAL_CTA_BADGES,
    ctaConsultants: CIA_CTA_CONSULTANTS,
    mobileAnchors: [
      { label: '视频', target: 'gallery', icon: 'smart_display' },
      { label: '概览', target: 'overview', icon: 'dashboard' },
      { label: '课程', target: 'courses', icon: 'menu_book' },
      { label: '住宿', target: 'rooms', icon: 'bed' },
      { label: '报价', target: 'quote', icon: 'calculate' },
      { label: 'FAQ', target: 'faq', icon: 'help' },
    ],
    faqs: () => page.faqs.map(item => ({ ...item })),
    shows2026Prices: () => false,
    defaultContent,
    cloneContent: value => qqCampusContent(value, campus),
  };
}
