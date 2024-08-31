DELIMITER $$
DROP PROCEDURE IF EXISTS FetchPatientsAllergies$$

CREATE PROCEDURE FetchPatientsAllergies(
    patient_id INT
)
SQL SECURITY DEFINER
BEGIN
	DECLARE error_message TEXT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
			ROLLBACK;  -- Rollback the transaction to undo any changes made before the error occurred
			SELECT error_message;
		END;
    SELECT
        PatientAllergy.record_date,
        Allergies.allergy_name,            
        Allergies.allergy_type,
        Allergies.allergen,
        Allergies.allergy_group
    FROM Patients
    INNER JOIN
        PatientAllergy                        
    ON
        Patients.id = PatientAllergy.id
    INNER JOIN
        Allergies                    
    ON
        PatientAllergy.allergy_id = Allergies.id
    WHERE Patients.id = patient_id;
END$$

GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsAllergies TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsAllergies TO 'Nurses'@'IP'$$


DROP PROCEDURE IF EXISTS FetchPatientsPersonalInfo$$
CREATE PROCEDURE FetchPatientsPersonalInfo()
SQL SECURITY DEFINER
BEGIN
	DECLARE error_message TEXT;		
	 DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
			ROLLBACK;  -- Rollback the transaction to undo any changes made before the error occurred
			SELECT error_message;
		END;
    SELECT
        id,
        full_name,
        birth_date,
        gender,
        phone_number,
        home_address
    FROM Patients;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfo TO 'FrontDesk'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfo TO 'BusinessOfficers'@'IP'$$


