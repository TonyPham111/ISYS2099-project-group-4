const mongoose = require('mongoose');


// Schema for Education Qualifications
const educationQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    qualification_name: String,
    institution_name: String,
    level: String,
    qualification_grade: String,
    qualification_date: Date,
    certificate: String // blob
}, { timestamps: true });

// Schema for Staff Experiences
const experienceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    job_title: String,
    hospital_name: String,
    job_description: String,
    letter_of_reference: String, // blob
    start_date: Date,
    end_date: Date
}, { timestamps: true });

// Schema for Licenses
const licenseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   document: String // blob 
}, { timestamps: true }); 

const EducationQualification = mongoose.model('Education Qualification', educationQualificationSchema);
const ExperienceQualification = mongoose.model('Experience Qualification', experienceSchema);
const LicenseQualification = mongoose.model('License Qualification', licenseSchema);
module.exports = {EducationQualification, ExperienceQualification, LicenseQualification};