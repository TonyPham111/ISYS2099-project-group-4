import express from "express";
import * as userController from "../Controller/userController.js";

const userRouter = express.Router();
import { verifyToken } from "../Middleware/auth.js";

userRouter
  .route("/")

userRouter
  .route("/register")
  .get(verifyToken, userController.registerPage)
  .post(verifyToken, userController.register);

userRouter
  .route("/login")
  .get(userController.loginPage)
  .post(userController.login);

userRouter
  .route("/logout")
  .post(userController.logout);

export default userRouter;
