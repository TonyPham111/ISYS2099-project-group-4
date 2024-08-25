const mongoose = require('mongoose');


// Lab test 
const LabTestResult = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient_id: mongoose.Schema.Types.ObjectId,
    testDetails,
    testDocument,
}, { timestamps: true });


// Test Details Schema
const testDetails = new mongoose.Schema({
    test_order_id: mongoose.Schema.Types.ObjectId,
    test_type_id: mongoose.Schema.Types.ObjectId,
    administering_staff_id: mongoose.Schema.Types.ObjectId,
    lab_result_detail: String,
}, { timestamps: true });


// Test Document
const testDocument = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lab_result_document: String,
    sample_image: [String],
}, { timestamps: true });


const TestResult = mongoose.model('TestResult', TestResult);
module.exports = TestResult;

