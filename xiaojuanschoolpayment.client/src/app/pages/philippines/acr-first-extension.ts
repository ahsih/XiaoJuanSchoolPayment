// ACR I-Card comes with the first tourist-visa extension at every Philippine school (user rule 2026-11-24):
// a 30-day entry visa pays it from week 5, a 59-day entry visa from week 9, even where a school's fee sheet
// says "over 59 days" or "from week 9". Pure data code: the WeChat mini program bundles some of its users.
import type { CiaContentConfig } from './cia-school/cia-content-config';

/** Version stamp of the ACR wording; saved documents below it get their untouched ACR notes replaced once. */
export const ACR_NOTE_VERSION = 20261124;

export type AcrNoteSettings = { acrNoteVersion?: number };

/**
 * Replaces each fee note that still reads like one of its former defaults (on the local-fee row and in the
 * quote image's note override) with the current default, once per document; an edited note stays as it is.
 * `oldNotes` maps a local-fee id to the default notes it used to have.
 */
export function upgradeAcrNotes(
  config: CiaContentConfig,
  defaults: CiaContentConfig,
  oldNotes: Readonly<Record<string, readonly string[]>>,
): void {
  if (!config.quoteSettings) return;
  const settings = config.quoteSettings as AcrNoteSettings;
  if ((settings.acrNoteVersion ?? 0) >= ACR_NOTE_VERSION) return;
  for (const id of Object.keys(oldNotes)) {
    const olds = oldNotes[id];
    const fresh = defaults.localFees.find(fee => fee.id === id)?.note;
    if (fresh === undefined) continue;
    const saved = (config.localFees ?? []).find(fee => fee.id === id);
    if (saved && olds.includes(saved.note)) saved.note = fresh;
    const imageNotes = config.quoteImageSettings?.localFeeNotes;
    if (imageNotes && olds.includes(imageNotes[id])) imageNotes[id] = fresh;
  }
  settings.acrNoteVersion = ACR_NOTE_VERSION;
}
