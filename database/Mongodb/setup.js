// import dependencies
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';

// import collections from ./schemas
import TestResults from './schemas/LabTestResults.js';
import TrainingMaterials from './schemas/TrainingMaterials.js';
import AppointmentNotes from './schemas/AppointmentNotes.js';
import { EducationQualification, ExperienceQualification, LicenseQualification } from './schemas/StaffQualifications.js';
import {createNewLabResultDocument} from './Methods.js'

// import mock data from ./mockData
import { insertMockData } from './mockData.js';

dotenv.config();

//create connection uri
const url = process.env.MONGO_URI;
const databaseName = "hospital_management_system";

//create connection
const connectionUri = url + databaseName;

//create client
const client = new MongoClient(connectionUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try {
  console.log(`Connecting to MongoDB at "${connectionUri}"...`);
  await mongoose.connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Successfully connected to MongoDB!");

  console.log("Inserting mock data...");
  //await insertMockData();
  console.log("Mock data insertion complete.");

}catch(error){
  throw new Error(error.message)
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

testingTrainingMaterialCreation()

