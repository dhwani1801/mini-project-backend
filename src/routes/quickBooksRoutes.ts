import express from "express";
import { quickbooksController } from "../controllers";
const router = express.Router();

router.get("/authurl", quickbooksController.getQuickbooksAuthUri);

router.get("/employees", quickbooksController.getAllQBOCustomers);

router.post("/callback", quickbooksController.createIntegration);
router.get("customers", quickbooksController.getAllQBOCustomers);
//router.post("/customer/:companyId", quickbooksController.createCustomer);
router.post("/payment/:companyId", quickbooksController.createPayment);
router.post("/update/:companyId", quickbooksController.createOrUpdateCustomer);
router.post('/invoice/:companyId' , quickbooksController.createInvoice);
router.post("/webhook-endpoint", quickbooksController.getCustomerInfo);
export default router;
