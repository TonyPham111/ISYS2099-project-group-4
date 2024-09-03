import { poolDoctors, poolNurses} from "../Models/dbConnectionConfiguration.js";

const doctorRepo = poolDoctors;
const nurseRepo = poolNurses;


export async function getAllTreatmentHistory(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === 'Doctor'){
        doctorRepo.FetchPrescriptionsByPatientId(req.params.patientId)
    }

    else if (user_info.role === 'Nurse'){
        nurseRepo.FetchPrescriptionsByPatientId(req.params.patientId)
    }

    else {
        res.status(403).json({message: error.message})
    }
    //const {patientId} = req.query
    //verify job role = (doctor || nurse)
    //return data
    /*
       data structure: 
       [
         {
           "treatment_id": INT,
           "date": String --> "DD/MM/YYYY",
           "doctor_id": INT,
           "patient_id": INT,
           "prescription": [
             {
               "drug_code": INT,
               "drug_name": String,  
               "quantity": INT,
               "unit": String,
               "price_per_unit": DECIMAL(6, 2)
             },
           ],
           "doctor_note": String
         }
       ],
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createNewTreatment(req, res) {
  try {
    const user_info = req.user
    const {
        patient_id,
        diagnosis_id,
        prescription_note,
        medicines: [] // Convert the array to the following form and put it to the medicines_string: 'id:quantity,id:quantity,id:quantity'
  
    } = req.body
    const medicines_string = ''
    if (user_info.role === 'Doctor'){
        doctorRepo.AddNewPrescription(
          user_info.id, patient_id, diagnosis_id, prescription_note, medicines_string
        )
    }
    else {
      res.status(403).json({message: error.message})
    }

    //verify job role = doctor
    /*
    input data: 
    - patient_id: INT, 
    - diagnosis_id: INT // Thêm cái này vào em nhé
    - prescription_note, // Thêm cái này vào em nhé
    - Araray[drug_data]
    ----> drug data: 
    {
       "drug_code": INT,
       "quantity": INT,
       // Anh bỏ 2 cái còn lại vì back end không cần
    }
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


