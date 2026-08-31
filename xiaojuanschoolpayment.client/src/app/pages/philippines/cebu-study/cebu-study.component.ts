import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../../directives/scroll-to.directive';

interface SelectionGroup {
  icon: string;
  title: string;
  subtitle: string;
  category: Exclude<DirectoryCategory, '全部学校'>;
  tone: 'green' | 'orange' | 'violet' | 'blue';
  image: string;
  schools: string[];
}

interface FeaturedSchool {
  name: string;
  badge: string;
  tone: 'green' | 'violet' | 'teal' | 'navy' | 'orange';
  image: string;
  route: string;
  description: string;
  tags: string[];
}

interface LifestyleItem {
  icon: string;
  title: string;
  text: string;
  image: string;
}

interface ServiceItem {
  icon: string;
  title: string;
  text: string;
  image?: string;
  alt?: string;
}

type DirectoryCategory = '全部学校' | '雅思名校' | '斯巴达管理' | '高性价比' | '亲子友好';

interface DirectorySchool {
  name: string;
  route: string;
  tag: string;
  location: string;
  summary: string;
  image: string;
  imagePosition?: string;
  highlights: string[];
  linkLabel?: string;
}

interface Advisor {
  name: string;
  focus: string;
  text: string;
  avatar: string;
  qr: string;
  phone: string;
  phoneDisplay: string;
}

@Component({
  selector: 'app-cebu-study',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './cebu-study.component.html',
  styleUrl: './cebu-study.component.css',
})
export class CebuStudyComponent {
  readonly selectionGroups: SelectionGroup[] = [
    {
      icon: 'workspace_premium',
      title: '雅思名校',
      subtitle: '雅思课程成熟，备考与模考资源更完整',
      category: '雅思名校',
      tone: 'green',
      image: '/assets/cia/idp-testing-venue.jpg',
      schools: [
        'CIA',
        'EV Academy',
        'SMEAG Capital',
        'CPILS',
        'Philinter',
        'Fella',
        'CELLA Uni',
        'CG 斯巴达',
      ],
    },
    {
      icon: 'shield',
      title: '斯巴达管理模式',
      subtitle: '高强度课程，适合集中冲刺',
      category: '斯巴达管理',
      tone: 'violet',
      image: '/assets/ev/campus-exterior.jpg',
      schools: [
        'EV 主校区',
        'CPI',
        'SMEAG Capital',
        'CPILS',
        'CG 斯巴达',
        'Philinter',
        'CELLA Uni',
        "B'Cebu",
        'GLC',
        'QQEnglish BFC',
      ],
    },
    {
      icon: 'thumb_up',
      title: '高性价比',
      subtitle: '课量扎实，预算更友好',
      category: '高性价比',
      tone: 'orange',
      image: '/assets/cpi/campus-exterior.jpg',
      schools: [
        'CPI',
        'I.BREEZE',
        "B'Cebu",
        'ICL',
        'IU',
        'CG Banilad',
        'CG 斯巴达',
        'ELSA',
        'BTES',
        'CELLA Uni',
        'Winning 海滨校区',
        '3D Academy',
        'CPILS',
      ],
    },
    {
      icon: 'family_restroom',
      title: '亲子友好型学习',
      subtitle: '亲子、青少年与家庭住宿路线集中比较',
      category: '亲子友好',
      tone: 'blue',
      image: '/assets/philippines/ev-la-mer-campus.jpg',
      schools: [
        'EV La Mer',
        'CPI',
        'CIEC',
        'I.BREEZE',
        "B'Cebu",
        'ICL',
        'IU Academy',
        'CG Banilad',
        'English Fella',
        'ELSA',
        'SMEAG Encanto 海滨校区',
        'Cebu Blue Ocean',
        'Philinter',
        'Genius English',
        'EMO',
        'HLA',
        'QQEnglish BFC',
        'BTES',
        'CELLA Premium',
        'Winning 海滨校区',
        'IMS Banilad',
        'GLC',
      ],
    },
  ];

