// Builds /content/schools/<id>.json for a school on the shared Philippine page template (school-page/) from
// the same profile its website page renders, so the mini program shows the same text, photos, videos and
// prices. Written for EV, CPILS and the two CELLA campuses; CIA and CPI keep their own builders
// (cia-mini-program.ts, cpi-mini-program.ts) so their exported files stay unchanged. Sections carry the
// standard template part (`kind`); the mini program decides order, titles and folding. A part the school
// has no content for is left out. Pure data code, bundled and run in Node at build time.
import type { CiaContentConfig } from '../pages/philippines/cia-school/cia-content-config';
import type { PhSchoolProfile } from '../pages/philippines/school-page/ph-school-profile';
import {
  MiniBlock,
  MiniDetailItem,
  MiniImage,
  MiniPricing,
  MiniPricingConfig,
  MiniSection,
  SCHOOL_MINI_PAGE_SCHEMA_VERSION,
  SchoolMiniPage,
} from './school-mini-page';
import { contactSection, miniAsset as asset, miniHeading as heading, miniNote as note, miniText as text } from './shared-sections';

export interface TemplateSchoolMiniPageOptions {
  id: string;
  sitePath: string;
  navigationTitle: string;
  /** Database school name the mini program looks up for the published revision. */
  schoolName: string;
  quoteEngine: NonNullable<MiniPricing['quoteEngine']>;
  /** Column label of the course price list (one price per course). */
  tuitionLabel: string;
  /** Extra line appended to one room type's note, keyed by room profile id. */
  roomNotes?: Readonly<Record<string, string>>;
}

const notEmpty = (value: string | undefined): value is string => !!value && value.trim().length > 0;
const noteBlocks = (value: string | undefined): MiniBlock[] => (notEmpty(value) ? [note(value)] : []);

/** The whole default content document (a superset of MiniPricingConfig), without media. */
function pricingDefaults(content: CiaContentConfig): MiniPricingConfig {
  const { media: _media, ...config } = content;
  return config;
}

function heroImages(profile: PhSchoolProfile): MiniImage[] {
  return profile.gallery.images
    .filter(image => profile.gallery.heroCategories.includes(image.category))
    .slice(0, 4)
    .map(image => ({ src: asset(image.src), title: image.title, caption: image.description }));
}

/** 30 秒看懂 and 顾问点评. */
function overviewSections(profile: PhSchoolProfile): MiniSection[] {
  const copy = profile.copy;
  return [
    {
      kind: 'overview',
      blocks: [
        ...(profile.overviewFacts?.length ? [{ type: 'facts' as const, items: profile.overviewFacts.map(fact => ({ label: fact.label, value: fact.value })) }] : []),
        ...(profile.snapshotCards.length ? [{ type: 'cards' as const, layout: 'list' as const, items: profile.snapshotCards.map(card => ({ title: card.title, text: card.text })) }] : []),
      ],
    },
    {
      kind: 'fit',
      blocks: [
        text(copy.advisorReview.text),
        { type: 'list', title: copy.advisorReview.suitableTitle, style: 'check', items: profile.suitableFor.map(item => item.title) },
        ...(profile.notSuitableFor.length
          ? [{ type: 'list' as const, title: copy.advisorReview.notSuitableTitle, style: 'cross' as const, items: profile.notSuitableFor.map(item => item.title) }]
          : []),
      ],
    },
  ];
}

