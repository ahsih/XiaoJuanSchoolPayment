export interface JWTLoginTokenDTO {
    token: string;
    expiryDate: Date;
    roles: string[];
    name: string;
    email: string;
}