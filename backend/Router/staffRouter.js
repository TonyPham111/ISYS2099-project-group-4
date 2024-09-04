import express from "express";
import * as staffController from "../Controller/staffController.js";
import { verifyToken } from "../Middleware/auth.js";

const staffRouter = express.Router();

staffRouter
  .route("/")
  .get(verifyToken, staffController.getAllStaffInfo)//manager staff(show all of subordinate staff), HR(show all staff)
  .post(verifyToken, staffController.addNewStaff);//HR

staffRouter
  .route("/:staffId")
  .get(verifyToken, staffController.getStaffPersonalInfo)//manager of that staff,HR
  .put(verifyToken, staffController.updateStaffPersonalInfo);//HR

staffRouter
  .route("/:staffId/staff_personal_info")
  .get(verifyToken, staffController.getStaffPersonalInfo) //HR
  .put(verifyToken, staffController.updateStaffPersonalInfo) //HR

staffRouter
  .route("/:staffId/wage_change")
  .get(verifyToken, staffController.getWageChangeHistory) // HR // Cái này để view lịch sử thay đổi lương
  .put(verifyToken, staffController.updateStaffWage) //HR

staffRouter
  .route("/:staffId/job_change")
  .get(verifyToken, staffController.getStaffPersonalInfo) //HR //Cái này để view lịch sử thay đổi công việc
  .put(verifyToken, staffController.updateStaffJob) //HR

staffRouter
  .route("/:staffId/department_change")
  .get(verifyToken, staffController.getDepartmentChangeHistory) //HR cái này để view lịch sử thay đổi department
  .post(verifyToken, staffController.updateStaffDepartment) //HR

staffRouter
  .route("/:staffId/schedule")
  .post(verifyToken, staffController.schedule)
  .get(verifyToken, staffController.getStaffSchedule)//manager of that staff

staffRouter
  .route("/:staffId/deleteschedule")
  .post(verifyToken, staffController.deleteSchedule)

export default staffRouter;
