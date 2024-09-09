import hrRepo from "../Models/HrModel.js"

export async function getAllDepartments(req, res) {
  try {
    const user_info = req.user;
    // console.log(`check userinfo: ${JSON.stringify(user_info)}`)
    if (user_info.role == 'HR'){
      console.log(`check in userinfo = HR`);
      const result = await hrRepo.getAllDepartments();
      console.log(`check result: ${JSON.stringify(result)}`);
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
