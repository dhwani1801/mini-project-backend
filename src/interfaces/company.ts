export default interface CompanyInfo {
	id?: string;
	tenantName?: string;
	tenantID?: any;
	accessToken?: string;
	refreshToken?: string;
	accessTokenUTCDate?: Date;
	customerLastSync?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}
