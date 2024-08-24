export const patient = [
  {
    id: 1,
    first_name: "Tony",
    last_name: "Pham",
    gender: "Male",
    birth_date: "11/09/2024",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 2,
    first_name: "Khoi",
    last_name: "Ly",
    gender: "Male",
    birth_date: "01/01/2005",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 3,
    first_name: "Khoi",
    last_name: "Ly",
    gender: "Male",
    birth_date: "01/01/1995",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 4,
    first_name: "David",
    last_name: "Pham",
    gender: "Male",
    birth_date: "02/05/2005",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
];

export const treatmentHistory = [
  {
    treatment_id: 1,
    patient_id: 1,
    doctor_id: 1,
    date: "16/07/2024",
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
    date: "16/04/2024",
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
export const drugs = [
  {
    drug_code: 1,
    drug_name: "Augmentin 625 Duo Tablet",
    inventory: 1000,
    unit: "tablet",
    price_per_unit: 233.42,
  },
  {
    drug_code: 2,
    drug_name: "Azithral 500 Tablet,1000",
    inventory: 1000,
    unit: "tablet",
    price_per_unit: 132.36,
  },
];
export const diagnosis = [
  {
    diagnosis_id: 1,
    doctor_id: 2,
    diagnosis_date: "11/07/2024",
  },
  {
    diagnosis_id: 2,
    doctor_id: 5,
    diagnosis_date: "11/07/2024",
  },
];
export const specificDiagnosis = {
  id: 1,
  doctor_id: 2,
  diagnosis_date: "11/07/2024",
  condition: [
    {
      code: "A001",
      name: "Cholera due to Vibrio cholerae 01, biovar eltor	",
      description:
        "A medical condition known as cholera due to vibrio cholerae 01, biovar eltor.",
    },
    {
      code: "A0100",
      name: "Typhoid fever, unspecified",
      description: "A medical condition known as typhoid fever, unspecified.",
    },
  ],
  diagnosis_image: [],
  diagnosis_note:
    "please give everyone in department this patient information, this is emergency!",
};

export const staffs = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Le",
    job: "Nurse",
    gender: "Female",
    birth_date: "12/04/2005",
    home_address: "789 Tran Hung Dao, District 1, HCMC",
    contact_phone_number: "028-7654-3210",
    email: "alice.le.nurse@gmail.com",
    wage: 19000000,
    hire_date: "20/11/2021",
    employment_type: "shift based",
  },
  {
    id: 2,
    first_name: "Brian",
    last_name: "Nguyen",
    job: "Doctor",
    gender: "Male",
    birth_date: "23/01/1998",
    home_address: "123 Pasteur Street, District 3, HCMC",
    contact_phone_number: "028-6543-2109",
    email: "brian.nguyen.md@gmail.com",
    wage: 25000000,
    hire_date: "13/03/2024",
    employment_type: "fulltime",
  },
  {
    id: 3,
    first_name: "Clara",
    last_name: "Tran",
    job: "Frontdesk",
    gender: "Female",
    birth_date: "18/07/1997",
    home_address: "25 Ly Tu Trong, District 1, HCMC",
    contact_phone_number: "028-1234-5678",
    email: "clara.tran.frontdesk@gmail.com",
    wage: 14000000,
    hire_date: "01/06/2023",
    employment_type: "shift based",
  },
  {
    id: 4,
    first_name: "Daniel",
    last_name: "Hoang",
    job: "HR",
    gender: "Male",
    birth_date: "14/09/q985",
    home_address: "789 Nguyen Van Cu, District 5, HCMC",
    contact_phone_number: "028-0987-6543",
    email: "daniel.hoang.hr@gmail.com",
    wage: 16000000,
    hire_date: "20/11/2021",
    employment_type: "fulltime",
  },
  {
    id: 5,
    first_name: "Tony",
    last_name: "Pham",
    job: "Doctor",
    gender: "Male",
    birth_date: "23/01/1988",
    home_address: "123 Pasteur Street, District 3, HCMC",
    contact_phone_number: "028-6543-2109",
    email: "brian.nguyen.md@gmail.com",
    wage: 25000000,
    hire_date: "12/03/2022",
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
    date: "25/08/2024",
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
    date: "25/08/2024",
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
    date: "25/08/2024",
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
    date: "15/08/2024",
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
    date: "25/08/2024",
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

export const diagnosisData = [
  {
    code: "A001",
    name: "Cholera due to Vibrio cholerae 01, biovar elto",
    description:
      "A medical condition known as cholera due to vibrio cholerae 01, biovar eltor.",
  },
  {
    code: "A009",
    name: "Cholera, unspecified",
    description: "A medical condition known as cholera, unspecified.",
  },
  {
    code: "A0100",
    name: "Typhoid fever, unspecified",
    description: "A medical condition known as typhoid fever, unspecified.",
  },
  {
    code: "A0101",
    name: "Typhoid meningitis",
    description: "A medical condition known as typhoid meningitis.",
  },
];
