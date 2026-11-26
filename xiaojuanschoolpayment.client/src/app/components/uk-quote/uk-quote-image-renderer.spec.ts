import {
  buildBurlingtonSheet,
  defaultBurlingtonPlan,
  defaultBurlingtonQuote,
} from '../../pages/overseas-study-tour/uk-schools/burlington-school/burlington-quote';
import { drawUkQuoteImage, ukQuoteImageHeight } from './uk-quote-image-renderer';

const CONTACTS = [
  { name: 'Lemon', title: '多国家方案规划', phone: '132 9852 9856', qrSrc: '/assets/contact/lemon-wechat-qr.png' },
  { name: 'Perrin', title: '菲律宾与东南亚游学', phone: '153 6765 9331', qrSrc: '/assets/contact/penin-wechat-qr.png' },
  { name: 'Jenny', title: '英爱留学规划', phone: '132 4982 7686', qrSrc: '/assets/contact/jenny-wechat-qr.png' },
];

function sheet(plans: number, programme: 'junior' | 'adult-course' | 'summer-residence' = 'junior') {
  const input = defaultBurlingtonQuote('2026-11-19', programme);
  input.plans = Array.from({ length: plans }, (_, index) => ({
    ...defaultBurlingtonPlan(programme, '2026-11-19'),
    arrival: programme === 'adult-course' ? '2027-01-03' : programme === 'junior' ? '2027-08-01' : '2027-06-27',
    juniorPackage: index === 0 ? 'residence' as const : 'homestay' as const,
  }));
  return buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: 9.5, date: '2026-11-18' }, CONTACTS);
}

describe('UK quote image renderer', () => {
  const context = () => document.createElement('canvas').getContext('2d')!;

  it('sizes the image to its rows and grows with a second plan and more rows', () => {
    const one = ukQuoteImageHeight(context(), sheet(1));
    const two = ukQuoteImageHeight(context(), sheet(2));
    expect(one).toBeGreaterThan(1500);
    expect(two).toBeGreaterThanOrEqual(one);
    expect(ukQuoteImageHeight(context(), sheet(1, 'adult-course'))).toBeGreaterThan(1500);
  });

  for (const [programme, plans] of [['junior', 2], ['adult-course', 3], ['summer-residence', 2]] as const) {
    it(`draws a complete ${programme} image with ${plans} plans down to the footer`, () => {
      const data = sheet(plans, programme);
      const canvas = document.createElement('canvas');
      const height = ukQuoteImageHeight(canvas.getContext('2d')!, data);
      canvas.width = 1032;
      canvas.height = height;
      const drawing = canvas.getContext('2d')!;
      expect(() => drawUkQuoteImage<HTMLImageElement>(drawing, data, {}, height)).not.toThrow();
      const footer = drawing.getImageData(40, height - 50, 1, 1).data;
      expect([footer[0], footer[1], footer[2]]).toEqual([15, 74, 47]);
    });
  }
});
