const express = require('express');
const router = express.Router();

router.get('/frontdesk/:id/personal_information', (req, res) => {
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

router.get("/frontdesk/patients", (req, res) => {
    const patients = [{
        full_name,
        ssn,
        birth_date,
        gender,
        phone_number
    }]

    res.send(patients)
})

router.post("/frontdesk/new_patient", (req, res) => {
    const {
        full_name,
        ssn,
        birth_date,
        gender,
        phone_number
    } = req.body
})

router.post("/frontdesk/check_doctor_availability", (req, res) => {
    const {
        booked_date,
        booked_start_time,
        booked_end_time,
        department_name
    } = req.body

    const doctorsAvailability = {
        id,
        full_name,
        availability
    }
    res.send(doctorsAvailability)
})

router.post("/frontdesk/add_new_appointment", (req, res) => {
    //_id
    //pre_appointment_note: [cough, fever, sneeze, etc]
    //note_during_the_appointment: string
    //post_appointmnet_note: string

    const {
        doctor_id,
        patient_name,
        appointment_date,
        appointment_start_time,
        appointment_end_time,
        appointment_notes_document_id,
        symtomps_string
    } = req.body
})

router.delete("/frontdesk/cancel_appointment", (req, res) => {
    const {
        appoinment_id
    } = req.body
})

router.put("/frontdesk/reschedule", (req, res) => {
    const {
        appoinment_id,
        appointment_date,
        appointment_start_time,
        appointment_end_time
    } = req.body
})