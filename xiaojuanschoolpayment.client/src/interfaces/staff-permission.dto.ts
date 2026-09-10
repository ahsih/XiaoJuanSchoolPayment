export type StaffPermissionScope =
  | 'schoolContent'
  | 'pricing'
  | 'quoteImage'
  | 'media'
  | 'students';

export interface StaffSchoolPermissionDTO {
  schoolId: string;
  schoolName: string;
  schoolContent: boolean;
  pricing: boolean;
  quoteImage: boolean;
  media: boolean;
  students: boolean;
}

export interface StaffPermissionUserDTO {
  userId: string;
  name: string;
  account: string;
  employeeType: 'Consultant' | 'Manager';
  canPublish: boolean;
  schools: StaffSchoolPermissionDTO[];
}
