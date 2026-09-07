export type AccountType = 'phone' | 'email';
export type LoginMethod = 'Password' | 'Code';
export type VerificationPurpose = 'Login' | 'Register';

export interface LoginRequestDTO {
  account: string;
  method: LoginMethod;
  password?: string;
  verificationCode?: string;
}

export interface VerificationCodeResponseDTO {
  deliveryChannel: 'Phone' | 'Email';
  maskedAccount: string;
  expiresInSeconds: number;
  retryAfterSeconds: number;
  developmentCode?: string;
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
