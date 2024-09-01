import express, { json } from "express";
import patientData from "../data/patient_data.json" with {type: 'json'};
import patientDiagnosisData from "../data/patient_diagnosis_data.json" with {type: "json"};
import patientTestingData from "../data/patient_test_data.json" with {type: 'json'};

const patientRouter = express.Router();
patientRouter
  .route("/")
  .get((req, res) => {
    //get all patient personal information
    /*
    structure data: 
    [
      {
        id: INT,
        first_name: String, 
        last_name: String, 
        gender: String,
        birth_date: "DD/MM/YYYY",
        contact_number: String, 
        home_address: String
      }
    ]
    */
    try {
      res.status(200).json(patientData);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  })
  .post((req, res) => {
    //register new patient
  });

patientRouter
  .route("/:patientId")
  .get((req, res) => {
    //get specific patient's personal information
    /*
    structure data: 
      {
        id: INT,
        first_name: String, 
        last_name: String, 
        gender: String,
        birth_date: "DD/MM/YYYY",
        contact_number: String, 
        home_address: String
      }
    */
    try {
      const patientId = req.params.patientId;
      let result; 
      if (!patientId) {
        res
          .status(400)
          .send({ error: "not include patient id to get patient data" });
      }
      for (let i = 0; i < patientData.length; ++i) {
        if (patientData[i].id === Number(patientId)) {
          result = patientData[i];
          res.status(200).json(result);
        }
      }
          if(!result){
      res
        .status(404)
        .json({ error: "cannot find patient data or input is invalid" });
          }
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  })
  .put((req, res) => {
    //update specific patient's personal information
  });

patientRouter.route("/:patientId/diagnosis").get((req, res) => {
  //get all diagnosis data of specific patient
  /*
  structure data:
  [
      {
        diagnosis_id: INT,
        patient_id: INT, 
        doctor_id: INT, 
        diagnosis_date: "DD/MM/YYYY",
         condition: [
      {
        code: String, 
        name: String, 
        description: String, 
        diagnosis_note: String
      }
    ],
    doctor_note: JSON
        
      }
    ]
  */
  try {
    const patientId = req.params.patientId;
    let result = [];
    
    result = patientDiagnosisData.filter((item)=>{
      return item.patient_id == patientId;
    }) 
    if(result.length === 0){
      res.status(404).json({error: "this patient don't have diagnosis data"});
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});
patientRouter.route("/:patientId/diagnosis/:diagnosisId").get((req, res) => {
  //get specific diagnosis data of specific patient
  /*
  structure data:
  {
    diagnosis_id: INT, 
    condition: [
      {
        code: String, 
        name: String, 
        description: String, 
        Diagnosis_note: String
      }
    ],
    doctor_note: JSON
  }
  */
  try {
    let result;
    const patientId = req.params.patientId;
    const diagnosisId = req.params.diagnosisId;
    if (!patientId) {
      res
        .status(400)
        .send({ error: "not include patient id to get patient data" });
    }
    for (let i = 0; i < patientDiagnosisData.length; ++i) {
      if (
        patientDiagnosisData[i].diagnosis_id == Number(diagnosisId) &&
        patientDiagnosisData[i].patient_id === Number(patientId)
      ) {
        result = patientDiagnosisData[i];
        res.status(200).json(result);
      }
    }
    if(!result){
    res
      .status(404)
      .json({
        error: "cannot find patient diagnosis data or input is invalid",
      });

    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});
patientRouter.route("/:patientId/testings").get((req, res) => {
  try{
  let result = [];
  const patientId = req.params.patientId;
  result = patientTestingData.filter((item)=>{
    return item.patient_id == patientId;
  }) 

  res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }})
export default patientRouter;
