import { poolDoctors, poolNurses, poolFrontDesk, poolBusinessOfficers, poolHR } from "../Models/dbConnectionConfiguration.js";

const doctorRepo = poolDoctors;
const nurseRepo = poolNurses;
const frontDeskRepo = poolFrontDesk;
const businessOfficerRepo = poolBusinessOfficers;
const hrRepo = poolHR;


export async function getAllDepartment(req, res) {
  try {
    const user_info = req.user_info
    if (user_info === 'HR'){
        doctorRepo.GetAllAllergies()
    }
    else {
        res.status(403).json({message: error.message})
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
