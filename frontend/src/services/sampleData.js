export const patient = [
  {
    id: 1,
    first_name: "Tony",
    last_name: "Pham",
    gender: "Male",
    birth_date: "2024-09-11",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 2,
    first_name: "Khoi",
    last_name: "Ly",
    gender: "Male",
    birth_date: "2010-01-01",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 3,
    first_name: "Khoi",
    last_name: "Ly",
    gender: "Male",
    birth_date: "2010-01-01",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 4,
    first_name: "David",
    last_name: "Pham",
    gender: "Male",
    birth_date: "2005-05-02",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
];

export const treatmentHistory = [
  {
    treatment_id: 1,
    patient_id: 1,
    doctor_id: 1,
    date: "2024-06-16",
    start_time: "08:30",
    end_time: "10:00",
    prescription: [
      {
        drug_name: "Caffeine",
        quantity: 10,
        unit: "100gam",
        price_per_unit: 10000,
      },
      {
        drug_name: "Vitamin E",
        quantity: 10,
        unit: "tablet",
        price_per_unit: 5000,
      },
    ],
    total_price: 150.0,
    doctor_note: null,
  },
  {
    treatment_id: 2,
    patient_id: 1,
    doctor_id: 1,
    date: "2024-06-14",
    start_time: "08:30",
    end_time: "10:00",
    prescription: [
      {
        drug_name: "Caffeine",
        quantity: 10,
        unit: "100gam",
        price_per_unit: 10000,
      },
      {
        drug_name: "Vitamin E",
        quantity: 10,
        unit: "tablet",
        price_per_unit: 5000,
      },
      {
        drug_name: "Vitamin C",
        quantity: 5,
        unit: "tablet",
        price_per_unit: 5000,
      },
      {
        drug_name: "Vitamin D",
        quantity: 3,
        unit: "tablet",
        price_per_unit: 5000,
      },
    ],
    total_price: 190000,
    doctor_note: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "please drink this 3 date a time" }],
        },
      ],
    },
  },
];

export const staffs = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Le",
    job: "Nurse",
    gender: "Female",
    birth_date: "1992-04-12",
    home_address: "789 Tran Hung Dao, District 1, HCMC",
    contact_phone_number: "028-7654-3210",
    email: "alice.le.nurse@gmail.com",
    wage: 19000000,
    hire_date: "2021-11-20",
    employment_type: "shift based",
  },
  {
    id: 2,
    first_name: "Brian",
    last_name: "Nguyen",
    job: "Doctor",
    gender: "Male",
    birth_date: "1988-01-23",
    home_address: "123 Pasteur Street, District 3, HCMC",
    contact_phone_number: "028-6543-2109",
    email: "brian.nguyen.md@gmail.com",
    wage: 25000000,
    hire_date: "2022-03-12",
    employment_type: "fulltime",
  },
  {
    id: 3,
    first_name: "Clara",
    last_name: "Tran",
    job: "Frontdesk",
    gender: "Female",
    birth_date: "1995-07-18",
    home_address: "25 Ly Tu Trong, District 1, HCMC",
    contact_phone_number: "028-1234-5678",
    email: "clara.tran.frontdesk@gmail.com",
    wage: 14000000,
    hire_date: "2023-06-01",
    employment_type: "shift based",
  },
  {
    id: 4,
    first_name: "Daniel",
    last_name: "Hoang",
    job: "HR",
    gender: "Male",
    birth_date: "1985-09-14",
    home_address: "789 Nguyen Van Cu, District 5, HCMC",
    contact_phone_number: "028-0987-6543",
    email: "daniel.hoang.hr@gmail.com",
    wage: 16000000,
    hire_date: "2021-11-20",
    employment_type: "fulltime",
  },
  {
    id: 5,
    first_name: "Tony",
    last_name: "Pham",
    job: "Doctor",
    gender: "Male",
    birth_date: "1988-01-23",
    home_address: "123 Pasteur Street, District 3, HCMC",
    contact_phone_number: "028-6543-2109",
    email: "brian.nguyen.md@gmail.com",
    wage: 25000000,
    hire_date: "2022-03-12",
    employment_type: "fulltime",
  },
];

export const availableTime = [
  {
    doctor_id: 2,
    first_name: "Brian",
    last_name: "Nguyen",
    gender: "Male",
    available_status: "available",
  },
  {
    doctor_id: 5,
    first_name: "Tony",
    last_name: "Pham",
    gender: "Male",
    available_status: "available",
  },
];

export const appointment = [
  {
    id: 2,
    purpose_of_appointment: "arm pain",
    patient_id: 3,
    doctor_id: 2,
    date: "2024-08-25",
    start_time: "13:30:00",
    end_time: "14:00:00",
    before_note: "my arm is in pain",
    during_note: "beware with poison food please",
    after_note: "just dont do stupid thing, stupid patient!",
  },
  {
    id: 3,
    purpose_of_appointment: "arm pain",
    patient_id: 3,
    doctor_id: 2,
    date: "2024-08-25",
    start_time: "14:30:00",
    end_time: "15:00:00",
    before_note: "my arm is in pain",
    during_note: "beware with poison food please",
    after_note: "just dont do stupid thing, stupid patient!",
  },
  {
    id: 4,
    purpose_of_appointment: "arm pain",
    patient_id: 3,
    doctor_id: 2,
    date: "2024-08-25",
    start_time: "15:30:00",
    end_time: "16:00:00",
    before_note: "my arm is in pain",
    during_note: "beware with poison food please",
    after_note: "just dont do stupid thing, stupid patient!",
  },
  {
    id: 5,
    purpose_of_appointment: "leg pain",
    patient_id: 3,
    doctor_id: 5,
    date: "2024-08-15",
    start_time: "15:30:00",
    end_time: "16:00:00",
    before_note: "my arm is in pain",
    during_note: "beware with poison food please",
    after_note: "just dont do stupid thing, stupid patient!",
  },
];

export const workingTime = [
  {
    id: 1,
    staff_id: 2,
    date: "2024-08-25",
    start_time: "8:30:00",
    end_time: "17:00:00",
  },
];

export const job = [
  {
    id: 1,
    job_name: "Doctor",
  },
  {
    id: 2,
    job_name: "Nurse",
  },
  {
    id: 3,
    job_name: "HR",
  },
  {
    id: 4,
    job_name: "FrontDesk",
  },
];

export const department = [
  {
    id: 1,
    name: "Cardiology",
  },
  {
    id: 2,
    name: "Pediatrics",
  },
  {
    id: 3,
    name: "Oncology",
  },
  {
    id: 4,
    name: "Orthopedics",
  },
];
