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
        PatientAllergy.allergy_id = Allergies.id -- Match allergy_id with the Allergies table
    WHERE doctor_id = para_doctor_id
      AND appointment_date = CURDATE();

END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetPatientsInfo TO 'Doctors'@'host'; -- $$



DROP PROCEDURE IF EXISTS AddAllergiesToPatients; -- $$
CREATE PROCEDURE AddAllergiesToPatients (
    para_doctor_id INT,
    para_patient_id INT,                  -- Parameter for the patient ID
    para_allergy_index_string TEXT        -- Parameter for a comma-separated string of allergy IDs
)
SQL SECURITY DEFINER
BEGIN
    DECLARE checked_patient_id INT; -- Variable to store patient-id
    DECLARE current_index INT DEFAULT 1;          -- Variable to track the current position in the allergy string
    DECLARE current_string_index TEXT DEFAULT ''; -- Variable to accumulate the current allergy ID being processed
    DECLARE error_message TEXT;                   -- Variable to store error messages

    -- Error handling: If an SQL exception occurs, rollback the transaction and return the error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
        ROLLBACK;  -- Rollback the transaction to undo any changes made before the error occurred
        SELECT error_message AS ErrorMessage;  -- Return the error message to the caller
    END;

    -- Initialize the base SQL INSERT statement
    SET @insert_query = 'INSERT INTO PatientAllergy (patient_id, allergy_id, record_date) VALUES';
    SET @single_value = '';  -- Variable to store the partial SQL statement for each allergy

        /* For testing purpose only
    -- Check if patient id exists
    SELECT CheckPatientExists(para_patient_id) INTO checked_patient_id
    FROM Patients
    WHERE id = para_patient_id;

    IF checked_patient_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect patient id. Please try again';
    END IF;

         */
    -- Check if the doctor has the privilege to edit the info related to the input patient
    SELECT FindPatientWithAppointmentCurrently(para_patient_id, para_doctor_id) INTO checked_patient_id;
    IF checked_patient_id = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
    END IF;

    -- Start a transaction to ensure that all operations succeed or fail together
    START TRANSACTION;
    -- Loop through each character in the para_allergy_index_string
    WHILE current_index <= LENGTH(para_allergy_index_string) DO
        -- Check if the current character is a comma, indicating the end of an allergy ID
        IF SUBSTRING(para_allergy_index_string, current_index, 1) = ',' THEN
            -- Process the current allergy ID
            SELECT ParsingAllergiesPatientsString(para_patient_id, current_string_index, 0) INTO @single_value;

            -- Append the processed value to the INSERT query
            SET @insert_query = CONCAT(@insert_query, @single_value);

            -- Reset the accumulated allergy ID string for the next iteration
            SET current_string_index = '';
        ELSE
            -- If the current character is not a comma, accumulate it as part of the allergy ID
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(para_allergy_index_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- Handle the last allergy ID (if any) after the loop ends
    IF current_string_index != '' THEN
        -- Process the last allergy ID and mark it as the last entry (1 indicates last_string)
        SELECT ParsingAllergiesPatientsString(para_patient_id, current_string_index, 1) INTO @single_value;

        -- Append the final processed value to the INSERT query
        SET @insert_query = CONCAT(@insert_query, @single_value);
    ELSE
        -- If there's no final allergy ID, remove the trailing comma from the query
    SET @insert_query = TRIM(TRAILING ',' FROM @insert_query);
    END IF;

    -- Optional: Output the final query for debugging or logging purposes
    SELECT @insert_query;

    -- Prepare and execute the final INSERT query to add all allergies for the patient
    PREPARE statement FROM @insert_query;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    -- Commit the transaction to finalize the changes in the database
    COMMIT;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddAllergiesToPatients TO 'Doctors'@'host'; -- $$


DROP PROCEDURE IF EXISTS AddNewDiagnosis; -- $$
CREATE PROCEDURE AddNewDiagnosis(
    para_doctor_id INT,           -- Parameter for the doctor ID who made the diagnosis
    para_patient_id INT,          -- Parameter for the patient ID who is being diagnosed
    para_diagnosis_date DATE,     -- Parameter for the date of the diagnosis
    para_diagnosis_note TEXT,     -- Parameter for any notes related to the diagnosis
    para_condition_code_string TEXT  -- Parameter for a comma-separated string of condition codes
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE checked_patient_id INT;
    DECLARE latest_diagnosis_id INT;             -- Variable to store the ID of the newly inserted diagnosis
    DECLARE current_index INT DEFAULT 1;         -- Variable to keep track of the current position in the condition code string
    DECLARE current_string_code TEXT DEFAULT ''; -- Variable to accumulate the current condition code being processed
    DECLARE error_message TEXT;                  -- Variable to store any error messages

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT; -- Capture the error message
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT error_message AS ErrorMessage;  -- Return the error message to the caller
    END;

    -- Initialize the base SQL INSERT statement for the DiagnosesDetails table
    SET @insert_query = 'INSERT INTO DiagnosesDetails (diagnosis_id, condition_code) VALUES ';
    SET @single_value = '';  -- Variable to store the SQL insert statement for each condition

        /* For testing purpose only
    -- Check whether the input doctor id  exist
    IF CheckDoctorExists(para_doctor_id) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect doctor id. Please try again';
    END IF;
    -- Check if the input patient id exist
    IF CheckPatientExists(para_patient_id) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect Patient id. Please try again';
    end if;

         */
    SELECT FindPatientWithAppointmentCurrently(para_patient_id, para_doctor_id) INTO checked_patient_id;
    IF checked_patient_id = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
    END IF;

    -- Start a transaction to ensure that all operations either succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Diagnoses table with the provided parameters
    INSERT INTO Diagnoses (doctor_id, patient_id, diagnosis_date, diagnosis_note)
    VALUES (para_doctor_id, checked_patient_id, para_diagnosis_date, para_diagnosis_note);
    -- Retrieve the ID of the newly inserted diagnosis
    SELECT LAST_INSERT_ID() INTO latest_diagnosis_id;
    -- Begin a loop to process the comma-separated condition codes in para_condition_code_string
    WHILE current_index <= LENGTH(para_condition_code_string) DO
        -- Check if the current character is a comma, indicating the end of a condition code
        IF SUBSTRING(para_condition_code_string, current_index, 1) = ',' THEN
            -- Process the current condition code using the ParsingDiagnosisNameString function
            SELECT ParsingDiagnosisNameString(latest_diagnosis_id, current_string_code, 0) INTO @single_value;

            -- Append the processed value to the INSERT query
            SET @insert_query = CONCAT(@insert_query, @single_value);

            -- Reset the accumulated condition code string for the next iteration
            SET current_string_code = '';
        ELSE
            -- If the current character is not a comma, accumulate it as part of the condition code
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_condition_code_string, current_index, 1));
        END IF;

        -- Move to the next character in the condition code string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last condition code in the string (as it won't be followed by a comma)
    SELECT ParsingDiagnosisNameString(latest_diagnosis_id, current_string_code, 1) INTO @single_value;

    -- Append the final processed value to the INSERT query
    SET @insert_query = CONCAT(@insert_query, @single_value);

    -- Prepare and execute the final INSERT statement for DiagnosesDetails
    PREPARE statement FROM @insert_query;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    -- Commit the transaction to save all changes
    COMMIT;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewDiagnosis TO 'Doctors'@'host'; -- $$


DROP PROCEDURE IF EXISTS AddNewPrescription; -- $$
CREATE PROCEDURE AddNewPrescription(
    para_doctor_id INT,                       -- Parameter for the doctor ID who issued the prescription
    para_patient_id INT,                      -- Parameter for the patient ID to whom the prescription is given
    para_diagnosis_id INT,                    -- Parameter for the diagnosis ID associated with the prescription
    para_prescription_note TEXT,              -- Parameter for any notes related to the prescription
    para_drug_code_quantity_string TEXT       -- Parameter for a comma-separated string of drug names and their quantities

)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE checked_patient_id INT;
    DECLARE latest_prescription_id INT; -- Variable to contain the ID of the latest prescription inserted into the TreatmentHistory table
    DECLARE current_index INT DEFAULT 1;          -- Variable to keep track of the current index in the drug code-quantity string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current drug code and quantity being processed
    DECLARE returned_statement TEXT;              -- Variable to store the SQL statements returned by the function ParsingDrugsCodeAndQuantity
    DECLARE error_message TEXT;                   -- Variable to store any error messages

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            ROLLBACK;  -- Rollback any changes made during the transaction
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;


    -- Initialize the base SQL statements for later use
    SET @insert_query = 'INSERT INTO Prescription_Details(drug_code, prescription_id, quantity, price) VALUES ';  -- Base for the INSERT query
    SET @case_clause = '';  -- Base for the CASE clause in the UPDATE query
    SET @where_clause = 'END\nWHERE drug_code IN (';  -- Start of the WHERE clause in the UPDATE query
    SET @update_query = 'UPDATE Drugs SET inventory = CASE\n';  -- Base for the UPDATE query

        /*
      -- Check whether the input doctor id  exist
    IF CheckDoctorExists(para_doctor_id) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect doctor id. Please try again';
    END IF;

    -- Check if the input patient id exist
    IF CheckPatientExists(para_patient_id) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect Patient id. Please try again';
    end if;
         */

        -- Check if the doctor has the privilege to edit info related to the input patient currently
     SELECT FindPatientWithAppointmentCurrently(para_patient_id, para_doctor_id) INTO checked_patient_id;
    IF checked_patient_id = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
    END IF;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the TreatmentHistory table with the provided parameters
    INSERT INTO TreatmentHistory(doctor_id, patient_id, diagnosis_id, treatment_start_date, prescription_note)
    VALUES (para_doctor_id, checked_patient_id, para_diagnosis_id, CURDATE(), para_prescription_note);

    -- Retrieve the ID of the newly inserted record in TreatmentHistory
    SELECT LAST_INSERT_ID() INTO latest_prescription_id;

    -- Begin a loop to process the comma-separated drug codes and quantities in para_drug_code_quantity_string
    WHILE current_index <= LENGTH(para_drug_code_quantity_string) DO
        -- Check if the current character is a comma, indicating the end of a drug code and quantity pair
        IF SUBSTRING(para_drug_code_quantity_string, current_index, 1) = ',' THEN
            -- Call the function ParsingDrugsCodeAndQuantity to process the current drug code and quantity
            SELECT ParsingDrugsCodeAndQuantity(current_string_code, latest_prescription_id, 0)
            INTO returned_statement;

            -- Update the INSERT query with the returned INSERT statement for the current drug
            SET @insert_query = CONCAT(@insert_query, SUBSTRING_INDEX(returned_statement, ';', 1), ',');
            SET @insert_query = CONCAT(@insert_query, SUBSTRING_INDEX(returned_statement, ';', 1), ',');

            -- Update the CASE clause for the UPDATE query with the returned CASE statement for the current drug
            SET @case_clause = CONCAT(@case_clause, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1 ), ',', 1));

            -- Update the WHERE clause for the UPDATE query with the returned WHERE condition for the current drug
            SET @where_clause = CONCAT(@where_clause, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1 ), ',', -1));

            -- Reset the accumulated string code for the next iteration
            SET current_string_code = '';
        ELSE
            -- If the current character is not a comma, continue accumulating the drug code and quantity
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_drug_code_quantity_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last drug code and quantity pair in the string (as it won't be followed by a comma)
    SELECT ParsingDrugsCodeAndQuantity(current_string_code, latest_prescription_id, 1)
	INTO returned_statement;

    -- Finalize the INSERT query with the last drug's data
    SET @insert_query = CONCAT(@insert_query, SUBSTRING_INDEX(returned_statement, ';', 1));
    SELECT SUBSTRING_INDEX(returned_statement, ';', 1);

    -- Finalize the CASE clause and WHERE clause with the last drug's data
    SET @case_clause = CONCAT(@case_clause, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -2), ';', 1));
	SET @where_clause = CONCAT(@where_clause, SUBSTRING_INDEX(returned_statement, ';', -1));

    -- Finalize the UPDATE query by concatenating the CASE clause and WHERE clause
    SET @update_query = CONCAT(@update_query, @case_clause, @where_clause);

    -- Prepare and execute the final INSERT statement for Prescription_Details
    SELECT @insert_query;
    PREPARE insert_statement FROM @insert_query;
    EXECUTE insert_statement;
    DEALLOCATE PREPARE insert_statement;

    -- Prepare and execute the final UPDATE statement for the Drugs inventory
    SELECT @update_query;
    PREPARE update_statement FROM @update_query;
    EXECUTE update_statement;
    DEALLOCATE PREPARE update_statement;

    -- Commit the transaction to save all changes
    COMMIT;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewPrescription TO 'Doctors'@'host'; -- $$



