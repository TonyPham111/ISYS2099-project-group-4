DELIMITER $$
/*
This procedure allows a staff to see their own row in the staff table without exposing the other staff's info

*/
CREATE PROCEDURE GetStaffInfo(IN staff_id INT)
SQL SECURITY DEFINER
BEGIN
    SELECT  non_manager.id,  
            non_manager.ssn, 
            non_manager.first_name, 
            non_manager.last_name, 
            non_manager.gender, 
            non_manager.birth_date, 
            non_manager.home_address,
            non_manager.phone_number,
            non_manager.email,
            non_manager.staff_password,
            non_manager.hire_date,
            non_manager.employment_type
            manager.name, 
            Departments.name, 
    FROM staff AS non_manager
    JOIN staff AS manager 
    ON non_manager.manager_id = manager.id
    JOIN Departments 
    ON non_manager.department_id = Departments.id
    WHERE non_manager.id = staff_id;
END $$

CREATE PROCEDURE GetBillingDetails(IN presID , IN testID INT, IN appointmentID)
SQl SECURITY DEFINER
BEGIN

    SELECT appointment_id, 
    appointment_date, 
    end_time,
    start_time
    FROM Appointments
    WHERE id = appointmentID

    SELECT Prescription_Details.drug_code, 
    Drugs.name,
    Prescription_Details.price, 
    Prescription_Details.quantity
    FROM Prescription_Details 
    INNER JOIN Drugs
    ON Prescription_Details.drug_code = Drugs.code 
    WHERE Prescription_Details.prescription_id = presID;
    
    SELECT Test_Details.test_type_id,
    Test_Types.test_name,
    Test_Details.price
    FROM Test_Details 
    INNER JOIN Test_Types
    ON Test_Details.test_type_id = Test_Types.id
    WHERE Test_Details.test_id = testID;
END $$

CREATE PROCEDURE InsertNewBilling(IN patientID INT, IN appointmentID INT, IN testID INT, IN prescriptionID)
SQL SECURITY DEFINER
BEGIN
    DEClARE appointment_fee DECIMAL(6,2);
    DECLARE total_prescription_fee DECIMAL(8,2);
    DECLARE total_test_fee DECIMAL (8,2);

    SELECT appointment_charge INTO appointment_fee
    FROM Appointments
    WHERE Appointments.id = appointmentID
END $$






DELIMITER ;