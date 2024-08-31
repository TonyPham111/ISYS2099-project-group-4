import { poolNurses } from './dbConnectionConfiguration.js';
import { CreateNewEvaluation } from './DoctorModel.js';

const queries = {
    GetPatientsAllergies: async (patient_id) => {
        try {
            const sql = `CALL FetchPatientsAllergies(?)`;
            const [results] = await poolDoctors.query(sql, [patient_id]);
            return results;
        } catch (error) {
            console.error("Error executing FetchPatientsAllergies:", error);
            return { error: "An error occurred while executing FetchPatientsAllergies. Please try again later." };
        }
    },
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
    },
    Schedule: async (manager_id, staff_id, schedule_date, start_time, end_time, note) => {
        try {
            const sql = `CALL Schedule(?, ?, ?, ?, ?, ?)`;
            const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_date, start_time, end_time, note]);
            return results;
        } catch (error) {
            console.error("Error executing Schedule:", error);
            return { error: "An error occurred while executing Schedule. Please try again later." };
        }
    },
    ReSchedule: async (manager_id, staff_id, schedule_date, start_time, end_time, note) => {
        try {
            const sql = `CALL ReSchedule(?, ?, ?, ?, ?, ?)`;
            const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_date, start_time, end_time, note]);
            return results;
        } catch (error) {
            console.error("Error executing ReSchedule:", error);
            return { error: "An error occurred while executing ReSchedule. Please try again later." };
        }
    },
    GetSubordinates: async (manager_id) => {
        try {
            const sql = `CALL GetStaffUnderManager(?)`;
            const [results] = await poolNurses.query(sql, [manager_id]);
            return results;
        } catch (error) {
            console.error("Error executing GetSubordinates:", error);
            return { error: "An error occurred while executing GetSubordinates. Please try again later." };
        }
    },
    CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
        try {
            const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
            const [results] = await poolNurses.query(sql, [manager_id, staff_id, evaluation_string]);
            return results;
        } catch (error) {
            console.error("Error executing CreateNewEvaluation:", error);
            return { error: "An error occurred while executing CreateNewEvaluation. Please try again later." };
        }
    },
    GetSubordinatesSchedule: async (manager_id, staff_id) => {
        try {
            const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
            const [results] = await poolNurses.query(sql, [staff_id, manager_id]);
            return results;
        } catch (error) {
            console.error("Error executing GetSubordinatesSchedule:", error);
            return { error: "An error occurred while executing GetSubordinatesSchedule. Please try again later." };
        }
    }
};

export default queries;
