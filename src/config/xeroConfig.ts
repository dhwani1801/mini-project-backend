import { XeroClient } from "xero-node";

const xero = new XeroClient({
    clientId: '541657A2573849C3A9307F30DCF9BEBB',
    clientSecret: '1h8AVws26Gd_D9BPqclnELsAE4-LJzgR-qHbNsMy_-oVhHMI',
    redirectUris: ['http://localhost:3000/xero/callback'],
    scopes: String(
      'openid profile email accounting.settings payroll.employees offline_access',
    ).split(' '),
});

export default xero;