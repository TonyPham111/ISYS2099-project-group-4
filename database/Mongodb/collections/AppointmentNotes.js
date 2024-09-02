const mongoose = require('mongoose');


// Pre-Appointments Notes ( Symptoms  )
const appointmentNotesSchema = new mongoose.Schema({
    _id: String,
    pre_appointment_note:String,
    post_appointment_note:String,
    during_document_note: String,
}, { timestamps: true });

const AppointmentNotes = mongoose.model('AppointmentNotes', AppointmentNotes);
module.exports = AppointmentNotes;


