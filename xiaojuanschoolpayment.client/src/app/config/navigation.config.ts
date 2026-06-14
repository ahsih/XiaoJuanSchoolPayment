export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  type?: string;
  note?: string;
  children?: NavigationItem[];
}

const placeholderRoute = '/';

export const mainNavigation: NavigationItem[] = [
  {
    id: 'ireland-study',
    label: '爱尔兰留学',
    route: placeholderRoute,
    note: '品牌升级与留学申请主入口',
    children: [
      {
        id: 'why-ireland',
        label: '为什么选择爱尔兰',
        route: placeholderRoute,
        type: '内容页',
        children: [
          {
            id: 'experience-ireland',
            label: '体验爱尔兰',
            route: placeholderRoute,
          },
          {
            id: 'ireland-education-system',
            label: '爱尔兰教育系统',
            route: placeholderRoute,
          },
          {
            id: 'working-in-ireland',
            label: '在爱尔兰工作',
            route: placeholderRoute,
          },
          {
            id: 'ireland-economy-jobs',
            label: '爱尔兰经济与就业',
            route: placeholderRoute,
          },
        ],
      },
      {
        id: 'ireland-work-study',
        label: '爱尔兰半工半读',
        route: placeholderRoute,
        type: '重点落地页',
      },
      {
        id: 'ireland-schools',
        label: '爱尔兰院校库',
        route: placeholderRoute,
        type: '院校聚合页',
        children: [
          {
            id: 'ireland-admission-info',
            label: '院校招生信息',
            route: placeholderRoute,
          },
          {
            id: 'ireland-scholarships',
            label: '院校奖学金信息',
            route: placeholderRoute,
          },
          {
            id: 'ireland-universities',
            label: '综合性大学',
            route: placeholderRoute,
          },
          {
            id: 'ireland-technology-universities',
            label: '理工大学/理工学院',
            route: placeholderRoute,
          },
          {
            id: 'ireland-private-schools',
            label: '私立院校',
            route: placeholderRoute,
          },
          {
            id: 'ireland-language-schools',
            label: '爱尔兰语言学校',
            route: placeholderRoute,
          },
          { id: 'nci', label: 'NCI 爱尔兰国家学院', route: placeholderRoute },
          {
            id: 'schm',
            label: 'SCHM 爱尔兰香农酒店管理学院',
            route: placeholderRoute,
          },
          {
            id: 'mic',
            label: 'MIC 爱尔兰伊玛克特教育学院',
            route: placeholderRoute,
          },
        ],
      },
      {
        id: 'ireland-undergraduate',
        label: '爱尔兰本科申请',
        route: placeholderRoute,
        type: '服务页',
      },
      {
        id: 'ireland-master',
        label: '爱尔兰硕士申请',
        route: placeholderRoute,
        type: '服务页',
      },
      {
        id: 'ireland-foundation',
        label: '爱尔兰预科申请',
        route: placeholderRoute,
        type: '服务页',
      },
      {
        id: 'ireland-application',
        label: '如何申请爱尔兰院校',
        route: placeholderRoute,
        type: '流程页',
        children: [
          {
            id: 'ireland-undergraduate-process',
            label: '本科课程申请',
            route: placeholderRoute,
          },
          {
            id: 'ireland-postgraduate-process',
            label: '研究生课程申请',
            route: placeholderRoute,
          },
        ],
      },
      {
        id: 'ireland-visa-accommodation',
        label: '爱尔兰签证与住宿',
        route: placeholderRoute,
        type: '指南页',
        children: [
          {
            id: 'ireland-visa-guide',
            label: '签证指南',
            route: placeholderRoute,
          },
          {
            id: 'ireland-accommodation-guide',
            label: '住宿指南',
            route: placeholderRoute,
          },
        ],
      },
      {
        id: 'ireland-life',
        label: '爱尔兰生活指南',
        route: placeholderRoute,
        type: '指南页',
        children: [
          {
            id: 'living-in-ireland',
            label: '住在爱尔兰',
            route: placeholderRoute,
          },
          {
            id: 'ireland-banking',
            label: '货币和银行服务',
            route: placeholderRoute,
          },
          {
            id: 'ireland-health-safety',
            label: '健康与安全',
            route: placeholderRoute,
          },
          {
            id: 'ireland-pre-departure',
            label: '行前准备清单',
            route: placeholderRoute,
          },
        ],
      },
    ],
  },
  {
    id: 'philippines-study',
    label: '菲律宾游学',
    route: placeholderRoute,
    note: '当前主要收入业务入口',
    children: [
      {
        id: 'why-philippines',
        label: '为什么选择菲律宾游学',
        route: '/philippines-study/why-philippines',
        type: '内容页',
      },
      {
        id: 'philippines-cost',
        label: '菲律宾游学费用',
        route: placeholderRoute,
        type: 'SEO/转化页',
      },
      {
        id: 'philippines-schools',
        label: '菲律宾语言学校大全',
        route: placeholderRoute,
        type: '学校库筛选',
        children: [
          {
            id: 'philippines-schools-by-city',
            label: '按城市找学校',
            route: '/philippines-study/schools/by-city',
          },
          {
            id: 'philippines-schools-by-course',
            label: '按课程找学校',
            route: placeholderRoute,
          },
          {
            id: 'philippines-schools-by-style',
            label: '按管理模式找学校',
            route: placeholderRoute,
          },
          {
            id: 'philippines-popular-schools',
            label: '热门学校合集',
            route: placeholderRoute,
          },
        ],
      },
      {
        id: 'cebu-study',
        label: '宿务游学',
        route: '/philippines-study/cebu',
        type: '城市页',
      },
      {
        id: 'baguio-study',
        label: '碧瑶游学',
        route: '/philippines-study/baguio',
        type: '城市页',
      },
      {
        id: 'clark-study',
        label: '克拉克游学',
        route: '/philippines-study/clark',
        type: '城市页',
      },
      {
        id: 'manila-study',
        label: '马尼拉游学',
        route: '/philippines-study/manila',
        type: '城市页',
      },
      {
        id: 'more-philippines-cities',
        label: '更多菲律宾城市',
        route: placeholderRoute,
        type: '城市页',
        children: [
          {
            id: 'boracay-study',
            label: '长滩岛游学',
            route: '/philippines-study/boracay',
          },
          {
            id: 'bacolod-study',
            label: '巴科洛德游学',
            route: '/philippines-study/bacolod',
          },
          { id: 'iloilo-study', label: '怡朗游学', route: '/philippines-study/iloilo' },
          { id: 'davao-study', label: '达沃游学', route: '/philippines-study/davao' },
          { id: 'subic-study', label: '苏比克游学', route: '/philippines-study/subic' },
        ],
      },
      {
        id: 'ielts-schools',
        label: '雅思备考学校推荐',
        route: placeholderRoute,
        type: '需求页',
      },
      {
        id: 'budget-schools',
        label: '性价比学校推荐',
        route: placeholderRoute,
        type: '需求页',
      },
      {
        id: 'family-schools',
        label: '亲子学校推荐',
        route: placeholderRoute,
        type: '需求页',
      },
      {
        id: 'junior-camp',
        label: '青少年夏令营',
        route: placeholderRoute,
        type: '项目页',
      },
      {
        id: 'sparta-schools',
        label: '斯巴达学校推荐',
        route: placeholderRoute,
        type: '需求页',
      },
      {
        id: 'philippines-offers',
        label: '菲律宾游学最新优惠',
        route: placeholderRoute,
        type: '活动页',
      },
      {
        id: 'philippines-faq',
        label: '菲律宾游学常见问题',
        route: placeholderRoute,
        type: 'FAQ页',
      },
    ],
  },
  {
    id: 'online-english',
    label: '线上英语',
    route: placeholderRoute,
    note: '低门槛引流项目',
    children: [
      {
        id: 'english-test',
        label: '免费英语水平测试',
        route: placeholderRoute,
        type: '引流页',
      },
      {
        id: 'online-english-courses',
        label: '线上英语课程',
        route: placeholderRoute,
        type: '课程总页',
      },
      {
        id: 'filipino-teacher-1v1',
        label: '菲律宾外教一对一',
        route: placeholderRoute,
        type: '课程页',
      },
      {
        id: 'ielts-speaking-writing',
        label: '雅思口语/写作辅导',
        route: placeholderRoute,
        type: '课程页',
      },
      {
        id: 'junior-online-english',
        label: '青少年英语课程',
        route: placeholderRoute,
        type: '课程页',
      },
      {
        id: 'adult-speaking',
        label: '成人口语课程',
        route: placeholderRoute,
        type: '课程页',
      },
      {
        id: 'trial-booking',
        label: '体验课预约',
        route: placeholderRoute,
        type: '转化页',
      },
      {
        id: 'online-english-faq',
        label: '线上英语常见问题',
        route: placeholderRoute,
        type: 'FAQ页',
      },
    ],
  },
  {
    id: 'overseas-study-tour',
    label: '海外游学',
    route: placeholderRoute,
    note: '其他国家游学项目入口',
    children: [
      {
        id: 'exclusive-offers',
        label: '思达独家最新优惠',
        route: placeholderRoute,
        type: '活动页',
      },
      {
        id: 'ireland-tour',
        label: '爱尔兰游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'uk-tour',
        label: '英国游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'singapore-tour',
        label: '新加坡游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'malaysia-tour',
        label: '马来西亚游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'canada-tour',
        label: '加拿大游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'australia-tour',
        label: '澳大利亚游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'usa-tour',
        label: '美国游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'france-tour',
        label: '法国游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'germany-tour',
        label: '德国游学',
        route: placeholderRoute,
        type: '国家页',
      },
      {
        id: 'vietnam-tour',
        label: '越南游学',
        route: placeholderRoute,
        type: '国家页',
      },
    ],
  },
  {
    id: 'study-tour-guide',
    label: '游学指南',
    route: placeholderRoute,
    note: '游学 SEO 与决策内容',
    children: [
      {
        id: 'tour-cost-guide',
        label: '游学费用指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'choose-language-school',
        label: '如何选择语言学校',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'philippines-guide',
        label: '菲律宾游学指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'online-english-guide',
        label: '线上英语怎么选',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'family-tour-guide',
        label: '亲子游学指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'holiday-tour-guide',
        label: '寒暑假游学指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'ielts-tour-guide',
        label: '雅思备考游学指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'gap-year-guide',
        label: 'Gap Year 游学指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'tour-accommodation-guide',
        label: '游学住宿指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'tour-visa-guide',
        label: '游学签证指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'tour-pre-departure',
        label: '行前准备清单',
        route: placeholderRoute,
        type: '工具页',
      },
      {
        id: 'tour-faq',
        label: '游学常见问题',
        route: placeholderRoute,
        type: 'FAQ页',
      },
    ],
  },
  {
    id: 'study-abroad-guide',
    label: '留学指南',
    route: placeholderRoute,
    note: '爱尔兰留学 SEO 与申请内容',
    children: [
      {
        id: 'ireland-study-cost',
        label: '爱尔兰留学费用',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'ireland-application-timeline',
        label: '爱尔兰申请时间线',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'ireland-school-selection',
        label: '爱尔兰院校选择指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'ireland-work-study-guide',
        label: '爱尔兰半工半读指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'undergraduate-guide',
        label: '本科申请指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'master-guide',
        label: '硕士申请指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'foundation-guide',
        label: '预科申请指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'major-selection-guide',
        label: '专业选择指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'application-materials',
        label: '申请材料清单',
        route: placeholderRoute,
        type: '工具页',
      },
      {
        id: 'study-visa-guide',
        label: '签证申请指南',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'study-pre-departure',
        label: '住宿与行前准备',
        route: placeholderRoute,
        type: 'SEO指南页',
      },
      {
        id: 'study-faq',
        label: '留学常见问题',
        route: placeholderRoute,
        type: 'FAQ页',
      },
    ],
  },
  {
    id: 'student-feedback',
    label: '学员反馈',
    route: placeholderRoute,
    note: '信任背书',
    children: [
      {
        id: 'youxue-feedback',
        label: '游学反馈',
        route: placeholderRoute,
        type: '反馈页',
      },
      {
        id: 'liuxue-feedback',
        label: '留学反馈',
        route: placeholderRoute,
        type: '反馈页',
      },
    ],
  },
  {
    id: 'about-star',
    label: '关于思达',
    route: placeholderRoute,
    note: '品牌与团队信息',
    children: [
      {
        id: 'about',
        label: '关于思达',
        route: placeholderRoute,
        type: '品牌页',
      },
      {
        id: 'services',
        label: '服务项目',
        route: placeholderRoute,
        type: '品牌页',
      },
      {
        id: 'advantages',
        label: '服务优势',
        route: placeholderRoute,
        type: '品牌页',
      },
      {
        id: 'consultants',
        label: '顾问团队',
        route: placeholderRoute,
        type: '团队页',
      },
      {
        id: 'pricing',
        label: '收费说明',
        route: placeholderRoute,
        type: '说明页',
      },
      {
        id: 'contact',
        label: '联系我们',
        route: placeholderRoute,
        type: '联系页',
      },
    ],
  },
];
