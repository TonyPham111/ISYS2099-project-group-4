USE hospital_management_system;
DELIMITER $$
DROP PROCEDURE IF EXISTS AddNewStaff$$
CREATE PROCEDURE AddNewStaff(
    para_full_name VARCHAR(50),               -- Parameter for the full name of the staff member
    para_job_id INT,                  -- Parameter for the job title of the staff member
    para_department_id INT,           -- Parameter for the department name where the staff member will work
    para_manager_id INT,              -- Parameter for the id of the staff member's manager
    para_gender CHAR(1),                      -- Parameter for the gender of the staff member
    para_birth_date DATE,                     -- Parameter for the birth date of the staff member
    para_home_address VARCHAR(255),           -- Parameter for the home address of the staff member
    para_phone_number VARCHAR(15),            -- Parameter for the phone number of the staff member
    para_email VARCHAR(50),                   -- Parameter for the email address of the staff member
    para_staff_password VARCHAR(72),          -- Parameter for the staff member's password
    para_wage DECIMAL(6,2)                   -- Parameter for the wage of the staff member

)
SQL SECURITY DEFINER
BEGIN
    DECLARE max_job_wage DECIMAL(6,2);
    DECLARE min_job_wage DECIMAL(6,2);
    DECLARE error_message TEXT;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        DECLARE returned_message TEXT;
        ROLLBACK;

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE,
            returned_message = MESSAGE_TEXT;
		


        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal with SQLSTATE '45000'
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;
    SET @parent_proc = TRUE;
    
    IF ((para_job_id = 1 OR para_job_id = 2) AND para_department_id = 13) OR (para_job_id > 2 AND para_department_id < 13) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incompatible job and department. Please try again';
	END IF;
    
   

    -- Check if input manager id exists
    IF para_manager_id IS NOT NULL THEN
		IF NOT CheckManagerDepartmentAndJob(para_manager_id, para_department_id, para_job_id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Manager does not exist';
		END IF;
	ELSE
			 -- Check if the input job id is correct
		IF NOT CheckJobExists(para_job_id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Job not found. Please make sure that your input is correct';
		END IF;

		-- Check if the input department id is correct
		IF NOT CheckDepartmentExists(para_department_id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Department not found. Please make sure that your input is correct';
		END IF;
    END IF;

    -- Compare the input wage and the wage range of the job. Raise an exception if it does not fall within the correct wage range
    SELECT Jobs.max_wage, Jobs.min_wage
    INTO max_job_wage, min_job_wage
    FROM Jobs
    WHERE Jobs.id = para_job_id;

    IF para_wage > max_job_wage OR para_wage < min_job_wage
        THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Wage does not fall within the correct range';
    END IF;

    -- Insert the new staff member into the Staff table
    INSERT INTO Staff (
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
        employment_status             -- Employment status (e.g., 'Active')
 
    ) VALUES (
        para_manager_id,               -- Provided manager ID
        para_department_id,            -- Provided department ID
        para_job_id,                   -- Provided job ID
        para_full_name,                -- Provided full name
        para_gender,                   -- Provided gender
        para_birth_date,               -- Provided birth date
        para_home_address,             -- Provided home address
        para_phone_number,             -- Provided phone number
        para_email,                    -- Provided email address
        para_staff_password,           -- Provided password
        para_wage,                     -- Provided wage
        CURDATE(),                     -- Current date as the hire date
        'Active'                      -- Employment status set to 'Active'

    );
    SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewStaff TO 'HR'@'%'$$



DROP PROCEDURE IF EXISTS ChangeStaffPersonalInfo$$
CREATE PROCEDURE ChangeStaffPersonalInfo(
    para_staff_id INT,                       
    new_phone_number VARCHAR(15),       
    new_email VARCHAR(50),              
    new_password VARCHAR(72),           
    new_home_address VARCHAR(255)       
)
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        
        ROLLBACK;
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

    -- Update the Staff table with the new personal information for the staff member with the given staff_id
    UPDATE Staff
    SET
        Staff.home_address = new_home_address,       
        Staff.email = new_email,                     
        Staff.phone_number = new_phone_number,       
        Staff.staff_password = new_password          
    WHERE
        Staff.id = para_staff_id;                         
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeStaffPersonalInfo TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS FetchAllStaff$$
CREATE PROCEDURE FetchAllStaff()
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

    -- Select various fields from the Staff, Jobs, and Departments tables
    SELECT
        Non_Manager.id, Non_Manager.full_name, Jobs.job_name, Departments.department_name, 
        Non_Manager.gender, Non_Manager.birth_date, Non_Manager.home_address, 
        Non_Manager.phone_number, Non_Manager.email, Non_Manager.staff_password, 
        Non_Manager.wage, Non_Manager.hire_date, Non_Manager.employment_status, 
        Non_Manager.employment_document_id, Manager.full_name AS manager_name
    FROM
        Staff AS Manager
    RIGHT OUTER JOIN
        Staff AS Non_Manager
    ON
        Manager.id = Non_Manager.Manager_id
    INNER JOIN
        Jobs
    ON
        Non_Manager.job_id = Jobs.id
    INNER JOIN
        Departments
    ON
        Departments.id = Non_Manager.department_id;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeStaffPersonalInfo TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS ChangeWageProcedure$$
CREATE PROCEDURE ChangeWageProcedure(
    para_staff_id INT,
    para_job_id INT,
    para_new_wage DECIMAL(6,2)
)
SQL SECURITY DEFINER
BEGIN
    DECLARE para_old_wage DECIMAL(6,2);
    DECLARE max_job_wage DECIMAL(6,2);
    DECLARE min_job_wage DECIMAL(6,2);
    
	IF @parent_proc IS NULL THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
    END IF;
	
    
    -- Insert a record into the Salary_Change table to log the wage change
    INSERT INTO Salary_Change (
        staff_id, old_wage, new_wage, date_change
    ) VALUES (
        para_staff_id, para_old_wage, para_new_wage, CURDATE()
    );
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeWageProcedure TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS ChangeWage$$
CREATE PROCEDURE ChangeWage(
    para_staff_id INT,                   
    para_new_wage DECIMAL(6,2)           
)
SQL SECURITY DEFINER
BEGIN
    DECLARE error_message TEXT;
    DECLARE para_job_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;
    SET @parent_proc = TRUE;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
		-- Check if input staff id exists
		IF NOT CheckStaffExists(para_staff_id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Staff does not exist';
		END IF;	
        SELECT job_id INTO para_job_id FROM Staff WHERE id = para_staff_id;
		
        CALL ChangeWageProcedure(para_staff_id, para_job_id, para_new_wage);
        SET @parent_proc = NULL;
        -- Update the wage of the staff member in the Staff table
        UPDATE Staff
        SET wage = para_new_wage
        WHERE Staff.id = para_staff_id;

    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeWage TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS ChangeDepartmentProcedure$$
CREATE  PROCEDURE ChangeDepartmentProcedure(
    para_staff_id INT,
    target_department_id INT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE current_department_id INT;
    SELECT Staff.department_id 
    INTO current_department_id 
    FROM Staff 
    WHERE id = para_staff_id;
	
    IF @parent_proc IS NULL THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    
    INSERT INTO Department_Change (
        staff_id, old_department_id, new_department_id, date_change
    ) VALUES (
        para_staff_id, current_department_id, target_department_id, CURDATE()
    );
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeDepartmentProcedure TO 'HR'@'%'$$


DROP PROCEDURE IF EXISTS ChangeDepartment$$
CREATE PROCEDURE ChangeDepartment(
    para_staff_id INT,
    para_new_manager_id INT,
    para_new_department_id INT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE local_old_job INT;
    DECLARE error_message TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;
    SET @parent_proc = TRUE;
       

    -- Retrieve the current job ID of the staff member and store it in local_old_job
    SELECT job_id INTO local_old_job FROM Staff WHERE id = para_staff_id;

    START TRANSACTION;
 -- Check if input staff id exists
		IF NOT CheckStaffExists(para_staff_id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Staff does not exist';
		END IF;
        CALL ChangeDepartmentProcedure(para_staff_id, para_new_department_id);
        -- Update the department id of the relevant staff
        UPDATE Staff 
            SET Staff.department_id = para_new_department_id,
            Staff.manager_id = para_new_manager_id
            WHERE id = para_staff_id;

        IF local_old_job = 2 THEN
            DELETE FROM Appointments WHERE doctor_id = para_staff_id  AND ( appointment_date > CURDATE() OR (appointment_date = CURDATE() AND start_time > CURRENT_TIME())  );
        END IF;
        SET @parent_proc = NULL;

    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeDepartment TO 'HR'@'%'$$


DROP PROCEDURE IF EXISTS ChangeJob$$
CREATE PROCEDURE ChangeJob(
    para_staff_id INT,
    para_new_job_id VARCHAR(50),
    para_new_wage DECIMAL(6,2),
    para_new_manager_id VARCHAR(50),
    para_new_department_id VARCHAR(50)
)
BEGIN
    DECLARE local_old_job INT;
    DECLARE error_message TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;
    SET @parent_proc = TRUE;

    -- Retrieve the current job ID of the staff member and store it in local_old_job
    SELECT job_id INTO local_old_job FROM Staff WHERE id = para_staff_id;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
		    -- Check if input staff id exists
		IF NOT CheckStaffExists(para_staff_id) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Staff does not exist';
		END IF;
        
        CALL ChangeWageProcedure(para_staff_id, para_new_job_id, para_new_wage);
        -- Update the job ID and wage of the staff member in the Staff table to the new job ID
        IF para_new_department_id IS NULL THEN
            UPDATE Staff
            SET Staff.job_id = para_new_job_id, 
                Staff.wage = para_new_wage, 
                Staff.manager_id = para_new_manager_id
            WHERE Staff.id = para_staff_id;
        ELSE
            CALL ChangeDepartmentProcedure(para_staff_id, para_new_department_id);
            UPDATE Staff
            SET Staff.job_id = para_new_job_id,
                Staff.wage = para_new_wage,
                Staff.manager_id = para_new_manager_id,
                Staff.department_id = para_new_department_id
            WHERE Staff.id = para_staff_id;
        END IF;

        -- Insert a record into the Job_Movement table to log the job change
        INSERT INTO Job_Movement (
            staff_id, old_job, new_job, date_change
        ) VALUES (
            para_staff_id, local_old_job, para_new_job_id, CURDATE()
        );

        IF local_old_job = 2 THEN
            DELETE FROM Appointments WHERE staff_id = para_staff_id  AND ( appointment_date > CURDATE() OR (appointment_date = CURDATE AND start_time > CURRENT_TIME()));
        END IF;
        SET @parent_proc = NULL;
    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.ChangeJob TO 'HR'@'%'$$


DROP PROCEDURE IF EXISTS FetchDepartmentChangeByStaffId$$
CREATE PROCEDURE FetchDepartmentChangeByStaffId(
    para_staff_id INT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

    -- Select the full name, old department, and new department for the specified staff member
    SELECT
        Staff.full_name,
        Old_Departments.department_name AS old_department,
        New_Departments.department_name AS new_department,
        Department_Change.date_change
    FROM
        Staff
    INNER JOIN
        Department_Change
    ON
        Staff.id = Department_Change.staff_id
    INNER JOIN
        Departments AS Old_Departments
    ON
        Department_Change.old_department_id = Old_Departments.id
    INNER JOIN
        Departments AS New_Departments
    ON
        Department_Change.new_department_id = New_Departments.id
    WHERE
        Staff.id = para_staff_id;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDepartmentChangeByStaffId TO 'HR'@'%'$$


DROP PROCEDURE FetchJobChangeByStaffId$$
CREATE PROCEDURE FetchJobChangeByStaffId(
    para_staff_id INT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

    -- Select the full name, old job, and new job for the specified staff member
    SELECT
        Staff.full_name,
        Old_Jobs.job_name AS old_job,
        New_Jobs.job_name AS new_job,
        Job_Movement.date_change
    FROM
        Staff
    INNER JOIN
        Job_Movement
    ON
        Staff.id = Job_Movement.staff_id
    INNER JOIN
        Jobs AS Old_Jobs
    ON
        Job_Movement.old_job = Old_Jobs.id
    INNER JOIN
        Jobs AS New_Jobs
    ON
        Job_Movement.new_job = New_Jobs.id
    WHERE
        Staff.id = para_staff_id;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchJobChangeByStaffId TO 'HR'@'%'$$


DROP PROCEDURE IF EXISTS FetchWageChangeByStaffId$$
CREATE PROCEDURE FetchWageChangeByStaffId(
    para_staff_id INT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE error_message TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

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
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchWageChangeByStaffId TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS GetAllDepartments$$
CREATE PROCEDURE GetAllDepartments()
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

    -- Select all departments
    SELECT
        Departments.id,
        Departments.department_name
    FROM Departments;

END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllDepartments TO 'HR'@'%'$$


DELIMITER ;