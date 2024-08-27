export async function getAllDepartment(req, res) {
  try {
    //verify job role = HR
    //return data
    /*
       data structure: 
       [
       {
        id: INT, 
        name: String, 
        manager_id: INT ??
       }
    ]
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
