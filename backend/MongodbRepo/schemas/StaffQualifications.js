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
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true
    },
    qualification_name: {
      type: String,
      require: false
    },
    institution_name: {
      type: String,
      require: false
    },
    level: {
      type: String,
      enum: ["Highschool", "Tertiary", "College", "Bachelor", "Master", "Doctorate"],
      default: "Highschool",
      require: false
    },
    qualification_grade: {
      type: String,
      require: false
    },
    qualification_date: {
      type: Date,
      require: false
    },
    certificate:
    {
      type: fileSchema,
      require: false
    }, 
}, { timestamps: true });

// Schema for Staff Experiences
const experienceQualificationSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true
    },
    job_title: {
      type: String,
      require: false
    },
    hospital_name: {
      type: String,
      require: false
    },
    job_description: {
      type: String,
      require: false
    },
    letter_of_reference: {
      type: fileSchema,
      require: true
    },
    start_date: {
      type: Date,
      require: false
    },
    end_date: {
      type: Date,
      require: false
    }
}, { timestamps: true });

// Schema for Licenses
const licenseQualificationSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true
    },
    document: fileSchema
}, { timestamps: true });

export const EducationQualification = mongoose.model('Education Qualification', educationQualificationSchema);
export const ExperienceQualification = mongoose.model('Experience Qualification', experienceQualificationSchema);
export const LicenseQualification = mongoose.model('License Qualification', licenseQualificationSchema);