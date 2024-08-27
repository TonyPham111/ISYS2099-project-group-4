import express from "express";
import * as treatmentHistoryController from "../Controller/treatmentHistoryController.js";
import { verifyToken } from "../Middleware/auth.js";
const treatmentHistoryRouter = express.Router();
treatmentHistoryRouter
  .route("/")
  .get(verifyToken, treatmentHistoryController.getAllTreatmentHistory)
  .post(verifyToken, treatmentHistoryController.createNewTreatment);
treatmentHistoryRouter
  .route("/:treatmentId")
  .get(verifyToken, treatmentHistoryController.getSpecificTreatmentHistory);
export default treatmentHistoryRouter;
