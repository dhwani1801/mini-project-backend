import express from "express";
import { quickbooksController } from "../controllers";
const router = express.Router();

router.get("/authurl", quickbooksController.getQuickbooksAuthUri);

router.get("/customerList", quickbooksController.getAllQBOCustomers);

router.get("/itemList", quickbooksController.getAllQBOItems);

router.get("/depositList", quickbooksController.getAllAccountTypes);

router.get("/paymentMethodList", quickbooksController.getAllQBOPamentMethods);

router.post("/callback", quickbooksController.createIntegration);
router.post("/createConfiguration", quickbooksController.createConfiguration);

router.post("/sync/:companyId", quickbooksController.syncData);

router.post(
  "/webhook-endpoint",
  quickbooksController.getCustomerInfoUsingWebhook
);

router.get("/getCustomers/:companyId", quickbooksController.getCustomersList);

router.get("/getInvoices/:companyId", quickbooksController.getInvoicesList);

router.get("/getPayments/:companyId", quickbooksController.getPaymentsList);

router.get("/getSyncLogs/:companyId", quickbooksController.getSyncLogsList);

export default router;
