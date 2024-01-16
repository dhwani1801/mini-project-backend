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
import { RecordType, LogStatus } from "../enum/enum";

const authClient = new OAuthClient({
  clientId: process.env?.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env?.QUICKBOOKS_CLIENT_SECRET,
  environment: process.env?.QUICKBOOKS_ENVIRONMENT,
  redirectUri: process.env?.QUICKBOOKS_REDIRECT_URI,
});

export const customerEntity = [
  {
    id: "6",
    firstName: "dhwaniiii",
    lastName: "prajapatiii",
    email: "dhwaniiii12@gmail.com",
    phoneNumber: "9876532145",
    address: "malabar county",
    city: "ahmedabad",
    state: "gujarat",
    country: "india",
    postalCode: "382470",
  },
];

export const invoiceEntity = [
  {
    id: "6",
    invoiceNumber: "010117",
    customerId: customerEntity[0].id,
    items: [{ name: "Design", quantity: "2", price: "100" }],
    description: "Thank You , Have a good day.",
    totalAmount: 200,
    date: "03-01-2024",
    dueDate: "30-01-2024",
  },
];

export const paymentEntity = [
  {
    id: "1",
    invoiceId: invoiceEntity[0].id,
    customerId: customerEntity[0].id,
    paymentMethod: "Cash",
    paymentAmount: 100.0,
    accountName: "Undeposited Funds",
    date: "03-01-2024",
  },
];

