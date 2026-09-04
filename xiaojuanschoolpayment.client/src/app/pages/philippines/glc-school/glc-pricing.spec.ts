import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { SchoolService } from '../../../../services/school.service';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { GlcSchoolComponent } from './glc-school.component';
import { GLC_COURSES, GLC_ROOMS, GLC_REGISTRATION_NOTE } from './glc-pricing';

describe('GLC user-supplied 2026 reference prices', () => {
  it('preserves all 20 weekly course prices, not four-week prices', () => {
    expect(GLC_COURSES.length).toBe(20);
    expect(new Set(GLC_COURSES.map(course => course.id)).size).toBe(20);
    expect(GLC_COURSES.map(course => course.weeklyTuition)).toEqual([
      165, 215, 270, 375, 280, 410, 590, 775, 335, 400, 465, 325, 375, 430, 240, 300, 430, 355, 300, 465,
    ]);
  });

  it('preserves all six weekly room prices and the annex-only rule', () => {
    expect(GLC_ROOMS.map(room => room.weeklyAccommodation)).toEqual([645, 385, 270, 220, 250, 360]);
    expect(GLC_COURSES.filter(course => course.annexOnly).map(course => course.id)).toEqual(['ultra-sparta-esl', 'ultra-ielts-sparta']);
  });

  it('keeps the complete Sparta schedules including evening and Saturday classes', () => {
    for (const course of GLC_COURSES.filter(course => course.annexOnly)) {
      expect(course.lessons).toContain('晚课2节');
      expect(course.lessons).toContain('自习1节');
      expect(course.lessons).toContain('词汇与写作测试');
      expect(course.lessons).toContain('周六上午');
    }
    expect(GLC_COURSES.find(course => course.id === 'ultra-ielts-sparta')!.lessons).toContain('小组3节（雅思强制）');
  });

  it('excludes light, family, kids and junior courses from the school cash discount', () => {
    expect(GLC_COURSES.filter(course => !course.offSeasonEligible).length).toBe(10);
    expect(GLC_COURSES.filter(course => course.family).length).toBe(3);
    expect(GLC_REGISTRATION_NOTE).toBe('一次性费用，老学员返校免费');
  });

  function create(rates = EMPTY) {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => rates } },
    ] });
    return TestBed.runInInjectionContext(() => new GlcSchoolComponent());
  }

  it('shows the supplied water, management and textbook references with Chinese currencies', () => {
    const page = create();
    expect(page.localFees.find(fee => fee.item === '水费')!.unit).toBe('2,000 比索 / 4周');
    expect(page.localFees.find(fee => fee.item === '管理费')!.unit).toBe('6,000 比索 / 4周');
    page.quotePlan.courses[0].optionId = 'general-ielts';
    expect(page.localFees.find(fee => fee.item === '教材费（雅思）')!.note).toContain('雅思课程1–4周约5,000比索');
    expect(JSON.stringify(page.localFees)).not.toMatch(/USD|PHP|CNY/);
    expect(page.registrationNote).toBe(GLC_REGISTRATION_NOTE);
  });

  it('groups every course once with bilingual names, full schedules and the calculator weekly rate', () => {
    const page = create();
    const grouped = page.courseFeeGroups.flatMap(group => group.courses);
    expect(page.courseFeeGroups.map(group => group.type)).toEqual(['一般英语', '雅思', '商务', '亲子', '儿童英语', '青少年英语']);
    expect(new Set(grouped.map(course => course.id)).size).toBe(20);
    for (const course of grouped) {
      expect(page.courseDisplayName(course.id)).toContain(course.chineseName);
      expect(page.courseDisplayName(course.id)).toContain(course.englishName ?? course.name);
      expect(course.englishName ?? course.name).not.toMatch(/[\u4e00-\u9fff]/);
      expect(course.lessons).toBe(GLC_COURSES.find(item => item.id === course.id)!.lessons);
    }
    page.courseOptions[0].weeklyTuition = 225;
    expect(page.courseFeeGroups[0].courses.find(course => course.id === 'power-speaking')!.weeklyTuition).toBe(225);
    expect(page.calculator.tuition).toBe(900);
  });

  it('converts both optional fees using the same actual rate and labels fallback estimates', () => {
    const page = create();
    page.calculator.pickup = 'weekday';
    expect(page.optionalFees.map(fee => fee.total)).toEqual([1750, 3000]);
    expect(page.pesoCnyText(1750)).toBe('人民币约 194 元');
    expect(page.pesoCnyText(3000)).toBe('人民币约 333 元');
    expect(page.exchangeRateNote).toContain('备用汇率');
    page.phpPerCny = 8;
    page.exchangeRateDate = '2026-09-03';
    expect(page.pesoCnyText(3000)).toBe('人民币约 375 元');
    expect(page.exchangeRateNote).toContain('2026-09-03');
    expect(page.exchangeRateNote).not.toContain('备用汇率');
  });
});
