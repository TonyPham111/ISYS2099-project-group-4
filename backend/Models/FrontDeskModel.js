import { poolFrontDesk } from './dbConnectionConfiguration.js';

const frontDeskRepo = {
  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolFrontDesk.query(sql, [staff_id]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  AddNewPatients: async (full_name, gender, birth_date, phone_number, home_address) => {
    try {
      const sql = `CALL AddNewPatient(?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [full_name, gender, birth_date, phone_number, home_address]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  UpdatePatientsInfo: async (full_name, gender, birth_date, phone_number, home_address) => {
    try {
      const sql = `CALL UpdatePatient(?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [full_name, gender, birth_date, phone_number, home_address]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetPatientsInfo: async () => {
    try {
      const sql = `CALL FetchPatientsPersonalInfo()`;
      const [results] = await poolFrontDesk.query(sql, []);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CheckAvailability: async (booked_date, start_time, end_time, department_id) => {
    try {
      const sql = `CALL CheckAvailability(?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [booked_date, start_time, end_time, department_id]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  AddNewAppointment: async (department_id, para_doctor_id, patient_id, purpose, appointment_date, start_time, end_time, document_string) => {
    try {
      const sql = `CALL AddNewAppointment(?, ?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [department_id, para_doctor_id, patient_id, purpose, appointment_date, start_time, end_time, document_string]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CancelAnAppointment: async (appointment_id) => {
    try {
      const sql = `CALL CancelAnAppointment(?)`;
      const [results] = await poolFrontDesk.query(sql, [appointment_id]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Scheduling: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL Scheduling(?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id, staff_id, schedule_string]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL DeleteSchedule(?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id, staff_id, schedule_string]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinates: async (manager_id) => {
    try {
      const sql = `CALL GetStaffUnderManager(?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id, staff_id, evaluation_string]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [staff_id, manager_id]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllAppointments: async () => {
    try {
      const sql = `CALL GetAllAppointments()`;
      const [results] = await poolFrontDesk.query(sql, []);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetAllPerformanceEvaluation: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAllPerformanceEvaluationByStaff(?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id, staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetEvaluationDetails: async (manager_id, staff_id, evaluation_id) => {
    try {
      const sql = `CALL GetEvaluationDetails(?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [manager_id, staff_id, evaluation_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL StaffEvaluate(?, ?, ?)`;
      const [results] = await poolFrontDesk.query(sql, [
        manager_id,
        staff_id,
        evaluation_string,
      ]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default frontDeskRepo;