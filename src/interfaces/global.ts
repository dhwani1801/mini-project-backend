import { Request } from 'express';
import UserInfo from './user';

export interface DefaultRequestUser {
	id: string,
	email: string,
	companyId: string
}

export interface RequestExtended extends Request {
	user?: any;
	file?: any;
	// session: any;
	idAdmin?: any;
	accessToken?: any;
	refreshToken?: any;
}

export interface DefaultResponseInterface {
	message: string;
	statusCode: number;
	data: any;
	total?: number;
	page?: number;
}
