import { Request } from "express";

export interface RequestExtended extends Request {
  user?: any;
  accessToken?: any;
  refreshToken?: any;
}

// export interface RequestExtend extends Request {
// 	params: {
// 	  accessToken: string;
// 	  realmId: string;
// 	  refreshToken: string;
// 	};
//   }

export interface DefaultResponseInterface {
  message: string;
  statusCode: number;
  data: any;
  total?: number;
  page?: number;
}
