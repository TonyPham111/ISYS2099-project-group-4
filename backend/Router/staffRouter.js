import express from "express";
import * as staffController from "../Controller/staffController.js";
import { verifyToken } from "../Middleware/auth.js";
const staffRouter = express.Router();
staffRouter
  .route("/")
  .get(verifyToken, staffController.getAllStaffsInfo)
  .post(verifyToken, staffController.addNewStaff);
staffRouter
  .route("/:staffId")
  .get(verifyToken, staffController.getSpecificStaffInfo)
  .put(verifyToken, staffController.updateSpecificStaffInfo);
staffRouter
  .route("/:staffId/schedule")
  .get(verifyToken, staffController.getStaffSchedule)
  .put(verifyToken, staffController.updateSpecificStaffSchedule);
export default staffRouter;
