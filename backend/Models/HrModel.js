import { poolHR } from './dbConnectionConfiguration.js';

const hrRepo = {
  AddNewStaff: async (
    full_name, job_id, department_id, manager_id, gender, birth_date, home_address,
    phone_number, email, password, wage
  ) => {
    try {
      const sql = `CALL AddNewStaff(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [results] = await poolHR.query(sql, [
        full_name, job_id, department_id, manager_id, gender, birth_date, home_address,
        phone_number, email, password, wage
      ]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchAllStaff: async () => {
    try {
      const sql = `CALL FetchAllStaff()`;
      const [results] = await poolHR.query(sql, []);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  ChangeWage: async (staff_id, new_wage) => {
    try {
      const sql = `CALL ChangeWage(?, ?)`;
      const [results] = await poolHR.query(sql, [staff_id, new_wage]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  ChangeJob: async (staff_id, new_job_id, new_wage, new_manager_id, new_department_id) => {
    try {
      const sql = `CALL ChangeJob(?, ?, ?, ?, ?)`;
      const [results] = await poolHR.query(sql, [staff_id, new_job_id, new_wage, new_manager_id, new_department_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  ChangeDepartment: async (staff_id, new_manager_id, new_department_id) => {
    try {
      const sql = `CALL ChangeDepartment(?, ?, ?)`;
      const [results] = await poolHR.query(sql, [staff_id, new_manager_id, new_department_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  ChangeStaffPersonalInfo: async (staff_id, new_phone_number, new_email, new_password, new_home_address) => {
    try {
      const sql = `CALL ChangeStaffPersonalInfo(?, ?, ?, ?, ?)`;
      const [results] = await poolHR.query(sql, [staff_id, new_phone_number, new_email, new_password, new_home_address]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchJobChangeByStaffId: async (para_staff_id) => {
    try {
      const sql = `CALL FetchJobChangeByStaffId(?)`;
      const [results] = await poolHR.query(sql, [para_staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchWageChangeByStaffId: async (para_staff_id) => {
    try {
      const sql = `CALL FetchWageChangeByStaffId(?)`;
      const [results] = await poolHR.query(sql, [para_staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchDepartmentChangeByStaffId: async (para_staff_id) => {
    try {
      const sql = `CALL FetchDepartmentChangeByStaffId(?)`;
      const [results] = await poolHR.query(sql, [para_staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolHR.query(sql, [staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  AuthenticateUser: async (email) => {
    try {
      const sql = `CALL AuthenticateUser(?)`;
      const [results] = await poolHR.query(sql, [email]);
      return results[0][0]; // Return the first row of the result set
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Scheduling: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL Scheduling(?, ?, ?, ?, ?)`;
      const [results] = await poolHR.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL DeleteSchedule(?, ?, ?)`;
      const [results] = await poolHR.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinates: async (manager_id) => {
    try {
      const sql = `CALL GetStaffUnderManager(?)`;
      const [results] = await poolHR.query(sql, [manager_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
      const [results] = await poolHR.query(sql, [manager_id, staff_id, evaluation_string]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolHR.query(sql, [staff_id, manager_id]);
      return results[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetAllPerformanceEvaluation: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAllPerformanceEvaluationByStaff(?, ?)`;
      const [results] = await poolHR.query(sql, [manager_id, staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetEvaluationDetails: async (manager_id, staff_id, evaluation_id) => {
    try {
      const sql = `CALL GetEvaluationDetails(?, ?, ?)`;
      const [results] = await poolHR.query(sql, [manager_id, staff_id, evaluation_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL StaffEvaluate(?, ?, ?)`;
      const [results] = await poolHR.query(sql, [
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

export default hrRepo;
