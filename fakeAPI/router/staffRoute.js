import express from "express";
import staffData from "../data/staff_data.json" with {type: 'json'};
import appointmentData from "../data/appointment_data.json" with {type: 'json'};
import staffScheduleData from "../data/staff_schedule_data.json" with {type: 'json'};
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
   res.status(200).json(staffData);
  })
  .post((req, res) => {
    //add new staff
  });

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
      delete staffSChedule[i].staff_id
    }
    for(let i = 0; i < staffAppointment.length; ++i){
      delete staffAppointment[i].staff_id
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
