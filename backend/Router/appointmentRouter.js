import express from "express";
import * as appointmentController from "../Controller/appointmentController.js";
import { verifyToken } from "../Middleware/auth.js";
const appointmentRouter = express.Router();
appointmentRouter
  .route("/")
  .get(verifyToken, appointmentController.getAllAppointment)//doctor, nurse, frontdesk
  .post(verifyToken, appointmentController.addNewAppointment);//frontdesk
appointmentRouter
  .route("/:appointmentId")
  .get(verifyToken, appointmentController.getSpecificAppointment)//doctor, nurse, frontdesk
  .put(verifyToken, appointmentController.updateSpecificAppointment)//doctor
  .delete(verifyToken, appointmentController.deleteSpecificAppointment);//frontdesk
export default appointmentRouter;
