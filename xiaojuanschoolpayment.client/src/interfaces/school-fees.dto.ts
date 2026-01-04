export interface SchoolFeeDTO {
  id: string;
  schoolId: string;
  name: string;
  fee: number;
  description?: string;
  currencyId: number;
  currencyCode?: string;
  currencySymbol?: string;
  lastUpdated: Date;
  schoolName?: string;
}
