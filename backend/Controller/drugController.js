export async function getAllDrug(req, res) {
  try {
    //verify job role = doctor
    //return data
    /*
       data structure: 
       [
        {
            drug_code: INT,
            drug_name: String,
            inventory: INT,
            unit: String,
            price_per_unit: DECIMAL(6, 2)
        }
       ]
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
