const {poolNurses} = require('./dbConnectionConfiguration')
const queries = {};


// To view the personal Info of that  Nurse
queries.getNursePersonalInfo = async (staffId) => {
    try {
        const result = await poolNurses.query(
            `CALL GetStaffInfo(?)`, 
            [staffId]
        );
        return result;
    } catch (err) {
        return err;
    }
};

// To view the Patients List
queries.getPatientsList = async () => {
    try {
        const result = await poolNurses
        .query(
            `SELECT 
                p.id,
                p.ssn,
                p.first_name,
                p.last_name,
                p.birth_date,
                p.phone_number,
                p.email,
                p.home_address
            FROM 
                Patients p`
        );
        return result;
    } catch (err) {
        return err;
    }
};
// To view Patients Information with Allergy

queries.getPatientInfoWithAllergy = async () => {
    try {
        const result = await poolNurses.query(
            `SELECT 
                p.id,
                p.first_name,
                p.last_name,
                a.name AS allergy_name,
                a.allergy_type,
                pa.record_date
            FROM 
                Patients p
            JOIN 
                PatientAllergy pa ON p.id = pa.patient_id
            JOIN 
                Allergies a ON pa.allergy_id = a.id`
        );
        return result;
    } catch (err) {
        return err;
    }
};

// To view the Prescription_Details page
queries.getPrescriptionDetails = async (prescriptionId) => {
    try {
        const result = await poolNurses.query(
            `SELECT 
                pd.drug_code,
                d.name AS drug_name,
                pd.quantity,
                pd.unit,
                pd.price
            FROM 
                Prescription_Details pd
            JOIN 
                Drugs d ON pd.drug_code = d.code
            WHERE 
                pd.prescription_id = ?`, 
            [prescriptionId]
        );
        return result;
    } catch (err) {
        return err;
    }
};


// To view the Treatment history of a patient
queries.getTreatmentHistory = async (patientId) => {
    try {
        const result = await poolNurses.query(
            `SELECT 
                th.id,
                th.diagnosis_id,
                th.doctor_id,
                th.treatment_start_date,
                th.treatment_end_date,
                th.diagnosis_note
            FROM 
                TreatmentHistory th
            WHERE 
                th.patient_id = ?`, 
            [patientId]
        );
        return result;
    } catch (err) {
        return err;
    }
};


//To view the Patient Diagnosis 
queries.getPatientDiagnosis = async (patientId) => {
    try {
        const result = await poolNurses.query(
            `SELECT 
                d.id,
                d.diagnosis_date,
                d.diagnosis_note,
                dd.condition_code,
                c.name AS condition_name,
                c.description AS condition_description
            FROM 
                Diagnoses d
            JOIN 
                DiagnosesDetails dd ON d.id = dd.diagnosis_id
            JOIN 
                Conditions c ON dd.condition_code = c.code
            WHERE 
                d.patient_id = ?`, 
            [patientId]
        );
        return result;
    } catch (err) {
        return err;
    }
};


// To view Diagnoses Details
queries.getDiagnosesDetails = async () => {
    try {
        const result = await poolNurses.query(
            `SELECT 
                d.id,
                d.patient_id,
                d.doctor_id,
                d.diagnosis_date,
                d.diagnosis_note,
                dd.condition_code,
                c.name AS condition_name,
                c.description AS condition_description
            FROM 
                Diagnoses d
            JOIN 
                DiagnosesDetails dd ON d.id = dd.diagnosis_id
            JOIN 
                Conditions c ON dd.condition_code = c.code`
        );
        return result;
    } catch (err) {
        return err;
    }
};

// To view the Test Order List
queries.getTestOrderList = async (patientId) => {
    try {
        const result = await poolNurses.query(
            `SELECT 
                t.id AS test_order_id,
                t.ordering_staff_id,
                tt.name AS test_type,
                t.test_date,
                t.status
            FROM 
                Tests t
            JOIN 
                Test_Types tt ON t.test_type_id = tt.id
            WHERE 
                t.patient_id = ?`, 
            [patientId]
        );
        return result;
    } catch (err) {
        return err;
    }
};

// To view the Test Details
queries.getTestDetails = async (testId) => {
    try {
        const result = await poolNurses.query(
            `SELECT 
                td.id,
                tt.name AS test_type,
                td.administering_staff_id,
                td.result_document_id,
                td.test_date,
                td.price
            FROM 
                Test_Details td
            JOIN 
                Test_Types tt ON td.test_type_id = tt.id
            WHERE 
                td.test_id = ?`, 
            [testId]
        );
        return result;
    } catch (err) {
        return err;
    }
};


// To Insert into Test Order List

queries.insertTestOrder = async (patientId, orderingStaffId, testTypeId, testDate, status) => {
    try {
        const result = await poolNurses.query(
            `INSERT INTO Tests (patient_id, ordering_staff_id, test_type_id, test_date, status) 
             VALUES (?, ?, ?, ?, ?)`, 
            [patientId, orderingStaffId, testTypeId, testDate, status]
        );
        return result;
    } catch (err) {
        return err;
    }
};


// To Update the Test Details 
queries.updateTestDetails = async (testId, administeringStaffId, resultDocumentId, testDate, price) => {
    try {
        const result = await poolNurses.query(
            `UPDATE Test_Details 
             SET 
                administering_staff_id = ?, 
                result_document_id = ?, 
                test_date = ?, 
                price = ? 
             WHERE 
                test_id = ?`, 
            [administeringStaffId, resultDocumentId, testDate, price, testId]
        );
        return result;
    } catch (err) {
        return err;
    }
};