/** 课程与价格：课程分组、价格、课程说明、学习模式和每日作息 */
function coursesSection(profile: PhSchoolProfile): MiniSection {
  const copy = profile.copy;
  const guides: MiniDetailItem[] = profile.courseDetailGuides.map(guide => ({
    title: guide.title,
    subtitle: guide.subtitle,
    blocks: [
      ...(guide.facts.length ? [{ type: 'facts' as const, items: guide.facts }] : []),
      ...(guide.points.length ? [{ type: 'list' as const, style: 'dot' as const, items: guide.points }] : []),
      ...(guide.levels?.length
        ? [{
          type: 'table' as const,
          title: copy.courses.levelTableCaption,
          columns: ['级别', '名称', '分数', 'CEFR'],
          rows: guide.levels.map(level => [level.code, level.name, level.score, level.cefr]),
        }]
        : []),
      ...(guide.image ? [{ type: 'image' as const, image: { src: asset(guide.image), caption: guide.imageCaption } }] : []),
      ...noteBlocks(guide.notice),
    ],
  }));
  // 斯巴达 / 半斯巴达 (EV): fixed study times and going-out hours of each mode.
  const modes: MiniDetailItem[] = profile.studyModes.map(mode => ({
    title: mode.title,
    subtitle: mode.contrastTitle,
    blocks: [
      { type: 'facts', items: mode.timeBlocks.map(block => ({ label: `${block.label} ${block.time}`, value: block.text })) },
      ...(mode.curfew.length ? [{ type: 'facts' as const, items: mode.curfew.map(item => ({ label: `${item.day}外出`, value: item.time })) }] : []),
    ],
  }));
  const schedules: MiniDetailItem[] = copy.schedule && profile.scheduleColumns.length
    ? [{
      title: copy.schedule.title,
      subtitle: copy.schedule.intro,
      blocks: profile.scheduleColumns.map((column): MiniBlock => ({
        type: 'table',
        title: profile.scheduleColumns.length > 1 ? column.title : undefined,
        columns: ['时间', '安排'],
        rows: column.rows.map(row => [row.time, row.activity]),
      })),
    }]
    : [];
  const studyModes = copy.studyModes && modes.length
    ? [heading(copy.studyModes.title), text(copy.studyModes.intro), { type: 'details' as const, items: modes }, ...noteBlocks(copy.studyModes.note)]
    : [];
  return {
    kind: 'courses',
    title: copy.courses.title,
    intro: copy.courses.intro,
    blocks: [
      { type: 'cards', layout: 'grid', items: profile.courseGroups.map(group => ({ title: group.title, text: group.text })) },
      { type: 'pricing', part: 'courses' },
      ...studyModes,
      ...(guides.length + schedules.length ? [{ type: 'details' as const, items: [...guides, ...schedules] }] : []),
      ...noteBlocks(copy.referenceNote),
    ],
  };
}

/** 住宿与价格：每类房型的照片、配置和实时价格放在一起 */
function roomsSection(profile: PhSchoolProfile, content: CiaContentConfig, roomNotes: Readonly<Record<string, string>>): MiniSection {
  const copy = profile.copy;
  // Booking codes (CIA, CPI) or, for schools without them, the content rooms' codes behind the profile's room ids.
  const codes = (room: PhSchoolProfile['roomProfiles'][number]): string[] => room.bookingCode
    ? room.bookingCode.split('/').map(code => code.trim()).filter(Boolean)
    : (room.rateIds ?? []).map(id => content.rooms.find(item => item.id === id)?.code ?? '').filter(Boolean);
  return {
    kind: 'rooms',
    blocks: [
      {
        type: 'rooms',
        items: profile.roomProfiles.map(room => {
          const facts = [
            ...(room.size ? [{ label: '面积', value: room.size }] : []),
            ...(room.bed ? [{ label: '床', value: room.bed }] : []),
            ...(room.service ? [{ label: '房务', value: room.service }] : []),
          ];
          const roomNote = [room.note, roomNotes[room.id]].filter(notEmpty).join(' ');
          return {
            codes: codes(room),
            badge: room.location,
            title: room.label,
            ...(room.englishName ? { subtitle: room.englishName } : {}),
            image: asset(room.image),
            images: room.gallery.map(asset),
            ...(facts.length ? { facts } : {}),
            text: `更适合：${room.suitable}`,
            points: room.highlights ?? [],
            ...(roomNote ? { note: roomNote } : {}),
          };
        }),
      },
      { type: 'pricing', part: 'stay' },
      ...noteBlocks(`${copy.gallery.photoNote}${copy.gallery.roomDisclaimer}`),
    ],
  };
}

/** 校园环境：楼栋、基本资料和相册（住宿照片跟房型放在一起） */
function campusSection(profile: PhSchoolProfile): MiniSection {
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
    title: profile.copy.campus?.title,
    intro: profile.copy.campus?.intro,
    blocks: [
      ...(profile.campusBuildings.length
        ? [{ type: 'cards' as const, layout: 'grid' as const, items: profile.campusBuildings.map(building => ({ badge: building.code, title: building.title, points: building.facilities })) }]
        : []),
      ...(profile.basicInfo.length ? [{ type: 'facts' as const, items: [...profile.basicInfo] }] : []),
      ...(albums.length ? [{ type: 'albums' as const, albums }] : []),
      ...noteBlocks(profile.copy.gallery.photoNote),
    ],
  };
}

