DELIMITER $$

DROP PROCEDURE IF EXISTS RegisterUser$$
CREATE PROCEDURE RegisterUser(
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_role VARCHAR(50),
    IN p_department_name VARCHAR(255)
)
BEGIN
    DECLARE department_id INT;

    -- Check if the department exists
    SELECT id INTO department_id FROM Departments WHERE name = p_department_name;
    IF department_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid department name provided';
    END IF;

    -- Insert the new user
    INSERT INTO staff (username, password, role, department_id)
    VALUES (p_username, p_password, p_role, department_id);
END$$

DELIMITER ;
