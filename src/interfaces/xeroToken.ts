export interface XeroTokenInterface {
    accessToken?: String
    idToken?: String
    refreshToken?: String
    expiresAt?: Number
    readableExpirationTime: any,
    tenants: Array<any>
}