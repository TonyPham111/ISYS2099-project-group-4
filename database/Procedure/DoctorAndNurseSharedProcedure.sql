CREATE PROCEDURE GetPatientsInfo()
SQL SECURITY DEFINER
BEGIN
    -- Select various fields from the Patients and Allergies tables
    SELECT
        Patients.id,                      -- The ID of the patient
        Patients.full_name,               -- The full name of the patient
        Patients.gender,                  -- The gender of the patient
        Patients.birth_date,              -- The birth date of the patient
        Allergies.allergy_name            -- The name of the allergy associated with the patient
    FROM
        Patients                          -- The Patients table
    INNER JOIN
        PatientAllergy                    -- The PatientAllergy table, which links patients with allergies
    ON 
        Patients.id = PatientAllergy.patient_id -- Match patient_id with the Patients table
    INNER JOIN
        Allergies                         -- The Allergies table, which contains allergy details
    ON 
        PatientAllergy.allergy_id = Allergies.id; -- Match allergy_id with the Allergies table

END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'GetPatientsInfo' TO 'Doctors'@'host';
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'GetPatientsInfo' TO 'Nurses'@'host';


CREATE PROCEDURE FetchTestDetailsByPatientId(
    patient_id INT    -- Parameter for the ID of the patient whose test details are to be fetched
)
SQL SECURITY DEFINER
BEGIN
    -- Common Table Expression (CTE) to gather test order details along with the ordering doctor's name
    WITH Test_Orders_Details AS (
        SELECT
            Test_Orders.id,                    -- The ID of the test order
            Test_Orders.ordering_date,         -- The date the test was ordered
            Test_Orders.patient_id,            -- The ID of the patient for whom the test was ordered
            Staff.full_name AS ordering_doctor -- The full name of the doctor who ordered the test
        FROM
            Test_Orders                        -- The Test_Orders table, which contains test order details
        INNER JOIN
            Staff                              -- The Staff table to retrieve the ordering doctor's name
        ON
            Test_Orders.ordering_staff_id = Staff.id  -- Join on the staff ID to get the ordering doctor's name
    )
    
    -- Main SELECT query to retrieve test details for the specified patient
    SELECT
        Test_Types.test_name,                  -- The name of the test
        Test_Orders_Details.id,                -- The ID of the test order
        Test_Orders_Details.ordering_date,     -- The date the test was ordered
        Test_Orders_Details.ordering_doctor,   -- The name of the doctor who ordered the test
        Staff.id AS administrating_nurse,      -- The ID of the nurse who administered the test
        Test_Details.administering_date,       -- The date the test was administered
        Test_Details.administering_time,       -- The time the test was administered
        Test_Details.lab_result_document_id    -- The ID of the document containing the lab results
    FROM
        Test_Types                             -- The Test_Types table, which contains test type details
    INNER JOIN
        Test_Details                           -- The Test_Details table, which contains details about the tests administered
    ON
        Test_Details.test_type_id = Test_Types.id -- Join on the test type ID to get the test name
    INNER JOIN
        Staff                                  -- The Staff table to retrieve the name of the nurse who administered the test
    ON
        Test_Details.administrating_staff_id = Staff.id -- Join on the staff ID to get the administering nurse's name
    INNER JOIN
        Test_Orders_Details                    -- The CTE to link the test details with the test orders
    ON
        Test_Details.test_id = Test_Orders_Details.id -- Join on the test ID to get the order details
    WHERE
        Test_Orders_Details.patient_id = patient_id;  -- Filter to include only the tests for the specified patient

END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'FetchTestDetailsByPatientId' TO 'Doctors'@'host';
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'FetchTestDetailsByPatientId' TO 'Nurses'@'host';


