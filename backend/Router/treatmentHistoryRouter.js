import express from "express";
import * as treatmentHistoryController from "../Controller/treatmentHistoryController.js";
import { verifyToken } from "../Middleware/auth.js";
const treatmentHistoryRouter = express.Router();
treatmentHistoryRouter
  .route("/")
  .get(verifyToken, treatmentHistoryController.getAllTreatmentHistory)//doctor, nurse
  .post(verifyToken, treatmentHistoryController.createNewTreatment);//doctor

// treatmentHistoryRouter
//   .route("/:treatmentId")
//   .get(verifyToken, treatmentHistoryController.getSpecificTreatmentHistory);//doctor, nurse
treatmentHistoryRouter
  .route("/:treatmentId")
export default treatmentHistoryRouter;
