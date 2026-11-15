export interface SchoolCommissionRoomBasisDTO {
  roomCode: string;
  roomName: string;
  publishedRoomPriceFourWeeks: number;
  commissionBasisFourWeeks: number;
  note: string | null;
}

export interface SchoolCommissionPolicyDTO {
  id: string;
  schoolId: string;
  schoolName: string;
  policyCode: string;
  title: string;
  effectiveRegistrationDate: string;
  newStudentsOnly: boolean;
  commissionRate: number;
  currencyCode: string;
  formulaNote: string;
  scopeNote: string;
  source: string;
  sourceNotice: string;
  recordedAt: string;
  roomBases: SchoolCommissionRoomBasisDTO[];
}
