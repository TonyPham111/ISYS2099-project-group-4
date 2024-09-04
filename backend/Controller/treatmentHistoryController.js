import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";

export async function getAllTreatmentHistory(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === 'Doctor'){
      const result = await doctorRepo.FetchPrescriptionsByPatientId(req.params.patientId)
      res.status(200).json(result)
    }
    else if (user_info.role === 'Nurse'){
      const result = await nurseRepo.FetchPrescriptionsByPatientId(req.params.patientId)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
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
        treatment_end_date,
        prescription_note,
        medicines
    } = req.body

    if (user_info.role === 'Doctor'){
      const doctor_id = user_info.id
      const medicines_string = medicines.map(medicine => `${medicine.drug_code}:${medicine.quantity}`).join(",")
      await doctorRepo.AddNewPrescription(
        doctor_id, patient_id, diagnosis_id, treatment_end_date, prescription_note, medicines_string
      )
      res.status(200).json({ message: "Treatment added successfully." })
    }
    else {
      res.status(403).json({ message: error.message })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
