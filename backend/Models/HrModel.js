const {poolHR} = require('./dbConnectionConfiguration');

const queries = {
    AddNewStaff: async (para_id) => {
    try {
        const sql = `CALL AddNewStaff(?)`;
        const [results] = await poolHR.query(sql, [para_id]);
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
    ChangeWage: async (staff_id) => {
    try {
        const sql = `CALL ChangeWage(?, ?)`;
        const [results] = await poolHR.query(sql, [staff_id, 2]);
        return results;
    } catch (error) {
        console.error("Error executing ChangeWage:", error);
        return { error: "An error occurred while executing ChangeWage. Please try again later." };
    }
},
    ChangeJob: async (staff_id) => {
    try {
        const sql = `CALL ChangeJob(?)`;
        const [results] = await poolHR.query(sql, [staff_id]);
        return results;
    } catch (error) {
        console.error("Error executing ChangeJob:", error);
        return { error: "An error occurred while executing ChangeJob. Please try again later." };
    }
},
    ChangeStaffPersonalInfo: async (staff_id) => {
    try {
        const sql = `CALL ChangeStaffPersonalInfo(?)`;
        const [results] = await poolHR.query(sql, [staff_id]);
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
    FetchStaffInfoById: async (staff_id) => {
    try {
        const sql = `CALL FetchStaffInfoById(?)`;
        const [results] = await poolHR.query(sql, [staff_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchStaffInfoById:", error);
        return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
    }
}
};

module.exports = queries;