const AppointmentNotes = require('./collections/AppointmentNotes');
const TestResult = require('./collections/LabTestResults');
const TrainingMaterials = require('./collections/TrainingMaterials');

// Fetch Appointment Note By Document ID
async function fetchAppointmentNoteByDocumentId(documentId) {
    return await AppointmentNotes.findOne({ _id: documentId });
}

// Update DuringAppointment Note By Document ID
async function updateDuringAppointmentNote(documentId, duringNote) {
    return await AppointmentNotes.findByIdAndUpdate(
        documentId,
        { during_document_note: duringNote },
        { new: true }
    );
}

// Update Post Appointment Note By Document ID
async function updatePostAppointmentNote(documentId, postNote) {
    return await AppointmentNotes.findByIdAndUpdate(
        documentId,
        { post_appointment_note: postNote },
        { new: true }
    );
}

// Create Appointment Note from Pre Note
async function createAppointmentNoteFromPreNote(preNote) {
    const newNote = new AppointmentNotes({
        pre_appointment_note: preNote,
        post_appointment_note: '',
        during_document_note: ''
    });
    return await newNote.save();
}

// Fetch All Lab Results with Images based on lab_result_document_id
async function fetchLabResultsWithImagesByDocumentId(documentId) {
    return await TestResult.findOne({ 'testDocument._id': documentId })
        .populate('testDocument.sample_image');
}

// Create new lab result Document
async function createNewLabResultDocument(labResultData) {
    const newLabResult = new TestResult(labResultData);
    return await newLabResult.save();
}

// Create new Training Documents based on job, department and file
async function createNewTrainingDocument(jobName, departmentName, file) {
    const newTrainingMaterial = new TrainingMaterials({
        job_name: jobName,
        department_name: departmentName,
        file: file // Assuming you want to store the file somehow
    });
    return await newTrainingMaterial.save();
}

// Fetch All Training Documents based on jobid and department id
async function fetchTrainingDocuments(jobName, departmentName) {
    return await TrainingMaterials.find({
        job_name: jobName,
        department_name: departmentName
    });
}

module.exports = {

    fetchAppointmentNoteByDocumentId,
    updateDuringAppointmentNote,
    updatePostAppointmentNote,
    createAppointmentNoteFromPreNote,
    fetchLabResultsWithImagesByDocumentId,
    createNewLabResultDocument,
    createNewTrainingDocument,
    fetchTrainingDocuments
};
