import { NextFunction, Response } from "express";
import { connectServicesRepository } from "../repositories";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { RequestExtended } from "../interfaces/global";
import connectServicesService from "../services/connect-services.service";

class ConnectServiceController {
  async getAllActiveServices(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.user?.companyId;
      const response = await connectServicesRepository.getAllActive(companyId);

      return DefaultResponse(
        res,
        200,
        "All active services details fetched successfully",
        response
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteConnection(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ) {
    try {
      const connectionId = req.params.id;

      const response = await connectServicesService.deleteConnection(
        Number(connectionId),
        req.user.companyId
      );

      return DefaultResponse(
        res,
        200,
        "Connection deleted successfully",
        response
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new ConnectServiceController();
