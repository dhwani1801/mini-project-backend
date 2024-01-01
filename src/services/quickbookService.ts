import { error } from "console";
import { prisma } from "../client/prisma";
import qbRepository from "../repositories/quickbookRepository";
const OAuthClient = require("intuit-oauth");
const QuickBooks = require("node-quickbooks");
import moment from "moment-timezone";
import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGES,
  VALIDATION_MESSAGE,
} from "../constants/messages";

const authClient = new OAuthClient({
  clientId: process.env?.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env?.QUICKBOOKS_CLIENT_SECRET,
  environment: process.env?.QUICKBOOKS_ENVIRONMENT,
  redirectUri: process.env?.QUICKBOOKS_REDIRECT_URI,
});

enum LogStatus {
  Started = "STARTED",
  Error = "ERROR",
  Success = "SUCCESS",
  Paid = "PAID",
}
// const customerLog = await this.createQboLog(timeGoUniqueId, null, null, timeGoUniqueId, SyncRecordTypeEnum.CUSTOMER, SyncStatusEnum.PROCESSING, 'Pending', null);
class QuickBookServices {
  async logSync(
    qboId: string,
    recordType: string,
    tenantID: string,
    status: string,
    message?: string,
    id?: string
  ) {
    const logs = await qbRepository.createOrUpdateLog({
      qboId,
      recordType,
      tenantID,
      status,
      message,
      id,
    });
    console.log("logs: ", logs);
    return logs;
  }

