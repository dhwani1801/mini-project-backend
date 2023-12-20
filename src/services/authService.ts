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
class AuthServices {
  
  async login(email: string, password: string) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new CustomError(404, "User does not exist");
    }

    const isPasswordValid = await comparePassword(password, user.password!);
    if (!isPasswordValid) {
      throw new CustomError(401, "Invalid credentials");
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
      throw new CustomError(409, "SOMETHING WENT WRONG WHILE LLOGIN");
    }
  }

  async forgotPassword(email: string) {
    const user = await userRepository.getByEmail(email);

    if (!user) {
      const error = new CustomError(404, "User does not exist");
      throw error;
    }

    const forgotPasswordToken = await generateForgotPasswordToken({
      id: user?.id,
      email: email,
    });

    const forgotPasswordTokenExpiresAt: string = (
      Date.now() + config.forgotPasswordUrlExpireTime
    ).toString();

    await userRepository.update(user?.id, {
      forgotPasswordToken: forgotPasswordToken,
    });

    const fullName =
      user?.firstName || user?.lastName
        ? user?.firstName + " " + user?.lastName
        : "User";

    const url = `${config?.resetPasswordReactUrl}?token=${forgotPasswordToken}&exp=${forgotPasswordTokenExpiresAt}`;

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
      const err = new CustomError(400, "Token missing");
      throw err;
    }

    const verified: any = verifyForgotPasswordToken(token);

    if (!verified) {
      const err = new CustomError(401, "Invalid token");
      throw err;
    }

    const user = await userRepository.getByEmail(verified?.email as string);

    if (!user) {
      const err = new CustomError(404, "User not found");
      throw err;
    }

    if (user.forgotPasswordToken !== token) {
      const err = new CustomError(401, "Reset token has expired");
      throw err;
    }

    return true;
  }

  async changePassword(token: string, password: string) {
    if (!token) {
      const err = new CustomError(400, "Token missing");
      throw err;
    }

    const verified: any = await verifyAccessToken(token);

    if (!verified) {
      const err = new CustomError(401, "Invalid token");
      throw err;
    }

    const user = await userRepository.getByEmail(verified?.email as string);

    if (!user) {
      const err = new CustomError(404, "User not found");
      throw err;
    }

    if (user?.password) {
      const encrypted = await comparePassword(password, user?.password);

      if (encrypted) {
        const error = new CustomError(
          422,
          "New password cannot be the same as the old password"
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
      const err = new CustomError(400, "Token missing");
      throw err;
    }

    const verified: any = await verifyForgotPasswordToken(token);
    if (!verified) {
      const err = new CustomError(401, "Invalid token");
      throw err;
    }

    const user = await userRepository.getByEmail(verified?.email as string);

    if (!user) {
      const err = new CustomError(404, "User not found");
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
