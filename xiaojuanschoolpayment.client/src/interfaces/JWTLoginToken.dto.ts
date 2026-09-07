export interface JWTLoginTokenDTO {
    token: string;
    expiryDate: Date;
    roles: string[];
    name: string;
    account: string;
    email?: string;
    phoneNumber?: string;
}
