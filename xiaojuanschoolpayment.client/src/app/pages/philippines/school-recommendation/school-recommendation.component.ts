import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

interface RecommendationPage {
  title: string;
  englishTitle: string;
  route: string;
  audience: string;
  intro: string;
  keywords: string;
  selectionFocus: string;
  highlights: {
    icon: string;
    title: string;
    text: string;
  }[];
  recommendedSchools: {
    name: string;
    city: string;
    fit: string;
    reason: string;
  }[];
  checklist: string[];
}

const recommendationPages: Record<string, RecommendationPage> = {
  ielts: {
    title: '雅思备考学校推荐',
    englishTitle: 'IELTS School Recommendations',
    route: '/philippines-study/recommendations/ielts-schools',
    audience: '高转化课程入口',
    intro:
      '菲律宾雅思备考适合想用 8-12 周集中冲刺分数的学生。选校时不要只看课时多不多，更要确认是否有模考体系、写作口语反馈、保证班规则和官方考试安排。',
    keywords: '雅思保证班、斯巴达管理、模考体系、写作口语反馈',
    selectionFocus: '目标分数、入学门槛、保证班条件、模考频率、老师反馈和住宿学习环境',
    highlights: [
      {
        icon: 'assignment',
        title: '先看保证班规则',
        text: '保证班通常需要固定周数、入学分数和出勤要求，适合目标明确、能接受高强度管理的学生。',
      },
      {
        icon: 'edit_note',
        title: '写作口语反馈最关键',
        text: '雅思提分不只是刷题，写作批改、口语纠音和老师反馈机制会直接影响进步速度。',
      },
      {
        icon: 'schedule',
        title: '12周是常见冲刺周期',
        text: '预算和时间允许时，12周比4周更适合系统完成诊断、训练、模考和弱项修正。',
      },
      {
        icon: 'psychology',
        title: '碧瑶更适合专心备考',
        text: '如果自律较弱或容易被城市生活分心，可以优先看碧瑶、斯巴达或半斯巴达学校。',
      },
    ],
    recommendedSchools: [
      {
        name: 'CG Sparta',
        city: '宿务',
        fit: '斯巴达雅思冲刺',
        reason: '适合需要强管理、高密度课程和明确考试目标的学生。',
      },
      {
        name: 'SMEAG Capital',
        city: '宿务',
        fit: '考试课程体系',
        reason: '适合想兼顾考试训练、校内资源和城市便利度的学生。',
      },
      {
        name: 'CIA',
        city: '宿务',
        fit: '雅思与综合英语',
        reason: '适合希望校区环境、课程体系和学习生活平衡度都比较稳定的学生。',
      },
      {
        name: 'MONOL / JIC / CNS',
        city: '碧瑶',
        fit: '长期备考',
        reason: '适合想在安静环境里做长期雅思、多益或升学英语准备的学生。',
      },
    ],
    checklist: [
      '确认目标分数和当前雅思水平，不要直接只看学校名气。',
      '优先比较模考频率、写作批改和口语反馈机制。',
      '问清楚保证班失败后的续读规则、出勤要求和违纪条件。',
      '如果要冲刺分数，住宿安静度和晚自习制度也要一起看。',
    ],
  },
  budget: {
    title: '性价比学校推荐',
    englishTitle: 'Best Value School Recommendations',
    route: '/philippines-study/recommendations/budget-schools',
    audience: '承接预算敏感用户',
    intro:
      '性价比学校不是单纯找最低价，而是在预算内拿到合适的一对一课时、住宿餐食、校区管理和学习效果。适合预算敏感、计划长期学习，或第一次菲律宾游学想控制风险的学生。',
    keywords: '多人房、淡季报名、长期优惠、碧瑶低成本、克拉克机票',
    selectionFocus: '总预算、房型、课程密度、当地费用、机票、淡旺季和长期优惠',
    highlights: [
      {
        icon: 'savings',
        title: '总费用要一起算',
        text: '学费只是其中一部分，还要计算住宿、三餐、SSP、签证延签、水电、教材、接机、机票和生活费。',
      },
      {
        icon: 'hotel',
        title: '多人房更省预算',
        text: '同一所学校中，多人房通常比单人房便宜很多，适合学生党和预算敏感用户。',
      },
      {
        icon: 'calendar_month',
        title: '淡季和长周期更划算',
        text: '避开寒暑假旺季、选择8周以上课程，通常更容易拿到优惠或摊薄固定费用。',
      },
      {
        icon: 'landscape',
        title: '碧瑶常有价格优势',
        text: '如果不追求海岛生活，碧瑶、巴科洛德、怡朗等城市可以作为低预算长期学习选择。',
      },
    ],
    recommendedSchools: [
      {
        name: '3D Academy / Stargate',
        city: '宿务',
        fit: '低预算短期ESL',
        reason: '适合想控制费用、先体验菲律宾游学的一般英语学生。',
      },
      {
        name: 'CG Banilad',
        city: '宿务',
        fit: '预算与管理平衡',
        reason: '适合想保留城市便利，同时需要一定课程管理的学生。',
      },
      {
        name: 'PINES / MONOL / BECI',
        city: '碧瑶',
        fit: '长期高性价比学习',
        reason: '适合把预算花在学习密度和长期稳定提升上的学生。',
      },
      {
        name: 'A&J ECO / HELP',
        city: '碧瑶 / 克拉克',
        fit: '预算友好强化',
        reason: '适合想控制总成本，但仍需要密集课程和学习氛围的人群。',
      },
    ],
    checklist: [
      '比较总费用，不要只比较学费。',
      '优先看4人房、3人房和淡季优惠。',
      '问清楚当地费用是否包含SSP、ACR、水电、教材和接机。',
      '预算紧张时，先考虑碧瑶、巴科洛德、怡朗等低干扰城市。',
    ],
  },
  family: {
    title: '亲子学校推荐',
    englishTitle: 'Family Study Recommendations',
    route: '/philippines-study/recommendations/family-schools',
    audience: '家庭用户入口',
    intro:
      '菲律宾亲子游学适合家长陪读、孩子短期英语体验、寒暑假营队或低龄长期适应。选校时要优先确认孩子年龄、家长课程、家庭房、接送照顾、安全管理和周末活动安排。',
    keywords: '亲子游学、家庭房、Junior课程、家长ESL、寒暑假营队',
    selectionFocus: '孩子年龄、家庭房、家长课程、安全照顾、餐食、接送和活动安排',
    highlights: [
      {
        icon: 'family_restroom',
        title: '家庭房和照顾服务优先',
        text: '亲子项目要先确认住宿是否适合家长和孩子同住，以及校内照顾、门禁和接送安排。',
      },
      {
        icon: 'child_care',
        title: '孩子课程要看年龄段',
        text: '低龄孩子更适合活动式英语和轻压力课程，青少年可考虑Junior ESL或寒暑假营队。',
      },
      {
        icon: 'school',
        title: '家长也可以上课',
        text: '不少学校提供家长ESL，适合家长陪读时同步提升口语，而不是只做看护。',
      },
      {
        icon: 'beach_access',
        title: '城市和活动影响体验',
        text: '宿务适合第一次亲子游学，克拉克环境舒适，长滩岛更偏度假体验。',
      },
    ],
    recommendedSchools: [
      {
        name: 'B Cebu',
        city: '宿务',
        fit: '亲子与舒适校区',
        reason: '适合重视校区环境、孩子课程和家庭住宿体验的家庭。',
      },
      {
        name: 'SMEAG',
        city: '宿务 / 碧瑶',
        fit: '体系化亲子与青少年课程',
        reason: '适合需要较成熟课程体系、营队或不同年龄段安排的家庭。',
      },
      {
        name: 'CG Banilad / Philinter',
        city: '宿务',
        fit: '城市便利亲子选择',
        reason: '适合第一次亲子游学，希望课程、生活和交通都相对稳定的家庭。',
      },
      {
        name: 'Joyful Education',
        city: '宿务',
        fit: '低龄与家庭友好',
        reason: '适合重视孩子适应、家庭陪读和轻松英语体验的用户。',
      },
    ],
    checklist: [
      '先确认孩子年龄和是否需要家长陪读。',
      '问清楚家庭房、餐食、接送、门禁和校内照顾安排。',
      '孩子低龄时，不要只看课时数量，要看活动、休息和适应节奏。',
      '寒暑假报名要提前规划，热门家庭房和营队名额会更紧张。',
    ],
  },
  sparta: {
    title: '斯巴达学校推荐',
    englishTitle: 'Sparta School Recommendations',
    route: '/philippines-study/recommendations/sparta-schools',
    audience: '适合冲刺型、管理型需求',
    intro:
      '斯巴达学校适合目标明确、想用较强管理推动学习的学生。常见安排包括门禁、晚自习、单词测试、出勤规则和较密集课表，特别适合雅思、多益冲刺或自律较弱的人群。',
    keywords: '斯巴达管理、半斯巴达、门禁、晚自习、考试冲刺',
    selectionFocus: '门禁时间、晚自习规则、每日测试、缺勤扣分、模考体系和宿舍学习环境',
    highlights: [
      {
        icon: 'lock_clock',
        title: '管理强度更高',
        text: '斯巴达学校通常会限制平日外出，搭配晚自习、单词测试和严格出勤要求。',
      },
      {
        icon: 'assignment',
        title: '适合考试冲刺',
        text: '雅思、多益或升学英语目标明确的学生，更适合用斯巴达节奏集中训练。',
      },
      {
        icon: 'psychology',
        title: '帮助建立学习节奏',
        text: '如果自律较弱、容易被城市生活分心，强管理学校能减少决策成本和干扰。',
      },
      {
        icon: 'warning',
        title: '先确认能否适应',
        text: '斯巴达不适合所有人。报名之前要确认学生能接受门禁、晚自习和较高课程密度。',
      },
    ],
    recommendedSchools: [
      {
        name: 'CG Sparta',
        city: '宿务',
        fit: '斯巴达雅思与ESL',
        reason: '适合希望在宿务接受较强管理、密集课程和考试冲刺的学生。',
      },
      {
        name: 'PINES',
        city: '碧瑶',
        fit: '碧瑶高强度学习',
        reason: '适合想在安静城市中专心学习、接受严格学习氛围的学生。',
      },
      {
        name: 'MONOL',
        city: '碧瑶',
        fit: '长期强化与规律学习',
        reason: '适合长期ESL、雅思或多益准备，重视课程系统和规律作息的人群。',
      },
      {
        name: 'JIC / CNS',
        city: '碧瑶',
        fit: '考试导向备考',
        reason: '适合目标分数明确，想把学习时间集中投入考试训练的学生。',
      },
    ],
    checklist: [
      '确认学生能否接受平日门禁、晚自习和严格出勤要求。',
      '问清楚违纪扣分、外出申请、请假和换课规则。',
      '考试学生要比较模考频率、写作批改和口语反馈。',
      '如果第一次游学且抗压较弱，可以先考虑半斯巴达。',
    ],
  },
  juniorCamp: {
    title: '青少年夏令营',
    englishTitle: 'Junior English Camp',
    route: '/philippines-study/recommendations/junior-camp',
    audience: '寒暑假重点项目',
    intro:
      '菲律宾青少年夏令营适合希望在寒暑假集中提升英语、培养独立生活能力和体验海外课堂的学生。选项目时要同时看课程强度、年龄分班、住宿照顾、安全管理、接送安排和周末活动。',
    keywords: 'Junior ESL、寒暑假营队、青少年英语、封闭管理、活动课程',
    selectionFocus: '年龄范围、分班测试、课程强度、宿舍照顾、门禁管理、接送和活动安全',
    highlights: [
      {
        icon: 'groups',
        title: '按年龄和水平分班',
        text: '青少年营队要先确认入营年龄、英语水平测试和班级安排，避免孩子课程过难或过轻。',
      },
      {
        icon: 'verified_user',
        title: '安全和照顾是第一优先',
        text: '营队需要重点确认宿舍老师、门禁、点名、外出规则、医疗支持和紧急联系机制。',
      },
      {
        icon: 'school',
        title: '英语课与活动结合',
        text: '好的营队不只是上课，也会安排演讲、团队项目、文化活动或周末游览，帮助学生真正开口。',
      },
      {
        icon: 'calendar_month',
        title: '寒暑假名额要提前订',
        text: '暑期和寒假是营队高峰，热门学校、家庭房和接送名额通常需要提前规划。',
      },
    ],
    recommendedSchools: [
      {
        name: 'SMEAG Junior Camp',
        city: '宿务 / 碧瑶',
        fit: '体系化青少年营队',
        reason: '适合需要成熟课程体系、营队管理和多年龄段安排的学生。',
      },
      {
        name: 'CG / CIA Junior Program',
        city: '宿务',
        fit: '课程与生活管理平衡',
        reason: '适合希望兼顾英语课程、住宿管理和周末活动体验的青少年。',
      },
      {
        name: 'B Cebu / Joyful Education',
        city: '宿务',
        fit: '低龄与亲子衔接',
        reason: '适合低龄学生、第一次海外营队或需要更温和适应节奏的家庭。',
      },
      {
        name: 'Clark / Subic Junior Options',
        city: '克拉克 / 苏比克',
        fit: '外教口语与舒适环境',
        reason: '适合重视外教口语、生活环境和安全感的青少年项目。',
      },
    ],
    checklist: [
      '确认孩子年龄、英语水平和是否能适应集体住宿。',
      '问清楚是否有宿舍老师、门禁点名、医疗支持和紧急联系人。',
      '比较每日课表：一对一、小班、活动课和自习时间比例。',
      '寒暑假营队要提前确认接送日期、活动安排、保险和退款规则。',
    ],
  },
};

@Component({
  selector: 'app-school-recommendation',
  standalone: false,
  templateUrl: './school-recommendation.component.html',
  styleUrl: './school-recommendation.component.css',
})
export class SchoolRecommendationComponent {
  private readonly route = inject(ActivatedRoute);

  readonly page$ = this.route.data.pipe(
    map((data) => recommendationPages[data['recommendationKey'] as string] ?? recommendationPages['ielts']),
  );
}
