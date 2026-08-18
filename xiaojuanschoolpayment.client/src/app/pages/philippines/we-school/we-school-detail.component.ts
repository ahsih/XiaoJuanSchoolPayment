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
    'esl-3-guardian',
    'esl-4',
    'esl-5',
    'esl-6',
    'native-mix-light',
    'native-mix-general',
    'native-mix-intensive',
    'toeic',
    'toefl',
    'ielts',
    'junior-esl',
    'junior-native-esl',
    'kinder-esl',
    'esl-golf',
    'esl-golf-round',
  ];
  private readonly roomFeeOrder = [
    'single-room',
    'double-room',
    'triple-room',
    'quad-room',
    'apartment-single-1',
    'apartment-single-2',
    'apartment-double-2',
    'apartment-double-3',
    'apartment-double-4',
  ];

  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '亲子', '活动'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId = 'native-mix-general';
  selectedRoomId = 'quad-room';
  selectedWeeks = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;
  registrationFee = 100;
  registrationCurrencyCode = 'USD';
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
    { label: '费用状态', value: '2026年4周课程与住宿以USD列价；注册费USD100' },
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
    { title: '只看标价、不核对到校费用', text: '2026价目表列出4周课程和住宿，但SSP、教材、押金、水电和接机等仍需另行确认。' },
    { title: '目标是高压雅思冲刺', text: 'WE更偏舒适、亲子和口语体验；强制模考和晚自习应同步比较碧瑶或考试型学校。' },
    { title: '需要严格门禁管理', text: '官网强调成人18岁以上无宵禁，若学生需要强管理，应谨慎选择。' },
    { title: '只看英语课不看活动预算', text: 'Golf、Swimming、外出活动、接机和本地费用要另列，不能只看课程名称。' },
  ];

  readonly courses: CourseItem[] = [
    { name: 'ESL 3-6', type: '一般英语', lessons: '每日3-6节菲教一对一；ESL 4-6加2节小组课和1节选修', suitable: 'ESL 3仅限监护人；ESL 4-6按希望的一对一强度选择。' },
    { name: 'Native Mix', type: 'Native口语强化', lessons: '3节菲教一对一 + 每日1-3节外教一对一 + 2节小组课 + 1节选修', suitable: '适合发音、语调、自然表达、working holiday或欧美学习准备。' },
    { name: 'TOEIC / TOEFL / IELTS', type: '考试英语', lessons: '6节外教一对一 + 1节菲教小组课 + 1节选修', suitable: '适合需要托业、托福或雅思专项课程的学生。' },
    { name: 'Junior ESL', type: '青少年ESL', lessons: '5节菲教一对一 + 1节菲教小组课', suitable: '适合小学到初中阶段，需确认年龄、程度和同行监护。' },
    { name: 'Junior Native ESL', type: '青少年Native', lessons: '3节菲教一对一 + 1节菲教小组课 + 2节外教一对一', suitable: '适合希望孩子接触自然发音和外教沟通的家庭。' },
    { name: 'Kinder ESL', type: '低龄儿童', lessons: '8节菲教团体课', suitable: '适合低龄儿童，需确认年龄、班级人数和照顾安排。' },
    { name: 'ESL + GOLF', type: '英语 + 高尔夫', lessons: '3节菲教一对一 + 1节高尔夫 + 1节选修；ROUND课程每周加1次实地课', suitable: '适合成人、家庭或希望把运动体验加入游学的人。' },
    { name: 'Swimming Lesson', type: '活动课程', lessons: '私教、小组或3-5人大组课程', suitable: '适合亲子家庭和想使用校内泳池资源的学生。' },
  ];

  courseFees: CourseFee[] = [
    { id: 'esl-3-guardian', name: 'ESL 3（监护人）', tuition: 650, currencyCode: 'USD', suitable: '3节菲教一对一；仅限监护人' },
    { id: 'esl-4', name: 'ESL 4', tuition: 750, currencyCode: 'USD', suitable: '4节菲教一对一 + 2节菲教小组课 + 1节选修' },
    { id: 'esl-5', name: 'ESL 5', tuition: 850, currencyCode: 'USD', suitable: '5节菲教一对一 + 2节菲教小组课 + 1节选修' },
    { id: 'esl-6', name: 'ESL 6', tuition: 950, currencyCode: 'USD', suitable: '6节菲教一对一 + 2节菲教小组课 + 1节选修' },
    { id: 'native-mix-light', name: 'NATIVE MIX LIGHT', tuition: 900, currencyCode: 'USD', suitable: '3节菲教一对一 + 1节外教一对一 + 2节菲教小组课 + 1节选修' },
    { id: 'native-mix-general', name: 'NATIVE MIX GENERAL', tuition: 1100, currencyCode: 'USD', suitable: '3节菲教一对一 + 2节外教一对一 + 2节菲教小组课 + 1节选修' },
    { id: 'native-mix-intensive', name: 'NATIVE MIX INTENSIVE', tuition: 1300, currencyCode: 'USD', suitable: '3节菲教一对一 + 3节外教一对一 + 2节菲教小组课 + 1节选修' },
    { id: 'toeic', name: 'TOEIC / 托业', tuition: 1050, currencyCode: 'USD', suitable: '6节外教一对一 + 1节菲教小组课 + 1节选修' },
    { id: 'toefl', name: 'TOEFL / 托福', tuition: 1050, currencyCode: 'USD', suitable: '6节外教一对一 + 1节菲教小组课 + 1节选修' },
    { id: 'ielts', name: 'IELTS / 雅思', tuition: 1050, currencyCode: 'USD', suitable: '6节外教一对一 + 1节菲教小组课 + 1节选修' },
    { id: 'junior-esl', name: 'Junior ESL', tuition: 950, currencyCode: 'USD', suitable: '5节菲教一对一 + 1节菲教小组课' },
    { id: 'junior-native-esl', name: 'Junior Native ESL', tuition: 1250, currencyCode: 'USD', suitable: '3节菲教一对一 + 1节菲教小组课 + 2节外教一对一' },
    { id: 'kinder-esl', name: 'Kinder ESL', tuition: 1150, currencyCode: 'USD', suitable: '8节菲教团体课' },
    { id: 'esl-golf', name: 'ESL + GOLF', tuition: 1100, currencyCode: 'USD', suitable: '3节菲教一对一 + 1节高尔夫 + 1节选修' },
    { id: 'esl-golf-round', name: 'ESL + GOLF & ROUND', tuition: 1700, currencyCode: 'USD', suitable: '3节菲教一对一 + 1节高尔夫 + 1节选修 + 每周1次实地课程' },
  ];

  roomFees: RoomFee[] = [
    { id: 'single-room', name: '单人间', fee: 1100, currencyCode: 'USD', note: '2026年4周住宿费' },
    { id: 'double-room', name: '双人间', fee: 850, currencyCode: 'USD', note: '2026年4周住宿费' },
    { id: 'triple-room', name: '三人间', fee: 750, currencyCode: 'USD', note: '2026年4周住宿费' },
    { id: 'quad-room', name: '四人间', fee: 650, currencyCode: 'USD', note: '2026年4周住宿费；普通房型中最低预算选项' },
    { id: 'apartment-single-1', name: '公寓单人间（1人入住）', fee: 1700, currencyCode: 'USD', note: '2026年4周住宿费' },
    { id: 'apartment-single-2', name: '公寓单人间（2人入住）', fee: 1150, currencyCode: 'USD', note: '2026年4周住宿费' },
    { id: 'apartment-double-2', name: '公寓双人间（2人入住）', fee: 1400, currencyCode: 'USD', note: '2026年4周住宿费' },
    { id: 'apartment-double-3', name: '公寓双人间（3人入住）', fee: 1000, currencyCode: 'USD', note: '2026年4周住宿费' },
    { id: 'apartment-double-4', name: '公寓双人间（4人入住）', fee: 850, currencyCode: 'USD', note: '2026年4周住宿费' },
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
    { item: 'Registration Fee', amount: 'USD 100', note: '2026年价目表列出的一次性报名注册费' },
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
    { icon: 'king_bed', title: '核对房型空位', text: '在单人间、双人间、三人间、四人间和公寓房型中选择，并按入学日确认空位。' },
    { icon: 'payments', title: '拆分4周主费和到校费用', text: '课程、住宿和注册费可按2026价目表先算；SSP、教材、押金、水电、接机和活动需另行确认。' },
    { icon: 'support_agent', title: '正式报名与到校跟进', text: '确认学校回函、付款节点、航班接机、行前提醒和到校后的调课沟通。' },
  ];

  readonly notes = [
    '2026年价目表列出4周USD课程费、住宿费和USD100注册费；其他周数的计价规则需由学校确认。',
    '官网公开活动价：Golf Private Class PHP750/次；Swimming Private PHP700/次，Small Group PHP600/次，Big Group 3-5人 PHP500/次。',
    'Golf Round Course包含交通和课程费用，但green fee、caddie fee和cart rental需要现场另付。',
    'Native Mix、Junior Native、Guardian ESL、Kindergarten和13-15岁solo junior支持都要按年龄、英文程度、周数和房型确认。',
    '官网说明18岁以上成人无宵禁；未成年学生规则、外出、医疗、保险和监护安排必须在报名时单独确认。',
  ];

  readonly faqs: FaqItem[] = [
    { question: '菲律宾克拉克WE Academy语言学校适合亲子吗？', answer: '适合重点比较。官网强调Family Program、校内WE Kindergarten、Junior ESL / Junior Native、Guardian ESL和校内泳池活动，适合低龄与家庭同行。' },
    { question: 'WE 2026年4周课程和住宿怎么计算？', answer: '按选定的4周课程费 + 4周住宿费 + 一次性注册费USD100计算。SSP、教材、押金、水电、接机和活动等到校费用需另行确认。' },
    { question: 'WE和EG、CIP怎么选？', answer: 'WE更偏亲子、自由舒适和活动体验；CIP更强调Native一对一与口语纠音；EG课程价目公开度更高，也可比较ESL、考试、Native和Golf组合。' },
    { question: 'WE适合雅思冲刺吗？', answer: '如果目标是短期高压雅思冲分，WE通常不是第一优先。建议同步看EG、CIP或碧瑶强管理学校，并确认模考和自习制度。' },
    { question: 'WE的Golf和Swimming怎么收费？', answer: '官网Golf页列出Golf Private Class PHP750/次；Swimming页列出私教PHP700/次，小组PHP600/次，3-5人大组PHP500/次。Golf Round现场费用另付。' },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程方向', target: 'courses', icon: 'menu_book' },
    { label: '费用报价', target: 'quote', icon: 'request_quote' },
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
        this.selectedCourseId = this.courseFees.find((course) => course.id === 'native-mix-general')?.id ?? this.courseFees[0].id;
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
        this.selectedRoomId = this.roomFees.find((room) => room.id === 'quad-room')?.id ?? this.roomFees[0].id;
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
  get quoteText(): string {
    const sameCurrency =
      this.selectedCourse.currencyCode === 'USD' &&
      this.selectedRoom.currencyCode === 'USD' &&
      this.registrationCurrencyCode === 'USD';
    if (!sameCurrency || !this.selectedCourse.tuition || !this.selectedRoom.fee) return '需顾问确认';

    const fourWeekTotal = this.selectedCourse.tuition + this.selectedRoom.fee + this.registrationFee;
    const totalText = this.formatMoney(fourWeekTotal, 'USD');
    return this.selectedWeeks === 4
      ? `4周参考合计 ${totalText}（含注册费）`
      : `4周参考合计 ${totalText}；${this.selectedWeeks}周价格需学校确认`;
  }
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
      'ESL 3（监护人）': 'esl-3-guardian',
      'ESL 4': 'esl-4',
      'ESL 5': 'esl-5',
      'ESL 6': 'esl-6',
      'NATIVE MIX LIGHT': 'native-mix-light',
      'NATIVE MIX GENERAL': 'native-mix-general',
      'NATIVE MIX INTENSIVE': 'native-mix-intensive',
      'TOEIC / 托业': 'toeic',
      'TOEFL / 托福': 'toefl',
      'IELTS / 雅思': 'ielts',
      'Junior ESL': 'junior-esl',
      'Junior Native ESL': 'junior-native-esl',
      'Kinder ESL': 'kinder-esl',
      'ESL + GOLF': 'esl-golf',
      'ESL + GOLF & ROUND': 'esl-golf-round',
      '单人间': 'single-room',
      '双人间': 'double-room',
      '三人间': 'triple-room',
      '四人间': 'quad-room',
      '公寓单人间（1人入住）': 'apartment-single-1',
      '公寓单人间（2人入住）': 'apartment-single-2',
      '公寓双人间（2人入住）': 'apartment-double-2',
      '公寓双人间（3人入住）': 'apartment-double-3',
      '公寓双人间（4人入住）': 'apartment-double-4',
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
