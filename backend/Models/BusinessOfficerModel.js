// Importing dependencies using ES module syntax
import { getBillingDetail } from '../Controller/BillingController.js';
import { poolBusinessOfficers, poolDoctors } from './dbConnectionConfiguration.js';

// Define queries object with async functions
const queries = {
  GetPatientsInfo: async () => {
    try {
      const sql = `CALL FetchPatientsPersonalInfo()`;
      const [results] = await poolBusinessOfficers.query(sql, []);
      return results;
    } catch (error) {
      console.error("Error executing FetchPatientsPersonalInfo:", error);
      return {
        error: "An error occurred while executing FetchPatientsPersonalInfo. Please try again later.",
      };
    }
  },

  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolBusinessOfficers.query(sql, [staff_id]);
      return results;
    } catch (error) {
      console.error("Error executing FetchStaffInfoById:", error);
      return {
        error: "An error occurred while executing FetchStaffInfoById. Please try again later.",
      };
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
      const [results] = await poolBusinessOfficers.query(sql, [manager_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetSubordinates:", error);
      return {
        error: "An error occurred while executing GetSubordinates. Please try again later.",
      };
    }
  },

  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolBusinessOfficers.query(sql, [staff_id, manager_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetAppointmentsAndSchedulesByStaff:", error);
      return {
        error: "An error occurred while executing GetAppointmentsAndSchedulesByStaff. Please try again later.",
      };
    }
  },

  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
      const [results] = await poolBusinessOfficers.query(sql, [
        manager_id,
        staff_id,
        evaluation_string,
      ]);
      return results;
    } catch (error) {
      console.error("Error executing CreateNewEvaluation:", error);
      return {
        error: "An error occurred while executing CreateNewEvaluation. Please try again later.",
      };
    }
  },

  GetAllBillings: async () => {
    try {
      const sql = `CALL GetAllBillings()`;
      const [results] = await poolBusinessOfficers.query(sql, []);
      return results;
    } catch (error) {
      console.error("Error executing GetAllBillings:", error);
      return {
        error: "An error occurred while executing GetAllBillings. Please try again later.",
      };
    }
  },

  GetBillingDetail: async (billing_id) => {
    try {
      const sql = `CALL GetBillingDetails(?)`;
      const [results] = await poolBusinessOfficers.query(sql, [billing_id]);
      return results;
    } catch (error) {
      console.error("Error executing GetBillingDetail:", error);
      return {
        error: "An error occurred while executing GetBillingDetail. Please try again later.",
      };
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
      console.error("Error executing CreateNewBilling:", error);
      return {
        error: "An error occurred while executing CreateNewBilling. Please try again later.",
      };
    }
  },
};


export default queries;
