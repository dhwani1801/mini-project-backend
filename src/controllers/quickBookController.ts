import { NextFunction, Response } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { RequestExtended } from "../interfaces/global";
import quickBookService from "../services";
import { AuthTokenInterface } from "../interfaces/quickBookInterface";
import quickbookService from "../services/quickbookService";
import { qbRepository } from "../repositories";
import { CustomerObject } from "../interfaces";

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
  async createIntegration(req: RequestExtended,
    res: Response,
    next: NextFunction) {
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
      'CONNECTED SUCCESSFULLY',
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
        'CUSTOMER FETCHED SUCCESSFULLY',
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
  async updateCustomer(req: RequestExtended,
    res: Response,
    next: NextFunction) {
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
        'CUSTOMER UPDATED SUCCESSFULLY',
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
  async createCustomer(req: RequestExtended,
    res: Response,
    next: NextFunction) {
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
        'CUSTOMER CREATED SUCCESSFULLY',
        createdCustomer
      );
    } catch (err) {
      next(err);
    }
  }
}

export default new QuickbooksController();