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
type WeekOption = 4 | 8 | 12 | 16 | 20 | 24;
type CourseId =
  | 'esl-youth-a'
  | 'esl-youth-b'
  | 'esl-youth-c'
  | 'exam-business-a'
  | 'exam-business-b'
  | 'exam-business-c'
  | 'guardian'
  | 'kindergarten';
type RoomId = 'triple' | 'double' | 'single';

interface QuickInfo {
  icon: string;
  label: string;
  value: string;
  note: string;
}

interface GalleryImage {
  category: Exclude<GalleryCategory, '全部'>;
  title: string;
  description: string;
  src: string;
}

interface BasicInfoRow {
  label: string;
  value: string;
}

interface Highlight {
  image: string;
  title: string;
  text: string;
}

interface FitItem {
  title: string;
  text: string;
}

interface CourseOption {
  id: CourseId;
  name: string;
  type: string;
  lessons: string;
  suitable: string;
  fee4w: number;
}

interface RoomOption {
  id: RoomId;
  name: string;
  fee4w: number;
  note: string;
}

interface LocalFee {
  item: string;
  amount: string;
  note: string;
}

interface LocalFeeGuide {
  weeks: WeekOption;
  title: string;
  text: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  text: string;
}

interface ProcessStep {
  icon: string;
  title: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SideNavItem {
  label: string;
  target: string;
  icon: string;
}

interface SourceLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-eroom-school',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './eroom-school.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    '../ev-school/ev-school-detail.component.css',
    './eroom-school.component.css',
  ],
})
export class EroomSchoolComponent implements OnInit {
  private readonly schoolService = inject(SchoolService);
  private readonly pricingSchoolName = '菲律宾巴科洛德E-Room Language Center';
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '课堂', '住宿', '生活'];
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedCourseId: CourseId = 'esl-youth-a';
  selectedRoomId: RoomId = 'triple';
  selectedWeeks: WeekOption = 4;
  selectedStartDate = '2026-09-07';
  quoteCalculated = false;

  registrationFeeUsd = 100;
  readonly weekOptions: WeekOption[] = [4, 8, 12, 16, 20, 24];

  readonly quickInfo: QuickInfo[] = [
    {
      icon: 'location_on',
      label: '城市',
      value: 'Bacolod / Magsaysay Ave',
      note: '官方地址位于Bacolod, Negros Occidental的Magsaysay Ave一带，城市节奏比宿务更安静。',
    },
    {
      icon: 'school',
      label: '学习模式',
      value: 'Classic 或 Semi-Sparta',
      note: '官方费用表把Classic和Semi-Sparta列为同价，学生报名时需确认管理模式。',
    },
    {
      icon: 'menu_book',
      label: '课程方向',
      value: 'ESL / 青少年 / IELTS / TOEIC / 商务 / 幼儿园',
      note: '2024费用表列出ESL/青少年A-C、考试/商务A-C、监护人和幼儿园课程。',
    },
    {
      icon: 'home_work',
      label: '住宿餐食',
      value: '校内住宿 + 三餐',
      note: '官方费用说明列住宿含平日和周末三餐、每周3次清洁与洗衣服务。',
    },
    {
      icon: 'sports_basketball',
      label: '校园设施',
      value: '泳池 / 篮球场 / 24小时警卫',
      note: '学校介绍提到宿舍型校园、活动设施、校内管理和24小时警卫。',
    },
    {
      icon: 'payments',
      label: '4周常见起步',
      value: 'USD 1,250 + 当地费',
      note: '按ESL/青少年Course A + 三人间 + USD 100注册费估算。',
    },
  ];

  readonly galleryImages: GalleryImage[] = [
    {
      category: '校园',
      title: 'E-Room Bacolod校园外观',
      description: 'Bacolod安静城市里的校内住宿型语言学校，适合预算友好型长期学习。',
      src: 'https://www.cebu-55.com/common/img/detail/eroom/04.jpg',
    },
    {
      category: '课堂',
      title: '一对一学习环境',
      description: '课程以一对一课时为核心，ESL、IELTS和TOEIC可按课量选择。',
      src: 'https://www.cebu-55.com/common/img/detail/eroom/02.jpg',
    },
    {
      category: '住宿',
      title: '单人房住宿参考',
      description: '公开住宿图片用于初步判断房间氛围，实际楼栋和房型以学校确认空房为准。',
      src: 'https://www.eslpass.com/userfiles/images/Bacolod/E-ROOM/single.jpg',
    },
    {
      category: '生活',
      title: '校内学习与接待空间',
      description: '适合想把课堂、住宿、餐食和日常管理集中在同一校园内的学生。',
      src: 'https://storage.googleapis.com/world-study-prod/media/school_photo/831/ff012031-abbc-4c47-9002-741f4d098f74.jpg',
    },
    {
      category: '校园',
      title: '宿舍与泳池设施',
      description: '学校亮点包含宿舍型校园、泳池、篮球场、洗衣清洁和生活支持。',
      src: 'https://www.philja.com/school/sch_img/eroom/main4.jpg',
    },
  ];

  readonly basicInfo: BasicInfoRow[] = [
    { label: '学校名称', value: '菲律宾巴科洛德E-Room Language Center' },
    { label: '英文名称', value: 'E-Room Language Center / EROOM / 이룸어학원' },
    { label: '城市区域', value: 'Bacolod City, Negros Occidental' },
    { label: '官方地址', value: 'Lot 1, Block 3 Magsaysay Ave, Bacolod, 6100 Negros Occidental, Philippines' },
    { label: '联系方式参考', value: 'Tel: +63-34-703-1377 / Email: malkim78@gmail.com' },
    { label: '学校历史', value: '公开历史页显示学校2005年开办，2022年完成专用校舍。' },
    { label: '课程方向', value: 'ESL/青少年、IELTS/TOEIC/商务英语、监护人和幼儿园课程。' },
    { label: '费用币种', value: '所附2024费用表以USD列课程、住宿和注册费；SSP、I-Card、电水、押金、教材和签证等当地费用另行确认。' },
  ];

  readonly highlights: Highlight[] = [
    {
      image: this.galleryImages[0].src,
      title: 'Bacolod低干扰城市',
      text: 'E-Room适合想避开大城市和海岛热闹环境，在更安静节奏中稳定上课的学生。',
    },
    {
      image: this.galleryImages[1].src,
      title: 'Classic与Semi-Sparta可选',
      text: '官方费用表把两种管理模式放在同一价格体系，适合先按学习自律度选择强度。',
    },
    {
      image: this.galleryImages[4].src,
      title: '校内住宿生活一体',
      text: '住宿费包含三餐、清洁和洗衣基础服务，校内还有泳池、篮球场和24小时警卫。',
    },
    {
      image: this.galleryImages[3].src,
      title: '成人、家庭、青少年都能选',
      text: '除成人ESL和考试课程外，2024费用表也列出青少年、监护人和幼儿园课程，适合家庭一起比较。',
    },
  ];

  readonly suitableFor: FitItem[] = [
    { title: '想控制预算读ESL', text: 'Bacolod生活成本通常更温和，E-Room三人间和ESL Course A适合先做预算。' },
    { title: '想在安静城市长期学习', text: '不追求海边度假或大城市夜生活，更适合8到24周稳定打基础。' },
    { title: '需要一点管理推动', text: 'Semi-Sparta、门禁、测试和出勤规则适合需要学校帮忙维持节奏的学生。' },
    { title: '家庭或青少年路线比较', text: '青少年、监护人和幼儿园课程在2024费用表中单独列出，适合亲子或未成年路线初筛。' },
  ];

  readonly notSuitableFor: FitItem[] = [
    { title: '想要海岛度假感', text: 'E-Room是Bacolod市区学习型校园，不是宿务Mactan或长滩岛的海边体验。' },
    { title: '只看USD学费和住宿', text: 'SSP、签证、电水、押金和教材等当地费用仍需另外核对。' },
    { title: '希望全外教或美式小班', text: '这页重点不是Native-only路线，外教比例和老师安排需当期确认。' },
    { title: '不想遵守门禁和测试', text: '学校规则列出门禁、出勤和测试要求，不适合完全自由型学习期待。' },
  ];

  courses: CourseOption[] = [
    {
      id: 'esl-youth-a',
      name: 'ESL / 青少年 Course A',
      type: 'ESL / Youth',
      lessons: '5节一对一 + 1节团体课 + 1节选修课',
      suitable: '适合希望兼顾一对一训练与团体互动的成人或青少年。',
      fee4w: 600,
    },
    {
      id: 'esl-youth-b',
      name: 'ESL / 青少年 Course B',
      type: 'ESL / Youth',
      lessons: '6节一对一 + 1节团体课 + 1节选修课',
      suitable: '适合想增加一对一练习量、加快口语和基础提升的学生。',
      fee4w: 670,
    },
    {
      id: 'esl-youth-c',
      name: 'ESL / 青少年 Course C',
      type: 'ESL / Youth',
      lessons: '7节一对一 + 1节团体课 + 1节选修课',
      suitable: '适合短期高密度学习或希望获得更多个别纠正的学生。',
      fee4w: 740,
    },
    {
      id: 'exam-business-a',
      name: 'IELTS / TOEIC / 商务英语 Course A',
      type: 'Exam / Business',
      lessons: '5节一对一 + 1节团体课 + 1节选修课',
      suitable: '适合刚开始备考或想系统学习商务英语的学生。',
      fee4w: 730,
    },
    {
      id: 'exam-business-b',
      name: 'IELTS / TOEIC / 商务英语 Course B',
      type: 'Exam / Business',
      lessons: '6节一对一 + 1节团体课 + 1节选修课',
      suitable: '适合有明确考试或商务目标、需要更多一对一反馈的学生。',
      fee4w: 800,
    },
    {
      id: 'exam-business-c',
      name: 'IELTS / TOEIC / 商务英语 Course C',
      type: 'Exam / Business',
      lessons: '7节一对一 + 1节团体课 + 1节选修课',
      suitable: '适合短期考试冲刺或高密度商务英语训练。',
      fee4w: 870,
    },
    {
      id: 'guardian',
      name: '监护人课程',
      type: 'Parent / Guardian',
      lessons: '4节一对一',
      suitable: '必须与青少年学生一起报名，不可单独报名，且不能选择单人间。',
      fee4w: 450,
    },
    {
      id: 'kindergarten',
      name: '幼儿园课程',
      type: 'Kindergarten',
      lessons: '6小时（09:00-16:00，含1小时休息）',
      suitable: '休息时段需由家长自行接送，具体安排请在报名时确认。',
      fee4w: 990,
    },
  ];

  roomOptions: RoomOption[] = [
    { id: 'triple', name: '三人间 / Triple', fee4w: 550, note: '2024费用表中价格最低的房型。' },
    { id: 'double', name: '双人间 / Double', fee4w: 600, note: '适合朋友同行、亲子或希望兼顾预算与空间的学生。' },
    { id: 'single', name: '单人间 / Single', fee4w: 750, note: '监护人课程不能选择单人间。' },
  ];

  readonly localFeeGuides: LocalFeeGuide[] = [
    { weeks: 4, title: '4周', text: '通常重点准备SSP、ID、宿舍押金、电水、教材和个人消费；签证延期通常从4周后开始。' },
    { weeks: 8, title: '8周', text: '需预留第一次签证延期PHP4,360，长期学习通常还要看ACR I-Card是否适用。' },
    { weeks: 12, title: '12周', text: '在8周基础上增加第二次签证延期PHP5,630，电水和教材也会随周数增加。' },
    { weeks: 16, title: '16周', text: '继续增加签证延期PHP3,660，并按每周PHP500估算水费和管理费。' },
    { weeks: 20, title: '20周', text: '继续增加签证延期PHP3,660，建议报名时请学校列正式当地费用清单。' },
    { weeks: 24, title: '24周', text: '继续增加签证延期PHP3,660，长期学生需特别核对I-Card、签证和房型空位。' },
  ];

  readonly localFees: LocalFee[] = [
    { item: 'Registration', amount: 'USD 100', note: '所附2024费用表列示的注册费。' },
    { item: 'SSP', amount: 'PHP 7,200', note: 'Special Study Permit，官方列6个月有效。' },
    { item: 'ACR I-Card', amount: 'PHP 4,060', note: '官方列1年有效，通常长期学习需确认。' },
    { item: 'Student ID', amount: 'PHP 200', note: '学生证发行费。' },
    { item: 'Electricity', amount: '约PHP 500-1,000 / 4周', note: '按实际用量收取，官方列PHP20/kW参考。' },
    { item: 'Water & Management', amount: 'PHP 500 / 周', note: '水费及管理费按周计算。' },
    { item: 'Books', amount: 'PHP 250-450 / 本', note: '按课程实际教材购买。' },
    { item: 'Dorm Deposit', amount: 'PHP 3,000', note: '宿舍押金，退房检查后按规则退还。' },
    { item: 'Visa Extension', amount: 'PHP 4,360起', note: '官方列4周后4,360，8周后5,630，后续每阶段3,660。' },
  ];

  readonly schedule: ScheduleItem[] = [
    { time: '07:30 - 08:50', title: 'Semi-Sparta早间词汇测试', text: '选择Semi-Sparta的学生通常会有更明确的早间学习节奏。' },
    { time: '08:00 - 12:00', title: '上午一对一 / 小组课', text: '按ESL、Business、IELTS或TOEIC安排口语、语法、听力、阅读和考试技巧。' },
    { time: '12:00 - 13:00', title: '午餐与休息', text: '住宿费包含平日和周末三餐，适合想省去通勤和餐食安排的学生。' },
    { time: '13:00 - 17:00', title: '下午课程与补强', text: 'Course B和Course C会增加一对一课时，适合加强输出和老师反馈。' },
    { time: '晚上', title: '免费夜间选修课', text: '公开教育系统资料提到周一到周五可选TOEIC/IELTS、发音、语法、会话等夜间课。' },
    { time: '周末', title: 'Bacolod生活与活动', text: '青少年和家庭的周末安排需逐项确认；成人外出仍需遵守门禁和校规。' },
  ];

  readonly serviceSteps: ProcessStep[] = [
    { icon: 'location_city', title: '先确认是否适合Bacolod', text: '如果你想低预算、安静、长期学习，E-Room更对题；想海岛和大城市则同步比较宿务。' },
    { icon: 'rule', title: '选择Classic或Semi-Sparta', text: '先判断自律度和门禁接受度，再决定管理模式，费用表目前列为同价。' },
    { icon: 'menu_book', title: '按课量选课程', text: 'Course A、B、C主要差在每天的一对一课时；考试和商务课程价格另列。' },
    { icon: 'hotel', title: '锁定房型与周数', text: '三人间到单人间价格差明显；监护人课程不能选择单人间。' },
    { icon: 'receipt_long', title: '拆分USD和PHP', text: '所附2024表中的课程、住宿和注册费按USD看；SSP、签证、电水、押金和教材等当地费用另行确认。' },
    { icon: 'verified', title: '核对正式Invoice', text: '报名前确认当期费用、优惠、空房、接机、门禁、测试和退费规则。' },
  ];

  readonly notes = [
    '官方规则说明在线或线下申请后，注册费需在3天内缴纳，课程费用需至少在入境菲律宾4周前付清。',
    '家庭课程学生官方费用页注明只能申请Classic过程，不能默认套用Semi-Sparta。',
    '官方规则列每周二申请换课或换老师，周四生效；结课前2周通常不可更换。',
    '官方规则列证书最低出勤率75%，缺勤、迟到、门禁和测试违反可能影响证书或押金。',
    '宿舍规则列洗衣和清洁每周3次，床单每2周更换，安静时间为22:00到07:00。',
    '费用、校规、假期无课和签证政策可能变化，正式报名要以学校当期invoice和学生手册为准。',
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'E-Room Language Center在哪里？',
      answer:
        '官方地址是Lot 1, Block 3 Magsaysay Ave, Bacolod, 6100 Negros Occidental, Philippines，属于巴科洛德市区学习型校园。',
    },
    {
      question: 'E-Room 4周大概多少钱？',
      answer:
        '按所附2024费用表，ESL/青少年Course A为USD600，三人间USD550，注册费USD100，4周常见起步参考为USD1,250，另有当地费用。',
    },
    {
      question: 'Classic和Semi-Sparta费用一样吗？',
      answer:
        '学校公开资料曾把Classic与Semi-Sparta列在同一价格体系；所附2024费用表提醒两者每天日程安排不同，报名时仍要确认当期管理规则和可选模式。',
    },
    {
      question: 'E-Room适合亲子或青少年吗？',
      answer:
        '可以作为候选。所附2024费用表列出ESL/青少年、监护人和幼儿园课程。监护人必须与青少年学生一起报名且不能选择单人间；幼儿园课程的休息时段需由家长自行接送。',
    },
    {
      question: '为什么费用同时有USD和PHP？',
      answer:
        '所附2024费用表以USD列课程费、住宿费和注册费；SSP、I-Card、签证、电水、教材、押金等当地费用通常以PHP确认。',
    },
  ];

  readonly sideNav: SideNavItem[] = [
    { label: '学校环境', target: 'gallery', icon: 'image' },
    { label: '课程费用', target: 'course-fees', icon: 'menu_book' },
    { label: '费用估算', target: 'quote', icon: 'calculate' },
    { label: '当地费用', target: 'local-fees', icon: 'payments' },
    { label: '服务流程', target: 'service-process', icon: 'task_alt' },
    { label: '资料来源', target: 'sources', icon: 'link' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly mobileAnchors: SideNavItem[] = [
    { label: '概览', target: 'top', icon: 'dashboard' },
    { label: '环境', target: 'gallery', icon: 'image' },
    { label: '课程', target: 'course-fees', icon: 'menu_book' },
    { label: '报价', target: 'quote', icon: 'calculate' },
    { label: '费用', target: 'local-fees', icon: 'receipt_long' },
    { label: 'FAQ', target: 'faq', icon: 'help' },
  ];

  readonly sources: SourceLink[] = [
    { label: 'E-Room官方首页', url: 'https://www.e-room.org/' },
    { label: 'E-Room官方课程与费用页', url: 'https://www.e-room.org/theme/sample135/html/sub05.php' },
    { label: 'E-Room官方位置页', url: 'https://www.e-room.org/theme/sample135/html/location.php' },
    { label: 'E-Room官方校规页', url: 'https://www.e-room.org/theme/sample135/html/law.php' },
    { label: 'E-Room官方优势介绍', url: 'https://www.e-room.org/theme/sample135/html/company_intro.php' },
    { label: 'E-Room官方教育系统', url: 'https://www.e-room.org/theme/sample135/html/sub01.php' },
    { label: 'E-Room官方历史页', url: 'https://www.e-room.org/theme/sample135/html/history.php' },
  ];

  ngOnInit(): void {
    this.loadPricingFromDatabase();
  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: 'E-Room' }).pipe(
      switchMap((schools) => {
        const school =
          schools.find((item) => item.name === this.pricingSchoolName) ??
          schools.find((item) => item.name.includes('E-Room')) ??
          schools.find((item) => item.name.includes('EROOM')) ??
          schools[0];

        if (!school?.id) {
          return EMPTY;
        }

        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees }) => {
      this.applyPricingData(lessons, rooms, fees);
    });
  }

  private applyPricingData(
    lessons: SchoolLessonDTO[],
    rooms: SchoolRoomDTO[],
    fees: SchoolFeeDTO[],
  ): void {
    const courseIdsByName: Record<string, CourseId> = {
      'ESL / 青少年 Course A': 'esl-youth-a',
      'ESL / 青少年 Course B': 'esl-youth-b',
      'ESL / 青少年 Course C': 'esl-youth-c',
      'IELTS / TOEIC / 商务英语 Course A': 'exam-business-a',
      'IELTS / TOEIC / 商务英语 Course B': 'exam-business-b',
      'IELTS / TOEIC / 商务英语 Course C': 'exam-business-c',
      监护人课程: 'guardian',
      幼儿园课程: 'kindergarten',
    };

    for (const lesson of lessons.filter((item) => item.week === 4 && this.isUsd(item.currencyCode, item.currencyId))) {
      const courseId = courseIdsByName[lesson.name];
      const course = this.courses.find((item) => item.id === courseId);
      if (!course) continue;

      course.fee4w = lesson.price;
      course.lessons = lesson.description || course.lessons;
      if ((course.id === 'guardian' || course.id === 'kindergarten') && lesson.note) {
        course.suitable = lesson.note;
      }
    }

    const roomIdsByName: Record<string, RoomId> = {
      '三人间 / Triple': 'triple',
      '双人间 / Double': 'double',
      '单人间 / Single': 'single',
    };

    for (const roomData of rooms.filter((item) => item.week === 4 && this.isUsd(item.currencyCode, item.currencyId))) {
      const roomId = roomIdsByName[roomData.name];
      const room = this.roomOptions.find((item) => item.id === roomId);
      if (!room) continue;

      room.fee4w = roomData.price;
      room.note = roomData.description || room.note;
    }

    const registrationFee = fees.find(
      (fee) => fee.name === '注册费' && this.isUsd(fee.currencyCode, fee.currencyId),
    );
    if (registrationFee) {
      this.registrationFeeUsd = registrationFee.fee;
      const registrationRow = this.localFees.find((fee) => fee.item === 'Registration');
      if (registrationRow) {
        registrationRow.amount = this.formatUsd(registrationFee.fee);
      }
    }

    const startingCourse = this.courses.find((course) => course.id === 'esl-youth-a') ?? this.courses[0];
    const startingRoom = this.roomOptions.find((room) => room.id === 'triple') ?? this.roomOptions[0];
    const startingPrice = this.registrationFeeUsd + startingCourse.fee4w + startingRoom.fee4w;
    const startingPriceCard = this.quickInfo.find((item) => item.label === '4周常见起步');
    if (startingPriceCard) {
      startingPriceCard.value = `${this.formatUsd(startingPrice)} + 当地费`;
      startingPriceCard.note = `按${startingCourse.name} + ${startingRoom.name} + ${this.formatUsd(this.registrationFeeUsd)}注册费估算。`;
    }

    const priceFaq = this.faqs.find((item) => item.question === 'E-Room 4周大概多少钱？');
    if (priceFaq) {
      priceFaq.answer = `按数据库中的2024费用，${startingCourse.name}为${this.formatUsd(startingCourse.fee4w)}，${startingRoom.name}为${this.formatUsd(startingRoom.fee4w)}，注册费${this.formatUsd(this.registrationFeeUsd)}，4周常见起步参考为${this.formatUsd(startingPrice)}，另有当地费用。`;
    }
  }

  private isUsd(currencyCode: string | undefined, currencyId: number): boolean {
    return currencyCode === 'USD' || currencyId === 1;
  }

  get filteredGalleryImages(): GalleryImage[] {
    return this.selectedGalleryCategory === '全部'
      ? this.galleryImages
      : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);
  }

  get selectedCourse(): CourseOption {
    return this.courses.find((course) => course.id === this.selectedCourseId) ?? this.courses[0];
  }

  get selectedRoom(): RoomOption {
    return this.roomOptions.find((room) => room.id === this.selectedRoomId) ?? this.roomOptions[0];
  }

  get selectedLocalFeeGuide(): LocalFeeGuide {
    return this.localFeeGuides.find((fee) => fee.weeks === this.selectedWeeks) ?? this.localFeeGuides[0];
  }

  get tuitionForSelectedWeeks(): number {
    return this.selectedCourse.fee4w * (this.selectedWeeks / 4);
  }

  get roomFeeForSelectedWeeks(): number {
    return this.selectedRoom.fee4w * (this.selectedWeeks / 4);
  }

  get quoteUsd(): number {
    return this.registrationFeeUsd + this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks;
  }

  get quoteText(): string {
    return `${this.formatUsd(this.quoteUsd)} 起`;
  }

  get fourWeekStartingText(): string {
    const courseA = this.courses.find((course) => course.id === 'esl-youth-a') ?? this.courses[0];
    return this.formatUsd(this.registrationFeeUsd + courseA.fee4w + this.roomOptions[0].fee4w);
  }

  get formulaText(): string {
    return `${this.selectedCourse.name} ${this.selectedWeeks}周课程费 + ${this.selectedRoom.name}住宿费 + 注册费`;
  }

  get courseFeeRows() {
    return this.courses.map((course) => ({
      course: course.name,
      tuition: this.formatUsd(course.fee4w),
      triple: this.formatUsd(course.fee4w + this.roomOptions[0].fee4w),
      double: this.formatUsd(course.fee4w + this.roomOptions[1].fee4w),
      single: course.id === 'guardian' ? '不可选择' : this.formatUsd(course.fee4w + this.roomOptions[2].fee4w),
      suitable: course.suitable,
    }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  onCourseChanged(): void {
    if (this.selectedCourseId === 'guardian' && this.selectedRoomId === 'single') {
      this.selectedRoomId = 'triple';
    }
  }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();
    const targetElement = document.getElementById(target);
    if (!targetElement) return;
    const headerOffset = window.innerWidth <= 680 ? 132 : 92;
    const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`);
  }

  formatUsd(value: number): string {
    return `USD ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  formatPhp(value: number): string {
    return `PHP ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}
