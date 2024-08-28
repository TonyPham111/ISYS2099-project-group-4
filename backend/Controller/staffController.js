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
             "department": String --> department_name, //HR only
             "job": String --> job_name, // HR only
             "gender": String,
             "birth_date": String --> "DD/MM/YYYY", The database will return YYYY-MM-DD. Please convert it back to DD/MM/YYY
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

    // Object qualification sẽ có dàng {title, provider, date, file (blob)} 
    // qualification_list sẽ được lưu vào mongodb
    
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
    - "hire_date": String --> "DD/MM/YYYY", // Anh bỏ hire date vì database sẽ mặc định là ngày hiện tại

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
             "hire_date": String --> "DD/MM/YYYY", Database will return YYYY-MM-DD. Convert it to DD/MM/YYYY
           },
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Anh đổi tên controller này vì nó chỉ đc dùng để update personal info thôi
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

// Anh vừa thêm cái này vào để thay đổi wage của staff
export async function updateStaffWage(req, res){
  try{
      const user_info = req.user
      const staff_id = req.params.staffId
      const {
        new_wage
      } = req.body
      if (user_info === 'HR'){
          hrRepo.ChangeWage(staff_id, new_wage)
      }
      else {
        res.status(403).json({message: error.message})
      }
  } catch(error){
    res.status(500).json({message: error.message})
  }
}

//Anh vừa thêm cái này vào để xem lịch sử thay đổi lương của staff
export async function getWageChangeHistory(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    if (user_info === 'HR'){
        hrRepo.FetchWageChangeByStaffId(staff_id)
        /* trả về 1 array:
          [{old_wage, 
          new_wage, 
          date_change}]
        */
    }
    else {
      res.status(403).json({message: error.message})
    }
} catch(error){
  res.status(500).json({message: error.message})
}
}


//Anh vừa thêm cái này vào để thay đổi job của staff
export async function updateStaffJob(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    const {
      new_job,
      new_wage,
      new_manager_id,
      new_department_id

    } = req.body
    if (user_info === 'HR'){
        hrRepo.ChangeJob(staff_id, new_job, new_wage, new_manager_id, new_department_id)
    }
    else {
      res.status(403).json({message: error.message})
    }
} catch(error){
  res.status(500).json({message: error.message})
}
}

//Anh vừa thêm cái này vào để xem lịch sử thay đổi job của staff
export async function getJobChangeHistory(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    if (user_info === 'HR'){
        hrRepo.FetchJobChangeByStaffId(staff_id)
        /* trả về 1 array:
          [{old_job_name, 
          new_job_name, 
          date_change}]
        */
    }
    else {
      res.status(403).json({message: error.message})
    }
} catch(error){
  res.status(500).json({message: error.message})
}
}

//Anh vừa thêm cái này vào để xem lịch sử thay đổi department của staff.
export async function updateStaffDepartment(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    const {
      new_manager_id,
      new_department_id

    } = req.body
    if (user_info === 'HR'){
        hrRepo.ChangeDepartment(staff_id, new_manager_id, new_department_id)
    }
    else {
      res.status(403).json({message: error.message})
    }
} catch(error){
  res.status(500).json({message: error.message})
}
}
//Anh vừa thêm cái này vào để thay đổi job của staff
export async function getDepartmentChangeHistory(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    if (user_info === 'HR'){
        hrRepo.FetchJobChangeByStaffId(staff_id)
        /* trả về 1 array:
          [{old_department_name, 
          new_department_name, 
          date_change}]
        */
    }
    else {
      res.status(403).json({message: error.message})
    }
} catch(error){
  res.status(500).json({message: error.message})
}
}


// Anh vừa add thêm cái controller này vào để manager set schedule cho nhân viên
export async function schedule(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    const {
      schedule_date,
      schedule_start_time,
      schedule_end_time,
      schedule_note
    
    } = req.body
    if (user_info === 'Doctor'){
        doctorRepo.Schedule(
          user_info.id, staff_id, schedule_date, schedule_start_time, schedule_end_time, schedule_note
        )
    }
    if (user_info === 'Nurse'){
      nurseRepo.Schedule(
        user_info.id, staff_id, schedule_date, schedule_start_time, schedule_end_time, schedule_note
      )
  }
    else if (user_info === 'FrontEnd'){
      doctorRepo.Schedule(
        user_info.id, staff_id, schedule_date, schedule_start_time, schedule_end_time, schedule_note
      )
  }
    else if (user_info === 'Doctor'){
      doctorRepo.Schedule(
        user_info.id, staff_id, schedule_date, schedule_start_time, schedule_end_time, schedule_note
      )
    }
    else if (user_info === 'Doctor'){
      doctorRepo.Schedule(
        user_info.id, staff_id, schedule_date, schedule_start_time, schedule_end_time, schedule_note
      )
    }
    else {
      res.status(403).json({message: error.message})
    }
} catch(error){
  res.status(500).json({message: error.message})
}
}


export async function getStaffSchedule(req, res) {
  const user_info = req.user
  try {
    if (user_info.role === 'Doctor'){
      doctorRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId)
    }
    else if (user_info.role === 'Nurse'){
      nurseRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId)
    }
    else if (user_info.role === 'HR'){
      hrRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId)
    }
    else if (user_info.role === 'FrontDesk'){
      frontDeskRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId)
    }
    else if (user_info.role === 'BusinessOfficer'){
      businessOfficerRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId)
    }
    else {
      res.status(403).json({message: error.message})
    }

    //verify staff id have manager_id == req user.id
    //return data
    /*
    data structure: 
    {
      "staff_id": INT,
      "staff_schedule": [
        {
          "id": 1,
          "date": "01/07/2024", Convert to "YYYY-MM-DD before sending to front end
          "start_time": "08:00:00",
          "end_time": "17:00:00"
        }
      ],
      "staff_appointment": [
         {
             "id": INT,
             "purpose_of_appointment": String,
             "patient_id": INT,
             "date": String --> "DD/MM/YYYY", Convert to "YYYY-MM-DD before sending to front end"
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


//Anh vẫn chưa hiểu. Cái procedure reschedule của anh chỉ nhận schedule id, new start time, new end time thôi
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
