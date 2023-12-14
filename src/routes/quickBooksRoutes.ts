import express from "express";
import { quickbooksController } from "../controllers";
const router = express.Router();

router.get("/authurl", quickbooksController.getQuickbooksAuthUri);

router.get("/employees", quickbooksController.getAllQBOCustomers);

router.post("/callback", quickbooksController.createIntegration);
router.get("empployees", quickbooksController.getAllQBOCustomers);
router.post("/customer/:companyId", quickbooksController.createCustomer);

router.post("/update/:companyId", quickbooksController.updateCustomer);

router.post("/webhook-endpoint", quickbooksController.getCustomerInfo);
export default router;
