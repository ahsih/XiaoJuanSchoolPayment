import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SchoolDTO } from '../../../interfaces/school.dto';
import {
  CreateStudentApplicationDTO,
  STUDENT_APPLICATION_STATUSES,
  STUDENT_VISA_STATUSES,
  StudentApplicationDTO,
  StudentApplicationDocumentDTO,
  StudentApplicationMemberDTO,
  StudentApplicationPlanDTO,
  StudentEnrollmentType,
  StudentPaymentDTO,
  StudentPaymentSubmissionDTO,
  UpdateStudentApplicationDTO,
} from '../../../interfaces/student-application.dto';
import { SchoolService } from '../../../services/school.service';
import { StudentApplicationService } from '../../../services/student-application.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-student-applications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-student-applications.component.html',
  styleUrl: './admin-student-applications.component.css',
})
export class AdminStudentApplicationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly statuses = STUDENT_APPLICATION_STATUSES;
  readonly visaStatuses = STUDENT_VISA_STATUSES;
  readonly enrollmentTypes: StudentEnrollmentType[] = ['单人报名', '亲子家庭', '多人同行'];
  readonly paymentTypes = ['定金', '学费/住宿费', '尾款', '签证费', '服务费', '其他'];
  readonly paymentMethods = ['微信支付', '支付宝', '银行转账', '对公账户', '现金', '其他'];
  readonly paymentCurrencies = ['CNY', 'USD', 'PHP', 'EUR', 'GBP', 'MYR'];
  readonly documentTypes = [
    '学生报价单', '学校账单/学生发票', '入学通知书', '护照首页',
    '签证材料', '签证结果', '机票行程单', '保险资料', '其他',
  ];
  readonly documentChecklist = [
    { label: '学生报价单', types: ['学生报价单', '报价单'] },
    { label: '账单/发票', types: ['学校账单/学生发票', '账单'] },
    { label: '付款凭证', types: ['付款凭证'] },
    { label: '入学通知书', types: ['入学通知书'] },
    { label: '护照首页', types: ['护照首页'] },
    { label: '签证资料', types: ['签证材料', '签证结果', '签证文件'] },
    { label: '机票', types: ['机票行程单'] },
  ];

  schools: SchoolDTO[] = [];
  applications: StudentApplicationDTO[] = [];
  editingId: string | null = null;
  selectedApplication: StudentApplicationDTO | null = null;
  selectedFile: File | null = null;
  selectedPaymentFile: File | null = null;
  paymentFormOpen = false;
  editingPaymentId: string | null = null;
  paymentBusyId: string | null = null;
  loading = false;
  saving = false;
  search = '';
  canPublish = false;
  reviewBusyId: string | null = null;
  reviewNotes: Record<string, string> = {};
  targetApplicationId: string | null = null;
  targetPaymentId: string | null = null;
  targetHandled = false;
  editorOpen = false;
  editingHasStudentAccount = false;
  activeFilter: StudentWorkbenchFilter = 'all';
  recordStateFilter: StudentRecordStateFilter = 'all';
  registrationMonthFilter = '';
  schoolFilter = '';
  visaFilter: StudentVisaFilter = 'all';

  readonly applicationForm = this.fb.group({
    enrollmentType: ['单人报名' as StudentEnrollmentType, Validators.required],
    email: ['', Validators.email],
    phoneNumber: [''],
    firstName: ['', Validators.required],
    lastName: [''],
    enrollmentDate: [this.todayInput(), Validators.required],
    members: new FormArray<StudentMemberFormGroup>([]),
    schoolId: ['', Validators.required],
    coursePlans: new FormArray<StudentPlanFormGroup>([]),
    accommodationPlans: new FormArray<StudentPlanFormGroup>([]),
    status: ['资料准备', Validators.required],
    visaStatus: ['未确认', Validators.required],
    studentVisibleNotes: [''],
    internalNotes: [''],
  });

  readonly documentForm = this.fb.group({
    documentType: ['学生报价单', Validators.required],
    displayName: [''],
    isVisibleToStudent: [true],
  });

  readonly paymentForm = this.fb.group({
    payerName: ['', Validators.required],
    paymentType: ['定金', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    currencyCode: ['CNY', Validators.required],
    paidAt: [this.todayInput(), Validators.required],
    paymentMethod: ['微信支付', Validators.required],
    receivingAccount: [''],
    referenceNumber: [''],
    note: [''],
  });

  constructor(
    private schoolService: SchoolService,
    private applicationService: StudentApplicationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}

  get membersArray() {
    return this.applicationForm.controls.members;
  }

  get coursePlansArray() {
    return this.applicationForm.controls.coursePlans;
  }

  get accommodationPlansArray() {
    return this.applicationForm.controls.accommodationPlans;
  }

  get participantOptions(): Array<{ key: string; name: string }> {
    const primaryName = this.applicationForm.controls.firstName.value?.trim() || '主联系人／第一位学员';
    return [
      { key: 'primary', name: primaryName },
      ...this.membersArray.controls.map((control, index) => ({
        key: control.controls.key.value || `member-${index + 1}`,
        name: control.controls.name.value?.trim() || `同行人 ${index + 2}`,
      })),
    ];
  }

  addMember(member?: StudentApplicationMemberDTO): void {
    this.membersArray.push(this.fb.nonNullable.group({
      key: [member?.key ?? this.newKey('member'), Validators.required],
      name: [member?.name ?? '', Validators.required],
      relationship: member?.relationship ?? '',
      phoneNumber: member?.phoneNumber ?? '',
      email: [member?.email ?? '', Validators.email],
    }));
    if (this.applicationForm.controls.enrollmentType.value === '单人报名') {
      this.applicationForm.controls.enrollmentType.setValue('亲子家庭');
    }
  }

  removeMember(index: number): void {
    const removedKey = this.membersArray.at(index).controls.key.value;
    this.membersArray.removeAt(index);
    [...this.coursePlansArray.controls, ...this.accommodationPlansArray.controls].forEach((plan) => {
      if (plan.controls.participantKey.value === removedKey) plan.controls.participantKey.setValue('primary');
    });
    if (this.membersArray.length === 0) this.applicationForm.controls.enrollmentType.setValue('单人报名');
  }

  addPlan(kind: 'course' | 'accommodation', plan?: StudentApplicationPlanDTO): void {
    const group = this.fb.nonNullable.group({
      key: [plan?.key ?? this.newKey(kind), Validators.required],
      participantKey: [plan?.participantKey ?? 'primary', Validators.required],
      name: plan?.name ?? '',
      startDate: this.dateInput(plan?.startDate),
      weeks: [plan?.weeks ?? 4, [Validators.min(1), Validators.max(104)]],
      endDate: this.dateInput(plan?.endDate),
    });
    (kind === 'course' ? this.coursePlansArray : this.accommodationPlansArray).push(group);
    this.syncPlanEnd(group);
  }

  removePlan(kind: 'course' | 'accommodation', index: number): void {
    const plans = kind === 'course' ? this.coursePlansArray : this.accommodationPlansArray;
    plans.removeAt(index);
    if (plans.length === 0) this.addPlan(kind);
  }

  syncPlanEnd(plan: StudentPlanFormGroup): void {
    const startValue = plan.controls.startDate.value;
    const weeks = Number(plan.controls.weeks.value);
    if (!startValue || !Number.isFinite(weeks) || weeks < 1) {
      plan.controls.endDate.setValue('');
      return;
    }
    const start = new Date(`${startValue}T00:00:00`);
    start.setDate(start.getDate() + weeks * 7 - 1);
    plan.controls.endDate.setValue(this.localDate(start));
  }

  ngOnInit(): void {
    const roles = this.authService.getRoles().map((role) => role.toLowerCase());
    this.canPublish = roles.includes('admin') || roles.includes('manager');
    this.targetApplicationId = this.route.snapshot.queryParamMap.get('applicationId');
    this.targetPaymentId = this.route.snapshot.queryParamMap.get('paymentId');
    this.schoolService.getSchools().subscribe({
      next: (schools) => (this.schools = [...(schools ?? [])].sort((a, b) => a.name.localeCompare(b.name))),
      error: () => this.notify('学校列表加载失败'),
    });
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAll(this.search.trim()).subscribe({
      next: (applications) => {
        this.applications = applications ?? [];
        if (this.selectedApplication) {
          this.selectedApplication = this.applications.find((x) => x.id === this.selectedApplication?.id) ?? null;
        }
        this.loading = false;
        if (this.targetApplicationId && !this.targetHandled) {
          this.targetHandled = true;
          const target = this.applications.find((application) => application.id === this.targetApplicationId);
          if (target && this.targetPaymentId) this.selectApplication(target);
          window.setTimeout(() => document.getElementById(`application-${this.targetApplicationId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          if (this.targetPaymentId) {
            window.setTimeout(() => document.getElementById(`payment-${this.targetPaymentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          }
        }
      },
      error: () => {
        this.loading = false;
        this.notify('学生报名加载失败');
      },
    });
  }

  get filteredApplications(): StudentApplicationDTO[] {
    const query = this.search.trim().toLocaleLowerCase();
    return this.applications.filter((application) => {
      if (this.activeFilter === 'incomplete' && this.completion(application) >= 100) return false;
      if (this.activeFilter === 'draft' && application.reviewStatus !== 'Draft') return false;
      if (this.activeFilter === 'review' && application.reviewStatus !== 'PendingReview') return false;
      if (this.activeFilter === 'published' && application.reviewStatus !== 'Published') return false;
      if (this.activeFilter === 'payment-review' && !application.payments.some((payment) => payment.reviewStatus === 'PendingReview')) return false;
      if (!this.matchesRecordState(application, this.recordStateFilter)) return false;
      if (this.registrationMonthFilter && this.registrationMonth(application) !== this.registrationMonthFilter) return false;
      if (this.schoolFilter && application.schoolId !== this.schoolFilter) return false;
      if (!this.matchesVisaFilter(application, this.visaFilter)) return false;
      if (!query) return true;
      return [
        application.studentName,
        application.studentEmail,
        application.schoolName,
        application.courseName,
        application.accommodationName,
        ...(application.members ?? []).flatMap((member) => [member.name, member.relationship, member.email, member.phoneNumber]),
        ...(application.coursePlans ?? []).map((plan) => plan.name),
        ...(application.accommodationPlans ?? []).map((plan) => plan.name),
      ]
        .some((value) => value?.toLocaleLowerCase().includes(query));
    });
  }

  get registrationMonthOptions(): string[] {
    return [...new Set(this.applications.map((application) => this.registrationMonth(application)).filter(Boolean))]
      .sort((a, b) => b.localeCompare(a));
  }

  get schoolFilterOptions(): Array<{ id: string; name: string }> {
    const schools = new Map<string, string>();
    this.applications.forEach((application) => schools.set(application.schoolId, application.schoolName));
    return [...schools.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get hasRecordFilters(): boolean {
    return this.activeFilter !== 'all' || this.recordStateFilter !== 'all' || !!this.registrationMonthFilter || !!this.schoolFilter || this.visaFilter !== 'all' || !!this.search;
  }

  get draftCount(): number {
    return this.applications.filter((application) => application.reviewStatus === 'Draft').length;
  }

  get reviewCount(): number {
    return this.applications.filter((application) => application.reviewStatus === 'PendingReview').length;
  }

  get publishedCount(): number {
    return this.applications.filter((application) => application.reviewStatus === 'Published').length;
  }

  get pendingPaymentCount(): number {
    return this.applications.reduce(
      (total, application) => total + application.payments.filter((payment) => payment.reviewStatus === 'PendingReview').length,
      0,
    );
  }

  get incompleteCount(): number {
    return this.applications.filter((application) => this.completion(application) < 100).length;
  }

  get filterTitle(): string {
    const titles: Record<StudentWorkbenchFilter, string> = {
      all: '全部学生',
      incomplete: '待补充资料',
      draft: this.canPublish ? '待直接发布' : '待我提交',
      review: '待管理审核',
      published: '已同步学生',
      'payment-review': this.canPublish ? '待审核付款' : '付款审核中',
    };
    return titles[this.activeFilter];
  }

  setFilter(filter: StudentWorkbenchFilter): void {
    this.activeFilter = filter;
  }

  setRecordStateFilter(filter: StudentRecordStateFilter): void {
    this.recordStateFilter = filter;
  }

  recordStateCount(filter: StudentRecordStateFilter): number {
    return this.applications.filter((application) => this.matchesRecordState(application, filter)).length;
  }

  resetFilters(): void {
    this.activeFilter = 'all';
    this.recordStateFilter = 'all';
    this.registrationMonthFilter = '';
    this.schoolFilter = '';
    this.visaFilter = 'all';
    this.search = '';
  }

  openCreate(): void {
    this.resetForm();
    this.editorOpen = true;
  }

  closeEditor(): void {
    this.editorOpen = false;
    this.resetForm();
  }

  submitApplication(): void {
    if (this.applicationForm.invalid || this.saving) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const value = this.applicationForm.getRawValue();
    const members: StudentApplicationMemberDTO[] = (value.members ?? []).map((member) => ({
      key: member.key!,
      name: member.name!.trim(),
      relationship: member.relationship?.trim() || undefined,
      phoneNumber: member.phoneNumber?.trim() || undefined,
      email: member.email?.trim() || undefined,
    }));
    const coursePlans = this.planPayload(value.coursePlans ?? []);
    const accommodationPlans = this.planPayload(value.accommodationPlans ?? []);
    const common = {
      email: value.email || undefined,
      phoneNumber: value.phoneNumber || undefined,
      enrollmentType: value.enrollmentType!,
      enrollmentDate: value.enrollmentDate || undefined,
      visaStatus: value.visaStatus!,
      members,
      coursePlans,
      accommodationPlans,
      firstName: value.firstName!,
      lastName: value.lastName || undefined,
      schoolId: value.schoolId!,
      status: value.status!,
      studentVisibleNotes: value.studentVisibleNotes || undefined,
      internalNotes: value.internalNotes || undefined,
    };

    const request = this.editingId
      ? this.applicationService.update(this.editingId, common as UpdateStudentApplicationDTO)
      : this.applicationService.create({
          ...common,
        } as CreateStudentApplicationDTO);

    request.subscribe({
      next: () => {
        this.notify(this.editingId
          ? `修改已保存为草稿，${this.canPublish ? '可填写说明后直接同步' : '尚未同步给学生'}`
          : `学生档案草稿已建立，${this.canPublish ? '可填写说明后直接同步' : '提交审核后才会同步'}`);
        this.editorOpen = false;
        this.resetForm();
        this.loadApplications();
      },
      error: (error) => {
        this.saving = false;
        this.notify(this.errorMessage(error));
      },
    });
  }

  edit(application: StudentApplicationDTO): void {
    this.resetForm();
    this.editingId = application.id;
    this.editingHasStudentAccount = application.hasStudentAccount;
    this.applicationForm.patchValue({
      enrollmentType: application.enrollmentType,
      email: application.studentEmail,
      phoneNumber: application.studentPhone ?? '',
      firstName: application.studentFirstName,
      lastName: application.studentLastName,
      enrollmentDate: this.dateInput(application.enrollmentDate ?? application.createdAt),
      schoolId: application.schoolId,
      status: application.status,
      visaStatus: application.visaStatus || '未确认',
      studentVisibleNotes: application.studentVisibleNotes ?? '',
      internalNotes: application.internalNotes ?? '',
    });
    this.membersArray.clear();
    application.members.forEach((member) => this.addMember(member));
    this.applicationForm.controls.enrollmentType.setValue(application.enrollmentType);
    this.coursePlansArray.clear();
    (application.coursePlans.length ? application.coursePlans : [undefined]).forEach((plan) => this.addPlan('course', plan));
    this.accommodationPlansArray.clear();
    (application.accommodationPlans.length ? application.accommodationPlans : [undefined]).forEach((plan) => this.addPlan('accommodation', plan));
    this.editorOpen = true;
  }

  resetForm(): void {
    this.editingId = null;
    this.editingHasStudentAccount = false;
    this.saving = false;
    this.applicationForm.reset({
      enrollmentType: '单人报名',
      enrollmentDate: this.todayInput(),
      status: '资料准备',
      visaStatus: '未确认',
    });
    this.membersArray.clear();
    this.coursePlansArray.clear();
    this.accommodationPlansArray.clear();
    this.addPlan('course');
    this.addPlan('accommodation');
  }

  completion(application: StudentApplicationDTO): number {
    const fields = [
      application.studentName,
      application.studentEmail,
      application.schoolName,
      application.coursePlans.length,
      application.accommodationPlans.length,
      application.startDate,
      application.endDate,
      application.studentVisibleNotes,
    ];
    return Math.round((fields.filter((value) => !!value).length / fields.length) * 100);
  }

  studentInitial(application: StudentApplicationDTO): string {
    return (application.studentFirstName || application.studentLastName || application.studentName || '学').trim().slice(0, 1).toUpperCase();
  }

  visibleDocumentCount(application: StudentApplicationDTO): number {
    return application.documents.filter((document) => document.isVisibleToStudent).length;
  }

  paymentDocumentCount(application: StudentApplicationDTO): number {
    return application.documents.filter((document) => ['付款凭证', '账单', '学校账单/学生发票'].includes(document.documentType)).length;
  }

  documentChecklistComplete(application: StudentApplicationDTO, types: string[]): boolean {
    return (types.includes('付款凭证') && application.payments.length > 0) ||
      application.documents.some((document) => types.includes(document.documentType));
  }

  personCount(application: StudentApplicationDTO): number {
    return 1 + application.members.length;
  }

  documentIcon(document: StudentApplicationDocumentDTO): string {
    if (['付款凭证', '账单', '学校账单/学生发票'].includes(document.documentType)) return 'payments';
    if (['报价单', '学生报价单'].includes(document.documentType)) return 'request_quote';
    if (document.documentType === '入学通知书') return 'school';
    if (['护照首页', '签证材料', '签证结果', '签证文件'].includes(document.documentType)) return 'badge';
    if (document.documentType === '机票行程单') return 'flight';
    return 'description';
  }

  selectApplication(application: StudentApplicationDTO): void {
    this.selectedApplication = application;
    this.selectedFile = null;
    this.closePaymentForm();
    this.documentForm.reset({ documentType: '学生报价单', displayName: '', isVisibleToStudent: true });
  }

  openPaymentForm(payment?: StudentPaymentDTO): void {
    if (!this.selectedApplication) return;
    this.editingPaymentId = payment?.id ?? null;
    this.selectedPaymentFile = null;
    this.paymentForm.reset({
      payerName: payment?.payerName ?? this.selectedApplication.studentName,
      paymentType: payment?.paymentType ?? '定金',
      amount: payment?.amount ?? null,
      currencyCode: payment?.currencyCode ?? 'CNY',
      paidAt: this.dateInput(payment?.paidAt) || this.todayInput(),
      paymentMethod: payment?.paymentMethod ?? '微信支付',
      receivingAccount: payment?.receivingAccount ?? '',
      referenceNumber: payment?.referenceNumber ?? '',
      note: payment?.note ?? '',
    });
    this.paymentFormOpen = true;
  }

  closePaymentForm(): void {
    this.paymentFormOpen = false;
    this.editingPaymentId = null;
    this.selectedPaymentFile = null;
    this.paymentBusyId = null;
  }

  onPaymentFileSelected(event: Event): void {
    this.selectedPaymentFile = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  submitPayment(): void {
    if (!this.selectedApplication || this.paymentForm.invalid || this.paymentBusyId) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    if (!this.editingPaymentId && !this.selectedPaymentFile) {
      this.notify('请上传付款截图或银行回单');
      return;
    }

    const value = this.paymentForm.getRawValue();
    const request: StudentPaymentSubmissionDTO = {
      payerName: value.payerName!.trim(),
      paymentType: value.paymentType!,
      amount: Number(value.amount),
      currencyCode: value.currencyCode!,
      paidAt: value.paidAt!,
      paymentMethod: value.paymentMethod!,
      receivingAccount: value.receivingAccount?.trim() || undefined,
      referenceNumber: value.referenceNumber?.trim() || undefined,
      note: value.note?.trim() || undefined,
    };
    const applicationId = this.selectedApplication.id;
    this.paymentBusyId = this.editingPaymentId ?? 'new';
    const operation = this.editingPaymentId
      ? this.applicationService.resubmitPayment(applicationId, this.editingPaymentId, request, this.selectedPaymentFile)
      : this.applicationService.submitPayment(applicationId, request, this.selectedPaymentFile!);
    operation.subscribe({
      next: () => {
        this.notify(this.editingPaymentId ? '付款资料已重新提交管理审核' : '付款已提交管理审核');
        this.closePaymentForm();
        this.loadApplications();
      },
      error: (error) => {
        this.paymentBusyId = null;
        this.notify(this.errorMessage(error));
      },
    });
  }

  confirmPayment(payment: StudentPaymentDTO): void {
    if (!this.canPublish || !this.selectedApplication || this.paymentBusyId) return;
    if (!window.confirm(`确认已收到 ${payment.currencyCode} ${payment.amount.toFixed(2)}？确认后会计入学生已付款金额。`)) return;
    this.paymentBusyId = payment.id;
    this.applicationService.confirmPayment(this.selectedApplication.id, payment.id).subscribe({
      next: () => {
        this.paymentBusyId = null;
        this.notify('已确认到账');
        this.loadApplications();
      },
      error: (error) => {
        this.paymentBusyId = null;
        this.notify(this.errorMessage(error));
      },
    });
  }

  returnPayment(payment: StudentPaymentDTO): void {
    if (!this.canPublish || !this.selectedApplication || this.paymentBusyId) return;
    const reason = window.prompt('请填写退回原因，例如：金额与截图不一致、收款账户不清楚：')?.trim();
    if (!reason) return;
    this.paymentBusyId = payment.id;
    this.applicationService.returnPayment(this.selectedApplication.id, payment.id, reason).subscribe({
      next: () => {
        this.paymentBusyId = null;
        this.notify('已退回顾问修改');
        this.loadApplications();
      },
      error: (error) => {
        this.paymentBusyId = null;
        this.notify(this.errorMessage(error));
      },
    });
  }

  deletePayment(payment: StudentPaymentDTO): void {
    if (!this.selectedApplication || payment.reviewStatus === 'Confirmed' || this.paymentBusyId) return;
    if (!window.confirm(`删除这笔 ${payment.paymentType} 付款记录？`)) return;
    this.paymentBusyId = payment.id;
    this.applicationService.deletePayment(this.selectedApplication.id, payment.id).subscribe({
      next: () => {
        this.paymentBusyId = null;
        this.notify('付款记录已删除');
        this.loadApplications();
      },
      error: (error) => {
        this.paymentBusyId = null;
        this.notify(this.errorMessage(error));
      },
    });
  }

  downloadPaymentReceipt(payment: StudentPaymentDTO): void {
    if (!this.selectedApplication) return;
    this.applicationService.downloadPaymentReceipt(this.selectedApplication.id, payment);
  }

  paymentCount(application: StudentApplicationDTO, status: StudentPaymentDTO['reviewStatus']): number {
    return application.payments.filter((payment) => payment.reviewStatus === status).length;
  }

  paymentStatusLabel(payment: StudentPaymentDTO): string {
    if (payment.reviewStatus === 'Confirmed') return '已确认到账';
    if (payment.reviewStatus === 'Returned') return '已退回修改';
    return '待管理审核';
  }

  confirmedPaymentTotals(application: StudentApplicationDTO): string {
    const totals = new Map<string, number>();
    application.payments
      .filter((payment) => payment.reviewStatus === 'Confirmed')
      .forEach((payment) => totals.set(payment.currencyCode, (totals.get(payment.currencyCode) ?? 0) + payment.amount));
    return [...totals.entries()]
      .map(([currency, amount]) => `${currency} ${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
      .join(' / ') || '暂无';
  }

  onFileSelected(event: Event): void {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  uploadDocument(): void {
    if (!this.selectedApplication || !this.selectedFile || this.documentForm.invalid) {
      this.notify('请选择报名记录和文件');
      return;
    }

    const value = this.documentForm.getRawValue();
    this.applicationService
      .uploadDocument(
        this.selectedApplication.id,
        this.selectedFile,
        value.documentType!,
        value.displayName ?? '',
        value.isVisibleToStudent ?? true,
      )
      .subscribe({
        next: () => {
          this.notify(`文件已加入草稿，${this.canPublish ? '直接发布后' : '审核发布后'}学生才能看到`);
          this.selectedFile = null;
          this.loadApplications();
        },
        error: (error) => this.notify(this.errorMessage(error)),
      });
  }

  download(application: StudentApplicationDTO, document: StudentApplicationDocumentDTO): void {
    this.applicationService.downloadDocument(application.id, document);
  }

  deleteDocument(application: StudentApplicationDTO, document: StudentApplicationDocumentDTO): void {
    if (!window.confirm(`删除“${document.displayName}”？`)) return;
    this.applicationService.deleteDocument(application.id, document.id).subscribe({
      next: () => {
        this.notify(`删除已保存为草稿，${this.canPublish ? '直接发布后' : '审核发布后'}才会从学生端移除`);
        this.loadApplications();
      },
      error: () => this.notify('文件删除失败'),
    });
  }

  fileSize(bytes: number): string {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  submitForReview(application: StudentApplicationDTO): void {
    const summary = (this.reviewNotes[application.id] ?? '').trim();
    if (!summary) {
      this.notify('请先填写本次具体修改了哪些内容');
      return;
    }
    this.reviewBusyId = application.id;
    this.applicationService.submitForReview(application.id, summary).subscribe({
      next: () => {
        this.reviewNotes[application.id] = '';
        this.reviewBusyId = null;
        this.notify('已提交给管理审核，学生端暂时保持原内容');
        this.loadApplications();
      },
      error: (error) => {
        this.reviewBusyId = null;
        this.notify(this.errorMessage(error));
      },
    });
  }

  publish(application: StudentApplicationDTO): void {
    if (!this.canPublish) return;
    const isDirectPublish = application.reviewStatus === 'Draft';
    const summary = (this.reviewNotes[application.id] ?? '').trim();
    if (isDirectPublish && !summary) {
      this.notify('管理直接发布前，请先填写本次具体修改了哪些内容');
      return;
    }
    const confirmText = isDirectPublish
      ? `确认直接同步“${application.studentName}”的本次申请与档案修改到学生账号？`
      : `确认审核通过并同步“${application.studentName}”的申请与档案到学生账号？`;
    if (!window.confirm(confirmText)) return;
    this.reviewBusyId = application.id;
    this.applicationService.publish(application.id, isDirectPublish ? summary : undefined).subscribe({
      next: () => {
        this.reviewNotes[application.id] = '';
        this.reviewBusyId = null;
        this.notify(isDirectPublish ? '本次修改已直接同步到学生账号' : '审核通过，最新申请与档案已同步到学生账号');
        this.loadApplications();
      },
      error: (error) => {
        this.reviewBusyId = null;
        this.notify(this.errorMessage(error));
      },
    });
  }

  returnForChanges(application: StudentApplicationDTO): void {
    if (!this.canPublish) return;
    const reason = window.prompt('请填写退回原因，顾问会在记录中看到：')?.trim();
    if (!reason) return;
    this.reviewBusyId = application.id;
    this.applicationService.returnToDraft(application.id, reason).subscribe({
      next: () => {
        this.reviewBusyId = null;
        this.notify('已退回顾问修改，学生端内容没有变化');
        this.loadApplications();
      },
      error: (error) => {
        this.reviewBusyId = null;
        this.notify(this.errorMessage(error));
      },
    });
  }

  reviewLabel(application: StudentApplicationDTO): string {
    if (application.reviewStatus === 'PendingReview') return '等待管理审核';
    if (application.reviewStatus === 'Published') return '已同步学生账号';
    return '草稿未提交';
  }

  monthLabel(month: string): string {
    const [year, value] = month.split('-');
    return year && value ? `${year}年${Number(value)}月` : month;
  }

  visaStatusLabel(application: StudentApplicationDTO): string {
    return application.visaStatus || '未确认';
  }

  private dateInput(value?: string): string {
    return value ? value.slice(0, 10) : '';
  }

  private todayInput(): string {
    return this.localDate(new Date());
  }

  private registrationMonth(application: StudentApplicationDTO): string {
    return (application.enrollmentDate || application.createdAt || '').slice(0, 7);
  }

  private matchesRecordState(application: StudentApplicationDTO, filter: StudentRecordStateFilter): boolean {
    if (filter === 'all') return true;
    if (filter === 'enrolled') return ['已入学', '已完成'].includes(application.status);
    if (filter === 'on-hold') return application.status === '保留/延期';
    if (filter === 'cancelled') return application.status === '已取消';
    return !['已入学', '已完成', '保留/延期', '已取消'].includes(application.status);
  }

  private matchesVisaFilter(application: StudentApplicationDTO, filter: StudentVisaFilter): boolean {
    if (filter === 'all') return true;
    const status = this.visaStatusLabel(application);
    if (filter === 'not-started') return ['未确认', '未办理'].includes(status);
    if (filter === 'in-progress') return ['资料准备', '已递交', '审理中', '待补件'].includes(status);
    if (filter === 'approved') return status === '已获签';
    if (filter === 'not-required') return status === '无需办理';
    return status === '被拒/重新办理';
  }

  private localDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private newKey(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private planPayload(plans: StudentPlanFormValue[]): StudentApplicationPlanDTO[] {
    return plans
      .filter((plan) => !!plan.name?.trim())
      .map((plan) => ({
        key: plan.key || this.newKey('plan'),
        participantKey: plan.participantKey || 'primary',
        name: plan.name!.trim(),
        startDate: plan.startDate || undefined,
        weeks: plan.weeks == null ? undefined : Number(plan.weeks),
        endDate: plan.endDate || undefined,
      }));
  }

  private notify(message: string): void {
    this.snackBar.open(message, '关闭', { duration: 3500 });
  }

  private errorMessage(error: any): string {
    if (typeof error?.error === 'string') return error.error;
    if (Array.isArray(error?.error)) return error.error.join('；');
    return '操作失败，请检查填写内容';
  }
}

type StudentWorkbenchFilter = 'all' | 'incomplete' | 'draft' | 'review' | 'published' | 'payment-review';
type StudentRecordStateFilter = 'all' | 'not-enrolled' | 'enrolled' | 'on-hold' | 'cancelled';
type StudentVisaFilter = 'all' | 'not-started' | 'in-progress' | 'approved' | 'not-required' | 'rework';

type StudentMemberFormGroup = FormGroup<{
  key: FormControl<string>;
  name: FormControl<string>;
  relationship: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
}>;

type StudentPlanFormGroup = FormGroup<{
  key: FormControl<string>;
  participantKey: FormControl<string>;
  name: FormControl<string>;
  startDate: FormControl<string>;
  weeks: FormControl<number>;
  endDate: FormControl<string>;
}>;

type StudentPlanFormValue = {
  key: string;
  participantKey: string;
  name: string;
  startDate: string;
  weeks: number;
  endDate: string;
};