class QuickBookServices {
  async logSync(
    qboId: string,
    recordType: RecordType,
    tenantID: string,
    status: LogStatus,
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

  async getItemsFromQbo(
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

      qbo.findItems(
        [{ field: "fetchAll", value: true }],
        async function (err: any, response: any) {
          if (err) {
            reject(err);
          } else {
            const itemsFromQbo = response.QueryResponse.Item;
            const mappedItems = itemsFromQbo.map((qboItem: any) => {
              return {
                qboItemId: qboItem.Id,
                name: qboItem.Name,
              };
            });

            const createdItems = await prisma.item.createMany({
              data: mappedItems,
            });
            resolve(createdItems);
          }
        }
      );
    });
  }

  async getAccountTypesFromQbo(
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

      qbo.findAccounts(
        [{ field: "fetchAll", value: true }],
        async function (err: any, response: any) {
          if (err) {
            reject(err);
          } else {
            const accountTypesFromQbo = response.QueryResponse.Account;
            const mappedAccounts = accountTypesFromQbo.map(
              (qboAccount: any) => {
                return {
                  qboAccountId: qboAccount.Id,
                  name: qboAccount.Name,
                  type: qboAccount.AccountType,
                };
              }
            );

            const createdAccounts = await prisma.account.createMany({
              data: mappedAccounts,
            });
            resolve(createdAccounts);
            // resolve(response);
          }
        }
      );
    });
  }

  async getPaymentMethodsFromQbo(
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

      qbo.findPaymentMethods(
        [{ field: "fetchAll", value: true }],
        async function (err: any, response: any) {
          if (err) {
            reject(err);
          } else {
            const paymentMethodsFromQbo = response.QueryResponse.PaymentMethod;
            const mappedPaymentMethod = paymentMethodsFromQbo.map(
              (qboPaymentMethods: any) => {
                return {
                  qboPaymentMethodId: qboPaymentMethods.Id,
                  name: qboPaymentMethods.Name,
                  type: qboPaymentMethods.Type,
                };
              }
            );

            const createdPaymentMethods = await prisma.paymentMethod.createMany(
              {
                data: mappedPaymentMethod,
              }
            );
            resolve(createdPaymentMethods);
            //   resolve(response);
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

  async findCustomerInQBO(
    qbo: any,
    realmId: string,
    customerData: any
  ): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        // let customerObject = await this.manipulatedCustomerObject();.
        const customerObject = await this.manipulatedCustomerObject(
          customerData
        );
        qbo.findCustomers(
          [
            {
              field: "DisplayName",
              value: `${customerObject.DisplayName}`,
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
                  message: SUCCESS_MESSAGES.CUSTOMER_EXISTS,
                  document: customer.QueryResponse.Customer[0].Id,
                });
              } else {
                resolve({
                  status: 404,
                  message: VALIDATION_MESSAGE.CUSTOMER_DOES_NOT_EXIST,
                  document: null,
                });
              }
            }
          }
        );
      } catch (err: any) {
        resolve({
          status: 500,
          message: err.mesage,
          document: null,
        });
      }
    });
  }

  async createCustomerInQBO(
    qbo: any,
    realmId: string,
    customerData: any
  ): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        // const customerObject = await this.manipulatedCustomerObject();
        const customerObject = await this.manipulatedCustomerObject(
          customerData
        );
        console.log("customerObject: ", customerObject);
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
                DisplayName: `${customerObject.DisplayName}`,
              },
            });
            resolve({
              status: 200,
              id: customer.Id,
              createdCustomer,
            });
          }
        });
      } catch (err: any) {
        resolve({
          status: 500,
          message: err.message,
          document: null,
        });
      }
    });
  }

  async createInvoice(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    invoiceEntity: string,
    customerRef: string
  ): Promise<any> {
    const createInvoicePromise = new Promise(async (resolve) => {
      try {
        const invoiceObject = await this.manipulatedInvoiceObject(
          invoiceEntity
        );
        invoiceObject.CustomerRef.value = customerRef;

        const qbo = this.createQuickBooksObject(
          accessToken,
          realmId,
          refreshToken
        );

        qbo.createInvoice(invoiceObject, async (err: any, response: any) => {
          if (err) {
            resolve({
              status: 451,
              message: JSON.stringify(err),
              document: null,
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
              message: SUCCESS_MESSAGES.INVOICE_CREATED_SUCCESSFULLY,
              createdInvoice: createdInvoice,
            });
          }
        });
      } catch (error: any) {
        resolve({
          status: 500,
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
    paymentEntity: string,
    invoiceId: string,
    customerRef: string
  ): Promise<any> {
    const createPaymentPromise = new Promise(async (resolve) => {
      try {
        const paymentObject = await this.manipulatedPaymentObject(
          paymentEntity,
          invoiceId,
          customerRef
        );
        console.log("payment object : ", paymentObject);
        paymentObject.CustomerRef.value = customerRef;
        const qbo = this.createQuickBooksObject(
          accessToken,
          realmId,
          refreshToken
        );

        qbo.getInvoice(invoiceId, async (err: any, invoiceObject: any) => {
          if (err) {
            resolve({
              status: 404,
              message: VALIDATION_MESSAGE.INVOICE_NOT_FOUND_IN_QUICKBOOK,
              error: err.message,
            });
            return;
          }

          //check if the invoice is paid or not
          if (invoiceObject.Balance <= 0) {
            resolve({
              status: 400,
              message: VALIDATION_MESSAGE.INVOICE_HAS_ALREADY_BEEN_FULLY_PAID,
              error: null,
            });
            return;
          }

          const invoiceInDatabase = await prisma.invoice.findUnique({
            where: { qboInvoiceId: invoiceId },
          });

          //check if the invoice exists in databse or not
          if (!invoiceInDatabase || invoiceInDatabase.amount === null) {
            resolve({
              status: 404,
              message:
                VALIDATION_MESSAGE.ASSOCIATED_INVOICE_NOT_FOUND_IN_THE_DATABASE,
              error: null,
            });
            return;
          }

          const totalInvoiceAmount = invoiceInDatabase.amount;

          const paymentAmount = paymentObject.Line[0].Amount;

          //check if the payment amount is greater then the total amount
          if (paymentAmount > totalInvoiceAmount) {
            resolve({
              status: 400,
              message:
                VALIDATION_MESSAGE.PAYMENT_AMOUNT_CANNOT_BE_GREATER_THAN_THE_TOTAL_INVOICE_AMOUNT,
              error: null,
            });
            return;
          }

          //check for the payment amount is greater then the pending amount
          if (paymentAmount > invoiceObject.Balance) {
            resolve({
              status: 400,
              message:
                VALIDATION_MESSAGE.PAYMENT_AMOUNT_CANNOT_BE_GREATER_THAN_THE_TOTAL_INVOICE_BALANCE,
              error: null,
            });
            return;
          }

          paymentObject.TotalAmt = totalInvoiceAmount;
          qbo.createPayment(paymentObject, async (err: any, response: any) => {
            if (err) {
              resolve({
                status: 451,
                message: JSON.stringify(err),
                id: null,
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
              resolve({
                status: 200,
                message: SUCCESS_MESSAGES.PAYMENT_CREATED_SUCCESSFULLY,
                id: paymentObject.Id,
                createdPayment: createdPayment,
              });
            }
          });
        });
      } catch (error: any) {
        resolve({
          status: 500,
          message: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
          error: error.message,
        });
      }
    });

    return createPaymentPromise;
  }

  async getExistingInvoice(
    qbo: any,
    realmId: string,
    invoiceEntity: string
  ): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        const invoiceObject = await this.manipulatedInvoiceObject(
          invoiceEntity
        );
        qbo.findInvoices(
          [
            {
              field: "DocNumber",
              value: `${invoiceObject.DocNumber}`,
              operator: "=",
            },
          ],
          async (err: any, invoice: any) => {
            if (err) {
              resolve({
                status: 451,
                message: JSON.stringify(err),
                document: null,
              });
            } else {
              if (
                invoice &&
                invoice.QueryResponse &&
                invoice.QueryResponse.Invoice
              ) {
                resolve({
                  status: 200,
                  message: VALIDATION_MESSAGE.INVOICE_EXISTS,
                  invoice,
                });
              } else {
                resolve({
                  status: 404,
                  message: VALIDATION_MESSAGE.INVOICE_DOES_NOT_EXIST,
                });
              }
            }
          }
        );
      } catch (err: any) {
        resolve({
          status: 500,
          message: err.message,
          document: null,
        });
      }
    });
  }

  async getCustomersList(
    realmId: string,
    filter: any,
    page: number,
    pageSize: number
  ) {
    const { displayName, givenName, customerId } = filter;

    const customers = await prisma.customer.findMany({
      where: {
        tenantID: realmId,
        DisplayName: displayName,
        givenName: givenName,
        customerId: customerId,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalCustomers = await prisma.customer.count({
      where: {
        tenantID: realmId,
        DisplayName: displayName,
        givenName: givenName,
        customerId: customerId,
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
  ) {
    const { amount, salesItemName, salesItemValue, customerId } = filter;

    const invoices = await prisma.invoice.findMany({
      where: {
        tenantID: realmId,
        amount: amount,
        salesItemName: salesItemName,
        salesItemValue: salesItemValue,
        customerId: customerId,
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
        amount: amount,
        salesItemName: salesItemName,
        salesItemValue: salesItemValue,
        customerId: customerId,
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
  ) {
    const { amount, linkedTxnId: invoiceId, customerId } = filter;

    const payments = await prisma.payment.findMany({
      where: {
        tenantID: realmId,
        amount: amount,
        linkedTxnId: invoiceId,
        customerId: customerId,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        customer: true,
        invoice: true,
      },
    });

    const totalPayments = await prisma.payment.count({
      where: {
        tenantID: realmId,
        amount: amount,
        linkedTxnId: invoiceId,
        customerId: customerId,
      },
    });

    return {
      data: payments,
      total: totalPayments,
      page: page,
      pageSize: pageSize,
    };
  }

  async getSyncLogs(
    realmId: string,
    filter: any,
    page: number,
    pageSize: number
  ) {
    const { recordType } = filter;

    const logs = await prisma.syncLogs.findMany({
      where: {
        tenantID: realmId,
        recordType: recordType,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalLogs = await prisma.syncLogs.count({
      where: {
        tenantID: realmId,
        recordType: recordType,
      },
    });

    return {
      data: logs,
      total: totalLogs,
      page: page,
      pageSize: pageSize,
    };
  }

  async manipulatedCustomerObject(customer: any) {
    const entities = customer;
    return {
      GivenName: entities.firstName,
      FamilyName: entities.lastName,
      DisplayName: `${entities.firstName} ${entities.lastName} ${entities.id}`,
      PrimaryEmailAddr: {
        Address: entities.email,
      },
      PrimaryPhone: {
        FreeFormNumber: entities.phoneNumber,
      },
      BillAddr: {
        Line1: entities.address,
        City: entities.city,
        CountrySubDivisionCode: entities.state,
        Country: entities.country,
        PostalCode: entities.postalCode,
      },
    };
  }

  async manipulatedInvoiceObject(invoice: any) {
    const configuration = await prisma.configuration.findMany();
    const configurationString = configuration[0].configuration;
    const configurationObject = JSON.parse(configurationString);

    const entities = invoice;
    return {
      Line: [
        {
          DetailType: "SalesItemLineDetail",
          Amount: entities.totalAmount,
          SalesItemLineDetail: {
            ItemRef: {
              name: entities.items[0].name,
              value: configurationObject.item[entities.items[0].name],
            },
          },
        },
      ],
      TxnDate: entities.date,
      DueDate: entities.dueDate,
      DocNumber: entities.invoiceNumber,
      CustomerRef: {
        value: "invoice id from customer reference",
      },
      CustomerMemo: {
        value: entities.description,
      },
    };
  }

  async manipulatedPaymentObject(
    payment: any,
    invoiceId: string,
    customerRef: string
  ): Promise<any> {
    const configuration = await prisma.configuration.findMany();
    const configurationString = configuration[0].configuration;
    const configurationObject = JSON.parse(configurationString);

    const entities = payment;
    const paymentMethodValue =
      configurationObject.paymentMethod[entities.paymentMethod];
    const accountTypeValue =
      configurationObject.accountType[entities.accountName];

    const accountType = await prisma.account.findFirst({
      where: {
        name: entities.accountName,
      },
    });

    if (!accountType) {
      return {
        status: 404,
        message: VALIDATION_MESSAGE.ACCOUNT_TYPE_NOT_FOUND,
      };
    }

    return {
      DepositToAccountRef: {
        value: accountTypeValue,
      },
      TxnDate: entities.date,
      Line: [
        {
          Amount: entities.paymentAmount,
          LinkedTxn: [
            {
              TxnId: invoiceId,
              TxnType: "Invoice",
            },
          ],
        },
      ],
      PaymentMethodRef: {
        value: paymentMethodValue,
      },
      CustomerRef: {
        value: customerRef,
      },
    };
  }

  // async syncProcess(
  //   accessToken: string,
  //   realmId: string,
  //   refreshToken: string,
  //   customerData: any,
  //   invoiceData: any,
  //   paymentObject: any
  // ): Promise<any> {
  //   const company = await qbRepository.getCompanyByTenantId(realmId);
  //   if (!company) {
  //     return {
  //       status: 404,
  //       message: VALIDATION_MESSAGE.COMPANY_NOT_FOUND,
  //     };
  //   }

  //   const qbo = this.createQuickBooksObject(accessToken, realmId, refreshToken);

  //   //check for existing invoice with same invoice number
  //   for (const invoiceObject of invoiceData) {
  //     const existingInvoice = await this.getExistingInvoice(
  //       qbo,
  //       realmId,
  //       invoiceObject
  //     );
  //     if (existingInvoice.status === 200) {
  //       for (const paymentData of paymentObject) {
  //         return await this.createPayment(
  //           accessToken,
  //           realmId,
  //           refreshToken,
  //           paymentData,
  //           existingInvoice.invoice.QueryResponse.Invoice[0].Id,
  //           existingInvoice.invoice.QueryResponse.Invoice[0].CustomerRef.value
  //         );
  //       }
  //     }
  //   }

  //   for (const customerObject of customerData) {
  //     //check if customer exists or not
  //     const customerQueryResponse = await this.findCustomerInQBO(
  //       qbo,
  //       realmId,
  //       customerObject
  //     );

  //     //create invoice for the existing customer
  //     if (customerQueryResponse.status === 200) {
  //       for (const invoiceObject of invoiceData) {
  //         const invoiceResponse = await this.createInvoice(
  //           accessToken,
  //           realmId,
  //           refreshToken,
  //           invoiceObject,
  //           customerQueryResponse.document
  //         );

  //         //create payment for the invoice
  //         if (invoiceResponse.status === 200) {
  //           for (const paymentData of paymentObject) {
  //             return await this.createPayment(
  //               accessToken,
  //               realmId,
  //               refreshToken,
  //               paymentData,
  //               invoiceResponse.createdInvoice.qboInvoiceId,
  //               invoiceResponse.createdInvoice.customerId
  //             );
  //           }
  //         } else {
  //           return invoiceResponse;
  //         }
  //       }
  //     }
  //     //create customer if not exists
  //     const customerEntity = await this.createCustomerInQBO(
  //       qbo,
  //       realmId,
  //       customerObject
  //     );

  //     if (customerEntity.status !== 200) {
  //       return customerEntity;
  //     }

  //     //create invoice for the newly created customer
  //     for (const invoiceObject of invoiceData) {
  //       const invoiceResponse = await this.createInvoice(
  //         accessToken,
  //         realmId,
  //         refreshToken,
  //         invoiceObject,
  //         customerEntity.id
  //       );

  //       if (invoiceResponse.status === 200) {
  //         //create payment for the invoice
  //         for (const paymentData of paymentObject) {
  //           return await this.createPayment(
  //             accessToken,
  //             realmId,
  //             refreshToken,
  //             paymentData,
  //             invoiceResponse.createdInvoice.qboInvoiceId,
  //             invoiceResponse.createdInvoice.customerId
  //           );
  //         }
  //       } else {
  //         return invoiceResponse;
  //       }
  //     }
  //   }
  // }

  async syncProcess(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    customerData: any,
    invoiceData: any,
    paymentObject: any
  ): Promise<any> {
    const company = await qbRepository.getCompanyByTenantId(realmId);
    if (!company) {
      return {
        status: 404,
        message: VALIDATION_MESSAGE.COMPANY_NOT_FOUND,
      };
    }

    const qbo = this.createQuickBooksObject(accessToken, realmId, refreshToken);

    for (const invoiceObject of invoiceData) {
      const existingInvoice = await this.getExistingInvoice(
        qbo,
        realmId,
        invoiceObject
      );
      if (existingInvoice.status === 200) {
        for (const paymentData of paymentObject) {
          await this.createPayment(
            accessToken,
            realmId,
            refreshToken,
            paymentData,
            existingInvoice.invoice.QueryResponse.Invoice[0].Id,
            existingInvoice.invoice.QueryResponse.Invoice[0].CustomerRef.value
          );
        }
      }
    }

    for (const customerObject of customerData) {
      const customerQueryResponse = await this.findCustomerInQBO(
        qbo,
        realmId,
        customerObject
      );

      if (customerQueryResponse.status === 200) {
        for (const invoiceObject of invoiceData) {
          const invoiceResponse = await this.createInvoice(
            accessToken,
            realmId,
            refreshToken,
            invoiceObject,
            customerQueryResponse.document
          );

          if (invoiceResponse.status === 200) {
            for (const paymentData of paymentObject) {
              await this.createPayment(
                accessToken,
                realmId,
                refreshToken,
                paymentData,
                invoiceResponse.createdInvoice.qboInvoiceId,
                invoiceResponse.createdInvoice.customerId
              );
            }
          } else {
            return invoiceResponse;
          }
        }
      }

      const customerEntity = await this.createCustomerInQBO(
        qbo,
        realmId,
        customerObject
      );

      if (customerEntity.status !== 200) {
        return customerEntity;
      }

      for (const invoiceObject of invoiceData) {
        const invoiceResponse = await this.createInvoice(
          accessToken,
          realmId,
          refreshToken,
          invoiceObject,
          customerEntity.id
        );

        if (invoiceResponse.status === 200) {
          for (const paymentData of paymentObject) {
            await this.createPayment(
              accessToken,
              realmId,
              refreshToken,
              paymentData,
              invoiceResponse.createdInvoice.qboInvoiceId,
              invoiceResponse.createdInvoice.customerId
            );
          }
        } else {
          return invoiceResponse;
        }
      }
    }
  }
}

export default new QuickBookServices();
