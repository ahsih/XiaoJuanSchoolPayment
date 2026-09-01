import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ScrollToDirective } from '../../directives/scroll-to.directive';

export type CityCardTone = 'green' | 'orange' | 'violet' | 'blue' | 'teal' | 'navy';

export interface CityStudyStat {
  value: string;
  label: string;
  icon?: string;
}

export interface CityStudySelectionGroup {
  icon: string;
  iconAsset?: string;
  iconCopies?: 2;
  iconEmoji?: string;
  title: string;
  subtitle: string;
  category: string;
  tone: CityCardTone;
  image: string;
  schools: string[];
}

export interface CityStudyFeaturedSchool {
  name: string;
  badge: string;
  tone: CityCardTone;
  image: string;
  route: string;
  description: string;
  tags: string[];
}

export interface CityStudyLifestyleItem {
  icon: string;
  title: string;
  text: string;
  image: string;
}

export interface CityStudyDirectorySchool {
  name: string;
  route: string;
  tag: string;
  location: string;
  summary: string;
  image: string;
  imagePosition?: string;
  highlights: string[];
  categories: string[];
  linkLabel?: string;
}

export interface CityStudyFaq {
  question: string;
  answer: string;
}

export interface CityStudyPageConfig {
  cityName: string;
  englishName: string;
  breadcrumbLabel: string;
  heroKicker: string;
  heroKickerIcon?: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroStudyImage: string;
  heroLessonImage: string;
  heroVisualLabel: string;
  benefitChips: { icon: string; label: string }[];
  stats: CityStudyStat[];
  selectionTitle?: string;
  selectionSubtitle?: string;
  selectionGroups: CityStudySelectionGroup[];
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredSchools: CityStudyFeaturedSchool[];
  schoolPreviewNames: string[];
  lifestyleTitle: string;
  lifestyleSubtitle: string;
  lifestyleItems: CityStudyLifestyleItem[];
  directoryEyebrow: string;
  directoryTitle: string;
  directorySubtitle: string;
  directoryCategories: { label: string; icon: string }[];
  directorySchools: CityStudyDirectorySchool[];
  faqs: CityStudyFaq[];
}

export interface CityStudySourceProfile {
  name: string;
  shortName?: string;
  image: string;
  location: string;
  style: string;
  route?: string;
  courses: string[];
  bestFor: string;
  categories?: string[];
}

export interface CityStudyPageSource {
  cityName: string;
  englishName: string;
  heroKicker: string;
  heroKickerIcon?: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroStudyImage: string;
  heroLessonImage: string;
  heroVisualLabel: string;
  benefitChips: { icon: string; label: string }[];
  stats: CityStudyStat[];
  schoolTypes: { title: string; tag: string; text: string; examples?: string; icon?: string }[];
  schoolProfiles: CityStudySourceProfile[];
  highlights: { icon: string; title: string; text: string }[];
  selectionImages: string[];
  lifestyleImages: string[];
  faqs: CityStudyFaq[];
  featuredTitle?: string;
  featuredSubtitle?: string;
  lifestyleTitle: string;
  lifestyleSubtitle: string;
}

const selectionTones: CityCardTone[] = ['green', 'violet', 'orange', 'blue'];
const featuredTones: CityCardTone[] = ['green', 'violet', 'teal', 'navy', 'orange'];
const fallbackIcons = ['workspace_premium', 'shield', 'thumb_up', 'family_restroom'];

const selectionVisual = (
  title: string,
  fallbackIcon: string,
): Pick<CityStudySelectionGroup, 'icon' | 'iconAsset' | 'iconCopies' | 'iconEmoji'> => {
  if (/斯巴达|强化管理|严格管理|高强度/.test(title)) {
    return {
      icon: 'military_tech',
      iconAsset: '/assets/philippines/sparta-soldier-icon.png',
      iconCopies: 2,
    };
  }

  if (/亲子|家庭|低龄|青少年/.test(title)) {
    return { icon: 'family_restroom', iconEmoji: '👨‍👩‍👧' };
  }

  if (/性价比|预算|成本|经济/.test(title)) {
    return { icon: 'savings', iconEmoji: '💰' };
  }

  if (/雅思/.test(title)) {
    return {
      icon: 'verified',
      iconAsset: '/assets/cia/course-video-posters/idp-ielts.png',
    };
  }

  return { icon: fallbackIcon };
};

export function createCityStudyPage(source: CityStudyPageSource): CityStudyPageConfig {
  const shortName = (profile: CityStudySourceProfile): string =>
    profile.shortName ||
    profile.name
      .replace(`菲律宾${source.cityName}`, '')
      .replace(/语言学校/g, '')
      .replace(/学校$/g, '')
      .trim();

  const exampleNames = (examples = ''): string[] =>
    examples
      .split(/[、，,]/)
      .map((name) => name.trim())
      .filter(Boolean);

  const compactStyle = (style: string): string => {
    const firstPhrase = style.split(/[，,]/)[0].trim();
    return firstPhrase.length > 18 ? `${firstPhrase.slice(0, 18)}…` : firstPhrase;
  };

  const categoryForProfile = (profile: CityStudySourceProfile, index: number): string[] => {
    if (profile.categories?.length) {
      return profile.categories;
    }

    const matches = source.schoolTypes
      .filter((type) => {
        const examples = type.examples || '';
        return examples.includes(profile.name) || examples.includes(shortName(profile));
      })
      .map((type) => type.title);

    return matches.length ? matches : [source.schoolTypes[index % source.schoolTypes.length].title];
  };

  const directorySchools: CityStudyDirectorySchool[] = source.schoolProfiles.map((profile, index) => ({
    name: shortName(profile),
    route: profile.route || '/about-sida/contact',
    tag: compactStyle(profile.style),
    location: profile.location,
    summary: profile.bestFor,
    image: profile.image,
    highlights: profile.courses.slice(0, 5),
    categories: categoryForProfile(profile, index),
  }));

  return {
    cityName: source.cityName,
    englishName: source.englishName,
    breadcrumbLabel: `${source.cityName} ${source.englishName}`,
    heroKicker: source.heroKicker,
    heroKickerIcon: source.heroKickerIcon,
    heroSubtitle: source.heroSubtitle,
    heroDescription: source.heroDescription,
    heroImage: source.heroImage,
    heroImageAlt: source.heroImageAlt,
    heroStudyImage: source.heroStudyImage,
    heroLessonImage: source.heroLessonImage,
    heroVisualLabel: source.heroVisualLabel,
    benefitChips: source.benefitChips,
    stats: source.stats,
    selectionGroups: source.schoolTypes.slice(0, 4).map((type, index) => ({
      ...selectionVisual(type.title, type.icon || fallbackIcons[index]),
      title: type.title,
      subtitle: type.text,
      category: type.title,
      tone: selectionTones[index],
      image: source.selectionImages[index % source.selectionImages.length],
      schools: exampleNames(type.examples).slice(0, 10),
    })),
    featuredTitle: source.featuredTitle,
    featuredSubtitle: source.featuredSubtitle,
    featuredSchools: source.schoolProfiles.slice(0, 5).map((profile, index) => ({
      name: shortName(profile),
      badge: compactStyle(profile.style),
      tone: featuredTones[index],
      image: profile.image,
      route: profile.route || '/about-sida/contact',
      description: profile.bestFor,
      tags: profile.courses.slice(0, 3),
    })),
    schoolPreviewNames: directorySchools.slice(5, 11).map((school) => school.name),
    lifestyleTitle: source.lifestyleTitle,
    lifestyleSubtitle: source.lifestyleSubtitle,
    lifestyleItems: source.highlights.slice(0, 5).map((item, index) => ({
      ...item,
      image: source.lifestyleImages[index % source.lifestyleImages.length],
    })),
    directoryEyebrow: `${source.englishName.toUpperCase()} SCHOOL DIRECTORY`,
    directoryTitle: `${source.cityName}全部学校`,
    directorySubtitle: '热门与咨询度较高的学校优先展示；点击学校卡片可查看课程、住宿、费用说明与自动报价。',
    directoryCategories: [
      { label: '全部学校', icon: 'grid_view' },
      ...source.schoolTypes.slice(0, 4).map((type, index) => ({
        label: type.title,
        icon: selectionVisual(type.title, type.icon || fallbackIcons[index]).icon,
      })),
    ],
    directorySchools,
    faqs: source.faqs,
  };
}

interface ServiceItem {
  icon: string;
  title: string;
  text: string;
  image?: string;
  iconAsset?: string;
  alt?: string;
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
  selector: 'app-philippines-city-study-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ScrollToDirective],
  templateUrl: './philippines-city-study-layout.component.html',
  styleUrl: './philippines-city-study-layout.component.css',
})
export class PhilippinesCityStudyLayoutComponent {
  @Input({ required: true }) page!: CityStudyPageConfig;

  activeDirectoryFilter = '全部学校';

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
      title: '菲律宾当地支持',
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
      iconAsset: '/assets/philippines/service-price-guarantee.svg',
      alt: '保价承诺图标',
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
      text: '菲律宾课程结束回国后，继续报名线上一对一英语课，可享老学员专属价格，让英语学习不断档。',
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

  readonly advisors: Advisor[] = [
    {
      name: 'Penin',
      focus: '菲律宾与东南亚',
      text: '菲律宾选校、课程报价与入学安排',
      avatar: '/assets/contact/penin-avatar.jpg',
      qr: '/assets/contact/penin-wechat-qr.png',
      phone: '15367659331',
      phoneDisplay: '153 6765 9331',
    },
    {
      name: 'Lemon',
      focus: '多国家方案规划',
      text: '费用、时间与升学路径综合比较',
      avatar: '/assets/contact/lemon-avatar.jpg?v=20260901',
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

  get visibleSchools(): CityStudyDirectorySchool[] {
    if (this.activeDirectoryFilter === '全部学校') {
      return this.page.directorySchools;
    }

    return this.page.directorySchools.filter((school) =>
      school.categories.includes(this.activeDirectoryFilter),
    );
  }

  get directoryHeading(): string {
    return this.activeDirectoryFilter === '全部学校'
      ? this.page.directoryTitle
      : `${this.activeDirectoryFilter}学校`;
  }

  get directoryDescription(): string {
    return this.activeDirectoryFilter === '全部学校'
      ? this.page.directorySubtitle
      : `已按「${this.activeDirectoryFilter}」筛选；点击学校卡片可查看完整课程、住宿与自动报价。`;
  }

  directoryFilterCount(category: string): number {
    return category === '全部学校'
      ? this.page.directorySchools.length
      : this.page.directorySchools.filter((school) => school.categories.includes(category)).length;
  }

  showDirectoryCategory(category: string): void {
    this.activeDirectoryFilter = category;
    window.setTimeout(() => {
      const directory = document.getElementById('all-schools');
      if (!directory) {
        return;
      }

      const headerOffset = window.innerWidth <= 620 ? 82 : 74;
      const scrollTop = directory.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    });
  }

  heroBackground(image: string): string {
    return `linear-gradient(rgba(255,255,255,.02), rgba(255,255,255,.02)), url("${image}") center / cover no-repeat`;
  }

  handleSchoolImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/assets/study-hero-collage.png')) {
      image.src = '/assets/study-hero-collage.png';
    }
  }
}
