import { prisma } from "../client/prisma";
const OAuthClient = require("intuit-oauth");
const QuickBooks = require("node-quickbooks");

const authClient = new OAuthClient({
    clientId: process.env?.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env?.QUICKBOOKS_CLIENT_SECRET,
    environment: process.env?.QUICKBOOKS_ENVIRONMENT,
    redirectUri: process.env?.QUICKBOOKS_REDIRECT_URI,
});


class QuickBookServices {
    // Get Quickbooks authentication URL

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
    

    async getTokenInfo(url: any, user: any) {
        if (url && url.includes("error")) {
            throw new Error();
        }

        const data = await authClient.createToken(url);
        console.log('data : ', data)
        if (data?.token &&
            data.token?.access_token &&
            data.token?.realmId &&
            data.token?.refresh_token) {
            // Get the access token
            const companyData = await this.getCompanyInfo(
                data?.token?.access_token,
                data?.token?.realmId,
                data?.token?.refresh_token
            );
            console.log('comapany data : ', companyData)
            // console.log('companyData: ', companyData);

            if (companyData) {
                // Combine the access token data
                const responseData = {
                    access_token: data.token?.access_token,
                    realmId: data.token?.realmId,
                    refresh_token: data?.token?.refresh_token,
                    companyName: companyData?.CompanyName
                };
                console.log('responsedata : ', responseData)
                const respdata = {
                    data: responseData
                }
                console.log('respdata : ', respdata);

                // Check if a connection already exists for quickbooks online
                //       const qboConnection = await saveConnectionsRepository.checkConnectionAlreadyPresent(user, responseData.companyName, ChannelName.QBO);
                //       if (qboConnection) {
                //           const error = new CustomError(409, "Connection is already established");
                //           throw error;
                //       } else {
                //           const createQboConnection = await saveConnectionsRepository.saveConnectionsDetails(ChannelType.ACCOUNTING, ChannelName.QBO, respdata, user, responseData?.companyName,responseData?.realmId);
                //           return createQboConnection;
                //       }
                //   } else {
                //       const error = new CustomError(409, "Failed to get token");
                //           throw error;
                //   }

            } else {
                const error = new Error();
                throw error;
            }
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

    async getEmployees(
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
            qbo.findEmployees(
                [{ field: 'Active', value: [true, false], operator: 'IN' }],
                // [{ field: 'fetchAll', value: true }],
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

}

export default new QuickBookServices();