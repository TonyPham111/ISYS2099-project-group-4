import { poolNurses } from './dbConnectionConfiguration.js';

const nurseRepo = {
    GetPatientsAllergies: async (patient_id) => {
        try {
            const sql = `CALL FetchPatientsAllergies(?)`;
            const [results] = await poolNurses.query(sql, [patient_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    GetPatientsInfo: async () => {
        try {
            const sql = `CALL GetPatientsInfoForNurse()`;
            const [results] = await poolNurses.query(sql, []);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    FetchTestDetailsByPatientId: async (patient_id) => {
        try {
            const sql = `CALL FetchTestDetailsByPatientId(?)`;
            const [results] = await poolNurses.query(sql, [patient_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    FetchDiagnosesByPatientId: async (patient_id) => {
        try {
            const sql = `CALL FetchDiagnosesByPatientId(?)`;
            const [results] = await poolNurses.query(sql, [patient_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    FetchPrescriptionsByPatientId: async (para_patient_id) => {
        try {
            const sql = `CALL FetchPrescriptionsByPatientId(?)`;
            const [results] = await poolNurses.query(sql, [para_patient_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    UpdateTestDetail: async (para_test_order_id) => {
        try {
            const sql = `CALL UpdateTestDetail(?)`;
            const [results] = await poolNurses.query(sql, [para_test_order_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    FetchStaffInfoById: async (staff_id) => {
        try {
            const sql = `CALL FetchStaffInfoById(?)`;
            const [results] = await poolNurses.query(sql, [staff_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    Scheduling: async (manager_id, staff_id, schedule_string) => {
        try {
            const sql = `CALL Scheduling(?, ?, ?)`;
            const [results] = await poolNurses.query(sql, [manager_id, staff_id, schedule_string]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
        try {
            const sql = `CALL DeleteSchedule(?, ?, ?)`;
            const [results] = await poolNurses.query(sql, [manager_id, staff_id, schedule_string]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    GetSubordinates: async (manager_id) => {
        try {
            const sql = `CALL GetStaffUnderManager(?)`;
            const [results] = await poolNurses.query(sql, [manager_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
        try {
            const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
            const [results] = await poolNurses.query(sql, [manager_id, staff_id, evaluation_string]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    GetSubordinatesSchedule: async (manager_id, staff_id) => {
        try {
            const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
            const [results] = await poolNurses.query(sql, [staff_id, manager_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },
    GetAllPerformanceEvaluation: async (manager_id, staff_id) => {
        try {
          const sql = `CALL GetAllPerformanceEvaluationByStaff(?, ?)`;
          const [results] = await poolNurses.query(sql, [manager_id, staff_id]);
          return results;
        } catch (error) {
          throw new Error(error.message);
        }
      },
      GetEvaluationDetails: async (manager_id, staff_id, evaluation_id) => {
        try {
          const sql = `CALL GetEvaluationDetails(?, ?, ?)`;
          const [results] = await poolNurses.query(sql, [manager_id, staff_id, evaluation_id]);
          return results;
        } catch (error) {
          throw new Error(error.message);
        }
      },
      CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
        try {
          const sql = `CALL StaffEvaluate(?, ?, ?)`;
          const [results] = await poolNurses.query(sql, [
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

export default nurseRepo;