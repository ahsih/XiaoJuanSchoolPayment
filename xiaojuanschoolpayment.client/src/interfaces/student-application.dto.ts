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
