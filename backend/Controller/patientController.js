import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";
import frontDeskRepo from "../Models/FrontDeskModel.js";
import businessOfficerRepo from "../Models/BusinessOfficerModel.js";

export async function getAllPatientInfo(req, res) {
  try {
    const user_info = req.user;
    let result;

    if (user_info.role === 'Doctor') {
      result = await doctorRepo.GetPatientsInfo(user_info.id, req.query.patientName);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.GetPatientsInfo(req.query.patientName);
    } else if (user_info.role === 'FrontDesk') {
      result = await frontDeskRepo.GetPatientsInfo(req.query.patientName);
    } else if (user_info.role === 'BusinessOfficer') {
      result = await businessOfficerRepo.GetPatientsInfo(req.query.patientName);
    } else {
      return res.status(403).json({ message: "Incorrect role" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function registerNewPatient(req, res) {
  try {
    const user_info = req.user;
    const {
      full_name,
      gender, // Convert Male/Female to M/F before inserting into the database
      birth_date, // Convert DD/MM/YYYY to YYYY-MM-DD before inserting into the database
      phone_number,
      home_address
    } = req.body;

    if (user_info.role === 'FrontDesk') {
      await frontDeskRepo.AddNewPatients(full_name, gender, birth_date, phone_number, home_address);
      return res.status(200).json({ message: "Patient registered successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function updateSpecificPatientInfo(req, res) {
  try {
    const patient_id = req.params.patientId;
    const user_info = req.user;
    const {
      full_name,
      gender, // Convert Male/Female to M/F before inserting into the database
      birth_date, // Convert DD/MM/YYYY to YYYY-MM-DD before inserting into the database
      phone_number,
      home_address
    } = req.body;

    if (user_info.role === "FrontDesk") {
      await frontDeskRepo.UpdatePatientsInfo(patient_id, full_name, gender, birth_date, phone_number, home_address);
      return res.status(200).json({ message: "Patient info updated successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getSpecificPatientAllDiagnosis(req, res) {
  try {
    const patient_id = req.params.patientId;
    const user_info = req.user;
    const from_date = req.query.from;
    const to_date = req.query.to;

    let result;
    if (user_info.role === 'Doctor') {
      result = await doctorRepo.FetchDiagnosesByPatientId(patient_id, from_date, to_date);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.FetchDiagnosesByPatientId(patient_id, from_date, to_date);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function addSpecificPatientDiagnosis(req, res) {
  try {
    const user_info = req.user;
    const { diagnosis_note, conditions } = req.body;

    if (user_info.role === 'Doctor') {
      const doctor_id = user_info.id;
      const patient_id = req.params.patientId;
      const conditions_string = conditions.join(",");
      await doctorRepo.AddNewDiagnosis(doctor_id, patient_id, diagnosis_note, conditions_string);
      return res.status(200).json({ message: "Diagnosis added successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getSpecificPatientAllAllergies(req, res) {
  try {
    const patient_id = req.params.patientId;
    const user_info = req.user;

    let result;
    console.log("REceived")
    if (user_info.role === 'Doctor') {
      result = await doctorRepo.GetPatientsAllergies(patient_id);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.GetPatientsAllergies(patient_id);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function addSpecificPatientAllergy(req, res) {
  try {
    const user_info = req.user;
    const {allergies} = req.body;

    if (user_info.role === 'Doctor') {
      const doctor_id = user_info.id;
      const patient_id = req.params.patientId;
      const allergies_string = allergies.join(",");
      await doctorRepo.AddAllergyToPatient(doctor_id, patient_id, allergies_string);
      return res.status(200).json({ message: "Allergies added successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}