DROP PROCEDURE IF EXISTS OrderTest; -- $$
CREATE PROCEDURE OrderTest(
    para_doctor_id INT,                   -- Parameter for the doctor ID who orders the test
    para_patient_id INT,                  -- Parameter for the patient ID for whom the test is ordered
    para_administering_date DATE,         -- Parameter for the date when the test will be administered
    para_administering_time TIME,         -- Parameter for the time when the test will be administered
    para_text_name_string TEXT            -- Parameter for a comma-separated string of test type names
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE checked_patient_id INT;
    DECLARE latest_test_order_id INT;               -- Variable to store the ID of the latest test order
    DECLARE current_index INT DEFAULT 1;            -- Variable to keep track of the current position in the test type name string
    DECLARE current_string_code TEXT DEFAULT '';    -- Variable to accumulate the current test type name being processed
    DECLARE error_message TEXT;                     -- Variable to store any error messages

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT; -- Capture the error message
        ROLLBACK;  -- Rollback the transaction to undo any changes made during the process
        SELECT error_message AS ErrorMessage;  -- Return the error message to the caller
    END;

    -- Initialize the base SQL INSERT statement for the Test_Details table
    SET @insert_query = 'INSERT INTO Test_Details(test_id, test_type_id, administering_date, administering_time, price) VALUES ';
    SET @single_value = '';  -- Variable to store the SQL insert statement for each test type

        /*
    -- Check if the input doctor id is correct
    IF CheckDoctorExists(para_doctor_id) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect doctor id. Please try again';
    end if;

    -- Check if the input patient id is correct
    IF CheckPatientExists(para_patient_id) = 0 THEN
         SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect patient id. Please try again';
    end if;

         */
     SELECT FindPatientWithAppointmentCurrently(para_patient_id, para_doctor_id) INTO checked_patient_id;
    IF checked_patient_id = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
    END IF;

    -- Start a transaction to ensure that all operations either succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Test_Orders table with the provided parameters
    INSERT INTO Test_Orders(patient_id, ordering_staff_id, ordering_date)
    VALUES (checked_patient_id, para_doctor_id, CURDATE());

    -- Retrieve the ID of the newly inserted test order
    SELECT LAST_INSERT_ID() INTO latest_test_order_id;

    -- Begin a loop to process the comma-separated test type names in para_text_name_string
    WHILE current_index <= LENGTH(para_text_name_string) DO
        -- Check if the current character is a comma, indicating the end of a test type name
        IF SUBSTRING(para_text_name_string, current_index, 1) = ',' THEN
            -- Process the current test type name using the ParsingTestTypeIdString function
            SELECT ParsingTestTypeIdString(latest_test_order_id, current_string_code,
                                           para_administering_date, para_administering_time, para_doctor_id, 0)
            INTO @single_value;

            -- Append the processed value to the INSERT query
            SET @insert_query = CONCAT(@insert_query, @single_value);

            -- Reset the accumulated string code for the next iteration
            SET current_string_code = '';
        ELSE
            -- If the current character is not a comma, accumulate it as part of the test type name
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_text_name_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last test type name in the string (as it won't be followed by a comma)
    SELECT ParsingTestTypeIdString(latest_test_order_id, current_string_code,
                                   para_administering_date, para_administering_time, para_doctor_id, 1)
    INTO @single_value;

    -- Append the final processed value to the INSERT query
    SET @insert_query = CONCAT(@insert_query, @single_value);

    SELECT @insert_query;
    -- Prepare and execute the final INSERT statement for Test_Details
    PREPARE insert_statement FROM @insert_query;
    EXECUTE insert_statement;
    DEALLOCATE PREPARE insert_statement;

    -- Commit the transaction to save all changes
    COMMIT;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.OrderTest TO 'Doctors'@'host'; -- $$



DROP PROCEDURE IF EXISTS FetchAppointmentById; -- $$
CREATE PROCEDURE FetchAppointmentById(para_doctor_id INT)  -- Procedure to fetch a doctor's schedule by their ID
SQL SECURITY DEFINER
BEGIN
    -- Select the schedule details for the specified doctor
    SELECT
        Appointments.appointment_date,
        Appointments.start_time,
        Appointments.end_time,
        Appointments.appointment_purpose,                    -- The purpose of the appointment
        Appointments.appointment_notes_document_id,          -- The document ID for the appointment notes
        Patients.id AS patient_id,                           -- The ID of the patient associated with the appointment
        Patients.full_name AS patient_name,                  -- The full name of the patient
        Patients.gender AS patient_gender,                   -- The gender of the patient
        Patients.birth_date AS patient_birth_date            -- The birth date of the patient
    FROM
        Appointments                                       -- The table containing staff schedules
    INNER JOIN
        Patients                                             -- Joining with the Patients table to get patient details
    ON
        Appointments.patient_id = Patients.id                -- Matching the patient ID in appointments with the Patients table
    WHERE
        Appointments.doctor_id = para_doctor_id                           -- Filtering the results to include only the specified doctor's schedule
            AND
        appointment_status = 'Active' OR appointment_status = 'Finished';
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDoctorScheduleById TO 'Doctors'@'host'; -- $$
