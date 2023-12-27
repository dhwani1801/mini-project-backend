import { NextFunction, Response, Request } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { RequestExtended } from "../interfaces/global";
import quickBookService from "../services";
import { AuthTokenInterface } from "../interfaces/quickBookInterface";
import quickbookService from "../services/quickbookService";
import { qbRepository } from "../repositories";
import { CustomerObject } from "../interfaces";
import { prisma } from "../client/prisma";
import quickbookRepository from "../repositories/quickbookRepository";

class QuickbooksController {
  async getQuickbooksAuthUri(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authURL = await quickBookService.quickBookService.getauthURL();
      return DefaultResponse(
        res,
        200,
        "AUTH_URL_RETRIVED_SUCCESSFULLY",
        authURL
      );
    } catch (err) {
      next(err);
    }
  }

  async createIntegration(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    const url = String(req?.body?.url);
    const authToken: AuthTokenInterface =
      await quickbookService.createAuthToken(url);

    const qboCompanyInfo = await quickbookService.getCompanyInfo(
      authToken.access_token,
      authToken.realmId,
      authToken.refresh_token
    );

    const data = {
      tenantID: authToken.realmId,
      tenantName: qboCompanyInfo?.CompanyName,
      accessToken: authToken.access_token,
      refreshToken: authToken.refresh_token,
      accessTokenUTCDate: new Date(),
    };

    const isAlreadyConnected = await quickbookRepository.getCompanyByTenantId(
      authToken.realmId
    );

    if (isAlreadyConnected) {
      const error = new Error("Company_is_already_connected");
      return error;
    }

    const finalCompanyDetails = await qbRepository.create(data);

    return DefaultResponse(
      res,
      200,
      "CONNECTED_SUCCESSFULLY",
      finalCompanyDetails
    );
  }

  async getAllQBOCustomers(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.body.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);

      const customersList: any = await quickbookService.getCustomers(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string
      );

      return DefaultResponse(
        res,
        200,
        "CUSTOMER_FETCHED_SUCCESSFULLY",
        customersList?.QueryResponse?.Customer
      );
    } catch (err) {
      next(err);
    }
  }

  // async updateCustomer(
  //   req: RequestExtended,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     // const companyId = "b2e7f6b1-9ad7-4347-af82-eb0f539dc429";
  //     const companyId = req.params.companyId;
  //     const authResponse = await quickbookService.getAccessToken(companyId);
  //     const customerData = req.body as CustomerObject;

  //     const createdCustomer = await quickbookService.updateCustomer(
  //       authResponse?.accessToken as string,
  //       authResponse?.tenantID as string,
  //       authResponse?.refreshToken as string,
  //       customerData
  //     );

  //     return DefaultResponse(
  //       res,
  //       200,
  //       "CUSTOMER UPDATED SUCCESSFULLY",
  //       createdCustomer
  //     );
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async createCustomer(
  //   req: RequestExtended,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const companyId = req.params.companyId;
  //     const authResponse = await quickbookService.getAccessToken(companyId);
  //     const customerData = req.body as CustomerObject;
  //     const createdCustomer = await quickbookService.createCustomer(
  //       authResponse?.accessToken as string,
  //       authResponse?.tenantID as string,
  //       authResponse?.refreshToken as string,
  //       customerData
  //     );

  //     return DefaultResponse(
  //       res,
  //       200,
  //       "CUSTOMER CREATED SUCCESSFULLY",
  //       createdCustomer
  //     );
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  async getCustomerInfo(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      console.log("realmeid : ", req.body.eventNotifications[0].realmId);
      const customerId =
        req.body.eventNotifications[0].dataChangeEvent.entities[0].id;
      const companyId = "e1fe9128-3db3-4461-b8e1-5acaa395d4f3";
      const authResponse = await quickbookService.getAccessToken(companyId);
      if (!req.body || !req.body.eventNotifications) {
        return res.status(400).send("Invalid webhook payload");
      }
      const realmId = authResponse?.tenantID as string;
      const customerInfo =
        await quickBookService.quickBookService.getCustomerInfo(
          authResponse?.accessToken as string,
          authResponse?.tenantID as string,
          customerId,
          authResponse?.refreshToken as string
        );

      const createdCustomer = await prisma.customer.create({
        data: {
          qboCustomerId: customerId,
          customerId: customerInfo.PrimaryEmailAddr.Address,
          givenName: customerInfo.DisplayName,
          phone: customerInfo.PrimaryPhone.FreeFormNumber,
          tenantID: realmId,
        },
      });
      return createdCustomer;
    } catch (err) {
      next(err);
    }
  }

  async createOrUpdateCustomer(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.params.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);
      const customerData = req.body;
      const result = await quickbookService.createAndUpdateCustomer(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string,
        customerData
      );

      return DefaultResponse(res, 200, result);
    } catch (err) {
      next(err);
    }
  }

  async createInvoice(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);
      const invoiceObject = req.body;

      const result = await quickbookService.createInvoice(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string,
        invoiceObject
      );

      return DefaultResponse(res, 200, "INVOICE_CREATED_SUCCESSFULLY", result);
    } catch (err) {
      next(err);
    }
  }

  async createPayment(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);
      const paymentObject = req.body;
      const result = await quickbookService.createPayment(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string,
        paymentObject
      );

      return DefaultResponse(res, 200, "Payment_CREATED_SUCCESSFULLY", result);
    } catch (err) {
      next(err);
    }
  }
}
export default new QuickbooksController();
