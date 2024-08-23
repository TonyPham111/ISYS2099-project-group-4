-- These should be changed to procedures, since functions cannot insert or update data 
CREATE FUNCTION ChangeWageFunction(
    para_staff_id INT,
    para_new_wage DECIMAL(6,2)
)
RETURNS DECIMAL(6,2)
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN
    DECLARE para_old_wage DECIMAL(6,2);
    DECLARE max_job_wage DECIMAL(6,2);
    DECLARE min_job_wage DECIMAL(6,2);
    DECLARE para_job_id INT;

    SELECT Staff.job_id INTO para_job_id FROM Staff WHERE id = para_staff_id;
    SELECT Jobs.max_wage INTO max_job_wage FROM Jobs WHERE id = para_job_id;
    SELECT Jobs.min_wage INTO min_job_wage FROM Jobs WHERE id = para_job_id;

    -- Comparing the new wage to the correct wage range. If it falls outside of the range, an exception is raised
    IF para_new_wage > max_job_wage OR para_new_wage < min_job_wage
        THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Wage does not fall within the correct range';
    END IF;

    -- Retrieve the current wage of the staff member and store it in the para_old_wage variable
    SELECT wage INTO para_old_wage
    FROM Staff
    WHERE Staff.id = para_staff_id;

     -- Insert a record into the Salary_Change table to log the wage change
    INSERT INTO Salary_Change (
        staff_id,                     -- The ID of the staff member
        old_wage,                     -- The previous wage of the staff member
        new_wage,                     -- The new wage of the staff member
        date_change                   -- The date of the wage change
        )
    VALUES (
        para_staff_id,                     -- The provided staff ID
        para_old_wage,                -- The old wage value retrieved earlier
        para_new_wage,                -- The new wage value provided as input
        CURDATE()                     -- The current date as the date of the change
        );
    RETURN para_new_wage;

END;

CREATE FUNCTION ChangeDepartmentFunction(
    para_staff_id INT,
    target_department_name VARCHAR(50)
)
RETURNS INT
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN
    DECLARE target_department_id INT;
    DECLARE current_department_id INT;

     -- Check if the input department name is correct
    SELECT id INTO target_department_id FROM Departments WHERE department_name = target_department_name;
    SELECT Staff.department_id into current_department_id FROM Staff WHERE id = para_staff_id;
        IF target_department_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Incorrect department name. Please check your input';
        END IF;

      INSERT INTO Department_Change (
            staff_id,
            old_department_id,
            new_department_id,
            date_change
      )
        VALUES (
            para_staff_id,
            current_department_id,
            target_department_id,
            CURDATE()
        );

    RETURN target_department_id;


END;
