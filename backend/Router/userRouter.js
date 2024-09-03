import express from "express";
import * as userController from "../Controller/userController.js";
const userRouter = express.Router();

userRouter
  .route("/")

userRouter
  .route("/register")
  .get(userController.registerPage)
  .post(userController.register);

userRouter
  .route("/login")
  .get(userController.loginPage)
  .post(userController.login);

userRouter
  .route("/logout")
  .post(userController.logout);

export default userRouter;
