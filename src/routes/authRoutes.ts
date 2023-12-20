import express from "express";
import { authController } from "../controllers";
import { forgotPasswordValidationRules } from "../helpers/validators";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post(
  "/forgot-password",
  forgotPasswordValidationRules,
  authController.forgotPassword
);
router.post("/change-password/:token", authController.changePassword);
router.post("/setpassword/:token", authController.SetPassword);
router.get("/get-email", authController.getUserDetailsByEmail);

export default router;
