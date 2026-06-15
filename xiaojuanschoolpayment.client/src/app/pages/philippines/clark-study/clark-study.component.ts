import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

interface StatItem {
  value: string;
  label: string;
}

interface HighlightCard {
  icon: string;
  title: string;
  text: string;
}

interface SchoolType {
  title: string;
  tag: string;
  text: string;
  examples: string;
}

interface SchoolProfile {
  name: string;
  location: string;
  style: string;
  courses: string[];
  accommodation: string;
  facilities: string;
  bestFor: string;
  consultantNote: string;
}

interface DecisionPoint {
  icon: string;
  label: string;
  text: string;
}

interface CostNote {
  title: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-clark-study',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './clark-study.component.html',
  styleUrl: './clark-study.component.css',
})
export class ClarkStudyComponent {
  readonly stats: StatItem[] = [
    { value: '机场便利', label: '适合短期与家庭行程' },
    { value: 'Native / ESL / Family', label: '核心课程方向' },
    { value: '舒适型 / 半斯巴达', label: '主流学习节奏' },
  ];

  readonly highlights: HighlightCard[] = [
    {
      icon: 'record_voice_over',
      title: '外教与口语环境突出',
      text: 'Clark 曾是美军基地区域，国际社区感更明显。部分学校会强调欧美外教、发音训练和真实沟通场景。',
    },
    {
      icon: 'family_restroom',
      title: '亲子与青少年更友好',
      text: '城市节奏比宿务海岛旅游区安静，也比碧瑶交通更轻松，适合家长陪读、低龄学生和短期家庭项目。',
    },
    {
      icon: 'flight_takeoff',
      title: '行程衔接更省心',
      text: 'Clark International Airport 周边学校接送更方便，适合不想把大量时间花在跨城交通上的学生和家庭。',
    },
    {
      icon: 'villa',
      title: '住宿舒适度可优先比较',
      text: 'Clark 学校常被拿来和宿务、碧瑶比较生活环境。选校时应把房型、校区安全、网络和餐食放进核心清单。',
    },
  ];

  readonly schoolTypes: SchoolType[] = [
    {
      title: '外教口语强化型',
      tag: 'Native / Speaking',
      text: '适合希望提高发音、自然表达、面试沟通和欧美课堂适应度的成人或青少年学生。',
      examples: 'CIP、AELC、WE Academy',
    },
    {
      title: '亲子陪读与低龄型',
      tag: 'Family / Junior',
      text: '适合家长同行、4-15 岁阶段学生、寒暑假短期体验，以及需要学习和照顾同步安排的家庭。',
      examples: 'WE Academy、CIP、EG Academy',
    },
    {
      title: '综合 ESL 舒适型',
      tag: 'ESL / Comfort',
      text: '适合想稳步提升英语，但不想进入碧瑶高压斯巴达节奏的人群。',
      examples: 'EG Academy、WE Academy、CIP',
    },
    {
      title: '考试与商务沟通型',
      tag: 'IELTS / TOEIC / Business',
      text: '适合需要雅思、多益、商务英语或求职英语路径的人，需要特别核对模考、保证班和外教课比例。',
      examples: 'CIP、EG Academy、HELP Clark',
    },
  ];

