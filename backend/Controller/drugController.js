import doctorRepo from "../Models/DoctorModel.js";

export async function getAllDrugs(req, res) {
  try {
    const user_info = req.user
    const {
      number_of_entries,
      starting_index
    } = req.body

    if (user_info.role === 'Doctor'){
      const result = await doctorRepo.GetAllDrugs(number_of_entries, starting_index)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
