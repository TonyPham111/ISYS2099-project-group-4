const mongoose = require('mongoose');


// Appointments Notes ( Symptoms  )
const appointmentNotesSchema = new mongoose.Schema({
    _id: String,
    symptoms: String || null,
    notes: String,
    appointment_date: Date,
    appointment_time: String,
}, { timestamps: true });



const AppointmentNotes = mongoose.model('AppointmentNotes', AppointmentNotes);
module.exports = AppointmentNotes;


