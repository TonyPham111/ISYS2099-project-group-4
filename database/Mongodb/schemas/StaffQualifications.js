import mongoose from 'mongoose';

// Helper function to decode base64 to Buffer
function decodeBase64(base64String) {
  return Buffer.from(base64String, 'base64');
}

// Schema for Education Qualifications
const educationQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    qualification_name: String,
    institution_name: String,
    level: String,
    qualification_grade: String,
    qualification_date: Date,
    certificate: {
        type: Buffer,
        set: decodeBase64
    }
}, { timestamps: true });

// Schema for Staff Experiences
const experienceQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    job_title: String,
    hospital_name: String,
    job_description: String,
    letter_of_reference: {
        type: Buffer,
        set: decodeBase64
    },
    start_date: Date,
    end_date: Date
}, { timestamps: true });

// Schema for Licenses
const licenseQualificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    document: {
        type: Buffer,
        set: decodeBase64
    }
}, { timestamps: true });

export const EducationQualification = mongoose.model('Education Qualification', educationQualificationSchema);
export const ExperienceQualification = mongoose.model('Experience Qualification', experienceQualificationSchema);
export const LicenseQualification = mongoose.model('License Qualification', licenseQualificationSchema);