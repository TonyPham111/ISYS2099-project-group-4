import express from "express";
import * as userController from "../Controller/userController.js";
import { verifyToken } from "../Middleware/auth.js";