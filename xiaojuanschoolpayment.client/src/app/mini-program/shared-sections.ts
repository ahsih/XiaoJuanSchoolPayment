// Building blocks shared by every school page exported to the WeChat mini program.
// Pure data code (bundled and run in Node by scripts/export-mini-program-content.cjs).
import { SIDA_PHILIPPINES_CONSULTANTS } from '../components/sida-consultants';
import { SidaWhyOptions, sidaWhyContent } from '../components/sida-why-content';
import { MiniBlock, MiniSection } from './school-mini-page';

/** Site-relative asset path with a leading slash; spaces and brackets in file names are encoded. */
export const miniAsset = (path: string): string =>
  encodeURI(path.startsWith('/') || /^https?:/.test(path) ? path : `/${path}`);

export const miniText = (text: string): MiniBlock => ({ type: 'text', text });
export const miniNote = (text: string): MiniBlock => ({ type: 'text', text, style: 'note' });
export const miniHeading = (text: string, eyebrow?: string): MiniBlock => ({ type: 'heading', text, eyebrow });

/**
 * The closing "思达启航保障与联系顾问" part: the school's call to action, the shared
 * "为什么通过思达启航报名…" text (same source as the website's SidaWhySectionComponent) and the
 * shared consultant cards. Every school uses this, so a consultant or guarantee change is made once.
 */
export function contactSection(
  schoolName: string,
  cta: { title: string; text: string },
  options: SidaWhyOptions = {},
): MiniSection {
  const why = sidaWhyContent(schoolName, options);
  const detailed = options.detailed === true;
  return {
    kind: 'contact',
    blocks: [
      miniHeading(why.title, why.eyebrow),
      miniText(why.intro),
      ...(detailed
        ? [
            { type: 'image' as const, image: { src: miniAsset(why.mainImage), caption: why.photoCaption } },
            miniHeading(why.gratitude.title, why.gratitude.eyebrow),
            { type: 'text' as const, text: why.gratitude.quote, style: 'quote' as const },
            miniText(why.gratitude.text),
            { type: 'list' as const, style: 'check' as const, items: why.gratitude.values.map(value => value.text) },
          ]
        : []),
      {
        type: 'cards',
        layout: 'list',
        items: why.reasons.map(reason => ({ badge: reason.number, title: reason.title, text: reason.text, image: miniAsset(reason.image) })),
      },
      { type: 'list', style: 'check', items: why.trustBadges.map(badge => badge.label) },
      ...(detailed
        ? [
            miniHeading(why.alumni.title, why.alumni.eyebrow),
            miniText(why.alumni.intro),
            { type: 'cards' as const, layout: 'list' as const, items: why.alumni.items.map(item => ({ badge: item.number, title: item.title, text: item.text })) },
            miniNote(why.alumni.note),
          ]
        : []),
      miniHeading(cta.title),
      miniText(cta.text),
      {
        type: 'consultants',
        items: SIDA_PHILIPPINES_CONSULTANTS.map(person => ({
          name: person.name,
          title: person.title,
          text: person.description,
          phone: person.phone,
          avatar: miniAsset(person.avatarSrc),
          qr: miniAsset(person.qrSrc),
        })),
      },
    ],
  };
}
