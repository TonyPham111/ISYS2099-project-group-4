const mongoose = require('mongoose');

const TrainingMaterialSchema = new mongoose.Schema({
    _id: String,
    department_name: String,
    job_name: String,
});


const TrainingMaterials = mongoose.model('EmploymentDocument', TrainingMaterialSchema);

module.exports = TrainingMaterials;




