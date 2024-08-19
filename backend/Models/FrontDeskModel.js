const {poolFrontDesk} = require('./dbConnectionConfiguration');

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
    FetchPatientsPersonalInfo: async () => {
    try {
        const sql = `CALL FetchPatientsPersonalInfo()`;
        const [results] = await poolFrontDesk.query(sql, []);
        return results;
    } catch (error) {
        console.error("Error executing FetchPatientsPersonalInfo:", error);
        return { error: "An error occurred while executing FetchPatientsPersonalInfo. Please try again later." };
    }
},
    CheckAvailability: async (booked_date) => {
    try {
        const sql = `CALL CheckAvailability(?)`;
        const [results] = await poolFrontDesk.query(sql, [booked_date]);
        return results;
    } catch (error) {
        console.error("Error executing CheckAvailability:", error);
        return { error: "An error occurred while executing CheckAvailability. Please try again later." };
    }
},
    AddNewAppointment: async (para_doctor_id) => {
    try {
        const sql = `CALL AddNewAppointment(?)`;
        const [results] = await poolFrontDesk.query(sql, [para_doctor_id]);
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
    RescheduleAnAppointment: async (appointment_id) => {
    try {
        const sql = `CALL RescheduleAnAppointment(?)`;
        const [results] = await poolFrontDesk.query(sql, [appointment_id]);
        return results;
    } catch (error) {
        console.error("Error executing RescheduleAnAppointment:", error);
        return { error: "An error occurred while executing RescheduleAnAppointment. Please try again later." };
    }
}
};

module.exports = queries;