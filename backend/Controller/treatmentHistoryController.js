import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";

export async function getAllTreatmentHistory(req, res) {
  try {
    const user_info = req.user;
    const { patientId } = req.params;
    const { from, to } = req.query;

    let result;
    if (user_info.role === 'Doctor') {
      result = await doctorRepo.FetchPrescriptionsByPatientId(patientId, from, to);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.FetchPrescriptionsByPatientId(patientId, from, to);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function createNewTreatment(req, res) {
  try {
    const user_info = req.user;
    const {diagnosis_id, prescription_note, medicines } = req.body;

    if (user_info.role === 'Doctor') {
      const doctor_id = user_info.id;

      // Create the medicines string in the format drug_code:quantity
      const medicines_string = medicines
        .map(medicine => `${medicine.drug_code}:${medicine.quantity}`)
        .join(",");
      console.log(medicines_string)
      // Call the repository method to add the new treatment
      await doctorRepo.AddNewPrescription(doctor_id, req.params.patientId, diagnosis_id, prescription_note, medicines_string);

      return res.status(200).json({ message: "Treatment added successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}