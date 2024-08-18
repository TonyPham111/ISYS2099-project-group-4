const { MongoClient } = require('mongodb');
const { createAppointmentNotes } = require('./collection/AppointmentNote');
const { createPatientDocuments } = require('./collection/PatientDocuments');
const { createStaffDocuments } = require('./collection/StaffDocuments');



async function connectMongoDB() {
    const url = 'mongodb+srv://khoilyminh:123456789z@hospital-management-sys.t2jsc.mongodb.net/';
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('hospital_management');

        // Call functions to create collections
        await createPatientDocuments(db);
        await createAppointmentNotes(db);
        await createStaffDocuments(db);

        console.log('Collections created successfully.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

connectMongoDB();
