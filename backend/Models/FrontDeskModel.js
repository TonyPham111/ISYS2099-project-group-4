import { poolFrontDesk } from './dbConnectionConfiguration.js';
import { GetPatientsInfo, CreateNewEvaluation } from './DoctorModel.js';

const queries = {
  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolFrontDesk.query(sql, [staff_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchStaffInfoById:", error);
      return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
    }
  },

  AddNewPatients: async (full_name, gender, birth_date, phone_number, home_address) => {
    try {
      const sql = `CALL AddNewPatient(?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [full_name, gender, birth_date, phone_number, home_address]);
      return results;
    } catch (error) {
      console.error("Error executing AddNewPatients:", error);
      return { error: "An error occurred while executing AddNewPatients. Please try again later." };
    }
  },

  UpdatePatientsInfo: async (full_name, gender, birth_date, phone_number, home_address) => {
    try {
      const sql = `CALL UpdatePatient(?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [full_name, gender, birth_date, phone_number, home_address]);
      return results;
    } catch (error) {
      console.error("Error executing UpdatePatientsInfo:", error);
      return { error: "An error occurred while executing UpdatePatientsInfo. Please try again later." };
    }
  },

  GetPatientsInfo: async () => {
    try {
      const sql = `CALL FetchPatientsPersonalInfo()`;
      const [results] = await poolFrontDesk.query(sql, []);
      return results;
    } catch (error) {
      console.error("Error executing GetPatientsInfo:", error);
      return { error: "An error occurred while executing GetPatientsInfo. Please try again later." };
    }
  },

  CheckAvailability: async (booked_date, start_time, end_time, department_id) => {
    try {
      const sql = `CALL CheckAvailability(?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [booked_date, start_time, end_time, department_id]);
      return results;
    } catch (error) {
      console.error("Error executing CheckAvailability:", error);
      return { error: "An error occurred while executing CheckAvailability. Please try again later." };
    }
  },

  AddNewAppointment: async (department_id, para_doctor_id, patient_id, purpose, appointment_date, start_time, end_time, document_string) => {
    try {
      const sql = `CALL AddNewAppointment(?, ?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [department_id, para_doctor_id, patient_id, purpose, appointment_date, start_time, end_time, document_string]);
      return results;
    } catch (error) {
      console.error("Error executing AddNewAppointment:", error);
      return { error: "An error occurred while executing AddNewAppointment. Please try again later." };
    }
  },

  CancelAnAppointment: async (appointment_id) => {
    try {
      const sql = `CALL CancelAnAppointment(?)`;
      const [results] = await poolFrontDesk.query(sql, [appointment_id]);
      return results;
    } catch (error) {
      console.error("Error executing CancelAnAppointment:", error);
      return { error: "An error occurred while executing CancelAnAppointment. Please try again later." };
    }
  },

  Schedule: async (manager_id, staff_id, schedule_date, start_time, end_time, note) => {
    try {
      const sql = `CALL Schedule(?, ?, ?, ?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_date, start_time, end_time, note]);
      return results;
    } catch (error) {
      console.error("Error executing Schedule:", error);
      return { error: "An error occurred while executing Schedule. Please try again later." };
    }
  },

  ReSchedule: async (manager_id, staff_id, schedule_date, start_time, end_time, note) => {
    try {
      const sql = `CALL ReSchedule(?, ?, ?, ?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_date, start_time, end_time, note]);
      return results;
    } catch (error) {
      console.error("Error executing ReSchedule:", error);
      return { error: "An error occurred while executing ReSchedule. Please try again later." };
    }
  },

  GetSubordinates: async (manager_id) => {
    try {
      const sql = `CALL GetStaffUnderManager(?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetSubordinates:", error);
      return { error: "An error occurred while executing GetSubordinates. Please try again later." };
    }
  },

  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id, staff_id, evaluation_string]);
      return results;
    } catch (error) {
      console.error("Error executing CreateNewEvaluation:", error);
      return { error: "An error occurred while executing CreateNewEvaluation. Please try again later." };
    }
  },

  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [staff_id, manager_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetSubordinatesSchedule:", error);
      return { error: "An error occurred while executing GetSubordinatesSchedule. Please try again later." };
    }
  },

  GetAllAppointments: async () => {
    try {
      const sql = `CALL GetAllAppointments()`;
      const [results] = await poolFrontDesk.query(sql, []);
      return results;
    } catch (error) {
      console.error("Error executing GetAllAppointments:", error);
      return { error: "An error occurred while executing GetAllAppointments. Please try again later." };
    }
  }
};

export default queries;
