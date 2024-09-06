import mongoose from 'mongoose';

// Pre-Appointments Notes ( Symptoms  )
const appointmentNotesSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
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
export default AppointmentNotes;

