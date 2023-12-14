/**
 * forget pawssword email template
 * @param data
 * @returns
 */
export const getForgotPasswordTemplate = (data: any) => {
  const { fullName, url } = data;
  return `Welcome ${fullName} , to reset your password , please click the following link ${url}`;
};

/**
 * registration email
 * @param data
 * @returns
 */
export const getRegisterEmailTemplateInfra = (data: any) => {
  const { fullName, url, email } = data;
  return ` Welcome ${fullName} to mini project, please verify your email id : ${email} by clicking the following url : ${url} `;
};
