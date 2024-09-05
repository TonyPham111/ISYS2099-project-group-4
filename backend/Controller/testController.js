import {fetchLabResultsWithImagesByDocumentId, createNewLabResultDocument } from "../../database/Mongodb/Methods.js"
import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";


export async function getAllTests(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === 'Doctor'){
        doctorRepo.FetchTestDetailsByPatientId(req.params.patientId)
    }

    else if (user_info.role === 'Nurse'){
        nurseRepo.FetchPrescriptionsByPatientId(req.params.patientId)
    }

    else {
        res.status(403).json({message: error.message})
    }
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getLabResults(req, res){
  try {
    const lab_result_id = req.params.labDocumentId
    const lab_result = await fetchLabResultsWithImagesByDocumentId(lab_result_id)
    res.send(lab_result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createNewTestOrders(req, res) {
  try {
    const user_info = req.user
    const {
        patient_id,
        administering_date,
        administering_time,
        medicines: [] // [1,2,3,4,5] -> '1,2,3,4,5'
  
    } = req.body
    const test_string = ''
    if (user_info.role === 'Doctor'){
        doctorRepo.OrderTest(
          user_info.id, patient_id, administering_date, administering_time, test_string
        )
    }
    else {
      res.status(403).json({message: error.message})
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateLabResult(req, res) {
    try {
      const user_info = req.user
      const {
         lab_result_document, 
         images
      } = req.body
      const newLabDocument = await createNewLabResultDocument(req.body)
      // Create an empty lab result document here
      if (user_info.role === 'Doctor'){
          nurseRepo.UpdateTestDetail(
            req.params.testOrderId,
            req.params.testTypeId,
            user_info.id, 
            newLabDocument._id
          )
      }
      else {
        res.status(403).json({message: error.message})
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


