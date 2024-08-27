import express from "express";
import patientTreatmentHistoryData from "..//data/patient_treatment_history data.json" with {type: 'json'};
const patientTreatmentHistoryRouter = express.Router();
patientTreatmentHistoryRouter
  .route("/")
  .get((req, res) => {
    //get all patient treatment history
    /*
    structure data: 
    [
      {
        treatment_id: INT, 
        date: "DD/MM/YYYY",
        doctor_id: INT,
         prescription: [
           {
            drug_code: INT, 
             drug_name: String, 
             quantity: INT, 
             unit: String, 
             price_per_unit: DECIMAL (10, 3) => example: 130000.00, 2.500
           }
        ]
      }
    ]
    */
    try {
      const { patientId } = req.query;
      let result = patientTreatmentHistoryData;
      if (patientId) {
        result = patientTreatmentHistoryData.filter((item) => {
          return item.patient_id == Number(patientId);
        });
      }
      if(result.length == 0){
        res.status(404).json({error: `patientId ${patientId} dont have any treatment history data`})
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  })
  .post((req, res) => {
    //create new patient treatment history
  });

patientTreatmentHistoryRouter
  .route("/:treatmentId")
  .get((req, res) => {
    //get specific treatment histories data
    /*
  structure data: 
  {
    treatment_id: INT, 
    prescription: [
      {
        drug_name: String, 
        quantity: INT, 
        unit: String, 
        price_per_unit: DECIMAL (10, 3) => example: 130000.00, 2.500
      }
    ]
  }
  */
    try {
      const treatmentId = req.params.treatmentId;
      let result;
      if (!treatmentId) {
        res
          .status(400)
          .json({ error: "treatment id is not provided" });
      }
      for (let i = 0; i < patientTreatmentHistoryData.length; ++i) {
        if (patientTreatmentHistoryData[i].treatment_id == Number(treatmentId)) {
          result = patientTreatmentHistoryData[i];
        }
      }
      if(!result){
        res.status(404).json({error: "treatment id is invalid or not found"})
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });
export default patientTreatmentHistoryRouter;
