DELIMITER $$

DROP FUNCTION IF EXISTS ParseQualificationString$$
CREATE FUNCTION ParseQualificationString(
	current_qualifications TEXT,
    new_staff_id INT,
    last_string INT
)
RETURNS TEXT
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
	DECLARE qualification_type TEXT;
    DECLARE document_id TEXT;
    IF @parent_proc = NULL THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    SET qualification_type = SUBSTRING_INDEX(current_qualifications, ':', -1);
    SET document_id = SUBSTRING_INDEX(current_qualifications, ':', 1);
    
    IF last_string = 0 THEN
		RETURN CONCAT('(',new_staff_id, ', \'', qualification_type, '\', ', '\'', document_id, '\'),' );
	ELSE 
		RETURN CONCAT('(',new_staff_id, ', \'', qualification_type, '\', ', '\'', document_id, '\');' );
    END IF;
END$$


DROP FUNCTION IF EXISTS ParseScheduleString$$
CREATE FUNCTION ParseScheduleString(
    para_staff_id INT,
    current_string_code TEXT,
    last_string BIT
) RETURNS TEXT
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
	DECLARE clash_count INT;
    DECLARE time_check INT;
    DECLARE existing_schedule_id INT;
    DECLARE para_schedule_date DATE;
    DECLARE para_schedule_start_time TIME;
    DECLARE para_schedule_end_time TIME;
    DECLARE para_schedule_note TEXT;
    DECLARE update_case_clause_start_time TEXT;
    DECLARE update_case_clause_end_time TEXT;
    DECLARE update_where_clause TEXT;
    
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    SET para_schedule_date = substring_index(current_string_code, ";",  1); 
    SET para_schedule_start_time = substring_index(substring_index(current_string_code, ";", -1), "-", 1);
    SET para_schedule_end_time = substring_index(substring_index(substring_index(current_string_code,";", -1), "-", -1), "_", 1);
    
    SELECT TimeFormatCheck(para_schedule_start_time, para_schedule_end_time) INTO time_check;
    
    SELECT id INTO existing_schedule_id FROM Staff_Schedule 
    WHERE staff_id = para_staff_id AND schedule_date = para_schedule_date
    FOR UPDATE;
    
    IF existing_schedule_id IS NULL THEN
        RETURN CONCAT('1/(',para_staff_id,', ', '\'', para_schedule_date, '\'', ', ', '\'', para_schedule_start_time, '\'', ', ', '\'', para_schedule_end_time, '\'');
    ELSE 
		SELECT OptimizedCheckNewScheduleAndAppointmentConflict(existing_schedule_id) INTO clash_count;
		IF clash_count <> 0 THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'The new schedule clashes with an existing appointment.';
		END IF;
        SET update_case_clause_start_time = CONCAT('WHEN id = ', existing_schedule_id, ' THEN ', '\'', para_schedule_start_time, '\'');
        SET update_case_clause_end_time = CONCAT('WHEN id = ', existing_schedule_id, ' THEN ', '\'', para_schedule_end_time, '\'');
        SET update_where_clause = existing_schedule_id;
        RETURN CONCAT('0/',update_where_clause, ";", update_case_clause_start_time, "-", update_case_clause_end_time);
    END IF;
        
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParseScheduleString TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParseScheduleString TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParseScheduleString TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParseScheduleString TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParseScheduleString TO 'BusinessOfficers'@'%'$$


DROP FUNCTION IF EXISTS ParsingAllergiesPatientsString$$
CREATE FUNCTION ParsingAllergiesPatientsString(
    para_patient_id INT,             -- Parameter for the patient ID
    current_string_index TEXT,       -- Parameter representing the allergy ID or name
    last_string INT                  -- Parameter to indicate if this is the last string in a list (1 for last, 0 otherwise)
) RETURNS TEXT
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE para_allergy_id INT;     -- Variable to store the allergy ID
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
	    
    -- If this is the last allergy in the list, finalize the SQL statement with a closing parenthesis and semicolon
    IF last_string = 1 THEN
        RETURN CONCAT('(', para_patient_id, ',', current_string_index, ',', '\'', CURDATE(), '\'', ');');
    ELSE
        -- If it's not the last allergy, finalize the SQL statement with just a closing parenthesis (no semicolon)
        RETURN CONCAT('(', para_patient_id, ',', current_string_index, ',', '\'', CURDATE(), '\'', '), ');
    END IF;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingAllergiesPatientsString TO 'Doctors'@'%'$$

