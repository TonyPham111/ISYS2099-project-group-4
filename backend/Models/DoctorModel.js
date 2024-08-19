const {poolDoctors} = require('./dbConnectionConfiguration');

const queries = {
    AddNewDiagnosis: async (para_id) => {
    try {
        const sql = `CALL AddNewDiagnosis(?)`;
        const [results] = await poolDoctors.query(sql, [para_id]);
        return results;
    } catch (error) {
        console.error("Error executing AddNewDiagnosis:", error);
        return { error: "An error occurred while executing AddNewDiagnosis. Please try again later." };
    }
},
    AddNewPrescription: async (para_id) => {
    try {
        const sql = `CALL AddNewPrescription(?)`;
        const [results] = await poolDoctors.query(sql, [para_id]);
        return results;
    } catch (error) {
        console.error("Error executing AddNewPrescription:", error);
        return { error: "An error occurred while executing AddNewPrescription. Please try again later." };
    }
},
    OrderTest: async (para_id) => {
    try {
        const sql = `CALL OrderTest(?)`;
        const [results] = await poolDoctors.query(sql, [para_id]);
        return results;
    } catch (error) {
        console.error("Error executing OrderTest:", error);
        return { error: "An error occurred while executing OrderTest. Please try again later." };
    }
},
    FetchDoctorScheduleById: async (para_doctor_id) => {
    try {
        const sql = `CALL FetchDoctorScheduleById(?)`;
        const [results] = await poolDoctors.query(sql, [para_doctor_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchDoctorScheduleById:", error);
        return { error: "An error occurred while executing FetchDoctorScheduleById. Please try again later." };
    }
},
    GetPatientsInfo: async () => {
    try {
        const sql = `CALL GetPatientsInfo()`;
        const [results] = await poolDoctors.query(sql, []);
        return results;
    } catch (error) {
        console.error("Error executing GetPatientsInfo:", error);
        return { error: "An error occurred while executing GetPatientsInfo. Please try again later." };
    }
},
    FetchTestDetailsByPatientId: async (patient_id) => {
    try {
        const sql = `CALL FetchTestDetailsByPatientId(?)`;
        const [results] = await poolDoctors.query(sql, [patient_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchTestDetailsByPatientId:", error);
        return { error: "An error occurred while executing FetchTestDetailsByPatientId. Please try again later." };
    }
},
    FetchDiagnosesByPatientId: async (patient_id) => {
    try {
        const sql = `CALL FetchDiagnosesByPatientId(?)`;
        const [results] = await poolDoctors.query(sql, [patient_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchDiagnosesByPatientId:", error);
        return { error: "An error occurred while executing FetchDiagnosesByPatientId. Please try again later." };
    }
},
    FetchPrescriptionsByPatientId: async (para_patient_id) => {
    try {
        const sql = `CALL FetchPrescriptionsByPatientId(?)`;
        const [results] = await poolDoctors.query(sql, [para_patient_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchPrescriptionsByPatientId:", error);
        return { error: "An error occurred while executing FetchPrescriptionsByPatientId. Please try again later." };
    }
},
    UpdateTestDetail: async (para_test_order_id) => {
    try {
        const sql = `CALL UpdateTestDetail(?)`;
        const [results] = await poolDoctors.query(sql, [para_test_order_id]);
        return results;
    } catch (error) {
        console.error("Error executing UpdateTestDetail:", error);
        return { error: "An error occurred while executing UpdateTestDetail. Please try again later." };
    }
},
    FetchStaffInfoById: async (staff_id) => {
    try {
        const sql = `CALL FetchStaffInfoById(?)`;
        const [results] = await poolDoctors.query(sql, [staff_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchStaffInfoById:", error);
        return { error: "An error occurred while executing FetchStaffInfoById. Please try again later." };
    }
}
};

module.exports = queries;