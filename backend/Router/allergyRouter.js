import express from "express";
import * as allergyController from "../Controller/allergyController.js";
import { verifyToken } from "../Middleware/auth.js";
const allergyRouter = express.Router();
allergyRouter.route('/').get(verifyToken, allergyController.getAllAllergy);
export default allergyRouter;