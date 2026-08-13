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

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '运动' | '设施';

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
  selector: 'app-eg-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './eg-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './eg-school-detail.component.css',
  ],
})
export class EgSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'EG';
  private readonly pricingSchoolNames = ['菲律宾克拉克EG语言学校', 'EG Academy', 'Education Group Granma INC'];
  private readonly courseFeeOrder = [
    'esl-4',
    'esl-6',
    'esl-native-plus',
    'esl-native-complete',
    'pre-ielts',
    'ielts-native',
    'ielts-score-guarantee',
    'toeic-native',
    'toefl-native',
    'business-native',
    'golf-esl',
    'golf-special',
    'junior-esl',
    'junior-native',
    'junior-ielts',
    'guardian-esl',
  ];
  private readonly roomFeeOrder = ['quad', 'double', 'single', 'family-triple', 'special-six', 'special-five', 'special-four'];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '运动', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = 100000;
  registrationCurrencyCode = 'KRW';
  readonly weekOptions = [1, 2, 3, 4, 8, 12, 16, 20, 24];
  selectedCourseId = 'esl-4';
  selectedRoomId = 'quad';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: '克拉克 / Angeles City', note: '位于Friendship Highway生活圈，适合重视机场衔接和舒适环境的学生。' },
    { icon: 'groups', label: '学校规模', value: '约110名学生', note: '官网概况列出1:1教室50间、团体教室20间，属于中小型综合校。' },
    { icon: 'record_voice_over', label: '师资方向', value: '菲律宾 / 美国 / 加拿大等', note: '适合想把一对一训练和Native表达反馈一起比较的人。' },
    { icon: 'school', label: '课程', value: 'ESL / IELTS / TOEIC / TOEFL / Business', note: '另有Junior、Guardian和Golf英语组合方向。' },
    { icon: 'sports_golf', label: '特色资源', value: '250码高尔夫练习场', note: '官网概况和Golf页均列出高尔夫练习资源。' },
    { icon: 'payments', label: '官方价目', value: '2025-01-01 KRW价目表', note: '注册费KRW100,000另计，短期周数按官方比例计算。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'EG校园与泳池外观', description: 'EG官方校园页展示的校区、泳池、球场和庭院环境。', src: 'assets/philippines/eg-facility-001.jpg' },
    { category: '校园', title: 'EG校园总览', description: '官方Facility综合图，展示校舍、宿舍、泳池和公共空间。', src: 'assets/philippines/eg-campus-overview.png' },
    { category: '教室', title: '教学楼与教室', description: '官方School Building图，包含大堂、教室、一对一教室和多媒体教室。', src: 'assets/philippines/eg-classroom.jpg' },
    { category: '住宿', title: 'Dormitory 1 双人/单人房', description: '官方宿舍图展示房间、书桌、衣柜、浴室和走廊空间。', src: 'assets/philippines/eg-dormitory.jpg' },
    { category: '住宿', title: 'Dormitory 1 四人房', description: '官方四人房图，适合先判断低预算房型和基本生活配置。', src: 'assets/philippines/eg-group-classroom.jpg' },
    { category: '住宿', title: 'Dormitory 2 房型', description: '官方Dormitory 2图，展示单人/多人房和卫浴空间。', src: 'assets/philippines/eg-facility-003.jpg' },
    { category: '运动', title: '高尔夫与运动设施', description: '官方设施图展示高尔夫练习场、球场、篮球场和休息区。', src: 'assets/philippines/eg-facility-004.jpg' },
    { category: '运动', title: 'EG Golf项目', description: '官方Golf页展示高尔夫练习场、教练和课程方向。', src: 'assets/philippines/eg-golf-facility.png' },
    { category: '设施', title: '校园设施综合图', description: '官方图集中展示泳池、教室、TOEIC考场、宿舍和运动设施。', src: 'assets/philippines/eg-room-2018.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾克拉克EG语言学校' },
    { label: '英文名称', value: 'EG Academy / Education Group Granma INC' },
    { label: '创校时间', value: '2013年4月' },
    { label: '地址', value: 'Friendship Highway, Cutcut, Angeles City, Philippines' },
    { label: '学生容量', value: '约110名学生' },
    { label: '教室配置', value: '1:1教室50间、团体教室20间' },
    { label: '设施', value: 'TOEIC考场、自习室、视听室、250码高尔夫练习场、咖啡厅、旅行社等' },
    { label: '费用币种', value: '官方韩文价目表以KRW列示，菲律宾到校费用多以PHP支付' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/eg-facility-001.jpg', title: 'Clark舒适型校园', text: 'EG适合想在克拉克把校园环境、住宿、学习和生活便利度一起考虑的学生。' },
    { image: 'assets/philippines/eg-classroom.jpg', title: '一对一和团体课并重', text: '官网概况列出50间一对一教室和20间团体教室，ESL和考试课程都可按强度选择。' },
    { image: 'assets/philippines/eg-facility-004.jpg', title: '高尔夫英语特色明显', text: 'EG Golf页列出练习场、教练和追加课程费用，适合把英语和高尔夫体验结合。' },
    { image: 'assets/philippines/eg-facility-002.jpg', title: '宿舍配置清晰', text: '官方宿舍图展示床位、书桌、衣柜、卫浴等空间，报价时重点确认房型和空房。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '第一次去菲律宾游学', text: 'Clark生活节奏相对舒适，EG课程强度也有弹性，适合先建立英语学习节奏。' },
    { title: '想要ESL + Native表达反馈', text: 'ESL Native Plus / Complete适合希望增加发音、自然表达和外教互动的学生。' },
    { title: '考试基础或商务方向', text: 'IELTS、TOEIC、TOEFL和Business + Native适合有升学、求职或职场英语需求的人。' },
    { title: '亲子家庭和青少年', text: 'Junior与Guardian课程可一起核对，但必须提前确认年龄、监护、房型和接机。' },
    { title: '高尔夫英语组合', text: 'Golf + ESL和Golf Special适合把语言学习、练习场和运动体验放在同一行程中。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只想找最低总价', text: 'EG官方表以课程费和宿舍费叠加，短期比例、注册费、当地费用和接机费都要一起算。' },
    { title: '短期高压雅思冲刺', text: '可以看IELTS路线，但若需要严格晚自习和密集模考，也应同步比较碧瑶强管理学校。' },
    { title: '必须全程美元报价', text: 'EG官网公开价目表为KRW，正式报价和人民币换算需按学校回函与付款日汇率确认。' },
    { title: '只看Golf不看学习安排', text: 'Golf课程要把练习时间、额外课程费、球具、交通和英语课表一起核对。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL 4 / ESL 6', type: '一般英语', lessons: 'ESL 4偏平衡，ESL 6增加一对一课时', suitable: '适合口语、听力、阅读、写作基础提升，也适合第一次Clark游学。' },
    { name: 'ESL Native Plus / Complete', type: 'Native口语强化', lessons: 'ESL课程搭配Native老师口语和表达训练', suitable: '适合发音纠正、自然表达、面试沟通和欧美口语环境适应。' },
    { name: 'Pre-IELTS / IELTS + Native / Guarantee', type: '雅思方向', lessons: '从入门到目标分路线，保证班需确认入学门槛', suitable: '适合升学、移民或工作目标，但要核对模考、教材和开课规则。' },
    { name: 'TOEIC / TOEFL / Business + Native', type: '考试与商务', lessons: '考试技能或职场沟通搭配Native表达反馈', suitable: '适合求职、企业英语、北美升学或商务会议表达。' },
    { name: 'Junior / Guardian', type: '亲子与青少年', lessons: '儿童课程和家长课程分开报价', suitable: '适合亲子同行，需同步确认年龄、监护、房型、接机和周末管理。' },
    { name: 'Golf + ESL / Golf Special', type: '高尔夫英语', lessons: '英语课搭配高尔夫练习或更高比例Golf安排', suitable: '适合成人、家庭或希望在Clark安排运动体验的学生。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-4', name: 'ESL 4', tuition: 950000, currencyCode: 'KRW', suitable: '4节一对一 + 2节团体课，基础口语和综合提升' },
    { id: 'esl-6', name: 'ESL 6', tuition: 1270000, currencyCode: 'KRW', suitable: '一对一课时更多，适合短期强化输出' },
    { id: 'esl-native-plus', name: 'ESL Native Plus', tuition: 1370000, currencyCode: 'KRW', suitable: 'ESL搭配Native表达反馈' },
    { id: 'esl-native-complete', name: 'ESL Native Complete', tuition: 1520000, currencyCode: 'KRW', suitable: 'Native比例更高，适合口语和发音目标' },
    { id: 'pre-ielts', name: 'Pre-IELTS', tuition: 1220000, currencyCode: 'KRW', suitable: '雅思入门与基础建立' },
    { id: 'ielts-native', name: 'IELTS + Native', tuition: 1320000, currencyCode: 'KRW', suitable: '雅思备考搭配Native课程' },
    { id: 'ielts-score-guarantee', name: 'IELTS Score Guarantee', tuition: 1370000, currencyCode: 'KRW', suitable: '保证班方向，需确认入学门槛和周数' },
    { id: 'toeic-native', name: 'TOEIC + Native', tuition: 1320000, currencyCode: 'KRW', suitable: '多益与职场考试方向' },
    { id: 'toefl-native', name: 'TOEFL + Native', tuition: 1320000, currencyCode: 'KRW', suitable: '托福和北美升学方向' },
    { id: 'business-native', name: 'Business + Native', tuition: 1320000, currencyCode: 'KRW', suitable: '商务会议、面试和职场表达' },
    { id: 'golf-esl', name: 'Golf + ESL', tuition: 1350000, currencyCode: 'KRW', suitable: '英语课程搭配高尔夫练习' },
    { id: 'golf-special', name: 'Golf Special', tuition: 1950000, currencyCode: 'KRW', suitable: '高尔夫比重更高，需确认教练和场地' },
    { id: 'junior-esl', name: 'Junior ESL', tuition: 1280000, currencyCode: 'KRW', suitable: '青少年ESL，需确认年龄和监护' },
    { id: 'junior-native', name: 'Junior Native', tuition: 1480000, currencyCode: 'KRW', suitable: '青少年Native口语方向' },
    { id: 'junior-ielts', name: 'Junior IELTS', tuition: 1400000, currencyCode: 'KRW', suitable: '青少年雅思方向' },
    { id: 'guardian-esl', name: 'Guardian ESL', tuition: 780000, currencyCode: 'KRW', suitable: '家长陪读课程' },
  ];

  roomFees: RoomFee[] = [
    { id: 'quad', name: '四人房', fee: 600000, currencyCode: 'KRW', note: '默认低预算估算房型，需确认空房' },
    { id: 'double', name: '二人房', fee: 800000, currencyCode: 'KRW', note: '兼顾预算和舒适度' },
    { id: 'single', name: '一人房', fee: 1000000, currencyCode: 'KRW', note: '隐私最高，热门档期需提前确认' },
    { id: 'family-triple', name: '家庭三人房', fee: 700000, currencyCode: 'KRW', note: '家庭/青少年方向参考房型' },
    { id: 'special-six', name: '特别六人房', fee: 800000, currencyCode: 'KRW', note: '特别房型，适合家庭或团体估算' },
    { id: 'special-five', name: '特别五人房', fee: 950000, currencyCode: 'KRW', note: '特别房型，需确认开放状态' },
    { id: 'special-four', name: '特别四人房', fee: 1100000, currencyCode: 'KRW', note: '特别房型，生活空间更大' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:20 - 08:20', title: '早餐与准备', text: 'EG FAQ说明食宿通常含三餐，周末提供早午餐，最终按当期规则确认。' },
    { time: '08:00 - 12:00', title: '上午一对一 / 团体课', text: '按ESL、Native、IELTS、TOEIC、TOEFL或Business方向安排课程。' },
    { time: '12:00 - 13:00', title: '午餐与短休', text: '住宿生活、餐食和宿舍规则应在报名时一起确认。' },
    { time: '13:00 - 17:00', title: '下午课程与反馈', text: '考试或Native课程需确认老师配置、教材和是否按期开课。' },
    { time: '17:00 - 21:00', title: '自习 / Golf / 生活安排', text: 'Golf项目可额外核对练习场使用时间、追加课程和球具安排。' },
    { time: '周末', title: 'Clark生活与短途活动', text: '周末通常无课，外出需按学校规定提前告知办公室。' },
  ];

  localFees: LocalFee[] = [
    { item: '教材费（4周）', amount: 'PHP 2,000', note: '按课程和实际教材调整' },
    { item: 'School ID', amount: 'PHP 200', note: '学生证参考' },
    { item: '宿舍保证金', amount: 'PHP 5,000', note: '退房检查后按学校规则退还' },
    { item: 'Clark / Mabalacat接机', amount: 'PHP 1,000', note: '个人接机参考' },
    { item: '马尼拉接机', amount: 'PHP 5,000', note: '家庭接机通常需另行确认' },
    { item: 'SSP', amount: 'PHP 6,800', note: '特别学习许可参考' },
    { item: 'SSP E-Card', amount: 'PHP 3,500', note: '与SSP相关的E-Card费用' },
    { item: 'ACR I-Card', amount: 'PHP 4,000', note: '长期学习或延签时通常需要' },
    { item: '签证延签8周', amount: 'PHP 3,830', note: '8周延签参考' },
    { item: '签证延签12周', amount: 'PHP 8,830', note: '12周延签参考' },
    { item: 'Golf追加课（每周5次）', amount: 'PHP 10,000', note: 'EG Golf官方页参考' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先判断EG是否适合', text: '确认学生是要ESL、Native、考试、亲子还是Golf组合，再进入报价。' },
    { icon: 'fact_check', title: '核对课程和房型', text: '按入学日确认课程开放、房型空位、接机机场、短期比例和优惠。' },
    { icon: 'payments', title: '拆分KRW与PHP费用', text: '前期课程住宿以KRW表估算，到校费用和签证项目以PHP另列。' },
    { icon: 'assignment_turned_in', title: '准备报名资料', text: '协助整理护照、入学日期、课程、房型、航班和付款节点。' },
    { icon: 'support_agent', title: '到校后继续跟进', text: '如遇调课、换老师、宿舍或费用问题，可继续联系顾问协助沟通。' },
  ];

  readonly notes = [
    'EG官网公开的费用PDF为2025年1月1日韩文KRW价目表，注册费KRW100,000不包含在表格总额中。',
    '1周、2周、3周短期课程按4周课程+住宿总额的40%、65%、85%计算，4周以上按4周单位递增。',
    '到校费用多以PHP支付，教材、SSP、SSP E-Card、ACR I-Card、接机、签证延签和Golf追加费用需另列。',
    'Golf + ESL和Golf Special需要额外确认练习场、教练、练习球、开放时间和个人装备。',
    '最终报名以学校正式回函、空房、优惠有效期、汇率和顾问确认报价为准。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾克拉克EG语言学校适合第一次游学吗？', answer: '适合进入候选。EG课程选择较完整，Clark生活环境相对舒适，尤其适合ESL、Native口语、亲子和高尔夫英语组合需求。' },
    { question: 'EG的价格为什么用KRW显示？', answer: '因为EG官网公开价目表是韩文KRW表。页面保留原始币种，避免把学校价格误写成美元；人民币换算建议按付款日汇率由顾问确认。' },
    { question: '短期1-3周怎么计算？', answer: '官网价目表写明注册费不包含，1周、2周、3周分别按4周课程+住宿总额的40%、65%、85%计算。' },
    { question: 'EG和CIP怎么选？', answer: '如果核心是外教一对一和口语纠音，可以优先比较CIP；如果想要ESL、考试、Native、亲子和Golf一起比较，EG更值得放进候选。' },
    { question: 'EG适合雅思冲刺吗？', answer: '可以看Pre-IELTS、IELTS + Native或Score Guarantee，但短期高压冲分还应比较碧瑶强管理学校，并确认模考和保证班规则。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用计算', target: 'quote', icon: 'calculate' },
    { label: '到校费用', target: 'local-fees', icon: 'payments' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'courses', icon: 'menu_book' },
    { label: '费用', target: 'quote', icon: 'calculate' },
    { label: '服务', target: 'service-process', icon: 'support_agent' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'EG Academy官方概况', url: 'https://egesl.com/bbs/board.php?bo_table=overview' },
    { label: 'EG Academy官方校园页', url: 'https://www.egesl.com/study/campus/' },
    { label: 'EG Academy官方费用PDF', url: 'https://www.egesl.com/study/cost/cost_2025.pdf' },
    { label: 'EG Academy官方Golf页', url: 'https://www.egesl.com/study/golf/' },
    { label: 'EG Academy官方FAQ', url: 'https://egesl.com/faq/' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('EG')) ??
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
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'esl-4')?.id ?? this.courseFees[0].id;
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
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'quad')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === '注册费' && fee.fee > 0);
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
      this.registrationCurrencyCode = this.currencyCodeForDisplay(registrationFee.currencyCode);
    }

    const databaseLocalFees = fees
      .filter((fee) => fee.name !== '注册费')
      .map((fee) => ({
        item: fee.name,
        amount: this.formatMoney(fee.fee, this.currencyCodeForDisplay(fee.currencyCode)),
        note: this.cleanFeeDescription(fee.description),
      }));
    if (databaseLocalFees.length > 0) this.localFees = databaseLocalFees;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  calculateQuote(): void { this.quoteCalculated = true; }

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
  get billingMultiplier(): number {
    if (this.selectedWeeks === 1) return 0.4;
    if (this.selectedWeeks === 2) return 0.65;
    if (this.selectedWeeks === 3) return 0.85;
    return this.selectedWeeks / 4;
  }
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.billingMultiplier; }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.billingMultiplier; }
  get quoteCurrencyCode(): string { return this.selectedCourse.currencyCode || this.selectedRoom.currencyCode || 'KRW'; }
  get registrationForQuote(): number { return this.registrationCurrencyCode === this.quoteCurrencyCode ? this.registrationFee : 0; }
  get quoteAmount(): number { return this.registrationForQuote + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get quoteText(): string { return `${this.formatMoney(this.quoteAmount, this.quoteCurrencyCode)} 起`; }
  get registrationFeeText(): string { return this.formatMoney(this.registrationFee, this.registrationCurrencyCode); }
  get shortCourseRuleText(): string {
    return this.selectedWeeks <= 3 ? `${this.selectedWeeks}周按4周课程+住宿总额的${Math.round(this.billingMultiplier * 100)}%计算` : '4周以上按4周单位估算';
  }

  formatMoney(value: number, currencyCode = 'KRW'): string {
    const decimals = ['KRW', 'PHP'].includes(currencyCode) ? 0 : 1;
    return `${currencyCode} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals })}`;
  }

  private priceKey(value: string): string {
    const knownKeys: Record<string, string> = {
      'ESL 4': 'esl-4',
      'ESL 6': 'esl-6',
      'ESL Native Plus': 'esl-native-plus',
      'ESL Native Complete': 'esl-native-complete',
      'Pre-IELTS': 'pre-ielts',
      'IELTS + Native': 'ielts-native',
      'IELTS Score Guarantee': 'ielts-score-guarantee',
      'TOEIC + Native': 'toeic-native',
      'TOEFL + Native': 'toefl-native',
      'Business + Native': 'business-native',
      'Golf + ESL': 'golf-esl',
      'Golf Special': 'golf-special',
      'Junior ESL': 'junior-esl',
      'Junior Native': 'junior-native',
      'Junior IELTS': 'junior-ielts',
      'Guardian ESL': 'guardian-esl',
      '一人房': 'single',
      '二人房': 'double',
      '四人房': 'quad',
      '家庭三人房': 'family-triple',
      '特别四人房': 'special-four',
      '特别五人房': 'special-five',
      '特别六人房': 'special-six',
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
    return !code ? 'KRW' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准';
  }
}
