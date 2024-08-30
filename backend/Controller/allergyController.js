import { poolDoctors, poolNurses, poolFrontDesk, poolBusinessOfficers, poolHR } from "../Models/dbConnectionConfiguration.js";

const doctorRepo = poolDoctors;

export async function getAllAllergy(req, res){
    try {
        const user_info = req.user_info
        if (user_info === 'Doctor'){
            doctorRepo.GetAllAllergies()
        }
        else {
            res.status(403).json({message: error.message})
        }
       //verify job role = doctor
       //return data
       /*
       data structure: 
       [
        id,
        icd9_code: String, 
        name: String,
        group: String, // Anh nghĩ ko cần cái này. Cái này chỉ để cho selection list nên id với name là đủ
        allergent: String, // Anh nghĩ ko cần cái này. Cái này chỉ để cho selection list nên id với name là đủ
        type: String // Anh nghĩ ko cần cái này. Cái này chỉ để cho selection list nên id với name là đủ
       ]
       */
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}