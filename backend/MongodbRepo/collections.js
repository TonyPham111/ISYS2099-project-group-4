// create mongodb collections

const mongoose = require('mongoose');

async function createCollections(db) {
    await db.createCollection("AppointmentNotes");
    await db.createCollection("EducationQualification");
    await db.createCollection("ExperienceQualification");
    await db.createCollection("LicenseQualification");
    await db.createCollection("LabTestResults");
    await db.createCollection("TrainingMaterials");
    console.log("Created database and collections.");
  }
  
  exports.createCollections = createCollections;