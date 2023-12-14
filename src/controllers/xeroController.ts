import { NextFunction, Request, Response } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import xeroServices from "../services/xeroService";
import { RequestExtended } from "../interfaces/global";

class XeroConfigController {
    // Method to initiate the Xero connection process
    async connectToXero(req: Request, res: Response,next: NextFunction) {
        try {
            // Build the consent URL for Xero authentication
            const consentUrl =await xeroServices.getAuthURL()
            // const consentUrl = await xero.buildConsentUrl();
            return DefaultResponse(
                res,
                200,
                "Xero Login URL retrieved successfully",
                consentUrl
            );
        } catch (err: any) {
            // res.send(err.message);
            next(err)
        }
    }

    // Callback method to handle Xero authentication callback
    async callback(req: RequestExtended, res: Response,next: NextFunction) {
        try {
            const saveXeroCredentials=await xeroServices.saveXeroCredentials(req?.body?.url,req.user)
            // Get the access token from the Xero API callback
            // const token = await xero.apiCallback(req?.body?.url);

            // // Fetch Xero configuration data and save it
            // const XeroData = await xeroServices.getXeroConfigService(
            //     token,
            //     req.user as any
            // );

            // Send a success response
            return DefaultResponse(res, 200, "Xero data fetched", 
            // XeroData 
            );
        } catch (err: any) {
            // Send an error response
            next(err)
        }
    }
}

export default new XeroConfigController();
