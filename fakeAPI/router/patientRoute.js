import express from "express";
const patientRouter = express.Router();
patientRouter
  .route("/")
  .get((req, res) => {
    //get all patient personal information
  })
  .post((req, res) => {
    //register new patient
  });

patientRouter
  .route("/:patient-id")
  .get((req, res) => {
    //get specific patient's personal information
  })
  .put((req, res) => {
    //update specific patient's personal information
  });

patientRouter.route("/:patient-id/diagnosis").get((req, res) => {
  //get all diagnosis data of specific patient
});
patientRouter.route("/:patient-id/diagnosis/:diagnosis-id").get((req, res) => {
  //get specific diagnosis data of specific patient
});

export default patientRouter;