  readonly schoolProfiles: SchoolProfile[] = [
    {
      name: 'CIP English Kepos',
      location: 'Clark / Angeles, Pampanga',
      style: '外教、考试、亲子综合型',
      courses: ['Light ESL', 'Regular ESL / Native ESL', 'Intensive ESL', 'Advanced Business', 'TOEIC', 'IELTS / IELTS Guarantee', 'Primary / Junior'],
      accommodation: '官网列有校内宿舍，常见单人、双人、三四人房；另有距离学校约 5 分钟车程的校外 Hotel 住宿选项。',
      facilities: '官网可确认一对一教室、小组教室、Academic Office、宿舍、Hotel、餐食服务和学习支持体系。',
      bestFor: '想要外教课、考试备考、商务英语或亲子青少年课程，同时重视住宿选择的人群。',
      consultantNote: 'CIP 是 Clark 选校时优先核对的综合型学校。低龄学生可关注官网列出的 Primary English 7-11 岁与 Junior 12-15 岁课程。',
    },
    {
      name: 'EG Academy',
      location: 'Lot 3 Friendship Highway, Cutcut, Angeles City',
      style: 'ESL、考试与活动体验型',
      courses: ['ESL General', 'ESL Intensive', 'ESL Sparta', 'TOEIC / TOEFL / IELTS + ESL', 'Native Course', 'Golf & ESL'],
      accommodation: '住宿和费用需按学校当期价目表确认，尤其是旺季、家庭同行和短期项目。',
      facilities: '官网列有校园介绍、周边环境、EG Golf、日程、费用和学校规则等栏目，适合做生活便利度核对。',
      bestFor: '想在 Clark 做一般英语、考试基础、外教口语或高尔夫英语组合的人群。',
      consultantNote: 'EG 官网持续更新学生比例和学校新闻，报名前建议同步确认国籍比例、接机费、房型和课程是否按计划开放。',
    },
    {
      name: 'Clark WE Academy',
      location: 'Fil-Am Friendship Highway, Angeles City',
      style: '度假式校区与亲子友好型',
      courses: ['ESL', 'Native Mix', 'Family Program', 'Kinder Course', 'Golf Lesson', 'Swimming'],
      accommodation: '学校位于 farm resort 式环境，官网强调宿舍、教室、健身房、大型泳池和便利店集中在校园内。',
      facilities: '官网介绍从 Clark International Airport 到学校约 25 分钟，并强调舒适、安全、自由的校园生活。',
      bestFor: '亲子家庭、低龄学生、希望学习节奏较自由、也看重校内活动和生活舒适度的人群。',
      consultantNote: 'WE Academy 适合“学习 + 陪读 + 生活体验”组合，但如果目标是强制备考冲刺，需要和 CIP、EG 或碧瑶学校一起比较。',
    },
    {
      name: 'HELP English Clark',
      location: 'Clark / Pampanga 一带',
      style: '老牌系统与考试路线候选',
      courses: ['ESL', 'IELTS', 'TOEIC', 'Business English', 'Junior'],
      accommodation: '官网当前页面为动态应用，房型、校区和开放状态需以学校当期文件或顾问回函确认。',
      facilities: '适合把课程强度、校区管理、宿舍规则和接送方式作为重点复核。',
      bestFor: '偏好老牌学校体系、希望比较 Clark 与碧瑶 HELP 系列管理风格的学生。',
      consultantNote: '本页不把 HELP 的细节写死。报名时应二次确认当前 Clark 校区资料、价目表、开课课程和年龄规则。',
    },
    {
      name: 'AELC / Native-focused Clark Schools',
      location: 'Clark / Angeles 候选池',
      style: '外教口语与家庭项目候选',
      courses: ['Native Speaking', 'ESL', 'Family', 'Junior', 'Business English'],
      accommodation: '官网域名和招生资料需当期复核，先作为外教偏好学生的候选方向。',
      facilities: '重点核对外教比例、实际授课老师、宿舍距离、门禁、餐食和医疗支援。',
      bestFor: '明确想要更多欧美外教沟通机会，但还没锁定具体学校的人群。',
      consultantNote: '适合进入顾问复核清单，不建议只凭旧资料或第三方介绍直接报名。',
    },
  ];

  readonly decisionPoints: DecisionPoint[] = [
    {
      icon: 'groups',
      label: '先分成人与亲子',
      text: '成人口语、低龄亲子、青少年营队和商务英语的选校逻辑不同，不能只看“外教多”一个指标。',
    },
    {
      icon: 'person_search',
      label: '核对外教比例',
      text: '确认是欧美外教课、Native Mix、外教小组课，还是只有部分课程由外教负责。',
    },
    {
      icon: 'child_care',
      label: '年龄和监护规则',
      text: '低龄学生要确认最低年龄、是否必须家长同行、课后照顾、医疗支援和周末活动安排。',
    },
    {
      icon: 'hotel',
      label: '住宿舒适度',
      text: 'Clark 的优势常在生活环境，因此房型、浴室、网络、清洁、洗衣、餐食和校园距离都要看清楚。',
    },
    {
      icon: 'flight',
      label: '接送与航班',
      text: '优先确认 Clark 机场接机、马尼拉机场接送、抵达时间和额外费用，家庭同行尤其要提前规划。',
    },
    {
      icon: 'verified',
      label: '优惠和空房',
      text: '优惠常随周数、房型、国籍比例和旺季变化。确认入学日之后，再判断优惠是否真的适用。',
    },
  ];

