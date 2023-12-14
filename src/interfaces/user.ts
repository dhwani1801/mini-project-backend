export default interface UserInfo {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  isVerified?: boolean;
  forgotPasswordToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserInfo {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyId: string;
  roleId?: string;
  userId: string;
  status?: boolean;
  isChangeStatus?: boolean;
}

export interface RequestUserInterface {
  id: string;
  email: string;
  companyId: string;
}
