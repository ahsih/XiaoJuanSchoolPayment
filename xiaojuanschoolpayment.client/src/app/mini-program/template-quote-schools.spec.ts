import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { SchoolContentService } from '../../services/school-content.service';
import { SchoolService } from '../../services/school.service';
import type { CiaQuotePricing } from '../pages/philippines/cia-school/cia-quote-engine';
import { CellaPremiumSchoolComponent } from '../pages/philippines/cella-premium-school/cella-premium-school.component';
import { CellaUniSpartaSchoolComponent } from '../pages/philippines/cella-uni-sparta-school/cella-uni-sparta-school.component';
import { CpilsSchoolPageComponent } from '../pages/philippines/cpils-school/cpils-school-page.component';
import { EvSchoolPageComponent } from '../pages/philippines/ev-school/ev-school-page.component';
import type { PhSchoolPageComponent } from '../pages/philippines/school-page/ph-school-page.component';
import type { PhSchoolQuote } from '../pages/philippines/school-page/ph-school-quote';
import type { PhPageStudent } from '../pages/philippines/school-page/ph-school-profile';
import { MINI_PROGRAM_SCHOOL_PAGES } from './school-pages';
import { MINI_TEMPLATE_QUOTE_SCHOOLS, MiniTemplateQuoteEngine } from './template-quote-schools';

// The mini program quotes EV, CPILS and the two CELLA campuses with template-quote-schools.ts on the
// exported default document (or a published revision). Both must equal the school's own website page.
interface Plan { course: string; room: string; start: string; weeks: number; minor?: boolean; returning?: boolean }
type Page = PhSchoolPageComponent<PhPageStudent>;

const SCHOOLS: Array<{ engine: MiniTemplateQuoteEngine; create: () => Page; plans: Plan[] }> = [
  {
    engine: 'ev',
    create: () => new EvSchoolPageComponent() as unknown as Page,
    plans: [
      { course: 'semi-sparta-esl', room: 'double', start: '2027-06-27', weeks: 8 },
      { course: 'sparta-ielts-guarantee', room: 'single', start: '2027-01-03', weeks: 12, minor: true },
      { course: 'sparta-power-speaking-6', room: 'quad-bunk', start: '2026-12-06', weeks: 2, returning: true },
    ],
  },
  {
    engine: 'cpils',
    create: () => new CpilsSchoolPageComponent() as unknown as Page,
    plans: [
      { course: 'general-esl', room: 'regular-twin', start: '2027-01-03', weeks: 12 },
      { course: 'ielts-guarantee-12-weeks', room: 'premium-single', start: '2027-07-04', weeks: 12 },
      { course: 'premier-sparta', room: 'no-window-single', start: '2027-03-07', weeks: 3, returning: true },
    ],
  },
  {
    engine: 'cella-uni',
    create: () => new CellaUniSpartaSchoolComponent() as unknown as Page,
    plans: [
      { course: 'uni-power-speaking-1', room: 'uni-quad', start: '2027-03-07', weeks: 12 },
      { course: 'uni-ielts-guarantee', room: 'uni-jdn-twin', start: '2027-07-04', weeks: 8, minor: true },
    ],
  },
  {
    engine: 'cella-premium',
    create: () => new CellaPremiumSchoolComponent() as unknown as Page,
    plans: [
      { course: 'premium-light-esl', room: 'premium-six', start: '2027-03-07', weeks: 4 },
      { course: 'premium-family-twin', room: 'premium-twin', start: '2027-03-07', weeks: 4 },
      { course: 'premium-business-intensive', room: 'premium-alicia-single', start: '2026-12-13', weeks: 6, returning: true },
    ],
  },
];

/** Sets the same plan on a website or mini program quote's first student. */
function applyPlan(quote: PhSchoolQuote<PhPageStudent>, plan: Plan): void {
  const student = quote.students[0];
  const quotePlan = student.quotePlan;
  quotePlan.courses[0].optionId = plan.course;
  quotePlan.rooms[0].optionId = plan.room;
  student.planOptionChanged?.();
  quotePlan.updateStartDate('course', quotePlan.courses[0].id, plan.start);
  quotePlan.updateWeeks('course', quotePlan.courses[0].id, plan.weeks);
  quotePlan.updateWeeks('room', quotePlan.rooms[0].id, plan.weeks);
  student.selectedAgeGroup = plan.minor ? 'minor' : 'adult';
  student.returningStudent = !!plan.returning;
}

