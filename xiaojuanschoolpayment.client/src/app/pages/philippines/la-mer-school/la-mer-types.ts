export interface LaMerFamilyPrice {
  id: string;
  name: string;
  people: number;
  season: 'all' | 'off' | 'peak';
  prices: Record<string, number>;
  enabled: boolean;
}

export interface LaMerFamilyVersion {
  id: string;
  name: string;
  start: string;
  end: string;
  priority: number;
  exclusions: Array<{ start: string; end: string }>;
  peakRanges: Array<{ start: string; end: string }>;
  packages: LaMerFamilyPrice[];
  enabled: boolean;
}

export interface LaMerPolicy {
  familyDepositPerPerson: number;
  minimumChildAge: number;
  familyComposition: 'one-guardian' | 'any-guardian-child';
  familyExtras: 'unconfirmed' | 'separate';
  familyIncludedFeeIds: string[];
  familyVersions: LaMerFamilyVersion[];
}

export interface LaMerPageContent {
  title: string;
  lead: string;
  tags: string[];
  intro: string;
  advisor: string;
  fit: string[];
  considerations: string[];
  familyIntro: string;
  familyChildSchedule: string;
  familyGuardianSchedule: string;
  videos: Array<{ title: string; url: string; poster: string; enabled: boolean }>;
  facts: Array<{ label: string; value: string; note: string }>;
  schedule: Array<{ time: string; title: string; text: string }>;
  services: Array<{ title: string; text: string }>;
  rules: Array<{ title: string; text: string }>;
  faq: Array<{ title: string; text: string }>;
  gallery: Array<{ id: string; title: string; category: string; url: string; caption: string; enabled: boolean }>;
}
