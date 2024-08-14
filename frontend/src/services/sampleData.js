export const patient = [
  {
    id: 1,
    first_name: "Tony",
    last_name: "Pham",
    gender: "Male",
    birth_date: "10/9/2024",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 2,
    first_name: "Khoi",
    last_name: "Ly",
    gender: "Male",
    birth_date: "01/01/1010",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 3,
    first_name: "Khoi",
    last_name: "Ly",
    gender: "Male",
    birth_date: "01/01/1010",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
  {
    id: 4,
    first_name: "David",
    last_name: "Pham",
    gender: "Male",
    birth_date: "01/01/1010",
    home_address: "RMIT school is my home",
    contact_phone_number: "028-3776-1300",
  },
];

export const treatmentHistory = [
  {
    treatment_id: 1,
    patient_id: 1,
    doctor_id: 1,
    date: "16/06/2024",
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
    date: "14/06/2024",
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
          content: [{ type: "text", text: "please drink this 3 day a time" }],
        },
      ],
    },
  },
];

export const staffs = [
  {
    "id": 1,
    "first_name": "Alice",
    "last_name": "Le",
    "job": "Nurse",
    "gender": "Female",
    "birth_date": "12/04/1992",
    "home_address": "789 Tran Hung Dao, District 1, HCMC",
    "contact_phone_number": "028-7654-3210",
    "email": "alice.le.nurse@gmail.com",
    "wage": 19000000,
    "hire_date": "20/11/2021",
    "employment_type": "shift based"
  },
  {
    "id": 2,
    "first_name": "Brian",
    "last_name": "Nguyen",
    "job": "Doctor",
    "gender": "Male",
    "birth_date": "23/02/1988",
    "home_address": "123 Pasteur Street, District 3, HCMC",
    "contact_phone_number": "028-6543-2109",
    "email": "brian.nguyen.md@gmail.com",
    "wage": 25000000,
    "hire_date": "12/03/2022",
    "employment_type": "fulltime"
  },
  {
    "id": 3,
    "first_name": "Clara",
    "last_name": "Tran",
    "job": "Frontdesk",
    "gender": "Female",
    "birth_date": "18/07/1995",
    "home_address": "25 Ly Tu Trong, District 1, HCMC",
    "contact_phone_number": "028-1234-5678",
    "email": "clara.tran.frontdesk@gmail.com",
    "wage": 14000000,
    "hire_date": "01/06/2023",
    "employment_type": "shift based"
  },
  {
    "id": 4,
    "first_name": "Daniel",
    "last_name": "Hoang",
    "job": "HR",
    "gender": "Male",
    "birth_date": "14/09/1985",
    "home_address": "789 Nguyen Van Cu, District 5, HCMC",
    "contact_phone_number": "028-0987-6543",
    "email": "daniel.hoang.hr@gmail.com",
    "wage": 16000000,
    "hire_date": "20/11/2021",
    "employment_type": "fulltime"
  }
]

export const job= [
  {
    id:1,
    job_name: "Doctor",
  },
  {
    id:2,
    job_name: "Nurse"
  },
  {
    id:3,
    job_name: "HR",
  },
  {
    id:4,
    job_name: "FrontDesk"
  }
]