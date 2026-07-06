export interface SchoolPhotoDTO {
  id?: string;
  schoolId: string;
  schoolName?: string;
  originalFileName?: string;
  storedFileName?: string;
  url?: string;
  contentType?: string;
  sizeBytes?: number;
  category?: string;
  caption?: string;
  altText?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  lastUpdated?: string;
}
