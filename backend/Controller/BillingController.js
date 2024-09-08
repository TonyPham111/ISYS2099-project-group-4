import businessOfficerRepo from "../Models/BusinessOfficerModel.js";

export async function getAllBillings(req, res) {
  try {
    const user_info = req.user;

    if (user_info.role === 'BusinessOfficer') {
      const result = await businessOfficerRepo.GetAllBillings(
        req.query.patientName,
        req.query.from_amount,
        req.query.to_amount,
        req.query.from_date,
        req.query.to_date,
        req.query.sort_by,
        req.query.order_by
      );

      return res.status(200).json(result[0]);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getBillingDetail(req, res) {
  try {
    const user_info = req.user;
    const billing_id = req.params.billingId;

    if (user_info.role === 'BusinessOfficer') {
      const result = await businessOfficerRepo.GetBillingDetails(billing_id);
      return res.status(200).json(result);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function createNewBilling(req, res) {
  try {
    const user_info = req.user;
    const { patient_id, appointment_id, test_id, prescription_id } = req.body;

    if (user_info.role === 'BusinessOfficer') {
      await businessOfficerRepo.CreateNewBilling(patient_id, appointment_id, test_id, prescription_id);
      return res.status(200).json({ message: "Billing created successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}