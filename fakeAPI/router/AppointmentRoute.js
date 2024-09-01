import express from "express";
import appointmentData from "../data/appointment_data.json" with {type: 'json'};
const appointmentRouter = express.Router();
appointmentRouter
  .route("/")
  .get((req, res) => {
    /*
    structure data: 
    [
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
       after_note: String
      },
    ]
    */
   let result = appointmentData;
   const {doctorId} = req.query;
   if(doctorId){
    result = appointmentData.filter((item)=>{
      return item.doctor_id == doctorId;
    });
   }
   res.status(200).json(result);
  })
  .post((req, res) => {});

appointmentRouter
  .route("/:appointmentId")
  .get((req, res) => {
    let result ;
    const appointmentId = req.params.appointmentId;
    if(!appointmentId){
      res.status(400).json({error: 'appointment id is not provided'});
    }
    for(let i = 0; i < appointmentData.length; ++i){
      if(appointmentData[i].id == Number(appointmentId)){
        result = appointmentData[i];
      }
    }
    if(!result){
      res.status(404).json({error: `appointment data with id ${appointmentId} is not found`});
    }
    else{
      res.status(200).json(result);
    }
  })
  .put((req, res) => {})
  .delete((req, res) => {});

export default appointmentRouter;
