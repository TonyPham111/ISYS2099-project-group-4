import { poolDoctors } from './dbConnectionConfiguration.js';

const doctorRepo = {
  GetAllAllergies: async () => {
    try {
      const sql = `CALL GetAllAllergies()`;
      const [results] = await poolDoctors.query(sql, []);
      return results[0];
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllDrugs: async (number_of_entries, starting_index) => {
    try {
      const sql = `CALL GetAllDrugs(?, ?)`;
      const [results] = await poolDoctors.query(sql, [number_of_entries, starting_index]);
      return results[0];
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllConditions: async () => {
    try {
      const sql = `CALL GetAllConditions()`;
      const [results] = await poolDoctors.query(sql, []);
      return results[0];
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  GetPatientsAllergies: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolDoctors.query(sql, [patient_id]);
      return results[0];
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  AddAllergyToPatient: async (doctor_id, patient_id, allergy_name_string) => {
    try {
      const sql = `CALL AddAllergiesToPatients(?, ?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, allergy_name_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
  
    }
  },

  AddNewDiagnosis: async (doctor_id, patient_id, diagnosis_note, condition_code_string) => {
    try {
      const sql = `CALL AddNewDiagnosis(?, ?, ?, ?, 1)`;
      const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_note, condition_code_string]);
      return results;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  },

  AddNewPrescription: async (doctor_id, patient_id, diagnosis_id, prescription_note, medicine_quantity_string) => {
    while (true) {
      try {
        const sql = `CALL AddNewPrescription(?, ?, ?, ?, ?, 1)`;
        const [results] = await poolDoctors.query(sql, [doctor_id, patient_id, diagnosis_id, prescription_note, medicine_quantity_string]);
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

        // Transform the results to group allergy data
        const groupedResults = results[0].reduce((accumulator, row) => {
            const { id, full_name, gender, birth_date, allergy_name, allergy_type, allergen, allergy_group } = row;

            // Add the patient details to the accumulator if it's not already added
            if (!accumulator[id]) {
                accumulator[id] = { id, full_name, gender, birth_date, allergies: [] };
            }

            // Add the allergy details to the current patient's allergy list
            accumulator[id].allergies.push({ allergy_name, allergy_type, allergen, allergy_group });

            return accumulator; // Return the accumulator for the next iteration
        }, {});

        // Convert the grouped results object to an array
        return Object.values(groupedResults);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchTestDetailsByPatientId: async (patient_id) => {
    try {
        const sql = `CALL FetchTestDetailsByPatientId(?)`;
        const [results] = await poolDoctors.query(sql, [patient_id]);
  
        // Transform the results to group test data
        const groupedResults = results[0].reduce((accumulator, row) => {
            const { id, ordering_doctor, ordering_date, test_name, administrating_nurse, administering_date, administering_time, lab_result_document_id } = row;

            // Add the test details to the accumulator if it's not already added
            if (!accumulator[id]) {
                accumulator[id] = { id, ordering_doctor, ordering_date, test_name, administrating_nurse, administering_date, administering_time, tests: [] };
            }

            // Add the test details to the test list
            accumulator[id].tests.push({ test_name });

            return accumulator;  // Return the accumulator for the next iteration
        }, {});

        // Convert the grouped results object to an array
        return Object.values(groupedResults);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchDiagnosesByPatientId: async (patient_id) => {
    try {
        const sql = `CALL FetchDiagnosesByPatientId(?)`;
        const [results] = await poolDoctors.query(sql, [patient_id]);
  
        // Transform the results to group diagnosis data
        const groupedResults = results[0].reduce((accumulator, row) => {
            const { diagnosis_id, doctor_name, diagnosis_date, diagnosis_note, condition_code, condition_name, condition_description } = row;

            // Add the diagnosis details to the accumulator if it's not already added
            if (!accumulator[diagnosis_id]) {
                accumulator[diagnosis_id] = { diagnosis_id, doctor_name, diagnosis_date, diagnosis_note, conditions: [] };
            }

            // Add the condition details to the current diagnosis' condition list
            accumulator[diagnosis_id].conditions.push({ condition_code, condition_name, condition_description });

            return accumulator;  // Return the accumulator for the next iteration
        }, {});

        // Convert the grouped results object to an array
        return Object.values(groupedResults);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  FetchPrescriptionsByPatientId: async (para_patient_id) => {
    try {
        const sql = `CALL FetchPrescriptionsByPatientId(?)`;
        const [results] = await poolDoctors.query(sql, [para_patient_id]);
  
        // Transform the results to group prescription data
        const groupedResults = results[0].reduce((accumulator, row) => {
            const { id, treatment_start_date, doctor_name, drug_name, quantity, unit, price } = row;

            // Add the presccription details to the accumulator if it's not already added
            if (!accumulator[id]) {
                accumulator[id] = { id, treatment_start_date, doctor_name, drugs: [] };
            }

            // Add the drug details to the current prescription's drug list
            accumulator[id].drugs.push({ drug_name, quantity, unit, price });

            return accumulator;  // Return the accumulator for the next iteration
        }, {});

        // Convert the grouped results object to an array
        return Object.values(groupedResults);
    } catch (error) {
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
      const sql = `CALL Scheduling(?, ?, ?)`;
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
      return results[0];
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

  GetEvaluationDetails: async (manager_id, evaluation_id) => {
    try {
      const sql = `CALL GetEvaluationDetails(?, ?)`;
      const [results] = await poolDoctors.query(sql, [manager_id, evaluation_id]);
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
  },
  FetchStaffQualifications: async (manager_id, staff_id) => {
  try {
    const sql = `CALL FetchStaffQualifications(?, ?)`;
    const [results] = await poolDoctors.query(sql, [manager_id, staff_id]);
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
}
}

export default doctorRepo;
