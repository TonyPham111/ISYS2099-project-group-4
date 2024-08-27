DELIMITER $$

DROP PROCEDURE IF EXISTS FetchStaffInfoById$$
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
        Non_Manager.employment_type,        -- The employment type (e.g., full-time, part-time)
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

END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'HR'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Doctors'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Nurses'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'FrontDesk'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'BusinessOfficers'@'host'$$


DROP PROCEDURE IF EXISTS FetchPatientsPersonalInfo$$
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
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'FrontDesk'@'host'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'BusinessOfficers'@'host'$$

CREATE PROCEDURE Reschedule(
    doctor_id INT,
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

    -- Check if schedule_id belongs to the doctor_id

    SELECT Staff_Schedule.id INTO para_schedule_id FROM Staff_Schedule WHERE Staff_Schedule.id = schedule_id AND Staff_Schedule.staff_id = doctor_id LIMIT 1;

    IF para_schedule_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect schedule id. Please try again';
    END IF;
    
    UPDATE Staff_Schedule
        SET schedule_date = para_schedule_date,        -- Update the schedule date
            start_time = para_start_time,                 -- Update the start time
            end_time = para_end_time                      -- Update the end time
        WHERE id = schedule_id;                      -- Specify the schedule to update by its ID

END;
GRANT EXECUTE ON PROCEDURE hospital_management_system.RescheduleAnAppointment TO 'FrontDesk'@'host';
GRANT EXECUTE ON PROCEDURE hospital_management_system.RescheduleAnAppointment TO 'HR'@'host';
GRANT EXECUTE ON PROCEDURE hospital_management_system.RescheduleAnAppointment TO 'BusinessOfficers'@'host';
GRANT EXECUTE ON PROCEDURE hospital_management_system.RescheduleAnAppointment TO 'Doctors'@'host';
GRANT EXECUTE ON PROCEDURE hospital_management_system.RescheduleAnAppointment TO 'Nurses'@'host';


-- procedure to get all staff under a manager
CREATE PROCEDURE GetStaffUnderManager(
    IN managerId INT
)
BEGIN
    SELECT 
        s.id AS staff_id,
        s.full_name,
        s.gender,
        s.birth_date,
        s.email,
        s.job_id,
        s.department_id,
        s.wage,
        s.hire_date,
        s.employment_type,
        s.employment_status,
        j.job_name,
        d.department_name,
        pe.id AS evaluation_id,
        pe.evaluation_date,
        ec.criteria_id,
        c.criteria_name,
        c.criteria_description,
        ec.criteria_score
    FROM 
        Staff s
    INNER JOIN 
        Jobs j ON s.job_id = j.id
    INNER JOIN 
        Departments d ON s.department_id = d.id
    LEFT JOIN 
        PerformanceEvaluation pe ON s.id = pe.evaluated_staff_id
    LEFT JOIN 
        EvaluationCriteria ec ON pe.id = ec.evaluation_id
    LEFT JOIN 
        Criteria c ON ec.criteria_id = c.id
    WHERE 
        s.manager_id = managerId;
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