CREATE PROCEDURE FetchDiagnosesByPatientId(
    patient_id INT  -- Parameter for the ID of the patient whose diagnoses are to be fetched
)
SQL SECURITY DEFINER
BEGIN
    -- Select various fields related to diagnoses for the specified patient
    SELECT
        Conditions.condition_name,            -- The name of the diagnosed condition
        Diagnoses.id AS diagnosis_id,         -- The ID of the diagnosis
        Staff.full_name AS doctor_name,       -- The full name of the doctor who made the diagnosis
        Diagnoses.diagnosis_date,             -- The date when the diagnosis was made
        Diagnoses.diagnosis_note              -- Any notes related to the diagnosis
    FROM
        Conditions                            -- The Conditions table, which contains information about medical conditions
    INNER JOIN
        DiagnosesDetails                      -- The DiagnosesDetails table, linking diagnoses with conditions
    ON
        Conditions.condition_code = DiagnosesDetails.condition_code -- Join on condition_code to link with DiagnosesDetails
    INNER JOIN
        Diagnoses                             -- The Diagnoses table, containing details about each diagnosis
    ON
        Diagnoses.id = DiagnosesDetails.diagnosis_id -- Join on diagnosis_id to link DiagnosesDetails with Diagnoses
    INNER JOIN
        Staff                                 -- The Staff table, to retrieve the name of the doctor who made the diagnosis
    ON
        Diagnoses.doctor_id = Staff.id        -- Join on doctor_id to link Diagnoses with Staff
    WHERE 
        Diagnoses.patient_id = patient_id;    -- Filter to include only the diagnoses for the specified patient

END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'FetchDiagnosesByPatientId' TO 'Doctors'@'host';
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'FetchDiagnosesByPatientId' TO 'Nurses'@'host';



CREATE PROCEDURE FetchPrescriptionsByPatientId(
    para_patient_id INT  -- Parameter for the ID of the patient whose prescriptions are to be fetched
)
BEGIN
    -- Select various fields related to the prescriptions for the specified patient
    SELECT
        Drugs.drug_name,                    -- The name of the drug prescribed
        Drugs.unit,                         -- The unit of the drug (e.g., capsule, tablet)
        Prescription_Details.quantity,      -- The quantity of the drug prescribed
        Staff.full_name AS doctor_name      -- The full name of the doctor who prescribed the drug
    FROM
        Drugs                               -- The Drugs table, which contains details about drugs
    INNER JOIN
        Prescription_Details                -- The Prescription_Details table, linking prescriptions with drugs
    ON
        Drugs.drug_code = Prescription_Details.drug_code -- Join on drug_code to link with Prescription_Details
    INNER JOIN
        TreatmentHistory                    -- The TreatmentHistory table, which tracks treatments and prescriptions
    ON
        Prescription_Details.prescription_id = TreatmentHistory.id -- Join on prescription_id to link with TreatmentHistory
    INNER JOIN
        Staff                               -- The Staff table, to retrieve the name of the prescribing doctor
    ON
        TreatmentHistory.doctor_id = Staff.id -- Join on doctor_id to link TreatmentHistory with Staff
    WHERE
        TreatmentHistory.patient_id = para_patient_id; -- Filter to include only the prescriptions for the specified patient

END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'FetchPrescriptionsByPatientId' TO 'Doctors'@'host';
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'FetchPrescriptionsByPatientId' TO 'Nurses'@'host';



CREATE PROCEDURE UpdateTestDetail(
    para_test_order_id INT,                   -- Parameter for the test order ID
    para_test_type_id INT,                    -- Parameter for the test type ID
    para_administering_staff_id INT,          -- Parameter for the ID of the staff member administering the test
    para_lab_result_document_id VARCHAR(24)   -- Parameter for the lab result document ID
)
SQL SECURITY DEFINER
BEGIN
    -- Update the Test_Details table with the new administering staff ID and lab result document ID
    UPDATE Test_Details
    SET
        administering_staff_id = para_administering_staff_id,  -- Update the administering staff ID
        lab_result_document_id = para_lab_result_document_id  -- Update the lab result document ID
    WHERE
        test_id = para_test_order_id  -- Match the test order ID
        AND test_type_id = para_test_type_id;  -- Match the test type ID
END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'UpdateTestDetail' TO 'Doctors'@'host';
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'UpdateTestDetail' TO 'Nurses'@'host';