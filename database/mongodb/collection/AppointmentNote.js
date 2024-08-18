async function createAppointmentNotes(db) {
    await db.createAppointmentNotes("appointment_notes");
    console.log("Created Appointment Notes database and collections.");
  }
  
  exports.createAppointmentNotes = createAppointmentNotes;