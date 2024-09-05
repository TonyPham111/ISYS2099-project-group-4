const mongoose = require('mongoose');

// Test Document
const testDocumentSchema = new mongoose.Schema({
    _id: String,
    lab_result_document: Buffer,
    sample_image: [Buffer],
}, { timestamps: true });

const TestResult = mongoose.model('TestResult', testDocumentSchema);
module.exports = TestResult;