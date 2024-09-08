DELIMITER $$
DROP PROCEDURE IF EXISTS GetPatientsInfoForNurse$$
CREATE PROCEDURE GetPatientsInfoForNurse(

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
    -- Select various fields from the Patients and Allergies tables
    SELECT
        Patients.id,                      -- The ID of the patient
        Patients.full_name,               -- The full name of the patient
        Patients.gender,                  -- The gender of the patient
        DATE_FORMAT(Patients.birth_date, '%d/%m/%Y') AS birth_date -- The birth date of the patient
    FROM Patients;

END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetPatientsInfoForNurse TO 'Nurses'@'%'$$

DROP PROCEDURE IF EXISTS GetPatientsInfoForNurseByName$$
CREATE PROCEDURE GetPatientsInfoForNurseByName(
	patient_name VARCHAR(50),
    patient_id INT
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
	SET @select_statement ='
    SELECT
        Patients.id,                      
        Patients.full_name,               
        Patients.gender,                 
        DATE_FORMAT(Patients.birth_date, \'%d/%m/%Y\') AS birth_date 
    FROM Patients WHERE 1 = 1';
    SET @by_name = CONCAT('MATCH(Patients.full_name) AGAINST(\'',patient_name,'\' IN NATURAL LANGUAGE MODE)');
    SET @by_id = CONCAT('id = ', patient_id);
    IF patient_id IS NOT NULL THEN
		SET @select_statement = CONCAT(@select_statement, ' AND ', @by_id);
    END IF;
    IF patient_name IS NOT NULL THEN
		SET @select_statement = CONCAT(@select_statement, ' AND ', @by_name);
    END IF;
    
    PREPARE stmt FROM @select_statement;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetPatientsInfoForNurseByName TO 'Nurses'@'%'$$



DROP PROCEDURE IF EXISTS UpdateTestDetail$$
CREATE PROCEDURE UpdateTestDetail(
	para_patient_id INT,
    para_test_order_id INT,                   -- Parameter for the test order ID
    para_test_type_id INT,                    -- Parameter for the test type ID
    para_administering_staff_id INT,          -- Parameter for the ID of the staff member administering the test
    para_lab_result_document_id VARCHAR(24)   -- Parameter for the lab result document ID
)
SQL SECURITY DEFINER
BEGIN
	DECLARE checked_test_order_id INT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			DECLARE returned_sqlstate CHAR(5) DEFAULT '';
            DECLARE returned_message TEXT;
			ROLLBACK;
			-- Retrieve the SQLSTATE of the current exception
			GET STACKED DIAGNOSTICS CONDITION 1
				returned_sqlstate = RETURNED_SQLSTATE,
                returned_message = MESSAGE_TEXT;
			SELECT returned_message;
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
	SET @patient_id = para_patient_id;
    SET @test_order_id = para_test_order_id;
    SET @nurse_id = para_administering_staff_id;
    SET @test_type_id = para_test_type_id;
    
    SELECT test_id INTO checked_test_order_id FROM Test_Details WHERE test_type_id = para_test_type_id AND test_id = para_test_order_id LIMIT 1;
    IF checked_test_order_id IS NULL THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The doctor did not order this test';
    END IF;
    
    -- Update the Test_Details table with the new administering staff ID and lab result document ID
    UPDATE Test_Details
    SET
        administering_staff_id = para_administering_staff_id,  -- Update the administering staff ID
        lab_result_document_id = para_lab_result_document_id  -- Update the lab result document ID
    WHERE
        test_id = para_test_order_id  -- Match the test order ID
        AND test_type_id = para_test_type_id;  -- Match the test type ID
	SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.UpdateTestDetail TO 'Nurses'@'%'$$
DELIMITER ;