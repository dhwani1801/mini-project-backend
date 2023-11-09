import { NextFunction, Response } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { RequestExtended } from "../interfaces/global";
import quickBookService from "../services";
import { AuthTokenInterface } from "../interfaces/quickBookInterface";
    
class QuickbooksController {
  // Get Quickbooks Auth URI
  async getQuickbooksAuthUri(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
        
      const authURL = await quickBookService.quickBookService.getauthURL();

      return DefaultResponse(
        res,
        200,
        "Quickbooks AuthUri retrieved successfully",
        authURL
      );
    } catch (err) {
      next(err);
    }
  }

//   async callback(
//     req: RequestExtended,
//     res: Response,
//     next: NextFunction
// ) {
//     try {
//         // Get company id from body - only for reconnecting company
//         const companyId = req?.body?.companyId;

//         // Fetch URL
//         const url = String(req?.body?.url);

//         const currentUrl = new URL(req?.body?.url);

//         const searchParams = currentUrl?.searchParams;

//         const userId = searchParams.get('state')!;

//         const authToken: AuthTokenInterface =
//             await quickBookService.quickBookService.createAuthToken(url);

//         const qboCompanyInfo = await quickBookService.quickBookService.getCompanyInfo(
//             authToken.access_token,
//             authToken.realmId,
//             authToken.refresh_token
//         );

//         let finalCompanyDetails;

//         if (companyId != 'undefined' && companyId !== null) {
//             // checking is user permitted
//             // const isPermitted = await checkPermission(req, companyId, {
//             //     permissionName: 'Integrations',
//             //     permission: ['edit'],
//             // });
//             // if (!isPermitted) {
//             //     throw new CustomError(403, 'You are not authorized');
//             // }

//             const companyDetails = await companyRepository.getDetails(companyId);

//             if (!companyDetails) {
//                 const error = new Error();
//                 throw error;
//             }

//             if (companyDetails?.tenantID !== authToken.realmId) {
//                 const error = new Error();
//                 throw error;
//             }

//             finalCompanyDetails = await companyRepository.updateCompany(companyId, {
//                 accessToken: authToken.access_token,
//                 refreshToken: authToken.refresh_token,
//                 isConnected: true,
//                 tenantID: authToken.realmId,
//                 fiscalYear: qboCompanyInfo?.FiscalYearStartMonth,
//             });

//         } else {
//             // For first time company integration

//             // Check if the same company is already connected
//             const isAlreadyConnected = await companyRepository.getCompanyByTenantId(
//                 authToken.realmId
//             );

//             if (isAlreadyConnected) {
//                 const error = new Error();
//                 throw error;
//             }
//             const data = {
//                 tenantID: authToken.realmId,
//                 tenantName: qboCompanyInfo?.CompanyName,
//                 accessToken: authToken.access_token,
//                 refreshToken: authToken.refresh_token,
//                 accessTokenUTCDate: new Date(),
//                 isConnected: true,
//                 fiscalYear: qboCompanyInfo?.FiscalYearStartMonth,
//             };
//             finalCompanyDetails = await companyRepository.create(data);

//             // await companyRepository?.connectCompany(
//             //     userId,
//             //     finalCompanyDetails?.id
//             // );

//             // await configurationRepository.createDefaultConfiguration(
//             //     finalCompanyDetails?.id
//             // );


//             // const syncData = await employeeServices.syncEmployeeFirstTime({
//             //     accessToken: authToken?.access_token,
//             //     refreshToken: authToken?.refresh_token,
//             //     tenantId: authToken?.realmId,
//             //     companyId: finalCompanyDetails?.id,
//             // });
//             // // Do not remove API for employee sync


//             // // Update employee last sync date
//             // await prisma.company.update({
//             //     where: {
//             //         id: finalCompanyDetails?.id,
//             //     },
//             //     data: {
//             //         employeeLastSyncDate: moment(new Date())
//             //             .tz('America/Los_Angeles')
//             //             .format(),
//             //     },
//             // });

