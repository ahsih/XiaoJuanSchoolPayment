import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

type GalleryCategory = '全部' | '城市与校园' | '住宿' | '设施';

interface PiaCourseOption {
  id: string;
  name: string;
  type: string;
  lessons: string;
  tuition4Weeks: number;
}

interface PiaRoomOption {
  id: string;
  name: string;
  occupancy: string;
  fee4Weeks: number;
}

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
}

@Component({
  selector: 'app-pia-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './pia-school-cia.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    './pia-school-cia.component.css',
  ],
})
export class PiaSchoolComponent {
  readonly registrationFee = 100;

  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'esl-exam-1';
  selectedRoomId = 'triple';
  selectedStartDate = '';
  quoteCalculated = false;

  readonly courseOptions: PiaCourseOption[] = [
    {
      id: 'esl-exam-1',
      name: 'ESL / 考试课程 1',
      type: '基础综合',
      lessons: '一对一4节 + 小组课2节',
      tuition4Weeks: 615,
    },
    {
      id: 'esl-exam-2',
      name: 'ESL / 考试课程 2',
      type: '标准综合',
      lessons: '一对一4节 + 小组课3节',
      tuition4Weeks: 692,
    },
    {
      id: 'esl-exam-3',
      name: 'ESL / 考试课程 3',
      type: '强化综合',
      lessons: '一对一4节 + 小组课4节',
      tuition4Weeks: 769,
    },
    {
      id: 'complete-exam',
      name: 'ESL / 完整考试课程',
      type: '完整考试路线',
      lessons: '一对一6节 + 小组课2节',
      tuition4Weeks: 846,
    },
    {
      id: 'power-speaking-a',
      name: 'Power Speaking A',
      type: '口语强化',
      lessons: '一对一6节',
      tuition4Weeks: 769,
    },
    {
      id: 'power-speaking-b',
      name: 'Power Speaking B',
      type: '口语高强度',
      lessons: '一对一7节',
      tuition4Weeks: 885,
    },
    {
      id: 'power-speaking-c',
      name: 'Power Speaking C',
      type: '口语最高强度',
      lessons: '一对一8节',
      tuition4Weeks: 1000,
    },
    {
      id: 'guardian',
      name: '监护人课程',
      type: '亲子陪读',
      lessons: '一对一4节',
      tuition4Weeks: 462,
    },
    {
      id: 'junior',
      name: '青少年课程',
      type: '亲子青少年',
      lessons: '一对一4节',
      tuition4Weeks: 538,
    },
  ];

  readonly roomOptions: PiaRoomOption[] = [
    { id: 'single', name: '校外合作酒店单人间', occupancy: '1人房', fee4Weeks: 923 },
    { id: 'double', name: '校外合作酒店双人间', occupancy: '2人房', fee4Weeks: 692 },
    { id: 'triple', name: '校外合作酒店三人间', occupancy: '3人房', fee4Weeks: 615 },
  ];

  readonly galleryCategories: GalleryCategory[] = [
    '全部',
    '城市与校园',
    '住宿',
    '设施',
  ];

