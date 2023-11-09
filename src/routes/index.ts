import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import quickbooksRoutes from "./quickBooksRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
//router.use("/users", userRoutes);
router.use("/qbo", quickbooksRoutes);

export default router;
