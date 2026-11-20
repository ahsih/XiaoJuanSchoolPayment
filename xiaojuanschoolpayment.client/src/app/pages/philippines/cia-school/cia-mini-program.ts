// Builds /content/schools/cia.json for the WeChat mini program from the same data the CIA web
// page renders (cia-page-content.ts, cia-student-reviews.data.ts and the default content
// configuration). Sections are tagged with the standard template part (`kind`) they belong to;
// the mini program decides order, titles and folding, so every school page looks the same.
// Prices are exported as `pricing` parts that the mini program draws from the live published
// revision when there is one. `pricing.defaults` is the complete default content document, so the
// mini program's quote calculator (the bundled cia-quote-engine.ts, named by `pricing.quoteEngine`)
// can run on it exactly like on a published revision.
import {
  MiniBlock,
  MiniImage,
  MiniPricingConfig,
  MiniSection,
  SCHOOL_MINI_PAGE_SCHEMA_VERSION,
  SchoolMiniPage,
} from '../../../mini-program/school-mini-page';
import { contactSection, miniAsset as asset, miniHeading as heading, miniNote as note, miniText as text } from '../../../mini-program/shared-sections';
import { cloneCiaContentConfig, createDefaultCiaContentConfig } from './cia-content-config';
import {
  CIA_BASIC_INFO,
  CIA_CAMPUS_BUILDINGS,
  CIA_CAMPUS_PRACTICAL_GUIDES,
  CIA_COURSE_CHOICE_CARDS,
  CIA_COURSE_DETAIL_GUIDES,
  currentCiaFaqs,
  CIA_FRIDAY_SCHEDULE,
  CIA_GALLERY_ALBUM_CATEGORIES,
  CIA_GALLERY_ALBUM_DESCRIPTIONS,
  CIA_GALLERY_IMAGES,
  CIA_HERO_GALLERY_CATEGORIES,
  CIA_HOLIDAY_CALENDARS,
  CIA_IELTS_COMPUTER_EXAM_DATES_2027,
  CIA_NOT_SUITABLE_FOR,
  CIA_PAGE_COPY as copy,
  CIA_ROOM_COMPARISON_PROFILES,
  CIA_SNAPSHOT_CARDS,
  CIA_STUDENT_CARE_SERVICES,
  CIA_STUDENT_TRACKS,
  CIA_SUITABLE_FOR,
  CIA_VIDEO_CARDS,
  CIA_WEEKDAY_SCHEDULE,
  type DailyScheduleRow,
} from './cia-page-content';
import { CIA_STUDENT_REVIEWS } from './cia-student-reviews.data';

const scheduleTable = (title: string, rows: DailyScheduleRow[]): MiniBlock => ({
  type: 'table',
  title,
  columns: ['时间', '安排'],
  rows: rows.map(row => [row.time, row.activity]),
});

/** The whole default content document (a superset of MiniPricingConfig), without media. */
function pricingDefaults(): MiniPricingConfig {
  const { media: _media, ...config } = cloneCiaContentConfig(createDefaultCiaContentConfig());
  return config;
}

/** 课程与价格：选课建议、价格、成人/亲子区分，以及折叠的课程细节和每日课表 */
function coursesSection(): MiniSection {
  return {
    kind: 'courses',
    intro: copy.courses.intro,
    blocks: [
      { type: 'cards', layout: 'grid', items: CIA_COURSE_CHOICE_CARDS.map(card => ({ badge: card.label, title: card.title, text: card.text })) },
      { type: 'pricing', part: 'courses' },
      heading(copy.studentTracks.title),
      { type: 'cards', layout: 'list', items: CIA_STUDENT_TRACKS.map(track => ({ title: track.title, text: track.text })) },
      heading(copy.courses.guideTitle, copy.courses.guideEyebrow),
      text(copy.courses.guideIntro),
      {
        type: 'details',
        items: [
          ...CIA_COURSE_DETAIL_GUIDES.map(guide => ({
            title: guide.title,
            subtitle: guide.subtitle,
            blocks: [
              ...(guide.facts.length ? [{ type: 'facts' as const, items: guide.facts }] : []),
              { type: 'list' as const, style: 'dot' as const, items: guide.points },
              ...(guide.image ? [{ type: 'image' as const, image: { src: asset(guide.image), caption: guide.imageCaption } }] : []),
              ...(guide.notice ? [note(guide.notice)] : []),
            ],
          })),
          {
            title: copy.schedule.title,
            subtitle: copy.schedule.intro,
            blocks: [
              scheduleTable(copy.schedule.weekdayTitle, CIA_WEEKDAY_SCHEDULE),
              scheduleTable(copy.schedule.fridayTitle, CIA_FRIDAY_SCHEDULE),
              note(copy.schedule.note),
            ],
          },
          {
            title: copy.courses.ruleNoteTitle,
            blocks: [note(copy.courses.ruleNoteText)],
          },
        ],
      },
    ],
  };
}

