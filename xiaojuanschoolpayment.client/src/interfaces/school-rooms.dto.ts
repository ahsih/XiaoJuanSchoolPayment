export interface SchoolRoomDTO {
  id: string;
  name: string;
  price: number;
  currencyId: number;
  description?: string;
  schoolId: string;
  week: number;
}
