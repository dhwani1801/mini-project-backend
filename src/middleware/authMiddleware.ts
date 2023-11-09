import { NextFunction, Response } from "express";
import { verifyAccessToken } from "../helpers/tokenHelper";
import { CustomError } from "../models/customError";
import { userRepository } from "../repositories";

// export const isAuthenticated = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Fetch Token from Header
//     const accessTokenFromCookie = req?.headers?.authorization?.split(
//       " "
//     )[1] 

//     // Check if the access token is missing
//     if (!accessTokenFromCookie) {
//       const error = new CustomError(
//         401,
//         "Authentication Error: Your session has expired. Please log in again to continue using the app."
//       );
//       return next(error);
//     }

//     // Verify the access token
//     const verifiedAccessToken: any = verifyAccessToken(accessTokenFromCookie);

//     // Check if the access token is invalid
//     if (!verifiedAccessToken) {
//       const error = new CustomError(
//         401,
//         "Authentication Error: Invalid access token"
//       );
//       return next(error);
//     }

//     // Attach user information to the request
//     req.user = {
//       id: verifiedAccessToken.id,
//       email: verifiedAccessToken.email,
//       companyId: verifiedAccessToken.companyId
//     };

//     // Fetch the token from the database for the user
//     const data = await userRepository.getByEmail(req.user.email);
//     const tokenFromDatabase = data?.accessToken;

//     // Check if token from the database exists and matches the token from the cookie
//     if (tokenFromDatabase !== accessTokenFromCookie) {
//       throw new CustomError(
//         401,
//         "Authentication Error: Your session has been overridden"
//       );
//     }

//     // User is authenticated
//     next();
//   } catch (err: any) {
//     next(err);
//   }
// };
export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    
    // // Fetch Token from the local database using user email
    const data = await userRepository.getByEmail(req.body.email);
    const tokenFromDatabase = data?.accessToken;

    // Check if the access token is missing in the database
    if (!tokenFromDatabase) {
      const error = new CustomError(
        401,
        "Authentication Error: Your session has expired. Please log in again to continue using the app."
      );
      return next(error);
    }

    // Verify the access token from the database
    const verifiedAccessToken: any = verifyAccessToken(tokenFromDatabase);

    // Check if the access token from the database is invalid
    if (!verifiedAccessToken) {
      const error = new CustomError(
        401,
        "Authentication Error: Invalid access token"
      );
      return next(error);
    }

    req.user ={
      id:verifiedAccessToken.id,
      email:verifiedAccessToken.email
    }

    // User is authenticated
    next();
  } catch (err: any) {
    next(err);
  }
};

// export const refreshAccessToken = async (
//   accessToken: string,
//   refreshToken: string
// ) => {
//   try {
//     // Check if the refresh token is valid
//     const verified: any = verifyRefreshToken(refreshToken);

//     if (!verified) {
//       const error = new CustomError(401, "Invalid refresh token");
//       throw error;
//     }

//     // Generate new access token
//     const newAccessToken = generateAccessToken({
//       id: verified?.id,
//       email: verified?.email,
//     });

//     // Generate new refresh token
//     const newRefreshToken = generateRefreshToken(
//       {
//         id: verified?.id,
//         email: verified?.email,
//       },
//       false
//     );

//     // await tokenRepository?.updateTokens(
//     // 	verified?.id,
//     // 	accessToken,
//     // 	refreshToken,
//     // 	newAccessToken,
//     // 	newRefreshToken
//     // );

//     return { newAccessToken, newRefreshToken };
//   } catch (err: any) {
//     if (err.name == "TokenExpiredError") {
//       const error = new CustomError(401, "Token expired");
//       throw error;
//     } else {
//       throw err;
//     }
//   }
// };
