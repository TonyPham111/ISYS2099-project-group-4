import express from "express";
import * as userController from "../Controller/userController.js";
import { verifyToken } from "../Middleware/auth.js";
const userRouter = express.Router();

userRouter
.route("/register")
.post( userController.register);

userRouter
.route("/login")
.post( userController.login);

userRouter
.route("/logout")
.delete( userController.logout );

export default userRouter;
