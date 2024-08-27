import express from "express";
import * as departmentController from "../Controller/departmentController.js";
import { verifyToken } from "../Middleware/auth.js";
const departmentRouter = express.Router();
departmentRouter.route('/').get(verifyToken, departmentController.getAllDepartment);
export default departmentRouter;