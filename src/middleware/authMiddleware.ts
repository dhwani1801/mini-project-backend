import { NextFunction, Response } from "express";
import { verifyAccessToken } from "../helpers/tokenHelper";
import { CustomError } from "../models/customError";
import { userRepository } from "../repositories";

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await userRepository.getByEmail(req.body.email);
    const tokenFromDatabase = data?.accessToken;

    if (!tokenFromDatabase) {
      const error = new CustomError(
        401,
        "AUTHENTICATION ERROR : YOUR SESSION IS EXPIRED. PLEASE LOGIN AGAIN."
      );
      return next(error);
    }

    const verifiedAccessToken: any = verifyAccessToken(tokenFromDatabase);

    if (!verifiedAccessToken) {
      const error = new CustomError(
        401,
        "AUTHENTICATION ERROR : INVALID TOKEN"
      );
      return next(error);
    }

    req.user = {
      id: verifiedAccessToken.id,
      email: verifiedAccessToken.email
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
