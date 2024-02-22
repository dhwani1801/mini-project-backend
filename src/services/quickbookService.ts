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

class QuickBookServices {
  async logSync(
    qboId: string,
    dbId: string,
    recordType: RecordType,
    tenantID: string,
    status: LogStatus,
    message?: string,
    id?: string
  ) {
    const logs = await qbRepository.createOrUpdateLog({
      qboId,
      dbId,
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
            resolve(err);
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

  async findCustomerInQBO(
    qbo: any,
    realmId: string,
    customerData: any
  ): Promise<any> {
    return new Promise(async (resolve) => {
      try {
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
          status: 451,
          error: err.mesage,
          document: null,
          message: ERROR_MESSAGE.SOMETHING_WENT_WRONG_IN_FINDING_CUSTOMER,
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
        const customerObject = await this.manipulatedCustomerObject(
          customerData
        );

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

            const savedData = await prisma.syncedData.create({
              data: {
                qboId: customer.Id,
                dbId: customerData.id,
                recordType: RecordType.Customer,
                data: JSON.stringify(customer),
              },
            });
            resolve({
              status: 200,
              id: customer.Id,
              createdCustomer,
              savedData,
            });
          }
        });
      } catch (err: any) {
        resolve({
          status: 451,
          error: err.message,
          document: null,
          message: ERROR_MESSAGE.SOMETHING_WENT_WRONG_IN_CREATING_CUSTOMER,
        });
      }
    });
  }

