const mongoose = require('mongoose');

const TrainingMaterialSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    department_id: String,
    job_id: int,
    document: String, // blob
});


const TrainingMaterials = mongoose.model('Training Materials', TrainingMaterialSchema);

module.exports = TrainingMaterials;



