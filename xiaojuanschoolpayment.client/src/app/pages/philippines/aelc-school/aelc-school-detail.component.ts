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

type GalleryCategory = '全部' | '校园' | '课堂' | '住宿' | '生活';

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
  selector: 'app-aelc-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './aelc-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './aelc-school-detail.component.css',
  ],
})
export class AelcSchoolDetailComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolSearchName = 'AELC';
  private readonly pricingSchoolNames = [
    '菲律宾克拉克AELC语言学校',
    'AELC',
    'AELC / Native-focused Clark Schools',
    'American English Learning Center',
  ];
  private readonly courseFeeOrder = [
    'center-1-lite-double-base',
    'center-1-esl-double-base',
    'center-1-semi-intensive-double-base',
    'center-1-toeic-regular-double-base',
    'center-1-toeic-800-guarantee-double-base',
    'center-1-toeic-900-guarantee-double-base',
    'center-1-intensive-a-double-base',
    'center-1-intensive-b-double-base',
    'center-2-lite-quad-base',
    'center-2-esl-quad-base',
    'center-2-semi-intensive-quad-base',
    'center-2-ielts-55-60-guarantee-quad-base',
    'center-2-ielts-65-70-guarantee-quad-base',
    'center-2-intensive-a-quad-base',
    'center-2-intensive-b-quad-base',
  ];
  private readonly roomFeeOrder = [
    'base-shared-room-included',
    'center-1-single-room-supplement',
    'center-2-triple-room-supplement',
    'center-2-double-room-supplement',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'center-1-esl-double-base';
  selectedRoomId = 'base-shared-room-included';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;
  registrationFee = 100;
  registrationCurrencyCode = 'USD';
  readonly weekOptions = [4, 8, 12, 16, 20, 24];

  readonly quickInfo: QuickInfo[] = [
    { icon: 'location_on', label: '城市', value: 'Clark / Angeles City', note: '资料页列出地址在Friendship Highway, Cutcut, Pampanga。' },
    { icon: 'record_voice_over', label: '学校方向', value: 'Native口语 / 考试 / 商务', note: '适合重视欧美外教一对一、发音和真实沟通训练的学生。' },
    { icon: 'domain', label: '校区', value: 'Center 1 / Center 2', note: 'Center 1偏TOEIC和成人基础英语，Center 2偏IELTS、亲子和长期规划。' },
    { icon: 'groups', label: '规模参考', value: '约280名学生', note: '资料页列出Center 1和Center 2合计容量约280名。' },
    { icon: 'verified', label: '资质参考', value: 'SSP / TESDA', note: '资料页列出SSP RADJR-1211735-024622，并标注TESDA登记。' },
    { icon: 'payments', label: '4周参考', value: 'USD 1,387 起', note: '旧公开价目为4周课程住宿套餐；需按当期招生和房型重新确认。' },
  ];

  readonly galleryImages: GalleryImage[] = [
    { category: '校园', title: 'AELC校舍外观', description: 'AELC学校楼体与入口，来自AELC学校资料页图片。', src: 'assets/philippines/aelc-main.jpg' },
    { category: '校园', title: 'AELC校内环境', description: 'AELC校园内部公共空间和通行区域。', src: 'assets/philippines/aelc-campus.jpg' },
    { category: '校园', title: 'AELC前台区域', description: '学校接待与前台空间，适合核对校内氛围。', src: 'assets/philippines/aelc-front.jpg' },
    { category: '课堂', title: 'AELC课程场景', description: '课堂和教学环境，适合关注Native口语与一对一课程的学生参考。', src: 'assets/philippines/aelc-classroom.jpg' },
    { category: '住宿', title: 'AELC宿舍楼', description: '宿舍外观与公共空间，房型和开放状态需按当期确认。', src: 'assets/philippines/aelc-dormitory.jpg' },
    { category: '住宿', title: 'AELC双人房参考', description: 'AELC资料页中的宿舍房间照片。', src: 'assets/philippines/aelc-room.jpg' },
    { category: '生活', title: 'AELC餐厅', description: '校内餐食和公共生活区域参考。', src: 'assets/philippines/aelc-dining.jpg' },
    { category: '生活', title: 'AELC泳池设施', description: '校内泳池和休闲设施参考。', src: 'assets/philippines/aelc-pool.jpg' },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾克拉克AELC语言学校' },
    { label: '英文名称', value: 'AELC / American English Learning Center' },
    { label: '地址参考', value: 'Lot3-2A AELC School Friendship Hi-way Cutcut Angeles City Of San Fernando, Pampanga' },
    { label: '设立年份', value: '资料页列出2007年' },
    { label: '学生容量', value: '约280名，Center 1与Center 2合计参考' },
    { label: '课程方向', value: 'LITE、ESL、Semi Intensive、TOEIC、IELTS、AELC Intensive、Business方向' },
    { label: '校内设施', value: 'TOEIC考试中心、食堂、泳池、宿舍、临近或周边高尔夫资源' },
    { label: '费用状态', value: '公开价目为历史参考，正式报价必须以学校当期招生、房型和回函为准' },
  ];

  readonly highlights: Highlight[] = [
    { image: 'assets/philippines/aelc-main.jpg', title: 'Clark Native方向代表学校', text: 'AELC长期被作为Clark外教口语、发音和欧美表达方向的候选学校来比较。' },
    { image: 'assets/philippines/aelc-classroom.jpg', title: '外教一对一比例值得关注', text: '课程表按菲律宾老师、Native老师一对一、Native团体课和选修课拆分，报名时要核对真实课表。' },
    { image: 'assets/philippines/aelc-dormitory.jpg', title: '两个校区定位不同', text: 'Center 1偏TOEIC和成人基础英语；Center 2偏IELTS、亲子和长期海外规划方向。' },
    { image: 'assets/philippines/aelc-pool.jpg', title: '生活设施完整', text: '资料图包含宿舍、餐厅、泳池和校内公共空间，适合想比较生活舒适度的学生。' },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想练发音和自然表达', text: '适合把Native一对一、发音纠正、语调和真实会话放在核心目标的学生。' },
    { title: '需要TOEIC或IELTS方向', text: 'Center 1资料强调TOEIC考试中心，Center 2资料列有IELTS保证课程方向。' },
    { title: '成人商务与求职沟通', text: 'Semi Intensive、Business和Native表达训练适合职场、面试和working holiday准备。' },
    { title: '想比较Clark外教型学校', text: '可和CIP、EG、WE、HELP一起比较Native课比例、费用、住宿和管理强度。' },
    { title: '重视生活便利和校内设施', text: 'Clark比碧瑶交通更轻松，适合重视机场、住宿、餐食和周边生活的人。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '只接受最新官方公开价目', text: 'AELC旧官方域名目前无法访问，本页价格为公开资料页参考，正式报名前必须重新核价。' },
    { title: '基础非常弱但想全外教', text: '基础薄弱学生通常需要菲律宾老师一对一打底，再搭配Native课更稳。' },
    { title: '目标是高压雅思冲刺', text: '如果需要强制晚自习和密集模考，也应同步看碧瑶或HELP等管理更强的学校。' },
    { title: '不想做校区核对', text: 'AELC有Center 1和Center 2资料，课程、住宿、房型和年龄规则不能混用。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'LITE / ESL', type: '一般英语', lessons: '菲律宾老师一对一 + Native一对一 + Native团体/选修', suitable: '适合基础打底、日常口语和第一次Clark游学。' },
    { name: 'Semi Intensive / Business', type: '口语商务', lessons: '增加Native或商务表达训练，重点看发音、表达和互动', suitable: '适合成人、职场、面试和需要自然表达的人。' },
    { name: 'TOEIC Regular / Guarantee', type: '多益', lessons: 'Center 1方向，资料页列出TOEIC普通与保证课程', suitable: '适合求职、毕业门槛、工作英语证书或日系/韩系企业目标。' },
    { name: 'IELTS Guarantee', type: '雅思', lessons: 'Center 2方向，5.5/6.0与6.5/7.0目标需按入学程度确认', suitable: '适合升学、移民或海外就业目标，但要确认模考和保证班规则。' },
    { name: 'AELC Intensive A / B', type: 'Native强化', lessons: 'Native一对一比例更高，搭配Native团体和选修', suitable: '适合中高级学生、短期高口语目标和欧美课堂适应。' },
    { name: 'Family / Junior方向', type: '亲子青少年', lessons: 'Center 2相关资料涉及亲子和低龄方向', suitable: '适合家庭候选，但年龄、监护、房型和接机必须单独确认。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'center-1-lite-double-base', name: 'Center 1 LITE / 2人房基准套餐', tuition: 1288, currencyCode: 'USD', suitable: '4周课程住宿参考；Native与菲律宾老师混合课表' },
    { id: 'center-1-esl-double-base', name: 'Center 1 ESL / 2人房基准套餐', tuition: 1486, currencyCode: 'USD', suitable: '4周课程住宿参考；综合ESL与Native课搭配' },
    { id: 'center-1-semi-intensive-double-base', name: 'Center 1 Semi Intensive / 2人房基准套餐', tuition: 1535, currencyCode: 'USD', suitable: '4周课程住宿参考；ESL或Business方向' },
    { id: 'center-1-toeic-regular-double-base', name: 'Center 1 TOEIC一般 / 2人房基准套餐', tuition: 1387, currencyCode: 'USD', suitable: '4周课程住宿参考；TOEIC考试方向' },
    { id: 'center-1-toeic-800-guarantee-double-base', name: 'Center 1 TOEIC 800+ / 2人房基准套餐', tuition: 1486, currencyCode: 'USD', suitable: '4周课程住宿参考；LC/RC 800 + Speaking Lv.6方向' },
    { id: 'center-1-toeic-900-guarantee-double-base', name: 'Center 1 TOEIC 900+ / 2人房基准套餐', tuition: 1486, currencyCode: 'USD', suitable: '4周课程住宿参考；LC/RC 900 + Speaking Lv.7方向' },
    { id: 'center-1-intensive-a-double-base', name: 'Center 1 AELC Intensive A / 2人房基准套餐', tuition: 1682, currencyCode: 'USD', suitable: '4周课程住宿参考；Native课比例更高' },
    { id: 'center-1-intensive-b-double-base', name: 'Center 1 AELC Intensive B / 2人房基准套餐', tuition: 1865, currencyCode: 'USD', suitable: '4周课程住宿参考；更高Native一对一强度' },
    { id: 'center-2-lite-quad-base', name: 'Center 2 LITE / 4人房基准套餐', tuition: 1292, currencyCode: 'USD', suitable: '4周课程住宿参考；亲子或长期规划校区方向' },
    { id: 'center-2-esl-quad-base', name: 'Center 2 ESL / 4人房基准套餐', tuition: 1490, currencyCode: 'USD', suitable: '4周课程住宿参考；综合ESL' },
    { id: 'center-2-semi-intensive-quad-base', name: 'Center 2 Semi Intensive / 4人房基准套餐', tuition: 1540, currencyCode: 'USD', suitable: '4周课程住宿参考；ESL或Business方向' },
    { id: 'center-2-ielts-55-60-guarantee-quad-base', name: 'Center 2 IELTS 5.5/6.0 / 4人房基准套餐', tuition: 1490, currencyCode: 'USD', suitable: '4周课程住宿参考；需确认保证班门槛' },
    { id: 'center-2-ielts-65-70-guarantee-quad-base', name: 'Center 2 IELTS 6.5/7.0 / 4人房基准套餐', tuition: 1637, currencyCode: 'USD', suitable: '4周课程住宿参考；高分目标需确认入学分数' },
    { id: 'center-2-intensive-a-quad-base', name: 'Center 2 Intensive A / 4人房基准套餐', tuition: 1688, currencyCode: 'USD', suitable: '4周课程住宿参考；Native强化方向' },
    { id: 'center-2-intensive-b-quad-base', name: 'Center 2 Intensive B / 4人房基准套餐', tuition: 1871, currencyCode: 'USD', suitable: '4周课程住宿参考；Native比例更高，价格需复核' },
  ];

  roomFees: RoomFee[] = [
    { id: 'base-shared-room-included', name: '基准多人房已含', fee: 0, currencyCode: 'USD', note: 'Center 1为2人房基准，Center 2为4人房基准；报价时需按校区选择房型。' },
    { id: 'center-1-single-room-supplement', name: 'Center 1 单人房加价', fee: 198, currencyCode: 'USD', note: '多数Center 1课程单人房与2人房差额约USD198-203，正式以学校报价为准。' },
    { id: 'center-2-triple-room-supplement', name: 'Center 2 三人房加价', fee: 99, currencyCode: 'USD', note: '多数Center 2课程三人房与4人房差额约USD99-102，正式以学校报价为准。' },
    { id: 'center-2-double-room-supplement', name: 'Center 2 双人房加价', fee: 198, currencyCode: 'USD', note: '多数Center 2课程双人房与4人房差额约USD198-204，正式以学校报价为准。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:30 - 09:20', title: '早餐与准备', text: '资料页列出早餐时段，实际餐食和课程开始时间以到校安排为准。' },
    { time: '08:00 - 12:50', title: '上午课程', text: '一对一、团体课和课程方向穿插，Native课比例要按选择课程确认。' },
    { time: '12:50 - 13:40', title: '午餐', text: '校内用餐，住宿和餐食规则需按校区和房型确认。' },
    { time: '13:40 - 17:30', title: '下午课程 / 自习', text: '下午继续一对一、团体课、自习或专项训练。' },
    { time: '17:00 - 18:10', title: '晚餐', text: '晚餐后可进入选修课或自习时段。' },
    { time: '17:50 - 19:40', title: 'Native选修团体课', text: '资料页列有Native选修课时段，是否开放和名额需当期确认。' },
  ];

  localFees: LocalFee[] = [
    { item: 'Registration Fee', amount: 'USD 100', note: '资料页列出入学金USD100，不退还' },
    { item: 'SSP', amount: 'PHP 6,000', note: 'Special Study Permit，当地支付' },
    { item: 'ACR I-Card', amount: 'PHP 3,000', note: '长期停留或延签时通常需要' },
    { item: 'Visa Extension / 8 weeks', amount: 'PHP 3,630', note: '4周以内资料页列为PHP0；8周起产生延签费用' },
    { item: 'Textbook / Materials', amount: 'PHP 250-400 / book', note: '按教材种类和实际购买数量收取' },
    { item: 'Electricity', amount: 'PHP 15 / kWh', note: '按用量支付，通常每4周结算' },
    { item: 'Student Management Fee', amount: 'PHP 375-500 / week', note: '按房型或学校规则收取，需当期确认' },
    { item: 'Dormitory Deposit', amount: 'PHP 3,000', note: '退房检查后按损坏或欠费扣除后退还' },
    { item: 'Airport Pickup', amount: '需当期确认', note: 'Clark或Manila机场费用、指定接机日和同行人数需另行确认' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'person_search', title: '先确认是否仍开放招生', text: 'AELC旧官方域名无法访问，顾问需要先核对当前校区、招生和房型。' },
    { icon: 'record_voice_over', title: '核对Native课比例', text: '确认每天几节Native 1:1、几节菲律宾老师课、团体课是否固定开放。' },
    { icon: 'payments', title: '按套餐和房型重算费用', text: '旧表是课程住宿套餐价，报价时要按校区、房型、周数和入学日重新确认。' },
    { icon: 'flight_takeoff', title: '确认接机与当地费用', text: 'Clark和Manila机场接送、SSP、延签、教材、水电和押金需要分开列预算。' },
    { icon: 'support_agent', title: '报名后持续跟进', text: '如遇调课、换老师、宿舍或费用问题，顾问继续协助与学校沟通。' },
  ];

  readonly notes = [
    'AELC公开价目表为历史资料页参考，不代表2026当前学校报价；正式报名必须以学校当期回函为准。',
    '课程价格按4周课程住宿套餐列示，Center 1以2人房为基准，Center 2以4人房为基准，本页用房型加价做快速估算。',
    'Center 1资料更偏TOEIC和成人英语；Center 2资料更偏IELTS、亲子和长期海外规划，选校时不要混用校区规则。',
    'Native-focused不等于全课程都是外教授课，必须确认实际课表、老师国籍、是否固定老师和能否换老师。',
    '当地费用、签证、教材、接机、保险、个人消费和优惠不包含在USD课程住宿套餐中。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾克拉克AELC语言学校现在可以直接报名吗？', answer: '需要先复核。AELC旧官方域名目前无法解析，本页保留AELC资料页中的课程、费用和照片作为参考，但正式报名必须先确认当前招生状态、校区、空房和最新价目。' },
    { question: 'AELC适合什么学生？', answer: '适合重视Native口语、发音纠正、TOEIC、IELTS、商务沟通或Clark舒适环境的人。基础弱的学生建议先用菲律宾老师一对一打底，再搭配Native课。' },
    { question: '页面上的USD价格怎么理解？', answer: '它是公开资料页中的4周课程住宿套餐参考价，不是单纯学费。Center 1默认2人房，Center 2默认4人房，单人/双人/三人房需按差额重新确认。' },
    { question: 'AELC和CIP、EG、WE怎么比较？', answer: 'AELC和CIP更适合放在Native口语方向比较；EG课程和价目公开度更高，适合综合ESL、考试、Golf；WE更偏亲子、舒适和活动体验。' },
    { question: '如果我要亲子或低龄学生，可以选AELC吗？', answer: '可以作为候选，但必须单独确认Center 2是否开放、最低年龄、家长是否必须同行、监护、房型、餐食、接送和医疗支持。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用估算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
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
    { label: 'Philish AELC学校资料页', url: 'https://philippine-english.jp/clark/aelc.php' },
    { label: 'WorldPlaces AELC资料与旧域名记录', url: 'https://philippines.worldplaces.me/view-place/42879050-aelc-american-english-learning-center.html' },
    { label: 'Phildiary Clark英语学校概览', url: 'https://phildiary.vn/du-hoc-philippines-tai-thanh-pho-clark/' },
    { label: 'AELC亲子校区资料参考', url: 'https://www.ceburyugaku-master.com/school/aelc_american_english_learning_center2.html' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolSearchName }).pipe(
      switchMap((schools) => {
        const school =
          this.pricingSchoolNames.map((name) => schools.find((item) => item.name === name)).find(Boolean) ??
          schools.find((item) => item.name.toUpperCase().includes('AELC')) ??
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
        this.selectedCourseId =
          this.courseFees.find((course) => course.id === 'center-1-esl-double-base')?.id ?? this.courseFees[0].id;
      }
    }

    const databaseRoomFees = rooms
      .filter((room) => room.week === 4)
      .map((room) => ({
        id: this.priceKey(room.name),
        name: room.name,
        fee: room.price,
        currencyCode: this.currencyCodeForDisplay(room.currencyCode),
        note: room.description || '请联系顾问确认空房和房型差额',
      }))
      .sort((a, b) => this.orderIndex(this.roomFeeOrder, a.id) - this.orderIndex(this.roomFeeOrder, b.id));
    if (databaseRoomFees.length > 0) {
      this.roomFees = databaseRoomFees;
      if (!this.roomFees.some((room) => room.id === this.selectedRoomId)) {
        this.selectedRoomId =
          this.roomFees.find((room) => room.id === 'base-shared-room-included')?.id ?? this.roomFees[0].id;
      }
    }

    const registrationFee = fees.find((fee) => fee.name === 'Registration Fee' || fee.name === '注册费');
    if (registrationFee) {
      this.registrationFee = registrationFee.fee;
      this.registrationCurrencyCode = this.currencyCodeForDisplay(registrationFee.currencyCode);
    }

    const databaseLocalFees = fees
      .filter((fee) => fee.name !== 'Registration Fee' && fee.name !== '注册费')
      .map((fee) => ({
        item: fee.name,
        amount: fee.fee <= 0 && /确认|接机|Pickup|教材|Materials|按|需/.test(fee.description || fee.name)
          ? '需当期确认'
          : this.formatMoney(fee.fee, this.currencyCodeForDisplay(fee.currencyCode)),
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
  get tuitionForSelectedWeeks(): number { return this.selectedCourse.tuition * this.selectedWeeks / 4; }
  get roomFeeForSelectedWeeks(): number { return this.selectedRoom.fee * this.selectedWeeks / 4; }
  get quoteCurrencyCode(): string { return this.selectedCourse.currencyCode || this.selectedRoom.currencyCode || 'USD'; }
  get registrationForQuote(): number { return this.registrationCurrencyCode === this.quoteCurrencyCode ? this.registrationFee : 0; }
  get quoteAmount(): number { return this.registrationForQuote + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get quoteText(): string { return `${this.formatMoney(this.quoteAmount, this.quoteCurrencyCode)} 起`; }
  get registrationFeeText(): string { return this.registrationFee > 0 ? this.formatMoney(this.registrationFee, this.registrationCurrencyCode) : '需当期确认'; }
  get formulaText(): string { return `(${this.selectedCourse.name} + ${this.selectedRoom.name}) x ${this.selectedWeeks}周 / 4 + 注册费`; }

  formatMoney(value: number, currencyCode = 'USD'): string {
    if (value < 0) return '需当期确认';
    const decimals = ['USD', 'PHP', 'KRW'].includes(currencyCode) ? 0 : 1;
    return `${currencyCode} ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals })}`;
  }

  formatSupplement(value: number, currencyCode = 'USD'): string {
    return value <= 0 ? '已含在基准套餐' : `+ ${this.formatMoney(value, currencyCode)}`;
  }

  private priceKey(value: string): string {
    const knownKeys: Record<string, string> = {
      'Center 1 LITE / 2人房基准套餐': 'center-1-lite-double-base',
      'Center 1 ESL / 2人房基准套餐': 'center-1-esl-double-base',
      'Center 1 Semi Intensive / 2人房基准套餐': 'center-1-semi-intensive-double-base',
      'Center 1 TOEIC一般 / 2人房基准套餐': 'center-1-toeic-regular-double-base',
      'Center 1 TOEIC 800+ / 2人房基准套餐': 'center-1-toeic-800-guarantee-double-base',
      'Center 1 TOEIC 900+ / 2人房基准套餐': 'center-1-toeic-900-guarantee-double-base',
      'Center 1 AELC Intensive A / 2人房基准套餐': 'center-1-intensive-a-double-base',
      'Center 1 AELC Intensive B / 2人房基准套餐': 'center-1-intensive-b-double-base',
      'Center 2 LITE / 4人房基准套餐': 'center-2-lite-quad-base',
      'Center 2 ESL / 4人房基准套餐': 'center-2-esl-quad-base',
      'Center 2 Semi Intensive / 4人房基准套餐': 'center-2-semi-intensive-quad-base',
      'Center 2 IELTS 5.5/6.0 / 4人房基准套餐': 'center-2-ielts-55-60-guarantee-quad-base',
      'Center 2 IELTS 6.5/7.0 / 4人房基准套餐': 'center-2-ielts-65-70-guarantee-quad-base',
      'Center 2 Intensive A / 4人房基准套餐': 'center-2-intensive-a-quad-base',
      'Center 2 Intensive B / 4人房基准套餐': 'center-2-intensive-b-quad-base',
      '基准多人房已含': 'base-shared-room-included',
      'Center 1 单人房加价': 'center-1-single-room-supplement',
      'Center 2 三人房加价': 'center-2-triple-room-supplement',
      'Center 2 双人房加价': 'center-2-double-room-supplement',
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
    return !code ? 'USD' : code.toUpperCase() === 'PESO' ? 'PHP' : code.toUpperCase();
  }

  private cleanFeeDescription(description?: string): string {
    return description ? description.replace(/^到校支付费用；/, '').replace(/^前期支付费用；/, '') : '以学校现场收费为准';
  }
}
