import mongoose from 'mongoose';

// Test Document
const labResultFileSchema = new mongoose.Schema({
    _id: { 
      type: mongoose.Schema.Types.ObjectId, 
      auto: true 
    },
    file_name: {
      type: String,
      required: true
    },
    file: {
      type: Buffer,
      required: true
    }
  });

const testDocumentSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
      },
    lab_result_document: labResultFileSchema,
    sample_image: [labResultFileSchema],
}, { timestamps: true });

const TestResult = mongoose.model('TestResult', testDocumentSchema);
export default TestResult;