const mongoose = require('mongoose');


// Lab test 
const LabTestResult = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient_id: String,
    testDetails,
    testDocument,
}, { timestamps: true });


// Test Details Schema
const testDetails = new mongoose.Schema({
    test_order_id: String,
    test_type_id: String,
    administering_staff_id: String,
    lab_result_detail: String,
}, { timestamps: true });


// Test Document
const testDocument = new mongoose.Schema({
    _id: String,
    lab_result_document: String,
    sample_image: [String],
}, { timestamps: true });


const TestResult = mongoose.model('TestResult', LabTestResult);
module.exports = TestResult;