export async function getAllTreatmentHistory(req, res) {
  try {
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
           "doctor_note": JSON in tiptap format
         }
       ],
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createNewTreatment(req, res) {
  try {
    //verify job role = doctor
    /*
    input data: 
    - patient_id: INT, 
    - doctor_id: INT, 
    - Araray[drug_data]
    ----> drug data: 
    {
       "drug_code": INT,
       "drug_name": String,  
       "quantity": INT,
       "unit": String,
       "price_per_unit": DECIMAL(6, 2)
    }
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSpecificTreatmentHistory(req, res) {
  try {
    //maybe dont need this function ?
    //verify job role = (doctor || nurse)
    /*
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
       "doctor_note": JSON in tiptap format
     }
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
