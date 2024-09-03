import express from "express";
import patientRouter from "./Router/patientRouter.js";
import staffRouter from "./Router/staffRouter.js";
import appointmentRouter from "./Router/appointmentRouter.js";
import treatmentHistoryRouter from "./Router/treatmentHistoryRouter.js";
import cors from "cors";
import conditionRouter from "./Router/conditionRouter.js";
import departmentRouter from "./Router/departmentRouter.js";
import drugRouter from "./Router/drugRouter.js";
import allergyRouter from "./Router/allergyRouter.js";
const app = express();

//testing Models

import doctorRepo from "./Models/DoctorModel.js";
import nurseRepo from "./Models/NurseModel.js";
import hrRepo from "./Models/HrModel.js"
import frontDeskRepo from "./Models/FrontDeskModel.js";
import businessOfficerRepo from "./Models/BusinessOfficerModel.js";

async function testing(callback){
  const result = await callback()
  console.log(result)
}
//Test fetching diagnosis by patient
testing(async ()=> {
  return await nurseRepo.FetchDiagnosesByPatientId(1)
})
testing(async () => {
  return await nurseRepo.FetchTestDetailsByPatientId(1)
})
testing(async () => {
  return await nurseRepo.FetchPrescriptionsByPatientId(1)
})

testing(async ()=> {
  return await doctorRepo.GetSubordinatesSchedule(4,2)
})



/*
//Test fetching presription by patient

//PatientController
testing(async () => {
  return await nurseRepo.GetPatientsAllergies(1)
})
//Billing Controller
testing(async () => {
  return await businessOfficerRepo.GetAllBillings()
})
//Billing Controller
testing(async () => {
  return await businessOfficerRepo.GetBillingDetails()
})

//StaffController
testing(async () => {
  return await nurseRepo.GetAllPerformanceEvaluation(2,70)
})
  */





app.use(cors());
app.use("/patients", patientRouter);
app.use("/staffs", staffRouter);
app.use("/appointments", appointmentRouter);
app.use("/treatment-histories",treatmentHistoryRouter); 
app.use("/conditions", conditionRouter);
app.use("/departments", departmentRouter);
app.use("/drugs", drugRouter);
app.use("/allergies", allergyRouter);

// app.use("/user");
// app.use("/")

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(8800, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${8800}`);
});
