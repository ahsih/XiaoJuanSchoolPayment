import { Component } from '@angular/core';

interface ReasonCard {
  icon: string;
  title: string;
  text: string;
}

interface CityCard {
  name: string;
  tag: string;
  text: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-why-philippines-study',
  standalone: false,
  templateUrl: './why-philippines-study.component.html',
  styleUrl: './why-philippines-study.component.css',
})
export class WhyPhilippinesStudyComponent {
  readonly reasons: ReasonCard[] = [
    {
      icon: 'payments',
      title: '预算更可控',
      text: '菲律宾语言学校通常把课程、住宿、三餐和校内服务组合在一起，适合想用清晰预算完成短期密集学习的学生。',
    },
    {
      icon: 'record_voice_over',
      title: '一对一课程比例高',
      text: '与传统大班课相比，菲律宾游学更强调一对一和小班混合训练，老师可以针对口语、听力、雅思或商务需求做弱项提升。',
    },
    {
      icon: 'schedule',
      title: '短期提升效率高',
      text: '斯巴达、半斯巴达和自律型校风适合不同学习强度，想冲刺考试或集中开口练习的学生更容易形成学习节奏。',
    },
    {
      icon: 'map',
      title: '城市和学校选择丰富',
      text: '宿务、碧瑶、克拉克、马尼拉、怡朗、巴科洛德等城市定位不同，可以按预算、气候、课程强度和生活便利度来选校。',
    },
    {
      icon: 'verified_user',
      title: '校内管理和照顾完善',
      text: '许多学校采用校园式管理，配合门禁、宿舍、餐饮、学习管理和学生服务，适合第一次独立出国学习的人。',
    },
    {
      icon: 'flight_takeoff',
      title: '可衔接长期规划',
      text: '菲律宾游学可以作为雅思、多益、口语能力或双国留学的前置阶段，为后续爱尔兰、英国、加拿大、澳洲等方向打基础。',
    },
  ];

  readonly cities: CityCard[] = [
    {
      name: '宿务 Cebu',
      tag: '海岛城市 / 选择最多',
      text: '学校集中、生活便利，适合第一次游学、喜欢海岛氛围、希望学习和周末体验兼顾的学生。',
    },
    {
      name: '碧瑶 Baguio',
      tag: '学习氛围 / 考试冲刺',
      text: '气候较凉、娱乐较少，斯巴达学校多，适合雅思、多益和需要高强度管理的学生。',
    },
    {
      name: '克拉克 Clark',
      tag: '外教资源 / 环境舒适',
      text: '城市规划和生活环境较舒适，适合重视外教比例、亲子课程或相对安静环境的学生。',
    },
    {
      name: '怡朗 / 巴科洛德',
      tag: '低调安静 / 预算友好',
      text: '生活节奏较慢，适合预算敏感、想避开热门城市、专注口语和基础英语提升的学生。',
    },
  ];

  readonly checklist = [
    '先确认目标：口语提升、雅思/多益、亲子游学、商务英语还是长期留学衔接。',
    '再选管理模式：斯巴达适合冲刺，半斯巴达适合平衡，自律型适合成熟学习者。',
    '比较总费用：学费、住宿、餐食、接机、签证、SSP、教材、保险和当地杂费要一起看。',
    '看学校质量：教师培训、课程管理、宿舍餐食、安全、国籍比例和学生支持都要纳入判断。',
  ];

  readonly sources: SourceLink[] = [
    { label: 'iOutback 澳贝客', url: 'https://www.ioutback.com/' },
    { label: '非凡游学', url: 'https://feifanstudy.com/' },
    { label: '玩美游学宿务学校页', url: 'https://www.studytoura.com/cebu-schools/' },
    { label: '南崎游学', url: 'https://www.nanqi.org/' },
    { label: '格仲游学', url: 'https://gezhong.com.tw/' },
    { label: '大洋游学', url: 'http://www.dayang101.com/' },
  ];
}
