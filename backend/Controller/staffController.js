const hrRepo = require('../Models/HrModel')
const doctorRepo = require('../Models/DoctorModel')
const nurseRepo = require('../Models/NurseModel')
const frontDeskRepo = require('../Models/FrontDeskModel')
const businessOfficerRepo = require('../Models/BusinessOfficerModel')

export async function getAllStaffsInfo(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === "Doctor"){
        doctorRepo.GetSubordinates(user_info.id)
    }
    else if (user_info.role === "Nurse"){
        nurseRepo.GetSubordinates(user_info.id)
    }
    else if (user_info.role === "FrontDesk"){
        frontDeskRepo.GetSubordinates(user_info.id)
    }
    else if (user_info.role === "BusinessOfficer"){
        businessOfficerRepo.GetSubordinates(user_info.id)
    }
    else if (user_info.role === "HR") {
        hrRepo.getAllStaffsInfo()
    }
    else {
        res.status(403).json({message: error.message})
    }
    
    //return all staff data
    //OR for loop
    //return staff data IN condtion:
    //conditon : staff.manager_id == req user.id
    //return data
    /*
       data structure: 
       [
        [
           {
             "id": INT,
             "manager_id": INT, //HR only
             "full_name": String,
             "department": String --> department_name,
             "job": String --> job_name,
             "gender": String,
             "birth_date": String --> "DD/MM/YYYY",
             "home_address": String, // HR only
             "contact_phone_number": String, 
             "email": String, 
             "wage": DECIMAL(6, 2), // HR only
             "hire_date": String --> "DD/MM/YYYY", // HR only
           },
       ]
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addNewStaff(req, res) {
  try {
    const user_info = req.user
    const {
      full_name,
      manager_id,
      department_id,
      job_id,
      gender,
      birth_date,
      home_address,
      contact_phone_number,
      email,
      password,
      wage,
      qualification_lists
    } = req.body
    
    const qualification_document_id = '';

    if (user_info.role === 'HR'){
        hrRepo.AddNewStaff(full_name, job_id, department_id, manager_id, gender, birth_date, home_address, contact_phone_number, email, password, wage, qualification_document_id)
    }
    else {
        res.status(403).json({message: error.message})
    }
    //verify job role = HR
    /*
    input data: 
    - "manager_id": INT,
    - "full_name": String,
    - "department_id": INT,
    - "job_id": INT,
    - "gender": String,
    - "birth_date": String --> "DD/MM/YYYY",
    - "home_address": String, 
    - "contact_phone_number": String, 
    - "email": String, 
    - "wage": DECIMAL(6, 2),
    - "hire_date": String --> "DD/MM/YYYY",

    */
    //return add new staff status
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getStaffPersonalInfo(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === "Doctor"){
      doctorRepo.FetchStaffInfoById(user_info.id)
  }
  else if (user_info.role === "Nurse"){
      nurseRepo.FetchStaffInfoById(user_info.id)
  }
  else if (user_info.role === "FrontDesk"){
      frontDeskRepo.FetchStaffInfoById(user_info.id)
  }
  else if (user_info.role === "BusinessOfficer"){
      businessOfficerRepoRepo.FetchStaffInfoById(user_info.id) 
  }
  else if (user_info.role === "HR") {
      hrRepo.FetchStaffInfoById(user_info.id)
  }
  else {
      res.status(403).json({message: error.message})
  }
    /*
       data structure: 
           {
             "id": INT,
             "manager_id": INT,
             "full_name": String,
             "department": String --> department_name,
             "job": String --> job_name,
             "gender": String,
             "birth_date": String --> "DD/MM/YYYY",
             "home_address": String, 
             "contact_phone_number": String, 
             "email": String, 
             "wage": DECIMAL(6, 2),
             "hire_date": String --> "DD/MM/YYYY",
           },
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateStaffPersonalInfo(req, res) {
  try {
    const user_info = req.user
    const staff_id = req.params.staffId
    const {
        home_address,
        phone_number,
        email,
        password
    } = req.body
    if (user_info.role === 'HR'){
      hrRepo.ChangeStaffPersonalInfo(staff_id, phone_number, email, password, home_address)
    }
    else {
      res.status(403).json({message: error.message})
    }
    //verify job role = HR
    /*
       data structure: 
           {
             "home_address": String, 
             "contact_phone_number": String, 
             "email": String, 
             "password": String
           },
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateStaffWage(req, res){

}

export async function updateStaffJob(req, res){

}

export async function updateStaffDepartment(req, res){

}

export async function schedule(req, res){

}

export async function getStaffSchedule(req, res) {
  try {
    //verify staff id have manager_id == req user.id
    //return data
    /*
    data structure: 
    {
      "staff_id": INT,
      "staff_schedule": [
        {
          "id": 1,
          "date": "01/07/2024",
          "start_time": "08:00:00",
          "end_time": "17:00:00"
        }
      ],
      "staff_appointment": [
         {
             "id": INT,
             "purpose_of_appointment": String,
             "patient_id": INT,
             "doctor_id": INT,
             "date": String --> "DD/MM/YYYY",
             "start_time": String --> "HH:mm:ss",
             "end_time": String --> "HH:mm:ss",
             "before_note": JSON in tiptap format,
             "during_note": JSON in tiptap format,
             "after_note": JSON in tiptap format,
         },
      ]
    },
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSpecificStaffSchedule(req, res) {
  try {
    //verify staff id have manager_id == req user.id
    /*
    update data: 
    - deleted schedule --> array of schedule id
    -- add schedule 
    ---> ARRAY [schedule_input]
    schedule input:
     {
        "start_time": String --> "HH:mm:ss",
        "end_time": String --> "HH:mm:ss",
        attachments: [
            BLOB?
            text?
        ]?
     }
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
