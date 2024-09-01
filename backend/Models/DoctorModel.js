import { poolDoctors } from './dbConnectionConfiguration.js';

const queries = {
  GetAllAllergies: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?, 1)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchPatientsAllergies:", error);
      return { error: "An error occurred while executing FetchPatientsAllergies. Please try again later." };
    }
  },

  GetAllDrugs: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchPatientsAllergies:", error);
      return { error: "An error occurred while executing FetchPatientsAllergies. Please try again later." };
    }
  },

  GetAllConditions: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchPatientsAllergies:", error);
      return { error: "An error occurred while executing FetchPatientsAllergies. Please try again later." };
    }
  },

  GetPatientsAllergies: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchPatientsAllergies:", error);
      return { error: "An error occurred while executing FetchPatientsAllergies. Please try again later." };
    }
  },

  AddAllergyToPatient: async (doctor_id, patient_id, allergy_name_string) => {
    try {
      const sql = `CALL AddAllergiesToPatients(?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, allergy_name_string]);
      return results;
    } catch (error) {
      console.error("Error executing AddAllergyToPatient:", error);
      return { error: "An error occurred while executing AddAllergyToPatient. Please try again later." };
    }
  },

  AddNewDiagnosis: async (doctor_id, patient_id, diagnosis_date, diagnosis_note, condition_code_string) => {
    try {
      const sql = `CALL AddNewDiagnosis(?, ?, ?, ?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_date, diagnosis_note, condition_code_string]);
      return results;
    } catch (error) {
      console.error("Error executing AddNewDiagnosis:", error);
      return { error: "An error occurred while executing AddNewDiagnosis. Please try again later." };
    }
  },

  AddNewPrescription: async (doctor_id, patient_id, diagnosis_id, prescription_note, medicine_quantity_string) => {
    try {
      const sql = `CALL AddNewPrescription(?, ?, ?, ?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_id, prescription_note, medicine_quantity_string]);
      return results;
    } catch (error) {
      console.error("Error executing AddNewPrescription:", error);
      return { error: "An error occurred while executing AddNewPrescription. Please try again later." };
    }
  },

  OrderTest: async (doctor_id, patient_id, administer_date, administer_time, test_code_string) => {
    try {
      const sql = `CALL OrderTest(?, ?, ?, ?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, administer_date, administer_time, test_code_string]);
      return results;
    } catch (error) {
      console.error("Error executing OrderTest:", error);
      return { error: "An error occurred while executing OrderTest. Please try again later." };
    }
  },

  FetchAppointment: async (para_doctor_id) => {
    try {
      const sql = `CALL FetchAppointmentById(?)`;
      const [results] = await poolDoctors.query(sql, [para_doctor_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchAppointment:", error);
      return { error: "An error occurred while executing FetchAppointment. Please try again later." };
    }
  },

  GetPatientsInfo: async (doctor_id) => {
    try {
      const sql = `CALL GetPatientsInfoForDoctor(?)`;
      const [results] = await poolDoctors.query(sql, [doctor_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetPatientsInfo:", error);
      return { error: "An error occurred while executing GetPatientsInfo. Please try again later." };
    }
  },

  FetchTestDetailsByPatientId: async (patient_id) => {
    try {
      const sql = `CALL FetchTestDetailsByPatientId(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchTestDetailsByPatientId:", error);
      return { error: "An error occurred while executing FetchTestDetailsByPatientId. Please try again later." };
    }
  },

  FetchDiagnosesByPatientId: async (patient_id) => {
    try {
      const sql = `CALL FetchDiagnosesByPatientId(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchDiagnosesByPatientId:", error);
      return { error: "An error occurred while executing FetchDiagnosesByPatientId. Please try again later." };
    }
  },

  FetchPrescriptionsByPatientId: async (para_patient_id) => {
    try {
      const sql = `CALL FetchPrescriptionsByPatientId(?)`;
      const [results] = await poolDoctors.query(sql, [para_patient_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchPrescriptionsByPatientId:", error);
      return { error: "An error occurred while executing FetchPrescriptionsByPatientId. Please try again later." };
    }
  },

  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolDoctors.query(sql, [staff_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchStaffInfoById:", error);
      return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
    }
  },

  Scheduling: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL Scheduling(?, ?, ?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } catch (error) {
      console.error("Error executing Schedule:", error);
      return { error: "An error occurred while executing Schedule. Please try again later." };
    }
  },

  DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL DeleteSchedule(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } catch (error) {
      console.error("Error executing Schedule:", error);
      return { error: "An error occurred while executing Schedule. Please try again later." };
    }
  },



  GetSubordinates: async (manager_id) => {
    try {
      const sql = `CALL GetStaffUnderManager(?)`;
      const [results] = await poolDoctors.query(sql, [manager_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetSubordinates:", error);
      return { error: "An error occurred while executing GetSubordinates. Please try again later." };
    }
  },

  // Not Finished
  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, evaluation_string]);
      return results;
    } catch (error) {
      console.error("Error executing CreateNewEvaluation:", error);
      return { error: "An error occurred while executing CreateNewEvaluation. Please try again later." };
    }
  },

  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolDoctors.query(sql, [staff_id, manager_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetSubordinatesSchedule:", error);
      return { error: "An error occurred while executing GetSubordinatesSchedule. Please try again later." };
    }
  },
};

export default queries;
