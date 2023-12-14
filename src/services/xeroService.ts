// Import necessary modules and dependencies
import xero from "../config/xeroConfig";
//import { ChannelType, ChannelName } from '../enum';
import {
  XeroAuthurl,
  XeroGetTokens,
  XeroUpdateTenants,
} from "../helpers/xeroApis";
import { XeroTokenInterface } from "../interfaces/xeroToken";
import { CustomError } from "../models/customError";
//import { saveConnectionsRepository } from '../repositories';
//import xeroRepository from '../repositories/xeroRepository';

class XeroServices {
  async getAuthURL() {
    const authURL = await XeroAuthurl();
    return authURL;
  }

  async saveXeroCredentials(url: string, user: any) {
    const token: any = await XeroGetTokens(url);

    xero.setTokenSet(token);

    // Update the list of tenants (organizations)
    await XeroUpdateTenants();

    // Extract tenantId, tenantName, and token expiration information
    const tenantId = xero?.tenants[0]?.tenantId;
    const tenantName = xero?.tenants[0]?.tenantName;
    const tokenExpiration = token?.expires_at;

    // Create an object containing token details
    const XeroTokenDetails: XeroTokenInterface = {
      accessToken: token?.access_token,
      refreshToken: token?.refresh_token,
      idToken: token?.id_token,
      expiresAt: token?.expires_at,
      readableExpirationTime: new Date(tokenExpiration * 1000).toUTCString(),
      tenants: xero?.tenants,
    };
    console.log("details  : ", XeroTokenDetails);
    return XeroTokenDetails;

    //  const checkXeroConnection = await saveConnectionsRepository.checkConnectionAlreadyPresent(user,tenantName, ChannelName.XERO);
    // if (checkXeroConnection) {
    //     const error = new CustomError(409, "Connection is already established");
    //     throw error;
    // } else {
    //    const createXeroConnection = await saveConnectionsRepository.saveConnectionsDetails(ChannelType.ACCOUNTING, ChannelName.XERO,{data:XeroTokenDetails} , user, tenantName, tenantId);
    //     return createXeroConnection;
    // }
  }
}

// Export an instance of the XeroServices class
export default new XeroServices();
