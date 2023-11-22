import express from "express";
import { quickbooksController } from "../controllers";
import { prisma } from "../client/prisma";
const crypto = require('crypto');
const router = express.Router();

// Get Quickbooks Auth URL

router.get(
  "/authurl",
  quickbooksController.getQuickbooksAuthUri
);

router.get(
  '/employees',
  quickbooksController.getAllQBOCustomers
);

router.post('/test', quickbooksController.createIntegration);
router.get('empployees' , quickbooksController.getAllQBOCustomers)
router.post('/customer/:companyId', quickbooksController.createCustomer);

router.post('/update/:companyId', quickbooksController.updateCustomer);
export default router;

// router.post('/webhook/qbo/customerCreated', async (req, res) => {
//   try {
//     console.log('req body : ',req.body)
//     const verifierToken = 'e4fe3291-37c0-4968-8329-3bd8a49542db';
//     console.log('verifierToken :',verifierToken)
//     const intuitSignature = req.headers['intuit-signature']
//     console.log('intuitSignature :',intuitSignature)
//     const hash = crypto.createHmac('sha256', verifierToken)
//     .update(JSON.stringify(req.body))
//     .digest('base64');
//     console.log('hash :',hash)
//     const hashHex = Buffer.from(hash, 'base64').toString('hex');
//     if (hashHex === intuitSignature) {
//       console.log('Webhook verification successful.');
//       const customerInfo = req.body;
//       const createdCustomerInDB = await prisma.customer.create({
//         data: {
//           qboCustomerId: customerInfo.Id,
//           customerId: '123', 
//           givenName: customerInfo.DisplayName,
//           phone: customerInfo.PrimaryPhone?.FreeFormNumber,
//         },
//       });

//       console.log('Customer created in the database:', createdCustomerInDB);
//        res.status(200).send('Verification and database update successful.');
//     } else {
//       console.log('Webhook verification failed.');
//       res.status(403).send('Verification failed.');
//     }
    
//   } catch (err) {
//     console.error('Error processing webhook:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });
