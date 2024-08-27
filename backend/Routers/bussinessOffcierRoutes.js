const express = require('express');
const router = express.Router();
const businessOfficerRoutes = express.Router();


router.get('/businessofficer/:id/personal_information', (req, res) => {
    const staff_personal_info = {
        full_name, 
        ssn,
        department_name,
        job_name,
        manager_name,
        gender,
        birth_date,
        home_address,
        email,
        wage,
        hire_date,
        employment_type,
        employment_document
    }
    res.send(staff_personal_info)
})

router.get("/businessofficer/billings", (req, res) => {
    const billings = [{

    }]
})

router.get("/businessofficer/new_bill", (req, res) => {
    const bills = [{
        id,
        patient_name,
        billing_date,
        total_amount,
        appointment_id,
        test_order_id,
        prescription_id
    }]
    res.send(bills)
})

router.post("/businessofficer/bill_detail", (req, res) => {
    const {
        appointment_id,
        prescription_id,
        test_order_id
    } = req.body

    const prescription_detail = {
        drug_name,
        quantity,
        price
    }

    const test_detail = {
        test_name,
        price
    }

    const appointment = {
        appointment_date,
        appointment_charge,
        appointment_duration
    }

    const resultSet = {
        prescriptions: [prescription_detail, prescription_detail, prescription_detail],
        tests: [test_detail, test_detail, test_detail],
        appointment_detail: appointment
    }
    res.send(resultSet)
})

router.post("/businessofficer/new_bill", (req, res) => {
    const {
        appointment_id,
        prescription_id,
        test_order_id
    } = req.body
})

module.exports = businessOfficerRoutes;