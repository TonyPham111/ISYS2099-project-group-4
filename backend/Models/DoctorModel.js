const {poolDoctors} = require('./dbConnectionConfiguration');

const queries = {
    GetPatientsAllergies: async (patient_id) => {
        try {
            const sql = `CALL FetchPatientsAllergies(?)`;
            const [results] = await poolDoctors.query(sql, [patient_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchPatientsAllergies:", error);
            return { error: "An error occurred while executing AddNewDiagnosis. Please try again later." };
        }
    },
    AddAllergyToPatient: async (doctor_id, patient_id, allergy_name_string) => {
        try {
            const sql = `CALL AddAllergiesToPatients(?, ?)`;
            const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, allergy_name_string]);
            return results;
        } catch (error) {
            console.error("Error executing AddNewDiagnosis:", error);
            return { error: "An error occurred while executing AddNewDiagnosis. Please try again later." };
        }
    },
    AddNewDiagnosis: async (doctor_id, patient_id, diagnosis_date, diagnosis_note, condition_code_string) => {
    try {
        const sql = `CALL AddNewDiagnosis(?)`;
        const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_date, diagnosis_note, condition_code_string]);
        return results;
    } catch (error) {
        console.error("Error executing AddNewDiagnosis:", error);
        return { error: "An error occurred while executing AddNewDiagnosis. Please try again later." };
    }
},
    AddNewPrescription: async (doctor_id, patient_id, diagnosis_id, prescription_note, medicine_quantity_string) => {
    try {
        const sql = `CALL AddNewPrescription(?)`;
        const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_id, prescription_note, medicine_quantity_string]);
        return results;
    } catch (error) {
        console.error("Error executing AddNewPrescription:", error);
        return { error: "An error occurred while executing AddNewPrescription. Please try again later." };
    }
},
    OrderTest: async (doctor_id, patient_id, administer_date, administer_time, test_code_string) => {
    try {
        const sql = `CALL OrderTest(?)`;
        const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, administer_date, administer_time, test_code_string]);
        return results;
    } catch (error) {
        console.error("Error executing OrderTest:", error);
        return { error: "An error occurred while executing OrderTest. Please try again later." };
    }
},
    FetchAppointment: async (para_doctor_id) => {
    try {
        const sql = `CALL FetchAppointmentById(?)`;
        const [results] = await poolDoctors.query(sql, [para_doctor_id]);
        return results;
    } catch (error) {
        console.error("Error executing FetchDoctorScheduleById:", error);
        return { error: "An error occurred while executing FetchDoctorScheduleById. Please try again later." };
    }
},
    GetPatientsInfo: async (doctor_id) => {
    try {
        const sql = `CALL GetPatientsInfo(?)`;
        const [results] = await poolDoctors.query(sql, [doctor_id]);
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
   
    FetchStaffInfoById: async (staff_id) => {
    try {
        const sql = `CALL FetchStaffInfoById(?)`;
        const [results] = await poolDoctors.query(sql, [staff_id]);
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
    ReSchedule: async (manager_id, staff_id, schedule_id, schedule_date, start_time, end_time, note) => {
        try {
            const sql = `CALL ReSchedule(?, ?, ?, ?, ?, ?, ?)`;
            const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_id, schedule_date, start_time, end_time, note]);
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