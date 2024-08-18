CREATE PROCEDURE AddNewStaff(
    para_id INT,                              -- Parameter for the staff ID
    para_full_name VARCHAR(50),               -- Parameter for the full name of the staff member
    para_ssn INT,                             -- Parameter for the Social Security Number (SSN) of the staff member
    para_job_name VARCHAR(50),                -- Parameter for the job title of the staff member
    para_department_name VARCHAR(50),         -- Parameter for the department name where the staff member will work
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
    DECLARE department_id INT;
    DECLARE manager_id INT;

    -- Lookup the job ID based on the provided job name
    SELECT id INTO job_id 
    FROM Jobs 
    WHERE Jobs.job_name = para_job_name;

    -- Lookup the department ID based on the provided department name
    SELECT id INTO department_id 
    FROM Departments 
    WHERE Departments.department_name = para_department_name;

    -- Lookup the manager ID based on the provided manager name
    SELECT id INTO manager_id 
    FROM Staff 
    WHERE Staff.full_name = para_manager_name;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
        
        -- Insert the new staff member into the Staff table
        INSERT INTO Staff (
            id,                            -- Staff ID
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
            para_id,                       -- Provided staff ID
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

    -- Commit the transaction to save all changes
    COMMIT;
END;


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
    INNER JOIN
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

END;



CREATE PROCEDURE ChangeWage(
    staff_id INT,                        -- Parameter for the ID of the staff member whose wage is to be changed
    para_new_wage DECIMAL(6,2)           -- Parameter for the new wage amount
)
SQL SECURITY DEFINER
BEGIN
    -- Declare a variable to store the old wage of the staff member
    DECLARE para_old_wage DECIMAL(6,2);

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Retrieve the current wage of the staff member and store it in the para_old_wage variable
    SELECT wage INTO para_old_wage 
    FROM Staff 
    WHERE Staff.id = staff_id;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

        -- Update the wage of the staff member in the Staff table
        UPDATE Staff 
        SET wage = para_new_wage 
        WHERE Staff.id = staff_id;

        -- Insert a record into the Salary_Change table to log the wage change
        INSERT INTO Salary_Change (
            staff_id,                     -- The ID of the staff member
            old_wage,                     -- The previous wage of the staff member
            new_wage,                     -- The new wage of the staff member
            date_change                   -- The date of the wage change
        ) VALUES (
            staff_id,                     -- The provided staff ID
            para_old_wage,                -- The old wage value retrieved earlier
            para_new_wage,                -- The new wage value provided as input
            CURDATE()                     -- The current date as the date of the change
        );

    -- Commit the transaction to save all changes
    COMMIT;
END;



CREATE PROCEDURE ChangeJob(
    staff_id INT,                      -- Parameter for the ID of the staff member whose job is to be changed
    new_job_name VARCHAR(50)           -- Parameter for the new job name/title
)
BEGIN
    -- Declare variables to store the IDs of the new and old jobs
    DECLARE local_new_job INT;
    DECLARE local_old_job INT;

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Retrieve the job ID of the new job based on the provided job name and store it in local_new_job
    SELECT id INTO local_new_job 
    FROM Jobs 
    WHERE Jobs.job_name = new_job_name;

    -- Retrieve the current job ID of the staff member and store it in local_old_job
    SELECT job_id INTO local_old_job 
    FROM Staff 
    WHERE Staff.id = staff_id;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

        -- Update the job ID of the staff member in the Staff table to the new job ID
        UPDATE Staff 
        SET Staff.job_id = local_new_job  
        WHERE Staff.id = staff_id;

        -- Insert a record into the Job_Movement table to log the job change
        INSERT INTO Job_Movement (
            staff_id,                   -- The ID of the staff member
            old_job,                    -- The previous job ID of the staff member
            new_job,                    -- The new job ID of the staff member
            date_change                 -- The date of the job change
        ) VALUES (
            staff_id,                   -- The provided staff ID
            local_old_job,              -- The old job ID retrieved earlier
            local_new_job,              -- The new job ID retrieved earlier
            CURDATE()                   -- The current date as the date of the job change
        );

    -- Commit the transaction to save all changes
    COMMIT;
END;



CREATE PROCEDURE ChangeStaffPersonalInfo(
    staff_id INT,                       -- Parameter for the ID of the staff member whose personal info is to be changed
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
END;


CREATE PROCEDURE FetchJobChangeByStaffId(
    para_staff_id INT                   -- Parameter for the ID of the staff member whose job changes are to be fetched
)
SQL SECURITY DEFINER
BEGIN
    -- Select the full name, old job, and new job for the specified staff member
    SELECT
        Staff.full_name,                -- Retrieve the full name of the staff member
        Old_Jobs.job_name AS old_job,   -- Retrieve the name of the old job (before the change)
        New_Jobs.job_name AS new_job    -- Retrieve the name of the new job (after the change)
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
END;