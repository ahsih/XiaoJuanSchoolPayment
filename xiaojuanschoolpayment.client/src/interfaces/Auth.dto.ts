export interface LoginRequestDTO {
  account: string;
  password: string;
}

export interface ResetPasswordRequestDTO {
  email: string;
  token: string;
  newPassword: string;
}

export interface InvitationCodeDTO {
  id: string;
  code?: string;
  codePrefix: string;
  role: 'Staff' | 'Student';
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  revokedAt?: string;
  status: string;
}
