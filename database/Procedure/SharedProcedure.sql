DELIMITER $$
DROP PROCEDURE IF EXISTS FetchPatientsAllergies;
CREATE PROCEDURE FetchPatientsAllergies(
    patient_id INT
)
SQL SECURITY DEFINER
BEGIN
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
        PatientAllergy.allergy_id = Allergies.is 
    INNER JOIN
        Allergies                         
    ON
        PatientAllergy.allergy_id = Allergies.id 
    WHERE Patients.id = patient_id;
END;



DROP PROCEDURE IF EXISTS FetchStaffInfoById; -- $$
CREATE PROCEDURE FetchStaffInfoById(
    staff_id INT                      -- Parameter for the ID of the staff member whose details are to be fetched
)
SQL SECURITY DEFINER
BEGIN
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
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'HR'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Doctors'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Nurses'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'FrontDesk'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'BusinessOfficers'@'host'; -- $$


DROP PROCEDURE IF EXISTS FetchPatientsPersonalInfo; -- $$
CREATE PROCEDURE FetchPatientsPersonalInfo()
SQL SECURITY DEFINER
BEGIN
    SELECT
        id,
        ssn,
        full_name,
        birth_date,
        gender,
        phone_number,
        email
    FROM Patients;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfo TO 'FrontDesk'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfo TO 'BusinessOfficers'@'host'; -- $$

