import express from "express";
import patientRouter from "./router/patientRoute.js";
import staffRouter from "./router/staffRoute.js";
import appointmentRouter from "./router/AppointmentRoute.js";
import patientTreatmentHistoryRouter from "./router/PatientTreatmentHistoryRoute.js";
const app = express();

app.use("/patients", patientRouter);
app.use("/treatment-history", patientTreatmentHistoryRouter);
app.use("/staffs", staffRouter);
app.use("/appointments", appointmentRouter);
app.listen(8000, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${8000}`);
});
