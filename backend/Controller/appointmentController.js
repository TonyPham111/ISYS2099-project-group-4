import frontDeskRepo from "../Models/FrontDeskModel.js";

export async function getAllAppointment(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === 'FrontDesk'){
      const result = await frontDeskRepo.GetAllAppointments()
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
    //Fetch the appointment notes information from mongodb appointment_documents

    //verify job role = (frontdesk)
    //return data
    /*
       data structure:
       [
        {
            "id": INT,
            "purpose_of_appointment": String,
            "patient_id": INT,
            "doctor_id": INT,
            "date": String --> "DD/MM/YYYY", // Before returning the result to the client, convert the date format to DD/MM/YYYY from YYYY-MM-DD
            "start_time": String --> "HH:mm:ss",
            "end_time": String --> "HH:mm:ss",
            "before_note": JSON --> in tiptap format, // Cái này hiện tại cứ để dạng string nha em
            "during_note": JSON --> in tiptap format, // Cái này hiện tại cứ để dạng string nha em
            "after_note": JSON --> in tiptap format // Cái này hiện tại cứ để dạng string nha em
        },
        ] 
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
      res.status(403).json({ message: "Incorrect role." })
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
    -appointment_charge? ( auto charge based on time or manual charge)
    */
  //return upload status
  try {
    const user_info = req.user
    const {
      patient_id,
      doctor_id,
      department_id, // Anh vừa thêm cái department id này vào để check xem doctor có còn ở department mà patient muốn book không
      purpose,
      appointment_date, // Check format first, convert to YYYY-MM_DD format before inserting into database
      appointment_start_time,
      appointment_end_time,
      pre_appointment_note
    } = req.body
    const document_id = ''
    // Create a new document in mongo db
    // insert the pre appointment note
    // Retrieve the document id
    if (user_info.role === 'FrontDesk'){
      const result = await frontDeskRepo.AddNewAppointment(
        department_id, doctor_id, patient_id, purpose, appointment_date, appointment_start_time, appointment_end_time, document_id
      )
      res.status(200).json(result)
    } 
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
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
      const result = await frontDeskRepo.CancelAnAppointment(appointment_id)
      res.status(200).json(result)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
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
