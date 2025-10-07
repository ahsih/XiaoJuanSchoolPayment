export interface SchoolFeeDTO {
  id: string;
  schoolId: string;
  name: string;
  fee: number;
  description?: string;
  currencyId: number;
  lastUpdated: Date;
  schoolName?: string;
}
