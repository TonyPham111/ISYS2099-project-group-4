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
import mongoose from 'mongoose';
import {createNewLabResultDocument, createAppointmentNoteFromPreNote,  getAllImagesWithLabResult, createNewTrainingMaterial, fetchTrainingDocuments, createNewQualificationDocument, fetchQualifications} from './MongodbRepo/Methods.js'
import fs from 'fs';
import path from 'path';
import { Certificate } from "crypto";


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

 

function testingTrainingMaterialCreation(){
  try {
    // Initialize an array to store the file data
    let labResultPdf;
    const fileData = [];
    // Determine the user's home directory based on the platform
    const homeDirectory = process.env.HOME || process.env.USERPROFILE;

    // Define the path to the desktop
    const desktopPath = path.join(homeDirectory, 'Desktop');

    // File names on your desktop
    const files = [
        'image_1.jpeg',
        'image_2.jpeg',
        'document.pdf'
    ];

    // Read each file and store its data as Buffer and its name
    for (const fileName of files) {
        const filePath = path.join(desktopPath, fileName);
        console.log("FilePath" + filePath)
        console.log(fs.existsSync(filePath))
        const fileBuffer = fs.readFileSync(filePath); // Synchronously read file as Buffer
        if (fileName == 'document.pdf'){
          labResultPdf = {
            file_name: fileName,
            file: fileBuffer
          }
        }
        else {
          fileData.push({
            file_name: fileName,
            file: fileBuffer // Convert Buffer to Base64
        });

        }
    }
    return createNewLabResultDocument(labResultPdf, fileData);
} catch (error) {
    console.error('Error fetching files:', error);
    throw new Error('Unable to fetch files from desktop');
}
}
const object = {
  note: 'Hello WOrld'
}
const homeDirectory = process.env.HOME || process.env.USERPROFILE;
// Define the path to the desktop
const desktopPath = path.join(homeDirectory, 'Desktop');
//await createAppointmentNoteFromPreNote(object)
//await testingTrainingMaterialCreation()
const filePath = path.join(desktopPath, 'document.pdf');
const fileBuffer = fs.readFileSync(filePath);
const trainingMaterial = {
  job_id: 1,
  department_id: 1,
  trainingMaterial: {
    file_name: 'document.pdf',
    file: fileBuffer
  }
}
const qualifiations = [
  {
    qualification_type: 'Education',
    qualification_name: 'Bachelor Degree',
    institution_name: 'University Of Melbourne',
    level: 'Tertiary',
    qualification_grade: 78,
    qualification_date: 21/12/2021,
    certificate: {
      file_name: 'document.pdf',
      file: fileBuffer
    }
  },
  {
    qualification_type: 'Experience',
    job_title: 'CEO',
    hospital_name: 'IDontKNOW inc',
    job_description: 'Son Of Founder',
    letter_of_reference: {
      file_name: 'document.pdf',
      file: fileBuffer
    },
    start_date: 8/6/1999
  },
  {
    qualification_type: 'License',
    document: {
      file_name: 'document.pdf',
      file: fileBuffer
    }
  }
]




app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(8000, () => {
  console.log(`SERVER IS RUNNING ON http://localhost:${8000}`);
});
