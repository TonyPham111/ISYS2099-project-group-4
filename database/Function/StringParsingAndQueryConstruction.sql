DELIMITER $$
DROP FUNCTION IF EXISTS ParsingAllergiesPatientsString$$
CREATE FUNCTION ParsingAllergiesPatientsString(
    para_patient_id INT,             -- Parameter for the patient ID
    current_string_index TEXT,       -- Parameter representing the allergy ID or name
    last_string INT                  -- Parameter to indicate if this is the last string in a list (1 for last, 0 otherwise)
)
RETURNS TEXT                         -- The function returns a TEXT value, which is an SQL statement
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE para_allergy_id INT;     -- Variable to store the allergy ID

    -- Find the ID of the allergy based on the input string
    -- Assuming `current_string_index` should match an ID or a column like `allergy_name`
    SELECT id INTO para_allergy_id
    FROM Allergies
    WHERE id = current_string_index;

    -- If no matching allergy ID is found, raise an error
    IF para_allergy_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot find allergy. Please check your input';
    END IF;

    -- If this is the last allergy in the list, finalize the SQL statement with a closing parenthesis and semicolon
    IF last_string = 1 THEN
        RETURN CONCAT('(', para_patient_id, ',', para_allergy_id, ',', '\'', CURDATE(), '\'', ');');
    ELSE
        -- If it's not the last allergy, finalize the SQL statement with just a closing parenthesis (no semicolon)
        RETURN CONCAT('(', para_patient_id, ',', para_allergy_id, ',', '\'', CURDATE(), '\'', '), ');
    END IF;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingAllergiesPatientsString TO 'Doctors'@'IP'$$

DROP FUNCTION IF EXISTS ParsingDiagnosisNameString$$
CREATE FUNCTION ParsingDiagnosisNameString(
    latest_diagnosis_id INT,         -- Parameter for the latest diagnosis ID
    current_string_code TEXT,        -- Parameter representing the diagnosis condition code
    last_string INT                  -- Parameter to indicate if this is the last string in a list (1 for last, 0 otherwise)
)
RETURNS TEXT                         -- The function returns a TEXT value, which is an SQL statement
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE para_condition_code TEXT;  -- Variable to store the condition code fetched from the Conditions table
    -- Fetch the condition code corresponding to the accumulated condition name
    SELECT Conditions.condition_code INTO para_condition_code
    FROM Conditions
    WHERE Conditions.condition_code = current_string_code;

    -- If the condition code is not found, raise an error
    IF para_condition_code IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect Condition Name. Please try again';
    END IF;

	-- Added single quotes around para_condition_code so that it is recognized as an inserted string value
    -- If this is the last condition in the list, finalize the SQL statement with a closing parenthesis and semicolon
    IF last_string = 1 THEN
        RETURN CONCAT('(', latest_diagnosis_id, ',', '\'', para_condition_code, '\'', ');');
    ELSE
        -- If it's not the last condition, finalize the SQL statement with just a closing parenthesis (no semicolon)
        RETURN CONCAT('(', latest_diagnosis_id, ',', '\'', para_condition_code, '\'', '), ');
    END IF;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingDiagnosisNameString TO 'Doctors'@'IP'$$

