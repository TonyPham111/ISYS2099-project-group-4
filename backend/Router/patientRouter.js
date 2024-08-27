import express from "express";
import * as patientController from "../Controller/patientController.js";
import { verifyToken } from "../Middleware/auth.js";
const patientRouter = express.Router();
patientRouter
  .route("/")
  .get(verifyToken, patientController.getAllPatientInfo)
  .post(verifyToken, patientController.registerNewPatient);
patientRouter
  .route("/:patientId")
  .get(verifyToken, patientController.getSpecificPatientInfo)
  .put(verifyToken, patientController.updateSpecificPatientInfo);
patientRouter
  .route("/:patientId/diagnosis")
  .get(verifyToken, patientController.getSpecificPatientAllDiagnosis)
  .post(verifyToken, patientController.addSpecificPatientDiagnosis);
  patientRouter
  .route("/:patientId/allergies")
  .get(verifyToken, patientController.getSpecificPatientAllAllergies)
  .post(verifyToken, patientController.addSpecificPatientAllergy);
export default patientRouter;
