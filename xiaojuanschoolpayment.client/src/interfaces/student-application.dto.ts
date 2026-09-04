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

export interface StudentApplicationDTO {
  id: string;
  studentFirstName: string;
  studentLastName: string;
  studentName: string;
  studentEmail: string;
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
  documents: StudentApplicationDocumentDTO[];
}

export interface CreateStudentApplicationDTO {
  email: string;
  temporaryPassword?: string;
  firstName: string;
  lastName: string;
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
  '已取消',
] as const;
