// Builds /content/schools/cpi.json for the WeChat mini program from the same data the CPI web page
// renders (cpi-page-profile.ts, cpi-page-content.ts and the default content configuration), like
// cia-mini-program.ts does for CIA. Sections carry the standard template part (`kind`); the mini
// program decides order, titles and folding. `pricing.defaults` is the complete default content
// document, so the mini program's CPI calculator (named by `pricing.quoteEngine`) runs on it exactly
// like on a published revision. CPI has no school calendar, reviews or peak surcharge, so those parts
// are left out.
import {
  MiniBlock,
  MiniImage,
  MiniPricingConfig,
  MiniSection,
  SCHOOL_MINI_PAGE_SCHEMA_VERSION,
  SchoolMiniPage,
} from '../../../mini-program/school-mini-page';
import { contactSection, miniAsset as asset, miniHeading as heading, miniNote as note, miniText as text } from '../../../mini-program/shared-sections';
import { CPI_PREMIUM_STAY_WINDOWS, cloneCpiContentConfig, createDefaultCpiContentConfig } from './cpi-content-config';
import { CPI_DORM_RULES, CPI_SCHEDULE, CPI_VIDEOS, cpiVideoPoster, cpiVideoSrc } from './cpi-page-content';
import { CPI_PAGE_PROFILE as profile } from './cpi-page-profile';

const copy = profile.copy;

/** Copy parts that are optional in the shared profile but that CPI always fills; the build fails if one goes missing. */
function required<T>(value: T | undefined, name: string): T {
  if (value === undefined) {
    throw new Error(`CPI page copy has no ${name}`);
  }
  return value;
}

const scheduleCopy = required(copy.schedule, 'schedule');
const campusCopy = required(copy.campus, 'campus');
const practicalGuideCopy = required(copy.practicalGuide, 'practicalGuide');

/** Database name of CPI, used by the mini program to find the published revision. */
export const CPI_MINI_PROGRAM_SCHOOL_NAME = '菲律宾宿务CPI语言学校';

/** The Premium open periods, said wherever a student picks a room (user decision 2026-11-21). */
const PREMIUM_DATES_NOTE = `只接受${CPI_PREMIUM_STAY_WINDOWS.map(period => period.label).join('、')}入住，其他日期不能报价。`;

/** The whole default content document (a superset of MiniPricingConfig), without media. */
function pricingDefaults(): MiniPricingConfig {
  const { media: _media, ...config } = cloneCpiContentConfig(createDefaultCpiContentConfig());
  return config;
}

/** 课程与价格：课程分组、价格、课程细节和每日作息 */
function coursesSection(): MiniSection {
  return {
    kind: 'courses',
    title: copy.courses.title,
    intro: copy.courses.intro,
    blocks: [
      { type: 'cards', layout: 'grid', items: profile.courseGroups.map(group => ({ title: group.title, text: group.text })) },
      { type: 'pricing', part: 'courses' },
      {
        type: 'details',
        items: [
          ...profile.courseDetailGuides.map(guide => ({
            title: guide.title,
            subtitle: guide.subtitle,
            blocks: [
              ...(guide.facts.length ? [{ type: 'facts' as const, items: guide.facts }] : []),
              ...(guide.points.length ? [{ type: 'list' as const, style: 'dot' as const, items: guide.points }] : []),
              ...(guide.image ? [{ type: 'image' as const, image: { src: asset(guide.image), caption: guide.imageCaption } }] : []),
              ...(guide.notice ? [note(guide.notice)] : []),
            ],
          })),
          {
            title: scheduleCopy.title,
            subtitle: scheduleCopy.intro,
            blocks: [
              { type: 'table', columns: ['时间', '安排'], rows: CPI_SCHEDULE.map(row => [row.time, row.activity]) } as MiniBlock,
            ],
          },
        ],
      },
      note(copy.referenceNote ?? ''),
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
        items: profile.roomProfiles.map(room => ({
          codes: (room.bookingCode ?? '').split('/').map(code => code.trim()).filter(Boolean),
          badge: room.location,
          title: room.label,
          subtitle: room.englishName,
          image: asset(room.image),
          images: room.gallery.map(asset),
          facts: [
            ...(room.bed ? [{ label: '床', value: room.bed }] : []),
            ...(room.service ? [{ label: '房务', value: room.service }] : []),
          ],
          text: `更适合：${room.suitable}`,
          points: room.highlights,
          note: room.id === 'premium' ? `${room.note} ${PREMIUM_DATES_NOTE}` : room.note,
        })),
      },
      { type: 'pricing', part: 'stay' },
      note(`${copy.gallery.photoNote}${copy.gallery.roomDisclaimer}`),
    ],
  };
}

