import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

interface RegionalCityStudyPage {
  cityName: string;
  englishName: string;
  route: string;
  positioning: string;
  intro: string;
  suitable: string;
  keywords: string;
  selectionFocus: string;
  highlights: {
    icon: string;
    title: string;
    text: string;
  }[];
  programTypes: {
    title: string;
    tag: string;
    text: string;
  }[];
}

const cityPages: Record<string, RegionalCityStudyPage> = {
  iloilo: {
    cityName: '怡朗',
    englishName: 'Iloilo',
    route: '/philippines-study/iloilo',
    positioning: '小众、安静、成本友好',
    intro:
      '怡朗适合想避开热门城市、控制预算、在更安静环境中学习英语的学生。这里节奏相对平稳，适合长期基础提升、口语练习和低压力适应。',
    suitable: '小众城市 / 安静学习 / 成本友好 / 长期ESL',
    keywords: '安静、小众、生活成本友好、学习干扰少',
    selectionFocus: '费用结构、课程时数、住宿便利度、学校管理和生活适应',
    highlights: [
      {
        icon: 'spa',
        title: '学习环境更安静',
        text: '怡朗不像宿务或马尼拉那么热闹，更适合希望减少干扰、稳定上课的学生。',
      },
      {
        icon: 'savings',
        title: '成本更容易控制',
        text: '生活和学习开销通常更友好，适合预算敏感或计划长期学习的人群。',
      },
      {
        icon: 'record_voice_over',
        title: '适合基础口语',
        text: '如果目标是慢慢建立开口信心，安静城市更容易形成规律学习节奏。',
      },
      {
        icon: 'location_city',
        title: '城市生活压力较低',
        text: '既有基本生活配套，又不会过度拥挤，适合第一次菲律宾游学的学生适应。',
      },
    ],
    programTypes: [
      {
        title: '小众安静型',
        tag: 'Quiet City',
        text: '适合不追求热闹城市和海岛活动，更重视稳定学习环境的学生。',
      },
      {
        title: '低预算ESL型',
        tag: 'Budget ESL',
        text: '适合希望控制总费用，同时保持较完整课程安排的人群。',
      },
      {
        title: '长期基础型',
        tag: 'Long Stay',
        text: '适合用几个月时间打基础、练口语、提升听说习惯的学生。',
      },
      {
        title: '轻压力适应型',
        tag: 'Easy Pace',
        text: '适合第一次出国学习，想先适应英语环境和海外生活节奏的人群。',
      },
    ],
  },
  davao: {
    cityName: '达沃',
    englishName: 'Davao',
    route: '/philippines-study/davao',
    positioning: '少干扰、华人较少、适合专心学习',
    intro:
      '达沃位于菲律宾南部，是民答那峨岛的重要城市。相比更热门的大城市，这里华人比例和娱乐干扰较少，适合希望在生活中更多使用英语、并把注意力放在学习上的学生。',
    suitable: '专心学习 / 华人较少 / 半斯巴达 / 基础强化',
    keywords: '南部城市、干扰较少、英语使用机会、学习专注度',
    selectionFocus: '学校安全管理、课程强度、华人比例、住宿环境和生活便利度',
    highlights: [
      {
        icon: 'location_city',
        title: '南部重点城市',
        text: '达沃是菲律宾南部重要城市，生活配套相对完整，适合想尝试非热门城市的学生。',
      },
      {
        icon: 'record_voice_over',
        title: '英语使用机会更多',
        text: '因为华人比例相对少，学生在日常生活中更容易被推动使用英语沟通。',
      },
      {
        icon: 'visibility',
        title: '娱乐干扰较少',
        text: '相比马尼拉、宿务等城市，达沃的娱乐诱惑较少，适合需要专心学习的人群。',
      },
      {
        icon: 'verified_user',
        title: '重视安全管理',
        text: '选择达沃学校时，应重点确认校区位置、接送安排、门禁制度和紧急联络机制。',
      },
    ],
    programTypes: [
      {
        title: '半斯巴达强化型',
        tag: 'Semi-Sparta',
        text: '适合想保留一定自由度，同时需要课程和管理推动学习的学生。',
      },
      {
        title: '少华人环境型',
        tag: 'Low Chinese Ratio',
        text: '适合希望减少中文环境、增加英语生活使用机会的人群。',
      },
      {
        title: '专心基础型',
        tag: 'Focused ESL',
        text: '适合想从基础口语、听力和日常表达开始稳定提升的学生。',
      },
      {
        title: '长期适应型',
        tag: 'Long Stay',
        text: '适合计划停留较长时间，希望在低干扰城市里慢慢建立英语习惯的人群。',
      },
    ],
  },
  subic: {
    cityName: '苏比克',
    englishName: 'Subic',
    route: '/philippines-study/subic',
    positioning: '美式氛围、治安较好、外教口语',
    intro:
      '苏比克原本带有海军基地背景，现在更像带美式氛围的度假港湾。这里街道整洁、治安和环境管理较好，适合偏好美式生活感、外教口语和海边轻松氛围的学生。',
    suitable: '外教口语 / 美式氛围 / 度假港湾 / 安全环境',
    keywords: '海军港湾、美式小镇、治安较好、外教比例',
    selectionFocus: '外教比例、校区位置、安全管理、住宿环境和假日活动',
    highlights: [
      {
        icon: 'anchor',
        title: '度假港湾氛围',
        text: '苏比克带有海军基地和港湾背景，适合喜欢海边、整洁街区和轻松环境的学生。',
      },
      {
        icon: 'verified_user',
        title: '安全感较突出',
        text: '苏比克特区街道整洁、治安管理较好，适合重视生活环境和安全感的人群。',
      },
      {
        icon: 'public',
        title: '美式生活感',
        text: '城市风格带有美国小镇气质，适合想体验不同菲律宾城市氛围的学生。',
      },
      {
        icon: 'record_voice_over',
        title: '适合外教口语',
        text: '苏比克和克拉克一带常被定位为外籍人士较多、外教比例更有优势的学习选择。',
      },
    ],
    programTypes: [
      {
        title: '外教口语型',
        tag: 'Native / Speaking',
        text: '适合希望接触更多外教课程、训练发音和真实沟通能力的学生。',
      },
      {
        title: '美式环境型',
        tag: 'American Style',
        text: '适合喜欢整洁街区、美式生活感和较轻松学习氛围的人群。',
      },
      {
        title: '安全舒适型',
        tag: 'Safe & Comfort',
        text: '适合家长或学生本人重视治安、住宿环境和日常生活便利度的选择。',
      },
      {
        title: '轻松强化型',
        tag: 'Easy ESL',
        text: '适合想提升英语，但不希望选择过度高压城市和课程节奏的学生。',
      },
    ],
  },
};

@Component({
  selector: 'app-regional-city-study',
  standalone: false,
  templateUrl: './regional-city-study.component.html',
  styleUrl: './regional-city-study.component.css',
})
export class RegionalCityStudyComponent {
  private readonly route = inject(ActivatedRoute);

  readonly page$ = this.route.data.pipe(
    map((data) => cityPages[data['cityKey'] as string] ?? cityPages['iloilo']),
  );
}