  readonly featuredSchools: FeaturedSchool[] = [
    {
      name: 'CIA',
      badge: '综合实力强',
      tone: 'green',
      image: '/assets/cia/campus-building.png',
      route: '/philippines-study/cebu/cia-cebu-international-academy',
      description: '国际化新校区，课程与生活配套均衡',
      tags: ['雅思考场', '亲子友好'],
    },
    {
      name: 'EV Academy',
      badge: '双管理模式',
      tone: 'violet',
      image: '/assets/ev/campus-exterior.jpg',
      route: '/philippines-study/cebu/ev-academy',
      description: '可选斯巴达或半斯巴达，兼顾强度与自由度',
      tags: ['斯巴达', '半斯巴达', '雅思课程'],
    },
    {
      name: 'CPI',
      badge: '度假氛围',
      tone: 'teal',
      image: '/assets/cpi/campus-exterior.jpg',
      route: '/philippines-study/cebu/cpi-cebu-pelis-institute',
      description: '斯巴达与半斯巴达可选，设施与生活配套完善',
      tags: ['斯巴达', '半斯巴达', '亲子友好'],
    },
    {
      name: 'CPILS',
      badge: '老牌名校',
      tone: 'navy',
      image: '/assets/cpils/campus-front.jpg',
      route: '/philippines-study/cebu/cpils',
      description: '老牌综合学校，可选斯巴达与半斯巴达管理',
      tags: ['斯巴达', '半斯巴达', '资源齐全'],
    },
    {
      name: 'English Fella',
      badge: '选择灵活',
      tone: 'orange',
      image: '/assets/fella/campus-main.jpg',
      route: '/philippines-study/cebu/english-fella',
      description: '双校区选择，课程与管理方式灵活',
      tags: ['半斯巴达', '环境舒适'],
    },
  ];

  readonly lifestyleItems: LifestyleItem[] = [
    {
      icon: 'school',
      title: '高效学习',
      text: '一对一课程密集，按目标制定学习计划',
      image: '/assets/ev/mtm-classroom.jpg',
    },
    {
      icon: 'restaurant',
      title: '饮食丰富',
      text: '校内餐食多样，生活安排更省心',
      image: '/assets/philippines/cebu-lifestyle-dining.jpg',
    },
    {
      icon: 'location_city',
      title: '生活便利',
      text: '现代商圈、医疗、餐饮与日常配套集中',
      image: '/assets/philippines/cebu-city-view.jpg',
    },
    {
      icon: 'surfing',
      title: '周末出游',
      text: '跳岛、浮潜与海上活动，让周末真正放松下来',
      image: '/assets/philippines/cebu-weekend-ocean.png',
    },
    {
      icon: 'verified_user',
      title: '安全友好',
      text: '住宿型学校通常设门卫值守、门禁与访客管理',
      image: '/assets/philippines/cebu-school-gate-security.jpg',
    },
  ];

  readonly services: ServiceItem[] = [
    {
      icon: 'account_balance_wallet',
      title: '0中介费与费用说明',
      text: '按学校合作渠道报价，学费、住宿费和当地费用在报名前逐项说明。',
      image: '/assets/cia/sida-why-action-fees.jpg',
      alt: '顾问核对学校费用和服务明细',
    },
    {
      icon: 'fact_check',
      title: '专业选校建议',
      text: '结合预算、学习目标、课程强度和住宿偏好，认真比较适合你的学校。',
      image: '/assets/cia/sida-why-action-selection.jpg',
      alt: '顾问根据学生需求比较学校和课程',
    },
    {
      icon: 'description',
      title: '签证与材料协助',
      text: '报名材料、签证与入学文件逐项核对，重要内容留下书面确认。',
      image: '/assets/cia/sida-why-action-contract.jpg',
      alt: '顾问逐项核对报名合同与申请材料',
    },
    {
      icon: 'flight_takeoff',
      title: '行前准备清单',
      text: '机票、保险、接机、行李和入境事项一次说明，出发前逐项核对。',
      image: '/assets/cia/sida-why-action-departure.jpg',
      alt: '顾问整理机票、保险和入境行前清单',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '到校衔接、在读生活和突发问题，都可以联系菲律宾驻点人员。',
      image: '/assets/cia/sida-why-action-team.jpg',
      alt: '国内顾问与菲律宾驻点团队协作服务学生',
    },
    {
      icon: 'support_agent',
      title: '入学后持续跟进',
      text: '完成报名不是终点，学习期间遇到课程或生活问题仍会继续协助沟通。',
      image: '/assets/cia/sida-why-action-followup.jpg',
      alt: '顾问通过线上沟通持续跟进学生学习情况',
    },
  ];

