import express from "express";
import * as appointmentController from "../Controller/appointmentController.js";
import { verifyToken } from "../Middleware/auth.js";

const appointmentRouter = express.Router();

appointmentRouter
  .route("/")
  .get(verifyToken, appointmentController.getAllAppointment)//frontdesk
  .post(verifyToken, appointmentController.addNewAppointment);//frontdesk

appointmentRouter
  .route("/:appointmentId")
  //.get(verifyToken, appointmentController.getSpecificAppointment)//doctor, nurse, frontdesk // Anh thấy mình không cần cái này
  .put(verifyToken, appointmentController.updateAppointmentNotes)//doctor
  .delete(verifyToken, appointmentController.deleteSpecificAppointment);//frontdesk
  
appointmentRouter
  .route("/availability")
  .get(verifyToken, appointmentController.CheckAvailability)

export default appointmentRouter;
