/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
import config from "../../config";
import sendEmail from "../helpers/emailHelper";
import {
    getInvitationAdminMailTemplate,
    getInvitationEmailUserExistTemplate,
    getInvitationEmailUserTemplate,
} from "../helpers/emailTemplateHelper";
import {
    generateAccessToken,
    //  generateForgotPasswordToken
} from "../helpers/tokenHelper";
import { UpdateUserInfo } from "../interfaces/user";
import { CustomError } from "../models/customError";
import {
    //   companyRepository,
    //   roleRepository,
    userRepository,
} from "../repositories";
//import companyRoleRepository from "../repositories/companyRoleRepository";
// import inviteRepository from '../repositories/inviteRepository';

class UserServices {
    // async getAllUsers(
    //     company: string,
    //     page: number,
    //     limit: number,
    //     search?: string,
    //     filter?: string,
    //     type?: string,
    //     sort?: string
    // ) {
    //     // Calculate the offset based on the page and limit
    //     const offset = (Number(page) - 1) * Number(limit);

    //     // Define filter conditions based on the 'filter' parameter
    //     const filterConditions: Record<string, any> = filter
    //         ? { status: filter == "true" }
    //         : {};

    //     // Define search conditions based on the 'search' parameter
    //     const searchCondition = search
    //         ? {
    //             OR: [
    //                 {
    //                     firstName: {
    //                         mode: "insensitive",
    //                         contains: search,
    //                     },
    //                 },
    //                 {
    //                     lastName: {
    //                         mode: "insensitive",
    //                         contains: search,
    //                     },
    //                 },
    //                 {
    //                     email: { contains: search, mode: "insensitive" },
    //                 },
    //             ],
    //         }
    //         : {};

    //     // Define sorting conditions based on the 'sort' and 'type' parameters
    //     const sortCondition = sort
    //         ? {
    //             orderBy: {
    //                 [sort]: type ?? "asc",
    //             },
    //         }
    //         : {};

    //     // Get all users with applied filters, search, and sorting
    //     const users = await userRepository.getAll(
    //         company,
    //         offset,
    //         limit,
    //         filterConditions,
    //         searchCondition,
    //         sortCondition
    //     );

    //     // Get the total count of users based on the applied filters and search
    //     const total = await userRepository.count(
    //         company,
    //         filterConditions,
    //         searchCondition
    //     );

    //     return { users, total };
    // }

    // Get user by id
    // async getUserById(id: string) {
    //     const user = await userRepository.getById(id);
    //     return user;
    // }

    //   // Update user
    async updateUser(data: UpdateUserInfo) {
        const { userId, ...userData } = data;
      
        const user = await userRepository.getById(userId);
      
        if (!user) {
          const error = new CustomError(404, "User not found");
          throw error;
        }
      
        // Update the user's data
        await userRepository.update(userId, userData);
      
        // Return the updated user
        return { updatedUser: user, status: false };
      }
      


    //   // Delete User
    //   async deleteUser(userId: string, companyId: string) {
    //     // Find User
    //     const user = await userRepository.getById(userId);

    //     // If user not found, send a 404 Not Found error
    //     if (!user) {
    //       const error = new CustomError(404, "User not found"); // 404 Not Found
    //       throw error;
    //     }

    //     // Find Company
    //     const company = await companyRepository.getDetails(companyId);

    //     // If company not found, send a 404 Not Found error
    //     if (!company) {
    //       const error = new CustomError(404, "Company not found"); // 404 Not Found
    //       throw error;
    //     }

    //     // Check if user exists in the company
    //     const userExist = await companyRoleRepository.userExistInCompany(
    //       companyId,
    //       userId
    //     );

    //     // If user does not exist in the company, send a 404 Not Found error
    //     if (!userExist) {
    //       const error = new CustomError(
    //         404,
    //         "User does not exist in this company"
    //       ); // 404 Not Found
    //       throw error;
    //     }

    //     // Delete User From Company Role
    //     const deleteUser = await companyRoleRepository.deleteUserFromCompany(
    //       userId,
    //       companyId
    //     );

    //     // Check if the role still exists in the company
    //     const roleExist = await companyRoleRepository.roleInCompany(
    //       userExist.roleId
    //     );

    //     // If the role doesn't exist in the company, combine it
    //     if (!roleExist) {
    //       await roleRepository.combineRoleCompany(companyId, userExist.roleId);
    //     }

    //     return deleteUser;
    //   }
}

export default new UserServices();
