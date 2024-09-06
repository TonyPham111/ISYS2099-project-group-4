import express from "express";
import * as testController from "../Controller/testController.js"
import { verifyToken } from "../Middleware/auth.js";

const testRouter = express.Router();

testRouter
  .route("/:patientId/tests")
  .get(verifyToken, testController.getAllTests)//doctor, nurse
  .post(verifyToken, testController.createNewTestOrders);//doctor

testRouter
  .route("/:testOrderid/:testTypeId/update")
  .get(verifyToken, testController.updateLabResult)//nurse

testRouter
  .route("/:labresultId/lab_results")
  .get(verifyToken, testController.getLabResults)//doctor, nurse

export default testRouter;
