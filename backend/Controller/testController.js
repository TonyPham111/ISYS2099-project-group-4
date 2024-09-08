import { getAllImagesWithLabResult, createNewLabResultDocument } from "../MongodbRepo/Methods.js";
import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";
import mongoose from "mongoose";

export async function getAllTests(req, res) {
  try {
    const user_info = req.user;
    const patient_id = req.params.patientId;
    const from_date = req.query.from;
    const to_date = req.query.to;

    let result;
    if (user_info.role === 'Doctor') {
      result = await doctorRepo.FetchTestDetailsByPatientId(patient_id, from_date, to_date);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.FetchTestDetailsByPatientId(patient_id, from_date, to_date);
    } else {
      return res.status(403).json({ message: "Incorrect role" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getLabResults(req, res) {
  try {
    const lab_result_id = req.params.labDocumentId;
    const lab_result = await getAllImagesWithLabResult(lab_result_id);
    return res.status(200).json(lab_result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function createNewTestOrders(req, res) {
  try {
    const user_info = req.user;
    const { administering_date, administering_time, tests } = req.body;

    if (user_info.role === 'Doctor') {
      const patient_id = req.params.patientId;
      const test_string = tests.join(",");
      await doctorRepo.OrderTest(user_info.id, patient_id, administering_date, administering_time, test_string);
      return res.status(200).json({ message: "Tests ordered successfully" });
    } else {
      return res.status(403).json({ message: "Incorrect role" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function updateLabResult(req, res) {
  const transaction = await mongoose.startSession()
  try {
    transaction.startTransaction();
    const user_info = req.user;
    const files = req.files;

    if (!files || !files.lab_result_name || !files.test_image_name) {
      return res.status(400).json({ message: "Missing required files" });
    }
    

    const pdfFile = files.lab_result_name[0];
    const imageFiles = files.test_image_name;
    const sampleImages = [];

    imageFiles.forEach(imageFile => {
      sampleImages.push({
        file_name: imageFile.originalname,
        file: imageFile.buffer
      });
    });

    const pdfFileObject = {
      file_name: pdfFile.originalname,
      file: pdfFile.buffer
    };

    const newLabDocument = await createNewLabResultDocument(pdfFileObject, sampleImages, {transaction});
    
    if (user_info.role === 'Nurse') {
      await nurseRepo.UpdateTestDetail(
        req.params.patientId,
        req.params.testOrderId,
        req.params.testTypeId,
        user_info.id,
        newLabDocument._id.toString()
      );
      await transaction.commitTransaction()
      return res.status(200).json({ message: "Successful" });
    } else {
      return res.status(403).json({ message: "Incorrect role" });
    }
  } catch (error) {
    await transaction.abortTransaction()
    return res.status(500).json({ message: error.message });
  } finally {
    transaction.endSession()
  }
}