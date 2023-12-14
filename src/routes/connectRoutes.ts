import express from "express";
import { connectServicesController } from "../controllers";
//import { isAuthenticated } from '../middlewares/authMiddleware';

const activeRoute = express();

activeRoute.get(
  "/services",
 // isAuthenticated,
  connectServicesController.getAllActiveServices
);
activeRoute.delete(
  "/:id",
 // isAuthenticated,
  connectServicesController.deleteConnection
);

export default activeRoute;
