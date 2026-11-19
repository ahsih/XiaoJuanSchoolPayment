// The CIA page: the shared Philippine school page filled with CIA's profile and quote.
// CIA-only members below (legacy lists, 2026/2027 price helpers, discount totals) stay for the
// specs and the database price merge; the page template does not read them.
import { Component } from '@angular/core';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import type { CiaContentConfig } from './cia-content-config';
import type {
  CampusMonthlyEvent,
  CourseFee,
  CourseItem,
  Highlight,
  LocalFee,
  ProcessStep,
  QuickInfo,
  ScheduleItem,
  SideNavItem,
} from './cia-page-content';
import { CIA_COURSE_FEE_DETAILS, CIA_PAGE_PROFILE } from './cia-page-profile';
import { CiaPlanComparison } from './cia-plan-compare';
import { CiaQuote } from './cia-quote-engine';
import type { CiaStudentQuote } from './cia-student-quote';

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: PH_SCHOOL_PAGE_IMPORTS,
  templateUrl: '../school-page/ph-school-page.component.html',
  styleUrls: [
    '../school-page/ph-school-page.component.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    '../school-page/ph-school-page-redesign.css',
    '../school-page/ph-school-page-options.css',
  ],
})
export class CiaSchoolComponent extends PhSchoolPageComponent<CiaStudentQuote> {
  protected override getProfile(): PhSchoolProfile { return CIA_PAGE_PROFILE; }
  protected override createQuote(): CiaQuote { return new CiaQuote(this); }
  protected override createComparison(): CiaPlanComparison {
    return new CiaPlanComparison(this, () => this.students[0]);
  }
  private get ciaQuote(): CiaQuote { return this.quote as CiaQuote; }

