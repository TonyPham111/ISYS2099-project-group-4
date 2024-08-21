const express = require('express');
const router = express.Router();

router.post("/hr/add_new_staff", (req, res) => {
    const {
        full_name,
        ssn,
        department_name,
        job_name,
        manager_name,
        birth_date,
        gender,
        phone_number,
        home_address,
        email,
        staff_password,
        wage,
        employment_type,
        employment_document_id
    } = req.body
})

router.get("/hr/staff", (req, res) => {
    const staff = [{
        full_name,
        manager_name,
        job_name,
        department_name,
        birth_date,
        gender,
        phone_number,
        home_address,
        email,
        staff_password,
        wage,
        hire_date,
        employment_type,
        employment_status,
        employment_documents
    }]

    res.send(staff);


})

router.post("/hr/change_wage", (req, res) => {
    const {
        staff_id,
        new_wage
    } = req.body
})

router.post("/hr/change_job", (req, res) => {
    const {
        staff_id,
        new_job_id
    } = req.body
})

router.post("/hr/change_personal_information", (req, res) => {
    const {
        staff_id,
        email,
        staff_password,
        phone_number,
        home_address
    } = req.body
})