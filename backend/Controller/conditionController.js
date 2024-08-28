const doctorRepo = require('../Models/DoctorModel')
export async function getAllCondition(req, res) {
  try {
    const user_info = req.user_info
    if (user_info === 'Doctor'){
        doctorRepo.getAllCondition()
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
