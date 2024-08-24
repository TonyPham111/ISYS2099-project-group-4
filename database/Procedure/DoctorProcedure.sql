DELIMITER $$

DROP PROCEDURE IF EXISTS AddAllergiesToPatients$$
CREATE PROCEDURE AddAllergiesToPatients (
    para_patient_id INT,
    para_allergy_index_string TEXT        -- Parameter for a comma-separated string of allergy IDs
)
SQL SECURITY DEFINER
BEGIN
    DECLARE current_index INT DEFAULT 1;          -- Variable to keep track of the current index in the allergy ID string
    DECLARE current_string_index TEXT DEFAULT ''; -- Variable to accumulate the current allergy ID being processed
    DECLARE error_message TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;
            ROLLBACK;  -- Rollback any changes made during the transaction
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;
    
	-- Validate inputs
	IF NOT CheckPatientExists(para_patient_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Patient does not exist';
    END IF;
    
    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
        -- Begin a loop to process the comma-separated allergy IDs in para_allergy_index_string
        WHILE current_index <= LENGTH(para_allergy_index_string) DO
        -- Check if the current character is a comma, indicating the end of an allergy ID
        IF SUBSTRING(para_allergy_index_string, current_index, 1) = ',' THEN
            CALL ParsingAllergiesIdString(para_patient_id, current_string_index);
            SET current_string_index = '';
        ELSE
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(para_allergy_index_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last allergy ID in the string (if there is any remaining)
    CALL ParsingAllergiesIdString(para_patient_id, current_string_index);
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddAllergiesToPatients TO 'Doctors'@'host'$$


DROP PROCEDURE IF EXISTS AddNewDiagnosis$$
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
    DECLARE latest_diagnosis_id INT; -- Variable to store the id of the latest diagnosis
    DECLARE current_index INT DEFAULT 1;  -- Variable to keep track of the current index in the condition code string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current condition code being processed
    DECLARE error_message TEXT;

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;
			ROLLBACK;  -- Rollback any changes made during the transaction
			SELECT error_message AS ErrorMessage;  -- Return an error message
		END;

	-- Validate inputs
	IF NOT CheckPatientExists(para_patient_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Patient does not exist';
    END IF;
    
	IF NOT CheckDoctorExists(para_doctor_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Doctor does not exist';
    END IF;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Diagnoses table with the provided parameters
    INSERT INTO Diagnoses (doctor_id, patient_id, diagnosis_date, diagnosis_note)
    VALUES (para_doctor_id, para_patient_id, para_diagnosis_date, para_diagnosis_note);

    SELECT LAST_INSERT_ID() INTO latest_diagnosis_id;

    -- Begin a loop to process the comma-separated condition codes in para_condition_code_string
    WHILE current_index <= LENGTH(para_condition_code_string) DO
        -- Check if the current character is a comma, indicating the end of a condition code
        IF SUBSTRING(para_condition_code_string, current_index, 1) = ',' THEN
            CALL ParsingDiagnosisCodeString(latest_diagnosis_id, current_string_code);
            -- Reset the accumulated condition code for the next iteration
            SET current_string_code = '';
        ELSE
            -- If not a comma, continue accumulating the condition code
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_condition_code_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last condition code in the string (as it won't be followed by a comma)
     CALL ParsingDiagnosisCodeString(latest_diagnosis_id, current_string_code);
    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewDiagnosis TO 'Doctors'@'host'$$


DROP PROCEDURE IF EXISTS AddNewPrescription$$
CREATE PROCEDURE AddNewPrescription(
    para_doctor_id INT,                       -- Parameter for the doctor ID who issued the prescription
    para_patient_id INT,                      -- Parameter for the patient ID to whom the prescription is given
    para_treatment_end_time DATETIME,         -- Parameter for the end time of the treatment
    para_diagnosis_id INT,                    -- Parameter for the diagnosis ID associated with the prescription
    para_prescription_note TEXT,              -- Parameter for any notes related to the prescription
    para_drug_code_quantity_string TEXT       -- Parameter for a comma-separated string of drug codes and their quantities
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE latest_prescription_id INT; -- Variable to contain the id of the latest prescription
    DECLARE current_index INT DEFAULT 1;          -- Variable to keep track of the current index in the drug code quantity string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current drug code and quantity being processed
    DECLARE error_message TEXT;

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;
			ROLLBACK;  -- Rollback any changes made during the transaction
			SELECT error_message AS ErrorMessage;  -- Return an error message
		END;
	
	-- Validate inputs
	IF NOT CheckPatientExists(para_patient_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Patient does not exist';
    END IF;
    
	IF NOT CheckDoctorExists(para_doctor_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Doctor does not exist';
    END IF;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the TreatmentHistory table with the provided parameters
    INSERT INTO TreatmentHistory(doctor_id, patient_id, diagnosis_id, treatment_start_date, treatment_end_date, prescription_note)
    VALUES (para_doctor_id, para_patient_id, para_diagnosis_id, NOW(), para_treatment_end_time, para_prescription_note);
    
    SELECT LAST_INSERT_ID() INTO latest_prescription_id;

    -- Begin a loop to process the comma-separated drug codes and quantities in para_drug_code_quantity_string
    WHILE current_index <= LENGTH(para_drug_code_quantity_string) DO
        -- Check if the current character is a comma, indicating the end of a drug code and quantity pair
        IF SUBSTRING(para_drug_code_quantity_string, current_index, 1) = ',' THEN
            CALL ParsingDrugsCodeAndQuantity(latest_prescription_id, current_string_code);
            -- Reset the accumulated string code for the next iteration
            SET current_string_code = '';
        ELSE
            -- If not a comma, continue accumulating the drug code and quantity
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_drug_code_quantity_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last drug code and quantity pair in the string (as it won't be followed by a comma)
    CALL ParsingDrugsCodeAndQuantity(latest_prescription_id, current_string_code);

    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewPrescription TO 'Doctors'@'host'$$


DROP PROCEDURE IF EXISTS OrderTest$$
CREATE PROCEDURE OrderTest(
    para_patient_id INT,                  -- Parameter for the patient ID for whom the test is ordered
    para_doctor_id INT,                   -- Parameter for the doctor ID who orders the test
    para_administering_date DATE,         -- Parameter for the date when the test will be administered
    para_administering_time TIME,         -- Parameter for the time when the test will be administered
    para_ordering_date DATE,              -- Parameter for the date when the test was ordered
    para_test_id_string TEXT              -- Parameter for a comma-separated string of test type IDs
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE latest_test_order_id INT; -- Variable to store the id of the latest test order
    DECLARE current_index INT DEFAULT 1;      -- Variable to keep track of the current index in the test type ID string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current test type ID being processed
    DECLARE error_message TEXT;

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;
			ROLLBACK;  -- Rollback any changes made during the transaction
			SELECT error_message AS ErrorMessage;  -- Return an error message
		END;

	-- Validate inputs
	IF NOT CheckPatientExists(para_patient_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Patient does not exist';
    END IF;
    
	IF NOT CheckDoctorExists(para_doctor_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Doctor does not exist';
    END IF;
    
    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Test_Orders table with the provided parameters
    INSERT INTO Test_Orders(patient_id, ordering_staff_id, ordering_date)
    VALUES (para_patient_id, para_doctor_id, para_ordering_date);
    SELECT LAST_INSERT_ID() INTO latest_test_order_id;

    -- Begin a loop to process the comma-separated test type IDs in para_test_id_string
    WHILE current_index <= LENGTH(para_test_id_string) DO
        -- Check if the current character is a comma, indicating the end of a test type ID
        IF SUBSTRING(para_test_id_string, current_index, 1) = ',' THEN
            CALL ParsingTestIdString(latest_test_order_id, current_string_code, para_administering_date, para_administering_time, para_doctor_id);
            -- Reset the accumulated string code for the next iteration
            SET current_string_code = '';
        ELSE
            -- If not a comma, continue accumulating the test type ID
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_test_id_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last test type ID in the string (as it won't be followed by a comma)
    CALL ParsingTestIdString(latest_test_order_id, current_string_code, para_administering_date, para_administering_time, para_doctor_id);

    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.OrderTest TO 'Doctors'@'host'$$


DROP PROCEDURE IF EXISTS FetchDoctorScheduleById$$
CREATE PROCEDURE FetchDoctorScheduleById(para_doctor_id INT)  -- Procedure to fetch a doctor's schedule by their ID
SQL SECURITY DEFINER
BEGIN
    -- Select the schedule details for the specified doctor
    SELECT
        Staff_Schedule.schedule_date,                        -- The date of the schedule
        Staff_Schedule.start_time,                           -- The start time of the schedule
        Staff_Schedule.end_time,                             -- The end time of the schedule
        Appointments.appointment_purpose,                    -- The purpose of the appointment
        Appointments.appointment_notes_document_id,          -- The document ID for the appointment notes
        Patients.id AS patient_id,                           -- The ID of the patient associated with the appointment
        Patients.full_name AS patient_name,                  -- The full name of the patient
        Patients.gender AS patient_gender,                   -- The gender of the patient
        Patients.birth_date AS patient_birth_date            -- The birth date of the patient
    FROM
        Staff_Schedule                                       -- The table containing staff schedules
    INNER JOIN
        Appointments                                         -- Joining with the Appointments table to get appointment details
    ON
        Staff_Schedule.id = Appointments.id                  -- Matching the schedule ID with the appointment ID
    INNER JOIN
        Patients                                             -- Joining with the Patients table to get patient details
    ON
        Appointments.patient_id = Patients.id                -- Matching the patient ID in appointments with the Patients table
    WHERE
        doctor_id = para_doctor_id;                          -- Filtering the results to include only the specified doctor's schedule
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDoctorScheduleById TO 'Doctors'@'host'$$

DELIMITER ;
