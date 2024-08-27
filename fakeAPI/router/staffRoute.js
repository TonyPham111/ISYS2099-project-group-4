import express from "express";
const staffRouter = express.Router();
staffRouter
  .route("/")
  .get((req, res) => {
    //get all staff data
  })
  .post((req, res) => {
    //add new staff
  });

staffRouter
  .route("/:staff-id")
  .get((req, res) => {
    //get specific staff data
  })
  .put((req, res) => {
    //update specific staff data
  });

staffRouter
  .route("/:staff-id/schedule")
  .get((req, res) => {
    //get all staff working schedule
    //get all staff appointment data
  })
  .put((req, res) => {
    //update staff working schedule
  });

export default staffRouter;
