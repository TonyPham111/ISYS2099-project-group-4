CREATE PROCEDURE GetBillingDetails(
    presID INT,          -- Parameter for the prescription ID
    testID INT,          -- Parameter for the test ID
    appointmentID INT    -- Parameter for the appointment ID
)
SQL SECURITY DEFINER
BEGIN
    -- Fetch appointment details
    SELECT 
        id AS appointment_id,
        appointment_date,
        start_time,
        end_time
    FROM 
        Appointments
    WHERE 
        id = appointmentID;

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
END;

GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'GetBillingsDetails' TO 'BusinessOfficers'@'host'



CREATE PROCEDURE InsertNewBilling(
    BillingID INT,          -- Parameter for the billing ID
    patientID INT,          -- Parameter for the patient ID
    appointmentID INT,      -- Parameter for the appointment ID
    testID INT,             -- Parameter for the test ID
    prescriptionID INT      -- Parameter for the prescription ID
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to store the fees
    DECLARE appointment_fee DECIMAL(6,2);
    DECLARE total_prescription_fee DECIMAL(8,2);
    DECLARE total_test_fee DECIMAL(8,2);

    -- Initialize variables to prevent null values in case there are no fees
    SET appointment_fee = 0;
    SET total_prescription_fee = 0;
    SET total_test_fee = 0;

    -- Fetch the appointment fee
    SELECT appointment_charge INTO appointment_fee
    FROM Appointments
    WHERE Appointments.id = appointmentID;

    -- Calculate the total prescription fee
    SELECT IFNULL(SUM(price), 0) INTO total_prescription_fee
    FROM Prescription_Details
    WHERE prescription_id = prescriptionID;

    -- Calculate the total test fee
    SELECT IFNULL(SUM(price), 0) INTO total_test_fee
    FROM Test_Details
    WHERE test_id = testID;

    -- Insert the new billing record into the Billings table
    INSERT INTO Billings (
        id, 
        patient_id, 
        billing_date, 
        total_amount, 
        appointment_id, 
        prescription_id, 
        test_id
    ) VALUES (
        BillingID, 
        patientID, 
        CURDATE(), 
        appointment_fee + total_prescription_fee + total_test_fee, 
        appointmentID, 
        prescriptionID, 
        testID
    );

END;
GRANT EXECUTE ON PROCEDURE 'hospital_management_system'.'InsertNewBillings' TO 'BusinessOfficers'@'host'