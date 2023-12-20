import xero from "../config/xeroConfig";
import {
  XeroAuthurl,
  XeroGetTokens,
  XeroUpdateTenants,
} from "../helpers/xeroApis";
import { XeroTokenInterface } from "../interfaces/xeroToken";

class XeroServices {
  async getAuthURL() {
    const authURL = await XeroAuthurl();
    return authURL;
  }

  async saveXeroCredentials(url: string, user: any) {
    const token: any = await XeroGetTokens(url);

    xero.setTokenSet(token);

    await XeroUpdateTenants();
    const tenantId = xero?.tenants[0]?.tenantId;
    const tenantName = xero?.tenants[0]?.tenantName;
    const tokenExpiration = token?.expires_at;
    const XeroTokenDetails: XeroTokenInterface = {
      accessToken: token?.access_token,
      refreshToken: token?.refresh_token,
      idToken: token?.id_token,
      expiresAt: token?.expires_at,
      readableExpirationTime: new Date(tokenExpiration * 1000).toUTCString(),
      tenants: xero?.tenants,
    };
    return XeroTokenDetails;
  }
}

export default new XeroServices();
