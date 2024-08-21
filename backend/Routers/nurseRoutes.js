const express = require('express');
const router = express.Router();

router.get('/nurse/:id/personal_information', (req, res) => {
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

router.get('/nurse/patients', (req, res) => {
    const patientsMedicalInfo = [{
        id,
        full_name,
        birth_date,
        gender,
        allergies: ["Nut Allergy", "Insulin Allergy"]
    }]
    res.send(patientMedicalInfo);
})

router.get('/nurse/patient/:id/diagnosis', (req, res) => {
    const condition = {
        condition_name,
        condition_description
    }
    const diagnoses = [{
        diagnosis_id,
        doctor_name,
        diagnosis_date,
        diagnosis_note,
        conditions: [condition, condition, condition, condition]

     }]
     res.send(diagnoses)
})

router.get('/nurse/patient/:id/prescription', (req, res) => {
    const medicine = {
        medicine_name,
        medicine_quantity,
        medicine_unit
    }
    const prescriptions = [{
        prescription_id,
        doctor_name,
        prescription_date,
        prescription_note,
        medicines: [medicine, medicine, medicine, medicine]

     }]
     res.send(prescriptions)
})

router.get('/nurse/patient/:id/tests', (req, res) => {
    const test = {
        test_name,
        test_date,
        administering_staff_name,
        lab_result_detail
    }
    const test_orders = [{
        test_id,
        ordering_doctor_name,
        ordering_date,
        tests: [test, test, test, test, test]

     }]
     res.send(test_orders)
})

router.put('/doctor/update_test', (req, res) => {
    const {
        test_order_id,
        test_type_id,
        administering_staff_id,
        lab_result_detail
    } = req.body
})