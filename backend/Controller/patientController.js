export async function getAllPatientInfo(req, res) {
  try {
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

export async function getSpecificPatientInfo(req, res) {
  try {
    //verify job role = (doctor ||| nurse || hr || frontdesk || business officer)
    //return data
    /*
       data structure: 
         {
           "id": INT,
           "full_name": String,
           "gender": String --> from ENUM (Female, Male),
           "birth_date": "String --> "DD/MM/YYYY",
           "contact_phone_number": String, [only frontdesk]
           "home_address": String, [only frontdesk]
         },
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSpecificPatientInfo(req, res) {
  try {
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
    // verify job role = doctor
    /*
    input data: 
    - "patient_id": INT,
    - "doctor_id": INT, 
    - "diagnosis_date": String --> "DD/MM/YYYY",
    - condition: Array[condition_code] --> array length atleast be 1
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSpecificPatientAllAllergies(req, res) {
  try {
    //verify job role = (doctor || nurse)
    //return data
    /*
    data structure: idk
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addSpecificPatientAllergy(req, res) {
  try {
    // verify job role = doctor
    /*
    input data: idk
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
