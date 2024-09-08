import frontDeskRepo from "../Models/FrontDeskModel.js";
import AppointmentNotes from '../MongodbRepo/schemas/AppointmentNotes.js';
import mongoose from "mongoose";
import { createAppointmentNoteFromPreNote } from '../MongodbRepo/Methods.js';

export async function getAllAppointment(req, res) {
  try {
    const user_info = req.user;
    if (!user_info) {
      return res.status(401).json({ message: "No user information found" });
    }

    if (user_info.role !== 'FrontDesk' && user_info.role !== 'Front Desk') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Fetch appointments from SQL database
    const appointments = await frontDeskRepo.GetAllAppointments(req.query.patientName, req.query.doctorId, req.query.from, req.query.to, req.query.employmentStatus);
    // Fetch corresponding notes from MongoDB
    const appointmentIds = appointments[0].map(app => app.appointment_notes_document_id);
    const notes = await AppointmentNotes.find({ _id: { $in: appointmentIds } });
    // Combine SQL and MongoDB data
    const combinedAppointments = appointments[0].map(appointment => {

      const appointmentNotes = notes.find(note => note._id.toString() === appointment.appointment_notes_document_id);
      return {
        id: appointment.id,
        purpose_of_appointment: appointment.purpose_of_appointment,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        date: appointment.date, 
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        status: appointment.appointment_status,
        before_note: appointmentNotes ? appointmentNotes.pre_appointment_note : {},
        during_note: appointmentNotes ? appointmentNotes.during_document_note : {},
        after_note: appointmentNotes ? appointmentNotes.post_appointment_note : {}
      };
    });
    console.log(combinedAppointments)

    res.status(200).json(combinedAppointments);
  } catch (error) {
    console.error("Error in getAllAppointment:", error);
    res.status(500).json({ message: error.message });
  }
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // This will format the date as DD/MM/YYYY
}

export async function CheckAvailability(req, res) {
  try {
    const user_info = req.user;
    const { booked_date, booked_start_time, booked_end_time, department_id } = req.body;

    if (user_info.role !== 'FrontDesk' && user_info.role !== 'Front Desk') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const availability = await frontDeskRepo.CheckAvailability(booked_date, booked_start_time, booked_end_time, department_id);
    return res.status(200).json(availability[0]);
  } catch (error) {
    console.error("Error in CheckAvailability:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function addNewAppointment(req, res) {
  const transaction = await mongoose.startSession()
  try {
    transaction.startTransaction()
    console.log(transaction.toString())
    const user_info = req.user;
    if (user_info.role !== 'FrontDesk' && user_info.role !== 'Front Desk') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const {
      patient_id,
      doctor_id,
      department_id,
      purpose,
      appointment_date,
      appointment_start_time,
      appointment_end_time,
      pre_appointment_note
    } = req.body;

    // Create a new document in MongoDB using the method from Methods.js
    let newAppointmentNote;
    try {
      newAppointmentNote = await createAppointmentNoteFromPreNote(pre_appointment_note, {transaction});
    } catch (error) {
      console.error("Error creating appointment note in MongoDB:", error);
      return res.status(500).json({ message: error.message });
    }

    // Retrieve the document id from MongoDB
    const document_id = newAppointmentNote._id.toString();

    // Add the new appointment to the SQL database
    const result = await frontDeskRepo.AddNewAppointment(
      department_id,
      doctor_id,
      patient_id,
      purpose,
      appointment_date,
      appointment_start_time,
      appointment_end_time,
      document_id
    );

    await transaction.commitTransaction()
    res.status(201).json({
      message: 'Appointment created successfully',
    }
  
  );
  } catch (error) {
    await transaction.abortTransaction()
    console.log("Operation Aborted");
    res.status(500).json({ message: error.message });
  } finally {
    transaction.endSession()
  }
}

export async function updateAppointmentNotes(req, res) {
  try {
    const user_info = req.user;
    if (user_info.role !== "Doctor") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Logic to edit the post_appointment and during appointment note in the corresponding document in MongoDB

    res.status(200).json({ message: "Notes updated successfully" });
  } catch (error) {
    console.error("Error in updateAppointmentNotes:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function deleteSpecificAppointment(req, res) {
  try {
    const user_info = req.user;
    const appointment_id = req.params.appointmentId;

    if (user_info.role !== 'FrontDesk') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await frontDeskRepo.CancelAnAppointment(appointment_id);

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error("Error in deleteSpecificAppointment:", error);
    res.status(500).json({ message: error.message });
  }
}