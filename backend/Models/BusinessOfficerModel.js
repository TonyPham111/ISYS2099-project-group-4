import { getBillingDetail } from '../Controller/BillingController.js';
import { poolBusinessOfficers, poolDoctors } from './dbConnectionConfiguration.js';

const businessOfficerRepo = {
  GetPatientsInfo: async () => {
    try {
      const sql = `CALL FetchPatientsPersonalInfo()`;
      const [results] = await poolBusinessOfficers.query(sql, []);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetBillingDetails: async (id) => {
    try {
      const sql = `CALL GetBillingDetails(?)`;
      const [results] = await poolBusinessOfficers.query(sql, [id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolBusinessOfficers.query(sql, [staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Scheduling: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL Scheduling(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL DeleteSchedule(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinates: async (manager_id) => {
    try {
      const sql = `CALL GetStaffUnderManager(?)`;
      const [results] = await poolBusinessOfficers.query(sql, [manager_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolBusinessOfficers.query(sql, [staff_id, manager_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolBusinessOfficers.query(sql, [staff_id, manager_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetAllPerformanceEvaluation: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAllPerformanceEvaluationByStaff(?, ?)`;
      const [results] = await poolBusinessOfficers.query(sql, [manager_id, staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetEvaluationDetails: async (manager_id, staff_id, evaluation_id) => {
    try {
      const sql = `CALL GetEvaluationDetails(?, ?, ?)`;
      const [results] = await poolBusinessOfficers.query(sql, [manager_id, staff_id, evaluation_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL StaffEvaluate(?, ?, ?)`;
      const [results] = await poolBusinessOfficers.query(sql, [
        manager_id,
        staff_id,
        evaluation_string,
      ]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllBillings: async () => {
    try {
      const sql = `CALL GetAllBillings()`;
      const [results] = await poolBusinessOfficers.query(sql, []);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetBillingDetail: async (billing_id) => {
    try {
      const sql = `CALL GetBillingDetails(?)`;
      const [results] = await poolBusinessOfficers.query(sql, [billing_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CreateNewBilling: async (patient_id, appointment_id, test_id, prescription_id) => {
    try {
      const sql = `CALL InsertNewBilling(?, ?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [
        patient_id,
        appointment_id,
        test_id,
        prescription_id,
      ]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default businessOfficerRepo;