DROP PROCEDURE IF EXISTS FetchStaffInfoById$$
CREATE PROCEDURE FetchStaffInfoById(
    staff_id INT                      -- Parameter for the ID of the staff member whose details are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE error_message TEXT;
	 DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
			ROLLBACK;  -- Rollback the transaction to undo any changes made before the error occurred
			SELECT error_message;
		END;
    -- Select various fields from the Staff, Jobs, and Departments tables
    SELECT
        Non_Manager.id,                     -- The ID of the staff member
        Non_Manager.full_name,              -- The full name of the staff member
        Jobs.job_name,                      -- The job title of the staff member
        Departments.department_name,        -- The department name where the staff member works
        Non_Manager.gender,                 -- The gender of the staff member
        Non_Manager.birth_date,             -- The birth date of the staff member
        Non_Manager.home_address,           -- The home address of the staff member
        Non_Manager.phone_number,           -- The phone number of the staff member
        Non_Manager.email,                  -- The email address of the staff member
        Non_Manager.staff_password,         -- The password of the staff member
        Non_Manager.wage,                   -- The wage of the staff member
        Non_Manager.hire_date,              -- The hire date of the staff member
        Non_Manager.employment_status,      -- The employment status (e.g., 'Active')
        Non_Manager.employment_document_id, -- The employment document ID of the staff member
        Manager.full_name AS manager_name   -- The full name of the manager associated with the staff member
    FROM
        Staff AS Manager                     -- Reference the Staff table as Manager
    INNER JOIN
        Staff AS Non_Manager                 -- Reference the Staff table as Non_Manager
    ON
        Manager.id = Non_Manager.Manager_id  -- Join to link staff members with their managers
    INNER JOIN
        Jobs                                 -- Join with the Jobs table to retrieve job titles
    ON
        Non_Manager.job_id = Jobs.id         -- Match job_id with the Jobs table
    INNER JOIN
        Departments                          -- Join with the Departments table to retrieve department names
    ON
        Departments.id = Non_Manager.department_id -- Match department_id with the Departments table
    WHERE
        Non_Manager.id = staff_id;           -- Filter to include only the specified staff member

END;
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'HR'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Nurses'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'FrontDesk'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'BusinessOfficers'@'IP'$$

DROP PROCEDURE IF EXISTS FetchDiagnosesByPatientId$$
CREATE PROCEDURE FetchDiagnosesByPatientId(
    patient_id INT  -- Parameter for the ID of the patient whose diagnoses are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE error_message TEXT;
	 DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
			SELECT error_message;
		END;
    -- Select various fields related to diagnoses for the specified patient
    SELECT

        Diagnoses.id AS diagnosis_id,         -- The ID of the diagnosis
        Staff.full_name AS doctor_name,       -- The full name of the doctor who made the diagnosis
        Diagnoses.diagnosis_date,             -- The date when the diagnosis was made
        Diagnoses.diagnosis_note,              -- Any notes related to the diagnosis
        Conditions.condition_code,
        Conditions.condition_name,            -- The name of the diagnosed condition
        Conditions.condition_description
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

END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientId TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientId TO 'Nurses'@'IP'$$


DROP PROCEDURE IF EXISTS FetchTestDetailsByPatientId$$
CREATE PROCEDURE FetchTestDetailsByPatientId(
    patient_id INT    -- Parameter for the ID of the patient whose test details are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE error_message TEXT;
	 DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
			SELECT error_message;
		END;
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
        Test_Orders_Details.id,                -- The ID of the test order
        Test_Orders_Details.ordering_doctor,   -- The name of the doctor who ordered the test
        Test_Orders_Details.ordering_date,
        Test_Types.test_name,                  -- The name of the test
        Test_Orders_Details.ordering_date,     -- The date the test was ordered
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
    LEFT OUTER JOIN
        Staff                                  -- The Staff table to retrieve the name of the nurse who administered the test
    ON
        Test_Details.administering_staff_id = Staff.id -- Join on the staff ID to get the administering nurse's name
    INNER JOIN
        Test_Orders_Details                    -- The CTE to link the test details with the test orders
    ON
        Test_Details.test_id = Test_Orders_Details.id -- Join on the test ID to get the order details
    WHERE
        Test_Orders_Details.patient_id = patient_id;  -- Filter to include only the tests for the specified patient

END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientId TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientId TO 'Nurses'@'IP'$$

DROP PROCEDURE IF EXISTS FetchPrescriptionsByPatientId$$
CREATE PROCEDURE FetchPrescriptionsByPatientId(
    para_patient_id INT  -- Parameter for the ID of the patient whose prescriptions are to be fetched
)
BEGIN
	DECLARE error_message TEXT;
	 DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
			SELECT error_message;
		END;
    -- Select various fields related to the prescriptions for the specified patient
    SELECT
        TreatmentHistory.id,
        treatment_start_date,
        Staff.full_name AS doctor_name,      -- The full name of the doctor who prescribed the drug
        Drugs.drug_name,                    -- The name of the drug prescribed
        Prescription_Details.quantity,      -- The quantity of the drug prescribed
        Drugs.unit,                         -- The unit of the drug (e.g., capsule, tablet)
        Prescription_Details.price


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

END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientId TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientId TO 'Nurses'@'IP'$$

DROP PROCEDURE IF EXISTS GetStaffUnderManager;
-- procedure to get all staff under a manager
CREATE PROCEDURE GetStaffUnderManager(
    IN managerId INT
)
BEGIN
	DECLARE error_message TEXT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
			SELECT error_message;
		END;
    
    SELECT 
        s.id AS staff_id,
        s.full_name,
        j.job_name,
        s.gender,
        s.birth_date,
        s.email,
        s.phone_number
    FROM 
        Staff s
    INNER JOIN 
        Jobs j ON s.job_id = j.id
    INNER JOIN 
        Departments d ON s.department_id = d.id
    WHERE 
        s.manager_id = managerId AND   s.employment_status = 'Active';
END$$

GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'HR'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'BusinessOfficers'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'Nurses'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'FrontDesk'@'IP'$$


DROP PROCEDURE IF EXISTS Scheduling$$
CREATE PROCEDURE Scheduling(
	manager_id INT,
    para_staff_id INT,
    schedule_string TEXT
)
BEGIN
	DECLARE current_index INT DEFAULT 1;          -- Variable to track the current position in the allergy string
    DECLARE current_string_index TEXT DEFAULT ''; -- Variable to accumulate the current allergy ID being processed
    DECLARE error_message TEXT;                   -- Variable to store error messages
    DECLARE returned TEXT;
    DECLARE returned_statement TEXT;
    DECLARE original_insert_statement TEXT DEFAULT 'INSERT INTO Staff_Schedule (staff_id, schedule_date, start_time, end_time) VALUES ';
    DECLARE original_update_statement TEXT DEFAULT 'Update Staff_Schedule SET ';

    -- Error handling: If an SQL exception occurs, rollback the transaction and return the error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
        ROLLBACK;  -- Rollback the transaction to undo any changes made before the error occurred
        SELECT error_message;
    END;
    IF NOT CheckManagementRelationship(para_staff_id, manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to schedule for this staff';
    END IF;
	
    SET @insert_statement = 'INSERT INTO Staff_Schedule (staff_id, schedule_date, start_time, end_time) VALUES ';
    SELECT @insert_statement;
    SET @update_statement = 'Update Staff_Schedule SET ';
    SET @update_statement_start_time = 'start_time = CASE \n';
    SET @update_statement_end_time = 'end_time = CASE \n';
    SET @update_where_statement = 'WHERE id IN (';
     -- Start a transaction to ensure that all operations succeed or fail together
    START TRANSACTION;
    -- Loop through each character in the para_allergy_index_string
    WHILE current_index <= LENGTH(schedule_string) DO
        -- Check if the current character is a comma, indicating the end of an allergy ID
        IF SUBSTRING(schedule_string, current_index, 1) = ',' THEN
			SELECT ParseScheduleString(para_staff_id, current_string_index, 0) INTO returned;
            SET returned_statement = SUBSTRING_INDEX(returned, '/', -1);
            IF substring_INDEX(returned, '/', 1) = '1' THEN
				 SET @insert_statement = CONCAT(@insert_statement,returned_statement, '),');
            ELSE
				SELECT('Hello');
				SET @update_where_statement = CONCAT(@update_where_statement, SUBSTRING_INDEX(returned_statement, ';', 1), ', ');
				SET @update_statement_start_time = CONCAT(@update_statement_start_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', 1), '\n');
				SET @update_statement_end_time = CONCAT(@update_statement_end_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', -1), '\n');
            END IF;
            -- Reset the accumulated allergy ID string for the next iteration
            SET current_string_index = '';
        ELSE
            -- If the current character is not a comma, accumulate it as part of the allergy ID
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(schedule_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;
    
    SELECT current_string_index;
	SELECT ParseScheduleString(para_staff_id, current_string_index, 1) INTO returned;
    SET returned_statement = SUBSTRING_INDEX(returned, '/', -1);
    SELECT returned;
    IF substring_INDEX(returned, '/', 1) = '1' THEN
		SET @insert_statement = CONCAT(@insert_statement,returned_statement, ');');
    ELSE
		SET @update_where_statement = CONCAT(@update_where_statement, SUBSTRING_INDEX(returned_statement, ';', 1), ');');
		SET @update_statement_start_time = CONCAT(@update_statement_start_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', 1), '\n', 'ELSE start_time \n END,\n');
		SET @update_statement_end_time = CONCAT(@update_statement_end_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', -1), '\n', 'ELSE end_time \n END\n');
		SET @update_statement = CONCAT(@update_statement, @update_statement_start_time, @update_statement_end_time, @update_where_statement);
    END IF;
    
	SELECT @update_statement_start_time;
    SELECT @update_statement_end_time;
    SELECT @update_where_statement;
    SELECT @update_statement;
	
    if original_insert_statement <> @insert_statement THEN
		SELECT @insert_statement;
		PREPARE insert_statement FROM @insert_statement;
		EXECUTE insert_statement;
		DEALLOCATE PREPARE insert_statement;
    END IF;
    
    IF original_update_statement <> @update_statement THEN
		PREPARE update_statement FROM @update_statement;
		EXECUTE update_statement;
		DEALLOCATE PREPARE update_statement;
    END IF;
    
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'BusinessOfficers'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'Nurses'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'FrontDesk'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'HR'@'IP'$$

DROP PROCEDURE IF EXISTS DeleteSchedules$$
CREATE PROCEDURE DeleteSchedules (
	para_staff_id INT,
    para_manager_id INT,
    schedule_id_string TEXT
)
SQL SECURITY DEFINER
BEGIN
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
	IF NOT CheckManagementRelationship(para_staff_id, para_management_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to make change to this staff schedule';
	
    END IF;
    -- Initialize the base SQL INSERT statement
    SET @delete_query = 'DELETE FROM Staff_Schedule WHERE id IN ( ';
    SET @single_value = '';  -- Variable to store the partial SQL statement for each allergy
	
 
    -- Start a transaction to ensure that all operations succeed or fail together
    START TRANSACTION;
    -- Loop through each character in the para_allergy_index_string
    WHILE current_index <= LENGTH(schedule_id_string) DO
        -- Check if the current character is a comma, indicating the end of an allergy ID
        IF SUBSTRING(schedule_id_string, current_index, 1) = ',' THEN
            -- Process the current allergy ID
            SELECT ParsingScheduleIdString(current_string_index, 0) INTO @single_value;

            -- Append the processed value to the INSERT query
            SET @delete_query = CONCAT(@delete_query, @single_value);

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
        -- Process the current allergy ID
		SELECT ParsingScheduleIdString(current_string_index, 1) INTO @single_value;
		-- Append the processed value to the INSERT query
		SET @delete_query = CONCAT(@delete_query, @single_value);
    END IF;

    -- Prepare and execute the final INSERT query to add all allergies for the patient
    PREPARE statement FROM @delete_query;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    -- Commit the transaction to finalize the changes in the database
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'Doctors'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'BusinessOfficers'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'Nurses'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'FrontDesk'@'IP'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'HR'@'IP'$$


DROP PROCEDURE IF EXISTS GetAppointmentsAndSchedulesByStaff$$
CREATE PROCEDURE GetAppointmentsAndSchedulesByStaff(
    para_management_id INT,
    para_staff_id INT
)
SQL SECURITY DEFINER
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;  -- Get the error message from the diagnostics
        SELECT error_message AS ErrorMessage;  -- Return the error message to the caller
    END;
    IF NOT CheckManagementRelationship(para_staff_id, para_management_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You are not allowed to view this staff';
    END IF;
    SELECT Staff_Schedule.id,
           Staff_Schedule.schedule_date,
           Staff_Schedule.start_time,
           Staff_Schedule.end_time
    FROM Staff_Schedule
    WHERE Staff_Schedule.staff_id = para_staff_id;

    SELECT Appointments.id,
           Appointments.patient_id,
           Appointments.appointment_date,
           Appointments.start_time,
           Appointments.end_time
    FROM Appointments
    WHERE doctor_id = para_staff_id;

end $$

DELIMITER ;