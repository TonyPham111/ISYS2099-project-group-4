import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import patientRouter from "./Router/patientRouter.js";
import staffRouter from "./Router/staffRouter.js";
import appointmentRouter from "./Router/appointmentRouter.js";
import testRouter from "./Router/testRouter.js";
import conditionRouter from "./Router/conditionRouter.js";
import departmentRouter from "./Router/departmentRouter.js";
import drugRouter from "./Router/drugRouter.js";
import allergyRouter from "./Router/allergyRouter.js";
import userRouter from "./Router/userRouter.js"
import treatmentHistoryRouter from "./Router/treatmentHistoryRouter.js"
import mongoose from 'mongoose';




const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

app.use("/patients", patientRouter);
app.use("/staff", staffRouter);
app.use("/appointments", appointmentRouter);
app.use("/tests", testRouter); 
app.use("/conditions", conditionRouter);
app.use("/departments", departmentRouter);
app.use("/drugs", drugRouter);
app.use("/allergies", allergyRouter);
app.use("/user", userRouter);
app.use("/prescription", treatmentHistoryRouter);

const connectionUri = process.env.MONGO_URI;

try {
  await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Configure the connection pool size
  });
  console.log('Connected to MongoDB with Mongoose connection pooling.');
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);  // Exit if connection fails
}

 
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(8000, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${8000}`);
});