  readonly trustHighlights: ServiceItem[] = [
    {
      icon: 'price_check',
      title: '保价服务',
      text: '同种情况下，如果报名后或者入学后比价发现有价格比我们更低的，我们核实后退差价。',
    },
    {
      icon: 'storefront',
      title: '中国实体办公室，可面签合同',
      text: '可到办公室沟通方案并签署正式服务合同，服务内容与责任有据可查。',
      image: '/assets/philippines/service-china-office-logo.jpg',
      alt: '身穿思达启航工衣的顾问在中国实体办公室陪同学生面签合同',
    },
    {
      icon: 'public',
      title: '欧洲与菲律宾均有驻点人员',
      text: '海外当地有人衔接，从出发前到入学后的问题都能找到对应人员。',
      image: '/assets/philippines/service-overseas-team-logo.jpg',
      alt: '身穿思达启航工衣的中国、菲律宾与欧洲服务团队合照',
    },
    {
      icon: 'verified_user',
      title: '报价透明，服务落实到合同',
      text: '学校费用、服务范围与重要节点提前说明，减少口头承诺和后续信息差。',
      image: '/assets/philippines/service-contract-proof.jpg',
      alt: '服务合同、费用明细与签字盖章场景',
    },
  ];

  readonly alumniBenefits: ServiceItem[] = [
    {
      icon: 'video_call',
      title: '老学员回国续学，线上一对一享超值专属价',
      text: '宿务课程结束回国后，继续报名线上一对一英语课，可享比常规报名更划算的老学员专属价格，让英语学习不断档。',
      image: '/assets/philippines/service-online-followup.jpg',
      alt: '学员通过在线视频课程继续学习英语',
    },
    {
      icon: 'flight_takeoff',
      title: '继续去欧洲学英语，争取合作学校优惠',
      text: '后续选择欧洲英语课程时，部分合作学校可申请免注册费或其他专属优惠。',
      image: '/assets/philippines/beci-eop-outdoor-study.jpg',
      alt: '学员在轻松真实的学习场景中继续练习英语',
    },
    {
      icon: 'school',
      title: '再出发去爱尔兰，老学员奖学金支持',
      text: '之后通过思达启航申请爱尔兰留学，符合当期活动条件的老学员可领取思达启航奖学金。',
      image: '/assets/philippines/service-ireland-cliffs.jpg',
      alt: '爱尔兰标志性莫赫悬崖与大西洋实景',
    },
  ];

  readonly directoryFilters: { label: DirectoryCategory; icon: string }[] = [
    { label: '全部学校', icon: 'grid_view' },
    { label: '雅思名校', icon: 'workspace_premium' },
    { label: '斯巴达管理', icon: 'shield' },
    { label: '高性价比', icon: 'savings' },
    { label: '亲子友好', icon: 'family_restroom' },
  ];

  activeDirectoryFilter: DirectoryCategory = '全部学校';

  readonly directoryCategorySchools: Record<Exclude<DirectoryCategory, '全部学校'>, string[]> = {
    雅思名校: ['CIA', 'EV Academy', 'SMEAG Capital', 'CPILS', 'Philinter', 'English Fella', 'CELLA Uni', 'CG Sparta'],
    斯巴达管理: ['EV Academy', 'CPI', 'SMEAG Capital', 'CPILS', 'CG Sparta', 'Philinter', 'CELLA Uni', "B'Cebu", 'GLC', 'QQEnglish BFC'],
    高性价比: ['CPI', 'I.BREEZE', "B'Cebu", 'ICL', 'IU Academy', 'CG Banilad', 'CG Sparta', 'ELSA', 'BTES', 'CELLA Uni', 'Winning 海滨校区', '3D Academy', 'CPILS'],
    亲子友好: ['EV La Mer', 'CPI', 'CIEC', 'I.BREEZE', "B'Cebu", 'ICL', 'IU Academy', 'CG Banilad', 'English Fella', 'ELSA', 'SMEAG Encanto 海滨校区', 'Cebu Blue Ocean', 'Philinter', 'Genius English', 'EMO', 'HLA', 'QQEnglish BFC', 'BTES', 'CELLA Premium', 'Winning 海滨校区', 'IMS Banilad', 'GLC'],
  };

  readonly directoryPopularityOrder = [
    'CIA', 'EV Academy', 'EV La Mer', 'CPI', 'CPILS', 'SMEAG Capital', 'SMEAG Encanto 海滨校区', 'English Fella', 'Philinter', "B'Cebu",
    'I.BREEZE', 'Cebu Blue Ocean', 'CELLA Uni', 'CG Sparta', 'GLC', 'CELLA Premium', 'CG Banilad',
    'IU Academy', 'Winning 海滨校区', 'QQEnglish BFC', 'ELSA', '3D Academy', 'ICL', 'IMS Banilad',
    'TARGET', 'First English', 'CIEC', 'Genius English', 'STARGATE', 'BTES', 'CIJ Premium',
    'HLA', 'EMO', 'Curious World', 'ETHOS', 'Howdy English', 'GLANT', 'Lapulapu',
  ];

