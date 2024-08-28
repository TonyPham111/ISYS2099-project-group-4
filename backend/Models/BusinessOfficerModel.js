const { getBillingDetail } = require('../Controller/BillingController');
const {poolBusinessOfficers} = require('./dbConnectionConfiguration')
const queries = {
    GetPatientsInfo: async () => {
        try {
            const sql = `CALL FetchPatientsPersonalInfo()`;
            const [results] = await poolFrontDesk.query(sql, []);
            return results;
        } catch (error) {
            console.error("Error executing FetchPatientsPersonalInfo:", error);
            return { error: "An error occurred while executing FetchPatientsPersonalInfo. Please try again later." };
        }
    },

     FetchStaffInfoById: async (staff_id) => {
    try {
        const sql = `CALL FetchStaffInfoById(?)`;
        const [results] = await poolBusinessOfficers.query(sql, [staff_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchStaffInfoById:", error);
        return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
    }
},
    Schedule: async (manager_id, staff_id, schedule_date, start_time, end_time, note) => {
        try {
            const sql = `CALL Schedule(?, ?, ?, ?, ?, ?)`;
            const [results] = await poolBusinessOfficers.query(sql, [manager_id, staff_id, schedule_date, start_time, end_time, note]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
},
    ReSchedule: async (manager_id, staff_id, schedule_id, schedule_date, start_time, end_time, note) => {
        try {
            const sql = `CALL ReSchedule(?, ?, ?, ?, ?, ?, ?)`;
            const [results] = await poolBusinessOfficers.query(sql, [manager_id, staff_id, schedule_id, schedule_date, start_time, end_time, note]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },

    GetSubordinates: async (manager_id) => {
        try {
            const sql = `CALL GetStaffUnderManager(?)`;
            const [results] = await poolBusinessOfficers.query(sql, [manager_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },



    GetSubordinatesSchedule: async (manager_id, staff_id) => {
        try {
            const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
            const [results] = await poolBusinessOfficers.query(sql, [staff_id, manager_id]);
            return results;
        } catch (error) {
            console.error("Error executing GetAppointmentsAndSchedulesByStaff:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },

    CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
        try {
            const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
            const [results] = await poolBusinessOfficers.query(sql, [manager_id, staff_id, evaluation_string]);
            return results;
        } catch (error) {
            console.error("Error executing FetchStaffInfoById:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },


    GetAllBillings: async () => {
        try {
            const sql = `CALL GetAllBillings()`;
            const [results] = await poolBusinessOfficers.query(sql, []);
            return results;
        } catch (error) {
            console.error("Error executing GetAppointmentsAndSchedulesByStaff:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },

    GetBillingDetail: async (billing_id) => {
        try {
            const sql = `CALL GetBillingDetails(?)`;
            const [results] = await poolBusinessOfficers.query(sql, [billing_id]);
            return results;
        } catch (error) {
            console.error("Error executing GetAppointmentsAndSchedulesByStaff:", error);
            return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
        }
    },

    CreateNewBilling: async (patient_id, appointment_id, test_id, prescription_id) => {
        try {
            const sql = `CALL InsertNewBilling(?, ?, ?, ?)`;
            const [results] = await poolDoctors.query(sql, [patient_id, appointment_id, test_id, prescription_id]);
            return results;
        } catch (error) {
            console.error("Error executing AddNewDiagnosis:", error);
            return { error: "An error occurred while executing AddNewDiagnosis. Please try again later." };
        }
    },

}

module.exports = queries;


