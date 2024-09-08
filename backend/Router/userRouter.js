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

// userRouter
//   .route("/request-email-verification")
//   .post(userController.requestEmailVerification);

// userRouter
//   .route("/verify-email/:token")
//   .get(userController.verifyEmailToken);

// userRouter
//   .route("/reset-password")
//   .post(userController.resetPassword);

userRouter
  .route("/request-password-reset")
  .post(userController.requestPasswordReset);

userRouter
  .route("/reset-password")
  .post(userController.resetPassword);

export default userRouter;
