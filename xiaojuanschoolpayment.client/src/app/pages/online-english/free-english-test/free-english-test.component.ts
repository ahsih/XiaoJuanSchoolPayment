import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface TestResource {
  title: string;
  label: string;
  description: string;
  url: string;
}

@Component({
  selector: 'app-free-english-test',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './free-english-test.component.html',
  styleUrl: './free-english-test.component.css',
})
export class FreeEnglishTestComponent {
  readonly resources: TestResource[] = [
    {
      title: '线上英语专题页',
      label: 'WeChat Collection',
      description: '进入思达教育公众号的线上英语栏目，查看英语测评、试听课和在线英语相关内容。',
      url: 'https://mp.weixin.qq.com/mp/homepage?__biz=MzkzNDQxMzM2OQ==&hid=8&sn=132bec8b11c1aa6bf9f2ff045bbd8bd2&scene=18#wechat_redirect',
    },
    {
      title: '思达在线英语一对一家教',
      label: 'WeChat Article',
      description: '查看思达在线英语一对一家教介绍，了解课程形式、适合人群和后续咨询方式。',
      url: 'https://mp.weixin.qq.com/s/IS2broFpW6Owg2hsmsIwWw',
    },
  ];
}
