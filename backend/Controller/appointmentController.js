import frontDeskRepo from "../Models/FrontDeskModel.js";
import AppointmentNotes from '../../database/Mongodb/schemas/AppointmentNotes.js';
import { createAppointmentNoteFromPreNote } from '../../database/Mongodb/Methods.js';

export async function getAllAppointment(req, res) {
  try {
    console.log("User info from token:", req.user);
    const user_info = req.user;
    
    if (!user_info) {
      console.log("No user info found in request");
      return res.status(401).json({ message: "No user information found" });
    }

    // Modify this line to handle both "FrontDesk" and "Front Desk"
    if (user_info.role !== 'FrontDesk' && user_info.role !== 'Front Desk') {
      console.log("Unauthorized access attempt. User role:", user_info.role);
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    console.log("Fetching appointments...");
    // Fetch appointments from SQL database
    const appointments = await frontDeskRepo.GetAllAppointments();
    console.log("Appointments fetched:", appointments.length);

    // Fetch corresponding notes from MongoDB
    const appointmentIds = appointments.map(app => app.id);
    const notes = await AppointmentNotes.find({ _id: { $in: appointmentIds } });

    // Combine SQL and MongoDB data
    const combinedAppointments = appointments.map(appointment => {
      const appointmentNotes = notes.find(note => note._id.toString() === appointment.id.toString());
      return {
        id: appointment.id,
        purpose_of_appointment: appointment.purpose_of_appointment,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        date: formatDate(appointment.date), 
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        before_note: appointmentNotes ? appointmentNotes.pre_appointment_note : {},
        during_note: appointmentNotes ? appointmentNotes.during_document_note : {},
        after_note: appointmentNotes ? appointmentNotes.post_appointment_note : {}
      };
    });

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
    const {
      booked_date,
      booked_start_time,
      booked_end_time,
      department_id
    } = req.body;

    if (user_info.role !== 'FrontDesk' && user_info.role !== 'Front Desk') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const availability = await frontDeskRepo.CheckAvailability(booked_date, booked_start_time, booked_end_time, department_id);
    return res.status(200).json({ available: availability });
  } catch (error) {
    console.error("Error in CheckAvailability:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function addNewAppointment(req, res) {
  try {
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

    // Check availability first
    const availability = await frontDeskRepo.CheckAvailability(
      appointment_date,
      appointment_start_time,
      appointment_end_time,
      department_id
    );

    if (!availability) {
      return res.status(400).json({ message: 'The selected time slot is not available' });
    }

    // Create a new document in MongoDB using the method from Methods.js
    let newAppointmentNote;
    try {
      newAppointmentNote = await createAppointmentNoteFromPreNote(pre_appointment_note);
    } catch (error) {
      console.error("Error creating appointment note in MongoDB:", error);
      if (error instanceof mongoose.Error) {
        return res.status(500).json({ message: "Database connection error. Please try again later." });
      }
      return res.status(500).json({ message: "Error creating appointment note. Please try again." });
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

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId: result.insertId,
      documentId: document_id
    });
  } catch (error) {
    console.error("Error in addNewAppointment:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function updateAppointmentNotes(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === "Doctor"){
      // Edit the post_appointment and during appointment note in the corresponding document in mongodb
    }

    //verify job role = doctor
    /*
    update condition:
    - can only update if still in allow time
    update data: 
    - during Note
    - after Note
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteSpecificAppointment(req, res) {
  try {
    const user_info = req.user
    const appointment_id = req.params.appointmentId

    if (user_info.role === 'FrontDesk'){
        frontDeskRepo.CancelAnAppointment(appointment_id)
    }
    //verify job role = frontdesk
    /*
    delete condition: 
    - can only delete if it is before appointment time
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
