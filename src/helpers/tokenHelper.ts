import jwt from "jsonwebtoken";
import config from "../../config";

export const generateAccessToken = (payload: any) => {
  const token = jwt.sign(payload, config.accessTokenSecretKey, {
    expiresIn: 3600,
  });
  return token;
};

export const generateForgotPasswordToken = (payload: any) => {
  const token = jwt.sign(payload, config.forgotPasswordTokenSecretKey);
  return token;
};


export const verifyAccessToken = (accessToken: string) => {
  const verified = jwt.verify(accessToken, config.accessTokenSecretKey);

  console.log("verified : ", verified);
  return verified;
};

export const verifyForgotPasswordToken = (forgotPasswordToken: any) => {
  const verified = jwt.verify(
    forgotPasswordToken,
    config.forgotPasswordTokenSecretKey
  );
  return verified;
};
