-- Changed all functions to procedures since functions cannot insert or update data
DELIMITER $$

DROP PROCEDURE IF EXISTS ParsingAllergiesIdString$$
CREATE PROCEDURE ParsingAllergiesIdString(
    para_patient_id INT,
    current_string_id TEXT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE para_allergy_id INT;
    DECLARE current_allergy_id INT;
    
    SET current_allergy_id = CAST(current_string_id AS UNSIGNED); -- Convert the input string to INT

    -- Find the id of the allergy with the given id
    SELECT id INTO para_allergy_id
    FROM Allergies
	WHERE id = current_allergy_id;

    -- Raise an exception in case of incorrectly input allergy id
    IF para_allergy_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot find allergy. Please check your input';
    END IF;

    -- Insert the processed allergy ID into the PatientAllergy table
    INSERT INTO PatientAllergy (allergy_id, patient_id, record_date)
    VALUES (para_allergy_id, para_patient_id, CURDATE());

    -- Reset the accumulated string index for the next iteration (if needed)
    -- SET current_string_index = '';
END$$


DROP PROCEDURE IF EXISTS ParsingDiagnosisCodeString$$
CREATE PROCEDURE ParsingDiagnosisCodeString(
    latest_diagnosis_id INT,
    current_string_code TEXT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE para_condition_code TEXT;  -- Variable to store the condition code fetched from the Conditions table
	
     -- Fetch the condition code corresponding to the accumulated condition name
    SELECT condition_code INTO para_condition_code
    FROM Conditions
    WHERE condition_code = current_string_code;
    
    IF (para_condition_code IS NULL) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect condition code. Please try again';
    END IF;
	
    -- Insert the fetched condition code into the DiagnosesDetails table
    INSERT INTO DiagnosesDetails (diagnosis_id, condition_code)
    VALUES (latest_diagnosis_id, para_condition_code);
END$$


DROP PROCEDURE IF EXISTS ParsingDrugsCodeAndQuantity$$
CREATE PROCEDURE ParsingDrugsCodeAndQuantity(
    latest_prescription_id INT,
    current_string_code TEXT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE current_inventory INT;
    DECLARE medicine_code INT;                    -- Variable to store the drug code fetched from the Drugs table
    DECLARE medicine_quantity INT;                -- Variable to store the quantity of the drug to be prescribed
    DECLARE current_price DECIMAL(6,2);           -- Variable to store the price per unit of the drug
	DECLARE current_medicine_code VARCHAR(50);
	
	SET current_medicine_code = SUBSTRING_INDEX(current_string_code, ':', 1);

     -- Extract the drug code and price based on the drug name before the colon
    SELECT Drugs.drug_code, price_per_unit 
	INTO medicine_code, current_price
    FROM Drugs
    WHERE Drugs.drug_code = current_medicine_code LIMIT 1;

    IF medicine_code IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect medicine code. Please try again';
    END IF;

    -- Extract the quantity of the drug after the colon and convert it to an unsigned integer
    SET medicine_quantity = CAST(SUBSTRING_INDEX(current_string_code, ':', -1) AS UNSIGNED);

    -- Check if there is enough inventory
    SELECT inventory INTO current_inventory FROM Drugs WHERE Drugs.drug_code = medicine_code;

    IF current_inventory - medicine_quantity < 0 THEN
        SIGNL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Not enough inventory currently. Aborting Operation'


    -- Update the inventory in the Drugs table by subtracting the prescribed quantity
    UPDATE Drugs
    SET inventory = inventory - medicine_quantity
    WHERE drug_code = medicine_code;

    -- Insert the drug code, prescription ID, quantity, and price into the Prescription_Details table
    INSERT INTO Prescription_Details(drug_code, prescription_id, quantity, price)
    VALUES (medicine_code, latest_prescription_id, medicine_quantity, current_price);
END$$


DROP PROCEDURE IF EXISTS ParsingTestIdString$$
CREATE PROCEDURE ParsingTestIdString(
    latest_test_order_id INT,
    current_string_id TEXT,
    para_administering_date DATE,
    para_administering_time TIME,
	para_administering_staff_id INT
)
SQL SECURITY DEFINER
BEGIN
	DECLARE para_test_type_id TEXT;   -- Variable to store the test type id fetched from the Test_Types table
	DECLARE test_price DECIMAL(6,2);  -- Variable to store the price of the test
	DECLARE current_test_type_id INT;
	
	SET current_test_type_id = CAST(current_string_id AS UNSIGNED); -- Convert the input string to INT

    -- Fetch the test type id and price corresponding to the accumulated test type id
    SELECT id, price 
	INTO para_test_type_id, test_price
    FROM Test_Types
    WHERE id = current_test_type_id;
    
    IF (para_test_type_id IS NULL) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect test type. Please try again';
    END IF;
	
    -- Insert the test type ID into the appropriate table with the provided parameters
    INSERT INTO Test_Details (test_id, test_type_id, administering_date, administering_time, administering_staff_id, price)
    VALUES (latest_test_order_id, current_test_type_id, para_administering_date, para_administering_time, para_administering_staff_id, test_price);
END$$

DELIMITER ;
