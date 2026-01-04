export interface SchoolRoomDTO {
  id: string;
  name: string;
  price: number;
  currencyId: number;
  currencyCode?: string;
  currencySymbol?: string;
  description?: string;
  schoolId: string;
  week: number;
}
