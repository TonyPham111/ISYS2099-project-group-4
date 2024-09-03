const mongoose = require('mongoose');

const staffQualification = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    educationQualificationSchema,
    experienceSchema,
    licenseSchema
}, { timestamps: true });


// Schema for Education Qualifications
const educationQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    qualification_name: String,
    institution_name: String,
    level: String,
    qualification_grade: String,
    qualification_date: Date,
    certificate: String
}, { timestamps: true });

// Schema for Staff Experiences
const experienceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    job_title: String,
    hospital_name: String,
    job_description: String,
    start_date: Date,
    end_date: Date
}, { timestamps: true });

// Schema for Licenses
const licenseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   document: String
}, { timestamps: true }); 

const StaffQualification = mongoose.model('Staff Qualification', staffQualification);

module.exports = StaffQualification;