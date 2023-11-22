import { error } from "console";
import { prisma } from "../client/prisma";
import qbRepository from "../repositories/quickbookRepository";
const OAuthClient = require("intuit-oauth");
const QuickBooks = require("node-quickbooks");
import moment from 'moment-timezone';
import { CustomerObject } from "../interfaces";

const authClient = new OAuthClient({
    clientId: process.env?.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env?.QUICKBOOKS_CLIENT_SECRET,
    environment: process.env?.QUICKBOOKS_ENVIRONMENT,
    redirectUri: process.env?.QUICKBOOKS_REDIRECT_URI,
});


class QuickBookServices {

    /**
     * Get Quickbooks authentication URL */
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
 

    /**
     * get company information
     * @param accessToken 
     * @param realmId 
     * @param refreshToken 
     * @returns 
     */
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


    /**
     * get customers
     * @param accessToken 
     * @param realmId 
     * @param refreshToken 
     * @returns 
     */
    async getCustomers(
        accessToken: string,
        realmId: string,
        refreshToken: string
    ) {
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
            qbo.findCustomers(
                //  [{ field: 'Active', value: [true, false], operator: 'IN' }],
                [{ field: 'fetchAll', value: true }],
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


    /**
     * get access token
     * @param companyId 
     * @returns 
     */
    async getAccessToken(companyId: any) {
        try {
            const companyDetails = await qbRepository.getDetails(companyId);
            if (!companyDetails) {
                throw error(404, 'Company not found');
            }

            const accessTokenUTCDate = moment(companyDetails?.accessTokenUTCDate);
            const currentDateTime = moment(new Date());

            const minutes: string | number = currentDateTime.diff(
                accessTokenUTCDate,
                'minutes'
            );

            if (minutes >= 45) {
                const utc = moment.utc().valueOf();
                const authResponse = await this.refreshToken(
                    companyDetails?.refreshToken as string
                );
                if (authResponse != null) {
                    const updatedCompany = await qbRepository.updateCompany(
                        companyId,
                        {
                            accessToken: authResponse?.token?.access_token,
                            refreshToken: authResponse?.token?.refresh_token,
                            accessTokenUTCDate: moment.utc(utc).toDate(),
                        }
                    );
                    return updatedCompany;
                }
            } else {
                return companyDetails;
            }
        } catch (err) {
            throw err;
        }
    }


    /**
     * updates customer
     * @param accessToken 
     * @param realmId 
     * @param refreshToken 
     * @param customerObject 
     * @returns 
     */
    async updateCustomer(accessToken: string,
        realmId: string,
        refreshToken: string,
        customerObject: any) {
        return new Promise((resolve, reject) => {
            const qbo = new QuickBooks(
                process.env?.QUICKBOOKS_CLIENT_ID,
                process.env?.QUICKBOOKS_CLIENT_SECRET,
                accessToken,
                true,
                realmId,
                process.env?.QUICKBOOKS_ENVIRONMENT == 'sandbox' ? true : false,
                true,
                null,
                '2.0',
                refreshToken
            );
            qbo.updateCustomer(customerObject, (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else {
                //     const updatedCustomer =  prisma.customer.update({
                //         where: { qboCustomerId: response.Id },
                //         data: {
                //             customerId: customerObject.PrimaryEmailAddr.Address,
                //             givenName: customerObject.GivenName,
                //             phone: customerObject.PrimaryPhone.FreeFormNumber,
                //         },
                //     });
    
                //   resolve(updatedCustomer);
                   console.log(response)
                    resolve(response);
                }
            });
        });
    }


    /**
     * creates customer
     * @param accessToken 
     * @param realmId 
     * @param refreshToken 
     * @param customerObject 
     * @returns 
     */
    async createCustomer(accessToken: string,
        realmId: string,
        refreshToken: string,
        customerObject: CustomerObject) {
        return new Promise((resolve, reject) => {
            const qbo = new QuickBooks(
                process.env?.QUICKBOOKS_CLIENT_ID,
                process.env?.QUICKBOOKS_CLIENT_SECRET,
                accessToken,
                true,
                realmId,
                process.env?.QUICKBOOKS_ENVIRONMENT == 'sandbox' ? true : false,
                true,
                null,
                '2.0',
                refreshToken
            );

            qbo.createCustomer(customerObject, (err: any, response: any) => {
                if (err) {
                    reject(err);
                } else {
                    const createdCustomer = prisma.customer.create({
                        data: {
                            qboCustomerId: response.Id,
                            customerId: customerObject.PrimaryEmailAddr.Address,
                            givenName: customerObject.GivenName,
                            phone: customerObject.PrimaryPhone.FreeFormNumber,
                        },
                    });
                    resolve(createdCustomer);
                }
            });
        });
    }
}

export default new QuickBookServices();