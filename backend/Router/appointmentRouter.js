import express from "express";
import * as appointmentController from "../Controller/appointmentController.js";
import { verifyToken } from "../Middleware/auth.js";
const appointmentRouter = express.Router();
appointmentRouter
  .route("/")
  .get(verifyToken, appointmentController.getAllAppointment)
  .post(verifyToken, appointmentController.addNewAppointment);
appointmentRouter
  .route("/:appointmentId")
  .get(verifyToken, appointmentController.getSpecificAppointment)
  .put(verifyToken, appointmentController.updateSpecificAppointment);
export default appointmentRouter;
