import { poolNurses } from './dbConnectionConfiguration.js';

const nurseRepo = {
  GetPatientsAllergies: async (patient_id) => {
    try {
      const sql = `CALL FetchPatientsAllergies(?)`;
      const [results] = await poolNurses.query(sql, [patient_id]);
      return results[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /*
  GetPatientsInfo: async () => {
    try {
      const sql = `CALL GetPatientsInfoForNurse()`;
      const [results] = await poolNurses.query(sql);

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
  */

  GetPatientsInfo: async (patient_name) => {
    try {
      const sql = `CALL GetPatientsInfoForNurseByName(?)`;
      const [results] = await poolNurses.query(sql, [patient_name]);

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

  /*
  FetchTestDetailsByPatientId: async (patient_id) => {
    try {
      const sql = `CALL FetchTestDetailsByPatientId(?)`;
      const [results] = await poolNurses.query(sql, [patient_id]);

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
  */
  FetchTestDetailsByPatientId: async (patient_id, from_date, to_date) => {
    try {
        const sql = `CALL FetchTestDetailsByPatientIdByDates(?, ?, ?)`;
        const [results] = await poolNurses.query(sql, [patient_id, from_date, to_date]);
  
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

  /*
  FetchDiagnosesByPatientId: async (patient_id) => {
    try {
      const sql = `CALL FetchDiagnosesByPatientId(?)`;
      const [results] = await poolNurses.query(sql, [patient_id]);

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
  */

  FetchDiagnosesByPatientId: async (patient_id, from_date, to_date) => {
    try {
        const sql = `CALL FetchDiagnosesByPatientIdAndDates(?, ?, ?)`;
        const [results] = await poolNurses.query(sql, [patient_id, from_date, to_date]);
  
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

  /*
  FetchPrescriptionsByPatientId: async (para_patient_id) => {
    try {
      const sql = `CALL FetchPrescriptionsByPatientId(?)`;
      const [results] = await poolNurses.query(sql, [para_patient_id]);

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
  */
  FetchPrescriptionsByPatientId: async (para_patient_id, from_date, to_date) => {
    try {
        const sql = `CALL FetchPrescriptionsByPatientIdAndDates(?, ?,?)`;
        const [results] = await poolNurses.query(sql, [para_patient_id, from_date, to_date]);
  
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

    UpdateTestDetail: async (para_test_order_id, para_test_type_id, administer_staff_id, lab_result_document_id) => {
        try {
            const sql = `CALL UpdateTestDetail(?)`;
            const [results] = await poolNurses.query(sql, [para_test_order_id, para_test_type_id, administer_staff_id, lab_result_document_id]);
            return JSON.stringify(results, null, 2);
        } catch (error) {
            throw new Error(error.message);
        }
    },

  FetchStaffInfoById: async (staff_id) => {
    try {
      const sql = `CALL FetchStaffInfoById(?)`;
      const [results] = await poolNurses.query(sql, [staff_id]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  Scheduling: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL Scheduling(?, ?, ?)`;
      const [results] = await poolNurses.query(sql, [manager_id, staff_id, schedule_string]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  DeleteSchedule: async (manager_id, staff_id, schedule_string) => {
    try {
      const sql = `CALL DeleteSchedule(?, ?, ?)`;
      const [results] = await poolNurses.query(sql, [manager_id, staff_id, schedule_string]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetSubordinates: async (manager_id) => {
    try {
      const sql = `CALL GetStaffUnderManager(?)`;
      const [results] = await poolNurses.query(sql, [manager_id]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL CreateNewEvaluation(?, ?, ?)`;
      const [results] = await poolNurses.query(sql, [manager_id, staff_id, evaluation_string]);
      return JSON.stringify(results, null, 2);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  /*
  GetSubordinatesSchedule: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaff(?, ?)`;
      const [results] = await poolNurses.query(sql, [staff_id, manager_id]);
      return results[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllPerformanceEvaluation: async (manager_id, staff_id) => {
    try {
      const sql = `CALL GetAllPerformanceEvaluationByStaff(?, ?)`;
      const [results] = await poolNurses.query(sql, [manager_id, staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  */

  GetEvaluationDetails: async (manager_id, evaluation_id) => {
    try {
      const sql = `CALL GetEvaluationDetails(?, ?)`;
      const [results] = await poolNurses.query(sql, [manager_id, evaluation_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  CreateNewEvaluation: async (manager_id, staff_id, evaluation_string) => {
    try {
      const sql = `CALL StaffEvaluate(?, ?, ?)`;
      const [results] = await poolNurses.query(sql, [
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
      const [results] = await poolNurses.query(sql, [manager_id, staff_id]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  GetSubordinatesSchedule: async (manager_id, staff_id, from_date, to_date) => {
    try {
      const sql = `CALL GetAppointmentsAndSchedulesByStaffByDate(?, ?, ?, ?)`;
      const [results] = await poolNurses.query(sql, [staff_id, manager_id, from_date, to_date]);
      return results[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },
  /*
  GetOwnSchedule: async (staff_id) => {
    try {
      const sql = `CALL GetOwnAppointmentsAndSchedules(?)`;
      const [results] = await poolNurses.query(sql, [staff_id, manager_id, from_date, to_date]);
      return results[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },
  */

  GetOwnSchedule: async (staff_id, from_date, to_date) => {
    try {
      const sql = `CALL GetOwnAppointmentsAndSchedulesByDates(?, ?, ?, ?)`;
      const [results] = await poolNurses.query(sql, [staff_id, manager_id, from_date, to_date]);
      return results[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  GetAllPerformanceEvaluation: async (manager_id, staff_id, from_date, to_date) => {
    try {
      const sql = `CALL GetAllPerformanceEvaluationByStaffByDates(?, ?, ?, ?)`;
      const [results] = await poolNurses.query(sql, [manager_id, staff_id, from_date, to_date]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default nurseRepo;
