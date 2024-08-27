export async function getAllCondition(req, res) {
  try {
    //verify job role = doctor
    //return data
    /*
        data structure: 
        [
            {
               code: String,
               name: String,
               description: String
            }
        ]
        */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
