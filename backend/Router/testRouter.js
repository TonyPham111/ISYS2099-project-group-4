import express from "express";
import * as testController from "../Controller/testController.js"
import { verifyToken } from "../Middleware/auth.js";
import {upload} from '../Middleware/multer.js'

const testRouter = express.Router();

testRouter
  .route("/:patientId/tests")
  .get(verifyToken, testController.getAllTests)//doctor, nurse
  .post(verifyToken, testController.createNewTestOrders);//doctor

testRouter
  .route("/:testOrderId/:testTypeId/:patientId/update")
  .put(verifyToken, upload.fields(
    [
      { name: 'lab_result_name', maxCount: 1 },
      { name: 'test_image_name', maxCount: 20 }
    ]
  ),  testController.updateLabResult)//nurse

testRouter
  .route("/:labDocumentId/lab_results")
  .get(verifyToken, testController.getLabResults)//doctor, nurse

export default testRouter;
