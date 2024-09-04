import doctorRepo from "../Models/DoctorModel.js";

export async function getAllConditions(req, res) {
  try {
    const user_info = req.user

    if (user_info.role === 'Doctor'){
      const result = await doctorRepo.GetAllConditions()
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