DROP PROCEDURE IF EXISTS Schedule; -- $$
CREATE PROCEDURE Schedule (
    para_manager_id INT,
    staff_id INT,
    para_schedule_date DATE,
    schedule_start_time TIME,
    schedule_end_time TIME,
    schedule_note TEXT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE checked_staff_id INT;

       -- Check if the staff has the authority to schedule for the other staff
    IF NOT CheckManagementRelationship(manager_id, staff_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Do not have the authority to schedule for this staff.'
    END IF;

    SELECT ScheduleCheck(checked_staff_id, para_schedule_date,
                       schedule_start_time, schedule_end_time);

    INSERT INTO Staff_Schedule (staff_id, schedule_date, start_time, end_time, note)
        VALUES (checked_staff_id, para_schedule_date, schedule_start_time, schedule_end_time, schedule_note);

END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Schedule TO 'HR'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Schedule TO 'Doctors'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Schedule TO 'Nurses'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Schedule TO 'FrontDesk'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Schedule TO 'BusinessOfficers'@'host'; -- $$

DROP PROCEDURE IF EXISTS Reschedule; -- $$
CREATE PROCEDURE Reschedule(
    manager_id INT,
    staff_id INT,
    schedule_id INT,          -- Parameter for the ID of the appointment to be rescheduled
    para_schedule_date DATE,       -- Parameter for the new date of the appointment
    para_start_time TIME,             -- Parameter for the new start time of the appointment
    para_end_time TIME                -- Parameter for the new end time of the appointment
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE para_schedule_id INT;                 -- Variable to store the schedule ID associated with the appointment

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Check if the staff has the authority to schedule for the other staff
    IF NOT CheckManagementRelationship(manager_id, staff_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Do not have the authority to schedule for this staff.'
    END IF;

    -- Check if schedule_id belongs to the doctor_id
    SELECT Staff_Schedule.id INTO para_schedule_id
            FROM Staff_Schedule
            WHERE Staff_Schedule.id = schedule_id
              AND Staff_Schedule.staff_id = staff_id LIMIT 1;

    IF para_schedule_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect schedule id. Please try again';
    END IF;

    UPDATE Staff_Schedule
        SET schedule_date = para_schedule_date,        -- Update the schedule date
            start_time = para_start_time,                 -- Update the start time
            end_time = para_end_time                      -- Update the end time
        WHERE id = schedule_id;                      -- Specify the schedule to update by its ID

END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Reschedule TO 'HR'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Reschedule TO 'Doctors'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Reschedule TO 'Nurses'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Reschedule TO 'FrontDesk'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Reschedule TO 'BusinessOfficers'@'host'; -- $$

DROP PROCEDURE IF EXISTS FetchPatientsAllergies;
CREATE PROCEDURE FetchPatientsAllergies(
    patient_id INT
)
SQL SECURITY DEFINER
BEGIN
    SELECT 
END;

DROP PROCEDURE IF EXISTS FetchTestDetailsByPatientId; -- $$
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

END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientId TO 'Doctors'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientId TO 'Nurses'@'host'; -- $$

DROP PROCEDURE IF EXISTS FetchDiagnosesByPatientId; -- $$
CREATE PROCEDURE FetchDiagnosesByPatientId(
    patient_id INT  -- Parameter for the ID of the patient whose diagnoses are to be fetched
)
SQL SECURITY DEFINER
BEGIN
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

END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientId TO 'Doctors'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientId TO 'Nurses'@'host'; -- $$


DROP PROCEDURE IF EXISTS FetchPrescriptionsByPatientId; -- $$
CREATE PROCEDURE FetchPrescriptionsByPatientId(
    para_patient_id INT  -- Parameter for the ID of the patient whose prescriptions are to be fetched
)
BEGIN
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

END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientId TO 'Doctors'@'host'; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientId TO 'Nurses'@'host'; -- $$


-- procedure to get all staff under a manager
CREATE PROCEDURE GetStaffUnderManager(
    IN managerId INT
)
BEGIN
    SELECT 
        s.id AS staff_id,
        s.full_name,
        j.job_name,
        d.department_name,
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

GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'HR'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'BusinessOfficers'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'Doctors'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'Nurses'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'FrontDesk'@'host'$$


-- Procedure for creating new evaluation
CREATE PROCEDURE CreateNewEvaluation(
    IN para_manager_id INT,               -- Manager ID (who is logged in)
    IN para_staff_id INT,                 -- Staff ID (who is being evaluated)
    IN para_evaluation_string TEXT        -- Evaluation string (scores for criteria)
)
SQL SECURITY DEFINER
BEGIN
    DECLARE current_index INT DEFAULT 1;             -- Variable to keep track of the current index in the string
    DECLARE current_string_index TEXT DEFAULT '';    -- Variable to accumulate the current score being processed
    DECLARE error_message TEXT;
    DECLARE eval_id INT;                             -- Variable to store the newly created evaluation ID
    DECLARE crit_id INT DEFAULT 1;                   -- Variable to track the criteria ID
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 error_message = MESSAGE_TEXT;
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT error_message AS ErrorMessage;  -- Return an error message
    END;

    -- Validate that the staff ID exists and is managed by the manager
    IF NOT EXISTS (SELECT 1 FROM Staff WHERE id = para_staff_id AND manager_id = para_manager_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Staff does not exist or is not managed by this manager';
    END IF;

    -- Start a transaction
    START TRANSACTION;
    
    -- Insert a new record into the PerformanceEvaluation table
    INSERT INTO PerformanceEvaluation (evaluated_staff_id, evaluation_date)
    VALUES (para_staff_id, NOW());
    
    -- Get the last inserted ID to use for the EvaluationCriteria table
    SET eval_id = LAST_INSERT_ID();

    -- Begin a loop to process the comma-separated scores in para_evaluation_string
    WHILE current_index <= LENGTH(para_evaluation_string) DO
        -- Check if the current character is a comma, indicating the end of a score
        IF SUBSTRING(para_evaluation_string, current_index, 1) = ',' THEN
            -- Insert the score into the EvaluationCriteria table
            INSERT INTO EvaluationCriteria (evaluation_id, criteria_id, criteria_score)
            VALUES (eval_id, crit_id, current_string_index);
        
            -- Reset the current_string_index for the next score
            SET current_string_index = '';
            SET crit_id = crit_id + 1;  -- Move to the next criteria ID
        ELSE
            -- Accumulate the current character to build the score
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(para_evaluation_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last score in the string
    INSERT INTO EvaluationCriteria (evaluation_id, criteria_id, criteria_score)
    VALUES (eval_id, crit_id, current_string_index);
    
    COMMIT;
END$$

GRANT EXECUTE ON PROCEDURE hospital_management_system.CreateNewEvaluation TO 'HR'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CreateNewEvaluation TO 'BusinessOfficers'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CreateNewEvaluation TO 'Doctors'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CreateNewEvaluation TO 'Nurses'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CreateNewEvaluation TO 'FrontDesk'@'host'$$




DELIMITER ;
