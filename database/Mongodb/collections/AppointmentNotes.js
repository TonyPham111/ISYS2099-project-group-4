const mongoose = require('mongoose');


// Pre-Appointments Notes ( Symptoms  )
const appointmentNotesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pre_appointment_note: {
        type: Object,
        default: {}
    },
    post_appointment_note: {
        type: Object,
        default: {}
    },
    during_document_note: {
        type: Object,
        default: {}
    },
}, { timestamps: true });

const AppointmentNotes = mongoose.model('AppointmentNotes', appointmentNotesSchema);
module.exports = AppointmentNotes;

