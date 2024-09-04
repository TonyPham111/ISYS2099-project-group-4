import express from "express";
import * as BillingController from "../Controller/BillingController.js";
import { verifyToken } from "../Middleware/auth.js";

const billingRouter = express.Router();

billingRouter
  .route("/")
  .get(verifyToken, BillingController.getAllBillings)// Business Officer
  .post(verifyToken, BillingController.createNewBilling);//HR

billingRouter
  .route("/:billingId")
  .get(verifyToken, BillingController.getBillingDetail)//manager of that staff,HR
 
export default billingRouter;
