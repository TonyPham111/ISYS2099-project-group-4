import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";
import frontDeskRepo from "../Models/FrontDeskModel.js";
import businessOfficerRepo from "../Models/BusinessOfficerModel.js";

export async function getAllPatientInfo(req, res) {
  try {
    const user_info = req.user;
    if (user_info.role === 'Doctor'){
      const result =  await doctorRepo.GetPatientsInfo(user_info.id, req.query.patientName)
      res.status(200).json(result)
    }
    else if (user_info.role === 'Nurse'){
      const result =  await nurseRepo.GetPatientsInfo(req.query.patientName)
      res.status(200).json(result)
    }
    else if (user_info === 'FrontDesk'){
      const result = await frontDeskRepo.GetPatientsInfo(req.query.patientName)
      res.status(200).json(result)
    }
    else if (user_info === 'BusinessOfficer'){
      const result = await businessOfficerRepo.GetPatientsInfo(req.query.patientName)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({message: error.message})
    }
    //verify job role = (doctor ||| nurse || hr || frontdesk || business officer)
    //return data
    /*
       data structure: 
       [
         {
           "id": INT,
           "full_name": String,
           "gender": String --> from ENUM (Female, Male),
           "birth_date": "String --> "DD/MM/YYYY",
           "contact_phone_number": String, [only frontdesk]
           "home_address": String, [only frontdesk]
         },
       ]
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function registerNewPatient(req, res) {
  try {
    const user_info = req.user;
    const {
        full_name,
        gender, // Convert Male/Female to M/F before inserting into the database
        birth_date, //Convert DD/MM/YYYY to YYYY--MM--DD before inserting into the database
        phone_number,
        home_address
    } = req.body
    
    if (user_info.role === 'FrontDesk'){
      frontDeskRepo.AddNewPatients(full_name, gender, birth_date, phone_number, home_address)
    }
    else {
      res.status(403).json({message: error.message})
    }
    //verify job role = frontdesk
    /*
    input data: 
     "full_name": String,
     "gender": String --> from ENUM (Female, Male),
     "birth_date": "String --> "DD/MM/YYYY",
     "contact_phone_number": String, [only frontdesk]
     "home_address": String, [only frontdesk] 
    */
    //return data status if upload done or not
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSpecificPatientInfo(req, res) {
  try {
    const patient_id = req.params.patientId
    const user_info = req.user;
    const {
      full_name,
      gender, // Convert Male/Female to M/F before inserting into the database
      birth_date, //Convert DD/MM/YYYY to YYYY--MM--DD before inserting into the database
      phone_number,
      home_address
    } = req.body

    if (user_info.role === "FrontDesk"){
        frontDeskRepo.UpdatePatientsInfo(patient_id, full_name, gender, birth_date, phone_number, home_address)
    }
    else {
        res.status(403).json({message: error.message})
    }
    //verify job role = frontdesk
    /*
    update data: 
     "full_name": String,
     "gender": String --> from ENUM (Female, Male),
     "birth_date": "String --> "DD/MM/YYYY",
     "contact_phone_number": String,
     "home_address": String, 
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSpecificPatientAllDiagnosis(req, res) {
  try {
    const patient_id = req.params.patientId;
    const user_info = req.user
    const from_date = req.query.from_date
    const to_date = req.query.to_date
    if (user_info.role === 'Doctor'){
      const result = await doctorRepo.FetchDiagnosesByPatientId(patient_id, from_date, to_date)
      res.status(200).json(result)
    }
    else if (user_info.role === 'Nurse'){
      const result = await nurseRepo.FetchDiagnosesByPatientId(patient_id, from_date, to_date)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addSpecificPatientDiagnosis(req, res) {
  try {
    const user_info = req.user;
    const {
      diagnosis_note,
      conditions
    } = req.body
    
    if (user_info.role === 'Doctor'){
        const doctor_id = user_info.id
        const patient_id = req.params.patientId
        const conditions_string = conditions.join(",");
        await doctorRepo.AddNewDiagnosis(doctor_id, patient_id, diagnosis_note, conditions_string)
        res.status(200).json({ message: "Diagnoses added successfully." })
    } 
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSpecificPatientAllAllergies(req, res) {
  try {
    const patient_id = req.params.patientId;
    const user_info = req.user
    if (user_info.role === 'Doctor'){
      const result = await doctorRepo.GetPatientsAllergies(patient_id)
      res.status(200).json(result)
    }
    else if (user_info.role === 'Nurse'){
      const result = await nurseRepo.GetPatientsAllergies(patient_id)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addSpecificPatientAllergy(req, res) {
  try {
    const user_info = req.user
    const {
      allergies
    } = req.body

    if (user_info.role === 'Doctor'){
      const doctor_id = user_info.id
      const patient_id = req.params.patientId
      const allergies_string = allergies.join(",");
      await doctorRepo.AddAllergyToPatient(doctor_id, patient_id, allergies_string)
      res.status(200).json({ message: "Allergies added successfully." })
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