  async getauthURL() {
    const authUri = authClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: "intuit-test",
    });
    return { authUri };
  }

  async createAuthToken(url: string) {
    try {
      const authToken = await authClient.createToken(url);
      return authToken.token;
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const authResponse = await authClient.refreshUsingToken(refreshToken);
      return authResponse;
    } catch (err) {
      throw err;
    }
  }

  async getCompanyInfo(
    accessToken: string,
    realmId: string,
    refreshToken: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const qbo = new QuickBooks(
        process.env?.QUICKBOOKS_CLIENT_ID,
        process.env?.QUICKBOOKS_CLIENT_SECRET,
        accessToken,
        true,
        realmId,
        process.env?.QUICKBOOKS_ENVIRONMENT == "sandbox" ? true : false,
        true,
        null,
        "2.0",
        refreshToken
      );
      qbo.getCompanyInfo(realmId, async function (err: any, response: any) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  createQuickBooksObject(
    accessToken: string,
    realmId: string,
    refreshToken: string
  ) {
    return new QuickBooks(
      process.env?.QUICKBOOKS_CLIENT_ID,
      process.env?.QUICKBOOKS_CLIENT_SECRET,
      accessToken,
      true,
      realmId,
      process.env?.QUICKBOOKS_ENVIRONMENT == "sandbox" ? true : false,
      true,
      null,
      "2.0",
      refreshToken
    );
  }

  async getCustomersFromQbo(
    accessToken: string,
    realmId: string,
    refreshToken: string
  ) {
    return new Promise((resolve, reject) => {
      const qbo = this.createQuickBooksObject(
        accessToken,
        realmId,
        refreshToken
      );

      qbo.findCustomers(
        [{ field: "fetchAll", value: true }],
        async function (err: any, response: any) {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  async getAccessToken(companyId: any) {
    try {
      const companyDetails = await qbRepository.getDetails(companyId);

      if (!companyDetails) {
        throw error(404, VALIDATION_MESSAGE.COMPANY_NOT_FOUND);
      }

      const accessTokenUTCDate = moment(companyDetails?.accessTokenUTCDate);
      const currentDateTime = moment(new Date());

      const minutes: string | number = currentDateTime.diff(
        accessTokenUTCDate,
        "minutes"
      );

      if (minutes >= 45) {
        const utc = moment.utc().valueOf();
        const authResponse = await this.refreshToken(
          companyDetails?.refreshToken as string
        );
        if (authResponse != null) {
          const updatedCompany = await qbRepository.updateCompany(companyId, {
            accessToken: authResponse?.token?.access_token,
            refreshToken: authResponse?.token?.refresh_token,
            accessTokenUTCDate: moment.utc(utc).toDate(),
          });
          return updatedCompany;
        }
      } else {
        return companyDetails;
      }
    } catch (err) {
      throw err;
    }
  }

  async getCustomerInfoUsingWebhooks(
    accessToken: string,
    realmId: string,
    customerId: string,
    refreshToken: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const qbo = this.createQuickBooksObject(
        accessToken,
        realmId,
        refreshToken
      );

      qbo.getCustomer(customerId, async function (err: any, customer: any) {
        if (err) {
          reject(err);
        } else {
          resolve(customer);
        }
      });
    });
  }

  async createCustomer(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    customerObject: any
  ): Promise<any> {
    try {
      const logs = await this.logSync(
        "",
        "Customer",
        realmId,
        LogStatus.Started,
        "Creating customer process started"
      );
      console.log("logssss : ", logs);
      const company = await qbRepository.getCompanyByTenantId(realmId);
      if (!company) {
        return {
          status: 404,
          message: VALIDATION_MESSAGE.COMPANY_NOT_FOUND,
          document: null,
        };
      }

      const tenantName = company.tenantName;
      customerObject.CompanyName = tenantName;

      const qbo = this.createQuickBooksObject(
        accessToken,
        realmId,
        refreshToken
      );

      const customerQueryResponse = await this.findCustomerInQBO(
        qbo,
        customerObject,
        realmId
      );

      if (customerQueryResponse.status === 200) {
        return customerQueryResponse;
      }

      const createdCustomer = await this.createCustomerInQBO(
        qbo,
        customerObject,
        realmId
      );
      //  console.log('createdCustomer: ', createdCustomer);
      await this.logSync(
        createdCustomer.id,
        "Customer",
        realmId,
        LogStatus.Success,
        "Creating customer process completed",
        logs.id
      );
      return {
        status: 200,
        message: SUCCESS_MESSAGES.CUSTOMER_CREATED_SUCCESSFULLY,
        id: createdCustomer.Id,
        createdCustomer,
      };
    } catch (err) {
      await this.logSync(
        "",
        "Customer",
        realmId,
        LogStatus.Started,
        "Creating customer process started"
        //  logs.id
      );
      return {
        message: err,
        document: null,
      };
    }
  }

  async findCustomerInQBO(
    qbo: any,
    customerObject: any,
    realmId: string
  ): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        qbo.findCustomers(
          [
            {
              field: "DisplayName",
              value: `${customerObject.GivenName}`,
              operator: "=",
            },
          ],
          async (err: any, customer: any) => {
            if (err) {
              resolve({
                status: 451,
                message: JSON.stringify(err),
                document: null,
              });
            } else {
              if (JSON.stringify(customer.QueryResponse) !== "{}") {
                resolve({
                  message: SUCCESS_MESSAGES.CUSTOMER_EXISTS,
                  document: customer.QueryResponse.Customer[0].Id,
                });
              } else {
                resolve({
                  message: VALIDATION_MESSAGE.CUSTOMER_DOES_NOT_EXIST,
                  document: null,
                });
              }
            }
          }
        );
      } catch (err) {
        resolve({
          message: err,
          document: null,
        });
      }
    });
  }

  async createCustomerInQBO(
    qbo: any,
    customerObject: any,
    realmId: string
  ): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        qbo.createCustomer(customerObject, async (err: any, customer: any) => {
          if (err) {
            resolve({
              status: 451,
              message: JSON.stringify(err),
              document: null,
            });
          } else {
            const createdCustomer = await prisma.customer.create({
              data: {
                qboCustomerId: customer.Id,
                customerId: customerObject.PrimaryEmailAddr.Address,
                givenName: customerObject.GivenName,
                tenantID: realmId,
                DisplayName: `${customerObject.GivenName}`,
              },
            });
            resolve({
              status: 200,
              id: customer.Id,
              createdCustomer,
            });
          }
        });
      } catch (err) {
        resolve({
          message: err,
          document: null,
        });
      }
    });
  }

  async createInvoice(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    invoiceObject: any
  ): Promise<any> {
    const createInvoicePromise = new Promise(async (resolve) => {
      try {
        const logs = await this.logSync(
          "",
          "Invoice",
          realmId,
          LogStatus.Started,
          "Creating invoice process started"
        );
        const customerExists = await qbRepository.checkCustomerExists(
          invoiceObject.CustomerRef.value
        );

        if (!customerExists) {
          resolve({
            status: 400,
            message: VALIDATION_MESSAGE.CUSTOMER_DOES_NOT_EXIST,
          });
          return;
        }

        const qbo = this.createQuickBooksObject(
          accessToken,
          realmId,
          refreshToken
        );

        qbo.createInvoice(invoiceObject, async (err: any, response: any) => {
          if (err) {
            await this.logSync(
              "",
              "Invoice",
              realmId,
              LogStatus.Error,
              "Creating invoice process error",
              logs.id
            );
            resolve({
              message: ERROR_MESSAGE.ERROR_CREATING_INVOICE_FROM_QUICKBOOKS,
              error: err,
            });
          } else {
            const createdInvoice = await prisma.invoice.create({
              data: {
                qboInvoiceId: response.Id,
                detailType: invoiceObject.Line[0].DetailType,
                amount: invoiceObject.Line[0].Amount,
                salesItemName:
                  invoiceObject.Line[0].SalesItemLineDetail.ItemRef.name,
                salesItemValue:
                  invoiceObject.Line[0].SalesItemLineDetail.ItemRef.value,
                tenantID: realmId,
                customerId: invoiceObject.CustomerRef.value,
              },
            });
            await this.logSync(
              response.Id,
              "Invoice",
              realmId,
              LogStatus.Success,
              "Creating invoice process completed",
              logs.id
            );
            resolve({
              status: 200,
              message: SUCCESS_MESSAGES.INVOICE_CREATED_SUCCESSFULLY,
              createdInvoice: createdInvoice,
            });
          }
        });
      } catch (error: any) {
        await this.logSync(
          realmId,
          "invoice",
          realmId,
          LogStatus.Error,
          error.message
        );
        resolve({
          error: error.message,
        });
      }
    });
    return createInvoicePromise;
  }

  async createPayment(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    paymentObject: any
  ): Promise<any> {
    const createPaymentPromise = new Promise(async (resolve) => {
      try {
        const qbo = this.createQuickBooksObject(
          accessToken,
          realmId,
          refreshToken
        );
        const customerExists = await qbRepository.checkCustomerExists(
          paymentObject.CustomerRef.value
        );

        if (!customerExists) {
          resolve({
            status: 400,
            message: "Customer_does_not_exist",
          });
          return;
        }
        const invoiceId = paymentObject.Line[0]?.LinkedTxn[0]?.TxnId;

        qbo.getInvoice(invoiceId, async (err: any, invoiceObject: any) => {
          if (err) {
            resolve({
              message: "Invoice not found in quickbook",
              error: err.message,
            });
            return;
          }

          const invoiceCustomerId = invoiceObject.CustomerRef.value;

          if (paymentObject.CustomerRef.value !== invoiceCustomerId) {
            resolve({
              status: 400,
              message: "Invoice does not belong to the specified customer",
              error: null,
            });
            return;
          }

          if (invoiceObject.Balance <= 0) {
            resolve({
              status: 400,
              message: "Invoice_has_already_been_fully_paid",
              error: null,
            });
            return;
          }

          const invoiceInDatabase = await prisma.invoice.findUnique({
            where: { qboInvoiceId: invoiceId },
          });

          if (!invoiceInDatabase || invoiceInDatabase.amount === null) {
            resolve({
              status: 404,
              message: "Associated_invoice_not_found_in_the_database",
              error: null,
            });
            return;
          }

          const totalInvoiceAmount = invoiceInDatabase.amount;
          const paymentAmount = paymentObject.Line[0]?.Amount;

          if (paymentAmount > totalInvoiceAmount) {
            resolve({
              status: 400,
              message:
                "Payment_amount_cannot_be_greater_than_the_total_invoice_amount",
              error: null,
            });
            return;
          }

          if (paymentAmount > invoiceObject.Balance) {
            resolve({
              status: 400,
              message:
                "Payment_amount_cannot_be_greater_than_the_total_invoice_balance",
              error: null,
            });
            return;
          }

          paymentObject.TotalAmt = totalInvoiceAmount;
          qbo.createPayment(paymentObject, async (err: any, response: any) => {
            if (err) {
              await this.logSync(
                realmId,
                "payment",
                realmId,
                LogStatus.Error,
                err.message
              );
              resolve({
                status: 500,
                message: "Error creating payment in QuickBooks",
                error: err,
              });
            } else {
              const createdPayment = await prisma.payment.create({
                data: {
                  qboPaymentId: response.Id,
                  totalAmt: totalInvoiceAmount,
                  tenantID: realmId,
                  customerId: paymentObject.CustomerRef.value,
                  amount: parseFloat(paymentObject.Line[0]?.Amount),
                  linkedTxnId: paymentObject.Line[0]?.LinkedTxn[0]?.TxnId,
                  linkedTxnType: paymentObject.Line[0]?.LinkedTxn[0]?.TxnType,
                },
              });

              await this.logSync(
                response.Id,
                "payment",
                realmId,
                LogStatus.Success
              );

              resolve({
                status: 200,
                message: "PAYMENT_CREATED_SUCCESSFULLY",
                id: paymentObject.Id,
                createdPayment: createdPayment,
              });
            }
          });
        });
      } catch (error: any) {
        resolve({
          status: 500,
          message: "Unexpected error",
          error: error,
        });
      }
    });

    return createPaymentPromise;
  }

  async getCustomersList(
    realmId: string,
    filter: any,
    page: number,
    pageSize: number
  ): Promise<any> {
    const { displayName, givenName, customerId } = filter;

    const customers = await prisma.customer.findMany({
      where: {
        tenantID: realmId,
        DisplayName: { contains: displayName },
        givenName: { contains: givenName },
        customerId: { contains: customerId },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalCustomers = await prisma.customer.count({
      where: {
        tenantID: realmId,
        DisplayName: { contains: displayName },
        givenName: { contains: givenName },
        customerId: { contains: customerId },
      },
    });

    return {
      data: customers,
      total: totalCustomers,
      page: page,
      pageSize: pageSize,
    };
  }

  async getInvoicesList(
    realmId: string,
    filter: any,
    page: number,
    pageSize: number
  ): Promise<any> {
    const { amount, salesItemName, salesItemValue, customerId } = filter;

    const invoices = await prisma.invoice.findMany({
      where: {
        tenantID: realmId,
        amount: { equals: amount },
        salesItemName: { contains: salesItemName },
        salesItemValue: { contains: salesItemValue },
        customerId: { contains: customerId },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        customer: true,
      },
    });

    const totalInvoices = await prisma.invoice.count({
      where: {
        tenantID: realmId,
        amount: { equals: amount },
        salesItemName: { contains: salesItemName },
        salesItemValue: { contains: salesItemValue },
        customerId: { contains: customerId },
      },
    });

    return {
      data: invoices,
      total: totalInvoices,
      page: page,
      pageSize: pageSize,
    };
  }

  async getPaymentList(
    realmId: string,
    filter: any,
    page: number,
    pageSize: number
  ): Promise<any> {
    const { amount, linkedTxnId: invoiceId, customerId } = filter;

    const payments = await prisma.payment.findMany({
      where: {
        tenantID: realmId,
        amount: { equals: amount },
        linkedTxnId: { contains: invoiceId },
        customerId: { contains: customerId },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        customer: true,
      },
    });

    const totalPayments = await prisma.payment.count({
      where: {
        tenantID: realmId,
        amount: { equals: amount },
        linkedTxnId: { contains: invoiceId },
        customerId: { contains: customerId },
      },
    });

    return {
      data: payments,
      total: totalPayments,
      page: page,
      pageSize: pageSize,
    };
  }
}

export default new QuickBookServices();
