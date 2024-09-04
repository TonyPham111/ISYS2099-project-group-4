const mongoose = require('mongoose');
const TrainingMaterials = require('./collections/TrainingMaterials');
const AppointmentNotes = require('./collections/AppointmentNotes');
const TestResult = require('./collections/LabTestResults');
const { EducationQualification, ExperienceQualification, LicenseQualification } = require('./collections/StaffQualifications');

const mockData = {
  trainingMaterials: [
    {
      _id: new mongoose.Types.ObjectId(),
      department_id: "DEP001",
      job_id: 1001,
      document: "Base64EncodedString1"
    },
  
  ],

  appointmentNotes: [
    {
      _id: new mongoose.Types.ObjectId(),
      pre_appointment_note: { symptoms: "Fever, headache" },
      post_appointment_note: { diagnosis: "Flu" },
      during_document_note: { prescription: "Paracetamol" }
    },
   
  ],

  labTestResults: [
    {
      _id: "TEST001",
      lab_result_document: "Base64EncodedString2",
      sample_image: ["Base64EncodedImage1", "Base64EncodedImage2"]
    },
  ],

  educationQualifications: [
    {
      _id: new mongoose.Types.ObjectId(),
      qualification_name: "MBBS",
      institution_name: "Medical University",
      level: "Doctorate",
      qualification_grade: "A",
      qualification_date: new Date("2020-05-15"),
      certificate: "Base64EncodedString3"
    },
   
  ],

  experienceQualifications: [
    {
      _id: new mongoose.Types.ObjectId(),
      job_title: "Resident Doctor",
      hospital_name: "City Hospital",
      job_description: "General practice and emergency care",
      letter_of_reference: "Base64EncodedString4",
      start_date: new Date("2020-06-01"),
      end_date: new Date("2022-05-31")
    },
  
  ],

  licenseQualifications: [
    {
      _id: new mongoose.Types.ObjectId(),
      document: "Base64EncodedString5"
    },

  ]
};

async function insertMockData() {
  try {
    // Clear existing data
    await TrainingMaterials.deleteMany({});
    await AppointmentNotes.deleteMany({});
    await TestResult.deleteMany({});
    await EducationQualification.deleteMany({});
    await ExperienceQualification.deleteMany({});
    await LicenseQualification.deleteMany({});

    console.log("Existing data cleared");

    // Insert new data
    await TrainingMaterials.insertMany(mockData.trainingMaterials);
    
    console.log('AppointmentNotes:', AppointmentNotes);
    await AppointmentNotes.insertMany(mockData.appointmentNotes);
    
    console.log('TestResult:', TestResult);
    await TestResult.insertMany(mockData.labTestResults);
    
    console.log('EducationQualification:', EducationQualification);
    await EducationQualification.insertMany(mockData.educationQualifications);
    
    console.log('ExperienceQualification:', ExperienceQualification);
    await ExperienceQualification.insertMany(mockData.experienceQualifications);
    
    console.log('LicenseQualification:', LicenseQualification);
    await LicenseQualification.insertMany(mockData.licenseQualifications);
    
    console.log("Mock data inserted successfully");
  } catch (error) {
    console.error("Error inserting mock data:", error);
  }
}

module.exports = { insertMockData };
