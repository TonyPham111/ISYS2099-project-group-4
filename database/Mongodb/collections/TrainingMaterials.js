const mongoose = require('mongoose');

const TrainingMaterialSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    department_name: String,
    job_name: String,
});


const TrainingMaterials = mongoose.model('Training Materials', TrainingMaterialSchema);

module.exports = TrainingMaterials;



