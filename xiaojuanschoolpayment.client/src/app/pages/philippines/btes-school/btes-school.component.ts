import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface BtesFeature {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-btes-school',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './btes-school.component.html',
  styleUrl: './btes-school.component.css',
})
export class BtesSchoolComponent {
  readonly features: BtesFeature[] = [
    { icon: 'record_voice_over', title: '一对一课程选择丰富', text: '从轻量学习到高课量口语强化，可按学习目标选择每天的一对一课量。' },
    { icon: 'location_city', title: '宿务市区校区', text: '位于Kasambagan、Mabolo生活圈，兼顾学习、日常采购与城市便利。' },
    { icon: 'groups', title: '台资学校与中文沟通', text: '学校面向中文学生提供沟通支持，适合第一次前往菲律宾游学的人。' },
    { icon: 'savings', title: '高性价比路线', text: '课程组合覆盖ESL与考试方向，适合关注课量和整体预算的学生。' },
  ];

  readonly courses: BtesFeature[] = [
    { icon: 'chat', title: 'General ESL', text: 'Chill、Speak Up、Speak More与Talkative等不同课量组合。' },
    { icon: 'workspace_premium', title: 'IELTS / Pre-IELTS', text: '覆盖雅思入门和正式备考，兼顾一对一与专项训练。' },
    { icon: 'trending_up', title: 'TOEIC / Pre-TOEIC', text: '适合求职、升学或需要系统准备TOEIC的学生。' },
    { icon: 'business_center', title: 'Business English', text: '围绕职场沟通、表达与实际商务场景训练。' },
    { icon: 'family_restroom', title: 'Junior / Family', text: '提供青少年课程及家长同行方案，方便家庭共同游学。' },
    { icon: 'tune', title: '按目标匹配课量', text: '顾问会结合预算、英语基础和每日可承受强度协助选课。' },
  ];
}
