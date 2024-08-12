DELIMITER $$

CREATE PROCEDURE GetStaffInfo(IN staff_id INT)
BEGIN
    SELECT  non_manager.id,  
            non_manager.ssn, 
            non_manager.first_name, 
            non_manager.last_name, 
            non_manager.gender, 
            non_manager.birth_date, 
            non_manager.home_address,
            non_manager.phone_number,
            non_manager.email,
            non_manager.staff_password,
            non_manager.hire_date,
            non_manager.employment_type
            manager.name, 
            Departments.name, 
    FROM staff AS non_manager
    JOIN staff AS manager 
    ON non_manager.manager_id = manager.id
    JOIN Departments 
    ON non_manager.department_id = Departments.id
    WHERE non_manager.id = staff_id
END $$

DELIMITER ;