DROP FUNCTION IF EXISTS ParsingDrugsCodeAndQuantity$$
CREATE FUNCTION ParsingDrugsCodeAndQuantity(
    current_string_code TEXT,  -- The input string containing the drug code and quantity, separated by a colon.
    latest_prescription_id INT, -- The ID of the latest prescription, which will be used in the INSERT statement.
    last_string INT  -- A flag to determine if the current drug is the last one in the list (1 for last, 0 otherwise).
)
RETURNS TEXT -- The function returns a TEXT value, which is a combination of SQL statements.
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE medicine_code INT; -- Variable to store the extracted drug code.
    DECLARE prescription_quantity INT; -- Variable to store the extracted quantity of the drug.
    DECLARE medicine_inventory INT; -- Variable to store the current inventory level of the drug.
    DECLARE new_inventory INT; -- Variable to store the new inventory level after subtracting the prescribed quantity.
    DECLARE current_price INT; -- Variable to store the current price of the drug.

    -- Declare the SQL statements to be returned
    DECLARE update_case_statement TEXT; -- Variable to store the CASE statement part of the UPDATE query.
    DECLARE update_where_statement TEXT; -- Variable to store the WHERE clause of the UPDATE query.
    DECLARE insert_statement TEXT; -- Variable to store the INSERT statement.
    DECLARE drug_code_string TEXT;	-- Variable to store the extracter drug code string.
    
    -- Moved the drug code extraction outside the where statement to improve performance
    SET drug_code_string = SUBSTRING_INDEX(current_string_code, ':', 1);

    -- Extract the drug code from the input string (portion before the colon) and verify if the drug exists
    SELECT drug_code INTO medicine_code
    FROM Drugs
    WHERE drug_code = drug_code_string
    FOR UPDATE;

    -- If the drug code is not found, raise an error
    IF medicine_code IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect medicine name. Please try again';
    END IF;

    -- Extract the quantity of the drug from the input string (portion after the colon) and convert it to an unsigned integer
    SET prescription_quantity = CAST(SUBSTRING_INDEX(current_string_code, ':', -1) AS UNSIGNED);

	-- Combined the queries to retrieve the current inventory level and price of the drug
    SELECT inventory, price_per_unit 
    INTO medicine_inventory, current_price
    FROM Drugs
    WHERE drug_code = medicine_code;

    -- Calculate the new inventory level by subtracting the prescribed quantity
    SET new_inventory = medicine_inventory - prescription_quantity;

    -- If the new inventory level is less than 0, raise an error due to insufficient inventory
    IF new_inventory < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Not enough inventory.';
    END IF;
    
    -- Construct the INSERT statement for adding the drug to the prescription
    SET insert_statement = CONCAT('(', medicine_code, ',', latest_prescription_id, ',', prescription_quantity, ',', current_price, ')');
	-- If not the last drug, add a comma to the WHERE clause to continue appending conditions
	SET update_where_statement = CONCAT(medicine_code, ', ');
    -- Construct the CASE clause for the UPDATE statement, which updates the inventory
    SET update_case_statement = CONCAT('WHEN drug_code = ', medicine_code, ' THEN ', new_inventory, '\n');

    -- Construct the WHERE clause for the UPDATE statement
    IF last_string = 1 THEN
        -- If this is the last drug in the list, finalize the statements by adding a semicolon to the INSERT statement
        SET insert_statement = CONCAT(insert_statement, ';');

        -- Finalize the WHERE clause by closing the parentheses
        SET update_where_statement = CONCAT(medicine_code, ')');

        -- Finalize the CASE clause by adding an ELSE part that retains the current inventory for drugs not matched
        SET update_case_statement = CONCAT(update_case_statement, 'ELSE inventory\n');

    END IF;

    -- Return the concatenated SQL statements (INSERT, CASE, and WHERE) as the function result
    RETURN CONCAT(insert_statement, ';', update_case_statement, '-', update_where_statement);
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingDrugsCodeAndQuantity TO 'Doctors'@'IP'$$

DROP FUNCTION IF EXISTS ParsingTestTypeIdString$$
CREATE FUNCTION ParsingTestTypeIdString(
    latest_test_order_id INT,        -- Parameter for the ID of the latest test order
    current_string_code TEXT,        -- Parameter for the test name (string representing the test type)
    para_administering_date DATE,    -- Parameter for the date when the test was administered
    para_administering_time TIME,    -- Parameter for the time when the test was administered
    para_administering_staff_id INT, -- Parameter for the ID of the administering staff
    last_string INT                  -- Parameter to indicate if this is the last string in a list (1 for last, 0 otherwise)
)
RETURNS TEXT                         -- The function returns a TEXT value, which is an SQL statement
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE para_test_type_id INT;            -- Variable to store the test type ID fetched from the Test_Types table
    DECLARE current_price DECIMAL(6,2);       -- Variable to store the price of the test type

    -- Combined the queries to fetch the test type ID and price based on the test type ID from the Test_Types table
    SELECT Test_Types.id, price 
    INTO para_test_type_id, current_price
    FROM Test_Types
    WHERE Test_Types.id = current_string_code LIMIT 1;

    -- Raise an exception if no matching test type is found
    IF para_test_type_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect test id. Please try again';
    END IF;


    -- Fetch the price of the test type based on the test type ID
    SELECT price INTO current_price
    FROM Test_Types
    WHERE id = para_test_type_id LIMIT 1;

    -- If this is the last test type in the list, finalize the SQL statement with a closing parenthesis and semicolon
    IF last_string = 1 THEN
        RETURN CONCAT('(', latest_test_order_id, ',', para_test_type_id, ',', '\'',
                      para_administering_date, '\'', ',', '\'', para_administering_time, '\'', 
                      ',', current_price, ');');
    ELSE
        -- If it's not the last test type, finalize the SQL statement with a closing parenthesis followed by a comma
        RETURN CONCAT('(', latest_test_order_id, ',', para_test_type_id, ',', '\'',
                      para_administering_date, '\'', ',', '\'', para_administering_time, '\'', 
                      ',', current_price, '), ');
    END IF;

END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.ParsingTestTypeIdString TO 'Doctors'@'IP'$$

DELIMITER ;