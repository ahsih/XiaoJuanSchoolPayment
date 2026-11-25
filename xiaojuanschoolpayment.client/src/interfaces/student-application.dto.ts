export interface StudentApplicationDocumentDTO {
  id: string;
  documentType: string;
  displayName: string;
  originalFileName: string;
  sizeBytes: number;
  isVisibleToStudent: boolean;
  uploadedAt: string;
  downloadUrl: string;
}

export type StudentPaymentReviewStatus = 'PendingReview' | 'Confirmed' | 'Returned';

export interface StudentPaymentDTO {
  id: string;
  studentApplicationId: string;
  studentName: string;
  schoolName: string;
  payerName: string;
  paymentType: string;
  amount: number;
  currencyCode: string;
  paidAt: string;
  paymentMethod: string;
  receivingAccount?: string;
  referenceNumber?: string;
  note?: string;
  reviewStatus: StudentPaymentReviewStatus;
  submittedByName?: string;
  submittedAt: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNote?: string;
  originalFileName: string;
  sizeBytes: number;
  isVisibleToStudent: boolean;
  downloadUrl: string;
}

export interface StudentPaymentSubmissionDTO {
  payerName: string;
  paymentType: string;
  amount: number;
  currencyCode: string;
  paidAt: string;
  paymentMethod: string;
  receivingAccount?: string;
  referenceNumber?: string;
  note?: string;
}

export interface StudentFeeItemDTO {
  key: string;
  name: string;
  amount: number;
  currencyCode: string;
  dueDate?: string;
  note?: string;
}

/** Computed by the server on every read: per currency, fees due, confirmed payments and what is left. */
export interface StudentFeeSummaryDTO {
  currencyCode: string;
  totalDue: number;
  paid: number;
  remaining: number;
  nextDueDate?: string;
  nextDueAmount?: number;
}

export interface StudentRequestedDocumentDTO {
  key: string;
  documentType: string;
  note?: string;
  /** 未上传 / 待确认 / 已收到 / 需重新上传, computed by the server. */
  uploadStatus?: string;
}

export type StudentSubmissionReviewStatus = 'PendingReview' | 'Accepted' | 'Returned';

export interface StudentSubmissionDTO {
  id: string;
  studentApplicationId: string;
  documentType: string;
  studentNote?: string;
  originalFileName: string;
  sizeBytes: number;
  reviewStatus: StudentSubmissionReviewStatus;
  submittedAt: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNote?: string;
  downloadUrl: string;
}

/** What a student may upload and a consultant may ask for. Keep in step with the server and the mini program. */
export const STUDENT_SUBMISSION_TYPES = ['护照首页', '证件照', '机票行程单', '签证材料', '付款截图', '保险资料', '其他'] as const;

export const STUDENT_FEE_CURRENCIES = ['CNY', 'USD', 'PHP', 'EUR', 'GBP', 'MYR'] as const;

/** Chinese currency names for every amount shown to people (codes stay in data). */
export const STUDENT_CURRENCY_NAMES: Record<string, string> = {
  CNY: '人民币',
  RMB: '人民币',
  USD: '美元',
  PHP: '比索',
  EUR: '欧元',
  GBP: '英镑',
  MYR: '马来西亚林吉特',
};

export function studentCurrencyName(code: string | undefined | null): string {
  const upper = (code ?? '').toUpperCase();
  return STUDENT_CURRENCY_NAMES[upper] ?? upper;
}

export function studentMoney(amount: number, code: string): string {
  const value = (Number(amount) || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${value} ${studentCurrencyName(code)}`;
}

export type StudentEnrollmentType = '单人报名' | '亲子家庭' | '多人同行';

export interface StudentApplicationMemberDTO {
  key: string;
  name: string;
  relationship?: string;
  email?: string;
  phoneNumber?: string;
}

export interface StudentApplicationPlanDTO {
  key: string;
  participantKey: string;
  name: string;
  startDate?: string;
  weeks?: number;
  endDate?: string;
}

export interface StudentApplicationDTO {
  id: string;
  studentFirstName: string;
  studentLastName: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  hasStudentAccount: boolean;
  enrollmentType: StudentEnrollmentType;
  enrollmentDate?: string;
  visaStatus: string;
  members: StudentApplicationMemberDTO[];
  coursePlans: StudentApplicationPlanDTO[];
  accommodationPlans: StudentApplicationPlanDTO[];
  studyWeeks?: number;
  schoolId: string;
  schoolName: string;
  courseName?: string;
  accommodationName?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  studentVisibleNotes?: string;
  internalNotes?: string;
  createdAt: string;
  lastUpdated: string;
  reviewStatus: 'Draft' | 'PendingReview' | 'Published';
  changeSummary?: string;
  submittedByName?: string;
  submittedAt?: string;
  publishedByName?: string;
  publishedAt?: string;
  documents: StudentApplicationDocumentDTO[];
  payments: StudentPaymentDTO[];
  feeItems?: StudentFeeItemDTO[];
  feeSummaries?: StudentFeeSummaryDTO[];
  requestedDocuments?: StudentRequestedDocumentDTO[];
  consultantName?: string;
  submissions?: StudentSubmissionDTO[];
}

export interface CreateStudentApplicationDTO {
  email?: string;
  phoneNumber?: string;
  enrollmentType: StudentEnrollmentType;
  enrollmentDate?: string;
  visaStatus: string;
  members: StudentApplicationMemberDTO[];
  coursePlans: StudentApplicationPlanDTO[];
  accommodationPlans: StudentApplicationPlanDTO[];
  firstName: string;
  lastName?: string;
  schoolId: string;
  courseName?: string;
  accommodationName?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  studentVisibleNotes?: string;
  internalNotes?: string;
  feeItems: StudentFeeItemDTO[];
  requestedDocuments: StudentRequestedDocumentDTO[];
  consultantName?: string;
}

export interface UpdateStudentApplicationDTO {
  email?: string;
  phoneNumber?: string;
  enrollmentType: StudentEnrollmentType;
  enrollmentDate?: string;
  visaStatus: string;
  members: StudentApplicationMemberDTO[];
  coursePlans: StudentApplicationPlanDTO[];
  accommodationPlans: StudentApplicationPlanDTO[];
  firstName: string;
  lastName?: string;
  schoolId: string;
  courseName?: string;
  accommodationName?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  studentVisibleNotes?: string;
  internalNotes?: string;
  feeItems: StudentFeeItemDTO[];
  requestedDocuments: StudentRequestedDocumentDTO[];
  consultantName?: string;
}

export const STUDENT_APPLICATION_STATUSES = [
  '资料准备',
  '已提交学校',
  '等待学校审核',
  '已收到录取通知书',
  '签证办理中',
  '行前准备',
  '已入学',
  '已完成',
  '保留/延期',
  '已取消',
] as const;

export const STUDENT_VISA_STATUSES = [
  '未确认',
  '无需办理',
  '未办理',
  '资料准备',
  '已递交',
  '审理中',
  '待补件',
  '已获签',
  '被拒/重新办理',
] as const;
