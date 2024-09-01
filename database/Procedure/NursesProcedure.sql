DELIMITER $$
DROP PROCEDURE IF EXISTS GetPatientsInfoForNurse$$
CREATE PROCEDURE GetPatientsInfoForNurse(

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
    -- Select various fields from the Patients and Allergies tables
    SELECT
        Patients.id,                      -- The ID of the patient
        Patients.full_name,               -- The full name of the patient
        Patients.gender,                  -- The gender of the patient
        Patients.birth_date              -- The birth date of the patient
    FROM Patients;

END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetPatientsInfo TO 'Nurses'@'IP'$$


DROP PROCEDURE IF EXISTS UpdateTestDetail$$
CREATE PROCEDURE UpdateTestDetail(
    para_test_order_id INT,                   -- Parameter for the test order ID
    para_test_type_id INT,                    -- Parameter for the test type ID
    para_administering_staff_id INT,          -- Parameter for the ID of the staff member administering the test
    para_lab_result_document_id VARCHAR(24)   -- Parameter for the lab result document ID
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
	If NOT CheckTestOrderExists() THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Test order does not exist. Please try again';
    END IF;
    
	If NOT CheckTestTypeExists() THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Test type does not exist. Please try again';
    END IF;
    
    IF NOT CheckNurseExists() THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Test type does not exist. Please try again';
    END IF;
    -- Update the Test_Details table with the new administering staff ID and lab result document ID
    UPDATE Test_Details
    SET
        administering_staff_id = para_administering_staff_id,  -- Update the administering staff ID
        lab_result_document_id = para_lab_result_document_id  -- Update the lab result document ID
    WHERE
        test_id = para_test_order_id  -- Match the test order ID
        AND test_type_id = para_test_type_id;  -- Match the test type ID
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.UpdateTestDetail TO 'Nurses'@'IP'$$

DELIMITER ;
