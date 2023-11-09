import express from "express";
import { quickbooksController } from "../controllers";
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Get Quickbooks Auth URL
router.get( 
    "/authurl",
  //  isAuthenticated,
    quickbooksController.getQuickbooksAuthUri
);

// Quickbooks Callback
router.post(
  "/callback",
//  isAuthenticated,
  quickbooksController.quickbooksCallback
);

router.post(
	'/employees',
//	isAuthenticated,
//	quickbooksEmployeeValidation,
	quickbooksController.getAllQBEmployees      
);

export default router;
