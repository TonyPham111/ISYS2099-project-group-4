
// import dependencies
require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require("mongodb");

// import collections from ./collections
const { TestResults } = require('./collections/LabTestResults');
const { TrainingMaterials } = require('./collections/TrainingMaterials');
const { AppointmentNotes } = require('./collections/AppointmentNotes');
const { EducationQualification, ExperienceQualification, LicenseQualification } = require('./collections/StaffQualifications');






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
    await client.connect();
    // await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    // await client.db(databaseName).dropDatabase();
    // console.log("Database cleared!");

    // const db = client.db(databaseName);
    // await createCollections(db);
    // if (process.argv.length > 2 && process.argv[2] === "--mock") {
    //   await insertMockData(connectionUri + databaseName);
    // }

    // console.log("Database initialized!");
  } finally {
    await client.close();
  }
})().catch(console.dir);