  readonly quickInfo = [
    {
      icon: 'location_on',
      label: '所在地区',
      value: 'Iloilo Business Park',
      note: '商场、医院、餐饮与生活设施集中。',
    },
    {
      icon: 'history',
      label: '办学时间',
      value: '2012年开办',
      note: '学校与公寓于2023年完成更新。',
    },
    {
      icon: 'groups',
      label: '学校容量',
      value: '约100人',
      note: '官方说明容量包含追加教学场地。',
    },
    {
      icon: 'meeting_room',
      label: '教室配置',
      value: '36间一对一教室',
      note: '另有8间小组课教室。',
    },
    {
      icon: 'record_voice_over',
      label: '教师规模',
      value: '86名教师',
      note: '从初级到高级均由认证教师授课。',
    },
    {
      icon: 'verified',
      label: '学校许可',
      value: 'TESDA / SSP',
      note: '官网展示相关培训与办学许可资料。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '城市与校园',
      title: 'Iloilo Business Park生活圈',
      description: 'PIA位于城市商业区，Festive Walk、餐饮与日常生活配套集中。',
      src: 'https://cdn.imweb.me/thumbnail/20230830/164e4d6d64073.jpg',
    },
    {
      category: '城市与校园',
      title: '校区周边鸟瞰',
      description: '从空中可看到商场、街区与公寓集中在同一生活圈。',
      src: 'https://cdn.imweb.me/thumbnail/20230820/10fc767ee1547.jpg',
    },
    {
      category: '城市与校园',
      title: 'Saint Honore公寓外观',
      description: 'PIA官网展示的2023年新公寓，采用门禁与大堂管理。',
      src: 'https://cdn.imweb.me/thumbnail/20230903/9a0c5f67d2ada.jpg',
    },
    {
      category: '设施',
      title: '公寓大堂',
      description: '大堂设有前台与门禁，只有获准人员可进入。',
      src: 'https://cdn.imweb.me/thumbnail/20231227/422dc096c2b1c.jpg',
    },
    {
      category: '设施',
      title: '大堂休息区',
      description: '公寓公共空间明亮，适合会面与短暂休息。',
      src: 'https://cdn.imweb.me/thumbnail/20231227/f8c880605a6af.jpg',
    },
    {
      category: '住宿',
      title: '双人房示例',
      description: '官网住宿示例配有个人床位、书桌、座椅、台灯与收纳空间。',
      src: 'https://cdn.imweb.me/thumbnail/20230823/16c9a8a088a5a.jpg',
    },
    {
      category: '住宿',
      title: '个人学习空间',
      description: '床位旁设置书桌与照明，便于下课后复习。',
      src: 'https://cdn.imweb.me/thumbnail/20230823/ddd1d1ec532d0.jpg',
    },
    {
      category: '住宿',
      title: '房内厨房',
      description: '官网列有冰箱、微波炉、炉具、煮饭设备与洗衣机等，具体以房间为准。',
      src: 'https://cdn.imweb.me/thumbnail/20230823/71779ba051ab2.jpg',
    },
    {
      category: '住宿',
      title: '家庭房示例',
      description: '部分英语营和家庭安排可使用多人房，实际床型需按档期确认。',
      src: 'https://cdn.imweb.me/thumbnail/20231227/118b5abc82835.jpg',
    },
    {
      category: '设施',
      title: '公寓泳池',
      description: '公寓社区内设泳池，可作为课后休息与活动空间。',
      src: 'https://cdn.imweb.me/thumbnail/20231227/425878d838640.jpg',
    },
    {
      category: '设施',
      title: '泳池休闲区',
      description: '泳池与公寓公共区域相连，官网同时列有健身房和游戏室。',
      src: 'https://cdn.imweb.me/thumbnail/20231227/9c6c86a85e680.jpg',
    },
    {
      category: '住宿',
      title: '房间露台',
      description: '部分房型带露台桌椅；住宿设备可能因房间而异。',
      src: 'https://cdn.imweb.me/thumbnail/20230823/dce6a067de153.jpg',
    },
  ];

  readonly basicInfo = [
    { label: '学校全称', value: 'Polyglot International Academy（PIA）' },
    { label: '开办 / 更新', value: '2012年开办，2023年更新校舍与公寓' },
    { label: '学校容量', value: '约100人（包含追加教学场地）' },
    { label: '教室', value: '36间一对一教室、8间小组教室' },
    { label: '团队', value: '官网列出86名教师、100名工作人员' },
    {
      label: '官方住宿',
      value: 'Saint Honore公寓以双人房为标准，部分营期可安排3至4人',
    },
    {
      label: '公共设施',
      value: '泳池、健身房、游戏室、儿童房、理疗/按摩空间',
    },
    {
      label: '周边环境',
      value: '医院、商场、文化设施与餐饮区约10分钟步行范围',
    },
  ];

  readonly highlights = [
    {
      image: 'https://cdn.imweb.me/thumbnail/20230830/164e4d6d64073.jpg',
      title: '城市生活便利',
      text: '位于Iloilo Business Park，适合重视安全感、商场与餐饮便利的学生。',
    },
    {
      image: 'https://cdn.imweb.me/thumbnail/20230903/9a0c5f67d2ada.jpg',
      title: '2023年更新环境',
      text: '学校与公寓在2023年更新开放，住宿采用门禁管理。',
    },
    {
      image: 'https://cdn.imweb.me/thumbnail/20230823/16c9a8a088a5a.jpg',
      title: '住宿口径分开核对',
      text: '官网展示公寓环境；本页价目表的校外合作酒店房型按所附价格保留。',
    },
  ];

  readonly suitableFor = [
    {
      title: '想住在城市生活圈',
      text: '希望步行可到商场、医院、餐饮与日常设施。',
    },
    {
      title: '重视一对一课程',
      text: 'ESL、考试、Power Speaking都能选择较高的一对一课量。',
    },
    {
      title: '亲子同行家庭',
      text: '价目表提供Junior与Guardian路线，便于一起规划。',
    },
    {
      title: '想兼顾学习与生活',
      text: '公寓配套较完整，课后可使用泳池、健身与休闲设施。',
    },
  ];