DROP FUNCTION IF EXISTS ParsingCriteriaScoreString$$
CREATE FUNCTION ParsingCriteriaScoreString(
    latest_evaluation_id INT,         -- Parameter for the latest diagnosis ID
    current_string_code TEXT,        -- Parameter representing the diagnosis condition code
    last_string INT                  -- Parameter to indicate if this is the last string in a list (1 for last, 0 otherwise)
) RETURNS TEXT
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE para_criteria_id INT;  
    DECLARE para_criteria_score INT;
    SELECT CAST(SUBSTRING_INDEX(current_string_code, ':', -1) AS UNSIGNED INTEGER) INTO para_criteria_score;
	SELECT CAST(SUBSTRING_INDEX(current_string_code, ':', 1) AS UNSIGNED INTEGER) INTO para_criteria_id;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    
    IF para_criteria_score > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid score. Please try again';
    END IF;
        
    -- Added single quotes around para_condition_code so that it is recognized as an inserted string value
    -- If this is the last condition in the list, finalize the SQL statement with a closing parenthesis and semicolon
    IF last_string = 1 THEN
         RETURN CONCAT('(', latest_evaluation_id, ',', para_criteria_id, ',', para_criteria_score, ');');
    ELSE
        -- If it's not the last condition, finalize the SQL statement with just a closing parenthesis (no semicolon)
         RETURN CONCAT('(', latest_evaluation_id, ',', para_criteria_id, ',', para_criteria_score, '),');

    END IF;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingCriteriaScoreString TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingCriteriaScoreString TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingCriteriaScoreString TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingCriteriaScoreString TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingCriteriaScoreString TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS ParsingDiagnosisNameString$$
CREATE FUNCTION ParsingDiagnosisNameString(
    latest_diagnosis_id INT,         -- Parameter for the latest diagnosis ID
    current_string_code TEXT,        -- Parameter representing the diagnosis condition code
    last_string INT                  -- Parameter to indicate if this is the last string in a list (1 for last, 0 otherwise)
) RETURNS TEXT
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE para_condition_code TEXT;  -- Variable to store the condition code fetched from the Conditions table
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
        
    -- Added single quotes around para_condition_code so that it is recognized as an inserted string value
    -- If this is the last condition in the list, finalize the SQL statement with a closing parenthesis and semicolon
    IF last_string = 1 THEN
        RETURN CONCAT('(', latest_diagnosis_id, ',', '\'', current_string_code, '\'', ');');
    ELSE
        -- If it's not the last condition, finalize the SQL statement with just a closing parenthesis (no semicolon)
        RETURN CONCAT('(', latest_diagnosis_id, ',', '\'', current_string_code, '\'', '), ');
    END IF;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingDiagnosisNameString TO 'Doctors'@'%'$$

