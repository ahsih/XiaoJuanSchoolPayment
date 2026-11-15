import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';

@Component({
  selector: 'app-mid-autumn',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ExpandableImageComponent],
  templateUrl: './mid-autumn.component.html',
  styleUrl: './mid-autumn.component.css',
})
export class MidAutumnComponent {
  readonly serviceSteps = [
    { title: '先选适合你的学校', text: '结合目标、预算与英语基础，对比学校和课程，也听听你对生活环境的期待。', icon: 'school' },
    { title: '费用与约定提前说清', text: '学费、住宿费和当地费用提前说明，国内公司正式签约，重要文件可以核验。', icon: 'description' },
    { title: '行前事项逐项确认', text: '签证、入学文件、机票和接机安排，陪你一项项核对，带着准备出发。', icon: 'flight_takeoff' },
    { title: '抵达之后继续跟进', text: '国内顾问与菲律宾工作人员、学校老师协作，学习和生活中遇到问题，继续协助沟通。', icon: 'forum' },
  ];

  readonly consultant = {
    name: 'Perrin', title: '菲律宾英语游学顾问', description: '成人英语学习、亲子游学与菲律宾学校选择。',
    phone: '153 6765 9331', href: 'tel:15367659331', avatar: '/assets/contact/penin-avatar.jpg', qr: '/assets/contact/penin-wechat-qr.png',
  };
}
