DELIMITER $$

-- Recommendations: 
-- Use manager ID instead of name since names are not unique and there can be multiple managers with the same name
DROP PROCEDURE IF EXISTS AddNewStaff$$
CREATE PROCEDURE AddNewStaff(
    para_full_name VARCHAR(50),               -- Parameter for the full name of the staff member
    para_ssn INT,                             -- Parameter for the Social Security Number (SSN) of the staff member
    para_job_id VARCHAR(50),                  -- Parameter for the job title of the staff member
    para_department_id VARCHAR(50),           -- Parameter for the department name where the staff member will work
    para_manager_name VARCHAR(50),            -- Parameter for the full name of the staff member's manager
    para_gender CHAR(1),                      -- Parameter for the gender of the staff member
    para_birth_date DATE,                     -- Parameter for the birth date of the staff member
    para_home_address VARCHAR(255),           -- Parameter for the home address of the staff member
    para_phone_number VARCHAR(15),            -- Parameter for the phone number of the staff member
    para_email VARCHAR(50),                   -- Parameter for the email address of the staff member
    para_staff_password VARCHAR(12),          -- Parameter for the staff member's password
    para_wage DECIMAL(6,2),                   -- Parameter for the wage of the staff member
    para_employment_type VARCHAR(50),         -- Parameter for the employment type (e.g., full-time, part-time)
    para_employment_document_id VARCHAR(24)   -- Parameter for the employment document ID
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to store the IDs of the job, department, and manager
    DECLARE job_id INT;
    DECLARE max_job_wage DECIMAL(6,2);
    DECLARE min_job_wage DECIMAL(6,2);
    DECLARE department_id INT;
    DECLARE manager_id INT;
    DECLARE error_message TEXT;

    DECLARE EXIT HANDLER FOR SQLSTATE '45000'
        BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;

    -- Lookup the job ID
    SELECT id INTO job_id
    FROM Jobs
    WHERE Jobs.id = para_job_id;

    -- Check if the input job id is correct
    IF job_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Job not found. Please make sure that your input is correct';
    END IF;

    -- Lookup the department ID
    SELECT id INTO department_id
    FROM Departments
    WHERE Departments.id = para_department_id;

    -- Check if the input department id is correct
    IF department_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Department not found. Please make sure that your input is correct';
    END IF;

    -- Lookup the manager ID based on the provided manager name
    IF para_manager_name IS NOT NULL THEN
		SELECT id INTO manager_id
		FROM Staff
		WHERE Staff.full_name = para_manager_name;

		IF manager_id IS NULL THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'manager not found. Please ensure that your input is correct';
		END IF;
    END IF;

    -- Compare the input wage and the wage range of the job. Raise an exception if it does not fall within the correct wage range
    SELECT Jobs.max_wage, Jobs.min_wage 
    INTO max_job_wage, min_job_wage 
    FROM Jobs 
    WHERE Jobs.id = job_id;

    IF para_wage > max_job_wage OR para_wage < min_job_wage
        THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Wage does not fall within the correct range';
    END IF;

    -- Insert the new staff member into the Staff table
    INSERT INTO Staff (
        ssn,                           -- Social Security Number (SSN)
        manager_id,                    -- Manager ID (foreign key to Staff table)
        department_id,                 -- Department ID (foreign key to Departments table)
        job_id,                        -- Job ID (foreign key to Jobs table)
        full_name,                     -- Full name of the staff member
        gender,                        -- Gender of the staff member
        birth_date,                    -- Birth date of the staff member
        home_address,                  -- Home address of the staff member
        phone_number,                  -- Phone number of the staff member
        email,                         -- Email address of the staff member
        staff_password,                -- Password for the staff member's account
        wage,                          -- Wage of the staff member
        hire_date,                     -- Hire date (current date)
        employment_type,               -- Employment type (e.g., full-time, part-time)
        employment_status,             -- Employment status (e.g., 'Active')
        employment_document_id         -- Employment document ID
    ) VALUES (
        para_ssn,                      -- Provided SSN
        manager_id,                    -- Retrieved manager ID based on manager name
        department_id,                 -- Retrieved department ID based on department name
        job_id,                        -- Retrieved job ID based on job name
        para_full_name,                -- Provided full name
        para_gender,                   -- Provided gender
        para_birth_date,               -- Provided birth date
        para_home_address,             -- Provided home address
        para_phone_number,             -- Provided phone number
        para_email,                    -- Provided email address
        para_staff_password,           -- Provided password
        para_wage,                     -- Provided wage
        CURDATE(),                     -- Current date as the hire date
        para_employment_type,          -- Provided employment type
        'Active',                      -- Employment status set to 'Active'
        para_employment_document_id    -- Provided employment document ID
    );
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewStaff TO 'HR'@'host'$$


DROP PROCEDURE IF EXISTS FetchAllStaff$$
CREATE PROCEDURE FetchAllStaff()
SQL SECURITY DEFINER
BEGIN
    -- Select various fields from the Staff, Jobs, and Departments tables
    SELECT
        Non_Manager.id,                       -- The ID of the non-managerial staff member
        Non_Manager.full_name,                -- The full name of the non-managerial staff member
        Jobs.job_name,                        -- The job name/title of the non-managerial staff member
        Departments.department_name,          -- The department name where the non-managerial staff member works
        Non_Manager.gender,                   -- The gender of the non-managerial staff member
        Non_Manager.birth_date,               -- The birth date of the non-managerial staff member
        Non_Manager.home_address,             -- The home address of the non-managerial staff member
        Non_Manager.phone_number,             -- The phone number of the non-managerial staff member
        Non_Manager.email,                    -- The email address of the non-managerial staff member
        Non_Manager.staff_password,           -- The password of the non-managerial staff member
        Non_Manager.wage,                     -- The wage of the non-managerial staff member
        Non_Manager.hire_date,                -- The hire date of the non-managerial staff member
        Non_Manager.employment_type,          -- The employment type of the non-managerial staff member
        Non_Manager.employment_status,        -- The employment status of the non-managerial staff member
        Non_Manager.employment_document_id,   -- The employment document ID of the non-managerial staff member
        Manager.full_name AS manager_name     -- The full name of the manager associated with the non-managerial staff member

    FROM
        Staff AS Manager                      -- The Staff table is referenced as Manager for joining purposes
    RIGHT OUTER JOIN
        Staff AS Non_Manager                  -- The Staff table is referenced again as Non_Manager for the actual data retrieval
    ON
        Manager.id = Non_Manager.Manager_id   -- Joining Staff with itself to link each non-managerial staff member with their manager
    INNER JOIN
        Jobs                                  -- Joining with the Jobs table to retrieve job titles
    ON
        Non_Manager.job_id = Jobs.id          -- Matching the job_id in the Staff table with the id in the Jobs table
    INNER JOIN
        Departments                           -- Joining with the Departments table to retrieve department names
    ON
        Departments.id = Non_Manager.department_id;  -- Matching the department_id in the Staff table with the id in the Departments table
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchAllStaff TO 'HR'@'host'$$


DROP PROCEDURE IF EXISTS ChangeWage$$
CREATE PROCEDURE ChangeWage(
    para_staff_id INT,                   -- Parameter for the ID of the staff member whose wage is to be changed
    para_new_wage DECIMAL(6,2)           -- Parameter for the new wage amount
)
SQL SECURITY DEFINER
BEGIN
    -- Declare a variable to store the old wage of the staff
    DECLARE error_message TEXT;
    DECLARE new_wage DECIMAL(6,2);
    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            ROLLBACK;
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;

    -- Check if input staff id exists
    IF NOT CheckStaffExists(para_staff_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Staff does not exist';
    END IF;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
        SELECT ChangeWage(para_staff_id, para_new_wage) INTO new_wage;
        -- Update the wage of the staff member in the Staff table
        UPDATE Staff
        SET wage = new_wage
        WHERE Staff.id = para_staff_id;

    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeWage TO 'HR'@'host'$$


DROP PROCEDURE IF EXISTS ChangeJob$$
CREATE PROCEDURE ChangeJob(
    para_staff_id INT,                      -- Parameter for the ID of the staff member whose job is to be changed
    new_job_name VARCHAR(50),           -- Parameter for the new job name/title
    para_new_wage DECIMAL(6,2), -- Parameter for the new wage
    new_manager_name VARCHAR(50), -- Parameter for the new manager. NULL if there is no manager change
    new_department_name VARCHAR(50) -- Parameter for the change of department. NULL if there is no department change
)
BEGIN
    -- Declare variables to store the IDs of the new and old jobs
    DECLARE new_manager_id INT DEFAULT NULL;
    DECLARE local_new_job INT;
    DECLARE local_old_job INT;
    DECLARE new_wage INT;
    DECLARE target_department_id INT;
    DECLARE error_message TEXT;
    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
       BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            ROLLBACK;
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;

    -- Check if input staff id exists
    IF NOT CheckStaffExists(para_staff_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Staff does not exist';
    END IF;

    -- Retrieve the job ID of the new job based on the provided job name and store it in local_new_job
    SELECT id INTO local_new_job
    FROM Jobs
    WHERE Jobs.job_name = new_job_name;
    -- check if the input job name is correct
    IF local_new_job IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'job does not exist';
    END IF;

    -- Check if the new manager name exists
    IF new_manager_name IS NOT NULL THEN
        SELECT id INTO new_manager_id FROM Staff WHERE full_name = new_manager_name;
            IF new_manager_id IS NULL THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Manager name not found. Please check your input';
        END IF;
    END IF;

    -- Retrieve the current job ID of the staff member and store it in local_old_job
    SELECT job_id INTO local_old_job
    FROM Staff
    WHERE Staff.id = staff_id;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
        SELECT ChangeWageFunction(para_staff_id, para_new_wage ) INTO new_wage;
        -- Update the job ID and wage of the staff member in the Staff table to the new job ID
        IF new_department_name IS NULL THEN
            UPDATE Staff
                SET Staff.job_id = local_new_job,
                Staff.wage = new_wage,
                Staff.manager_id = new_manager_id
            WHERE Staff.id = staff_id;
        ELSE
            SELECT ChangeDepartmentFunction(para_staff_id, new_department_name) INTO target_department_id;
            UPDATE Staff
                SET Staff.job_id = local_new_job,
                Staff.wage = new_wage,
                Staff.manager_id = new_manager_id,
                Staff.department_id = target_department_id
            WHERE Staff.id = staff_id;
        END IF;
        -- Insert a record into the Job_Movement table to log the job change
        INSERT INTO Job_Movement (
            staff_id,                   -- The ID of the staff member
            old_job,                    -- The previous job ID of the staff member
            new_job,                    -- The new job ID of the staff member
            date_change                 -- The date of the job change
        ) VALUES (
            para_staff_id,                   -- The provided staff ID
            local_old_job,              -- The old job ID retrieved earlier
            local_new_job,              -- The new job ID retrieved earlier
            CURDATE()                   -- The current date as the date of the job change
        );
    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeJob TO 'HR'@'host';


DROP PROCEDURE IF EXISTS ChangeDepartment$$
CREATE PROCEDURE ChangeDepartment(
    para_staff_id INT,
    new_manager_name INT,
    target_department_name VARCHAR(50)
)
SQL SECURITY DEFINER
BEGIN
    DECLARE error_message TEXT;
    DECLARE para_manager_id INT;
    DECLARE para_new_department_id INT;


    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            ROLLBACK;
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;

    -- Check if input staff id exists
    IF NOT CheckStaffExists(para_staff_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Staff does not exist';
    END IF;
    
    -- Check if the input manager name is correct
    -- new_manager_name is nullable. It is null when the staff is promoted to the manager position of the next job
    IF new_manager_name IS NOT NULL THEN
        SELECT id INTO para_staff_id FROM Staff WHERE full_name = new_manager_name;
        IF para_manager_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Manager does not exist. Please check your input';
        END IF;
    END IF;

    START TRANSACTION;
        SELECT ChangeDepartment(para_staff_id, target_department_name) INTO para_new_department_id;
        -- Update the department id of the relevant staff
        UPDATE Staff SET
                    Staff.department_id = para_new_department_id,
                    Staff.manager_id = para_manager_id
        WHERE id = para_staff_id;
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeDepartment TO 'HR'@'host'$$


DROP PROCEDURE IF EXISTS ChangeStaffPersonalInfo$$
CREATE PROCEDURE ChangeStaffPersonalInfo(
    para_staff_id INT,                       -- Parameter for the ID of the staff member whose personal info is to be changed
    new_phone_number VARCHAR(15),       -- Parameter for the new phone number of the staff member
    new_email VARCHAR(50),              -- Parameter for the new email address of the staff member
    new_password VARCHAR(12),           -- Parameter for the new password of the staff member
    new_home_address VARCHAR(255)       -- Parameter for the new home address of the staff member
)
SQL SECURITY DEFINER
BEGIN
    -- Update the Staff table with the new personal information for the staff member with the given staff_id
    UPDATE Staff
    SET
        Staff.home_address = new_home_address,       -- Update the home address
        Staff.email = new_email,                     -- Update the email address
        Staff.phone_number = new_phone_number,       -- Update the phone number
        Staff.staff_password = new_password          -- Update the password
    WHERE
        Staff.id = staff_id;                         -- Specify the staff member by their ID
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeStaffPersonalInfo TO 'HR'@'host'$$


DROP PROCEDURE IF EXISTS FetchWageChangeByStaffId$$
CREATE PROCEDURE FetchWageChangeByStaffId(
    para_staff_id INT
)
SQL SECURITY DEFINER
BEGIN
   SELECT
       Staff.full_name,
       Salary_Change.old_wage,
       Salary_Change.new_wage,
       Salary_Change.date_change
    FROM
        Salary_Change
    INNER JOIN
        Staff
    ON Salary_Change.staff_id = Staff.id
   WHERE id = para_staff_id;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchWageChangeByStaffId TO 'HR'@'host'$$


DROP PROCEDURE IF EXISTS FetchJobChangeByStaffId$$
CREATE PROCEDURE FetchJobChangeByStaffId(
    para_staff_id INT                   -- Parameter for the ID of the staff member whose job changes are to be fetched
)
SQL SECURITY DEFINER
BEGIN
    -- Select the full name, old job, and new job for the specified staff member
    SELECT
        Staff.full_name,                -- Retrieve the full name of the staff member
        Old_Jobs.job_name AS old_job,   -- Retrieve the name of the old job (before the change)
        New_Jobs.job_name AS new_job,   -- Retrieve the name of the new job (after the change)
        Job_Movement.date_change
    FROM
        Staff                           -- The Staff table
    INNER JOIN
        Job_Movement                    -- The Job_Movement table, which records job changes
    ON
        Staff.id = Job_Movement.staff_id -- Join the Staff table with the Job_Movement table on staff ID
    INNER JOIN
        Jobs AS Old_Jobs                -- Join with the Jobs table to get the name of the old job
    ON
        Job_Movement.old_job = Old_Jobs.id -- Match the old job ID in Job_Movement with the Jobs table
    INNER JOIN
        Jobs AS New_Jobs                -- Join with the Jobs table again to get the name of the new job
    ON
        Job_Movement.new_job = New_Jobs.id -- Match the new job ID in Job_Movement with the Jobs table
    WHERE
        Staff.id = para_staff_id;       -- Filter the results to include only the specified staff member
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchJobChangeByStaffId TO 'HR'@'host'$$


DROP PROCEDURE IF EXISTS FetchDepartmentChangeByStaffId$$
CREATE PROCEDURE FetchDepartmentChangeByStaffId(
    para_staff_id INT                   -- Parameter for the ID of the staff member whose job changes are to be fetched
)
SQL SECURITY DEFINER
BEGIN
    -- Select the full name, old department, and new department for the specified staff member
    SELECT
        Staff.full_name,                -- Retrieve the full name of the staff member
        Old_Departments.department_name AS old_department,   -- Retrieve the name of the old department (before the change)
        New_Departments.department_name AS new_department,    -- Retrieve the name of the new department (after the change)
        Department_Change.date_change
    FROM
        Staff                           -- The Staff table
    INNER JOIN
        Department_Change                   -- The Department_change table, which records job changes
    ON
        Staff.id = Department_Change.staff_id -- Join the Staff table with the Department_Change table on staff ID
    INNER JOIN
        Departments AS Old_Departments                -- Join with the Departments table to get the name of the old departments
    ON
        Department_Change.old_department_id = Old_Departments.id -- Match the old department ID in Department_Change with the Jobs table
    INNER JOIN
        Departments AS New_Departments                -- Join with the Departments table again to get the name of the new department
    ON
        Department_Change.new_department_id = New_Departments.id -- Match the new Department ID in the Department_Change with the Jobs table
    WHERE
        Staff.id = para_staff_id;       -- Filter the results to include only the specified staff member
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDepartmentChangeByStaffId TO 'HR'@'host'$$

DELIMITER ;