  async createInvoice(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    invoiceEntity: any,
    customerRef: any
  ): Promise<any> {
    const createInvoicePromise = new Promise(async (resolve) => {
      try {
        const invoiceObject = await this.manipulatedInvoiceObject(
          invoiceEntity,
          customerRef
        );

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
            const savedData = await prisma.syncedData.create({
              data: {
                qboId: response.Id,
                dbId: invoiceEntity.id,
                recordType: RecordType.Invoice,
                data: JSON.stringify(response),
              },
            });
            resolve({
              status: 200,
              message: SUCCESS_MESSAGES.INVOICE_CREATED_SUCCESSFULLY,
              response: response.Id,
              savedData,
            });
          }
        });
      } catch (error: any) {
        resolve({
          status: 500,
          error: error.message,
          message: "something went wrong in invoice creation",
        });
      }
    });
    return createInvoicePromise;
  }

  async createPayment(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    paymentEntity: any,
    invoiceId: string,
    customerRef: string
  ): Promise<any> {
    const createPaymentPromise = new Promise(async (resolve) => {
      try {
        const createPaymentLog = await this.logSync(
          "",
          "",
          RecordType.Payment,
          "",
          LogStatus.Started,
          "create Payment Log Started"
        );
        const paymentObject = await this.manipulatedPaymentObject(
          paymentEntity,
          invoiceId,
          customerRef
        );

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
            await this.logSync(
              "",
              "",
              RecordType.Payment,
              "",
              LogStatus.Completed,
              "invoice is paid in create payment log",
              createPaymentLog.id
            );
            resolve({
              status: 400,
              message: VALIDATION_MESSAGE.INVOICE_HAS_ALREADY_BEEN_FULLY_PAID,
              error: null,
            });
            return;
          }

          const totalInvoiceAmount = invoiceObject.Line[0].Amount;
          const paymentAmount = paymentObject.Line[0].Amount;
          //check if the payment amount is greater then the total amount
          if (paymentAmount > totalInvoiceAmount) {
            await this.logSync(
              "",
              "",
              RecordType.Payment,
              "",
              LogStatus.Error,
              "payment amount is greater  thn total amount",
              createPaymentLog.id
            );
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
            await this.logSync(
              "",
              "",
              RecordType.Payment,
              "",
              LogStatus.Error,
              "payment amount is greater  thn pending amount",
              createPaymentLog.id
            );
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
              await this.logSync(
                "",
                "",
                RecordType.Payment,
                "",
                LogStatus.Error,
                err,
                createPaymentLog.id
              );
              resolve({
                status: 451,
                message: JSON.stringify(err),
                id: null,
              });
            } else {
              const savedData = await prisma.syncedData.create({
                data: {
                  qboId: response.Id,
                  dbId: paymentEntity.id,
                  recordType: RecordType.Payment,
                  data: JSON.stringify(response),
                },
              });
              await this.logSync(
                response.Id,
                "",
                RecordType.Payment,
                "",
                LogStatus.Success,
                "create payment process completed ",
                createPaymentLog.id
              );
              resolve({
                status: 200,
                message: SUCCESS_MESSAGES.PAYMENT_CREATED_SUCCESSFULLY,
                id: paymentObject.Id,
                savedData,
              });
            }
          });
        });
      } catch (error: any) {
        resolve({
          status: 451,
          message: ERROR_MESSAGE.SOMETHING_WENT_WRONG,
          error: error.message,
        });
      }
    });

    return createPaymentPromise;
  }

  async existingCustomerInQBO(
    qbo: any,
    realmId: string,
    Id: any
  ): Promise<any> {
    return new Promise((resolve) => {
      try {
        // const customerObject = await this.manipulatedCustomerObject(
        //   customerData
        // );
        qbo.findCustomers(
          [
            {
              field: "Id",
              value: Id,
              operator: "=",
            },
          ],
          (err: any, customer: any) => {
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
          status: 451,
          error: err.mesage,
          document: null,
          message: "something went wrong in finding customer",
        });
      }
    });
  }

  async checkInvoiceExists(qbo: any, realmId: string, Id: any): Promise<any> {
    return new Promise((resolve) => {
      try {
        qbo.findInvoices(
          [
            {
              field: "Id",
              value: Id,
              operator: "=",
            },
          ],

          (err: any, invoice: any) => {
            if (err) {
              resolve({
                status: 451,
                message: JSON.stringify(err),
                document: null,
              });
            } else {
              if (JSON.stringify(invoice.QueryResponse) !== "{}") {
                resolve({
                  status: 200,
                  message: SUCCESS_MESSAGES.CUSTOMER_EXISTS,
                  document: invoice.QueryResponse.Invoice[0],
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
          status: 451,
          error: err.mesage,
          document: null,
          message: "something went wrong in finding customer",
        });
      }
    });
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

  async manipulatedInvoiceObject(invoice: any, customerid: string) {
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
        value: customerid,
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

  async newSyncProcess(
    accessToken: string,
    realmId: string,
    refreshToken: string,
    customerData?: any,
    invoiceData?: any,
    paymentObject?: any
  ): Promise<any> {
    const integration = await qbRepository.getCompanyByTenantId(realmId);

    if (!integration) {
      return {
        status: 404,
        message: VALIDATION_MESSAGE.INVOICE_DOES_NOT_EXIST,
      };
    }

    const qbo = await this.createQuickBooksObject(
      accessToken,
      realmId,
      refreshToken
    );

    for (const customerObject of customerData) {
      const customerLog = await this.logSync(
        "",
        "",
        RecordType.Customer,
        "",
        LogStatus.Started,
        "customer process started "
      );
      //find customer in quickbook
      const syncCustomer = await this.findCustomerInQBO(
        qbo,
        realmId,
        customerObject
      );
      if (syncCustomer.status === 200) {
        await this.logSync(
          syncCustomer.document,
          "",
          RecordType.Customer,
          "",
          LogStatus.Success,
          "customer exists ",
          customerLog.id
        );
      } else {
        //create customer in quickbook if not exists
        const createCustomer = await this.createCustomerInQBO(
          qbo,
          realmId,
          customerObject
        );

        if (createCustomer.status === 200) {
          await this.logSync(
            createCustomer.id,
            "",
            RecordType.Customer,
            "",
            LogStatus.Success,
            "customer created",
            customerLog.id
          );
        } else {
          await this.logSync(
            "",
            "",
            RecordType.Customer,
            "",
            LogStatus.Error,
            "customer error",
            customerLog.id
          );
        }
      }
    }

    const invoiceLog = await this.logSync(
      "",
      "",
      RecordType.Invoice,
      "",
      LogStatus.Started,
      "invoice process started"
    );
    for (const invoiceObject of invoiceData) {
      //query to fetch qbo customer id
      const qboId: any = await prisma.syncedData.findFirst({
        select: {
          qboId: true,
        },
        where: {
          dbId: invoiceObject.customerId,
          recordType: RecordType.Customer,
        },
      });

      //check if that customer exists in quickbook
      const customerExistsInQbo = await this.existingCustomerInQBO(
        qbo,
        realmId,
        qboId.qboId
      );

      if (customerExistsInQbo.status === 200) {
        //check if invoice exists
        const existingInvoice = await prisma.syncedData.findFirst({
          where: {
            dbId: invoiceObject.id,
            recordType: RecordType.Invoice,
          },
        });

        if (existingInvoice) {
          await this.logSync(
            "",
            "",
            RecordType.Invoice,
            "",
            LogStatus.Success,
            "invoice already exists",
            invoiceLog.id
          );
          continue;
        }

        //create invoice
        const invoiceResponse = await this.createInvoice(
          accessToken,
          realmId,
          refreshToken,
          invoiceObject,
          customerExistsInQbo.document
        );

        if (invoiceResponse.status === 200) {
          await this.logSync(
            invoiceResponse.response,
            "",
            RecordType.Invoice,
            "",
            LogStatus.Success,
            "invoice created in existing customer",
            invoiceLog.id
          );
        } else {
          await this.logSync(
            "",
            "",
            RecordType.Invoice,
            "",
            LogStatus.Error,
            "creating invoice error",
            invoiceLog.id
          );
        }
      } else {
        await this.logSync(
          "",
          "",
          RecordType.Invoice,
          "",
          LogStatus.Error,
          "customer not exists in quickbook",
          invoiceLog.id
        );
      }
    }

    for (const paymentData of paymentObject) {
      //query to find the invoice id from database
      const qboIdOfInvoice: any = await prisma.syncedData.findFirst({
        where: {
          dbId: paymentData.invoiceId,
          recordType: RecordType.Invoice,
        },
      });

      const existInvoice = await this.checkInvoiceExists(
        qbo,
        realmId,
        qboIdOfInvoice.qboId
      );
      if (existInvoice.status === 200) {
        const customerId = existInvoice.document.CustomerRef.value;
        //create payment method
        await this.createPayment(
          accessToken,
          realmId,
          refreshToken,
          paymentData,
          existInvoice.document.Id,
          customerId
        );
      }
    }

    return { message: SUCCESS_MESSAGES.DATA_SYNCED_SUCCESSFULLY, status: 200 };
  }
}

export default new QuickBookServices();
