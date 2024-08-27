export async function getAllStaffsInfo(req, res) {
  try {
    //job role = HR
    //return all staff data
    //OR for loop
    //return staff data IN condtion:
    //conditon : staff.manager_id == req user.id
    //return data
    /*
       data structure: 
       [
        [
           {
             "id": INT,
             "manager_id": INT,
             "full_name": String,
             "department": String --> department_name,
             "job": String --> job_name,
             "gender": String,
             "birth_date": String --> "DD/MM/YYYY",
             "home_address": String, 
             "contact_phone_number": String, 
             "email": String, 
             "wage": DECIMAL(6, 2),
             "hire_date": String --> "DD/MM/YYYY",
             "employment_type": String --> from ENUM (shift_based || fullTime)
           },
       ]
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addNewStaff(req, res) {
  try {
    //verify job role = HR
    /*
    input data: 
    - "manager_id": INT,
    - "full_name": String,
    - "department_id": INT,
    - "job_id": INT,
    - "gender": String,
    - "birth_date": String --> "DD/MM/YYYY",
    - "home_address": String, 
    - "contact_phone_number": String, 
    - "email": String, 
    - "wage": DECIMAL(6, 2),
    - "hire_date": String --> "DD/MM/YYYY",
    - "employment_type": String --> from ENUM (shift_based || fullTime) 
    */
    //return add new staff status
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSpecificStaffInfo(req, res) {
  try {
    //verify job role = HR || staff.manager_id = req user.id
    /*
       data structure: 
           {
             "id": INT,
             "manager_id": INT,
             "full_name": String,
             "department": String --> department_name,
             "job": String --> job_name,
             "gender": String,
             "birth_date": String --> "DD/MM/YYYY",
             "home_address": String, 
             "contact_phone_number": String, 
             "email": String, 
             "wage": DECIMAL(6, 2),
             "hire_date": String --> "DD/MM/YYYY",
             "employment_type": String --> from ENUM (shift_based || fullTime)
           },
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSpecificStaffInfo(req, res) {
  try {
    //verify job role = HR
    /*
       data structure: 
           {
             "manager_id": INT,
             "full_name": String,
             "department": String --> department_name,
             "job": String --> job_name,
             "gender": String,
             "birth_date": String --> "DD/MM/YYYY",
             "home_address": String, 
             "contact_phone_number": String, 
             "email": String, 
             "wage": DECIMAL(6, 2),
             "hire_date": String --> "DD/MM/YYYY",
             "employment_type": String --> from ENUM (shift_based || fullTime)
           },
       */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getStaffSchedule(req, res) {
  try {
    //verify staff id have manager_id == req user.id
    //return data
    /*
    data structure: 
    {
      "staff_id": INT,
      "staff_schedule": [
        {
          "id": 1,
          "date": "01/07/2024",
          "start_time": "08:00:00",
          "end_time": "17:00:00"
        }
      ],
      "staff_appointment": [
         {
             "id": INT,
             "purpose_of_appointment": String,
             "patient_id": INT,
             "doctor_id": INT,
             "date": String --> "DD/MM/YYYY",
             "start_time": String --> "HH:mm:ss",
             "end_time": String --> "HH:mm:ss",
             "before_note": JSON in tiptap format,
             "during_note": JSON in tiptap format,
             "after_note": JSON in tiptap format,
         },
      ]
    },
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSpecificStaffSchedule(req, res) {
  try {
    //verify staff id have manager_id == req user.id
    /*
    update data: 
    - deleted schedule --> array of schedule id
    -- add schedule 
    ---> ARRAY [schedule_input]
    schedule input:
     {
        "start_time": String --> "HH:mm:ss",
        "end_time": String --> "HH:mm:ss",
        attachments: [
            BLOB?
            text?
        ]?
     }
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
