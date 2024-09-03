const TrainingMaterials = require('./collections/TrainingMaterials');
const AppointmentNotes = require('./collections/AppointmentNotes');
const TestResult = require('./collections/LabTestResults');
const StaffQualification = require('./collections/StaffQualification');
const mongoose = require('mongoose');

// Fetch Appointment Note By ID
const fetchAppointmentNoteById = async (noteId) => {
    try {
        return await AppointmentNotes.findById(noteId);
    } catch (error) {
        console.error("Error fetching appointment note:", error);
        throw error;
    }
};

// Update Appointment Note By ID
const updateAppointmentNoteById = async (noteId, updateData) => {
    try {
        return await AppointmentNotes.findByIdAndUpdate(noteId, updateData, { new: true });
    } catch (error) {
        console.error("Error updating appointment note:", error);
        throw error;
    }
};

// Update Appointment Note
const updateAppointmentNote = async (filter, updateData) => {
    try {
        return await AppointmentNotes.findOneAndUpdate(filter, updateData, { new: true });
    } catch (error) {
        console.error("Error updating appointment note:", error);
        throw error;
    }
};

// Create Appointment Note from Pre Note
const createAppointmentNoteFromPreNote = async (preAppointmentNote) => {
    try {
        const newNote = new AppointmentNotes({
            _id: new mongoose.Types.ObjectId(),
            pre_appointment_note: preAppointmentNote
        });
        return await newNote.save();
    } catch (error) {
        console.error("Error creating appointment note:", error);
        throw error;
    }
};

// Fetch All Lab Results with Images 
const fetchLabResultsWithImages = async (patientId) => {
    try {
        return await TestResult.find({ 
            patient_id: patientId,
            'testDocument.sample_image': { $exists: true, $ne: [] }
        });
    } catch (error) {
        console.error("Error fetching lab results with images:", error);
        throw error;
    }
};

// Create new lab result Document
const createLabResult = async (patientId, testDetails, testDocument) => {
    try {
        const newLabResult = new TestResult({
            _id: new mongoose.Types.ObjectId(),
            patient_id: patientId,
            testDetails: testDetails,
            testDocument: testDocument
        });
        return await newLabResult.save();
    } catch (error) {
        console.error("Error creating lab result:", error);
        throw error;
    }
};

// Create new Training Documents
const createTrainingDocument = async (departmentName, jobName) => {
    try {
        const newTrainingDoc = new TrainingMaterials({
            _id: new mongoose.Types.ObjectId(),
            department_name: departmentName,
            job_name: jobName
        });
        return await newTrainingDoc.save();
    } catch (error) {
        console.error("Error creating training document:", error);
        throw error;
    }
};

// Fetch All Training Documents
const fetchAllTrainingDocuments = async (departmentName, jobName) => {
    try {
        return await TrainingMaterials.find({ department_name: departmentName, job_name: jobName });
    } catch (error) {
        console.error("Error fetching training documents:", error);
        throw error;
    }
};

module.exports = {
    fetchAllTrainingDocuments,
    createTrainingDocument,
    createLabResult,
    fetchLabResultsWithImages,
    createAppointmentNoteFromPreNote,
    fetchAppointmentNoteById,
    updateAppointmentNoteById,
    updateAppointmentNote
};
