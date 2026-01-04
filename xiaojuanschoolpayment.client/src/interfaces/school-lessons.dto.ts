export interface SchoolLessonDTO {
  id: string;
  name: string;
  week: number;
  price: number;
  description?: string;
  note?: string;
  schoolId: string;
  currencyId: number;
  currencyCode?: string;
  currencySymbol?: string;
  schoolName?: string;
}
