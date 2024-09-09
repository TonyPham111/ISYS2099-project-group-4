import express from "express";
import staffData from "../data/staff_data.json" with {type: 'json'};
import appointmentData from "../data/appointment_data.json" with {type: 'json'};
import staffScheduleData from "../data/staff_schedule_data.json" with {type: 'json'};
import jobChangeHistoryData from "../data/job_change_history.json" with {type: 'json'};
import wageChangeHistoryData from "../data/wage_change_history.json" with {type: 'json'};
import departmentChangeHistoryData from "../data/department_change_history.json" with {type: 'json'};
import doctorAvailableData from "../data/doctor_availability_data.json" with {type: 'json'};

const staffRouter = express.Router();
staffRouter
  .route("/")
  .get((req, res) => {
    //get all staff data
    /*
    structure data: 
    [
      {
        id: INT, 
        manager_id: INT,
        first_name: String, 
        last_name: String, 
        department: String,
        job: String, 
        gender: String, 
        birth_date: "DD/MM/YYYY",
        home_address: String, 
        contact_phone_number: String, 
        email: String, 
        wage: DECIMAL(6, 2),
        hire_date: "DD/MM/YYYY",
        employment_type: String
      }
    ]
    */
    const {manager_id, job_role, department_id, naming_order} = req.query;
    console.log(`req.query ${JSON.stringify(req.query)}`);
      let result = staffData;
      if(manager_id){
        result = staffData.filter((item)=>{
          return item.manager_id == Number(manager_id);
        })
      }
      // console.log(`result after manager id ${JSON.stringify(result)}`);
      if(job_role){
        result = staffData.filter((item)=>{
          return item.job_name== job_role;
        })
      }
      // console.log(`result after job role ${JSON.stringify(result)}`);
      if(department_id){
        result = staffData.filter((item)=>{
          // console.log(`item.department_id: ${item.department_id}, department_id: ${department_id}`);
          return item.department_id == Number(department_id);
        })
      }
      // console.log(`result after department id ${JSON.stringify(result)}`);
      if(naming_order == "asc" || !naming_order) {
        result = result.sort((a, b) => {
          const conditionNamingOrder =  (a.full_name[0].toLowerCase()) > (b.full_name[0].toLowerCase())
          console.log(`conditionNamingAscOrder: ${conditionNamingOrder}`);
          return conditionNamingOrder ? 1 : -1;
        })
      }else if(naming_order == 'desc'){
        result = result.sort((a, b) => {
          const conditionNamingOrder =  (a.full_name[0].toLowerCase()) <= (b.full_name[0].toLowerCase())
          console.log(`conditionNamingDescOrder: ${conditionNamingOrder}`);
          return conditionNamingOrder ? 1 : -1;
        })
      }
  

      // console.log(`result after naming order ${JSON.stringify(result)}`);
   res.status(200).json(result);
})
  .post((req, res) => {
    //add new staff
  });
 staffRouter.route("training_material").get((req, res)=>{
  const {department_id, job_id} = req.query;
  let result;
  if(department_id && job_id){
    result = trainingMaterialData.filter((item)=>{
      return item.department_id == Number(department_id) && item.job_id == Number(job_id);
    })
  res.status(200).json(result?result:[]);
  }else {
    res.status(400).json({error: "department_id and job_id are required"});
  }
 }) 
  staffRouter
  .route("/job_change_history")
  .get((req, res) => {
    //get all staff data
    /*
    structure data: 
    [
      {
        id: INT, 
        manager_id: INT,
        first_name: String, 
        last_name: String, 
        department: String,
        job: String, 
        gender: String, 
        birth_date: "DD/MM/YYYY",
        home_address: String, 
        contact_phone_number: String, 
        email: String, 
        wage: DECIMAL(6, 2),
        hire_date: "DD/MM/YYYY",
        employment_type: String
      }
    ]
    */
    const {staffId} = req.query;
      let result = jobChangeHistoryData;
      if(staffId){
        result = jobChangeHistoryData.filter((item)=>{
          return item.staff_id== Number(staffId);
        })
      }
     
   res.status(200).json(result);
  })
  staffRouter
  .route("/wage_change_history")
  .get((req, res) => {
    //get all staff data
    /*
    structure data: 
    [
      {
        id: INT, 
        manager_id: INT,
        first_name: String, 
        last_name: String, 
        department: String,
        job: String, 
        gender: String, 
        birth_date: "DD/MM/YYYY",
        home_address: String, 
        contact_phone_number: String, 
        email: String, 
        wage: DECIMAL(6, 2),
        hire_date: "DD/MM/YYYY",
        employment_type: String
      }
    ]
    */
    const {staffId} = req.query;
      let result = wageChangeHistoryData;
      if(staffId){
        result = wageChangeHistoryData.filter((item)=>{
          return item.staff_id== Number(staffId);
        })
      }
     
   res.status(200).json(result);
  })
  staffRouter
  .route("/department_change_history")
  .get((req, res) => {
    //get all staff data
    /*
    structure data: 
    [
      {
        id: INT, 
        manager_id: INT,
        first_name: String, 
        last_name: String, 
        department: String,
        job: String, 
        gender: String, 
        birth_date: "DD/MM/YYYY",
        home_address: String, 
        contact_phone_number: String, 
        email: String, 
        wage: DECIMAL(6, 2),
        hire_date: "DD/MM/YYYY",
        employment_type: String
      }
    ]
    */
    const {staffId} = req.query;
      let result = departmentChangeHistoryData;
      if(staffId){
        result = departmentChangeHistoryData.filter((item)=>{
          return item.staff_id== Number(staffId);
        })
      }
     
   res.status(200).json(result);
  })
