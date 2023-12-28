import { NextFunction, Request, Response } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { checkValidation } from "../helpers/validationHelper";
import { RequestExtended } from "../interfaces/global";
import authServices from "../services/authService";
import { hashPassword } from "../helpers/passwordHelper";
import { getRegisterEmailTemplateInfra } from "../helpers/emailTemplateHelper";
import { userRepository } from "../repositories";
import config from "../../config";
import sendEmail from "../helpers/emailHelper";
import { generateForgotPasswordToken } from "../helpers/tokenHelper";
import { SUCCESS_MESSAGES } from "../constants/messages";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { confirmPassword, ...data } = req.body;

      const hashedPassword = await hashPassword(data.password);

      data.password = hashedPassword;
      data.isVerified = false;

      const response = await userRepository.register(data);

      const forgotPasswordToken = generateForgotPasswordToken({
        id: response.id,
        email: response.email,
      });

      await userRepository.update(response.id, {
        forgotPasswordToken: forgotPasswordToken,
      });

      const url = `${config?.verifyEmail}?token=${forgotPasswordToken}&first=true`;

      const fullName =
        response.firstName || response.lastName
          ? response.firstName + " " + response.lastName
          : "User";

      const email = response.email;
      const emailContent = getRegisterEmailTemplateInfra({
        fullName,
        url,
        email,
      });

      const mailOptions = {
        from: config.smtpEmail,
        to: email,
        subject: "Welcome to mini project!",
        html: emailContent,
      };

      await sendEmail(mailOptions);

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.REGISTRATION_SUCCESSFULL
      );
    } catch (err) {
      next(err);
    }
  }

  async login(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user: any = await authServices.login(email.toLowerCase(), password);

      const {
        password: userPassword,
        forgotPasswordToken,
        isVerified,
        ...finalUser
      } = user;

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
        JSON.stringify(finalUser)
      );
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      checkValidation(req);

      const { email } = req.body;

      await authServices.forgotPassword(email);

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.PASSWORD_RESET_LINK_SHARED_TO_YOUR_EMAIL_ADDRESS
      );
    } catch (err) {
      next(err);
    }
  }

  async verifyForgotPasswordToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token } = req.query;

      await authServices.verifyForgotPassword(token as string);

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.RESET_TOKEN_PASSWORD_VERIFIED_SUCCESSFULLY
      );
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      checkValidation(req);
      const { password } = req.body;
      const { token } = req.params;

      const user = await authServices.changePassword(token, password);

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY,
        user
      );
    } catch (err) {
      next(err);
    }
  }

  async setPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      const { token } = req.params;
      const user = await authServices.setPassword(token, password);

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.PASSWORD_RESETED_SUCCESSFULLY,
        user
      );
    } catch (err) {
      next(err);
    }
  }

  async getUserDetailsByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email;

      const user = await userRepository.getByEmail(email as string);

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.USER_DETAIL_FETCHED_SUCCESSFULLY,
        user
      );
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
