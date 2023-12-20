/* eslint-disable @typescript-eslint/no-var-requires */
const { body } = require("express-validator");

export const loginValidationRules = [
  body("email").isEmail().withMessage("Invalid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidationRules = [
  body("email").isEmail().withMessage("Invalid email address"),
];

export const changePasswordValidationRules = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    )
    .withMessage(
      "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password required")
    .custom((value: any, { req }: any) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const setPasswordValidationRules = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    )
    .withMessage(
      "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password required")
    .custom((value: any, { req }: any) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
