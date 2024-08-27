const mongoose = require('mongoose');


// Pre-Appointments Notes ( Symptoms  )
const appointmentNotesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient_id: mongoose.Schema.Types.ObjectId,
    nurse_id: mongoose.Schema.Types.ObjectId,
    doctor_id: mongoose.Schema.Types.ObjectId,
    symptoms: String || null,
    notes: String,
    appointment_date: Date,
    appointment_time: String,
}, { timestamps: true });



const AppointmentNotes = mongoose.model('AppointmentNotes', AppointmentNotes);
module.exports = AppointmentNotes;


