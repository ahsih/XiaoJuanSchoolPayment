import { StGilesCampusId } from './st-giles-pricing';
import {
  StGilesPlanInput,
  StGilesProgramme,
  StGilesQuoteInput,
  buildStGilesSheet,
  computeStGilesPlan,
  defaultStGilesPlan,
  defaultStGilesQuote,
  nextStGilesPlan,
} from './st-giles-quote';

const TODAY = '2026-11-20';
const RATE = { gbpToCny: 8.7673, date: '2026-11-19' };
const CONTACTS = [{ name: 'Lemon', title: '多国家方案规划', phone: '132 9852 9856', qrSrc: '/assets/contact/lemon-wechat-qr.png' }];

function quote(campus: StGilesCampusId | null, programme: StGilesProgramme, changes: Partial<StGilesQuoteInput> = {},
  plans: Array<Partial<StGilesPlanInput>> = [{}]): StGilesQuoteInput {
  const base = defaultStGilesQuote(campus, TODAY, programme);
  return { ...base, ...changes, plans: plans.map(plan => ({ ...defaultStGilesPlan(campus, programme, TODAY), ...plan })) };
}

function withPlans(input: StGilesQuoteInput, count: number): StGilesQuoteInput {
  let next = input;
  while (next.plans.length < count) next = { ...next, plans: [...next.plans, nextStGilesPlan(next)] };
  return next;
}

