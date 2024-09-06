// import dependencies
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

// import collections from ./schemas
import TestResults from './schemas/LabTestResults.js';
import TrainingMaterials from './schemas/TrainingMaterials.js';
import AppointmentNotes from './schemas/AppointmentNotes.js';
import { EducationQualification, ExperienceQualification, LicenseQualification } from './schemas/StaffQualifications.js';

// import mock data from ./mockData
import { insertMockData } from './mockData.js';

dotenv.config();

//create connection uri
const url = process.env.MONGO_URI;
const databaseName = "hospital-management-sys";

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

(async () => {
  try {
    console.log(`Connecting to MongoDB at "${connectionUri}"...`);
    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB!");

    console.log("Inserting mock data...");
    await insertMockData();
    console.log("Mock data insertion complete.");

    // Optional: Verify data insertion
    const collections = ['Training Materials', 'AppointmentNotes', 'TestResult', 'Education Qualification', 'Experience Qualification', 'License Qualification'];
    for (const collectionName of collections) {
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      console.log(`${collectionName} count: ${count}`);
    }

  } finally {
    await mongoose.connection.close();
  }
})().catch(console.dir);



