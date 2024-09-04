import hrRepo from "../Models/HrModel.js"

export async function getAllDepartments(req, res) {
  try {
    const user_info = req.user_info
    if (user_info === 'HR'){
      const result = await hrRepo.getAllDepartments()
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: error.message })
    }
    //verify job role = HR
    //return data
    /*
       data structure: 
       [
       {
        id: INT, 
        name: String, 
        manager_id: INT ?? // cái này không cần em nha
       }
    ]
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
