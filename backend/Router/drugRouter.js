import express from "express";
import * as drugController from "../Controller/drugController.js";
import { verifyToken } from "../Middleware/auth.js";
const drugRouter = express.Router();
drugRouter.route('/').get(verifyToken, drugController.getAllDrug);
drugRouter.route('/:drugId').get(verifyToken, drugController.getSpecificDrug);
export default drugRouter;