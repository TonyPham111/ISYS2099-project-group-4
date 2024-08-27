DELIMITER $$

DROP PROCEDURE IF EXISTS AddNewPatient; -- $$ 
CREATE PROCEDURE AddNewPatient(
    para_ssn INT,                         -- Parameter for the patient's SSN (Social Security Number)
    para_full_name VARCHAR(50),           -- Parameter for the full name of the patient
    para_gender CHAR(1),                  -- Parameter for the patient's gender (e.g., 'M' or 'F')
    para_birth_date DATE,                 -- Parameter for the patient's birth date
    para_phone_number VARCHAR(15),        -- Parameter for the patient's phone number
    para_email VARCHAR(50),               -- Parameter for the patient's email address
    para_home_address VARCHAR(155)       -- Parameter for the patient's home address
)
SQL SECURITY DEFINER
BEGIN
    -- Insert a new record into the Patients table with the provided parameters
    INSERT INTO Patients (ssn, full_name, birth_date, phone_number, email, home_address, gender)
    VALUES (para_ssn, para_full_name, para_birth_date, para_phone_number, para_email, para_home_address, para_gender);
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewPatient TO 'FrontDesk'@'host';

DROP PROCEDURE IF EXISTS CheckAvailability; -- $$
CREATE PROCEDURE CheckAvailability(
    booked_date DATE,                      -- Parameter for the date when the booking is intended
    booked_start_time TIME,                -- Parameter for the start time of the booking
    booked_end_time TIME,                  -- Parameter for the end time of the booking
    department_id VARCHAR(50)            -- Parameter for the name of the department
)
SQL SECURITY DEFINER
BEGIN
    -- Declare a variable to store the department ID
    DECLARE para_department_id INT;
    -- Retrieve the department ID based on the provided department name
    SELECT id INTO para_department_id
    FROM Departments
    WHERE Departments.id = department_id
    LIMIT 1;

    SELECT Staff.id,
           Staff.full_name,
            CASE
                WHEN CheckIfBookingTimeOutsideSchedule(Staff.id, booked_date,
                                                       booked_start_time, booked_end_time) = 0 THEN 'Occupied'
                WHEN CheckAppointmentClash(Staff.id, booked_date,
                                      booked_start_time, booked_end_time) <> 0 THEN 'Occupied'
                ELSE 'Available'
            END AS 'Availability'
    FROM Staff
        WHERE Staff.department_id = para_department_id;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CheckAvailability TO 'FrontDesk'@'host'; -- $$


DROP PROCEDURE IF EXISTS AddNewAppointment; -- $$
CREATE PROCEDURE AddNewAppointment(
    para_doctor_id INT,                        -- Parameter for the doctor ID who will handle the appointment
    para_patient_id INT,                       -- Parameter for the patient ID who is scheduling the appointment
    para_appointment_purpose TEXT,             -- Parameter for the purpose of the appointment
    para_appointment_date DATE,                -- Parameter for the date of the appointment
    para_start_time TIME,                      -- Parameter for the start time of the appointment
    para_end_time TIME,                        -- Parameter for the end time of the appointment
    para_appointment_notes_document_id VARCHAR(24) -- Parameter for the document ID of appointment notes
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE  checked_schedule_id INT;
    DECLARE error_message TEXT; -- Variable to store the error message
    DECLARE appointment_duration INT;             -- Variable to store the duration of the appointment in minutes
    DECLARE para_appointment_charge DECIMAL(6,2) DEFAULT 400.5;      -- Variable to store the charge for the appointment
    DECLARE clash_count INT;
    DECLARE appointment_schedule_check INT;

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            ROLLBACK;
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;

	-- Check if the id exists and belongs to a doctor
	IF NOT CheckDoctorExists(para_doctor_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect doctor id. Please check your input';
    END IF;

	-- Raise an exception if no patient is found
    IF NOT CheckPatientExists(para_patient_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot find patient. Please try again';
    END IF;

    -- Check if the doctor has a schedule on that date
    SELECT id INTO checked_schedule_id
              FROM Staff_Schedule
              WHERE schedule_date = para_appointment_date;

    IF checked_schedule_id IS NULL THEN
         SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No schedule has been planned for the doctor on that date. Please try again';
    end if;

    -- Check if the input time is within the doctor's schedule
    SELECT CheckIfBookingTimeOutsideSchedule(para_doctor_id, para_appointment_date,
                                             para_start_time, para_end_time) INTO appointment_schedule_check;
    IF appointment_schedule_check = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Appointment out of schedule range. Please try again';
    end if;

    -- Check if there is any booking clash
    SELECT CheckAppointmentClash(para_doctor_id, para_appointment_date,
                                 para_start_time, para_end_time) INTO clash_count;
    IF clash_count <> 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Time slot has already been reserved. Please try again';
    end if;

    -- Calculate the duration of the appointment in minutes
    SET appointment_duration = TIME_TO_SEC(TIMEDIFF(para_end_time, para_start_time)) / 60;
    -- Calculate the charge for the appointment based on the duration (assuming appointment_charge is predefined)
    SET para_appointment_charge = para_appointment_charge * appointment_duration / 30;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
        -- Insert the appointment details into the Appointments table
        INSERT INTO Appointments (
            patient_id,                        -- The patient ID linked to the appointment
            doctor_id,                         -- The doctor ID linked to the appointment
            appointment_purpose,               -- The purpose of the appointment
            appointment_date,                  -- The date of the appointment
            start_time,                        -- The start time of the appointment
            end_time,                          -- The end time of the appointment
            appointment_charge,                -- The calculated charge for the appointment
            appointment_status,                -- The status of the appointment (e.g., 'Active')
            appointment_notes_document_id      -- The document ID for any appointment notes
        )
        VALUES (
            para_patient_id,                   -- The provided patient ID
            para_doctor_id,                    -- The provided doctor ID
            para_appointment_purpose,          -- The provided appointment purpose
            para_appointment_date,             -- The provided appointment date
            para_start_time,                   -- The provided start time
            para_end_time,                     -- The provided end time
            para_appointment_charge,           -- The calculated appointment charge
            'Active',                          -- Setting the appointment status as 'Active'
            para_appointment_notes_document_id -- The provided document ID for appointment notes
        );

    -- Commit the transaction to save all changes
    COMMIT;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewAppointment TO 'FrontDesk'@'host'; -- $$



DROP PROCEDURE IF EXISTS CancelAnAppointment; -- $$
CREATE PROCEDURE CancelAnAppointment(appointment_id INT)  -- Procedure to cancel an appointment by its ID
SQL SECURITY DEFINER
BEGIN
    -- Declare a variable to store the schedule ID linked to the appointment
    DECLARE schedule_id INT;

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Update the appointment status to 'Cancelled' in the Appointments table
    UPDATE Appointments
    SET appointment_status = 'Cancelled'
    WHERE Appointments.id = appointment_id;

    -- Commit the transaction to save all changes
    COMMIT;
END; -- $$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CancelAnAppointment TO 'FrontDesk'@'host'; -- $$



DELIMITER ;
