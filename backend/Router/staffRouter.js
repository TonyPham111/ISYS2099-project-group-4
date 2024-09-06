import express from "express";
import * as staffController from "../Controller/staffController.js";
import { verifyToken } from "../Middleware/auth.js";
import {upload} from "../Middleware/multer.js"

const staffRouter = express.Router();

staffRouter
  .route("/")
  .get(verifyToken, staffController.getAllStaffInfo)//manager staff(show all of subordinate staff), HR(show all staff)
  .post(verifyToken, staffController.addNewStaff);//HR

staffRouter
  .route("/subordinates")
  .get(verifyToken, staffController.getSubordinates)//manager of that staff,HR

staffRouter
  .route("/:staffId/personal_info")
  .get(verifyToken, staffController.getStaffPersonalInfo) //HR
  .put(verifyToken, staffController.updateStaffPersonalInfo) //HR

staffRouter
  .route("/:staffId/wage_change")
  .get(verifyToken, staffController.getWageChangeHistory) // HR // Cái này để view lịch sử thay đổi lương
  .put(verifyToken, staffController.updateStaffWage) //HR

staffRouter
  .route("/:staffId/job_change")
  .get(verifyToken, staffController.getJobChangeHistory) //HR //Cái này để view lịch sử thay đổi công việc
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
  
staffRouter
  .route("/:staffId/performanceevaluation")
  .get(verifyToken, staffController.getStaffEvaluations)
  .post(verifyToken, staffController.evaluateStaff)

staffRouter
  .route("/:evaluationId/performanceevaluation")
  .get(verifyToken, staffController.GetEvaluationDetails)

staffRouter
  .route("/trainingmaterial")
  .get(verifyToken, staffController.getTrainingMaterials)
  .post(verifyToken, upload.single('training_material'), staffController.NewTrainingMaterial)

staffRouter
  .route("/:staffId/qualifications")
  .post(verifyToken, staffController.addNewQualifications )
  .get(verifyToken, staffController.getStaffQualifications)


export default staffRouter;
 