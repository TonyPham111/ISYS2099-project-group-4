const businessOfficerRepo = require('../Models/BusinessOfficerModel')
export async function getAllBillings(req, res) {
  try {
        const user_info = req.user
        if (user_info === 'BusinessOfficers'){
            businessOfficerRepo.GetAllBillings()

            /*
                Kết quả trả về: {
                    id,
                    patient_id,
                    billing_date
                    total_amount
                }
            */
        }
        else {
            res.status(403).json({message: error.message})
        }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBillingDetail(req, res) {
    try {
        const user_info = req.user
        const billing_id = req.params.billing_id
        if (user_info.role === 'BusinessOfficer'){
            businessOfficerRepo.GetBillingDetail(billing_id)
            /*
                kết quả trả về {
                    appointment: {
                        appointment_charge
                    },
                    prescription:[{
                        drug_code,
                        drug_name,
                        price,
                        quantity
                    }]
                    test: [{
                        test_type_id,
                        test_name,
                        price
                    }]
                
                }
            */
        }
        else {
            res.status(403).json({message: error.message})
        }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

export async function createNewBilling(req, res) {
  try {
    const user_info = req.user
    const {
        patient_id,
        appointment_id,
        prescription_id,
        test_id
    } = req.body
    if (user_info.role === 'BusinessOfficer'){
        businessOfficerRepo.CreateNewBilling(patient_id, appointment_id, prescription_id, test_id)
    }
    else {
        res.status(403).json({message: error.message})
    }
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}