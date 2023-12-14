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
      const companyId = req.params.companyId;
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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      console.log("inside webhook api");
      const accessToken =
        "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..u2QzrxfJ8InVgBjDvA-csw.AIXnFMenys4xjXLWxud-1agWMBZWm7lr-w9LK71QNr7UAts-NlZLi4TIqsLBCAvfQ-L8yLMB8JQXWh5F5YQRERb0Kliycv_VoFN9tUipcNxDxWaej0O_VZnUFvvCzW4QDwzwDfEfJjFzB-CpsensYzBHCFBwA9FUHJr24f8BzGVPidGkyURz3yq5FEwpcpWPCstC8OMv20cvqH2xCk5dCr167H6PO5BVNSh9ZaUrF2NvIe-NCuzkv8vc4SgPw1Aq5Im2bTj5KmWKcyTSver4BqC9LHfGirVzx4xckfyclL6yTQ7ufAEAfPsO1CJh4aLSf7n_AhKiS7wsdSSxzR18mJTMxsjueHDGCkXuJTk-qhkj2vAh7XrFmGAN6POAH-am0QLLvaHWAiI7A7FPc9wHHS7WrnZdivTk_4TRzxVXyDQVV04FuqVi1G8npVReJin08XVvBbqKFwKNGOro8pA3JDUnMqEywWFYdV2opAtdqcc9XOeHR4DyaPg821CBoiKFYgx8oYa1fQtT070fWWu5C0t-PLRbecvDqbYSpHiy4ey_NzsH3-j_Y4DDQCNbPfcN5flA3IWqHVSVpdb2CSjZBfrcIgmlLssSyZVf526Wd409P3NGBibfYFWfY5ZTfr7l-fBN883fF9N5-0oU6yCzDmPyzdOb9IoQBKWftmyg7drWU56XH9Bi5cUfFCOMQB-IQi50UboKWwz5vtSpe5OrwIKSzVmVvo1cVZgzoFbxK3NlntYO7u8FoDEtt2R5VVDu._xDzsIEyLFvZ9FlDJqBExA";
      const realmId = "4620816365361451620";
      const customerId =
        req.body.eventNotifications[0].dataChangeEvent.entities[0].id;
      const refreshToken = "AB11711188941hvxzVNmFI2Y67dQTRxVRRY9cJBOQCE7TET2FO";

      if (!req.body || !req.body.eventNotifications) {
        return res.status(400).send("Invalid webhook payload");
      }

      const customerInfo =
        await quickBookService.quickBookService.getCustomerInfo(
          accessToken,
          realmId,
          customerId,
          refreshToken
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
