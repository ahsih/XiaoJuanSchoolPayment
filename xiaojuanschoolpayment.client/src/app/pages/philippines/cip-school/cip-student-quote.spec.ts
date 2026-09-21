import { CipStudentQuote, cipGroupLocalFees } from './cip-student-quote';
import { CipQuoteCalculatorComponent } from './cip-quote-calculator.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { SchoolVisaType } from '../../../components/school-group-quote';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';

function student(weeks = 4, visa: SchoolVisaType = 'tourist30') {
  const s = new CipStudentQuote(); s.registrationDate = '2026-09-01'; s.visaType = visa;
  s.plan.updateStartDate('course', s.plan.courses[0].id, '2026-09-20');
  s.plan.updateWeeks('course', s.plan.courses[0].id, weeks); return s;
}
const fee = (s: CipStudentQuote, key: string) => s.local.rows.find(row => row.key === key)?.amount;

describe('CIP independent students, visas and shared quote UI', () => {
  it('waives registration once for returning students without changing tuition or local fees', () => {
    const s = student(8); expect(s.total).toBe(17280); const local = s.local.subtotal;
    s.returningStudent = true; expect(s.total).toBe(16680); expect(s.registration).toBe(0); expect(s.local.subtotal).toBe(local);
    s.returningStudent = false; expect(s.total).toBe(17280);
  });
  it('applies the confirmed tourist thresholds and charges one ACR at the first extension', () => {
    for (const [visa, weeks, renewal, acr] of [
      ['tourist30', 4, 0, 0], ['tourist30', 8, 5640, 4000], ['tourist30', 12, 13060, 4000], ['tourist30', 24, 29400, 4000],
      ['tourist59', 4, 0, 0], ['tourist59', 8, 0, 0], ['tourist59', 12, 5640, 4000], ['tourist59', 16, 13060, 4000], ['tourist59', 24, 23450, 4000],
    ] as const) {
      const s = student(weeks, visa); expect(fee(s, 'visa')).withContext(`${visa}/${weeks}`).toBe(renewal); expect(fee(s, 'acr')).toBe(acr);
    }
    expect(student(4).local.subtotal).toBe(15450);
    expect(student(8).local.subtotal).toBe(29490); expect(student(8).local.deposit).toBe(4000);
    expect(student(8, 'tourist59').local.subtotal).toBe(19850);
  });
  it('retains four conditional exemption rows for each long-term visa and restores tourist fees', () => {
    const s = student(12), normal = s.local.subtotal;
    for (const visa of ['student', 'work', 'srrv', 'sirv'] as const) {
      s.visaType = visa;
      for (const key of ['visa', 'ssp', 'ssp-card', 'acr']) {
        expect(fee(s, key)).toBe(0); expect(s.local.rows.find(row => row.key === key)?.note).toContain('须由顾问向学校核实');
      }
      expect(fee(s, 'electricity')).toBe(7200); expect(s.local.deposit).toBe(5000);
    }
    s.visaType = 'tourist30'; expect(s.local.subtotal).toBe(normal);
  });
  it('keeps hotel electricity and deposits out and prices mixed stays only for actual dorm periods', () => {
    const s = student(8); s.plan.rooms[0].optionId = 'deluxe-king-single';
    expect(fee(s, 'electricity')).toBeUndefined(); expect(s.local.deposit).toBe(0); expect(s.local.subtotal).toBe(24690);
    s.plan.updateWeeks('room', s.plan.rooms[0].id, 4); s.plan.add('room');
    s.plan.rooms[1].optionId = 'in-campus-triple';
    expect(s.plan.courseWeeks).toBe(8); expect(s.local.deposit).toBe(3000); expect(fee(s, 'electricity')).toBe(2400);
  });
  it('preserves independent group edits and excludes inactive people from totals', () => {
    const c = new CipQuoteCalculatorComponent(); c.changeMode('group');
    c.students[1].returningStudent = true; c.students[1].visaType = 'tourist59';
    expect(c.total).toBe(17280); expect(c.localTotal).toBe(30900);
    c.changeCount(3); expect(c.total).toBe(26220);
    c.changeMode('single'); expect(c.total).toBe(8940);
    c.changeMode('group'); expect(c.total).toBe(26220); expect(c.students[1].returningStudent).toBeTrue();
    c.changeCount(2); expect(c.total).toBe(17280);
    for (const invalid of [0, 21, NaN, 2.5]) c.changeCount(invalid);
    expect(c.activeStudents.length).toBe(2);
  });
  it('never pools student weeks for a long-stay discount or short-stay price', () => {
    const c = new CipQuoteCalculatorComponent(); c.changeMode('group');
    for (const s of c.activeStudents) s.plan.updateWeeks('course', s.plan.courses[0].id, 8);
    expect(c.total).toBe(34560); expect(c.activeStudents.every(s => s.discount === 0)).toBeTrue();
    c.students[0].plan.updateWeeks('course', c.students[0].plan.courses[0].id, 16);
    expect(c.total).toBe(50940); expect(c.students[0].discount).toBe(300); expect(c.students[1].discount).toBe(0);
    for (const s of c.activeStudents) s.plan.updateWeeks('course', s.plan.courses[0].id, 2);
    expect(c.total).toBe(12042);
  });
  it('supports independent multi-row choices, single registration and bidirectional date coverage', () => {
    const s = student(1); s.plan.add('course'); s.plan.courses[1].optionId = 'regular-esl';
    expect(s.plan.courseWeeks).toBe(5); expect(s.plan.roomWeeks).toBe(5);
    expect(s.tuition).toBe(6000); expect(s.accommodation).toBe(5025); expect(s.registration).toBe(600); expect(s.total).toBe(11625);
    s.plan.updateStartDate('room', s.plan.rooms[0].id, '2026-12-20');
    expect(s.plan.startDate).toBe('2026-12-20'); expect(s.plan.endDate).toBe('2027-01-23'); expect(s.plan.error).toBe('');
    s.plan.remove('course', s.plan.courses[1].id); expect(s.plan.courseWeeks).toBe(1); expect(s.plan.roomWeeks).toBe(1); expect(s.total).toBe(3936);
  });
  it('blocks incomplete local budgets and exports without interpolating missing duration rows', () => {
    const c = new CipQuoteCalculatorComponent(), s = c.students[0];
    s.plan.updateWeeks('course', s.plan.courses[0].id, 5);
    expect(c.total).toBe(11025); expect(s.local.subtotal).toBeNull(); expect(c.canExport).toBeFalse();
    expect(c.quoteImage.paymentItems.length).toBe(0);
  });
  it('cannot bypass course limits or whole guarantees by splitting or mixing rows', () => {
    const s = student(4); s.plan.courses[0].optionId = 'speak-up'; expect(s.total).toBeNull();
    s.plan.courses[0].optionId = 'speaking-master'; s.plan.add('course'); s.plan.add('course'); expect(s.plan.courseWeeks).toBe(12); expect(s.total).toBeNull();
    const guarantee = student(8); guarantee.plan.courses[0].optionId = 'ielts-guarantee-8';
    expect(guarantee.total).toBe(24480); guarantee.plan.add('course'); guarantee.plan.courses[1].optionId = 'light-esl'; expect(guarantee.total).toBeNull();
  });
  it('groups equivalent local rows while retaining different visa assumptions', () => {
    const a = student(8), b = student(8, 'tourist59');
    const rows = cipGroupLocalFees([a,b]);
    expect(rows.filter(r => r.key === 'visa').length).toBe(2);
    expect(rows.find(r => r.key === 'electricity')?.amount).toBe(9600);
    expect(rows.find(r => r.key === 'electricity')?.students).toEqual([1,2]);
    expect(rows.reduce((sum,r) => sum+r.amount,0)).toBe(a.local.subtotal!+b.local.subtotal!);
  });
  it('uses the same CNY and PHP amounts in the existing image with pickup charged per group', () => {
    const c = new CipQuoteCalculatorComponent(); c.changeMode('group'); c.students[1].returningStudent = true;
    c.pickupAirport = 'clark'; expect(c.pickup).toBe(1500);
    expect(c.quoteImage.totalUsd).toBe('17,280元'); expect(c.quoteImage.localFeeAmount).toBe('30,900比索');
    expect(c.quoteImage.optionalFeeItems?.find(r=>r.label.includes('接机'))?.amount).toBe('1,500比索／组');
    expect(c.quoteImage.paymentItems.filter(r=>r.icon==='注').map(r=>r.amount)).toEqual(['600元','0元']);
    const publicCopy = JSON.stringify(c.quoteImage);
    expect(publicCopy).not.toMatch(/台湾|臺灣|Taiwan|40%|65%|85%|95折|分段算法|固定汇率/);
    expect(c.canExport).toBeTrue(); c.pickupPeople = 0; expect(c.canExport).toBeFalse();
    c.pickupAirport = 'none'; c.students[1].plan.courses[0].optionId = 'native-master'; expect(c.total).toBeNull(); expect(c.canExport).toBeFalse();
  });
  it('preserves shared-plan defaults while CIP explicitly chooses currency and duration constraints', () => {
    const s = student(), component = new SchoolQuotePlanComponent(); component.plan = s.plan;
    expect(component.currencyLabel).toBe('美元'); expect(component.amountLabel).toBeNull(); expect(component.weekOptions('course',4)).toContain(24);
    component.allowedRowWeeks = s.allowedWeeks; const row = s.plan.courses[0]; row.optionId = 'speak-up';
    expect(component.weekOptions('course',4)).toEqual([1,2]);
    const changed = jasmine.createSpy('changed'); component.optionChange.subscribe(changed);
    component.selectOption('course',row,'regular-esl'); expect(row.optionId).toBe('regular-esl'); expect(changed).toHaveBeenCalledWith({kind:'course',row});
  });
  it('renders the real image with native currency, every student and a complete footer', () => {
    const c = new CipQuoteCalculatorComponent(); c.changeMode('group'); c.changeCount(20);
    c.students[1].returningStudent = true; c.students[19].visaType = 'srrv';
    const renderer = new QuoteImageDownloadButtonComponent(); renderer.quote = c.quoteImage;
    const canvas = document.createElement('canvas'), context = canvas.getContext('2d')!;
    const layout = renderer['measureFullFeeLayout'](context);
    const height = 1764 + layout.paymentExtra + layout.localExtra + layout.notesExtra;
    canvas.width = 1032; canvas.height = height;
    const image = document.createElement('canvas'); image.width = 1200; image.height = 400;
    const paint: { text: string; y: number }[] = [];
    spyOn(context, 'fillText').and.callFake((text,x,y) => {
      // Include renderer translations when checking the bottom edge.
      paint.push({text, y: y + context.getTransform().f});
    });
    const draw = () => renderer['drawDetailedQuoteImage'](context, {logo: image as unknown as HTMLImageElement, hero: image as unknown as HTMLImageElement, consultants: [{consultant:c.quoteImage.contact}]},1032,height);
    draw();
    expect(paint.some(item=>item.text==='金额（人民币）')).toBeTrue();
    expect(paint.some(item=>item.text==='金额（美元）')).toBeFalse();
    expect(paint.some(item=>item.text.includes('电话/微信'))).toBeFalse();
    expect(paint.some(item=>item.text==='学生20 · 注册费')).toBeTrue();
    expect(paint.some(item=>item.text.includes('SRRV'))).toBeTrue();
    expect(paint.some(item=>item.text.includes('课程、床位及费用以学校最终确认'))).toBeTrue();
    expect(Math.max(...paint.map(item=>item.y))).toBeLessThan(height - 12);
    paint.length = 0; renderer.quote = { ...c.quoteImage, paymentCurrencyLabel: undefined }; draw();
    expect(paint.some(item=>item.text==='金额（美元）')).toBeTrue();
  });
});
