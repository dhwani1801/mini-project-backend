import { NextFunction, Response, Request } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { RequestExtended } from "../interfaces/global";
import quickBookService from "../services";
import { AuthTokenInterface } from "../interfaces/quickBookInterface";
import quickbookService from "../services/quickbookService";
import { qbRepository } from "../repositories";
import { CustomerObject } from "../interfaces";
import { prisma } from "../client/prisma";

class QuickbooksController {
  /**
   * get quickbook auth url
   * @param req
   * @param res
   * @param next
   * @returns
   */
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
        "AUTH URL RETRIVED SUCCESSFULLY",
        authURL
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * connect to quickbook
   * @param req
   * @param res
   * @param next
   * @returns
   */
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
    // if (data) {
    //   const error = new Error("Connection is already established");
    //   return error;
    // }
    const finalCompanyDetails = await qbRepository.create(data);

    return DefaultResponse(
      res,
      200,
      "CONNECTED SUCCESSFULLY",
      finalCompanyDetails
    );
  }

  /**
   * get all qbo customers
   * @param req
   * @param res
   * @param next
   * @returns
   */
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
        "CUSTOMER FETCHED SUCCESSFULLY",
        customersList?.QueryResponse?.Customer
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * update customer
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async updateCustomer(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.params.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);
      const customerData = req.body as CustomerObject;

      const createdCustomer = await quickbookService.updateCustomer(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string,
        customerData
      );

      return DefaultResponse(
        res,
        200,
        "CUSTOMER UPDATED SUCCESSFULLY",
        createdCustomer
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * create customer
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async createCustomer(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = 'e318069d-6c58-4ee7-9622-ac73875f2016';
      const authResponse = await quickbookService.getAccessToken(companyId);
      const customerData = req.body as CustomerObject;
      const createdCustomer = await quickbookService.createCustomer(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string,
        customerData
      );

      return DefaultResponse(
        res,
        200,
        "CUSTOMER CREATED SUCCESSFULLY",
        createdCustomer
      );
    } catch (err) {
      next(err);
    }
  }

  async getCustomerInfo(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      console.log("inside webhook api");

      const customerId =
        req.body.eventNotifications[0].dataChangeEvent.entities[0].id;
      const companyId = "dbb0d8aa-d282-4713-ba55-12d0e888e62b";
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
}
export default new QuickbooksController();
