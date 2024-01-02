import config from "../../config";
import sendEmail from "../helpers/emailHelper";
import { comparePassword, hashPassword } from "../helpers/passwordHelper";
import {
  generateAccessToken,
  generateForgotPasswordToken,
  verifyAccessToken,
  verifyForgotPasswordToken,
} from "../helpers/tokenHelper";
import { CustomError } from "../models/customError";
import tokenRepository from "../repositories/tokenRepository";
import userRepository from "../repositories/userRepository";
import { VALIDATION_MESSAGE } from "../constants/messages";

class AuthServices {
  async login(email: string, password: string) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new CustomError(404, VALIDATION_MESSAGE.USER_DOES_NOT_EXIST);
    }

    const isPasswordValid = await comparePassword(password, user.password!);
    if (!isPasswordValid) {
      throw new CustomError(401, VALIDATION_MESSAGE.INVALID_CREDENTIALS);
    }

    if (user.accessToken === null || user.accessToken !== null) {
      const newAccessToken = generateAccessToken({
        id: user.id,
        email,
      });

      await tokenRepository.updateToken(email, newAccessToken);

      const updatedUser = await userRepository.getByEmail(email);

      return updatedUser;
    } else {
      throw new CustomError(
        409,
        VALIDATION_MESSAGE.SOMETHING_WENT_WRONG_WHILE_LOGIN
      );
    }
  }

  async forgotPassword(email: string) {
    const user = await userRepository.getByEmail(email);

    if (!user) {
      const error = new CustomError(
        404,
        VALIDATION_MESSAGE.USER_DOES_NOT_EXIST
      );
      throw error;
    }

    const forgotPasswordToken = await generateForgotPasswordToken({
      id: user?.id,
      email: email,
    });

    await userRepository.update(user?.id, {
      forgotPasswordToken: forgotPasswordToken,
    });

    const mailOptions = {
      from: config.smtpEmail,
      to: user.email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: https://localhost:8080/reset-password/${forgotPasswordToken}`,
    };
    await sendEmail(mailOptions);
  }

  async verifyForgotPassword(token: string) {
    if (!token) {
      const err = new CustomError(400, VALIDATION_MESSAGE.TOKEN_MISSING);
      throw err;
    }

    const verified: any = verifyForgotPasswordToken(token);

    if (!verified) {
      const err = new CustomError(401, VALIDATION_MESSAGE.INVALID_TOKEN);
      throw err;
    }

    const user = await userRepository.getByEmail(verified?.email as string);

    if (!user) {
      const err = new CustomError(404, VALIDATION_MESSAGE.USER_NOT_FOUND);
      throw err;
    }

    if (user.forgotPasswordToken !== token) {
      const err = new CustomError(
        401,
        VALIDATION_MESSAGE.RESET_TOKEN_HAS_EXPIRED
      );
      throw err;
    }

    return true;
  }

  async changePassword(token: string, password: string) {
    if (!token) {
      const err = new CustomError(400, VALIDATION_MESSAGE.TOKEN_MISSING);
      throw err;
    }

    const verified: any = await verifyAccessToken(token);

    if (!verified) {
      const err = new CustomError(401, VALIDATION_MESSAGE.INVALID_TOKEN);
      throw err;
    }

    const user = await userRepository.getByEmail(verified?.email as string);

    if (!user) {
      const err = new CustomError(404, VALIDATION_MESSAGE.USER_NOT_FOUND);
      throw err;
    }

    if (user?.password) {
      const encrypted = await comparePassword(password, user?.password);

      if (encrypted) {
        const error = new CustomError(
          422,
          VALIDATION_MESSAGE.NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_THE_OLD_PASSWORD
        );
        throw error;
      }
    }
    const hashedPassword = await hashPassword(password);

    const updatedUser = await userRepository.update(user?.id, {
      password: hashedPassword,
      isVerified: true,
      forgotPasswordToken: null,
    });

    return updatedUser;
  }

  async setPassword(token: string, password: string) {
    if (!token) {
      const err = new CustomError(400, VALIDATION_MESSAGE.TOKEN_MISSING);
      throw err;
    }

    const verified: any = await verifyForgotPasswordToken(token);
    if (!verified) {
      const err = new CustomError(401, VALIDATION_MESSAGE.INVALID_TOKEN);
      throw err;
    }

    const user = await userRepository.getByEmail(verified?.email as string);

    if (!user) {
      const err = new CustomError(404, VALIDATION_MESSAGE.USER_NOT_FOUND);
      throw err;
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await userRepository.update(user?.id, {
      password: hashedPassword,
      isVerified: true,
    });

    return updatedUser;
  }
}

export default new AuthServices();
