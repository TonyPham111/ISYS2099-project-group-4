import express from "express";
import * as treatmentHistoryController from "../Controller/treatmentHistoryController.js";
import { verifyToken } from "../Middleware/auth.js";
const treatmentHistoryRouter = express.Router();
treatmentHistoryRouter
  .route("/")
  .get(verifyToken, treatmentHistoryController.getAllTreatmentHistory)//doctor, nurse
  .post(verifyToken, treatmentHistoryController.createNewTreatment);//doctor
<<<<<<< HEAD
// treatmentHistoryRouter
//   .route("/:treatmentId")
//   .get(verifyToken, treatmentHistoryController.getSpecificTreatmentHistory);//doctor, nurse
=======
treatmentHistoryRouter
  .route("/:treatmentId")
>>>>>>> f0b10d800d70aa1b642059448f6637ee35a79fc1
export default treatmentHistoryRouter;
