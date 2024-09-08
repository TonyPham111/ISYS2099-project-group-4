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
import staffData from "./data/staff_data.json" with {type: 'json'};
import cors from "cors";``
const app = express();

app.use(cors());
app.use(express.json());
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
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
  const userAccount= staffData.filter((item)=>{
    return item.email === email && item.password === password
  })
  console.log( userAccount[0]);
  if(userAccount.length === 0){
    res.status(401).json({ message: 'Invalid credentials' });
  }else{
    console.log(`check `)
    res.status(200).json(userAccount[0]);
  }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/jobs",(req, res)=>{
  res.status(200).json(
    [
      { "job_id": 1, "job_name": "Nurse" },
      { "job_id": 2, "job_name": "Doctor" },
      { "job_id": 3, "job_name": "HR" },
      { "job_id": 4, "job_name": "Front Desk" },
      { "job_id": 5, "job_name": "Business Officer" }
    ]
  );
})
app.listen(8000, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${8000}`);
});
