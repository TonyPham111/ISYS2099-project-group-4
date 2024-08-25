import express from "express";
const appointmentRouter = express.Router();
appointmentRouter
  .route("/")
  .get((req, res) => {})
  .post((req, res) => {});

appointmentRouter
  .route("/:appointment-id")
  .get((req, res) => {})
  .put((req, res) => {})
  .delete((req, res) => {});

export default appointmentRouter;