/** 住宿与价格：每类房型的照片、配置和实时价格放在一起 */
function roomsSection(): MiniSection {
  return {
    kind: 'rooms',
    blocks: [
      {
        type: 'rooms',
        items: CIA_ROOM_COMPARISON_PROFILES.map(profile => ({
          codes: profile.bookingCode.split('/').map(code => code.trim()).filter(Boolean),
          badge: profile.location,
          title: profile.label,
          subtitle: profile.englishName,
          image: asset(profile.image),
          images: profile.gallery.map(asset),
          facts: [
            { label: '参考面积', value: profile.size },
            { label: '可能景观', value: profile.view },
            { label: '床尺寸', value: profile.bed },
            { label: '房务频率', value: profile.service },
          ],
          text: `更适合：${profile.suitable}`,
          points: profile.highlights,
          note: profile.note,
        })),
      },
      { type: 'pricing', part: 'stay' },
      note(copy.gallery.roomDisclaimer),
    ],
  };
}

/** 校园环境：校园介绍、楼栋、基本资料、学习规则和相册 */
function campusSection(): MiniSection {
  // Accommodation photos are shown with the room types instead of as an album, like the website.
  const albums = CIA_GALLERY_ALBUM_CATEGORIES
    .filter(category => category !== '住宿')
    .map(category => ({
      title: `${category}相册`,
      description: CIA_GALLERY_ALBUM_DESCRIPTIONS[category],
      images: CIA_GALLERY_IMAGES.filter(image => image.category === category).map((image): MiniImage => ({
        src: asset(image.src),
        title: image.title,
        caption: [image.description, ...(image.details ?? [])].join('\n'),
      })),
    }))
    .filter(album => album.images.length > 0);
  return {
    kind: 'campus',
    intro: copy.campus.intro,
    blocks: [
      { type: 'cards', layout: 'grid', items: CIA_CAMPUS_BUILDINGS.map(building => ({ badge: building.code, title: building.title, points: building.facilities })) },
      { type: 'facts', items: CIA_BASIC_INFO },
      heading(copy.campus.ruleTitle),
      note(copy.campus.ruleText),
      { type: 'albums', albums },
      note(copy.gallery.photoNote),
    ],
  };
}

function calendarSections(): MiniSection[] {
  return [
    {
      kind: 'calendar',
      eyebrow: copy.calendar.eyebrow,
      title: copy.calendar.title,
      intro: copy.calendar.intro,
      blocks: [
        { type: 'pricing', part: 'peakSeason' },
        {
          type: 'details',
          items: CIA_HOLIDAY_CALENDARS.map(calendar => ({
            title: `${calendar.year}年学校假期表`,
            subtitle: calendar.label,
            open: calendar.year === 2027,
            blocks: [{
              type: 'dates' as const,
              groups: calendar.months.map(month => ({
                title: `${month.month}月`,
                dates: month.holidays.map(holiday => ({
                  day: holiday.day,
                  text: holiday.name,
                  note: holiday.provisional ? copy.calendar.provisionalLabel : undefined,
                })),
              })),
            }],
          })),
        },
        note(copy.calendar.footnote),
      ],
    },
    {
      kind: 'calendar',
      eyebrow: copy.ielts.eyebrow,
      title: copy.ielts.title,
      intro: copy.ielts.intro,
      blocks: [
        {
          type: 'dates',
          title: copy.ielts.badge,
          groups: CIA_IELTS_COMPUTER_EXAM_DATES_2027.map(exam => ({
            title: `${exam.month}月`,
            dates: exam.days.map(day => ({ day: `${day}日` })),
          })),
        },
        { type: 'link', label: copy.ielts.officialLinkLabel, url: copy.ielts.officialUrl },
      ],
    },
  ];
}

function policySections(): MiniSection[] {
  return [
    {
      kind: 'policies',
      eyebrow: copy.refund.eyebrow,
      title: copy.refund.title,
      intro: copy.refund.intro,
      blocks: [{
        type: 'cards',
        layout: 'list',
        items: copy.refund.groups.map(group => ({
          title: group.title,
          text: group.note || undefined,
          facts: group.rules.map(rule => ({ label: rule.when, value: rule.text })),
          note: group.footnote || undefined,
        })),
      }],
    },
    {
      kind: 'policies',
      title: copy.practicalGuide.summaryTitle,
      intro: copy.practicalGuide.intro,
      blocks: [{
        type: 'cards',
        layout: 'list',
        items: CIA_CAMPUS_PRACTICAL_GUIDES.map(guide => ({
          badge: guide.eyebrow,
          title: guide.title,
          facts: guide.facts,
          points: guide.points,
          note: guide.note,
        })),
      }],
    },
  ];
}