/** 校园环境：校园介绍、楼栋、基本资料和相册（住宿照片跟房型放在一起） */
function campusSection(): MiniSection {
  const gallery = profile.gallery;
  const albums = gallery.albumCategories
    .filter(category => category !== '住宿')
    .map(category => ({
      title: `${category}相册`,
      description: gallery.albumDescriptions[category],
      images: gallery.images.filter(image => image.category === category).map((image): MiniImage => ({
        src: asset(image.src),
        title: image.title,
        caption: [image.description, ...(image.details ?? [])].join('\n'),
      })),
    }))
    .filter(album => album.images.length > 0);
  return {
    kind: 'campus',
    title: campusCopy.title,
    intro: campusCopy.intro,
    blocks: [
      { type: 'cards', layout: 'grid', items: profile.campusBuildings.map(building => ({ badge: building.code, title: building.title, points: building.facilities })) },
      { type: 'facts', items: [...profile.basicInfo] },
      { type: 'albums', albums },
      note(copy.gallery.photoNote),
    ],
  };
}

function policySections(): MiniSection[] {
  return [
    {
      kind: 'policies',
      title: copy.rooms.dormRulesTitle,
      blocks: [
        { type: 'facts', items: CPI_DORM_RULES.map(rule => ({ label: rule.title, value: rule.text })) },
        note(copy.referenceNote ?? ''),
      ],
    },
    {
      kind: 'policies',
      title: practicalGuideCopy.summaryTitle,
      intro: practicalGuideCopy.intro,
      blocks: [{
        type: 'cards',
        layout: 'list',
        items: profile.campusPracticalGuides.map(guide => ({
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

export function buildCpiMiniProgramPage(): SchoolMiniPage {
  const heroImages = profile.gallery.images
    .filter(image => profile.gallery.heroCategories.includes(image.category))
    .slice(0, 4)
    .map(image => ({ src: asset(image.src), title: image.title, caption: image.description }));

  const sections: MiniSection[] = [
    {
      kind: 'overview',
      blocks: [
        { type: 'facts', items: (profile.overviewFacts ?? []).map(fact => ({ label: fact.label, value: fact.value })) },
        { type: 'cards', layout: 'list', items: profile.snapshotCards.map(card => ({ title: card.title, text: card.text })) },
      ],
    },
    {
      kind: 'fit',
      blocks: [
        text(copy.advisorReview.text),
        { type: 'list', title: copy.advisorReview.suitableTitle, style: 'check', items: profile.suitableFor.map(item => item.title) },
        { type: 'list', title: copy.advisorReview.notSuitableTitle, style: 'cross', items: profile.notSuitableFor.map(item => item.title) },
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
    campusSection(),
    {
      kind: 'videos',
      intro: copy.videos.intro,
      // Landscape videos only, like CIA; the vertical clips stay on the website.
      blocks: [{
        type: 'videos',
        items: CPI_VIDEOS.filter(video => video.orientation === 'landscape').map(video => ({
          title: video.title,
          src: asset(cpiVideoSrc(video)),
          poster: asset(cpiVideoPoster(video)),
          text: video.description,
          points: [...(video.details ?? []), `时长 ${video.duration}`],
        })),
      }],
    },
    ...policySections(),
    {
      kind: 'faq',
      blocks: [{ type: 'details', items: profile.faqs().map(faq => ({ title: faq.question, blocks: [text(faq.answer)] })) }],
    },
    contactSection('CPI', { title: copy.finalCta.title, text: copy.finalCta.text }, {
      detailed: true,
      supportTitle: '深圳总部 + 菲律宾·欧洲驻点支持',
      supportBadge: '深圳总部 + 菲律宾·欧洲驻点',
    }),
  ];

  const defaults = createDefaultCpiContentConfig();
  return {
    schemaVersion: SCHOOL_MINI_PAGE_SCHEMA_VERSION,
    id: 'cpi',
    sitePath: '/philippines-study/cebu/cpi-cebu-pelis-institute',
    navigationTitle: 'CPI 语言学校',
    hero: {
      breadcrumb: copy.hero.breadcrumb,
      title: copy.hero.title,
      lead: copy.hero.lead,
      tags: copy.hero.tags.map(tag => tag.text),
      images: heroImages,
    },
    sections,
    pricing: {
      schoolName: CPI_MINI_PROGRAM_SCHOOL_NAME,
      schoolCode: 'CPI',
      // 2027 prices equal 2026, so the price table shows one column.
      labels: {
        tuition: '课程费',
        registrationNote: defaults.quoteImageSettings.paymentNotes.registration,
        peakSeasonTitle: '旺季',
        peakSeasonIntro: '12–2月、6–8月是旺季，CPI不收旺季附加费，但房间紧张，建议提前订。',
        peakSeasonNote: '',
        localFeesTitle: '到校后学杂费明细',
      },
      peakSeasonYears: [],
      quoteEngine: 'cpi',
      defaults: pricingDefaults(),
    },
  };
}
