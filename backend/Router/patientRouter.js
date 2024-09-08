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
  .put(verifyToken, patientController.updateSpecificPatientInfo) //frontdesk
  .get(verifyToken, patientController.getSpecificPatient); 

patientRouter
  .route("/:patientId/diagnosis")
  .get(verifyToken, patientController.getSpecificPatientAllDiagnosis) //doctor, nurse
  .post(verifyToken, patientController.addSpecificPatientDiagnosis); //doctor

patientRouter
  .route("/:patientId/allergies")
  .get(verifyToken, patientController.getSpecificPatientAllAllergies) //doctor, nurse
  .post(verifyToken, patientController.addSpecificPatientAllergy); //doctor

/*
still don't have billing 
*/
export default patientRouter;
