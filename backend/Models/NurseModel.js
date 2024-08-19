const {poolNurses} = require('./dbConnectionConfiguration');

const queries = {
    GetPatientsInfo: async () => {
    try {
        const sql = `CALL GetPatientsInfo()`;
        const [results] = await poolNurses.query(sql, []);
        return results;
    } catch (error) {
        console.error("Error executing GetPatientsInfo:", error);
        return { error: "An error occurred while executing GetPatientsInfo. Please try again later." };
    }
},
    FetchTestDetailsByPatientId: async (patient_id) => {
    try {
        const sql = `CALL FetchTestDetailsByPatientId(?)`;
        const [results] = await poolNurses.query(sql, [patient_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchTestDetailsByPatientId:", error);
        return { error: "An error occurred while executing FetchTestDetailsByPatientId. Please try again later." };
    }
},
    FetchDiagnosesByPatientId: async (patient_id) => {
    try {
        const sql = `CALL FetchDiagnosesByPatientId(?)`;
        const [results] = await poolNurses.query(sql, [patient_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchDiagnosesByPatientId:", error);
        return { error: "An error occurred while executing FetchDiagnosesByPatientId. Please try again later." };
    }
},
    FetchPrescriptionsByPatientId: async (para_patient_id) => {
    try {
        const sql = `CALL FetchPrescriptionsByPatientId(?)`;
        const [results] = await poolNurses.query(sql, [para_patient_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchPrescriptionsByPatientId:", error);
        return { error: "An error occurred while executing FetchPrescriptionsByPatientId. Please try again later." };
    }
},
    UpdateTestDetail: async (para_test_order_id) => {
    try {
        const sql = `CALL UpdateTestDetail(?)`;
        const [results] = await poolNurses.query(sql, [para_test_order_id]);
        return results;
    } catch (error) {
        console.error("Error executing UpdateTestDetail:", error);
        return { error: "An error occurred while executing UpdateTestDetail. Please try again later." };
    }
},
    FetchStaffInfoById: async (staff_id) => {
    try {
        const sql = `CALL FetchStaffInfoById(?)`;
        const [results] = await poolNurses.query(sql, [staff_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchStaffInfoById:", error);
        return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
    }
}
};

module.exports = queries;