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
// Schema for Education Qualifications
const educationQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    qualification_name: String,
    institution_name: String,
    level: String,
    qualification_grade: String,
    qualification_date: Date,
    certificate: fileSchema
}, { timestamps: true });

// Schema for Staff Experiences
const experienceQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    job_title: String,
    hospital_name: String,
    job_description: String,
    letter_of_reference: fileSchema,
    start_date: Date,
    end_date: Date
}, { timestamps: true });

// Schema for Licenses
const licenseQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    document: fileSchema
}, { timestamps: true });

export const EducationQualification = mongoose.model('Education Qualification', educationQualificationSchema);
export const ExperienceQualification = mongoose.model('Experience Qualification', experienceQualificationSchema);
export const LicenseQualification = mongoose.model('License Qualification', licenseQualificationSchema);