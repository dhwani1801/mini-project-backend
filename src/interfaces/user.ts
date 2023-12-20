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