  private readonly courseFeeOrder = [
    'regular-esl',
    'intensive-esl',
    'power-intensive',
    'pre-toeic',
    'toeic-regular',
    'toeic-guarantee',
    'pre-ielts',
    'ielts-regular',
    'ielts-guarantee',
    'business',
    'working-holiday',
    'callan-esl',
    'college-immersion',
  ];
  private readonly roomFeeOrder = [
    'p1',
    's1',
    'pn1',
    'd2',
    'd3',
    'd4',
    'sr1',
    'sr2',
    'sr3',
    'sr4',
  ];
  private readonly courseFeeDetails = CIA_COURSE_FEE_DETAILS;

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'apartment',
      label: '学校类型',
      value: '宿务麦克坦度假型校区',
      note: '半斯巴达管理',
    },
    {
      icon: 'groups',
      label: '适合人群',
      value: '15岁以上学生',
      note: '短期游学、备考、亲子和成人',
    },
    {
      icon: 'verified_user',
      label: '管理模式',
      value: '半斯巴达',
      note: '每日测试、门禁、出勤管理',
    },
    {
      icon: 'school',
      label: '课程选项',
      value: 'ESL / 考试 / 职场英语',
      note: '另有 Cambridge、Callan、大学沉浸与假期项目',
    },
    {
      icon: 'bed',
      label: '住宿房型',
      value: '单人到四人间',
      note: '校内住宿，热门房型需早确认',
    },
    {
      icon: 'event_available',
      label: '年龄要求',
      value: '15岁以上',
      note: '未成年学生建议提前确认监护安排',
    },
  ];


  readonly highlights: Highlight[] = [
    {
      image: 'assets/cia/quad-room.webp',
      title: '预算房型清楚',
      text: '四人间 D-4 是默认预算参考，适合先估算总费用。',
    },
    {
      image: 'assets/cia/campus-building.webp',
      title: '校内生活集中',
      text: '上课、住宿、餐厅和设施都在同一校区，适合第一次游学。',
    },
    {
      image: 'assets/cia/one-to-one-class.webp',
      title: '一对一比例高',
      text: 'ESL、考试和商务方向都能搭配一对一课程。',
    },
    {
      image: 'assets/cia/dining-hall.webp',
      title: '生活配套成熟',
      text: '餐厅、健身房、泳池、医务和学生服务都比较完整。',
    },
  ];


  readonly courses: CourseItem[] = [
    {
      name: 'Regular ESL / Light ESL',
      type: '综合英语 / 可申请轻量课表',
      lessons: '4节一对一 + 小组、中组、大组、选修、写作与自习',
      suitable: '适合第一次游学、希望稳步提升听说读写，或需要较灵活课表的学生。',
      icon: 'school',
    },
    {
      name: 'Intensive ESL',
      type: '强化英语',
      lessons: '5节一对一 + 小组、中组、选修、写作与自习',
      suitable: '适合短期想加强口语表达和老师纠音的学生。',
      icon: 'menu_book',
    },
    {
      name: 'Power Intensive',
      type: '高强度一对一',
      lessons: '6节一对一 + 小组、选修、写作与自习',
      suitable: '适合4周左右集中突破口语、听力和表达的学生。',
      icon: 'psychology',
    },
    {
      name: 'Pre / Regular IELTS',
      type: '雅思预备与常规备考',
      lessons: '雅思一对一4节 + Clinic中组2节 + 小组、选修、写作与自习',
      suitable: 'Pre 无入学分数要求；Regular 建议雅思3.5分以上。',
      icon: 'edit_note',
    },
    {
      name: 'IELTS Guarantee',
      type: '雅思保证班',
      lessons: '12周课程 + 周一至周三强化晚课 + 每周四模考',
      suitable: '适合目标明确、能接受严格出勤和模考要求的学生。',
      icon: 'workspace_premium',
    },
    {
      name: 'Pre / Regular / Guarantee TOEIC',
      type: '托业预备、常规与保证班',
      lessons: '托业一对一4节 + Clinic中组2节 + 小组、选修、写作与自习',
      suitable: '适合求职、升学或有600–900分目标的学生。',
      icon: 'verified',
    },
    {
      name: 'Business',
      type: '商务英语',
      lessons: '商务一对一5节 + 商务小组、综合中组、选修、写作与自习',
      suitable: '适合职场人士或准备英文工作场景的学生。',
      icon: 'business_center',
    },
    {
      name: 'Working Holiday',
      type: '打工度假英语',
      lessons: '生存英语、求职准备、面试表达和海外生活沟通',
      suitable: '适合准备海外生活、打工度假或长线旅行的人群。',
      icon: 'travel_explore',
    },
    {
      name: 'Callan ESL',
      type: '快速口语反应训练',
      lessons: '3节Callan一对一 + 2节ESL一对一 + 小组、选修、写作与自习',
      suitable: '适合想通过高频问答、即时纠错和重复训练加快英语反应的学生。',
      icon: 'record_voice_over',
    },
    {
      name: 'College Immersion（IAU）',
      type: 'IAU航空大学沉浸课程',
      lessons: 'ESL一对一4节 + 小组、中组、大组、选修、写作与自习',
      suitable: '想旁听IAU航空大学课程的学生应选择这一项；不是在Regular ESL上另加一节选修课。',
      icon: 'account_balance',
    },
  ];


  readonly campusMonthlyEvents2026: CampusMonthlyEvent[] = [
    { month: 1, icon: 'festival', title: '菲律宾文化节', text: '通过节庆主题活动认识菲律宾文化。', image: 'assets/cia/events-2026/01-cultural-festival.webp', imageAlt: 'CIA菲律宾文化节传统服饰表演', imagePosition: 'center 24%' },
    { month: 2, icon: 'favorite', title: '情人节特别活动', text: '校园主题互动与水果派对。', image: 'assets/cia/events-2026/02-valentine-fruit-party.webp', imageAlt: 'CIA情人节特别活动现场互动', imagePosition: 'center 30%' },
    { month: 3, icon: 'notifications_active', title: '金铃挑战赛', text: '结合各国文化服饰的趣味竞赛。', image: 'assets/cia/events-2026/03-golden-bell.webp', imageAlt: 'CIA金铃挑战赛参赛学生', imagePosition: 'center 28%' },
    { month: 4, icon: 'water', title: '夏日泡沫派对', text: '融入宋干节元素的夏日水上活动。', image: 'assets/cia/events-2026/04-summer-splash.webp', imageAlt: 'CIA夏日泡沫派对合影', imagePosition: 'center 34%' },
    { month: 5, icon: 'sports_basketball', title: 'CIA篮球赛', text: '在真实篮球比赛中以团队协作增进交流。', image: 'assets/cia/activity-sportsfest-official.webp', imageAlt: 'CIA校园篮球比赛实景', imagePosition: 'center 34%' },
    { month: 6, icon: 'mic', title: '开放麦克风与校庆', text: '开放舞台，并庆祝CIA创校周年。', image: 'assets/cia/events-2026/06-open-mic.webp', imageAlt: 'CIA开放麦克风比赛现场' },
    { month: 7, icon: 'music_note', title: 'CIA达人秀', text: '学生展示音乐、舞蹈与个人才艺。', image: 'assets/cia/events-2026/07-got-talent.webp', imageAlt: 'CIA达人秀学生舞台表演' },
    { month: 8, icon: 'styler', title: 'CIA校园风采活动', text: 'Mr. & Ms. CIA主题校园活动。', image: 'assets/cia/events-2026/08-mr-ms-cia.webp', imageAlt: 'Mr. and Ms. CIA校园风采活动合影' },
    { month: 9, icon: 'diversity_3', title: '世界文化舞蹈', text: '用舞蹈认识不同国家与文化。', image: 'assets/cia/events-2026/09-dances-around-world.webp', imageAlt: 'CIA世界文化舞蹈表演' },
    { month: 10, icon: 'celebration', title: '万圣节派对与员工日', text: '节日装扮、互动游戏与校园庆祝。', image: 'assets/cia/events-2026/10-halloween.webp', imageAlt: 'CIA万圣节服装活动舞台现场' },
    { month: 11, icon: 'public', title: 'CIA国际文化日', text: '各国学生参与文化展示与美食节。', image: 'assets/cia/events-2026/11-national-day.webp', imageAlt: 'CIA国际文化日学生展示现场' },
    { month: 12, icon: 'card_giftcard', title: 'CIA圣诞派对', text: '以圣诞主题活动为全年校园生活收尾。', image: 'assets/cia/events-2026/12-white-christmas.webp', imageAlt: 'CIA白色圣诞主题舞台活动' },
  ];


  readonly schedule: ScheduleItem[] = [
    {
      time: '06:40 - 08:00',
      title: '早餐与晨间测试',
      text: '早餐时段为06:40–08:00；周一至周四07:20–08:00进行单词或课程测试。',
    },
    {
      time: '08:00 - 12:05',
      title: '上午课程',
      text: '一对一、小组课或考试专项课，按课程表安排。',
    },
    {
      time: '12:05 - 13:05',
      title: '午餐与休息',
      text: '校内餐厅用餐，下午课程前整理学习资料。',
    },
    {
      time: '13:05 - 15:30',
      title: '下午课程',
      text: '小组课、专项训练、口语或语法词汇课程。',
    },
    {
      time: '15:35 - 18:00',
      title: '下午课程、写作与自习',
      text: '继续一对一、团体或选修课程，并按所选课程完成写作和自习。',
    },
    {
      time: '18:00 - 22:00',
      title: '晚餐与自由时间',
      text: '18:00–19:00晚餐，19:00–22:00自由活动；保证班另有指定晚间学习安排。',
    },
    {
      time: '周五 17:10 - 18:00',
      title: '演讲、朗读或月度活动',
      text: '周五采用40分钟课节，下午安排演讲/朗读比赛或每月大型活动。',
    },
  ];


  localFees: LocalFee[] = [
    { item: 'SSP', amount: '8,000比索', note: '无菲律宾长期签证者需办理' },
    { item: 'SSP E-card', amount: '4,500比索', note: '办理SSP时同时办理' },
    { item: '综合管理费', amount: '4,000比索', note: '每4周 / 人' },
    { item: '水费', amount: '1,000比索', note: '每4周参考' },
    { item: '电费', amount: '2,000比索', note: '每4周基础额度，超额按当地电价另计' },
    { item: '教材费', amount: '2,000比索', note: '每套约使用8周，按课程及进度调整' },
    { item: '照片费', amount: '200比索', note: '一次性费用' },
    { item: '房间押金', amount: '2,500比索', note: '退房检查后按学校规定退还' },
    { item: '周末接机', amount: '1,000比索', note: '宿务机场接机' },
    { item: '工作日接机', amount: '1,500比索', note: '宿务机场接机' },
    {
      item: 'ACR I-card',
      amount: '4,500比索',
      note: '长期学习或延签时可能需要',
    },
  ];

  readonly serviceSteps: ProcessStep[] = [
    {
      icon: 'person_search',
      title: '确认是否适合',
      text: '先了解学习目标、预算、房型偏好、年龄和入学时间，判断 CIA 是否匹配。',
    },
    {
      icon: 'fact_check',
      title: '确认课程、空房和优惠',
      text: '免费协助确认课程、房型、空房、优惠和正式报价，避免只按网页价格做决定。',
    },
    {
      icon: 'assignment_turned_in',
      title: '协助入境和签证手续',
      text: '思达启航免费协助办理菲律宾入境及签证相关手续，学生只需按顾问指引准备个人资料。',
    },
    {
      icon: 'inventory',
      title: '发送学习资料和行前清单',
      text: '入学前免费发送学习资料、行李清单、费用清单和到校注意事项。',
    },
    {
      icon: 'support_agent',
      title: '到校后继续跟进',
      text: '遇到换老师、调课、学习方法、宿舍生活或学校沟通问题，也可以继续联系思达启航协助。',
    },
    {
      icon: 'location_on',
      title: '宿务当地支持',
      text: '思达启航在宿务有工作人员驻点，可提供当地支持，直到学生完成学习并顺利回国。',
    },
  ];

  readonly schoolServices = [
    '机场接机',
    '入学说明',
    '分级测试',
    '课程咨询',
    '学生经理',
    '宿舍清洁',
    '洗衣服务',
    '医务室',
    '24小时保安',
    '证件协助',
  ];

  readonly campusActivities = [
    '新生说明会',
    '文化交流',
    '体育活动',
    '节日活动',
    '校内比赛与趣味活动',
  ];

  readonly weekendActivities = [
    '跳岛游',
    '海边活动',
    '商场购物',
    '城市观光',
    '学生自发聚会',
  ];

  readonly notes = [
    '热门房型、暑假和寒假档期建议尽早确认空房。',
    '菲律宾公共假期可能影响课程安排，通常不补课。',
    '到校支付费用会随学校政策、汇率和个人情况变化。',
    '未成年学生、亲子学生和长期学习学生，需要提前确认额外规则。',
    '最终报名以学校正式录取、付款节点和顾问确认报价为准。',
  ];


  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程与费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用快速报价', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '报名流程', target: 'service-process', icon: 'task_alt' },
    { label: '常见问题', target: 'faq', icon: 'help' },
  ];


  get selectedRegistrationDate() { return this.students[0].selectedRegistrationDate; }
  set selectedRegistrationDate(value: string) { this.students[0].selectedRegistrationDate = value; }
  get iauRegistrationFeeNote(): string { return this.ciaQuote.iauRegistrationFeeNote; }

  get uses2027Tuition(): boolean {
    return (
      this.parseDate(this.selectedRegistrationDate) >=
        this.parseDate(this.futurePriceRegistrationStart) &&
      this.parseDate(this.selectedStartDate) >= this.parseDate(this.futurePriceArrivalStart)
    );
  }

  get selectedCourseBaseTuition(): number {
    return this.uses2027Tuition
      ? this.selectedCourse.tuition2027
      : this.selectedCourse.tuition;
  }

  get appliedTuitionLabel(): string {
    return this.uses2027Tuition ? '2027新价格' : '2026原价格';
  }

  get tuitionRuleSummary(): string {
    return this.uses2027Tuition
      ? '按当前报价日期与预计入学日期估算为2027新课程费；最终以学校实际收到报名及确认入学日期为准。'
      : '按当前报价日期与预计入学日期估算为2026原价格；最终以学校实际收到报名及确认入学日期为准。';
  }

  get isChristmasPromotionEligible(): boolean { return this.ciaQuote.isChristmasPromotionEligible; }
  get sidaDiscountAmount(): number { return this.ciaQuote.sidaDiscountAmount; }
  get christmasDiscountAmount(): number { return this.ciaQuote.christmasDiscountAmount; }
  get totalDiscountAmount(): number { return this.ciaQuote.totalDiscountAmount; }

  /** CIA keeps its older lookup: exact name, then any name containing “cia”, then the first result. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find((school) => school.name === this.profile.pricingSchoolName)
      ?? schools.find((school) => school.name.toLowerCase().includes('cia'))
      ?? schools[0];
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.localFees = content.localFees
      .filter(item => item.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(item => ({
        item: item.name,
        amount: this.formatPhp(item.amount),
        note: item.note,
      }));
  }

  protected override applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => {
        const id = this.slugifyPriceKey(lesson.name);
        const details = this.courseFeeDetails[id];

        return {
          id,
          name: lesson.name,
          tuition: lesson.price,
          tuition2027:
            this.courseFees.find((course) => course.id === id)?.tuition2027 ??
            lesson.price,
          suitable:
            lesson.description ||
            details?.suitable ||
            lesson.note ||
            '请联系顾问确认适合人群',
          schedule:
            details?.schedule || lesson.note || '请联系顾问确认课表安排',
          note: details?.note || '最终以学校当期报价和课程安排为准。',
          highlightNote: details?.highlightNote,
        };
      })
      .sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );

    if (databaseCourseFees.length > 0) {
      const mergedCourseFees = this.courseFees.map((course) => {
        const databaseCourse = databaseCourseFees.find(
          (item) => item.id === course.id,
        );

        return databaseCourse
          ? {
              ...course,
              name: databaseCourse.name,
              tuition: databaseCourse.tuition,
              suitable: databaseCourse.suitable || course.suitable,
            }
          : course;
      });
      const extraDatabaseCourseFees = databaseCourseFees.filter(
        (course) => !this.courseFees.some((item) => item.id === course.id),
      );

      this.courseFees = [...mergedCourseFees, ...extraDatabaseCourseFees].sort(
        (a, b) =>
          this.orderIndex(this.courseFeeOrder, a.id) -
          this.orderIndex(this.courseFeeOrder, b.id),
      );
      if (
        !this.courseFees.some((course) => course.id === this.selectedCourseId)
      ) {
        this.selectedCourseId = this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.createRoomId(room.name),
        name: room.name,
        fee: room.price,
        note: room.description || '请联系顾问确认空房',
      }))
      .sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );

    if (databaseRoomFees.length > 0) {
      const hasCompleteDatabaseRoomFees = this.roomFeeOrder.every((roomId) =>
        databaseRoomFees.some((room) => room.id === roomId),
      );
      const mergedRoomFees = this.roomFees.map((room) => {
        const databaseRoom = hasCompleteDatabaseRoomFees
          ? (databaseRoomFees.find(
              (item) => item.id === room.id && item.name === room.name,
            ) ?? databaseRoomFees.find((item) => item.id === room.id))
          : undefined;

        return databaseRoom
          ? {
              ...room,
              name: databaseRoom.name,
              fee: databaseRoom.fee,
              note: databaseRoom.note || room.note,
            }
          : room;
      });
      const extraDatabaseRoomFees = databaseRoomFees.filter(
        (room) => !this.roomFees.some((item) => item.id === room.id),
      );

      this.roomFees = [...mergedRoomFees, ...extraDatabaseRoomFees].sort(
        (a, b) =>
          this.orderIndex(this.roomFeeOrder, a.id) -
          this.orderIndex(this.roomFeeOrder, b.id),
      );
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees[this.roomFees.length - 1].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
    }

    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费');
    if (peakSeasonFee) {
      this.seasonalFeePerWeek = peakSeasonFee.fee;
    }

    const databaseLocalFees = fees
      .filter((fee) => this.currencyCodeForDisplay(fee.currencyCode) === '比索')
      .map((fee) => ({
        item: fee.name,
        amount: this.formatCurrencyAmount(fee),
        note: this.cleanFeeDescription(fee.description),
      }));

    if (databaseLocalFees.length > 0) {
      this.localFees = databaseLocalFees;
    }
  }

  private slugifyPriceKey(value: string): string {
    return value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);

    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private createRoomId(name: string): string {
    const roomCode = name.match(/\b((?:pn|sr)|[psd])\s*-?\s*(\d)\b/i);

    if (roomCode) {
      return `${roomCode[1].toLowerCase()}${roomCode[2]}`;
    }

    return this.slugifyPriceKey(name);
  }

  private currencyCodeForDisplay(code?: string): string {
    if (!code) {
      return '美元';
    }

    const normalizedCode = code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();

    if (normalizedCode === 'USD') {
      return '美元';
    }

    return normalizedCode === 'PHP' ? '比索' : normalizedCode;
  }

  private formatCurrencyAmount(fee: SchoolFeeDTO): string {
    const currencyCode = this.currencyCodeForDisplay(fee.currencyCode);

    return `${currencyCode} ${fee.fee.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(fee.fee) ? 0 : 1,
      maximumFractionDigits: 1,
    })}`;
  }

  private cleanFeeDescription(description?: string): string {
    if (!description) {
      return '以学校现场收费为准';
    }

    return description
      .replace(/^到校支付费用；/, '')
      .replace(/^前期支付费用；/, '');
  }
}
