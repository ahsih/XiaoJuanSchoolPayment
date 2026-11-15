import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SmeagHolidayCalendarComponent } from '../smeag-holiday-calendar/smeag-holiday-calendar.component';

@Component({
  selector: 'app-smeag-encanto-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, SmeagHolidayCalendarComponent],
  templateUrl: './smeag-encanto-school.component.html',
  styleUrl: './smeag-encanto-school.component.css',
})
export class SmeagEncantoSchoolComponent {
  readonly quickFacts = [
    { icon: 'beach_access', label: '校区定位', value: '麦克坦海滨度假型校区', note: '校园生活更偏海滨、亲子与家庭学习体验。' },
    { icon: 'family_restroom', label: '适合人群', value: '亲子家庭与短期学习', note: '课程、监护、年龄和房型仍需按当期学校规则确认。' },
    { icon: 'event', label: '2027假期', value: '1天停课，14天特别课', note: '除1月1日外，海报所列假日均安排Best Holiday Classes。' },
  ];

  readonly readingTips = [
    {
      icon: 'cancel',
      title: '红色只有1天',
      text: '2027年1月1日元旦全天停课；不要把整张表里的“假日”都理解成不上课。',
    },
    {
      icon: 'school',
      title: '其余日期有假日特别课',
      text: '海报其余14个日期均标注Best Holiday Classes，时间为上午09:00–12:00、下午13:00–16:00。',
    },
    {
      icon: 'campaign',
      title: '主题和教室可能调整',
      text: '学校没有在Encanto海报中逐日公布课程主题，最终主题、教室及政府临时调休以学校通知为准。',
    },
  ];
}
