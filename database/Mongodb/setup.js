// import dependencies
require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require("mongodb");

// import collections from ./collections
const { TestResults } = require('./collections/LabTestResults');
const { TrainingMaterials } = require('./collections/TrainingMaterials');
const { AppointmentNotes } = require('./collections/AppointmentNotes');
const { EducationQualification, ExperienceQualification, LicenseQualification } = require('./collections/StaffQualifications');

// import mock data from ./mockData
const { insertMockData } = require('./mockData');




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



