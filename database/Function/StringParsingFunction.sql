CREATE FUNCTION ParsingAllergiesNameString(
    para_patient_id INT,
    current_string_Index TEXT
)
RETURNS INT
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN
    DECLARE para_allergy_id INT;

    -- Find the id of the allergy with the given name
    SELECT id INTO para_allergy_id
    FROM Allergies
    WHERE id = current_string_index
    LIMIT 1;

    -- Raise an exception in case of incorrectly input allergy name
    IF para_allergy_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot find allergy. Please check your input';
    END IF;

    -- Insert the processed allergy ID into the PatientAllergy table
    INSERT INTO PatientAllergy (allergy_id, patient_id, record_date)
    VALUES (para_allergy_id, para_patient_id, CURDATE());

    -- Reset the accumulated string index for the next iteration (if needed)
    -- SET current_string_index = '';

    RETURN 1;  -- Assuming the return value is just a success indicator
END;


CREATE FUNCTION ParsingDiagnosisNameString(
    latest_diagnosis_id INT,
    current_string_code TEXT
)
RETURNS INT
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN
    DECLARE para_condition_code TEXT;  -- Variable to store the condition code fetched from the Conditions table
     -- Fetch the condition code corresponding to the accumulated condition name
    SELECT Conditions.condition_code INTO para_condition_code
    FROM Conditions
    WHERE Conditions.condition_code = current_string_code LIMIT 1;

    IF (para_condition_code IS NULL) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect Condition Name. Please try again';
    END IF;
    -- Insert the fetched condition code into the DiagnosesDetails table
    INSERT INTO DiagnosesDetails (diagnosis_id, condition_code)
    VALUES (latest_diagnosis_id, para_condition_code);
    RETURN 0;
END;



CREATE FUNCTION ParsingDrugsNameAndQuantity(
    current_string_code TEXT,
    latest_prescription_id INT
)
RETURNS INT
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN
    DECLARE medicine_code INT;                    -- Variable to store the drug code fetched from the Drugs table
    DECLARE medicine_quantity INT;                -- Variable to store the quantity of the drug to be prescribed
    DECLARE current_price DECIMAL(6,2);           -- Variable to store the price per unit of the drug

     -- Extract the drug code based on the drug name before the colon
    SELECT Drugs.drug_code INTO medicine_code
    FROM Drugs
    WHERE Drugs.drug_code = SUBSTRING_INDEX(current_string_code, ':', 1) LIMIT 1;

    IF medicine_code IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect medicine name. Please try again';
    END IF;

    -- Extract the quantity of the drug after the colon and convert it to an unsigned integer
    SET medicine_quantity = CAST(SUBSTRING_INDEX(current_string_code, ':', -1) AS UNSIGNED);

    -- Fetch the price per unit for the corresponding drug code
    SELECT price_per_unit INTO current_price
    FROM Drugs
    WHERE drug_code = medicine_code;

    -- Update the inventory in the Drugs table by subtracting the prescribed quantity
    UPDATE Drugs
    SET inventory = inventory - medicine_quantity
    WHERE drug_code = medicine_code;

    -- Insert the drug code, prescription ID, quantity, and price into the Prescription_Details table
    INSERT INTO Prescription_Details(drug_code, prescription_id, quantity, price)
    VALUES (medicine_code, latest_prescription_id, medicine_quantity, current_price);
    RETURN 0;
END;


