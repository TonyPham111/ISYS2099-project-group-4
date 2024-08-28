const doctorRepo = require('../Models/DoctorModel')
const nurseRepo = require('../Models/NurseModel')
const frontDeskRepo = require('../Models/FrontDeskModel')
const businessOfficerRepo = require('../Models/BusinessOfficerModel')

export async function getAllPatientInfo(req, res) {
  try {
    const user_info = req.user;
    if (user_info.role === 'Doctor'){
      doctorRepo.GetPatientsInfo(user_info.id)
    }
    else if (user_info.role === 'Nurse'){
      nurseRepo.GetPatientsInfo()
    }
    else if (user_info === 'FrontDesk'){
      frontDeskRepo.GetPatientsInfo()
    }
    else if (user_info === 'BusinessOfficer'){
      businessOfficerRepo.GetPatientsInfo()
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
    if (user_info.role === 'Doctor'){
        doctorRepo.FetchDiagnosesByPatientId(patient_id)
        // Convert the result set to the correct format before sending to the front end
    }
    else if (user_info.role === 'Nurse'){
        nurseRepo.FetchDiagnosesByPatientId(patient_id)
        // Convert the result set to the correct format before sending to the front end
    }
    else {
        res.status(403).json({message: error.message})
    }

    //verify job role = (doctor || nurse)
    //return data
    /*
    data structure: 
    [
      {
        "diagnosis_id": INT,
        "patient_id": INT,
        "doctor_id": INT,
        "diagnosis_date": String --> "DD/MM/YYYY",
        "condition": [
          {
            "code": String,
            "name": String,
            "description": String
          },
        ],
        "doctor_note": JSON in tiptap format
      },
    ]
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addSpecificPatientDiagnosis(req, res) {
  try {
    const user_info = req.user;
    const {
      patient_id,
      diagnosis_date,
      diagnosis_note,
      conditions: [] // Transform this into a string. For example: [1,2,3,4,5] -> '1,2,3,4,5,'. Put the string into conditions_string
    } = req.body
    const conditions_string = ''
    if (user_info.role === 'Doctor'){
        const doctor_id = user_info.id
        doctorRepo.AddNewDiagnosis(doctor_id, patient_id, diagnosis_date, diagnosis_note, conditions_string)
    }
    // verify job role = doctor
    /*
    input data: 
    - "patient_id": INT,
    - "doctor_id": INT, // Cái này mình lấy từ jwt token nha em
    - "diagnosis_date": String --> "DD/MM/YYYY",
    - "diagnosis_note": Em quên cái này
    - condition: Array[condition_code] --> array length atleast be 1
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSpecificPatientAllAllergies(req, res) {
  try {
    const patient_id = req.params.patientId;
    const user_info = req.user
    if (user_info.role === 'Doctor'){
        doctorRepo.GetPatientsAllergies(patient_id)
    }
    else if (user_info.role === 'Nurse'){
        nurseRepo.GetPatientsAllergies(patient_id)
    }
    else {
      res.status(403).json({message: error.message})
  }
    //verify job role = (doctor || nurse)
    //return data
    /*
      data_structure ; [{
        allergy_name,
        allergy_type,
        allergy_group,
        allergen,
        record_date
      }]
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addSpecificPatientAllergy(req, res) {
  try {
    const user_info = req.user
    const {
      patient_id,
      allergies: [] // Convert the array to string. For example [1,2,3,4,5] to '1,2,3,4,5' and put it in the allergies_string.
    } = req.body

    const allergies_string = '';
    if (user_info.role === 'Doctor'){
        doctorRepo.AddAllergyToPatient(user_info.id, patient_id, allergies_string)
    }
    else {
        res.status(403).json({message: error.message})
    }

    // verify job role = doctor
    /*
    input data: idk
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
