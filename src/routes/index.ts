import express from "express";
import authRoutes from "./authRoutes";
import quickbooksRoutes from "./quickBooksRoutes";
import xeroRoutes from './xeroRoutes';
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/qbo", quickbooksRoutes);
router.use("/xero", xeroRoutes);

export default router;

