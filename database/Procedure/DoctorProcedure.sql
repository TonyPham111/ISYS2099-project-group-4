CREATE PROCEDURE AddNewDiagnosis(
    para_id INT,                  -- Parameter for the diagnosis ID
    para_doctor_id INT,           -- Parameter for the doctor ID who made the diagnosis
    para_patient_id INT,          -- Parameter for the patient ID who is being diagnosed
    para_diagnosis_date DATE,     -- Parameter for the date of the diagnosis
    para_diagnosis_note TEXT,     -- Parameter for any notes related to the diagnosis
    para_condition_code_string TEXT  -- Parameter for a comma-separated string of condition names
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE para_condition_code TEXT;  -- Variable to store the condition code fetched from the Conditions table
    DECLARE current_index INT DEFAULT 1;  -- Variable to keep track of the current index in the condition code string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current condition name being processed

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Diagnoses table with the provided parameters
    INSERT INTO Diagnoses (id, doctor_id, patient_id, diagnosis_date, diagnosis_note)
    VALUES (para_id, para_doctor_id, para_patient_id, para_diagnosis_date, para_diagnosis_note);

    -- Begin a loop to process the comma-separated condition names in para_condition_code_string
    WHILE current_index <= LENGTH(para_condition_code_string) DO
        -- Check if the current character is a comma, indicating the end of a condition name
        IF SUBSTRING(para_condition_code_string, current_index, 1) = ',' THEN
            -- Fetch the condition code corresponding to the accumulated condition name
            SELECT Conditions.condition_code INTO para_condition_code 
            FROM Conditions 
            WHERE Conditions.condition_name = current_string_code;

            -- Insert the fetched condition code into the DiagnosesDetails table
            INSERT INTO DiagnosesDetails (diagnosis_id, condition_code) 
            VALUES (para_id, para_condition_code);

            -- Reset the accumulated condition name for the next iteration
            SET current_string_code = '';
        ELSE
            -- If not a comma, continue accumulating the condition name
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_condition_code_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last condition code in the string (as it won't be followed by a comma)
    SELECT Conditions.condition_code INTO para_condition_code 
    FROM Conditions 
    WHERE Conditions.condition_name = current_string_code;

    -- Insert the last condition code into the DiagnosesDetails table
    INSERT INTO DiagnosesDetails (diagnosis_id, condition_code) 
    VALUES (para_id, para_condition_code);

    -- Commit the transaction to save all changes
    COMMIT;
END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'AddNewDiagnosis' TO 'Doctors'@'host';



CREATE PROCEDURE AddNewPrescription(
    para_id INT,                              -- Parameter for the prescription ID
    para_doctor_id INT,                       -- Parameter for the doctor ID who issued the prescription
    para_patient_id INT,                      -- Parameter for the patient ID to whom the prescription is given
    para_treatment_end_time DATETIME,         -- Parameter for the end time of the treatment
    para_diagnosis_id INT,                    -- Parameter for the diagnosis ID associated with the prescription
    para_prescription_note TEXT,              -- Parameter for any notes related to the prescription
    para_drug_code_quantity_string TEXT       -- Parameter for a comma-separated string of drug names and their quantities
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE current_index INT DEFAULT 1;          -- Variable to keep track of the current index in the drug code quantity string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current drug name and quantity being processed
    DECLARE medicine_code INT;                    -- Variable to store the drug code fetched from the Drugs table
    DECLARE medicine_quantity INT;                -- Variable to store the quantity of the drug to be prescribed
    DECLARE current_price DECIMAL(6,2);           -- Variable to store the price per unit of the drug

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the TreatmentHistory table with the provided parameters
    INSERT INTO TreatmentHistory(id, doctor_id, patient_id, diagnosis_id, treatment_start_date, treatment_end_date, prescription_note)
    VALUES (para_id, para_doctor_id, para_patient_id, para_diagnosis_id, NOW(), para_treatment_end_time, para_prescription_note);

    -- Begin a loop to process the comma-separated drug names and quantities in para_drug_code_quantity_string
    WHILE current_index <= LENGTH(para_drug_code_quantity_string) DO
        -- Check if the current character is a comma, indicating the end of a drug name and quantity pair
        IF SUBSTRING(para_drug_code_quantity_string, current_index, 1) = ',' THEN
            -- Extract the drug code based on the drug name before the colon
            SELECT Drugs.drug_code INTO medicine_code 
            FROM Drugs 
            WHERE Drugs.drug_name = SUBSTRING_INDEX(current_string_code, ':', 1);

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
            VALUES (medicine_code, para_id, medicine_quantity, current_price);

            -- Reset the accumulated string code for the next iteration
            SET current_string_code = '';
        ELSE
            -- If not a comma, continue accumulating the drug name and quantity
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_drug_code_quantity_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last drug name and quantity pair in the string (as it won't be followed by a comma)
    SELECT Drugs.drug_code INTO medicine_code 
    FROM Drugs 
    WHERE Drugs.drug_name = SUBSTRING_INDEX(current_string_code, ':', 1);

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
    VALUES (medicine_code, para_id, medicine_quantity, current_price);

    -- Commit the transaction to save all changes
    COMMIT;
END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'AddNewPrescription' TO 'Doctors'@'host';




CREATE PROCEDURE OrderTest(
    para_id INT,                          -- Parameter for the test order ID
    para_patient_id INT,                  -- Parameter for the patient ID for whom the test is ordered
    para_doctor_id INT,                   -- Parameter for the doctor ID who orders the test
    para_administering_date DATE,         -- Parameter for the date when the test will be administered
    para_administering_time TIME,         -- Parameter for the time when the test will be administered
    para_ordering_date DATE,              -- Parameter for the date when the test was ordered
    para_text_id_string TEXT              -- Parameter for a comma-separated string of test type IDs
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE para_test_type_id INT;            -- Variable to store the test type ID fetched from the Test_Types table
    DECLARE current_index INT DEFAULT 1;      -- Variable to keep track of the current index in the test type ID string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current test type ID being processed
    DECLARE current_price DECIMAL(6,2);       -- Variable to store the price of the test type

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Test_Orders table with the provided parameters
    INSERT INTO Test_Orders(id, patient_id, ordering_staff_id, ordering_date)
    VALUES (para_id, para_patient_id, para_doctor_id, para_ordering_date);

    -- Begin a loop to process the comma-separated test type IDs in para_text_id_string
    WHILE current_index <= LENGTH(para_text_id_string) DO
        -- Check if the current character is a comma, indicating the end of a test type ID
        IF SUBSTRING(para_text_id_string, current_index, 1) = ',' THEN
            -- Fetch the test type ID and its price from the Test_Types table based on the accumulated string
            SELECT Test_Types.id INTO para_test_type_id 
            FROM Test_Types 
            WHERE Test_Types.id = CAST(current_string_code AS UNSIGNED);

            -- Fetch the price of the test type
            SELECT price INTO current_price 
            FROM Test_Types 
            WHERE id = CAST(current_string_code AS UNSIGNED);

            -- Insert the test details into the Test_Details table
            INSERT INTO Test_Details(test_id, test_type_id, administering_date, administering_time, price)
            VALUES (para_id, para_test_type_id, para_administering_date, para_administering_time, current_price);

            -- Reset the accumulated string code for the next iteration
            SET current_string_code = '';
        ELSE
            -- If not a comma, continue accumulating the test type ID
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(para_text_id_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last test type ID in the string (as it won't be followed by a comma)
    SELECT Test_Types.id INTO para_test_type_id 
    FROM Test_Types 
    WHERE Test_Types.id = CAST(current_string_code AS UNSIGNED);

    -- Fetch the price of the test type
    SELECT price INTO current_price 
    FROM Test_Types 
    WHERE id = CAST(current_string_code AS UNSIGNED);

    -- Insert the test details into the Test_Details table
    INSERT INTO Test_Details(test_id, test_type_id, administering_date, administering_time, price)
    VALUES (para_id, para_test_type_id, para_administering_date, para_administering_time, current_price);

    -- Commit the transaction to save all changes
    COMMIT;
END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'OrderTest' TO 'Doctors'@'host';


CREATE PROCEDURE FetchDoctorScheduleById(para_doctor_id INT)  -- Procedure to fetch a doctor's schedule by their ID
SQL SECURITY DEFINER
BEGIN
    -- Select the schedule details for the specified doctor
    SELECT
        Staff_Schedule.schedule_date,                        -- The date of the schedule
        Staff_Schedule.start_time,                           -- The start time of the schedule
        Staff_Schedule.end_time,                             -- The end time of the schedule
        Appointments.appointment_purpose,                    -- The purpose of the appointment
        Appointments.appointment_notes_document_id,          -- The document ID for the appointment notes
        Patients.id AS patient_id,                           -- The ID of the patient associated with the appointment
        Patients.full_name AS patient_name,                  -- The full name of the patient
        Patients.gender AS patient_gender,                   -- The gender of the patient
        Patients.birth_date AS patient_birth_date            -- The birth date of the patient
    FROM
        Staff_Schedule                                       -- The table containing staff schedules
    INNER JOIN
        Appointments                                         -- Joining with the Appointments table to get appointment details
    ON 
        Staff_Schedule.id = Appointments.id                  -- Matching the schedule ID with the appointment ID
    INNER JOIN
        Patients                                             -- Joining with the Patients table to get patient details
    ON 
        Appointments.patient_id = Patients.id                -- Matching the patient ID in appointments with the Patients table
    WHERE 
        doctor_id = para_doctor_id;                          -- Filtering the results to include only the specified doctor's schedule
END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'FetchDoctorScheduleById' TO 'Doctors'@'host';
