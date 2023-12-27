import { error } from "console";
import { prisma } from "../client/prisma";
import qbRepository from "../repositories/quickbookRepository";
const OAuthClient = require("intuit-oauth");
const QuickBooks = require("node-quickbooks");
import moment from "moment-timezone";
import { CustomerObject } from "../interfaces";

const authClient = new OAuthClient({
  clientId: process.env?.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env?.QUICKBOOKS_CLIENT_SECRET,
  environment: process.env?.QUICKBOOKS_ENVIRONMENT,
  redirectUri: process.env?.QUICKBOOKS_REDIRECT_URI,
});

class QuickBookServices {
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

  async getCustomers(
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
        throw error(404, "Company not found");
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

  async getCustomerInfo(
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

  async handleWebhook(req: any, res: any) {
    if (!req.body || !req.body.eventNotifications) {
      return res.status(400).send("Invalid webhook payload");
    }
    try {
      res.status(200).send("Webhook processed successfully");
    } catch (error) {
      res.status(500).send("Error processing webhook");
    }
  }

  async createAndUpdateCustomer(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    customerObject: any
  ): Promise<any> {
    const createCustomerPromise = new Promise(async (resolve) => {
      try {
        // const qbo = new QuickBooks(
        //   process.env?.QUICKBOOKS_CLIENT_ID,
        //   process.env?.QUICKBOOKS_CLIENT_SECRET,
        //   accessToken,
        //   true,
        //   realmId,
        //   process.env?.QUICKBOOKS_ENVIRONMENT == "sandbox" ? true : false,
        //   true,
        //   null,
        //   "2.0",
        //   refreshToken
        // );
        const qbo = this.createQuickBooksObject(
          accessToken,
          realmId,
          refreshToken
        );
        await qbo.findCustomers(
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
                  status: 200,
                  message: "CUSTOMER_EXISTS",
                  document: customer.QueryResponse.Customer[0].Id,
                });
              } else {
                await qbo.createCustomer(
                  customerObject,
                  async (err: any, customer: any) => {
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
                          phone: customerObject?.PrimaryPhone?.FreeFormNumber,
                          tenantID: realmId,
                        },
                      });
                      console.log("createdCustomer: ", createdCustomer);
                      resolve({
                        status: 200,
                        message: "CUSTOMER_CREATED_SUCCESSFULLY",
                        id: customer.Id,
                        createdCustomer: createdCustomer,
                      });
                    }
                  }
                );
              }
            }
          }
        );
      } catch (err) {
        resolve({
          status: 451,
          message: err,
          document: null,
        });
      }
    });
    return createCustomerPromise;
  }

  async createInvoice(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    invoiceObject: any
  ): Promise<any> {
    const createInvoicePromise = new Promise(async (resolve) => {
      try {
        const qbo = this.createQuickBooksObject(
          accessToken,
          realmId,
          refreshToken
        );
        qbo.createInvoice(invoiceObject, async (err: any, response: any) => {
          if (err) {
            console.error("Error creating invoice in QuickBooks:", err);
            resolve({
              status: 500,
              message: "Error creating invoice in QuickBooks",
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

            resolve({
              status: 200,
              message: "INVOICE_CREATED_SUCCESSFULLY",
              createdInvoice: createdInvoice,
            });
          }
        });
      } catch (error) {
        console.error("Unexpected error:", error);
        resolve({
          status: 500,
          message: "Unexpected error",
          error: error,
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

        const invoiceId = paymentObject.Line[0]?.LinkedTxn[0]?.TxnId;
        const invoice = await prisma.invoice.findUnique({
          where: { qboInvoiceId: invoiceId },
        });

        if (!invoice || invoice.amount === null) {
          resolve({
            status: 404,
            message: "Associated invoice not found or total amount is null",
            error: null,
          });
          return;
        }

        const totalInvoiceAmount = invoice.amount;
        console.log("totalInvoiceAmount: ", totalInvoiceAmount);

        const paymentAmount = paymentObject.TotalAmt;
        console.log("paymentAmount: ", paymentAmount);

        if (paymentAmount > totalInvoiceAmount) {
          resolve({
            status: 400,
            message:
              "Payment amount cannot be greater than the total invoice amount",
            error: null,
          });
          return;
        }

        paymentObject.TotalAmt = totalInvoiceAmount;

        qbo.createPayment(paymentObject, async (err: any, response: any) => {
          if (err) {
            console.error("Error creating payment in QuickBooks:", err);
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
                linkedTxn: {
                  create: {
                    txnId: paymentObject.Line[0]?.LinkedTxn[0]?.TxnId,
                    txnType: paymentObject.Line[0]?.LinkedTxn[0]?.TxnType,
                    tenantID: realmId,
                  },
                },
              },
            });
            console.log("createdPayment: ", createdPayment);
            resolve({
              status: 200,
              message: "PAYMENT_CREATED_SUCCESSFULLY",
              id: paymentObject.Id,
              createdPayment: createdPayment,
            });
          }
        });
      } catch (error) {
        console.error("Unexpected error:", error);
        resolve({
          status: 500,
          message: "Unexpected error",
          error: error,
        });
      }
    });

    return createPaymentPromise;
  }

  // async createPayment(
  //   accessToken: string,
  //   realmId: string,
  //   refreshToken: string,
  //   paymentObject: any
  // ): Promise<any> {
  //   const createPaymentPromise = new Promise(async (resolve) => {
  //     try {
  //       const qbo = this.createQuickBooksObject(
  //         accessToken,
  //         realmId,
  //         refreshToken
  //       );

  //       // Fetch the associated invoice to get the total amount
  //       const invoiceId = paymentObject.Line[0]?.LinkedTxn[0]?.TxnId;
  //       const invoice = await prisma.invoice.findUnique({
  //         where: { qboInvoiceId: invoiceId },
  //       });

  //       if (!invoice || invoice.amount === null) {
  //         resolve({
  //           status: 404,
  //           message: "Associated invoice not found or total amount is null",
  //           error: null,
  //         });
  //         return;
  //       }

  //       const totalInvoiceAmount = invoice.amount;
  //       console.log("totalInvoiceAmount: ", totalInvoiceAmount);
  //       const paymentAmount = paymentObject.TotalAmt;
  //       console.log("paymentAmount: ", paymentAmount);

  //       if (paymentAmount > totalInvoiceAmount) {
  //         resolve({
  //           status: 400,
  //           message:
  //             "Payment amount cannot be greater than the total invoice amount",
  //           error: null,
  //         });
  //         return;
  //       }

  //       qbo.createPayment(paymentObject, async (err: any, response: any) => {
  //         if (err) {
  //           console.error("Error creating payment in QuickBooks:", err);
  //           resolve({
  //             status: 500,
  //             message: "Error creating payment in QuickBooks",
  //             error: err,
  //           });
  //         } else {
  //           const createdPayment = await prisma.payment.create({
  //             data: {
  //               qboPaymentId: response.Id,
  //               totalAmt: paymentAmount,
  //               tenantID: realmId,
  //               customerId: paymentObject.CustomerRef.value,
  //             },
  //           });
  //           console.log("createdPayment: ", createdPayment);
  //           resolve({
  //             status: 200,
  //             message: "PAYMENT_CREATED_SUCCESSFULLY",
  //             id: paymentObject.Id,
  //             createdPayment: createdPayment,
  //           });
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Unexpected error:", error);
  //       resolve({
  //         status: 500,
  //         message: "Unexpected error",
  //         error: error,
  //       });
  //     }
  //   });

  //   return createPaymentPromise;
  // }
}

export default new QuickBookServices();
