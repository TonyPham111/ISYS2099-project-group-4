import express from "express";
import * as userController from "../Controller/userController.js";
import { verifyToken, refreshToken } from "../Middleware/auth.js";

const userRouter = express.Router();

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

userRouter
  .route("/reset-password/:token")
  .post(userController.resetPassword);

userRouter
  .route("/request-password-reset")
  .post(userController.requestPasswordReset);

export default userRouter;
