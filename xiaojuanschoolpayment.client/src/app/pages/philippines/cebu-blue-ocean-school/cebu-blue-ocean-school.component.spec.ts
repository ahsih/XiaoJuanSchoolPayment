import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SchoolService } from '../../../../services/school.service';
import { CebuBlueOceanSchoolComponent } from './cebu-blue-ocean-school.component';

describe('CebuBlueOceanSchoolComponent pricing', () => {
  let component: CebuBlueOceanSchoolComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: SchoolService, useValue: {} }],
    });
    component = TestBed.runInInjectionContext(
      () => new CebuBlueOceanSchoolComponent(),
    );
    component.selectedCourseId = 'light-esl';
    component.selectedRoomId = 'egi-triple-ocean';
    component.selectedStartDate = '2027-09-05';
  });

  it('uses 40%, 65% and 85% of four-week tuition and accommodation', () => {
    expect(component.tuitionFor('light-esl', 1)).toBe(348);
    expect(component.tuitionFor('light-esl', 2)).toBe(565.5);
    expect(component.tuitionFor('light-esl', 3)).toBe(739.5);

    expect(component.dormFeeFor('egi-triple-ocean', 1)).toBe(340);
    expect(component.dormFeeFor('egi-triple-ocean', 2)).toBe(552.5);
    expect(component.dormFeeFor('egi-triple-ocean', 3)).toBe(722.5);
  });

  it('keeps the confirmed 2025 four-week course and room catalog', () => {
    expect(
      Object.fromEntries(
        component.courseOptions.map((course) => [
          course.id,
          course.baseFourWeek,
        ]),
      ),
    ).toEqual({
      'light-esl': 870,
      'survival-esl': 1050,
      'intensive-esl': 970,
      'power-esl-5': 930,
      'power-esl-7': 1170,
      business: 1200,
      toeic: 1050,
      ielts: 1130,
      junior: 1500,
      parents: 750,
      senior: 1050,
    });
    expect(
      Object.fromEntries(
        component.dormOptions.map((room) => [room.id, room.baseFourWeek]),
      ),
    ).toEqual({
      'egi-triple-ocean': 850,
      'egi-twin-city': 900,
      'egi-twin-ocean': 1120,
      'ocean-suite-superior': 1250,
      'ocean-suite-deluxe': 1400,
      'ocean-suite-ocean': 1600,
    });
  });

  it('keeps long prices proportional and lists discounts separately', () => {
    expect(component.tuitionFor('intensive-esl', 12)).toBe(2910);
    expect(component.dormFeeFor('egi-twin-ocean', 20)).toBe(5600);
  });

  it('waives registration, applies 95% first and then deducts low-season promotion', () => {
    component.selectedWeeks = 4;
    const student = component.students[0];

    expect(student.registrationDiscount).toBe(100);
    expect(student.sidaDiscount).toBe(86);
    expect(student.offSeasonDiscount).toBe(150);
    expect(student.quoteUsd).toBe(1484);
  });

  it('adds the 12-week and stepped long-stay promotions', () => {
    const student = component.students[0];

    component.selectedWeeks = 12;
    expect(student.twelveWeekDiscount).toBe(100);
    expect(student.longStayDiscount).toBe(0);

    component.selectedWeeks = 16;
    expect(student.longStayDiscount).toBe(100);
    component.selectedWeeks = 18;
    expect(student.longStayDiscount).toBe(125);
    component.selectedWeeks = 20;
    expect(student.longStayDiscount).toBe(150);
    component.selectedWeeks = 24;
    expect(student.longStayDiscount).toBe(200);
  });

  it('charges peak weeks and removes only those weeks from low-season blocks', () => {
    component.selectedCourseId = 'intensive-esl';
    component.selectedRoomId = 'egi-twin-ocean';
    component.selectedWeeks = 20;
    component.selectedStartDate = '2027-07-11';
    const student = component.students[0];

    expect(student.peakWeeks).toBe(6);
    expect(student.seasonalSurcharge).toBe(240);
    expect(student.offSeasonBlocks).toBe(3);
    expect(student.offSeasonDiscount).toBe(450);
    expect(student.twelveWeekDiscount).toBe(100);
    expect(student.longStayDiscount).toBe(150);
    expect(student.sidaDiscount).toBe(522.5);
    expect(student.quoteUsd).toBe(9467.5);
  });

  it('uses cumulative visa-extension estimates for 30- and 59-day visas', () => {
    const student = component.students[0];
    component.selectedWeeks = 24;

    student.visaType = 'tourist30';
    expect(student.visaExtensionCount).toBe(5);
    expect(student.visaExtensionTotal).toBe(26270);

    student.visaType = 'tourist59';
    expect(student.visaExtensionCount).toBe(4);
    expect(student.visaExtensionTotal).toBe(21130);
  });

  it('limits Survival ESL to four weeks', () => {
    component.selectedCourseId = 'survival-esl';
    component.selectedWeeks = 5;
    expect(component.quoteError).toContain('Survival ESL每段最多选择4周');
  });

  it('supports independent multi-row plans for groups of up to 20 students', () => {
    component.quotePlan.add('course');
    component.quotePlan.add('room');
    expect(component.quotePlan.courses.length).toBe(2);
    expect(component.quotePlan.rooms.length).toBe(2);
    expect(component.quotePlan.courses[1].startDate).toBe('2027-10-03');
    expect(component.quotePlan.end(component.quotePlan.courses[1])).toBe(
      '2027-10-30',
    );

    component.studentCount = 20;
    component.setQuoteMode('group');
    component.students[1].quotePlan.courses[0].optionId = 'ielts';
    expect(component.activeStudents.length).toBe(20);

    component.setQuoteMode('single');
    expect(component.activeStudents.length).toBe(1);
    component.setQuoteMode('group');
    expect(component.students[1].quotePlan.courses[0].optionId).toBe('ielts');
  });

  it('preserves the two supplied image notes and only appends exchange guidance', async () => {
    const image = component.quoteImageData;
    expect(image.importantNotes).toEqual([
      component.schoolFeeImageNote,
      component.localFeeImageNote,
    ]);
    expect(image.footerNotesVerbatim).toBeTrue();
    expect(image.appendExchangeRateNote).toBeTrue();
    expect(image.appendFinalConfirmationNote).toBeFalse();
    expect(image.localFeeNote).toBe('');

    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = image;
    const renderedNotes = (renderer as unknown as {
      quoteFooterNotes(): string[];
    }).quoteFooterNotes();

    expect(renderedNotes[0]).toBe(component.schoolFeeImageNote);
    expect(renderedNotes[1]).toBe(component.localFeeImageNote);
    expect(renderedNotes[2]).toContain('人民币金额按参考汇率估算');
    expect(renderedNotes.length).toBe(3);
    expect(renderedNotes.join('\n')).not.toContain('最终以学校价格');

    const preview = await renderer.createPreviewDataUrl(0.5);
    expect(preview).toMatch(/^data:image\/png;base64,/);
  });
});