  readonly allSchools: DirectorySchool[] = [
    {
      name: 'CIA', route: '/philippines-study/cebu/cia-cebu-international-academy', tag: '度假村式校区',
      location: 'Mactan · Lapu-Lapu', summary: '度假村式新校区，课程、住宿与生活配套均衡，适合雅思和亲子学生。',
      image: '/assets/cia/campus-building.png', highlights: ['综合英语', '雅思', '托业', '商务英语', '剑桥英语', '航空英语', '打工度假英语', '亲子课程'],
    },
    {
      name: 'First English', route: '/philippines-study/cebu/first-english-global-college', tag: '日系亲子型校区',
      location: 'Mactan Newtown', summary: '高比例一对一课程，亲子与儿童安排成熟，生活圈便利。',
      image: 'https://www.firstcebu.com/wp2/wp-content/uploads/2024/03/%E6%95%99%E5%AE%A4%E4%BF%AF%E7%9E%B0-1-1-1024x768.jpg', highlights: ['综合英语', '6节一对一', '7至8节一对一', '少儿英语 / 英检', '走读课程'],
    },
    {
      name: 'CIEC', route: '/philippines-study/cebu/ciec', tag: '亲子青少年专门校',
      location: 'Talamban · Cebu City', summary: '专注低龄英语、国际学校衔接和青少年斯巴达管理。',
      image: 'https://file.hstatic.net/200000456083/file/tham-quan-truong-anh-ngu-ciec-tai-cebu_88fb4e8e067c49e28c36a7212cee13f5_1024x1024.png', highlights: ['青少年学术英语', '青少年斯巴达', '青少年雅思 / 托福', '国际学校衔接', '家长英语 / 商务英语'],
    },
    {
      name: 'ELSA', route: '/philippines-study/cebu/elsa-international-language-school', tag: '自然度假校区',
      location: 'Compostela · Cebu', summary: '大面积自然校园，成人英语、幼儿园、青少年和家长课程均有设置。',
      image: 'https://www.fujiyama-international.com/archives/004/202505/414b2d68d20185f1c1ee5eb61c16eefeada06d16b761aeb08d33328ed32ae346.jpg', highlights: ['成人综合英语', '高尔夫英语', '青少年英语', '英语幼儿园', '家长英语'],
    },
    {
      name: 'EMO', route: '/about-sida/contact', tag: '英语幼儿园·亲子型',
      location: 'Banilad · Mandaue City', summary: '以英语幼儿园和亲子学习见长，家长课程、青少年英语与生活照护可一起安排。',
      image: '/assets/philippines/emo-campus.jpg', highlights: ['强化综合英语', '青少年英语', '英语幼儿园', '家长课程'],
      linkLabel: '咨询学校资料',
    },
    {
      name: 'HLA', route: '/about-sida/contact', tag: '自然校园·家庭型',
      location: 'Liloan · Cebu', summary: '绿地型综合校园，设置亲子、成人英语及多种专业英语课程，适合家庭同行。',
      image: '/assets/philippines/hla-campus.jpg', highlights: ['综合英语', '亲子课程', '雅思 / 托业', '商务英语', '航空英语'],
      linkLabel: '咨询学校资料',
    },
    {
      name: 'ETHOS', route: '/philippines-study/cebu/ethos-language-school', tag: '美籍教师小班校',
      location: 'Cebu City', summary: '美国教师小班型学校，强调美式发音、写作和家庭式学习氛围。',
      image: 'https://www.ethos.ph/images/ETHOS%20US%20Teachers.jpg', highlights: ['4小时美式英语', '5小时英语 + 写作', '美式发音', '英语会话'],
    },
    {
      name: 'IMS Banilad', route: '/philippines-study/cebu/ims-academy', tag: '市区综合校',
      location: 'Banilad · Cebu City', summary: '综合英语、雅思、熟龄和亲子课程齐全，适合不同年龄与目标。',
      image: 'https://www.ausbiznet.com/wp/wp-content/uploads/2018/09/cebu_ims-banilad00.jpg', highlights: ['基础 / 强化综合英语', '雅思 / 托业', '商务英语', '打工度假英语', '青少年 / 家长英语'],
    },
    {
      name: 'TARGET', route: '/philippines-study/cebu/target-global-english-academy', tag: '日系小规模校',
      location: 'Talamban · Cebu City', summary: '小规模、课量灵活，适合成人口语、初学者和预算优先学生。',
      image: 'https://target-english.org/wp-content/uploads/Basketball.jpg', highlights: ['轻量一对一4节', '标准一对一4至6节', '高强度一对一8节', '雅思', '打工度假英语'],
    },
    {
      name: 'CIJ Premium', route: '/philippines-study/cebu/cij-academy-premium-campus', tag: '市区舒适校区',
      location: 'Mabolo · Cebu City', summary: '舒适住宿结合高比例一对一、外教、商务与托业课程。',
      image: '/assets/philippines/cij-premium-campus-cover.jpg', highlights: ['综合英语4 / 高阶英语', '强化口语', '外教英语', '商务英语', '托业'],
    },
    {
      name: 'Curious World', route: '/philippines-study/cebu/curious-world-academy', tag: '市区半斯巴达',
      location: 'Mabolo · Cebu City', summary: '日系运营的市区校区，兼顾一对一课量、生活便利和预算。',
      image: 'https://philippines-study.tw/wp-content/uploads/2023/12/C19183B1-5E81-496F-BA23-800D336A0C1A-1.jpg', highlights: ['综合英语', '考试英语', '商务英语', '打工度假英语', '轻工作度假英语'],
    },
    {
      name: 'GLC', route: '/philippines-study/cebu/global-language-cebu', tag: '大型综合校',
      location: 'Mabolo · Cebu City', summary: '课程选择丰富、设施完整，覆盖成人考试、商务和亲子路线。',
      image: 'https://cdn.prod.website-files.com/658a2c561b10d6e75c0e7e74/658a2c561b10d6e75c0e820d_GLC_Campus001.jpg', highlights: ['强化口语', '雅思 / 托业', '商务英语', '亲子 / 青少年英语', '英语 + 实习'],
    },
    {
      name: 'QQEnglish BFC', route: '/philippines-study/cebu/qqenglish-beachfront-campus', tag: '海滨校区',
      location: 'Mactan Newtown', summary: '海滨新校区，菲律宾外教一对一和自理住宿方案灵活。',
      image: 'https://qqeng.net/wp-content/uploads/2024/04/newtown.png', highlights: ['4 / 6 / 8节一对一', '凯伦学习法 / R.E.M.S.', '商务英语', '雅思 / 托业', '少儿英语'],
    },
    {
      name: 'STARGATE', route: '/philippines-study/cebu/stargate-global-education', tag: '日系小班校',
      location: 'Kasambagan · Cebu City', summary: '日系小规模全寮制学校，适合初学者、托业和商务英语。',
      image: 'https://stargate-cebu.com/wp-content/themes/stargate/images/top2025/slide1/slide1_img01_2.jpg', highlights: ['标准 / 轻松英语', '强化口语', '托业', '商务英语'],
    },
    {
      name: 'Winning 海滨校区', route: '/philippines-study/cebu/winning-english-academy', tag: '海滨校区',
      location: 'Mactan · Lapu-Lapu', summary: '海滨校区覆盖综合英语、雅思、商务和亲子课程，学习与海岛生活兼顾。',
      image: 'https://tabiken-ryugaku.co.jp/ph/wp-content/uploads/sites/3/2023/08/6-2-1024x576.jpg', highlights: ['剑桥综合英语', '强化 / 集中口语', '旅游英语', '商务英语', '雅思 / 托业', '亲子 / 青少年英语'],
    },
    {
      name: 'GLANT', route: '/philippines-study/cebu/glant', tag: '小规模自由管理',
      location: 'Banilad · Cebu City', summary: '小规模环境搭配外教课程，学习节奏自由、生活位置便利。',
      image: 'https://static.wixstatic.com/media/29a68c_692a8dcd34804195a436dfadd214fde9~mv2.jpg/v1/fill/w_1800%2Ch_1198%2Cal_c/29a68c_692a8dcd34804195a436dfadd214fde9~mv2.jpg', highlights: ['常规 / 强化综合英语', '高阶 / 轻量英语', '外教课', '雅思'],
    },
    {
      name: 'ICL', route: '/philippines-study/cebu/icl', tag: '市区半斯巴达',
      location: 'Gorordo Ave · Cebu City', summary: '半斯巴达管理，强化口语与雅思保证课程选择完整。',
      image: 'https://www.fujiyama-international.com/archives/004/202510/42e04b981aa040a4f845892a42da3625d94846d3614157b187c8f15b8a466688.jpg', highlights: ['强化口语', '雅思保证班', '托业', '商务英语', '青少年 / 家长英语'],
    },
    {
      name: '3D Academy', route: '/philippines-study/cebu/3d-academy', tag: '市中心老牌校',
      location: 'Lahug · Cebu City', summary: '日系老牌市中心校区，生活便利，一对一口语课量选择丰富。',
      image: 'https://3d-universal.com/images/2025/Facilities/Entrance/学校前は人通りが多く安全.jpg', highlights: ['常规 / 强化综合英语', '一对一口语', '雅思 / 托业 / 托福', '商务英语', '青少年英语'],
    },
    {
      name: 'BTES', route: '/philippines-study/cebu/btes-english-academy', tag: '台资市区校',
      location: 'Kasambagan · Cebu City', summary: '台资市区型学校，提供综合英语、雅思、托业、商务和亲子课程。',
      image: 'https://www.fujiyama-international.com/archives/004/202404/b862d6cf8e313f63b336bb005f3f05e9.jpg', highlights: ['综合英语', '雅思 / 雅思预备', '托业 / 托业预备', '商务英语', '青少年 / 亲子英语'],
    },
    {
      name: 'CELLA Uni', route: '/philippines-study/cebu/cella-uni-sparta-campus', tag: '斯巴达校区',
      location: 'Talamban · Cebu City', summary: '强化口语、雅思、托业与英语教师资格课程配合严格管理。',
      image: 'https://cebu21.jp/include/schoolno5/cellaunicenter/Pool/photocuc_29.jpg', highlights: ['强化口语', '雅思保证班', '托业', '英语教师资格课程', '短期密集英语'],
    },
    {
      name: 'CG Sparta', route: '/philippines-study/cebu/cg-academy-sparta-campus', tag: '斯巴达专门校',
      location: 'Talisay · Cebu', summary: '高强度日程与EOP环境，适合短期集中提升和考试冲刺。',
      image: 'https://phl-ryugaku-apa.com/wp-content/uploads/2023/04/School-view-2-scaled-e1685250113690.jpg', highlights: ['斯巴达 / 高阶综合英语', '雅思保证班', '托业', '商务英语', '短期综合英语'],
    },
    {
      name: 'CG Banilad', route: '/philippines-study/cebu/cg-academy-banilad-campus', tag: '市区半斯巴达',
      location: 'Banilad · Cebu City', summary: '市区生活便利，综合英语、雅思、商务和家庭课程安排更灵活。',
      image: 'https://phl-ryugaku-apa.com/wp-content/uploads/2023/04/20-scaled-e1684639334995.jpg', highlights: ['轻量 / 强化综合英语', '雅思', '托业', '商务英语', '亲子英语'],
    },
    {
      name: 'SMEAG Capital', route: '/philippines-study/cebu/smeag-capital', tag: '市区考试型校区',
      location: 'Guadalupe · Cebu City', summary: '市区考试型校区，雅思、托业、托福和保证班体系成熟。',
      image: '/assets/philippines/smeag-capital-building.png', highlights: ['剑桥综合英语', '口语大师', '雅思保证班', '托业 / 托福', '商务英语', '亲子课程'],
    },
    {
      name: 'SMEAG Encanto 海滨校区', route: '/about-sida/contact', tag: '麦克坦海滨亲子校区',
      location: 'Mactan · Lapu-Lapu', summary: '海滨度假型校区，亲子课程、Cambridge体系与家庭住宿是主要特色。',
      image: '/assets/philippines/smeag-encanto-campus-official.png', imagePosition: 'center 74%', highlights: ['亲子营', '剑桥综合英语', '综合英语1 / 2', '商务英语'],
      linkLabel: '咨询学校资料',
    },
    {
      name: 'Genius English', route: '/philippines-study/cebu/genius-english-academy', tag: '海边多国籍',
      location: 'Maribago · Mactan', summary: '海边度假型学校，多国籍环境，管理强度和家庭课程选择灵活。',
      image: 'https://cebu-navi.com/photo/school/24/c0db828e2ab95ccc3199fa2614e5fa9f.jpg', highlights: ['综合英语 / 强化口语', '雅思保证班', '托业 / 托福', '商务英语', '亲子课程'],
    },
    {
      name: 'Howdy English', route: '/philippines-study/cebu/howdy-english-academy', tag: '日系酒店型',
      location: 'Mandaue City', summary: '酒店型住宿与一对一课程为主，适合成人短期和亲子同行。',
      image: 'https://www.howdyenglishacademy.com/images/hero/building-exterior.png', highlights: ['常规一对一5 / 7节', '亲子课程', '线上英语', '职场英语 + 实习'],
    },
    {
      name: 'I.BREEZE', route: '/philippines-study/cebu/ibreeze', tag: '市区度假型',
      location: 'Mabolo · Cebu City', summary: '新式综合校区，口语强化、考试课程和生活便利度表现均衡。',
      image: 'https://www.cebu21.jp/2014/assets/img/school/tw/ibreeze.jpg', highlights: ['强化 / 轻量综合英语', '密集口语', '雅思', '托业', '商务英语', '青少年英语'],
    },
    {
      name: 'IU Academy', route: '/philippines-study/cebu/iu-english-academy', tag: '市区独立校区',
      location: 'General Maxilom · Cebu City', summary: '强化口语、健身英语、雅思与亲子课程结合的市区新校。',
      image: 'https://storage.googleapis.com/outto-strapi-cms-gcp/cms/85287_c84cef02eb/85287_c84cef02eb.jpg', highlights: ['轻量综合英语 / 强化口语', '雅思保证班', '托业', '商务英语', '健身英语', '少儿 / 家长英语'],
    },
    {
      name: 'Lapulapu', route: '/philippines-study/cebu/lapulapu', tag: '大学型项目',
      location: 'Bankal · Lapu-Lapu', summary: '大学环境英语项目，固定周期并提供Buddy System校园交流。',
      image: 'https://lcic.jp/assets/images/index/index-main-1-2022.jpg', highlights: ['综合英语技能', '酒店服务英语', '演讲表达英语', '托业口语与写作', '校园伙伴交流'],
    },
    {
      name: 'Cebu Blue Ocean', route: '/philippines-study/cebu/cebu-blue-ocean-academy', tag: '海边度假型',
      location: 'Maribago · Mactan', summary: 'PINES姊妹校，海景住宿结合综合英语、雅思、商务和青少年课程。',
      image: 'https://www.firstenglish.jp/wp-content/uploads/2019/03/0d7cfbb129cc04c095aefddee46d8a3d.jpg', highlights: ['轻量 / 强化综合英语', '雅思', '托业', '商务英语', '青少年 / 家长英语', '熟龄英语'],
    },
    {
      name: 'CELLA Premium', route: '/philippines-study/cebu/cella-premium-campus', tag: '市区舒适型',
      location: 'Banilad · Cebu City', summary: '舒适住宿与口语、商务、打工度假英语、亲子路线兼顾。',
      image: 'https://languverseofficial.com/wp-content/uploads/2024/08/IMG_4505-1024x812.jpg', highlights: ['轻量综合英语 / 强化口语', '商务英语', '打工度假英语', '短期密集英语', '亲子课程'],
    },
    {
      name: 'EV Academy', route: '/philippines-study/cebu/ev-academy', tag: '现代综合校区',
      location: 'Nasipit · Cebu City', summary: '高品质现代校园，SP1斯巴达与SP2半斯巴达路线可选。',
      image: '/assets/ev/campus-exterior.jpg', highlights: ['斯巴达 / 半斯巴达综合英语', '强化口语', '雅思', '托业', '商务英语'],
    },
    {
      name: 'EV La Mer', route: '/about-sida/contact', tag: '麦克坦亲子度假校区',
      location: 'Cordova · Mactan', summary: 'EV第二校区，以泳池度假环境、亲子课程和青少年项目为主要特色。',
      image: '/assets/philippines/ev-la-mer-campus.jpg', highlights: ['经典综合英语', '强化口语6 / 8节', '亲子课程', '熟龄英语'],
      linkLabel: '咨询学校资料',
    },
    {
      name: 'CPI', route: '/philippines-study/cebu/cpi-cebu-pelis-institute', tag: '度假村校园',
      location: 'Nivel Hills · Cebu City', summary: '设施完善的半斯巴达校园，兼顾考试课程、亲子与生活体验。',
      image: '/assets/cpi/campus-exterior.jpg', highlights: ['常规 / 强化综合英语', '雅思 / 托业 / 托福', '口语强化', '商务英语', '青少年 / 家长英语'],
    },
    {
      name: "B'Cebu", route: '/philippines-study/cebu/bcebu', tag: '麦克坦新校区',
      location: 'Mactan · Lapu-Lapu', summary: '课程从轻量综合英语到雅思斯巴达，并提供丰富亲子与房型选择。',
      image: 'https://assets.1000-island.com/schools/bcebu-academy/bcebu-academy-campus-01.webp', highlights: ['快速 / 密集综合英语', '雅思斯巴达', 'B式斯巴达', '商务英语', '青少年 / 亲子英语', '熟龄轻量英语'],
    },
    {
      name: 'CPILS', route: '/philippines-study/cebu/cpils', tag: '老牌综合校',
      location: 'Cebu City', summary: '长期办学积累深厚，综合英语、雅思、托业和斯巴达管理成熟。',
      image: '/assets/cpils/campus-main.jpg', highlights: ['常规综合英语', '强化口语', '雅思', '托业 / 托福', '商务英语', '亲子课程'],
    },
    {
      name: 'English Fella', route: '/philippines-study/cebu/english-fella', tag: '双校区管理可选',
      location: 'Talamban · Cebu City', summary: '斯巴达与半斯巴达校区可选，适合考试备考和长期学习。',
      image: '/assets/fella/campus-main.jpg', highlights: ['强化口语', '雅思保证班', '托业 / 托福', '商务英语', '青少年 / 家长英语'],
    },
    {
      name: 'Philinter', route: '/philippines-study/cebu/philinter-academy', tag: '老牌综合校',
      location: 'Mactan · Lapu-Lapu', summary: '老牌半斯巴达学校，口语、雅思、商务和家庭课程体系完整。',
      image: '/assets/philinter/campus-main.jpeg', highlights: ['常规 / 强化综合英语', '强化口语', '雅思保证班', '托业 / 托福', '商务 / 行业英语', '小学 / 青少年英语'],
    },
  ];

