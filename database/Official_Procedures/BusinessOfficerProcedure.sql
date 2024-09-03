DELIMITER $$
DROP PROCEDURE IF EXISTS GetAllBillings$$
CREATE PROCEDURE GetAllBillings()
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;  -- Rollback the transaction in case of an error
        -- Retrieve the SQLSTATE of the current exception
        GET DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal with SQLSTATE '45000'
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

    -- Select all billing records
    SELECT Billings.id, Billings.patient_id, Billings.billing_date, Billings.total_amount 
    FROM Billings;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllBillings TO 'BusinessOfficers'@'%'$$
DROP PROCEDURE IF EXISTS GetBillingDetails$$
CREATE PROCEDURE GetBillingDetails(
    billing_id INT
)
SQL SECURITY DEFINER
BEGIN
    DECLARE appointmentID INT;
    DECLARE presID INT;
    DECLARE testID INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;  -- Rollback the transaction in case of an error
        -- Retrieve the SQLSTATE of the current exception
        GET DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal with SQLSTATE '45000'
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;

    -- Retrieve the IDs for appointment, prescription, and test from the Billings table
    SELECT appointment_id, prescription_id, test_id INTO appointmentID, presID, testID 
    FROM Billings 
    WHERE Billings.id = billing_id;

    -- Fetch appointment details
    SELECT appointment_charge
    FROM Appointments
    WHERE id = appointmentID;

    -- Fetch prescription details
    SELECT 
        Prescription_Details.drug_code,
        Drugs.drug_name,
        Prescription_Details.price,
        Prescription_Details.quantity
    FROM 
        Prescription_Details
    INNER JOIN 
        Drugs ON Prescription_Details.drug_code = Drugs.drug_code
    WHERE 
        Prescription_Details.prescription_id = presID;

    -- Fetch test details
    SELECT 
        Test_Details.test_type_id,
        Test_Types.test_name,
        Test_Details.price
    FROM 
        Test_Details
    INNER JOIN 
        Test_Types ON Test_Details.test_type_id = Test_Types.id
    WHERE 
        Test_Details.test_id = testID;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetBillingDetails TO 'BusinessOfficers'@'%'$$


DROP PROCEDURE IF EXISTS InsertNewBilling$$
CREATE PROCEDURE InsertNewBilling(
    para_patient_id INT,          -- Parameter for the patient ID
    para_appointment_id INT,      -- Parameter for the appointment ID
    para_test_id INT,             -- Parameter for the test ID
    para_prescription_id INT      -- Parameter for the prescription ID
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to store the fees
    DECLARE appointment_fee DECIMAL(6,2);
    DECLARE total_prescription_fee DECIMAL(8,2);
    DECLARE total_test_fee DECIMAL(8,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;  -- Rollback the transaction in case of an error
        -- Retrieve the SQLSTATE of the current exception
        GET DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE;

        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal with SQLSTATE '45000'
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;
    SET @parent_proc = TRUE;

    -- Validate inputs
    IF NOT CheckPatientExists(para_patient_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Patient does not exist';
    END IF;
    
    -- Ensure that at least one ID is provided
    IF para_appointment_id IS NULL AND para_test_id IS NULL AND para_prescription_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'At least one ID must be provided';
    END IF;
    
    IF para_appointment_id IS NOT NULL THEN
        IF NOT CheckAppointmentExists(para_appointment_id, para_patient_id) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Appointment does not exist';
        END IF;
    END IF;
    
    IF para_test_id IS NOT NULL THEN
        IF NOT CheckTestOrderExists(para_test_id, para_patient_id) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Test details do not exist';
        END IF;
    END IF;
    
    IF para_prescription_id IS NOT NULL THEN
        IF NOT CheckPrescriptionExists(para_prescription_id, para_patient_id) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Prescription does not exist';
        END IF;
    END IF;
    
    -- Initialize variables to prevent null values in case there are no fees
    SET appointment_fee = 0;
    SET total_prescription_fee = 0;
    SET total_test_fee = 0;

    -- Fetch the appointment fee
    SELECT appointment_charge INTO appointment_fee
    FROM Appointments
    WHERE Appointments.id = para_appointment_id;

    -- Calculate the total prescription fee
    SELECT IFNULL(SUM(price), 0) INTO total_prescription_fee
    FROM Prescription_Details
    WHERE prescription_id = para_prescription_id;

    -- Calculate the total test fee
    SELECT IFNULL(SUM(price), 0) INTO total_test_fee
    FROM Test_Details
    WHERE test_id = para_test_id;

    -- Insert the new billing record into the Billings table
    INSERT INTO Billings (
        patient_id, 
        billing_date, 
        total_amount, 
        appointment_id, 
        prescription_id, 
        test_id
    ) VALUES (
        para_patient_id, 
        CURDATE(), 
        appointment_fee + total_prescription_fee + total_test_fee, 
        para_appointment_id, 
        para_prescription_id, 
        para_test_id
    );
    SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.InsertNewBilling TO 'BusinessOfficers'@'%'$$
DELIMITER ;