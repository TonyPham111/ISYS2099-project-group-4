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
        price_per_unit: 10.000,
      },
      {
        drug_name: "Vitamin E",
        quantity: 10,
        unit: "tablet",
        price_per_unit: 5.000,
      },
    ],
    total_price: 150.000,
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
        price_per_unit: 10.000,
      },
      {
        drug_name: "Vitamin E",
        quantity: 10,
        unit: "tablet",
        price_per_unit: 5.000,
      },
      {
        drug_name: "Vitamin C",
        quantity: 5,
        unit: "tablet",
        price_per_unit: 5.000,
      },
      {
        drug_name: "Vitamin D",
        quantity: 3,
        unit: "tablet",
        price_per_unit: 5.000,
      },
    ],
    total_price: 190.000,
    doctor_note: ""
  },
];
