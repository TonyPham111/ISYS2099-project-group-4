import frontDeskRepo from "../Models/FrontDeskModel.js";
import AppointmentNotes from '../../database/Mongodb/schemas/AppointmentNotes.js';

export async function getAllAppointment(req, res) {
  try {
    const user_info = req.user;
    if (user_info.role !== 'FrontDesk') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Fetch appointments from SQL database
    const appointments = await frontDeskRepo.GetAllAppointments(req.query.patientName, req.query.doctorId, req.query.from, req.query.to);

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
    const user_info = req.user
    const {
        booked_date,
        booked_start_time,
        booked_end_time,
        department_id
    } = req.body
    if (user_info.role === 'FrontDesk'){
        frontDeskRepo.CheckAvailability(booked_date, booked_start_time, booked_end_time, department_id)
    }
    else {
      res.status('403').json({message: error.message})
    }
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addNewAppointment(req, res) {
  //verify job role = frontdesk
  /*
    input data: 
    - patient_id
    - doctor_id
    - date
    - startTime
    - endTime
    - beforeNote
    */
  //return upload status
  try {
    const user_info = req.user;
    if (user_info.role !== 'FrontDesk') {
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

    // Create a new document in MongoDB and insert the pre-appointment note
    const newAppointmentNote = await createAppointmentNoteFromPreNote(pre_appointment_note);

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
