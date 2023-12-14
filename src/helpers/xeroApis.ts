import xero from "../config/xeroConfig";

export const XeroAuthurl = async () => {
  const consentUrl = await xero.buildConsentUrl();
  return consentUrl;
};
export const XeroGetTokens = async (url: string) => {
  const tokens = await xero.apiCallback(url);
  return tokens;
};

export const XeroUpdateTenants = async () => {
  const tenants = await xero.updateTenants(false);
  return tenants;
};