DROP FUNCTION IF EXISTS ParsingDrugsCodeAndQuantity$$
CREATE FUNCTION ParsingDrugsCodeAndQuantity(
    current_string_code TEXT,  -- The input string containing the drug code and quantity, separated by a colon.
    latest_prescription_id INT, -- The ID of the latest prescription, which will be used in the INSERT statement.
    last_string INT  -- A flag to determine if the current drug is the last one in the list (1 for last, 0 otherwise).
) RETURNS TEXT
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE medicine_code INT; -- Variable to store the extracted drug code.
    DECLARE prescription_quantity INT; -- Variable to store the extracted quantity of the drug.
    DECLARE medicine_inventory INT; -- Variable to store the current inventory level of the drug.
    DECLARE new_inventory INT; -- Variable to store the new inventory level after subtracting the prescribed quantity.
    DECLARE current_price DECIMAL(6,2); -- Variable to store the current price of the drug.

    -- Declare the SQL statements to be returned
    DECLARE update_case_statement TEXT; -- Variable to store the CASE statement part of the UPDATE query.
    DECLARE update_where_statement TEXT; -- Variable to store the WHERE clause of the UPDATE query.
    DECLARE insert_statement TEXT; -- Variable to store the INSERT statement.
    DECLARE drug_code_string TEXT;    -- Variable to store the extracter drug code string.
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    
    -- Moved the drug code extraction outside the where statement to improve performance
    SET drug_code_string = SUBSTRING_INDEX(current_string_code, ':', 1);

    -- Extract the quantity of the drug from the input string (portion after the colon) and convert it to an unsigned integer
    SET prescription_quantity = CAST(SUBSTRING_INDEX(current_string_code, ':', -1) AS UNSIGNED);

    -- Combined the queries to retrieve the current inventory level and price of the drug
    SELECT inventory, price_per_unit 
    INTO medicine_inventory, current_price
    FROM Drugs
    WHERE drug_code = CAST(drug_code_string AS UNSIGNED) FOR UPDATE;

    -- Calculate the new inventory level by subtracting the prescribed quantity
    SET new_inventory = medicine_inventory - prescription_quantity;

    -- If the new inventory level is less than 0, raise an error due to insufficient inventory
    IF new_inventory < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Not enough inventory.';
    END IF;
    
    -- Construct the INSERT statement for adding the drug to the prescription
    SET insert_statement = CONCAT('(', drug_code_string, ',', latest_prescription_id, ',', prescription_quantity, ',', current_price, ')');
    -- If not the last drug, add a comma to the WHERE clause to continue appending conditions
    SET update_where_statement = CONCAT(drug_code_string, ', ');
    -- Construct the CASE clause for the UPDATE statement, which updates the inventory
    SET update_case_statement = CONCAT('WHEN drug_code = ', drug_code_string, ' THEN ', new_inventory, '\n');

    -- Construct the WHERE clause for the UPDATE statement
    IF last_string = 1 THEN
        -- If this is the last drug in the list, finalize the statements by adding a semicolon to the INSERT statement
        SET insert_statement = CONCAT(insert_statement, ';');

        -- Finalize the WHERE clause by closing the parentheses
        SET update_where_statement = CONCAT(drug_code_string, ')');

        -- Finalize the CASE clause by adding an ELSE part that retains the current inventory for drugs not matched
        SET update_case_statement = CONCAT(update_case_statement, 'ELSE inventory\n');

    END IF;

    -- Return the concatenated SQL statements (INSERT, CASE, and WHERE) as the function result
    RETURN CONCAT(insert_statement, ';', update_case_statement, '-', update_where_statement);
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingDrugsCodeAndQuantity TO 'Doctors'@'%'$$

DROP FUNCTION IF EXISTS ParsingScheduleIdString$$
CREATE FUNCTION ParsingScheduleIdString(
    current_string_index TEXT,      
    last_string INT
) RETURNS TEXT
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN   
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    
    IF last_string = 1 THEN
        RETURN CONCAT(current_string_index, ');');
    ELSE
        RETURN CONCAT('', current_string_index);
    END IF;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingScheduleIdString TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingScheduleIdString TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingScheduleIdString TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingScheduleIdString TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingScheduleIdString TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS ParsingTestTypeIdString$$
CREATE FUNCTION ParsingTestTypeIdString(
    latest_test_order_id INT,        -- Parameter for the ID of the latest test order
    current_string_code TEXT,        -- Parameter for the test name (string representing the test type)
    para_administering_date DATE,    -- Parameter for the date when the test was administered
    para_administering_time TIME,    -- Parameter for the time when the test was administered
    para_administering_staff_id INT, -- Parameter for the ID of the administering staff
    last_string INT                  -- Parameter to indicate if this is the last string in a list (1 for last, 0 otherwise)
) RETURNS TEXT
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE para_test_type_id INT;            -- Variable to store the test type ID fetched from the Test_Types table
    DECLARE current_price DECIMAL(6,2);       -- Variable to store the price of the test type
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    
    SET para_test_type_id = CAST(current_string_code AS UNSIGNED);

    -- Fetch the price of the test type based on the test type ID
    SELECT price INTO current_price
    FROM Test_Types
    WHERE id = para_test_type_id LIMIT 1;
    
    IF current_price IS NULL THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect test type. Please try again';
    END IF;

    -- If this is the last test type in the list, finalize the SQL statement with a closing parenthesis and semicolon
    IF last_string = 1 THEN
        RETURN CONCAT('(', latest_test_order_id, ',', current_string_code, ',', '\'',
                      para_administering_date, '\'', ',', '\'', para_administering_time, '\'', 
                      ',', current_price, ');');
    ELSE
        -- If it's not the last test type, finalize the SQL statement with a closing parenthesis followed by a comma
        RETURN CONCAT('(', latest_test_order_id, ',', current_string_code, ',', '\'',
                      para_administering_date, '\'', ',', '\'', para_administering_time, '\'', 
                      ',', current_price, '), ');
    END IF;

END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingTestTypeIdString TO 'Doctors'@'%'$$

DELIMITER ;