/** Everything a visitor sees of a quote: rows, totals, local fees and the quote image data. */
function snapshot(quote: PhSchoolQuote<PhPageStudent>) {
  return {
    error: quote.quoteError,
    usd: quote.quoteUsd,
    payments: quote.schoolPaymentItems.map(item => [item.label, item.amount, item.note]),
    localFees: quote.estimatedLocalFees.map(fee => [fee.item, fee.quantity, fee.total, fee.note]),
    localTotal: quote.estimatedLocalFeeTotal,
    optional: quote.optionalFeeItems,
    image: JSON.stringify(quote.quoteImageData),
  };
}

describe('Mini program quotes of the template schools', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ],
  }));

  for (const school of SCHOOLS) {
    describe(school.engine, () => {
      const engine = MINI_TEMPLATE_QUOTE_SCHOOLS[school.engine];
      const exported = () => MINI_PROGRAM_SCHOOL_PAGES[school.engine]().pricing!;

      const rates = { usdToCny: 7.1, phpPerCny: 8.2, usingLiveExchangeRates: true, exchangeRateDate: '2026-11-20' };

      /**
       * The mini program's quote as pages/quote/quote.ts builds it: pricing from the exported default document,
       * then (after the published revision loads) the revision applied and invalid selections dropped.
       */
      function miniQuote(page: Page, published?: unknown) {
        const pricing: CiaQuotePricing = engine.createPricing(engine.clone(exported().defaults as never));
        Object.assign(pricing, rates);
        Object.assign(page, rates);
        const quote = engine.createQuote(pricing);
        if (published) {
          engine.applyContent(pricing, engine.clone(published as never));
          quote.retainValidSelections();
        }
        return quote;
      }

      /** A published revision that differs from the defaults: the first course and room cost 10 dollars more. */
      function publishedRevision() {
        const content = engine.clone(exported().defaults as never);
        const course = content.courses[0];
        course.tuition += 10;
        if (course.tuition2027) course.tuition2027 += 10;
        const room = content.rooms.find(item => item.enabled)!;
        room.fee += 10;
        if (room.fee2027) room.fee2027 += 10;
        return content;
      }

      it('exports a document the engine accepts, under the page’s school code', () => {
        const pricing = exported();
        expect(pricing.quoteEngine).toBe(school.engine);
        expect(pricing.schoolCode).toBe(engine.schoolCode);
        expect(engine.isContent(pricing.defaults)).toBeTrue();
      });

      for (const plan of school.plans) {
        it(`quotes ${plan.course} + ${plan.room} from ${plan.start} for ${plan.weeks} weeks like the page`, () => {
          const page = TestBed.runInInjectionContext(school.create);
          const mini = miniQuote(page);
          applyPlan(page.quote as PhSchoolQuote<PhPageStudent>, plan);
          applyPlan(mini, plan);
          const expected = snapshot(page.quote as PhSchoolQuote<PhPageStudent>);
          expect(expected.error).withContext('the plan must be quotable').toBeFalsy();
          expect(expected.usd).toBeGreaterThan(0);
          expect(snapshot(mini)).toEqual(expected);
        });

        it(`quotes ${plan.course} like the page after a published revision`, () => {
          const page = TestBed.runInInjectionContext(school.create);
          const published = publishedRevision();
          (page as unknown as { applyContentConfig(value: unknown): void }).applyContentConfig(JSON.parse(JSON.stringify(published)));
          const mini = miniQuote(page, published);
          applyPlan(page.quote as PhSchoolQuote<PhPageStudent>, plan);
          applyPlan(mini, plan);
          expect(snapshot(mini)).toEqual(snapshot(page.quote as PhSchoolQuote<PhPageStudent>));
        });
      }

      it('quotes a three-student group like the page', () => {
        const page = TestBed.runInInjectionContext(school.create);
        const mini = miniQuote(page);
        for (const quote of [page.quote as PhSchoolQuote<PhPageStudent>, mini]) {
          quote.setQuoteMode('group');
          quote.studentCount = 3;
          applyPlan(quote, school.plans[0]);
        }
        expect(snapshot(mini)).toEqual(snapshot(page.quote as PhSchoolQuote<PhPageStudent>));
      });
    });
  }
});