  readonly notSuitableFor = [
    {
      title: '只接受封闭式高压管理',
      text: 'PIA更强调舒适英语环境，管理风格需与顾问再确认。',
    },
    {
      title: '不想核对住宿版本',
      text: '官方公寓与价目表中的合作酒店是两套口径，报名时必须确认实际安排。',
    },
    {
      title: '只看前期美元价格',
      text: 'SSP、签证、教材、水电、押金和接机等当地费用需另计。',
    },
    {
      title: '临近出发才订房',
      text: '房型与营期安排受空位影响，建议先确认入学日。',
    },
  ];

  readonly localFees = [
    {
      item: 'Iloilo机场接机',
      amount: 'PHP 1,200',
      note: 'PIA官方课程页公开参考。',
    },
    {
      item: '教材',
      amount: 'PHP 300–500 / 本',
      note: '按入学等级与实际用书结算。',
    },
    { item: 'ID卡', amount: 'PHP 500', note: '进出住宿与学校所需。' },
    {
      item: '住宿押金',
      amount: 'PHP 5,000',
      note: '退房时扣除损坏或遗失后返还。',
    },
    {
      item: '住宿管理费',
      amount: 'PHP 500 / 周',
      note: '官网列明的住宿维护费用。',
    },
    { item: '水电费', amount: '按使用量', note: '按房间计量并以比索支付。' },
    {
      item: 'SSP',
      amount: 'PHP 7,000',
      note: '官网另列E-SSP PHP 4,000。',
    },
    {
      item: '签证延长',
      amount: '按停留时间',
      note: '8周以上开始产生，正式金额报名时确认。',
    },
  ];

  readonly sources = [
    {
      label: 'PIA英文官网 · About PIA',
      url: 'https://iloilopiaen.imweb.me/about_pia',
    },
    {
      label: 'PIA英文官网 · Curriculum & Cost',
      url: 'https://iloilopiaen.imweb.me/curriculum',
    },
    {
      label: 'PIA英文官网 · Facility',
      url: 'https://iloilopiaen.imweb.me/facility',
    },
  ];

  readonly sideNav = [
    { label: '校园图片', target: 'gallery', icon: 'photo_library' },
    { label: '学校资料', target: 'basic-info', icon: 'domain' },
    { label: '适合人群', target: 'fit', icon: 'person_search' },
    { label: '课程介绍', target: 'courses', icon: 'menu_book' },
    { label: '费用计算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
    { label: '资料来源', target: 'sources', icon: 'fact_check' },
  ];

  readonly mobileAnchors = this.sideNav.slice(0, 6);

  readonly faqs = [
    {
      question: 'PIA和其他伊洛伊洛学校有什么区别？',
      answer:
        'PIA位于Iloilo Business Park，强调城市生活便利、较多一对一课程，以及2023年更新的学校和公寓环境。',
    },
    {
      question: '为什么页面图片是公寓，但价格写校外合作酒店？',
      answer:
        '图片来自PIA当前官网的Saint Honore公寓介绍；你提供的2024价目表明确把单、双、三人房标为校外合作酒店。本页保留价格原文，并提醒报名时确认实际住宿安排。',
    },
    {
      question: 'Power Speaking和ESL有什么不同？',
      answer:
        'Power Speaking只安排一对一课程，共6至8节；ESL和考试路线会搭配一对一与小组课。',
    },
    {
      question: '计算结果包含所有费用吗？',
      answer:
        '不包含。计算器只加入4周课程费、4周住宿费与USD 100注册费；当地费用、机票、保险等需另计。',
    },
  ];

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter(
          (image) => image.category === this.selectedGalleryCategory,
        );
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(target: string, event: Event): void {
    event.preventDefault();
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  }

  get selectedCourse(): PiaCourseOption {
    return (
      this.courseOptions.find((course) => course.id === this.selectedCourseId) ??
      this.courseOptions[0]
    );
  }

  get selectedRoom(): PiaRoomOption {
    return (
      this.roomOptions.find((room) => room.id === this.selectedRoomId) ??
      this.roomOptions[0]
    );
  }

  get tuitionAndRoomTotal(): number {
    return this.selectedCourse.tuition4Weeks + this.selectedRoom.fee4Weeks;
  }

  get quoteTotal(): number {
    return this.tuitionAndRoomTotal + this.registrationFee;
  }

  formatUsd(amount: number): string {
    return amount.toLocaleString('en-US');
  }
}
