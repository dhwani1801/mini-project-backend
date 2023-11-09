import { NextFunction, Request, Response } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { hashPassword } from "../helpers/passwordHelper";
import { UserInfo } from "../interfaces";
import userRepository from "../repositories/userRepository";
import userServices from "../services/userService";
import { checkValidation } from "../helpers/validationHelper";
import { RequestExtended } from "../interfaces/global";
import { CustomError } from "../models/customError";
import { checkPermission } from "../middleware/isAuthorizedUser";

class UserController {
  // Get All Users
//   async getAllUsers(req: RequestExtended, res: Response, next: NextFunction) {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         search,
//         filter,
//         type,
//         sort,
//       } = req.query;

//       // Call userServices to fetch users based on the provided parameters
//       const { users, total } = await userServices.getAllUsers(
//         req.user.companyId as string,
//         Number(page),
//         Number(limit),
//         search as string,
//         filter as string,
//         type as string,
//         sort as string
//       );

//       // Return a successful response with HTTP 200 status code, user data, and pagination information
//       return DefaultResponse(
//         res,
//         200,
//         "Users fetched successfully",
//         users,
//         total,
//         Number(page)
//       );
//     } catch (err) {
//       // Handle any errors that occur during the execution
//       next(err);
//     }
//   }

  // Get User Details
//   async getUserDetails(req: Request, res: Response, next: NextFunction) {
//     try {
//       const id = req.params.id;

//       // Call the userServices function to fetch user details by user ID
//       const user = await userServices.getUserById(id);

//       // Check if the user exists
//       if (!user) {
//         // Return an HTTP 404 status code with a friendly message if the user is not found
//         return DefaultResponse(
//           res,
//           404,
//           "User not found. Please check the user ID and try again."
//         );
//       }

//       // Return a successful response with HTTP 200 status code and user details
//       return DefaultResponse(
//         res,
//         200,
//         "User details fetched successfully",
//         user
//       );
//     } catch (err) {
//       // Handle any errors that occur during the execution
//       next(err);
//     }   
//   \

  // Creating a new user
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Hashing the user's password for security
      const { password } = req.body;
      const hashedPassword = await hashPassword(password);

      // Constructing user data
      const userData: UserInfo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
      };

      // Calling userRepository to create the user
      const user = await userRepository.create(userData);

      // Returning a successful response with HTTP 200 status code
      return DefaultResponse(res, 200, "User created successfully", user);
    } catch (err) {
      // Handling any errors that occur during the execution
      next(err);
    }
  }

//   async updateUser(req: RequestExtended, res: Response, next: NextFunction) {
//     try {
//       // Check Validation

//       checkValidation(req);

//       // // Checking is the user is permitted
//       const isPermitted = await checkPermission(req, {
//         permissionName: "Users",
//         permission: ["edit"],
//       });

//       if (!isPermitted) {
//         throw new CustomError(403, "You are not authorized");
//       }

//       req.body.companyId = req.user.companyId;

//       // Update User
//       const user = await userServices.updateUser(req.body);

//       if (user.status === true) {
//         return DefaultResponse(
//           res,
//           200,
//           "User Status updated successfully",
//           user.updatedUser
//         );
//       }
//       return DefaultResponse(
//         res,
//         200,
//         "User updated successfully",
//         user.updatedUser
//       );
//     } catch (err) {
//       next(err);
//     }
//   }

//   // Deleting a user
//   async deleteUser(req: RequestExtended, res: Response, next: NextFunction) {
//     try {
//       // Check Validation of the request
//       checkValidation(req);
//       const company = req.user.companyId;
//       const { user } = req.body;

//       // Check if the user has permission to delete
//       const isPermitted = await checkPermission(req, {
//         permissionName: "Users",
//         permission: ["delete"],
//       });

//       // If not permitted, throw an authorization error
//       if (!isPermitted) {
//         throw new CustomError(403, "You are not authorized");
//       }

//       // Delete the user using userServices
//       const deletedUser = await userServices.deleteUser(user, company);

//       // Return a successful response with HTTP 200 status code
//       return DefaultResponse(
//         res,
//         200,
//         "User deleted successfully",
//         deletedUser
//       );
//     } catch (err) {
//       // Handle any errors that occur during the execution
//       next(err);
//     }
//   }


//   // Integrating a user
//   async integrate(req: Request, res: Response, next: NextFunction) {
//     try {
//       // Check Validation of the request
//       checkValidation(req);
//       const { user, role, company } = req.body;

//       // Integrate the user into a role and company using companyRoleRepository
//       const integratedUser = await companyRoleRepository.create(
//         user,
//         role,
//         company
//       );

//       // Return a successful response with HTTP 201 status code
//       return DefaultResponse(
//         res,
//         201,
//         "User Integrated Successfully",
//         integratedUser
//       );
//     } catch (err) {
//       // Handle any errors that occur during the execution
//       next(err);
//     }
//   }
 }

export default new UserController();
