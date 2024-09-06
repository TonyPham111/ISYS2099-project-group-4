import mongoose from 'mongoose';

const TrainingMaterialSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    department_id: Number,
    job_id: Number,
    training_material: Buffer
});

const TrainingMaterials = mongoose.model('Training Materials', TrainingMaterialSchema);

export default TrainingMaterials;



