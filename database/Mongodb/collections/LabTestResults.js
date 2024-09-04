const mongoose = require('mongoose');



// Test Document
const testDocument = new mongoose.Schema({
    _id: String,
    lab_result_document: String,
    sample_image: [String],
}, { timestamps: true });


const TestResult = mongoose.model('TestResult', LabTestResult);
module.exports = TestResult;