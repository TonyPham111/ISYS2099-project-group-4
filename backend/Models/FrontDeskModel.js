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
    AddNewPatients: async (ssn, full_name, gender, birth_date, phone_number, email, home_address) => {
        try {
            const sql = `CALL AddNewPatient(?, ?, ?, ?, ?, ?, ?)`;
            const [results] = await poolFrontDesk.query(sql, [ssn, full_name, gender, birth_date, phone_number, email, home_address]);
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
    CheckAvailability: async (booked_date, start_time, end_time, department_id) => {
    try {
        const sql = `CALL CheckAvailability(?, ?, ?, ?)`;
        const [results] = await poolFrontDesk.query(sql, [booked_date, start_time, end_time, department_id]);
        return results;
    } catch (error) {
        console.error("Error executing CheckAvailability:", error);
        return { error: "An error occurred while executing CheckAvailability. Please try again later." };
    }
},
    AddNewAppointment: async (department_id, para_doctor_id, patient_id, purpose, appointment_date, start_time, end_time, document_string) => {
    try {
        const sql = `CALL AddNewAppointment(?, ?, ?, ?, ?, ?, ?, ?)`;
        const [results] = await poolFrontDesk.query(sql, [department_id, para_doctor_id, patient_id, purpose, appointment_date, start_time, end_time, document_string]);
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