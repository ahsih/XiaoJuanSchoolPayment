import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface SidaWhyReason {
  number: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

interface SidaWhyTrustBadge {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-sida-why-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sida-why-section.component.html',
  styleUrl: './sida-why-section.component.css',
})
export class SidaWhySectionComponent {
  @Input() schoolName = '菲律宾学校';
  @Input() supportTitle = '深圳总部 + 菲律宾当地支持';
  @Input() supportBadge = '深圳总部 + 菲律宾支持';

  readonly mainImage = 'assets/cia/sida-why-main-branded.jpg';

  get reasons(): SidaWhyReason[] {
    return [
      {
        number: '01',
        title: '正式合同与官方授权',
        text: '国内公司签约，学校报价、录取文件及收费凭证均可核验。',
        image: 'assets/cia/sida-why-action-contract.jpg',
        alt: `思达启航为${this.schoolName}学生核验合同与授权文件`,
      },
      {
        number: '02',
        title: '费用提前算清，同条件保价',
        text: '0中介服务费，学费、住宿费及当地费用提前说明。',
        image: 'assets/cia/sida-why-action-fees.jpg',
        alt: `思达启航顾问核算${this.schoolName}费用`,
      },
      {
        number: '03',
        title: '从所有适合的学校中帮你筛选',
        text: '根据目标、预算、基础和管理偏好，分析各校优缺点与价格。',
        image: 'assets/cia/sida-why-action-selection.jpg',
        alt: `思达启航顾问协助筛选${this.schoolName}方案`,
      },
      {
        number: '04',
        title: '出发前每一步有人提醒',
        text: '签证、eTravel、入学文件、付款、机票、保险及接机逐项提醒。',
        image: 'assets/cia/sida-why-action-departure.jpg',
        alt: '菲律宾游学出发资料与手机提醒',
      },
      {
        number: '05',
        title: '服务持续到完成学习回国',
        text: '换老师、课程、住宿、账单、续读或转校问题继续协助。',
        image: 'assets/cia/sida-why-action-followup.jpg',
        alt: '思达启航顾问持续跟进学生学习',
      },
      {
        number: '06',
        title: this.supportTitle,
        text: '国内顾问与菲律宾工作人员协作，重要情况有人跟进。',
        image: 'assets/cia/sida-why-action-team.jpg',
        alt: '思达启航菲律宾和深圳服务团队',
      },
    ];
  }

  get trustBadges(): SidaWhyTrustBadge[] {
    return [
      { icon: 'description', label: '国内正式公司合同' },
      { icon: 'verified_user', label: '官方授权合作' },
      { icon: 'local_offer', label: '费用透明与同条件保价' },
      { icon: 'apartment', label: this.supportBadge },
    ];
  }
}
