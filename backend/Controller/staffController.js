import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";
import frontDeskRepo from "../Models/FrontDeskModel.js";
import businessOfficerRepo from "../Models/BusinessOfficerModel.js";
import hrRepo from "../Models/HrModel.js";
import { response } from "express";
import path from "path";
import fs from "fs";

export async function getAllStaffInfo(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === "Doctor"){
      const result = await doctorRepo.GetSubordinates(user_info.id)
      res.status(200).json(result)
    }
    else if (user_info.role === "Nurse"){
      const result = await nurseRepo.GetSubordinates(user_info.id)
      res.status(200).json(result)
    }
    else if (user_info.role === "FrontDesk"){
      const result = await frontDeskRepo.GetSubordinates(user_info.id)
      res.status(200).json(result)
    }
    else if (user_info.role === "BusinessOfficer"){
      const result = await businessOfficerRepo.GetSubordinates(user_info.id)
      res.status(200).json(result)
    }
    else if (user_info.role === "HR") {
      const result = await hrRepo.FetchAllStaff(req.query.staffName, req.query.jobId, req.query.departmentId)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
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

    const qualification_list_for_server = await createNewQualificationDocument(qualification_lists)

    // Object qualification sẽ có dàng {title, provider, date, file (blob)} 
    // qualification_list sẽ được lưu vào mongodb
    
    const qualification_document_id = '';

    if (user_info.role === 'HR'){
      hrRepo.AddNewStaff(full_name, job_id, department_id, manager_id, gender, birth_date, home_address, contact_phone_number, email, password, wage, qualification_document_id)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
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
    - qualification_document_id
    - "hire_date": String --> "DD/MM/YYYY", // Anh bỏ hire date vì database sẽ mặc định là ngày hiện tại

    */
    //return add new staff status
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSubordinates(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === "Doctor"){
      doctorRepo.GetSubordinates(user_info.id)
    }
    else if (user_info.role === "Nurse"){
      nurseRepo.GetSubordinates(user_info)
    }
    else if (user_info.role === "FrontDesk"){
      frontDeskRepo.GetSubordinates(user_info)
    }
    else if (user_info.role === "BusinessOfficer"){
      businessOfficerRepo.GetSubordinates(user_info)
    }
    else if (user_info.role === "HR") {
      hrRepo.GetSubordinates(user_info)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
    /*
       data structure: 
           {
             "id": INT,
             "manager_id": INT,
             "full_name": String,
             "gender": String,
             "birth_date": String --> "DD/MM/YYYY",
             "contact_phone_number": String, 
             "email": String, 
           },
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getStaffPersonalInfo(req, res) {
  try {
    const user_info = req.user
    const staff_id = req.params.staffId
    if (user_info.role === "Doctor"){
      doctorRepo.FetchStaffInfoById(staff_id)
    }
    else if (user_info.role === "Nurse"){
      nurseRepo.FetchStaffInfoById(staff_id)
    }
    else if (user_info.role === "FrontDesk"){
      frontDeskRepo.FetchStaffInfoById(staff_id)
    }
    else if (user_info.role === "BusinessOfficer"){
      businessOfficerRepo.FetchStaffInfoById(staff_id)
    }
    else if (user_info.role === "HR") {
      hrRepo.FetchStaffInfoById(staff_id)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
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

export async function getStaffQualifications(req, res) {
  try {
    const user_info = req.user
    const staff_id = req.params.staffId
    let respnse;

    if (user_info.role === "Doctor"){
      response = await doctorRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "Nurse"){
      response = await nurseRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "FrontDesk"){
      response = await frontDeskRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "BusinessOfficer"){
      response = await businessOfficerRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "HR") {
      response = await hrRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
    fetchQualifications(response)
    
    
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
      res.status(403).json({ message: "Incorrect role." })
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
        res.status(403).json({ message: "Incorrect role." })
      }
  } catch(error){
    res.status(500).json({ message: error.message })
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
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
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
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
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
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
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
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
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
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
  }
}

export async function evaluateStaff(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    const {
      criteria_1,
      criteria_2,
      criteria_3,
      criteria_4,
      criteria_5
    } = req.body

    const criteria_string = '' //'score,score,score,score,score'

    const schedule_string = `${schedule_date};${schedule_start_time}-${schedule_end_time}`
    if (user_info.role === 'Doctor'){
      await doctorRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string)
      res.status(200).json({ message: "Successful." })
    }
    else if (user_info.role === 'Nurse'){
      await nurseRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string)
      res.status(200).json({ message: "Successful." })
    }
    else if (user_info.role === 'FrontDesk'){
      await doctorRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string)
      res.status(200).json({ message: " Successful" })
    }
    else if (user_info.role === 'HR'){
      await hrRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string)
      res.status(200).json({ message: "Successful" })
    }
    else if (user_info.role === 'BusinessOfficer'){
      await businessOfficerRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string)
      res.status(200).json({ message: "Successful" })
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
  }
}

export async function getStaffEvaluations(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    const criteria_string = '' //'score,score,score,score,score'

    const schedule_string = `${schedule_date};${schedule_start_time}-${schedule_end_time}`
    if (user_info.role === 'Doctor'){
      await doctorRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to)
      res.status(200).json({ message: "Successful." })
    }
    else if (user_info.role === 'Nurse'){
      await doctorRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to)
      res.status(200).json({ message: "Successful." })
    }
    else if (user_info.role === 'FrontDesk'){
      await doctorRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to)
      res.status(200).json({ message: " Successful" })
    }
    else if (user_info.role === 'HR'){
      await doctorRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to)
      res.status(200).json({ message: "Successful" })
    }
    else if (user_info.role === 'BusinessOfficer'){
      await doctorRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to)
      res.status(200).json({ message: "Successful" })
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
  }
}

export async function GetEvaluationDetails(req, res){
  try{
    const user_info = req.user
    const evaluation_id = req.params.evaluationId;
    if (user_info.role === 'Doctor'){
      await doctorRepo.GetEvaluationDetails(user_info.id, evaluation_id)
      res.status(200).json({ message: "Successful." })
    }
    else if (user_info.role === 'Nurse'){
      await doctorRepo.GetEvaluationDetails(user_info.id, evaluation_id)
      res.status(200).json({ message: "Successful." })
    }
    else if (user_info.role === 'FrontDesk'){
      await doctorRepo.GetEvaluationDetails(user_info.id, evaluation_id)
      res.status(200).json({ message: " Successful" })
    }
    else if (user_info.role === 'HR'){
      await doctorRepo.GetEvaluationDetails(user_info.id, evaluation_id)
      res.status(200).json({ message: "Successful" })
    }
    else if (user_info.role === 'BusinessOfficer'){
      await doctorRepo.GetEvaluationDetails(user_info.id, evaluation_id)
      res.status(200).json({ message: "Successful" })
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
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
    } = req.body

    const schedule_string = `${schedule_date};${schedule_start_time}-${schedule_end_time}`
    if (user_info.role === 'Doctor'){
      await doctorRepo.Scheduling(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule updated successfully." })
    }
    else if (user_info.role === 'Nurse'){
      await nurseRepo.Scheduling(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule updated successfully." })
    }
    else if (user_info.role === 'FrontDesk'){
      await doctorRepo.Scheduling(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule updated successfully." })
    }
    else if (user_info.role === 'HR'){
      await hrRepo.Schedule(user_info.id, staff_id, schedule_date, schedule_string)
      res.status(200).json({ message: "Schedule updated successfully." })
    }
    else if (user_info.role === 'BusinessOfficer'){
      await businessOfficerRepo.Schedule(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule updated successfully." })
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
  }
}

// Anh vừa add thêm cái controller này vào để manager set schedule cho nhân viên
export async function deleteSchedule(req, res){
  try{
    const user_info = req.user
    const staff_id = req.params.staffId
    const {
      schedule_ids
    } = req.body

    const schedule_string = schedule_ids.join(","); // Định dạng của schedule_string: '1,2,3,4,5'
    if (user_info.role === 'Doctor'){
      await doctorRepo.DeleteSchedule(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule removed successfully." })
    }
    else if (user_info.role === 'Nurse'){
      await nurseRepo.DeleteSchedule(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule removed successfully." })
    }
    else if (user_info.role === 'FrontDesk'){
      await frontDeskRepo.DeleteSchedule(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule removed successfully." })
    }
    else if (user_info.role === 'HR'){
      await hrRepo.DeleteSchedule(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule removed successfully." })
    }
    else if (user_info.role === 'BusinessOfficer'){
      await businessOfficerRepo.DeleteSchedule(user_info.id, staff_id, schedule_string)
      res.status(200).json({ message: "Schedule removed successfully." })
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch(error){
    res.status(500).json({ message: error.message })
  }
}

export async function getStaffSchedule(req, res) {
  const user_info = req.user
  try {
    if (user_info.role === 'Doctor'){
      const result = await doctorRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId, req.query.from, req.query.to)
      res.status(200).json(result)
    }
    else if (user_info.role === 'Nurse'){
      const result = await nurseRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId, req.query.from, req.query.to)
      res.status(200).json(result)
    }
    else if (user_info.role === 'HR'){
      const result = await hrRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId, req.query.from, req.query.to)
      res.status(200).json(result)
    }
    else if (user_info.role === 'FrontDesk'){
      const result = await frontDeskRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId, req.query.from, req.query.to)
      res.status(200).json(result)
    }
    else if (user_info.role === 'BusinessOfficer'){
      const result = await businessOfficerRepo.GetSubordinatesSchedule(user_info.id, req.params.staffId, req.query.from, req.query.to)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
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

export async function getTrainingMaterials(req, res) {
  try {
    const user_info = req.user
    const department_id = user_info.department_id
    const job_id = user_info.job_id
    res.send(await fetchTrainingDocuments(job_id, department_id))
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// export async function createNewTrainingMaterial(req, res) {
//   try {
//     const user_info = req.user
//     const {
//         job_id,
//         department_id,
//         file
  
//     } = req.body
//     if (user_info.role === 'HR'){
//         createNewTrainingDocument(req.body);
//     }
//     else {
//       res.status(403).json({message: error.message})
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

export async function CreateNewTrainingMaterial() {
  try {
    // Path to your local file
    const filePath = path.join(__dirname, 'path', 'to', 'your', 'file.pdf');

    // Read the file and convert it to base64
    const fileContent = fs.readFileSync(filePath);
    const base64EncodedFile = fileContent.toString('base64');

    // Test parameters
    const job_id = 'your_job_id';
    const department_id = 'your_department_id';
    const userRole = 'HR';

    // Call the function
    const result = await createNewTrainingMaterial(job_id, department_id, base64EncodedFile, userRole);

    console.log('Result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}