import express from "express";
import authRoutes from "./authRoutes";
import quickbooksRoutes from "./quickBooksRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/qbo", quickbooksRoutes);

export default router;

