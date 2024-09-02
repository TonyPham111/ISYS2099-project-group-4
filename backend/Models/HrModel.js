import { poolHR } from './dbConnectionConfiguration.js';

const hrQueries = {
    AddNewStaff: async (full_name, job_id, department_id, manager_id, gender, birth_date, home_address, 
        phone_number, email, password, wage, employment_document_id) => {
        try {
            const sql = `CALL AddNewStaff(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const [results] = await poolHR.query(sql, [full_name, job_id, department_id, manager_id, gender, birth_date, home_address, phone_number, 
                email, password, wage, employment_document_id]);
            return results;
        } catch (error) {
            console.error("Error executing AddNewStaff:", error);
            return { error: "An error occurred while executing AddNewStaff. Please try again later." };
        }
    },
    FetchAllStaff: async () => {
        try {
            const sql = `CALL FetchAllStaff()`;
            const [results] = await poolHR.query(sql, []);
            return results;
        } catch (error) {
            console.error("Error executing FetchAllStaff:", error);
            return { error: "An error occurred while executing FetchAllStaff. Please try again later." };
        }
    },
    FetchStaffInfoByEmail : async (email) => {
        try {
          const sql = `SELECT * FROM staff WHERE email = ?`; // Assuming your table is named 'staff'
          const [results] = await poolHR.query(sql, [email]);
          return results[0]; 
        } catch (error) {
          console.error("Error executing FetchStaffInfoByEmail:", error);
          return null;
        }
      },
    ChangeWage: async (staff_id, new_wage) => {
        try {
            const sql = `CALL ChangeWage(?, ?)`;
            const [results] = await poolHR.query(sql, [staff_id, new_wage]);
            return results;
        } catch (error) {
            console.error("Error executing ChangeWage:", error);
            return { error: "An error occurred while executing ChangeWage. Please try again later." };
        }
    },
    ChangeJob: async (staff_id, new_job_id, new_wage, new_manager_id, new_department_id) => {
        try {
            const sql = `CALL ChangeJob(?, ?, ?, ?, ?)`;
            const [results] = await poolHR.query(sql, [staff_id, new_job_id, new_wage, new_manager_id, new_department_id]);
            return results;
        } catch (error) {
            console.error("Error executing ChangeJob:", error);
            return { error: "An error occurred while executing ChangeJob. Please try again later." };
        }
    },
    ChangeDepartment: async (staff_id, new_manager_id, new_department_id) => {
        try {
            const sql = `CALL ChangeDepartment(?, ?, ?)`;
            const [results] = await poolHR.query(sql, [staff_id, new_manager_id, new_department_id]);
            return results;
        } catch (error) {
            console.error("Error executing ChangeDepartment:", error);
            return { error: "An error occurred while executing ChangeDepartment. Please try again later." };
        }
    },
    ChangeStaffPersonalInfo: async (staff_id, new_phone_number, new_email, new_password, new_home_address) => {
        try {
            const sql = `CALL ChangeStaffPersonalInfo(?, ?, ?, ?, ?)`;
            const [results] = await poolHR.query(sql, [staff_id, new_phone_number, new_email, new_password, new_home_address]);
            return results;
        } catch (error) {
            console.error("Error executing ChangeStaffPersonalInfo:", error);
            return { error: "An error occurred while executing ChangeStaffPersonalInfo. Please try again later." };
        }
    },
    FetchJobChangeByStaffId: async (para_staff_id) => {
        try {
            const sql = `CALL FetchJobChangeByStaffId(?)`;
            const [results] = await poolHR.query(sql, [para_staff_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchJobChangeByStaffId:", error);
            return { error: "An error occurred while executing FetchJobChangeByStaffId. Please try again later." };
        }
    },
    FetchWageChangeByStaffId: async (para_staff_id) => {
        try {
            const sql = `CALL FetchWageChangeByStaffId(?)`;
            const [results] = await poolHR.query(sql, [para_staff_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchWageChangeByStaffId:", error);
            return { error: "An error occurred while executing FetchWageChangeByStaffId. Please try again later." };
        }
    },
    FetchDepartmentChangeByStaffId: async (para_staff_id) => {
        try {
            const sql = `CALL FetchDepartmentChangeByStaffId(?)`;
            const [results] = await poolHR.query(sql, [para_staff_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchDepartmentChangeByStaffId:", error);
            return { error: "An error occurred while executing FetchDepartmentChangeByStaffId. Please try again later." };
        }
    },
    FetchStaffInfoById: async (staff_id) => {
        try {
            const sql = `CALL FetchStaffInfoById(?)`;
            const [results] = await poolHR.query(sql, [staff_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },
    FetchStaffInfoByEmail: async (email) => {
        try {
          const sql = `SELECT * FROM staff WHERE email = ?`; // Assuming your table is named 'staff'
          const [results] = await poolHR.query(sql, [email]);
          return results[0]; 
        } catch (error) {
          console.error("Error executing FetchStaffInfoByEmail:", error);
          return null;
        }
      },

    Scheduling: async (manager_id, staff_id, schedule_string) => {
        try {
          const sql = `CALL Scheduling(?, ?, ?, ?, ?)`;
          const [results] = await poolHR.query(sql, [manager_id, staff_id, schedule_string]);
          return results;
        } catch (error) {
          console.error("Error executing Schedule:", error);
          return { error: "An error occurred while executing Schedule. Please try again later." };
        }
      },
    
      DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
        try {
          const sql = `CALL DeleteSchedule(?, ?, ?)`;
          const [results] = await poolHR.query(sql, [manager_id, staff_id, schedule_string]);
          return results;
        } catch (error) {
          console.error("Error executing Schedule:", error);
          return { error: "An error occurred while executing Schedule. Please try again later." };
        }
      },

    GetSubordinates: async (manager_id) => {
        try {
            const sql = `CALL GetStaffUnderManager(?)`;
            const [results] = await poolHR.query(sql, [manager_id]);
            return results;
        } catch (error) {
            console.error("Error executing GetSubordinates:", error);
            return { error: "An error occurred while executing GetSubordinates. Please try again later." };
        }
    },
    //Not Finished
    CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
        try {
            const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
            const [results] = await poolHR.query(sql, [manager_id, staff_id, evaluation_string]);
            return results;
        } catch (error) {
            console.error("Error executing CreateNewEvaluation:", error);
            return { error: "An error occurred while executing CreateNewEvaluation. Please try again later." };
        }
    },
    GetSubordinatesSchedule: async (manager_id, staff_id) => {
        try {
            const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
            const [results] = await poolHR.query(sql, [staff_id, manager_id]);
            return results;
        } catch (error) {
            console.error("Error executing GetSubordinatesSchedule:", error);
            return { error: "An error occurred while executing GetSubordinatesSchedule. Please try again later." };
        }
    }
};

export default hrQueries;

