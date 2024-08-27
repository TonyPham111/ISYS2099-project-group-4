export async function getAllAppointment(req, res) {
  try {
    //verify job role = (doctor || nurse || frontdesk)
    //return data
    /*
       data structure:
       [
        {
            "id": INT,
            "purpose_of_appointment": String,
            "patient_id": INT,
            "doctor_id": INT,
            "date": String --> "DD/MM/YYYY",
            "start_time": String --> "HH:mm:ss",
            "end_time": String --> "HH:mm:ss",
            "before_note": JSON --> in tiptap format,
            "during_note": JSON --> in tiptap format,
            "after_note": JSON --> in tiptap format 
        },
        ] 
       */
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function updateSpecificAppointment(req, res) {
  try {
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
    //verify job role = frontdesk
    /*
    delete condition: 
    - can only delete if it is before appointment time
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