export function buildCiaMiniProgramPage(): SchoolMiniPage {
  const heroImages = CIA_GALLERY_IMAGES
    .filter(image => CIA_HERO_GALLERY_CATEGORIES.includes(image.category))
    .slice(0, 4)
    .map(image => ({ src: asset(image.src), title: image.title, caption: image.description }));

  const sections: MiniSection[] = [
    {
      kind: 'overview',
      blocks: [{ type: 'cards', layout: 'list', items: CIA_SNAPSHOT_CARDS.map(card => ({ title: card.title, text: card.text })) }],
    },
    {
      kind: 'fit',
      blocks: [
        text(copy.advisorReview.text),
        { type: 'list', title: copy.advisorReview.suitableTitle, style: 'check', items: CIA_SUITABLE_FOR.map(item => item.title) },
        { type: 'list', title: copy.advisorReview.notSuitableTitle, style: 'cross', items: CIA_NOT_SUITABLE_FOR.map(item => item.title) },
      ],
    },
    coursesSection(),
    roomsSection(),
    {
      kind: 'fees',
      blocks: [
        { type: 'pricing', part: 'promotions' },
        { type: 'pricing', part: 'localFees' },
      ],
    },
    {
      kind: 'features',
      eyebrow: copy.studentCare.eyebrow,
      title: copy.studentCare.title,
      intro: copy.studentCare.intro,
      blocks: [{
        type: 'cards',
        layout: 'list',
        items: CIA_STUDENT_CARE_SERVICES.map((service, index) => ({
          badge: service.number,
          title: service.title,
          subtitle: service.subtitle,
          text: service.text,
          image: index === 0 ? asset(copy.studentCare.featureImage) : undefined,
          facts: [
            { label: '地点', value: service.location },
            { label: '时间', value: service.schedule },
          ],
        })),
      }],
    },
    campusSection(),
    {
      kind: 'videos',
      intro: copy.videos.intro,
      blocks: [{
        type: 'videos',
        items: CIA_VIDEO_CARDS.map(video => ({
          title: video.title,
          src: asset(video.videoSrc),
          poster: video.poster ? asset(video.poster) : undefined,
          text: video.text,
          points: video.details,
        })),
      }],
    },
    ...calendarSections(),
    ...policySections(),
    {
      kind: 'reviews',
      intro: copy.reviews.intro,
      blocks: [{
        type: 'details',
        items: CIA_STUDENT_REVIEWS.map(review => ({
          title: review.title,
          subtitle: `STORY ${review.number} · ${review.focus}`,
          blocks: [
            { type: 'image' as const, image: { src: asset(review.image), caption: review.focus } },
            { type: 'text' as const, text: review.excerpt, style: 'quote' as const },
            ...review.body.map(paragraph => text(paragraph)),
          ],
        })),
      }],
    },
    {
      kind: 'faq',
      blocks: [{ type: 'details', items: currentCiaFaqs().map(faq => ({ title: faq.question, blocks: [text(faq.answer)] })) }],
    },
    contactSection('CIA', { title: copy.finalCta.title, text: copy.finalCta.text }, {
      detailed: true,
      supportTitle: '深圳总部 + 菲律宾·欧洲驻点支持',
      supportBadge: '深圳总部 + 菲律宾·欧洲驻点',
    }),
  ];

  return {
    schemaVersion: SCHOOL_MINI_PAGE_SCHEMA_VERSION,
    id: 'cia',
    sitePath: '/philippines-study/cebu/cia-cebu-international-academy',
    navigationTitle: 'CIA 语言学校',
    hero: {
      breadcrumb: copy.hero.breadcrumb,
      title: copy.hero.title,
      lead: copy.hero.lead,
      tags: copy.hero.tags.map(tag => tag.text),
      images: heroImages,
    },
    sections,
    pricing: {
      schoolName: 'CIA Cebu International Academy',
      schoolCode: 'CIA',
      labels: {
        tuition: '2026年内入学价',
        tuition2027: '2027新价',
        registrationNote: createDefaultCiaContentConfig().quoteImageSettings.paymentNotes.registration,
        peakSeasonTitle: copy.calendar.peakTitle,
        peakSeasonIntro: copy.calendar.peakIntro,
        peakSeasonNote: copy.calendar.peakNote,
        localFeesTitle: '到校后学杂费明细',
      },
      peakSeasonYears: ['2027'],
      quoteEngine: 'cia',
      defaults: pricingDefaults(),
    },
  };
}
