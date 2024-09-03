import express from "express";
import patientRouter from "./router/patientRoute.js";
import staffRouter from "./router/staffRoute.js";
import appointmentRouter from "./router/AppointmentRoute.js";
import patientTreatmentHistoryRouter from "./router/PatientTreatmentHistoryRoute.js";
import conditionData from "./data/condition_data.json" with {type: 'json'};
import drugData from "./data/drug_data.json" with {type: 'json'};
import departmentData from "./data/department_data.json" with {type: 'json'};
import testTypeData from "./data/test_type_data.json" with {type: 'json'};
import allergiesData from "./data/allergies_data.json" with {type: 'json'};
import doctorAvailableData from "./data/doctor_availability_data.json" with {type: 'json'};

import cors from "cors";``
const app = express();

app.use(cors());

app.use("/patients", patientRouter);
app.use("/treatment-histories", patientTreatmentHistoryRouter);
app.use("/staffs", staffRouter);
app.use("/appointments", appointmentRouter);
app.get("/conditions", (req, res)=>{
  res.status(200).json(conditionData);
})
app.get("/available_doctors",(req, res) => {
 
    let result;
    const {departmentId} = req.query;
    if(!departmentId){
      res.status(400).json({error: "department Id is not provided"});
    }
    result = doctorAvailableData.filter((item)=>{
      return item.department_id = Number(departmentId)
    }).map((item)=>{
      return {
        "doctor_id":item.doctor_id,
        "doctor_full_name":item.doctor_full_name,
        "doctor_gender":item.doctor_gender,
        "doctor_available_status":item.doctor_available_status
      }
    })
      res.status(200).json(result);
})
app.get("/drugs", (req, res)=>{
  res.status(200).json(drugData);
})
app.get("/departments", (req, res)=>{
  res.status(200).json(departmentData);
})
app.get("/test_types",(req, res)=>{
  res.status(200).json(testTypeData);
})
app.get("/allergies",(req, res)=>{
  res.status(200).json(allergiesData);
})
app.listen(8000, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${8000}`);
});
