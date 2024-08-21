const express = require('express');
const router = express.Router();

router.get('/doctor/:id/personal_information', (req, res) => {
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

router.get('/doctor/patients', (req, res) => {
    const patientsMedicalInfo = [{
        id,
        full_name,
        birth_date,
        gender,
        allergies: ["Nut Allergy", "Insulin Allergy"]
    }]
    res.send(patientMedicalInfo);
})

router.get('/doctor/patient/:id/diagnosis', (req, res) => {
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

router.get('/doctor/patient/:id/prescription', (req, res) => {
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

router.get('/doctor/patient/:id/tests', (req, res) => {
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

router.post('/doctor/new_prescription', (req, res) => {
    const {
        doctor_id, 
        patient_id, 
        diagnosis_id, 
        treatment_endtime, 
        prescription_note,
        prescription_details: {
            //medicine name as key and quantity as value
            medicine_1,
            medicine_2,
            medicine_3

        }
     } = req.body
})


router.post('/doctor/new_diagnosis', (req, res) => {
    const {
        doctor_id, 
        patient_id,
        diagnosis_date,
        diagnosis_note, 
        prescription_note,
        diagnosis_detail: [condition_name1, condition_name2, condition_name3]
} = req.body
})


router.post('/doctor/order_test', (req, res) => {
    const {
        patient_id,
        doctor_id,
        test_order_date,
        administering_date,
        administering_time,
        test_details : [test_name1, test_name2, test_name3, test_name4]
    } = req.body   
})

router.get('/doctor/personal_schedule', (req,res) => {
    const schedule_appointments = [
        {
            schedule_date,
            start_time,
            end_time,
            appointment_purpose,
            appointment_notes,
            patient_id,
            patient_name,
            patient_gender,
            patient_birth_date
        }
    ]

    res.send(schedule_appointments)
})

router.put('/doctor/update_test', (req, res) => {
    const {
        test_order_id,
        test_type_id,
        administering_staff_id,
        lab_result_detail
    } = req.body
})