  readonly costNotes: CostNote[] = [
    {
      title: '学费与外教课比例',
      text: 'Clark 学校常见价格差异来自外教课比例、课程密度和房型。外教课越多，不一定越适合初学者，需按目标搭配。',
    },
    {
      title: '住宿与家庭成本',
      text: '亲子家庭要把家长课程、儿童课程、家庭房、接送、周末活动、保险和个人生活费一起核算。',
    },
    {
      title: '最新优惠和活动',
      text: 'CIP、EG、WE 等学校会不定期更新优惠、学生比例、接送费或宿舍资讯，最终以学校当期报价和回函为准。',
    },
  ];

  readonly compareRows = [
    { label: '城市定位', clark: '国际社区感强、机场便利、生活舒适', cebu: '学校多、海岛体验丰富、短期选择多', baguio: '凉爽安静、学习氛围强、考试导向' },
    { label: '学习重点', clark: '外教口语、亲子、青少年、舒适型 ESL', cebu: '口语、亲子、短期体验、综合课程', baguio: '雅思、多益、斯巴达冲刺、长期备考' },
    { label: '适合人群', clark: '家庭用户、外教偏好、重视环境和机场便利', cebu: '第一次游学、想平衡学习和生活', baguio: '自律较弱、想专心备考、能接受高强度' },
    { label: '选校重点', clark: '外教比例、房型、接送、安全和年龄规则', cebu: '课程比例、校区位置、住宿和活动', baguio: '管理制度、模考体系、自习安排和学习强度' },
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Clark 比宿务更适合亲子吗？',
      answer: '如果家庭更重视机场便利、住宿舒适度、安静环境和外教沟通，Clark 通常更容易筛选；如果想要更多海岛活动和学校选择，宿务更丰富。',
    },
    {
      question: '外教课越多越好吗？',
      answer: '不一定。基础薄弱的学生需要菲律宾老师一对一打底，再搭配外教发音和表达课；高级学生或商务目标才更适合提高外教比例。',
    },
    {
      question: 'Clark 适合雅思冲刺吗？',
      answer: '可以看 CIP、EG 等有考试课程的学校，但如果目标是高强度模考和自习制度，碧瑶学校也应一起比较。',
    },
    {
      question: '报名 Clark 学校前最该确认什么？',
      answer: '确认校区、课程开放、外教课比例、房型空位、接送机场、年龄限制、当地费用和优惠有效期。',
    },
  ];

  readonly sources: SourceLink[] = [
    { label: 'CIP English 官方网站', url: 'https://cipenglish.com/' },
    { label: 'CIP Dormitory 官方说明', url: 'https://cipenglish.com/dormitory/' },
    { label: 'CIP Hotel 官方说明', url: 'https://cipenglish.com/hotel/' },
    { label: 'EG Academy 官方网站', url: 'https://egesl.com/' },
    { label: 'EG Academy 课程页面', url: 'https://egesl.com/curriculum/course/' },
    { label: 'Clark WE Academy 官方网站', url: 'https://clarkweacademy.com/' },
    { label: 'HELP English 官方入口', url: 'https://helpenglish.net/' },
    { label: 'iOutback 菲律宾游学结构参考', url: 'https://www.ioutback.com/' },
    { label: 'StudyTourA 菲律宾学校分类参考', url: 'https://www.studytoura.com/cebu-schools/' },
    { label: '格仲游学菲律宾学校比较参考', url: 'https://gezhong.com.tw/' },
  ];
}
