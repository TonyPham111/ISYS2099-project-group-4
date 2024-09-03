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
import bcrypt from 'bcrypt';
const app = express();

//testing Models

import doctorRepo from "./Models/DoctorModel.js";
import nurseRepo from "./Models/NurseModel.js";
import hrRepo from "./Models/HrModel.js"
import frontDeskRepo from "./Models/FrontDeskModel.js";
import businessOfficerRepo from "./Models/BusinessOfficerModel.js";
import {poolAdmin} from "./Models/dbConnectionConfiguration.js"



const rounds = process.env.SALT_ROUNDS
async function fetchStaffIds(){
  const results = await poolAdmin.query(
    "SELECT id, staff_password FROM Staff" , []
  )
  return results[0]
}

async function encryptPassword(params) {
  const employee_ids = await fetchStaffIds()
  for (let i = 0; i < employee_ids.length; i++){
    const current_id = employee_ids[i].id
    const unhashed_password = employee_ids[i].staff_password
    const encrypted_password = await bcrypt.hash(unhashed_password, 10)
    const result = poolAdmin.query(
      'UPDATE Staff SET staff_password = ? WHERE id = ?', [encrypted_password, current_id]
    )
    console.log("done")
  }
}
encryptPassword()




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