staffRouter
  .route("/:staffId")
  .get((req, res) => {
    //get specific staff data
    /*
    structure data: 
  {
        id: INT, 
        manager_id: INT,
        first_name: String, 
        last_name: String, 
        department: String,
        job: String, 
        gender: String, 
        birth_date: "DD/MM/YYYY",
        home_address: String, 
        contact_phone_number: String, 
        email: String, 
        wage: DECIMAL(6, 2),
        hire_date: "DD/MM/YYYY",
        employment_type: String
      }
    */
      let result;
      const staffId = req.params.staffId;
      if(!staffId){
        res.status(400).json({error: "Staff Id is not provided"});
      }
      for(let i = 0; i < staffData.length; ++i){
        if(staffData[i].id == Number(staffId)){
          result = staffData[i];
        }
      }
      if(!result){
        res.status(404).json(`staff Id: ${staffId} data is not found or invalid`);
      }
      else{
        res.status(200).json(result);
      }
  })
  .put((req, res) => {
    //update specific staff data
  });

staffRouter
  .route("/:staffId/schedule")
  .get((req, res) => {
    //get all staff working schedule
    //get all staff appointment data
    /*
    structure data: 
    {
      appointments: [
        {
           id: INT, 
           purpose_of_appointment: String,
           patient_id: INT,
           doctor_id: INT,
           date: "DD/MM/YYYY",
           start_time: "HH:mm:ss",
           end_time: "HH:mm:ss",
           before_note: String,
           during_note: String,
           after_note: String,
        }
      ],
      working_schedule: [
        {
           id: INT,
           staff_id: INT,
           date: "DD/MM/YYYY",
           start_time: "HH:mm:ss",
           end_time: "HH:mm:ss",
        }
      ]
    }

    */
    const staffId = req.params.staffId;
    let isValidStaff = false;
    let staffSChedule= [], staffAppointment= [];
    if(!staffId){
      res.status(400).json({error: "Staff Id is not provided"});
    }
    for(let i = 0; i < staffData.length; ++i){
      if(staffData[i].id == Number(staffId)){
        isValidStaff = true;
      }
    }
    if(!isValidStaff){
      res.status(404).json({error: "staff is not found or invalid"});
    }
    staffSChedule = staffScheduleData.filter((item)=>{
      return item.staff_id == Number(staffId);
    });
    staffAppointment = appointmentData.filter((item)=>{
      return item.doctor_id == Number(staffId);
    });
    for(let i = 0; i < staffSChedule.length; ++i){
      // delete staffSChedule[i].staff_id
    }
    for(let i = 0; i < staffAppointment.length; ++i){
      // delete staffAppointment[i].staff_id
    }
    res.status(200).json(
      {
        staff_id: staffId,
        staff_schedule: staffSChedule,
        staff_appointment: staffAppointment
      }
    )
  })
  .put((req, res) => {
    //update staff working schedule
  });

export default staffRouter;


/*

[
  {
    staff_id: INT, 
    old_wage: DECIMAL(6,2), 
    new_wage: DECIMAL(6,2),
    date_change: String --> DD/MM/YYYY
  }
]

*/
staffRouter
  .route("/available_doctors")
  .get((req, res) => {
    //get specific staff data
    /*
    structure data: 
  {
        id: INT, 
        manager_id: INT,
        first_name: String, 
        last_name: String, 
        department: String,
        job: String, 
        gender: String, 
        birth_date: "DD/MM/YYYY",
        home_address: String, 
        contact_phone_number: String, 
        email: String, 
        wage: DECIMAL(6, 2),
        hire_date: "DD/MM/YYYY",
        employment_type: String
      }
    */
      let result;
      const {departmentId} = req.query;
      if(!departmentId){
        res.status(400).json({error: "department Id is not provided"});
      }
      result = doctorAvailableData.filter((item)=>{
        return item.department_id = Number(departmentId)
      }).map((item)=>{
        return {
          "doctor_full_name":item.doctor_full_name,
          "doctor_gender":item.doctor_gender,
          "doctor_available_status":item.doctor_available_status
        }
      })
     
      if(result.length == 0){
        res.status(404).json(`department id: ${departmentId} data is not found or invalid`);
      }
      else{
        res.status(200).json(result);
      }
  })