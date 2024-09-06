import {getAllImagesWithLabResult, createNewLabResultDocument } from "../MongodbRepo/Methods.js";
import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";

export async function getAllTests(req, res) {
  try {
    const user_info = req.user
    const patient_id = req.params.patientId
    const from_date = req.query.from
    const to_date = req.query.to
    if (user_info.role === 'Doctor'){
      const result = await doctorRepo.FetchTestDetailsByPatientId(patient_id, from_date, to_date)
      res.status(200).json(result)
    }
    else if (user_info.role === 'Nurse'){
      const result = await nurseRepo.FetchTestDetailsByPatientId(patient_id, from_date, to_date)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getLabResults(req, res){
  try {
    const lab_result_id = req.params.labDocumentId
    const lab_result = await getAllImagesWithLabResult(lab_result_id)
    res.send(lab_result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createNewTestOrders(req, res) {
  try {
    const user_info = req.user
    const {
        administering_date,
        administering_time,
        tests
    } = req.body

    if (user_info.role === 'Doctor'){
      const patient_id = req.params.patientId
      const test_string = tests.join(",");
      await doctorRepo.OrderTest(user_info.id, patient_id, administering_date, administering_time, test_string)
      res.status(200).json({ message: "Tests ordered successfully" })
    }
    else {
      res.status(403).json({ message: "Incorrect role" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateLabResult(req, res) {
    try {
      const user_info = req.user
      const files = req.files;
      let pdfFile = files.lab_result_name[0];
      let imageFiles = files.test_image_name;
      const sampleImages = []
      for (let i = 0; i < imageFiles.length; i++){
        const sampleImage = {
          file_name,
          file
        }
        sampleImage.file_name = imageFiles[i].originalname
        sampleImage.file = imageFiles[i].buffer
        sampleImages.push(sampleImage)
      }    
      const newLabDocument = await createNewLabResultDocument(pdfFile, sampleImages)
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
