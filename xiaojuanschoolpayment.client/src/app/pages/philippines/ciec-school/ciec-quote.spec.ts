import { CiecPerson, ciecResult } from './ciec-quote';
import { CiecQuoteCalculatorComponent } from './ciec-quote-calculator.component';

describe('CIEC confirmed quote rules', () => {
  const result = (person: CiecPerson) => ciecResult(person, [person], false);
  function family(date: string, count = 2) {
    const people = Array.from({ length: count }, () => new CiecPerson());
    people.forEach((person, i) => {
      person.role = i === 0 ? 'guardian' : 'child'; person.ageMonths = i === 0 ? 432 : 120;
      person.plan.courses[0].optionId = i === 0 ? 'none' : 'junior-academic';
      person.plan.rooms[0].optionId = count === 2 ? 'twin' : 'triple';
      person.plan.updateStartDate('course', 1, date);
    });
    return people;
  }
  it('applies 95% only to course and room, registration and pickup once', () => {
    const person = new CiecPerson(); person.pickup = true;
    expect(result(person).total).toBe(1972.5);
    person.returning = true;
    expect(result(person).total).toBe(1872.5);
  });
  it('keeps 2026 and 2027 guardian food/accommodation independent', () => {
    for (const [date, expected] of [['2026-10-11', 385], ['2027-09-05', 480]] as const) {
      const people = family(date);
      expect(ciecResult(people[0], people, true).total).toBe(expected);
    }
  });
  it('waives one guardian stay in a three-person family without adding a room-upgrade fee', () => {
    const people = family('2027-09-05', 3);
    expect(ciecResult(people[0], people, true).total).toBe(100);
    expect(ciecResult(people[1], people, true).total).toBe(1952.5);
  });
  it('checks Monday-to-Friday learning dates and includes final school Friday', () => {
    const people = family('2027-04-25'); // final Friday May 21, checkout May 22
    expect(ciecResult(people[0], people, true).total).toBe(480);
    people.forEach(person => person.plan.updateStartDate('course', 1, '2027-05-02'));
    expect(ciecResult(people[0], people, true).total).toBeNull();
  });
  it('waives qualifying four-week unaccompanied Sparta care without discounting registration', () => {
    const person = new CiecPerson(); person.guardianCare = true; person.plan.courses[0].optionId = 'junior-sparta';
    expect(result(person).care).toBe(0);
    expect(result(person).total).toBe(2237.5);
  });
  it('preserves 2/3-week ratios, blocks a one-week quote and uses each own total course tier', () => {
    const person = new CiecPerson(); person.plan.updateWeeks('course', 1, 2);
    expect(person.courses).toBe(715);
    person.plan.updateWeeks('course', 1, 3); expect(person.courses).toBe(935);
    person.plan.updateWeeks('course', 1, 1); expect(result(person).total).toBeNull();
    person.plan.updateWeeks('course', 1, 4); person.plan.add('course');
    person.plan.updateWeeks('course', person.plan.courses[0].id, 1);
    expect(person.courses).toBe(1375); expect(person.plan.error).toBe('');
  });
  it('charges CIDEC annual grade fee once over multiple segments', () => {
    const person = new CiecPerson(); person.plan.courses[0].optionId = 'cidec'; person.plan.add('course');
    expect(person.annualFee).toBe(3000); expect(result(person).total).toBe(7130);
  });
  it('keeps baby free and half-price boundaries without inventing local fees', () => {
    const person = new CiecPerson(); person.plan.courses[0].optionId = 'none';
    person.ageMonths = 24; expect(person.rooms).toBe(0); expect(person.localTotal).toBeNull();
    person.ageMonths = 25; expect(person.rooms).toBe(425);
    person.ageMonths = 47; expect(person.rooms).toBe(425);
    person.ageMonths = 48; expect(person.rooms).toBe(850);
  });
  it('sums CIEC renewal increments with one ACR at each selected visa threshold', () => {
    const person = new CiecPerson();
    expect(person.localTotal).toBe(16900);
    person.plan.updateWeeks('course', 1, 8);
    expect(person.localRows.find(row => row.label === '签证延期')!.amount).toBe(5800);
    expect(person.localRows.find(row => row.label === 'ACR I-CARD')!.amount).toBe(4000);
    person.visa = '59'; expect(person.extensionCount).toBe(0);
    person.plan.updateWeeks('course', 1, 20);
    expect(person.localRows.find(row => row.label === '签证延期')!.amount).toBe(16600);
    person.plan.updateWeeks('course', 1, 24); expect(person.localTotal).toBeNull();
  });
  it('replaces ordinary books with kindergarten materials and keeps stationery optional', () => {
    const person = new CiecPerson(); person.ageMonths = 60; person.plan.courses[0].optionId = 'kindergarten';
    expect(person.localTotal).toBe(17300); person.stationery = true; expect(person.localTotal).toBe(19300);
    expect(person.localRows.some(row => row.label === '教材估算')).toBeFalse();
  });
  it('invalidates adviser confirmation when plans change and excludes inactive members', () => {
    const component = new CiecQuoteCalculatorComponent(); const person = component.people[0];
    person.plan.updateWeeks('course', 1, 8); person.localAmount = 25000; person.localConfirmation = '学校费用明细确认';
    component.confirm(person, 'local'); expect(component.localTotal).toBe(25000);
    person.plan.updateWeeks('course', 1, 12); expect(component.localTotal).toBeNull();
    component.changeMode('group'); component.people[1].plan.courses[0].startDate = 'bad';
    expect(component.total).toBeNull(); component.changeMode('single'); expect(component.total).not.toBeNull();
  });
  it('does not bypass hard age errors through an amount confirmation', () => {
    const people = family('2027-05-02'); people[0].ageMonths = 120;
    people[0].schoolAmount = 400; people[0].schoolConfirmation = '已确认';
    expect(ciecResult(people[0], people, true).total).toBeNull();
  });
  it('does not turn a baby into a qualifying family student or waive accompanied care', () => {
    const people = family('2027-09-05', 3); people[2].ageMonths = 30;
    people[2].plan.courses[0].optionId = 'none';
    expect(ciecResult(people[0], people, true).total).toBeNull();
    people[1].guardianCare = true; people[1].plan.courses[0].optionId = 'junior-sparta';
    expect(ciecResult(people[1], people, false).total).toBeNull();
  });
  it('shares image totals, payment deductions, local rows and neutral deposit choice', () => {
    const component = new CiecQuoteCalculatorComponent();
    const quote = component.quoteImage;
    expect(quote.layout).toBe('cia-detailed'); expect(quote.fullFeeDetails).toBeTrue();
    expect(quote.totalUsd).toBe(`${component.money(component.total!)}美元`);
    expect(quote.localFeeItems!.reduce((sum, row) => sum + Number(row.amount.replace(/[,比索]/g, '')), 0)).toBe(component.localTotal!);
    expect(quote.paymentItems.reduce((sum, row) => sum + Number(row.amount.replace(/[,美元]/g, '').replace('−', '-')), 0)).toBeCloseTo(component.total!, 2);
    expect(quote.optionalFeeItems![0].amount).toBe('5000比索');
  });
});
