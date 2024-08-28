require ('dotenv').config();
const { MongoClient } = require("mongodb");
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const { PatientDocuments } = require('./Mongodb/collections/PatientDocuments');
const { TestResult } = require('./Mongodb/collections/LabTestResult');
const { AppointmentNotes } = require('./Mongodb/collections/AppointmentNotes');


const Client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// (async () => {
//   try {
//     console.log(`Connecting to MongoDB at "${process.env.MONGODB_URL}"...`);
//     await Client.connect();
//     await Client.db("admin").command({ ping: 1 });
//     console.log("Successfully connected to MongoDB!");

//     await Client.db(databaseName).dropDatabase();
//     console.log("Database cleared!");

//     const db = Client.db(databaseName);
//     await createCollections(db);
//     if (process.argv.length > 2 && process.argv[2] === "--mock") {
//       await insertMockData(connectionUri + databaseName);
//     }

//     console.log("Database initialized!");
//   } finally {
//     await Client.close();
//   }
// })().catch(console.dir);

mongoose.connect(process.env.MONGDB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Listening to port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });
