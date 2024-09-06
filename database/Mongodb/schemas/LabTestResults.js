import mongoose from 'mongoose';

// Test Document
const testDocumentSchema = new mongoose.Schema({
    _id: String,
    lab_result_document: Buffer,
    sample_image: [Buffer],
}, { timestamps: true });

const TestResult = mongoose.model('TestResult', testDocumentSchema);
export default TestResult;