//             // // Update employee last sync date
//             // await prisma.company.update({
//             //     where: {
//             //         id: finalCompanyDetails?.id,
//             //     },
//             //     data: {
//             //         timeActivitiesLastSyncDate: moment(new Date())
//             //             .tz('America/Los_Angeles')
//             //             .format(),
//             //     },
//             // });


//             // const employees = await employeeRepository.getAllEmployeesByCompanyId(
//             //     finalCompanyDetails?.id
//             // );

//         }

//         return DefaultResponse(
//             res,
//             200,
//             'Company connected successfully',
//             finalCompanyDetails
//         );
//     } catch (err) {
//         next(err);
//     }
// }

  async quickbooksCallback(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Get the URL from the request body
      const url = req?.body?.url;

      // Obtain token information and associate it with the user
      const data = await quickBookService.quickBookService.getTokenInfo(url, req.user);

      // Send a success response with the token information
      return DefaultResponse(res, 200, "Company connected successfully", data);
    } catch (err) {
      // If an error occurs, pass it to the error-handling middleware
      next(err);
    }
  }

  async getAllQBEmployees(
    req: RequestExtended,
    res: Response,
    next: NextFunction
) {
    try {
        // Check validation for company id
       // checkValidation(req);

        const companyId = req.body.companyId;

        // Get access token
      //  const authResponse = await quickBookService.quickBookService.getTokenInfo(companyId);

        // Get All Employees From Quickbooks
        const allEmployees: any = await quickBookService.quickBookService.getEmployees(
            'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..p62G86FALF1Kyr1SO8Ezew.93NSqRUr8gx1m7uQxgUYcDqzVmYGXocIX9Iz0HgQjABKrIbQiTRjg1PgBQMG4jiTctGbEsPyV6YbkXF2soU6DHqyga8__Fk2tRyILbWaQc44snLXq4s1Yo4uo1d4MDLLdbDKxr0zzm5ktXWwf6kGCpGQGhBuM3_N_SywcTFyb-M6Ul3K-yxXNoLv5r3VeNQ_9ruT-h9A-RB-BeZ-U7nciVL-p12WLe-fU6jfA7X0vu6r6KHS3hjtYtDoLYkR-SJGBAKrfho4Gbv1FexIse-MQgiIKJHfZfejr6amf3K1c858nbre5KK8cUlnzGbv0CBibrk5IwpxWyizjpByp5GnM1VMvqbpkwy7Rjl70x4sg3ctHv341HTf7xNIuvBsPZx_kNE6UI3POCxIkKm5j1xPhqSza5DhP2s9bqeFaC6CIs95toxNwv5poFCxyPoIbDLt24vAseON55k-VXRJtx9nEKvl_n4fZCVigQYhE5OQb8EzFGlqG47vBI8RvQXr9gOL75Ey5bLVMSd_YOyKCPa7daerxJjGxwgRE8e65dhrYr_RO_Ff46NCIW0X8DJSbr83WjWiAR6myMoH3_y9MveL4ySoB7YCeV5_g1MJIYhHUCywz83eQG3e1m4sPM5JXSmzRZ3N_l5JtxziBPCaAvB-g7sl4IPs5m4XUO2aLVD-9M0pni4V5bOOFLNXWVHxxB5oqRIK_R8BdVAWG81ULWhROpTnzdFybonXpHiS0HXja0XhKJwWJsfHb92ipEv0GyZX.laL6cNhJQWSMwIrow25RgQ',
            '4620816365326541310',
            'AB11707991691pgocYqosvLJQcVXWbgVdQgqN44WI4riArESHg'
        );

        return DefaultResponse(
            res,
            200,
            'All employees fetched ',
            allEmployees?.QueryResponse?.Employee
        );
    } catch (err) {
        next(err);
    }
}

}
export default new QuickbooksController();