import { poolDoctors, poolNurses, poolFrontDesk, poolBusinessOfficers, poolHR } from "../Models/dbConnectionConfiguration.js";

const doctorRepo = poolDoctors;
const nurseRepo = poolNurses;
const frontDeskRepo = poolFrontDesk;
const businessOfficerRepo = poolBusinessOfficers;
const hrRepo = poolHR;

export async function getAllDrug(req, res) {
  try {
    const user_info = req.user_info
    if (user_info === 'Doctor'){
        doctorRepo.GetAllDrug()
    }
    else {
        res.status(403).json({message: error.message})
    }
    //verify job role = doctor
    //return data
    /*
       data structure: 
       [
        {
            drug_code: INT,
            drug_name: String,
            unit: String,
        }
       ]
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
