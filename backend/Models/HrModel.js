const {poolHR} = require('./dbConnectionConfiguration');

const queries = {
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
        console.error("Error executing ChangeJob:", error);
        return { error: "An error occurred while executing ChangeJob. Please try again later." };
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
        console.error("Error executing FetchJobChangeByStaffId:", error);
        return { error: "An error occurred while executing FetchJobChangeByStaffId. Please try again later." };
    }
},
FetchDepartmentChangeByStaffId: async (para_staff_id) => {
    try {
        const sql = `CALL FetchDepartmentChangeByStaffId(?)`;
        const [results] = await poolHR.query(sql, [para_staff_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchJobChangeByStaffId:", error);
        return { error: "An error occurred while executing FetchJobChangeByStaffId. Please try again later." };
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
    Schedule: async (manager_id, staff_id, schedule_date, start_time, end_time, note) => {
        try {
            const sql = `CALL Schedule(?, ?, ?, ?, ?, ?)`;
            const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_date, start_time, end_time, note]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },
    ReSchedule: async (manager_id, staff_id, schedule_date, start_time, end_time, note) => {
        try {
            const sql = `CALL ReSchedule(?, ?, ?, ?, ?, ?)`;
            const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_date, start_time, end_time, note]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },

    GetSubordinates: async (manager_id) => {
        try {
            const sql = `CALL GetStaffUnderManager(?)`;
            const [results] = await poolDoctors.query(sql, [manager_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },

    GetSubordinates: async (manager_id, staff_id, evaluation_string) => {
        try {
            const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
            const [results] = await poolDoctors.query(sql, [manager_id, staff_id, evaluation_string]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    }
};

module.exports = queries;