  get directoryHeading(): string {
    const headings: Record<DirectoryCategory, string> = {
      全部学校: '宿务全部学校',
      雅思名校: '宿务雅思名校',
      斯巴达管理: '宿务斯巴达管理学校',
      高性价比: '宿务高性价比学校',
      亲子友好: '宿务亲子友好学校',
    };

    return headings[this.activeDirectoryFilter];
  }

  get directoryDescription(): string {
    return this.activeDirectoryFilter === '全部学校'
      ? '热门与咨询度较高的学校优先展示；封面角标看校区或管理定位，下方标签看核心课程'
      : `已按「${this.activeDirectoryFilter}」整理学校；封面角标看校区或管理定位，下方标签看核心课程`;
  }

  get visibleSchools(): DirectorySchool[] {
    const activeFilter = this.activeDirectoryFilter;
    const schools = activeFilter === '全部学校'
      ? this.allSchools
      : this.allSchools.filter((school) => this.directoryCategorySchools[activeFilter].includes(school.name));

    const displayOrder = activeFilter === '全部学校'
      ? this.directoryPopularityOrder
      : this.directoryCategorySchools[activeFilter];

    return [...schools].sort((a, b) => {
      const aRank = displayOrder.indexOf(a.name);
      const bRank = displayOrder.indexOf(b.name);
      return (aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank) - (bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank);
    });
  }