/** The compact layout's album videos, landscape and square only like CIA and CPI; the vertical clips stay on the website. */
function videosSection(profile: PhSchoolProfile): MiniSection | null {
  const items = (profile.videoTabs ?? []).flatMap(tab => tab.items)
    .filter(video => video.shape !== 'tall')
    .map(video => ({
      title: video.title,
      src: asset(video.src),
      ...(video.poster ? { poster: asset(video.poster) } : {}),
      text: video.text,
      points: video.duration ? [`时长 ${video.duration}`] : [],
    }));
  return items.length ? { kind: 'videos', intro: profile.copy.videos.intro, blocks: [{ type: 'videos', items }] } : null;
}

/** 旺季附加费 when the school has an enabled peak range in 2027. */
function calendarSection(profile: PhSchoolProfile, content: CiaContentConfig): MiniSection | null {
  const calendar = profile.copy.calendar;
  const has2027 = content.quoteSettings.peakSeasonRanges.some(range => range.enabled !== false && range.start.startsWith('2027-'));
  return calendar && has2027
    ? { kind: 'calendar', eyebrow: calendar.eyebrow, title: calendar.title, intro: calendar.intro, blocks: [{ type: 'pricing', part: 'peakSeason' }] }
    : null;
}

function policySections(profile: PhSchoolProfile): MiniSection[] {
  const copy = profile.copy;
  const sections: MiniSection[] = [];
  if (profile.dormRules.length) {
    sections.push({
      kind: 'policies',
      title: copy.rooms.dormRulesTitle,
      blocks: [
        { type: 'facts', items: profile.dormRules.map(rule => ({ label: rule.title, value: rule.text })) },
        ...noteBlocks(copy.rooms.dormRulesNote ?? copy.referenceNote),
      ],
    });
  }
  if (copy.practicalGuide && profile.campusPracticalGuides.length) {
    sections.push({
      kind: 'policies',
      title: copy.practicalGuide.summaryTitle,
      intro: copy.practicalGuide.intro,
      blocks: [{
        type: 'cards',
        layout: 'list',
        items: profile.campusPracticalGuides.map(guide => ({
          badge: guide.eyebrow,
          title: guide.title,
          ...(guide.facts.length ? { facts: guide.facts } : {}),
          ...(guide.points?.length ? { points: guide.points } : {}),
          ...(notEmpty(guide.note) ? { note: guide.note } : {}),
        })),
      }],
    });
  }
  return sections;
}

export function buildTemplateSchoolMiniPage(profile: PhSchoolProfile, options: TemplateSchoolMiniPageOptions): SchoolMiniPage {
  const copy = profile.copy;
  const content = profile.cloneContent(profile.defaultContent());
  const sections: MiniSection[] = [
    ...overviewSections(profile),
    coursesSection(profile),
    roomsSection(profile, content, options.roomNotes ?? {}),
    {
      kind: 'fees',
      blocks: [
        { type: 'pricing', part: 'promotions' },
        { type: 'pricing', part: 'localFees' },
      ],
    },
    campusSection(profile),
    ...[videosSection(profile), calendarSection(profile, content)].filter((section): section is MiniSection => !!section),
    ...policySections(profile),
    {
      kind: 'faq',
      blocks: [{ type: 'details', items: profile.faqs().map(faq => ({ title: faq.question, blocks: [text(faq.answer)] })) }],
    },
    contactSection(profile.name, { title: copy.finalCta.title, text: copy.finalCta.text }, {
      detailed: true,
      supportTitle: '深圳总部 + 菲律宾·欧洲驻点支持',
      supportBadge: '深圳总部 + 菲律宾·欧洲驻点',
    }),
  ];

  return {
    schemaVersion: SCHOOL_MINI_PAGE_SCHEMA_VERSION,
    id: options.id,
    sitePath: options.sitePath,
    navigationTitle: options.navigationTitle,
    hero: {
      breadcrumb: copy.hero.breadcrumb,
      title: copy.hero.title,
      lead: copy.hero.lead,
      tags: copy.hero.tags.map(tag => tag.text),
      images: heroImages(profile),
    },
    sections,
    pricing: {
      schoolName: options.schoolName,
      schoolCode: profile.code,
      labels: {
        tuition: options.tuitionLabel,
        registrationNote: content.quoteImageSettings.paymentNotes.registration,
        peakSeasonTitle: copy.calendar?.peakTitle ?? '旺季',
        peakSeasonIntro: copy.calendar?.peakIntro ?? '',
        peakSeasonNote: copy.calendar?.peakNote ?? '',
        localFeesTitle: '到校后学杂费明细',
      },
      peakSeasonYears: ['2027'],
      quoteEngine: options.quoteEngine,
      defaults: pricingDefaults(content),
    },
  };
}
