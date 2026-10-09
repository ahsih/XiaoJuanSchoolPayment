import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';

export const PICKUP_DAYS: Record<number, number[][]> = {
  2026: [[11,25],[8,22],[8,22],[5,19],[3,17,31],[14,28],[12,26],[9,23],[6,20],[4,18],[1,15,29],[13,27]],
  2027: [[10,24],[7,21],[7,21],[4,18],[2,16,30],[13,27],[11,25],[8,22],[5,19],[3,17,31],[14,28],[12,26]],
};
export function pickupDates(year: number): string[] {
  return (PICKUP_DAYS[year] ?? []).flatMap((days, month) => days.map(day => `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`));
}
export function philippinesToday(now = new Date()): string {
  return new Date(now.getTime() + 8 * 3600_000).toISOString().slice(0,10);
}
export function followingMonday(date: string): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + 86400_000).toISOString().slice(0,10);
}

@Component({
  selector: 'app-baguio-pickup', standalone: true,
  imports: [CommonModule, RouterModule, ExpandableImageComponent],
  templateUrl: './baguio-pickup.component.html', styleUrl: './baguio-pickup.component.css',
})
export class BaguioPickupComponent {
  get today(): string { return philippinesToday(); }
  monthsFor(year: number) { return PICKUP_DAYS[year].map((days, i) => ({ month: i + 1, dates: days.map(day => `${year}-${String(i+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`).filter(date => year !== 2026 || date >= this.today) })).filter(month => month.dates.length > 0); }
  get nextDate(): string | undefined { return [...pickupDates(2026), ...pickupDates(2027)].find(date => date >= this.today); }
  readonly faqs = [
    ['每个星期日都有接机吗？','不是。请查看所选年份的指定日期，取得接机确认后再买机票。'],
    ['家长陪同、儿童或行李多怎么办？','提前报备人数、年龄和行李数量，确认座位、特殊安排及费用，不默认家属免费。'],
    ['航班延误或错过接机怎么办？','尽快联系顾问及学校，发送更新行程。是否改乘或另行接送需重新确认，不承诺免费补接。'],
    ['₱3,000 包含送机或私人包车吗？','本页列的是现行定期团体接机费用，不默认包含返程送机或私人包车。'],
    ['可以在非指定日抵达吗？','需提前落实另行接送、交通及住宿，并确认学校能否入住及额外费用。'],
    ['eTravel 谁办理，何时收到？','提前联系思达启航顾问提供资料，顾问在出发前 3 天内按适用申报窗口办理并发送二维码。收到后请核对并截图保存。'],
  ];
}
