import config from "../../config";
import sendEmail from "../helpers/emailHelper";
import {
  getForgotPasswordTemplate,
  // getRegisterEmailTemplate,
} from "../helpers/emailTemplateHelper";
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

  async login(email: string, password: string,) {
    const user = await userRepository.getByEmail(email);
    console.log('inside service  : ', user)
    if (!user) {
      throw new CustomError(404, "User does not exist");
    }
    // if (!user.isVerified) {
    //   throw new CustomError(403, "User is not verified");
    // }

    // Remove the 'companyRoleStatus' check since 'roles' do not exist in your schema
    // const companyRoleStatus = user.companies[0]?.role?.status;

    const isPasswordValid = await comparePassword(password, user.password!);

    if (!isPasswordValid) {
      throw new CustomError(401, "Invalid credentials");
    }

    if (
      user.accessToken === null ||
      (user.accessToken !== null)
    ) {
      const newAccessToken = generateAccessToken({
        id: user.id,
        email,
        // You may adjust the companyId as needed based on your schema.
      });

      await tokenRepository.updateToken(email, newAccessToken);

      const updatedUser = await userRepository.getByEmail(email);
      return updatedUser;
    } else {
      throw new CustomError(409, "User is already logged in somewhere else");
    }
  }

  async forgotPassword(email: string) {
    const user = await userRepository.getByEmail(email);

    if (!user) {
      // 404 Not Found - User not found, but returning a custom message as there's no direct HTTP response here.
      const error = new CustomError(404, "User does not exist");
      throw error;
    }

    // Generate forgot password token
    const forgotPasswordToken = await generateForgotPasswordToken({
      id: user?.id,
      email: email,
    });

    // Expires in 1 hour
    const forgotPasswordTokenExpiresAt: string = (
      Date.now() + config.forgotPasswordUrlExpireTime
    ).toString();

    // Store token in the database
    await userRepository.update(user?.id, {
      forgotPasswordToken: forgotPasswordToken,
      // forgotPa sswordTokenExpiresAt: forgotPasswordTokenExpiresAt,
    });

    const fullName =
      user?.firstName || user?.lastName
        ? user?.firstName + " " + user?.lastName
        : "User";

    // Generate a URL with the reset token and expiration time
    const url = `${config?.resetPasswordReactUrl}?token=${forgotPasswordToken}&exp=${forgotPasswordTokenExpiresAt}`;

    // Compose email content for the password reset email
    const emailContent = getForgotPasswordTemplate({
      fullName,
      url,
    });

    // Send the email with the reset token
    // const mailOptions = {
    //   from: config.smtpEmail,
    //   to: email,
    //   subject: "Reset Password - Fintech App",
    //   html : emailContent,
    // };
    const mailOptions = {
      from: config.smtpEmail,
      to: user.email,
      subject: 'Password Reset',
      //  text: `Click the following link to reset your password: https://localhost:8080/reset-password`,
      text: `Click the following link to reset your password: https://localhost:8080/reset-password/${forgotPasswordToken}`,
    };
    await sendEmail(mailOptions);
  }

  async verifyForgotPassword(token: string) {
    // If token does not exist, send a 400 Bad Request error
    if (!token) {
      const err = new CustomError(400, "Token missing");
      throw err;
    }

    const verified: any = verifyForgotPasswordToken(token);

    // If the token is not valid, send a 401 Unauthorized error
    if (!verified) {
      const err = new CustomError(401, "Invalid token");
      throw err;
    }

    // Find the user by email from the verified token
    const user = await userRepository.getByEmail(verified?.email as string);

    // If the user does not exist, send a 404 Not Found error
    if (!user) {
      const err = new CustomError(404, "User not found");
      throw err;
    }

    // If the forgotPasswordToken does not match the token in the database, send a 401 Unauthorized error
    if (user.forgotPasswordToken !== token) {
      const err = new CustomError(401, "Reset token has expired");
      throw err;
    }

    // If token expiration check is needed, you can add it here
    /*
    if (Number(user.forgotPasswordTokenExpiresAt) < Date.now()) {
    const err = new CustomError(401, 'Reset token has expired');
    throw err;
    }
    */

    // Everything is valid, proceed further
    return true;
  }

  async changePassword(token: string, password: string) {
    // If token is missing, send a 400 Bad Request error
    if (!token) {
      const err = new CustomError(400, "Token missing"); // 400 Bad Request
      throw err;
    }

    const verified: any = await verifyForgotPasswordToken(token);

    // If the token is invalid, send a 401 Unauthorized error
    if (!verified) {
      const err = new CustomError(401, "Invalid token"); // 401 Unauthorized
      throw err;
    }

    // Find user by email from the verified token
    const user = await userRepository.getByEmail(verified?.email as string);

    // If the user does not exist, send a 404 Not Found error
    if (!user) {
      const err = new CustomError(404, "User not found"); // 404 Not Found
      throw err;
    }

    // If the provided token doesn't match the one in the user's record, send a 401 Unauthorized error
    if (user.forgotPasswordToken !== token) {
      const err = new CustomError(401, "Reset token has expired"); // 401 Unauthorized
      throw err;
    }

    // Check if the new password is the same as the old one
    if (user?.password) {
      const encrypted = await comparePassword(password, user?.password);

      // If the new password is the same as the old one, send a 422 Unprocessable Entity error
      if (encrypted) {
        const error = new CustomError(
          422,
          "New password cannot be the same as the old password"
        ); // 422 Unprocessable Entity
        throw error;
      }
    }

    // Encrypt the new password
    const hashedPassword = await hashPassword(password);

    // Save the new password and remove the forgot password tokens
    const updatedUser = await userRepository.update(user?.id, {
      password: hashedPassword,
      isVerified: true,
      forgotPasswordToken: null,
      // forgotPasswordTokenExpiresAt: null,
    });

    return updatedUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyRegisteredUser(token: string, password: string, email: string) {
    // If token is missing, send a 400 Bad Request error
    if (!token) {
      const err = new CustomError(400, "Token missing"); // 400 Bad Request
      throw err;
    }

    const verified: any = verifyForgotPasswordToken(token);

    // If the token is invalid, send a 401 Unauthorized error
    if (!verified) {
      const err = new CustomError(401, "Invalid token"); // 401 Unauthorized
      throw err;
    }

    // Find user by email from the verified token
    const user = await userRepository.getByEmail(verified?.email as string);

    // If the user does not exist, send a 404 Not Found error
    if (!user) {
      const err = new CustomError(404, "User not found"); // 404 Not Found
      throw err;
    }

    // Update the user's verification status
    const updatedUser = await userRepository.update(user?.id, {
      isVerified: true,
    });

    return updatedUser;
  }

  async GetPassword(token: string) {
    // If token is missing, send a 400 Bad Request error
    if (!token) {
      const err = new CustomError(400, "Token missing"); // 400 Bad Request
      throw err;
    }

    const verified: any = await verifyAccessToken(token);

    // If the token is invalid, send a 401 Unauthorized error
    if (!verified) {
      const err = new CustomError(401, "Invalid token"); // 401 Unauthorized
      throw err;
    }

    // Find user by email from the verified token
    const user = await userRepository.getByEmail(verified?.email as string);

    // If the user does not exist, send a 404 Not Found error
    if (!user) {
      const err = new CustomError(404, "User not found"); // 404 Not Found
      throw err;
    }

    // Return the user information
    return user;
  }

  async setPassword(token: string, password: string) {
    // If token is missing, send a 400 Bad Request error
    if (!token) {
      const err = new CustomError(400, "Token missing"); // 400 Bad Request
      throw err;
    }

    const verified: any = await verifyAccessToken(token);

    // If the token is invalid, send a 401 Unauthorized error
    if (!verified) {
      const err = new CustomError(401, "Invalid token"); // 401 Unauthorized
      throw err;
    }
    // Find user by email from verified token
    const user = await userRepository.getByEmail(verified?.email as string);

    // If the user does not exist, send a 404 Not Found error
    if (!user) {
      const err = new CustomError(404, "User not found"); // 404 Not Found
      throw err;
    }
    // Check if the new password is the same as the old one
    // if (user?.password) {
    //   const encrypted = await comparePassword(password, user?.password);
    //   // If the new password is the same as the old one, send a 422 Unprocessable Entity error
    //   if (encrypted) {
    //     const error = new CustomError(
    //       422,
    //       "New password cannot be the same as the old password"
    //     ); // 422 Unprocessable Entity
    //     throw error;
    //   }
    // }

    const hashedPassword = await hashPassword(password);

    // Save the new password and update the user's verification status
    const updatedUser = await userRepository.update(user?.id, {
      password: hashedPassword,
      isVerified: true,
    });

    return updatedUser;
  }
}

export default new AuthServices();
