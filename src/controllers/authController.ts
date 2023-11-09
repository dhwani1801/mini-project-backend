/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { checkValidation } from "../helpers/validationHelper";
import { RequestExtended } from "../interfaces/global";
import authServices from "../services/authService";
import { hashPassword } from "../helpers/passwordHelper";
import { getRegisterEmailTemplateInfra } from "../helpers/emailTemplateHelper";
import {
//   companyRoleRepository,
//   roleRepository,
  userRepository,
 // companyRepository,
} from "../repositories";
import config from "../../config";
import sendEmail from "../helpers/emailHelper";
import {
  generateForgotPasswordToken,
  verifyForgotPasswordToken,
} from "../helpers/tokenHelper";
import { CustomError } from "../models/customError";
import tokenRepository from "../repositories/tokenRepository";

class AuthController {
 
  // register done
async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { confirmPassword, ...data } = req.body;
     console.log('req.body : ',req.body)
      // Hash the user's password
      const hashedPassword = await hashPassword(data.password);
  
      data.password = hashedPassword;
      data.isVerified = false;
  
      // Register the user
      const response = await userRepository.register(data);
      console.log('response',response)
      // Generate a forgot password token for email verification
      const forgotPasswordToken = generateForgotPasswordToken({
        id: response.id,
        email: response.email,
      });
  
      // Update the user's record with the forgot password token
      await userRepository.update(response.id, {
        forgotPasswordToken: forgotPasswordToken,
      });
  
      // Generate the verification URL
      const url = `${config?.verifyEmail}?token=${forgotPasswordToken}&first=true`;
  
      // Generate a full name for the user
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
  
      // // Create email options
      const mailOptions = {
        from: config.smtpEmail,
        to: email,
        subject: "Welcome to mini project!",
        html: emailContent,
      };
     console.log('mailoptionss : ',mailOptions);
       // Send a welcome email with the verification link
       await sendEmail(mailOptions);
  
      // Respond with a success message
      return DefaultResponse(
        res,
        200,
        "Registration successful. Kindly check your email for verification."
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }
  

  // Get user details by email
  async getUserDetailsByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract email from the query parameters
      const email = req.query.email;

      // Get user details by email
      const user = await userRepository.getByEmail(email as string);

