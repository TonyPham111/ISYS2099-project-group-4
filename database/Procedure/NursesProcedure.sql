DROP PROCEDURE IF EXISTS GetPatientsInfo; -- $$
CREATE PROCEDURE GetPatientsInfo(
    para_doctor_id INT
)
SQL SECURITY DEFINER
BEGIN
    IF CheckDoctorExists(para_doctor_id) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect doctor id. Please try again';
    end if;
    -- Select various fields from the Patients and Allergies tables
    SELECT
        Patients.id,                      -- The ID of the patient
        Patients.full_name,               -- The full name of the patient
        Patients.gender,                  -- The gender of the patient
        Patients.birth_date,              -- The birth date of the patient
        Allergies.allergy_name,            -- The name of the allergy associated with the patient
        Allergies.allergy_type,
        Allergies.allergen,
        Allergies.allergy_group
    FROM Appointments
    INNER JOIN
        Patients                          -- The Patients table
    ON
        Appointments.patient_id = Patients.id
    INNER JOIN
        PatientAllergy                    -- The PatientAllergy table, which links patients with allergies
    ON
        Patients.id = PatientAllergy.patient_id -- Match patient_id with the Patients table
    INNER JOIN
        Allergies                         -- The Allergies table, which contains allergy details
    ON
        PatientAllergy.allergy_id = Allergies.id; -- Match allergy_id with the Allergies table

END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetPatientsInfo TO 'Nurses'@'host'; -- $$


DROP PROCEDURE IF EXISTS UpdateTestDetail; -- $$
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
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.UpdateTestDetail TO 'Nurses'@'host'; -- $$
