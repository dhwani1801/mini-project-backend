import { NextFunction, Response, Request } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { RequestExtended } from "../interfaces/global";
import quickBookService from "../services";
import { AuthTokenInterface } from "../interfaces/quickBookInterface";
import quickbookService from "../services/quickbookService";
import { qbRepository } from "../repositories";
import quickbookRepository from "../repositories/quickbookRepository";
import { VALIDATION_MESSAGE, SUCCESS_MESSAGES } from "../constants/messages";
import { prisma } from "../client/prisma";

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
        SUCCESS_MESSAGES.AUTH_URL_RETRIVED_SUCCESSFULLY,
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
      const error = new Error(VALIDATION_MESSAGE.COMPANY_IS_ALREADY_CONNECTED);
      return error;
    }

    const finalCompanyDetails = await qbRepository.create(data);

    return DefaultResponse(
      res,
      200,
      SUCCESS_MESSAGES.CONNECTED_SUCCESSFULLY,
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

      const customersList: any = await quickbookService.getCustomersFromQbo(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string
      );

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.CUSTOMER_FETCHED_SUCCESSFULLY,
        customersList?.QueryResponse?.Customer
      );
    } catch (err) {
      next(err);
    }
  }

  async getAllAccountTypes(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.body.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);

      const customersList: any = await quickbookService.getAccountTypesFromQbo(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string
      );

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.ACCOUNTS_TYPES_FETCHED_SUCCESSFULLY,
        customersList?.QueryResponse?.Account
      );
    } catch (err) {
      next(err);
    }
  }

  async getAllQBOPamentMethods(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.body.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);

      const customersList: any =
        await quickbookService.getPaymentMethodsFromQbo(
          authResponse?.accessToken as string,
          authResponse?.tenantID as string,
          authResponse?.refreshToken as string
        );

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.ACCOUNTS_TYPES_FETCHED_SUCCESSFULLY,
        customersList?.QueryResponse?.PaymentMethod
      );
    } catch (err) {
      next(err);
    }
  }

  async getAllQBOItems(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.body.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);

      const itemsList: any = await quickbookService.getItemsFromQbo(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string
      );

      return DefaultResponse(
        res,
        200,
        SUCCESS_MESSAGES.ITEMS_FETCHED_SUCCESSFULLY,
        itemsList?.QueryResponse
      );
    } catch (err) {
      next(err);
    }
  }

  async getCustomerInfoUsingWebhook(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const company = await quickbookRepository.getCompanyByTenantId(
        req.body.eventNotifications[0].realmId
      );

      const customerId =
        req.body.eventNotifications[0].dataChangeEvent.entities[0].id;
      const companyId = company?.id;
      const authResponse = await quickbookService.getAccessToken(companyId);

      const realmId = authResponse?.tenantID as string;
      const customerInfo =
        await quickBookService.quickBookService.getCustomerInfoUsingWebhooks(
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
          DisplayName: customerInfo.DisplayName,
        },
      });
      return createdCustomer;
    } catch (err) {
      next(err);
    }
  }

  // async createCustomer(
  //   req: RequestExtended,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const companyId = req.params.companyId;
  //     const authResponse = await quickbookService.getAccessToken(companyId);
  //     const customerData = req.body;
  //     const result = await quickbookService.createCustomer(
  //       authResponse?.accessToken as string,
  //       authResponse?.tenantID as string,
  //       authResponse?.refreshToken as string,
  //       customerData
  //     );
  //     return res.status(result.status).json({
  //       result: result,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  async createCustomer(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.params.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);
      const result = await quickbookService.createCustomer(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string
      );

      return res.status(result.status).json({
        result: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // async createInvoice(req: RequestExtended, res: Response, next: NextFunction) {
  //   try {
  //     const companyId = req.params.companyId;
  //     const authResponse = await quickbookService.getAccessToken(companyId);
  //     // const invoiceObject = req.body;
  //     const result = await quickbookService.createInvoice(
  //       authResponse?.accessToken as string,
  //       authResponse?.tenantID as string,
  //       authResponse?.refreshToken as string
  //       //    invoiceObject
  //     );
  //     return res.status(result.status).json({
  //       result: result,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async createPayment(req: RequestExtended, res: Response, next: NextFunction) {
  //   try {
  //     const companyId = req.params.companyId;
  //     const authResponse = await quickbookService.getAccessToken(companyId);
  //     const paymentObject = req.body;
  //     const result = await quickbookService.createPayment(
  //       authResponse?.accessToken as string,
  //       authResponse?.tenantID as string,
  //       authResponse?.refreshToken as string,
  //   //    paymentObject
  //     );
  //     return res.status(result.status).json({
  //       result: result,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  async getCustomersList(req: Request, res: Response, next: NextFunction) {
    try {
      const realmId = req.params.realmId;
      const filter = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const result = await quickBookService.quickBookService.getCustomersList(
        realmId,
        filter,
        page,
        pageSize
      );

      res.status(200).json({
        message: SUCCESS_MESSAGES.CUSTOMER_RETRIVED_SUCCESSFULLY,
        data: result.data,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getInvoicesList(req: Request, res: Response, next: NextFunction) {
    try {
      const realmId = req.params.realmId;
      const filter = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const result = await quickBookService.quickBookService.getInvoicesList(
        realmId,
        filter,
        page,
        pageSize
      );

      res.status(200).json({
        message: SUCCESS_MESSAGES.INVOICE_RETRVIED_SUCCESSFULLY,
        data: result.data,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getPaymentsList(req: Request, res: Response, next: NextFunction) {
    try {
      const realmId = req.params.realmId;
      const filter = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const result = await quickBookService.quickBookService.getPaymentList(
        realmId,
        filter,
        page,
        pageSize
      );

      res.status(200).json({
        message: SUCCESS_MESSAGES.PAYMENT_RETRIVED_SUCCESSFULLY,
        data: result.data,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getSyncLogsList(req: Request, res: Response, next: NextFunction) {
    try {
      const realmId = req.params.realmId;
      const filter = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const result = await quickBookService.quickBookService.getSyncLogs(
        realmId,
        filter,
        page,
        pageSize
      );

      res.status(200).json({
        message: SUCCESS_MESSAGES.SYNCLOGS_RETRIVED_SUCCESSFULLY,
        data: result.data,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async syncData(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId;
      const authResponse = await quickbookService.getAccessToken(companyId);

      const result = await quickbookService.syncProcess(
        authResponse?.accessToken as string,
        authResponse?.tenantID as string,
        authResponse?.refreshToken as string
      );
      return res.status(result.status).json({
        result: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new QuickbooksController();
