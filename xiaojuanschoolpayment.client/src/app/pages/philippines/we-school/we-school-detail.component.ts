import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolService } from '../../../../services/school.service';

type GalleryCategory = '全部' | '校园' | '课堂' | '亲子' | '活动';

interface QuickInfo { icon: string; label: string; value: string; note: string; }
interface GalleryImage { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; }
interface BasicInfoRow { label: string; value: string; }
interface Highlight { image: string; title: string; text: string; }
interface FitItem { title: string; text: string; }
interface CourseItem { name: string; type: string; lessons: string; suitable: string; }
interface CourseFee { id: string; name: string; tuition: number; currencyCode: string; suitable: string; }
interface RoomFee { id: string; name: string; fee: number; currencyCode: string; note: string; }
interface LocalFee { item: string; amount: string; note: string; }
interface ScheduleItem { time: string; title: string; text: string; }
interface ProcessStep { icon: string; title: string; text: string; }
interface FaqItem { question: string; answer: string; }
interface SideNavItem { label: string; target: string; icon: string; }
interface SourceLink { label: string; url: string; }

@Component({
  selector: 'app-we-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './we-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './we-school-detail.component.css',
  ],
})
export class WeSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'WE Academy';
  private readonly pricingSchoolNames = ['菲律宾克拉克WE Academy语言学校', 'Clark WE Academy', 'WE Academy'];
  private readonly courseFeeOrder = [
    'esl-course',
    'native-mix-1-class',
    'native-mix-2-classes',
    'native-mix-3-classes',
    'junior-esl-course',
    'junior-esl-native-course',
    'guardian-esl-course',
    'we-kindergarten',
    'solo-junior-high-support',
    'english-golf-practice-course',
    'english-golf-round-course',
    'swimming-lessons',
  ];
  private readonly roomFeeOrder = ['campus-dormitory', 'family-room', 'new-residence', 'accommodation-to-confirm'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '亲子', '活动'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'native-mix-2-classes';
  selectedRoomId = 'campus-dormitory';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;
  registrationFee = 0;
  registrationCurrencyCode = 'PHP';
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: '克拉克 / Angeles City', note: '校址在Fil-Am Friendship Highway，官网写明离Clark机场约25分钟。' },
    { icon: 'villa', label: '校园风格', value: 'Farm resort campus', note: '宿舍、教室、健身房、大型泳池和便利店集中在校内。' },
    { icon: 'history', label: '创校与重启', value: '2016 / 2022年6月', note: '官网说明学校2016年创校，疫情后由新管理团队重启。' },
    { icon: 'record_voice_over', label: 'Native课程', value: 'Native Mix 1-3节/天', note: '美国、加拿大等Native老师一对一，主打发音、语调和自然表达。' },
    { icon: 'family_restroom', label: '亲子低龄', value: '4岁起 / Junior / Guardian', note: '校内WE Kindergarten、Junior ESL、Junior Native和陪读家长课程。' },
    { icon: 'sports_golf', label: '活动特色', value: 'Golf / Swimming', note: '官网公开Golf私教PHP750/次，Swimming PHP500-700/次。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'WE泳池与校园标识', description: '官方首页主视觉，能看到泳池、绿地和WE校园标识。', src: 'assets/philippines/we-hero.jpg' },
    { category: '校园', title: 'WE团队与校园草坪', description: '官方首页校园图片，展示学校团队与主标识区域。', src: 'assets/philippines/we-campus-01.jpg' },
    { category: '校园', title: 'Farm resort校区环境', description: '官方校园图片，适合判断WE的度假式环境和公共空间。', src: 'assets/philippines/we-campus-02.jpg' },
    { category: '课堂', title: 'Native一对一课堂', description: '官方Native Mix图片，展示Native老师一对一沟通场景。', src: 'assets/philippines/we-native-teacher.jpg' },
    { category: '课堂', title: 'Native Mix课程场景', description: '官网Program页老师图片，适合关注发音和自然表达的学生参考。', src: 'assets/philippines/we-native-mix.jpg' },
    { category: '亲子', title: 'Family Study Program', description: '官方亲子课程图片，适合低龄和家庭陪读方向。', src: 'assets/philippines/we-family-program.jpg' },
    { category: '亲子', title: 'WE Kindergarten', description: '官方Program页幼儿课程图片，面向4岁到学龄前儿童。', src: 'assets/philippines/we-kindergarten.jpg' },
    { category: '活动', title: 'English + Golf', description: '官方Golf页图片，展示克拉克高尔夫课程和场地体验。', src: 'assets/philippines/we-golf-01.jpg' },
    { category: '活动', title: 'Golf练习与球场', description: '官方Golf页第二张图片，适合判断活动课程氛围。', src: 'assets/philippines/we-golf-02.jpg' },
    { category: '活动', title: 'Swimming Lesson', description: '官方Swimming页图片，展示校内泳池课程。', src: 'assets/philippines/we-swimming.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾克拉克WE Academy语言学校' },
    { label: '英文名称', value: 'Clark WE Academy / WE English' },
    { label: '地址', value: 'Block 7 Lot 8 Fil-Am Friendship Highway, Angeles City, 2009 Pampanga, Philippines' },
    { label: '创校与重启', value: '2016年创校；2022年6月新管理团队重启' },
    { label: '机场距离', value: '官网说明从Clark International Airport到学校约25分钟' },
    { label: '校园设施', value: '宿舍、教室、健身房、大型泳池、便利店、高速Wi-Fi、校内高尔夫练习资源' },
    { label: '成人规则', value: '官网说明18岁以上成人课后无宵禁，适合偏自由舒适的学习生活' },
    { label: '费用状态', value: '完整学费住宿需当期报价；Golf/Swimming课程有公开PHP单次价格' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/we-hero.jpg', title: '度假式校内生活', text: 'WE的页面重点不是高压封闭，而是宽敞校园、泳池、便利店、宿舍和教室都在同一校区。' },
    { image: 'assets/philippines/we-native-teacher.jpg', title: 'Native Mix清晰', text: '官网说明可选择每日1-3节Native一对一，适合发音、语调和真实口语表达目标。' },
    { image: 'assets/philippines/we-family-program.jpg', title: '亲子与低龄友好', text: '4岁到学龄前可看WE Kindergarten，小学到初中可比较Junior ESL和Junior Native。' },
    { image: 'assets/philippines/we-golf-01.jpg', title: 'Golf / Swimming活动', text: '高尔夫和游泳有官网公开单次价格，适合把课程和活动体验一起规划。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '亲子家庭和低龄学生', text: '校内Kindergarten、Junior课程、家长课程和活动设施都比较适合家庭同行。' },
    { title: '想在Clark舒适学习', text: '离Clark机场近，校园更像farm resort，适合不想进入碧瑶高压节奏的人。' },
    { title: '重视Native发音反馈', text: 'Native Mix适合想练自然语调、发音和真实会话的成人或青少年。' },
    { title: '想加入Golf或Swimming', text: '官方列出高尔夫和游泳课程费用，适合把活动体验放进行程预算。' },
    { title: '13-15岁独自短期体验', text: '官网提到少数接受13-15岁初中生无监护人留学的支持体系，但必须逐项确认规则。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想要完整公开价目表', text: '官网未直接公开完整学费住宿表，课程、房型和周数必须由顾问向学校核价。' },
    { title: '目标是高压雅思冲刺', text: 'WE更偏舒适、亲子和口语体验；强制模考和晚自习应同步比较碧瑶或考试型学校。' },
    { title: '需要严格门禁管理', text: '官网强调成人18岁以上无宵禁，若学生需要强管理，应谨慎选择。' },
    { title: '只看英语课不看活动预算', text: 'Golf、Swimming、外出活动、接机和本地费用要另列，不能只看课程名称。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL Course', type: '一般英语', lessons: '菲律宾老师一对一与综合课程组合', suitable: '适合基础口语、听力、阅读、写作和第一次菲律宾游学。' },
    { name: 'Native Mix', type: 'Native口语强化', lessons: '每日1-3节美国/加拿大等Native老师一对一', suitable: '适合发音、语调、自然表达、working holiday或欧美学习准备。' },
    { name: 'Junior ESL Course', type: '青少年ESL', lessons: '经验菲律宾老师一对一，建立英文基础', suitable: '适合小学到初中阶段，需确认年龄、程度和同行监护。' },
    { name: 'Junior ESL Native Course', type: '青少年Native', lessons: 'Junior课程中含2节Native一对一', suitable: '适合希望孩子接触自然发音和外教沟通的家庭。' },
    { name: 'Guardian ESL', type: '陪读家长', lessons: '官网说明每日3节菲律宾老师一对一', suitable: '适合家长陪读时一起学习，也方便和孩子作息同步。' },
    { name: 'WE Kindergarten', type: '低龄儿童', lessons: '英语、数学、艺术、游戏、故事、音乐和午休照顾', suitable: '适合4岁到学龄前儿童，需确认班级人数和照顾安排。' },
    { name: 'English + Golf', type: '英语 + 高尔夫', lessons: '每日英语课搭配校内练习或每周球场field lesson', suitable: '适合成人、家庭或希望把运动体验加入游学的人。' },
    { name: 'Swimming Lesson', type: '活动课程', lessons: '私教、小组或3-5人大组课程', suitable: '适合亲子家庭和想使用校内泳池资源的学生。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-course', name: 'ESL Course', tuition: 0, currencyCode: 'PHP', suitable: '基础综合英语；完整费用需按周数、房型和入学日确认' },
    { id: 'native-mix-1-class', name: 'Native Mix 1 Class', tuition: 0, currencyCode: 'PHP', suitable: '每日1节Native一对一，适合先加入外教反馈' },
    { id: 'native-mix-2-classes', name: 'Native Mix 2 Classes', tuition: 0, currencyCode: 'PHP', suitable: '每日2节Native一对一，适合发音和自然表达强化' },
    { id: 'native-mix-3-classes', name: 'Native Mix 3 Classes', tuition: 0, currencyCode: 'PHP', suitable: '每日3节Native一对一，适合短期高口语目标' },
    { id: 'junior-esl-course', name: 'Junior ESL Course', tuition: 0, currencyCode: 'PHP', suitable: '小学到初中学生基础英语，需确认年龄和监护' },
    { id: 'junior-esl-native-course', name: 'Junior ESL Native Course', tuition: 0, currencyCode: 'PHP', suitable: '青少年课程中含Native一对一，适合重视发音' },
    { id: 'guardian-esl-course', name: 'Guardian ESL Course', tuition: 0, currencyCode: 'PHP', suitable: '陪读家长课程，官网说明每日3节菲律宾老师一对一' },
    { id: 'we-kindergarten', name: 'WE Kindergarten', tuition: 0, currencyCode: 'PHP', suitable: '4岁到学龄前，英语、数学、艺术和活动课程' },
    { id: 'solo-junior-high-support', name: 'Solo Junior High Support', tuition: 0, currencyCode: 'PHP', suitable: '13-15岁独自留学支持，需逐项确认规则' },
    { id: 'english-golf-practice-course', name: 'English + Golf Practice Course', tuition: 0, currencyCode: 'PHP', suitable: '英语课 + 校内高尔夫练习，课程包需报价' },
    { id: 'english-golf-round-course', name: 'English + Golf Round Course', tuition: 0, currencyCode: 'PHP', suitable: '练习课 + 每周球场field lesson，现场费用另付' },
    { id: 'swimming-lessons', name: 'Swimming Lessons', tuition: 0, currencyCode: 'PHP', suitable: '游泳课按单次或小组人数另计' },
  ];

  roomFees: RoomFee[] = [
    { id: 'campus-dormitory', name: 'Campus Dormitory / 校内宿舍', fee: 0, currencyCode: 'PHP', note: '官网说明宿舍在校园内，房型和价格需按空房确认' },
    { id: 'family-room', name: 'Family Room / 家庭房', fee: 0, currencyCode: 'PHP', note: '亲子同行常用方向，需确认人数、床型、餐食和卫浴' },
    { id: 'new-residence', name: 'New Residence / 新宿舍', fee: 0, currencyCode: 'PHP', note: '官网Notice有New Residence信息，开放状态和价格需当期确认' },
    { id: 'accommodation-to-confirm', name: 'Accommodation To Confirm', fee: 0, currencyCode: 'PHP', note: '用于先建预算清单，正式报价前不写死金额' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:00 - 08:20', title: '早餐', text: '官网Curriculum页列出早餐时间，低龄和家庭应同步确认餐食规则。' },
    { time: '08:00 - 12:05', title: '上午课程', text: '1-5节课，按ESL、Native Mix、Junior或Guardian方向排课。' },
    { time: '11:30 - 12:45', title: '午餐', text: '午餐时间与上午末段课程有重叠，实际课表以到校后安排为准。' },
    { time: '13:00 - 17:05', title: '下午课程', text: '6-10节课；Golf、Swimming或活动安排需和课程表一起确认。' },
    { time: '17:30 - 18:30', title: '晚餐', text: '晚餐后成人和未成年外出/自习规则不同，报名时需确认。' },
    { time: '19:00 - 20:35', title: 'Self Study', text: '官网列出自习时段，但WE整体定位比强制斯巴达学校更自由。' },
  ];

  localFees: LocalFee[] = [
    { item: 'Registration Fee', amount: '需当期确认', note: '一次性报名注册费，官网公开页未直接列出金额' },
    { item: 'SSP / SSP E-Card', amount: '需当期确认', note: '菲律宾特别学习许可及相关卡费，按周数和学校规则确认' },
    { item: 'Textbook / Materials', amount: '需当期确认', note: '按课程、级别和实际教材收取' },
    { item: 'Dormitory Deposit / Utilities', amount: '需当期确认', note: '住宿押金、水电、维护或清洁费用需按房型和周数确认' },
    { item: 'Golf Private Class', amount: 'PHP 750 / session', note: '官网Golf页公开：Private Class 1人 PHP750/次' },
    { item: 'Swimming Private Class', amount: 'PHP 700 / session', note: '官网Swimming页公开：Private Class 1人 PHP700/次' },
    { item: 'Swimming Small Group', amount: 'PHP 600 / session', note: '官网Swimming页公开：Small Group PHP600/次' },
    { item: 'Swimming Big Group', amount: 'PHP 500 / session', note: '官网Swimming页公开：3-5人 Big Group PHP500/次' },
    { item: 'Green / Caddie / Cart Fees', amount: '现场另付', note: 'Golf Round Course的green fee、caddie fee和cart rental现场另付' },
    { item: 'Pickup / Activities', amount: '需当期确认', note: 'Clark或Manila接机、周末活动与亲子外出按当期安排确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'family_restroom', title: '先确认学生结构', text: '成人、亲子、低龄、13-15岁独自入学的规则不同，先核对年龄和监护。' },
    { icon: 'record_voice_over', title: '选择课程比例', text: '在ESL、Native Mix 1-3节、Junior、Guardian、Kindergarten和Golf之间确认组合。' },
    { icon: 'king_bed', title: '核对房型空位', text: 'WE费用必须和宿舍、家庭房、新宿舍开放状态一起确认，不能只看课程名称。' },
    { icon: 'payments', title: '拆分公开费用和核价费用', text: 'Golf/Swimming单次价格可先列预算，学费住宿和本地费用由顾问向学校确认。' },
    { icon: 'support_agent', title: '正式报名与到校跟进', text: '确认学校回函、付款节点、航班接机、行前提醒和到校后的调课沟通。' },
  ];

  readonly notes = [
    'WE官网公开页面没有直接列出完整学费和住宿价目表，本页不凭非官方资料硬写课程住宿价格。',
    '官网公开活动价：Golf Private Class PHP750/次；Swimming Private PHP700/次，Small Group PHP600/次，Big Group 3-5人 PHP500/次。',
    'Golf Round Course包含交通和课程费用，但green fee、caddie fee和cart rental需要现场另付。',
    'Native Mix、Junior Native、Guardian ESL、Kindergarten和13-15岁solo junior支持都要按年龄、英文程度、周数和房型确认。',
    '官网说明18岁以上成人无宵禁；未成年学生规则、外出、医疗、保险和监护安排必须在报名时单独确认。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾克拉克WE Academy语言学校适合亲子吗？', answer: '适合重点比较。官网强调Family Program、校内WE Kindergarten、Junior ESL / Junior Native、Guardian ESL和校内泳池活动，适合低龄与家庭同行。' },
    { question: '为什么本页不直接写学费住宿金额？', answer: '因为WE官网公开页面没有直接列出完整学费和宿舍价目表。为避免误导，本页只写官网可确认的活动价格，课程住宿由顾问按当期回函核价。' },
    { question: 'WE和EG、CIP怎么选？', answer: 'WE更偏亲子、自由舒适和活动体验；CIP更强调Native一对一与口语纠音；EG课程价目公开度更高，也可比较ESL、考试、Native和Golf组合。' },
    { question: 'WE适合雅思冲刺吗？', answer: '如果目标是短期高压雅思冲分，WE通常不是第一优先。建议同步看EG、CIP或碧瑶强管理学校，并确认模考和自习制度。' },
    { question: 'WE的Golf和Swimming怎么收费？', answer: '官网Golf页列出Golf Private Class PHP750/次；Swimming页列出私教PHP700/次，小组PHP600/次，3-5人大组PHP500/次。Golf Round现场费用另付。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程方向', target: 'courses', icon: 'menu_book' },
    { label: '费用核价', target: 'quote', icon: 'request_quote' },
    { label: '公开费用', target: 'local-fees', icon: 'payments' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'request_quote' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'WE Academy官方首页', url: 'https://clarkweacademy.com/' },
    { label: 'WE Academy Program', url: 'https://clarkweacademy.com/program.php' },
    { label: 'WE Academy Curriculum', url: 'https://clarkweacademy.com/curriculum.php' },
    { label: 'WE Academy Golf Lesson', url: 'https://clarkweacademy.com/golf.php' },
    { label: 'WE Academy Swimming', url: 'https://clarkweacademy.com/swimming.php' },
    { label: 'WE Academy Teachers', url: 'https://clarkweacademy.com/teachers.php' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('WE')) ??
          schools[0];
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => this.applyPricingData(lessons, rooms, fees));
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    const databaseCourseFees = lessons
      .filter((lesson) => lesson.week === 4)
      .map((lesson) => ({
        id: this.priceKey(lesson.name),
        name: lesson.name,
        tuition: lesson.price,
        currencyCode: this.currencyCodeForDisplay(lesson.currencyCode),
        suitable: lesson.description || lesson.note || '请联系顾问确认适合人群',
      }))
      .sort((a, b) => this.orderIndex(this.courseFeeOrder, a.id) - this.orderIndex(this.courseFeeOrder, b.id));
    if (databaseCourseFees.length > 0) {
      this.courseFees = databaseCourseFees;
      if (!this.courseFees.some((course) => course.id === this.selectedCourseId)) {
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'native-mix-2-classes')?.id ?? this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.priceKey(room.name),
        name: room.name,
        fee: room.price,
        currencyCode: this.currencyCodeForDisplay(room.currencyCode),
        note: room.description || '请联系顾问确认空房',
      }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'campus-dormitory')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === 'Registration Fee' || fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
      this.registrationCurrencyCode = this.currencyCodeForDisplay(registrationFee.currencyCode);
    }

    const databaseLocalFees = fees
      .filter((fee) => fee.name !== '注册费' && fee.name !== 'Registration Fee')
      .map((fee) => ({
        item: fee.name,
        amount: this.formatMoney(fee.fee, this.currencyCodeForDisplay(fee.currencyCode)),
        note: this.cleanFeeDescription(fee.description),
      }));
    if (databaseLocalFees.length > 0) this.localFees = databaseLocalFees;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  requestQuote(): void { this.quoteCalculated = true; }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[0]; }
  get quoteText(): string { return '需顾问按当期价目表确认'; }
  get registrationFeeText(): string { return this.formatMoney(this.registrationFee, this.registrationCurrencyCode); }
  get quoteSummary(): string {
    return `${this.selectedWeeks}周 ${this.selectedCourse.name} + ${this.selectedRoom.name}`;
  }

  formatMoney(value: number, currencyCode = 'PHP'): string {
    if (!value || value <= 0) return '需当期确认';
    const decimals = ['KRW', 'PHP'].includes(currencyCode) ? 0 : 1;
    return `${currencyCode} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals })}`;
  }

  private priceKey(value: string): string {
    const knownKeys: Record<string, string> = {
      'ESL Course': 'esl-course',
      'Native Mix 1 Class': 'native-mix-1-class',
      'Native Mix 2 Classes': 'native-mix-2-classes',
      'Native Mix 3 Classes': 'native-mix-3-classes',
      'Junior ESL Course': 'junior-esl-course',
      'Junior ESL Native Course': 'junior-esl-native-course',
      'Guardian ESL Course': 'guardian-esl-course',
      'WE Kindergarten': 'we-kindergarten',
      'Solo Junior High Support': 'solo-junior-high-support',
      'English + Golf Practice Course': 'english-golf-practice-course',
      'English + Golf Round Course': 'english-golf-round-course',
      'Swimming Lessons': 'swimming-lessons',
      'Campus Dormitory / 校内宿舍': 'campus-dormitory',
      'Family Room / 家庭房': 'family-room',
      'New Residence / 新宿舍': 'new-residence',
      'Accommodation To Confirm': 'accommodation-to-confirm',
    };
    if (knownKeys[value]) return knownKeys[value];
    const slug = value.toLowerCase().replace(/&/g, 'and').replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug || value;
  }

  private orderIndex(order: string[], value: string): number {
    const index = order.indexOf(value);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  private currencyCodeForDisplay(code?: string): string {
    return !code ? 'PHP' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准';
  }
}