      // Respond with the user details
      return DefaultResponse(
        res,
        200,
        "User details fetched successfully",
        user
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Verify Registered User/Email
  async verifyRegisteredEmail(req: Request, res: Response, next: NextFunction) {
    try {
      // Check request validation
      checkValidation(req);

      // Extract password, email, and token from the request
      const { password, email } = req.body;
      const { token } = req.params;

      // Verify the registered user with the provided token, password, and email
      const user = await authServices.verifyRegisteredUser(
        token,
        password,
        email
      );

      // Respond with a success message and the user data
      return DefaultResponse(res, 200, "User Verification Successful", user);
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Login User done
  async login(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      // Check request validation
      // checkValidation(req);
      // console.log('222222222222 : ' ,    checkValidation(req))
      // Extract email, password, rememberMe, and confirmOverRide from the request body
      const { email, password, rememberMe, } = req.body;
      // Attempt to log in the user
      const user: any = await authServices.login(
        email.toLowerCase(),
        password,
      );

      // Destructure user properties and remove sensitive information
      const {
        password: userPassword,
        forgotPasswordToken,
        isVerified,
        ...finalUser
      } = user;

      // // Check if the user's first company allows login
      // if (!user?.companies[0]?.status) {
      //   const error = new CustomError(401, "User is not allowed to login");
      //   throw error;
      // }
      // Respond with a success message and the user data
      return DefaultResponse(
        res,
        200,
        "User logged in successfully",
        JSON.stringify(finalUser)
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Logout
  async logout(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      // Extract logoutData from the request body
      const { logoutData } = req.body;
      const userEmail = logoutData?.email;
      const userAccessToken = logoutData?.accessToken;

      // Retrieve the user's stored access token from the database
      const userDataInDatabase = await userRepository.getByEmail(
        userEmail as string
      );

      if (
        userDataInDatabase// &&
     //   userDataInDatabase?.accessToken === userAccessToken
      ) {
        // If the stored access token matches the one provided in the request, delete the token
        await tokenRepository.deleteToken(userEmail as string);

        // Respond with a success message
        return DefaultResponse(res, 200, "User logged out successfully!");
      } else {
        // If the access token doesn't match, do nothing
        return DefaultResponse(res, 200, "User[0] logged out successfully!");
      }
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Forgot Password
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the request
      checkValidation(req);

      // Extract the email from the request body
      const { email } = req.body;

      // Trigger the forgot password process
      await authServices.forgotPassword(email);

      // Respond with a success message
      return DefaultResponse(
        res,
        200,
        "Password reset link sent to your email address"
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Verify Forgot Password Token
  async verifyForgotPasswordToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Extract the token from the query parameters
      const { token } = req.query;

      // Verify the forgot password token
      await authServices.verifyForgotPassword(token as string);

      // Respond with a success message
      return DefaultResponse(
        res,
        200,
        "Reset Password Token verified successfully"
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Change Password done 
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the request
      checkValidation(req);
      // Extract password and token from the request
      const { password } = req.body;
      const { token } = req.params;

      // Change the user's password using the provided token
      const user = await authServices.changePassword(token, password);

      // Respond with a success message and user data
      return DefaultResponse(
        res,
        200,
        "User password changed successfully",
        user
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Set Password  done
  async SetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the request
      checkValidation(req);

      // Extract password and token from the request
      const { password } = req.body;
      const { token } = req.params;

      // Set the user's password using the provided token
      const user = await authServices.setPassword(token, password);
      // Respond with a success message and user data
      return DefaultResponse(res, 200, "User password set successfully", user);
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Get Password done
  async GetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the request
      checkValidation(req);

      // Extract password and token from the request
      const { token } = req.params;

      // Get the user's password using the provided token
      const user = await authServices.GetPassword(token);
       console.log(user.password)
      // Respond with a success message and user data
      return DefaultResponse(
        res,
        200,
        "User password retrieved successfully",
        user.password
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }

  // Fetch Profile done
  async fetchProfile(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      // Fetch the user's profile data by user ID
      const profile = await userRepository.getById(req.user.id);
      console.log('profile : ' , profile)
      // Remove unnecessary properties from the user profile
      const filteredProfile = {
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
  
      // Respond with the filtered user profile data
      return DefaultResponse(
        res,
        200,
        "Profile fetched successfully",
        filteredProfile
      );
    } catch (err) {
      // Handle errors and pass them to the next middleware
      next(err);
    }
  }
  

  // Update Profile
//   async updateProfile(req: RequestExtended, res: Response, next: NextFunction) {
//     try {
//       // Extract email and other data from the request body
//       const { email, ...data } = req.body;

//       // Check if there's a profile image file in the request
//       if (req?.file?.location) {
//         // Extract the file URL and remove the base URL
//         const fileUrl = req.file.location.replace(config.s3BaseUrl, "");
//         data.profileImg = fileUrl;
//       }

//       // Handle the case where profileImg is "null" as a string and convert it to null
//       if (data.profileImg === "null") {
//         data.profileImg = null;
//       }

//       // Update the user's profile data
//       const profile = await userRepository.update(req.user.id, data);

//       // Check if the user has a subscription with no company or role assigned
//       const user: any = await companyRoleRepository.getRecordWithNullCompanyId(
//         req.user.id
//       );

//       let profileData;
//       if (user.length > 0) {
//         // Check if the user is a companyAdmin
//         const isCompanyAdmin = await roleRepository.checkCompanyAdminRole(
//           user[0]?.role?.id
//         );
//         if (isCompanyAdmin) {
//           profileData = {
//             ...profile,
//             isFirstCompanyAdmin: true,
//           };
//         } else {
//           profileData = {
//             ...profile,
//             isFirstCompanyAdmin: false,
//           };
//         }
//       } else {
//         profileData = {
//           ...profile,
//           isFirstCompanyAdmin: false,
//         };
//       }

//       // Respond with the updated user's profile data
//       return DefaultResponse(
//         res,
//         200,
//         "Profile updated successfully",
//         profileData
//       );
//     } catch (err) {
//       // Handle errors and pass them to the next middleware
//       next(err);
//     }
//   }
}

export default new AuthController();