describe('St Giles quote engine', () => {
  it('prices the London Central default adult homestay quote', () => {
    const input = quote('london-central', 'adult');
    const result = computeStGilesPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(result.total).toBe(3292);
  });

  it('uses the under-16 course and homestay prices in Eastbourne', () => {
    const input = quote('eastbourne', 'adult', { ageBand: 'minor14' }, [{ course: 'under16' }]);
    const result = computeStGilesPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(result.required.find(line => line.key === 'course')?.amount).toBe(2076);
    expect(result.total).toBe(3064);
  });

  it('prices the London junior summer centre with and without accommodation', () => {
    const input = quote('london-central', 'junior', {}, [{ juniorPackage: 'residential' }, { juniorPackage: 'day' }]);
    expect(computeStGilesPlan(input, input.plans[0]).total).toBe(3214);
    expect(computeStGilesPlan(input, input.plans[1]).total).toBe(1862);
  });

  it('charges family registration and booking once per family', () => {
    const input = quote('london-central', 'family', {}, [{ familyHomestay: true }, { familyHomestay: false }]);
    expect(computeStGilesPlan(input, input.plans[0]).total).toBe(2666);
    expect(computeStGilesPlan(input, input.plans[1]).total).toBe(1730);
  });

  it('blocks a junior centre the student is too young for', () => {
    const input = quote(null, 'junior', { juniorAge: 8 }, [{ juniorCentre: 'london-ucl' }]);
    expect(computeStGilesPlan(input, input.plans[0]).issues.length).toBeGreaterThan(0);
  });

  it('never repeats a plan when three plans are compared', () => {
    const key = (plan: StGilesPlanInput) => JSON.stringify(plan);
    for (const campus of ['london-central', 'london-highgate', 'brighton', 'cambridge', 'eastbourne'] as StGilesCampusId[]) {
      for (const programme of ['adult', 'junior', 'family'] as StGilesProgramme[]) {
        if (programme === 'junior' && campus === 'eastbourne') continue;
        const input = withPlans(quote(campus, programme), 3);
        expect(new Set(input.plans.map(key)).size).withContext(`${campus} ${programme}`).toBe(3);
      }
    }
  });

  it('does not charge public holidays on a one-week General English course', () => {
    const general = quote('london-central', 'adult', {}, [{ arrival: '2026-12-27', weeks: 1, course: 'morning20', focus: '通用英语', accommodation: 'none' }]);
    const course = computeStGilesPlan(general, general.plans[0]).required.find(line => line.key === 'course');
    expect(course?.amount).toBe(264.6);
    const ielts = quote('london-central', 'adult', {}, [{ arrival: '2026-12-27', weeks: 1, course: 'morning20', focus: '雅思备考', accommodation: 'none' }]);
    expect(computeStGilesPlan(ielts, ielts.plans[0]).required.find(line => line.key === 'course')?.amount).toBe(441);
  });

  it('adds the summer tuition supplement except on the university English option', () => {
    const plan = { arrival: '2027-07-04', weeks: 4, accommodationWeeks: 4, course: 'intensive28' as const };
    const life = quote('london-central', 'adult', {}, [{ ...plan, focus: '生活英语' }]);
    expect(computeStGilesPlan(life, life.plans[0]).required.find(line => line.key === 'high-season')?.amount).toBe(124);
    const university = quote('london-central', 'adult', {}, [{ ...plan, focus: '大学预备英语' }]);
    expect(computeStGilesPlan(university, university.plans[0]).required.some(line => line.key === 'high-season')).toBeFalse();
  });

  it('blocks accommodation without lessons in summer and stays past the 2027 prices', () => {
    const summer = quote('london-central', 'adult', {}, [{ arrival: '2027-07-04', weeks: 2, accommodationWeeks: 4 }]);
    expect(computeStGilesPlan(summer, summer.plans[0]).issues.length).toBeGreaterThan(0);
    const spring = quote('london-central', 'adult', {}, [{ arrival: '2027-02-07', weeks: 2, accommodationWeeks: 4 }]);
    expect(computeStGilesPlan(spring, spring.plans[0]).issues).toEqual([]);
    const lateStay = quote('london-central', 'adult', {}, [{ arrival: '2027-12-19', weeks: 1, accommodationWeeks: 2 }]);
    expect(computeStGilesPlan(lateStay, lateStay.plans[0]).issues.length).toBeGreaterThan(0);
  });

  it('adds the Christmas supplement to half-board homestays over 25 December', () => {
    const input = quote('cambridge', 'adult', {}, [{ arrival: '2027-12-19', weeks: 1, accommodationWeeks: 1 }]);
    const result = computeStGilesPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(result.required.find(line => line.key === 'christmas')?.amount).toBe(40);
  });

  it('lets 16–17-year-olds book Brighton superior homestay but not the over-30s course', () => {
    const superior = quote('brighton', 'adult', { ageBand: 'minor16' }, [{ arrival: '2027-02-07', homestayTier: 'superior' }]);
    const result = computeStGilesPlan(superior, superior.plans[0]);
    expect(result.issues).toEqual([]);
    expect(result.required.find(line => line.key === 'accommodation')?.amount).toBe(1444);
    const over30 = quote('brighton', 'adult', { ageBand: 'minor16' }, [{ course: 'morning20', focus: '30岁以上通用英语' }]);
    expect(computeStGilesPlan(over30, over30.plans[0]).issues.length).toBeGreaterThan(0);
  });

  it('charges a second family adult the activities-only price and limits family transfers to four people', () => {
    const social = quote('london-central', 'family', { adults: 2 }, [{ familyHomestay: false, adultOption: 'social' }]);
    expect(computeStGilesPlan(social, social.plans[0]).total).toBe(2020);
    const single = quote('london-central', 'family', { adults: 1 }, [{ familyHomestay: false, adultOption: 'social' }]);
    expect(computeStGilesPlan(single, single.plans[0]).total).toBe(1730);
    const five = quote('london-central', 'family', {
      children: 3, adults: 2, extras: { arrivalTransfer: true, departureTransfer: false, airport: 'heathrow', specialDiet: false, breakfast: false },
    });
    expect(computeStGilesPlan(five, five.plans[0]).issues.length).toBeGreaterThan(0);
  });

  it('states the minimum English level of the chosen course', () => {
    const input = quote('london-central', 'adult', {}, [{ course: 'intensive28', focus: '雅思备考' }]);
    const sheet = buildStGilesSheet(input, TODAY, RATE, CONTACTS);
    expect(sheet.info.find(item => item.label === '入学要求')?.value).toContain('B1以上');
  });

  it('builds a sheet without school contact details and blocks export without a pound rate', () => {
    const input = withPlans(quote('london-central', 'adult'), 3);
    const sheet = buildStGilesSheet(input, TODAY, RATE, CONTACTS);
    expect(sheet.issues).toEqual([]);
    expect(sheet.requiredTotals.every(total => total !== null)).toBeTrue();
    const text = JSON.stringify({ ...sheet, contacts: [] });
    expect(text).not.toMatch(/stgiles|@|https?:|\+44/i);
    const noRate = buildStGilesSheet(input, TODAY, { gbpToCny: null, date: '' }, CONTACTS);
    expect(noRate.requiredTotalsCny.every(total => total === null)).toBeTrue();
  });
});
