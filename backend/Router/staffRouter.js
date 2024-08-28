import express from "express";
import * as staffController from "../Controller/staffController.js";
import { verifyToken } from "../Middleware/auth.js";
const staffRouter = express.Router();
staffRouter
  .route("/")
  .get(verifyToken, staffController.getAllStaffsInfo)//manager staff(show all of subordinate staff), HR(show all staff)
  .post(verifyToken, staffController.addNewStaff);//HR
staffRouter
  .route("/:staffId")
  //.get(verifyToken, staffController.getStaffPersonalInfo)//manager of that staff,HR
  .put(verifyToken, staffController.updateStaffPersonalInfo);//HR

staffRouter
.route("/staff_personal_info")
.get(verifyToken, staffController.getStaffPersonalInfo)

staffRouter
  .route("/:staffId/schedule")
  .get(verifyToken, staffController.getStaffSchedule)//manager of that staff
  .put(verifyToken, staffController.updateSpecificStaffSchedule);//manager of that staff
export default staffRouter;
