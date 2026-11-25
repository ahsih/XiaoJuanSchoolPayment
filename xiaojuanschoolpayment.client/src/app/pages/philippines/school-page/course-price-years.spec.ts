import { ElementRef, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { CiaSchoolComponent } from '../cia-school/cia-school.component';
import { AnjSchoolPageComponent } from '../anj-school/anj-school-page.component';
import { BCebuSchoolPageComponent } from '../bcebu-school/bcebu-school-page.component';
import { CboaSchoolPageComponent } from '../cebu-blue-ocean-school/cboa-school-page.component';
import { CellaPremiumSchoolComponent } from '../cella-premium-school/cella-premium-school.component';
import { CellaUniSpartaSchoolComponent } from '../cella-uni-sparta-school/cella-uni-sparta-school.component';
import { CgBaniladSchoolPageComponent } from '../cg-banilad-school/cg-banilad-school-page.component';
import { CgSpartaSchoolPageComponent } from '../cg-sparta-school/cg-sparta-school-page.component';
import { CiecSchoolPageComponent } from '../ciec-school/ciec-school-page.component';
import { CpiSchoolPageComponent } from '../cpi-school/cpi-school-page.component';
import { CpilsSchoolPageComponent } from '../cpils-school/cpils-school-page.component';
import { ElsaSchoolPageComponent } from '../elsa-school/elsa-school-page.component';
import { EvSchoolPageComponent } from '../ev-school/ev-school-page.component';
import { FellaFirstCampusSchoolComponent } from '../fella-school/fella-first-campus-school.component';
import { FellaSecondCampusSchoolComponent } from '../fella-school/fella-second-campus-school.component';
import { GeniusSchoolPageComponent } from '../genius-school/genius-school-page.component';
import { GlcSchoolPageComponent } from '../glc-school/glc-school-page.component';
import { HanaSchoolPageComponent } from '../hana-school/hana-school-page.component';
import { HelpSchoolPageComponent } from '../help-school/help-school-page.component';
import { IbreezeSchoolPageComponent } from '../ibreeze-school/ibreeze-school-page.component';
import { IclSchoolComponent } from '../icl-school/icl-school.component';
import { ImsSchoolPageComponent } from '../ims-school/ims-school-page.component';
import { IuSchoolComponent } from '../iu-school/iu-school.component';
import { JicChallengerSchoolComponent } from '../jic-school/jic-challenger-school.component';
import { JicPremiumSchoolComponent } from '../jic-school/jic-premium-school.component';
import { LaMerSchoolPageComponent } from '../la-mer-school/la-mer-school-page.component';
import { MonolSchoolPageComponent } from '../monol-school/monol-school-page.component';
import { MonolSpartaSchoolPageComponent } from '../monol-sparta-school/monol-sparta-school-page.component';
import { PinesSchoolPageComponent } from '../pines-school/pines-school-page.component';
import { SmeagCapitalSchoolPageComponent } from '../smeag-capital-school/smeag-capital-school-page.component';
import { SmeagEncantoSchoolComponent } from '../smeag-encanto-school/smeag-encanto-school.component';
import { keepsTwoCoursePrices, syncSingleCoursePrices, TWO_COURSE_PRICE_SCHOOL_CODES } from './course-price-years';
import { CONTENT_ONLY_PRICE_SCHOOL_CODES, usesDatabasePrices } from './database-prices';
import type { PhSchoolPageComponent } from './ph-school-page.component';
import type { PhSchoolProfile } from './ph-school-profile';

// The employee editor edits a course's `tuition`; the shared template's course list and several school quotes
// read `tuition2027`. A published document whose `tuition` was edited must reach the course list, the quote and
// the quote image of every one-price school, while CIA and the other two-price schools keep their 2027 prices.
describe('one or two course prices on the shared Philippine template', () => {
  const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
  type Page = PhSchoolPageComponent<never>;
  const internals = (page: Page) => page as unknown as {
    profile: PhSchoolProfile;
    applyContentConfig(value: CiaContentConfig): void;
    applyPricingData(lessons: unknown[], rooms: unknown[], fees: unknown[]): void;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
  });

  const create = (type: Type<unknown>) => TestBed.runInInjectionContext(() => new (type as new () => Page)());

  it('copies tuition into tuition2027 only for one-price schools', () => {
    const doc = (schoolCode: string) => ({
      schemaVersion: 1,
      schoolCode,
      courses: [{ id: 'a', tuition: 1200, tuition2027: 1000 }, { id: 'b', tuition: 0, tuition2027: 0 }],
    }) as unknown as CiaContentConfig;

    const ev = syncSingleCoursePrices(doc('EV'));
    expect(ev.courses.map(item => item.tuition2027)).toEqual([1200, 0]);
    for (const code of TWO_COURSE_PRICE_SCHOOL_CODES) {
      expect(keepsTwoCoursePrices(code)).toBeTrue();
      expect(syncSingleCoursePrices(doc(code)).courses[0].tuition2027).withContext(code).toBe(1000);
    }
    expect(keepsTwoCoursePrices('CG-BANILAD')).toBeFalse();
    expect(keepsTwoCoursePrices(undefined)).toBeFalse();
  });

  // Schools with one course price (JIC since its school pack moves into a saved document only once).
  // A plan priced by a whole package is moved to an ordinary course price first: HANA's default Light ESL
  // plan is the fixed 付4周读8周 offer, and IU/ICL's low-season package replaces course and room until 2027/01/16.
  const ONE_PRICE_PAGES: Array<[string, Type<unknown>, ((page: Page) => void)?]> = [
    ['A&J', AnjSchoolPageComponent],
    ["B'Cebu", BCebuSchoolPageComponent],
    ['CELLA Uni', CellaUniSpartaSchoolComponent],
    ['CELLA Premium', CellaPremiumSchoolComponent],
    ['CG Banilad', CgBaniladSchoolPageComponent],
    ['CG Sparta', CgSpartaSchoolPageComponent],
    ['CIEC', CiecSchoolPageComponent],
    ['CPI', CpiSchoolPageComponent],
    ['ELSA', ElsaSchoolPageComponent],
    ['EV', EvSchoolPageComponent],
    ['English Fella First', FellaFirstCampusSchoolComponent],
    ['English Fella Second', FellaSecondCampusSchoolComponent],
    ['Genius', GeniusSchoolPageComponent],
    ['GLC', GlcSchoolPageComponent],
    ['HANA', HanaSchoolPageComponent, page => { page.selectedCourseId = 'general-esl'; }],
    ['HELP Clark', HelpSchoolPageComponent],
    ['IU', IuSchoolComponent, page => { page.selectedStartDate = '2027-02-07'; }],
    ['ICL', IclSchoolComponent, page => { page.selectedStartDate = '2027-02-07'; }],
    ['JIC Challenger', JicChallengerSchoolComponent],
    ['JIC Premium', JicPremiumSchoolComponent],
    ['IMS', ImsSchoolPageComponent],
    ['MONOL', MonolSchoolPageComponent],
    ['EV La Mer', LaMerSchoolPageComponent],
    ['MONOL Sparta', MonolSpartaSchoolPageComponent],
    ['SMEAG Capital', SmeagCapitalSchoolPageComponent],
  ];

  for (const [school, type, setUp] of ONE_PRICE_PAGES) {
    it(`${school}: an edited course price reaches the course list, the quote and the quote image`, () => {
      const page = create(type);
      const base = copy(internals(page).profile.defaultContent());
      expect(keepsTwoCoursePrices(base.schoolCode)).withContext(base.schoolCode).toBeFalse();
      internals(page).applyContentConfig(copy(base));
      setUp?.(page);
      const courseId = page.selectedCourseId;
      const listed = () => page.listPrice(page.courseFees.find(item => item.id === courseId)!);
      const before = { list: listed(), usd: page.quoteUsd, image: page.quoteImageData.totalUsd };
      expect(before.usd).withContext('the default quote prices a course').toBeGreaterThan(0);

      // The document an editor save produced before the fix: tuition changed, tuition2027 left behind.
      const edited = copy(base);
      const course = edited.courses.find(item => item.id === courseId)!;
      course.tuition += 400;
      internals(page).applyContentConfig(edited);

      expect(page.courseFees.find(item => item.id === courseId)!.tuition2027).toBe(course.tuition);
      expect(listed()).toBeGreaterThan(before.list);
      expect(page.quoteUsd).toBeGreaterThan(before.usd);
      expect(page.quoteImageData.totalUsd).not.toBe(before.image);
    });
  }

  const TWO_PRICE_PAGES: Array<[string, Type<unknown>]> = [
    ['CIA', CiaSchoolComponent],
    ['CPILS', CpilsSchoolPageComponent],
    ['I.BREEZE', IbreezeSchoolPageComponent],
    ['Cebu Blue Ocean', CboaSchoolPageComponent],
    ['PINES', PinesSchoolPageComponent],
    ['SMEAG Encanto', SmeagEncantoSchoolComponent],
  ];

  for (const [school, type] of TWO_PRICE_PAGES) {
    it(`${school}: keeps its own tuition2027 when tuition changes`, () => {
      const page = create(type);
      const base = copy(internals(page).profile.defaultContent());
      expect(keepsTwoCoursePrices(base.schoolCode)).withContext(base.schoolCode).toBeTrue();
      const edited = copy(base);
      for (const course of edited.courses) course.tuition += 400;
      // What the school's own clone makes of the document, without the one-price sync.
      const cloned = internals(page).profile.cloneContent(copy(edited));
      internals(page).applyContentConfig(edited);
      expect(page.courseFees.length).toBeGreaterThan(0);
      for (const fee of page.courseFees) {
        const saved = cloned.courses.find(item => item.id === fee.id);
        expect(saved).withContext(fee.id).toBeDefined();
        expect(fee.tuition2027).withContext(fee.id).toBe(saved!.tuition2027);
        expect(fee.tuition).withContext(fee.id).toBe(saved!.tuition);
      }
    });
  }

  // The employee editor copies database prices into a school's first save only when its page reads them too.
  it('lists exactly the template schools whose page ignores database prices', () => {
    const contentOnly: string[] = [];
    for (const [school, type] of [...ONE_PRICE_PAGES, ...TWO_PRICE_PAGES]) {
      const page = create(type);
      const code = internals(page).profile.defaultContent().schoolCode;
      let read = false;
      const watched = () => new Proxy([] as unknown[], {
        get: (target, key, receiver) => { read = true; return Reflect.get(target, key, receiver); },
      });
      internals(page).applyPricingData(watched(), watched(), watched());
      expect(usesDatabasePrices(code)).withContext(`${school} (${code})`).toBe(read);
      if (!read) contentOnly.push(code);
    }
    expect([...new Set(contentOnly)].sort()).toEqual([...CONTENT_ONLY_PRICE_SCHOOL_CODES].sort());
    expect(usesDatabasePrices(undefined)).toBeTrue();
  });
});
