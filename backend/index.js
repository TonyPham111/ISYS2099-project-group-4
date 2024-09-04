import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import patientRouter from "./Router/patientRouter.js";
import staffRouter from "./Router/staffRouter.js";
import appointmentRouter from "./Router/appointmentRouter.js";
import treatmentHistoryRouter from "./Router/treatmentHistoryRouter.js";
import conditionRouter from "./Router/conditionRouter.js";
import departmentRouter from "./Router/departmentRouter.js";
import drugRouter from "./Router/drugRouter.js";
import allergyRouter from "./Router/allergyRouter.js";
import userRouter from "./Router/userRouter.js"

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));
app.use("/patients", patientRouter);
app.use("/staffs", staffRouter);
app.use("/appointments", appointmentRouter);
app.use("/treatment-histories",treatmentHistoryRouter); 
app.use("/conditions", conditionRouter);
app.use("/departments", departmentRouter);
app.use("/drugs", drugRouter);
app.use("/allergies", allergyRouter);
app.use("/user", userRouter);


// app.use("/")

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});


import { 
  getAllStaffsInfo,
  addNewStaff,
  getStaffPersonalInfo,
  updateStaffPersonalInfo,
  updateStaffWage,
  getWageChangeHistory,
  updateStaffJob,
  getJobChangeHistory,
  updateStaffDepartment,
  getDepartmentChangeHistory,
  schedule,
  deleteSchedule,
  getStaffSchedule
} from './Controller/staffController.js'; // Update with the correct path


// Define your routes
app.get('/staffs', getAllStaffsInfo);
app.post('/staffs', addNewStaff);
app.get('/staffs/:staffId', getStaffPersonalInfo);
app.put('/staffs/:staffId', updateStaffPersonalInfo);
app.put('/staffs/:staffId/wage', updateStaffWage);
app.get('/staffs/:staffId/wage/history', getWageChangeHistory);
app.put('/staffs/:staffId/job', updateStaffJob);
app.get('/staffs/:staffId/job/history', getJobChangeHistory);
app.put('/staffs/:staffId/department', updateStaffDepartment);
app.get('/staffs/:staffId/department/history', getDepartmentChangeHistory);
app.post('/staffs/:staffId/schedule', schedule);
app.delete('/staffs/:staffId/schedule', deleteSchedule);
app.get('/staffs/:staffId/schedule', getStaffSchedule);

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });
console.log(process.env.DB_DOCTORS_USERNAME)
import doctorRepo from "./Models/DoctorModel.js";
import frontDeskRepo from "./Models/FrontDeskModel.js";
import hrRepo from "./Models/HrModel.js";

async function fetchingStaffSchedule(manager_id, staff_id){
  const result = await hrRepo.FetchAllStaff();
  console.log("Staff   " + JSON.stringify(result[0], null, 2));
}

async function bookingAppointment(){
  frontDeskRepo.AddNewAppointment(10, 4, 100, "Routine Checkup", '2024-09-03', '16:00:00', '17:00:00', null)
  frontDeskRepo.AddNewAppointment(10, 4, 100, "Routine Checkup", '2024-09-03', '16:00:00', '17:00:00', null)
}


//Testing Concurrency: Booking Appointment - Reschedulling
async function bookingAppointmentAndChangeSchedule(){
    //frontDeskRepo.AddNewAppointment(12, 28, 100, "Routine Checkup", '2024-10-10', '10:00:00', '11:00:00');
    //doctorRepo.Scheduling(18,28,'2024-10-11;09:30:00-17:00:00')
}
bookingAppointmentAndChangeSchedule()

//Tesing Concurrency: Booking Appointment - Change job / Change Department
async function bookingAppointmentAndJobChange(){
  frontDeskRepo.AddNewAppointment(12, 28, 100, "Routine Checkup", '2024-10-11', '10:00:00', '11:00:00');
  hrRepo.ChangeDepartment(28,12,5)
}

bookingAppointmentAndJobChange();



app.listen(8000, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${8000}`);
});
