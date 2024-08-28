const mongoose = require('mongoose');
const TestResult = require('./schemas/LabTestResults'); 
const AppointmentNotes = require('./schemas/AppointmentNotes'); 

async function insertMockData() {
    await mongoose.connect('mongodb+srv://khoilyminh:123456789z@hospital-management-sys.t2jsc.mongodb.net/hospital_management', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');
    const TestResult = mongoose.model("Test Result", TestResultsSchema);
    const mockData = {
        patient_id: "123456",
        testDetails: {
            test_order_id: "order_001",
            test_type_id: "type_001",
            administering_staff_id: "staff_001",
            lab_result_detail: "Blood test shows elevated glucose levels.",
        },
        testDocument: {
            lab_result_document: "Blood_Test_Report.pdf",
            sample_image: ["image1.png", "image2.png"],
        },
    };

    try {
        const result = new TestResult(mockData);
        await result.save();
        console.log('Mock data inserted successfully:', result);
    } catch (err) {
        console.error('Error inserting mock data:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Connection to MongoDB closed');
    }
}


exports.insertMockData = insertMockData();