  directoryFilterCount(category: DirectoryCategory): number {
    return category === '全部学校'
      ? this.allSchools.length
      : this.allSchools.filter((school) => this.directoryCategorySchools[category].includes(school.name)).length;
  }

  showDirectoryCategory(category: Exclude<DirectoryCategory, '全部学校'>): void {
    this.activeDirectoryFilter = category;
    window.setTimeout(() => {
      document.getElementById('all-schools')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  handleSchoolImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/assets/study-hero-collage.png')) {
      image.src = '/assets/study-hero-collage.png';
    }
  }

  readonly advisors: Advisor[] = [
    {
      name: 'Penin',
      focus: '菲律宾与东南亚',
      text: '宿务选校、课程报价与入学安排',
      avatar: '/assets/contact/penin-avatar.jpg',
      qr: '/assets/contact/penin-wechat-qr.png',
      phone: '15367659331',
      phoneDisplay: '153 6765 9331',
    },
    {
      name: 'Lemon',
      focus: '多国家方案规划',
      text: '费用、时间与升学路径综合比较',
      avatar: '/assets/contact/lemon-avatar.jpg',
      qr: '/assets/contact/lemon-wechat-qr.png',
      phone: '13298529856',
      phoneDisplay: '132 9852 9856',
    },
    {
      name: 'Jenny',
      focus: '英爱留学规划',
      text: '英语提升与英爱升学路径衔接',
      avatar: '/assets/contact/jenny-avatar.jpg',
      qr: '/assets/contact/jenny-wechat-qr.png',
      phone: '13249827686',
      phoneDisplay: '132 4982 7686',
    },
  ];
}
