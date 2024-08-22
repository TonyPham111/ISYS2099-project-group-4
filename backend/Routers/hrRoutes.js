const express = require('express');
const router = express.Router();

//http protol 5 types: GET, POST, PUT, PATCH, DELETE

//This handle the request to add new staff
router.post("/hr/add_new_staff", (req, res) => {
    //Structure of an employment document
    //_id
    // encoded string of employment contract
    // qualifications: [qualification]

    //provider_name
    //date
    //certificate (encoded string)
    const {
        personal_info,
        employment_document_info
    } = req.body


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
    } = personal_info

    const qualification_info = {
        provider,
        date,
        certificate //either blob or encoded string
    }
    const {
        _id,
        employment_contract, //either blob or encoded string
        qualifications: [] //containing qualification info objects
    } = employment_document_info
    
})

//This will return a list of staff to the client
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

//This will receive the staff id in the request body and change the wage of the staff
router.post("/hr/change_wage", (req, res) => {
    const {
        staff_id,
        new_wage
    } = req.body
})

// This receives the staff id, the name of the new manager, the new wage, the new job and the new department (Nullable) to change the job of the staff
router.post("/hr/change_job", (req, res) => {
    const {
        staff_id,
        new_job_id,
        new_wage,
        new_manager_name,
        new_department_name
    } = req.body
})

//This receives the staff id, the name of the new manager, and the name of the new department to change the department of the staff
router.post("/hr/change_department", (req, res) => {
    const {
        staff_id,
        new_manager_name,
        new_department_name
    } = req.body
})

//This changes personal information of a staff
router.post("/hr/change_personal_information", (req, res) => {
    const {
        staff_id,
        email,
        staff_password,
        phone_number,
        home_address
    } = req.body
})

//This shows all wage changes of the staff of the given id
router.post("/hr/fetch_wage_history", (req, res) => {
    const {
        staff_id
    } = req.body

    const wage_change = {
        old_wage,
        new_wage,
        date_change
    }

    const wage_history = {
        staff_name,
        wage_changes: [wage_change, wage_change, wage_change, wage_change]
    }

    res.send(
        wage_history
    )


})

//This shows all past job movement of a staff with a given in
router.post("/hr/fetch_job_history", (req, res) => {
    const {
        staff_id
    } = req.body

    const job_change = {
        old_job_name,
        new_job_name,
        date_change
    }

    const wage_history = {
        staff_name,
        wage_changes: [job_change, job_change, job_change, job_change]
    }

    res.send(
        job_history
    )


})

//This shows all past movement between departments of a staff with a given id
router.post("/hr/fetch_department_history", (req, res) => {
    const {
        staff_id
    } = req.body

    const department_change = {
        old_department_name,
        new_department_name,
        date_change
    }

    const department_change_history = {
        staff_name,
        wage_changes: [department_change, department_change, department_change, department_change]
    }

    res.send(
        department_change_history
    )


})