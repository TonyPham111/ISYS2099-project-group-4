import mongoose from 'mongoose';

// Test Document
const fileSchema = new mongoose.Schema({
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

const TrainingMaterialSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    department_id: Number,
    job_id: Number,
    training_material: fileSchema
});

const TrainingMaterials = mongoose.model('Training Materials', TrainingMaterialSchema);

export default TrainingMaterials;



