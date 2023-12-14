import jwt from "jsonwebtoken";
import config from "../../config";

// Generate AccessToken
export const generateAccessToken = (payload: any) => {
  // expiresIn works in seconds if given in number
  const token = jwt.sign(payload, config.accessTokenSecretKey, {
    expiresIn: 3600,
  });
  return token;
};

// Generate Forgot Password Token
export const generateForgotPasswordToken = (payload: any) => {
  const token = jwt.sign(payload, config.forgotPasswordTokenSecretKey);
  return token;
};

// Verify Access Token
export const verifyAccessToken = (accessToken: string) => {
  const verified = jwt.verify(accessToken, config.accessTokenSecretKey);

  console.log("verified : ", verified);
  return verified;
};

// Verify Forgot Password Token
export const verifyForgotPasswordToken = (forgotPasswordToken: any) => {
  const verified = jwt.verify(
    forgotPasswordToken,
    config.forgotPasswordTokenSecretKey
  );
  return verified;
};
