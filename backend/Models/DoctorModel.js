import { poolDoctors } from './dbConnectionConfiguration.js';

const doctorRepo = {
  GetAllAllergies: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?, 1)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllDrugs: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllConditions: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetPatientsAllergies: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  AddAllergyToPatient: async (doctor_id, patient_id, allergy_name_string) => {
    try {
      const sql = `CALL AddAllergiesToPatients(?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, allergy_name_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
  
    }
  },

  AddNewDiagnosis: async (doctor_id, patient_id, diagnosis_date, diagnosis_note, condition_code_string) => {
    try {
      const sql = `CALL AddNewDiagnosis(?, ?, ?, ?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_date, diagnosis_note, condition_code_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  AddNewPrescription: async (doctor_id, patient_id, diagnosis_id, para_treatment_end_date, prescription_note, medicine_quantity_string) => {
    while (true){
      try {
        const sql = `CALL AddNewPrescription(?, ?, ?, ?, ?, ?, 1)`;
        const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_id, para_treatment_end_date, prescription_note, medicine_quantity_string]);
        return results;
        break
  
      } 
      catch (error) {
        if (error.code === 'ER_LOCK_DEADLOCK') {
            console.warn('Deadlock detected, retrying...');
            continue; // Continue the loop to retry the transaction
        } else if (error.code === 'ER_SIGNAL_EXCEPTION') {
            throw new Error(error.message); // Rethrow signal exceptions with the original message
        } else {
            throw new Error('Something is wrong. Please try again'); // Handle other errors
        }
    }
    }
   
   
  },

  OrderTest: async (doctor_id, patient_id, administer_date, administer_time, test_code_string) => {
    try {
      const sql = `CALL OrderTest(?, ?, ?, ?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, administer_date, administer_time, test_code_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  FetchAppointment: async (para_doctor_id) => {
    try {
      const sql = `CALL FetchAppointmentById(?)`;
      const [results] = await poolDoctors.query(sql, [para_doctor_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetPatientsInfo: async (doctor_id) => {
    try {
      const sql = `CALL GetPatientsInfoForDoctor(?)`;
      const [results] = await poolDoctors.query(sql, [doctor_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  FetchTestDetailsByPatientId: async (patient_id) => {
    try {
      const sql = `CALL FetchTestDetailsByPatientId(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  FetchDiagnosesByPatientId: async (patient_id) => {
    try {
      const sql = `CALL FetchDiagnosesByPatientId(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  FetchPrescriptionsByPatientId: async (para_patient_id) => {
    try {
      const sql = `CALL FetchPrescriptionsByPatientId(?)`;
      const [results] = await poolDoctors.query(sql, [para_patient_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolDoctors.query(sql, [staff_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  Scheduling: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL Scheduling(?, ?, ?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL DeleteSchedule(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, schedule_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinates: async (manager_id) => {
    try {
      const sql = `CALL GetStaffUnderManager(?)`;
      const [results] = await poolDoctors.query(sql, [manager_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, evaluation_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolDoctors.query(sql, [staff_id, manager_id]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },
  GetAllPerformanceEvaluation: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAllPerformanceEvaluationByStaff(?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetEvaluationDetails: async (manager_id, staff_id, evaluation_id) => {
    try {
      const sql = `CALL GetEvaluationDetails(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, staff_id, evaluation_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL StaffEvaluate(?, ?, ?)`;
      const [results] = await poolDoctors.query(sql, [
        manager_id,
        staff_id,
        evaluation_string,
      ]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default doctorRepo;