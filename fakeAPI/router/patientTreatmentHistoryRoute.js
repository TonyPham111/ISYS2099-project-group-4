import express from "express";
const patientTreatmentHistoryRouter = express.Router();
patientTreatmentHistoryRouter
  .route("/treatment-histories")
  .get((req, res) => {
    //get all patient treatment history
  })
  .post((req, res) => {
    //create new patient treatment history
  });

patientTreatmentHistoryRouter.route("/treatment-histories/:id").get((req, res) => {
  //get specific treatment histories data
});
export default patientTreatmentHistoryRouter;
