import express from "express";
import * as conditionController from "../Controller/conditionController.js";
import { verifyToken } from "../Middleware/auth.js";

const conditionRouter = express.Router();

conditionRouter
    .route('/')
    .get(verifyToken, conditionController.getAllConditions);//doctor

export default conditionRouter;
