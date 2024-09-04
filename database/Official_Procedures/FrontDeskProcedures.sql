DELIMITER $$
DROP PROCEDURE IF EXISTS AddNewPatient$$
CREATE PROCEDURE AddNewPatient(
    para_full_name VARCHAR(50),           -- Parameter for the full name of the patient
    para_gender CHAR(1),                  -- Parameter for the patient's gender (e.g., 'M' or 'F')
    para_birth_date DATE,                 -- Parameter for the patient's birth date
    para_phone_number VARCHAR(15),        -- Parameter for the patient's phone number
    para_home_address VARCHAR(155)        -- Parameter for the patient's home address
)
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
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

    -- Insert a new record into the Patients table with the provided parameters
    INSERT INTO Patients (full_name, birth_date, phone_number, home_address, gender)
    VALUES (para_full_name, para_birth_date, para_phone_number, para_home_address, para_gender);
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewPatient TO 'FrontDesk'@'%'$$

DROP PROCEDURE IF EXISTS UpdatePatient$$
CREATE PROCEDURE UpdatePatient(
    patient_id INT,
    para_full_name VARCHAR(50),           -- Parameter for the full name of the patient
    para_gender CHAR(1),                  -- Parameter for the patient's gender (e.g., 'M' or 'F')
    para_birth_date DATE,                 -- Parameter for the patient's birth date
    para_phone_number VARCHAR(15),        -- Parameter for the patient's phone number
    para_home_address VARCHAR(155)        -- Parameter for the patient's home address
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
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

    -- Update the patient record with the provided parameters
    UPDATE Patients SET
        full_name = para_full_name,
        gender = para_gender,
        birth_date = para_birth_date,
        phone_number = para_phone_number,
        home_address = para_home_address
    WHERE id = patient_id;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.UpdatePatient TO 'FrontDesk'@'%'$$


DROP PROCEDURE IF EXISTS GetAllAppointments$$
CREATE PROCEDURE GetAllAppointments()
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        DECLARE returned_message TEXT;

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE,
            returned_message = MESSAGE_TEXT;
		SELECT returned_message;

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

    -- Select all appointments
    SELECT 
		Patients.full_name,
        Staff.full_name,
        Appointments.id,
        Appointments.appointment_purpose,
        DATE_FORMAT(appointment_date, '%d/%m/%Y' ) AS appointment_date,
        Appointments.start_time,
        Appointments.end_time,
        Appointments.appointment_notes_document_id
    FROM Patients
    INNER JOIN Appointments
    ON Patients.id = Appointments.patient_id
    INNER JOIN Staff
    ON Staff.id = Appointments.doctor_id;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllAppointments TO 'FrontDesk'@'%'$$


DROP PROCEDURE IF EXISTS CheckAvailability$$
CREATE PROCEDURE CheckAvailability(
    booked_date DATE,                      -- Parameter for the date when the booking is intended
    booked_start_time TIME,                -- Parameter for the start time of the booking
    booked_end_time TIME,                  -- Parameter for the end time of the booking
    department_id INT                      -- Parameter for the department ID
)
SQL SECURITY DEFINER
BEGIN

    -- Declare a variable to store the department ID
    DECLARE para_department_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
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

    -- Retrieve the department ID based on the provided department name
    SELECT id INTO para_department_id
    FROM Departments
    WHERE Departments.id = department_id
    LIMIT 1;

    -- Check staff availability
    SELECT Staff.id,
           Staff.full_name,
           CASE
               WHEN CheckIfBookingTimeOutsideSchedule(Staff.id, booked_date,
                                                      booked_start_time, booked_end_time) = 0 THEN 'Unavailable'
               WHEN CheckAppointmentClash(Staff.id, booked_date,
                                          booked_start_time, booked_end_time) <> 0 THEN 'Unavailable'
               ELSE 'Available'
           END AS 'Availability'
    FROM Staff
    WHERE Staff.department_id = para_department_id;
    SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CheckAvailability TO 'FrontDesk'@'%'$$


DROP PROCEDURE IF EXISTS AddNewAppointment$$
CREATE PROCEDURE AddNewAppointment(
    para_department_id INT,
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
    DECLARE checked_schedule_id INT;
    DECLARE appointment_duration INT;             -- Variable to store the duration of the appointment in minutes
    DECLARE para_appointment_charge DECIMAL(6,2) DEFAULT 400.5;      -- Variable to store the charge for the appointment
    DECLARE clash_count INT;
    DECLARE appointment_schedule_check INT;

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		DECLARE returned_message TEXT;
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE,
            returned_message = MESSAGE_TEXT;
		
        SELECT returned_message;
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
	SET @parent_proc = NULL;
    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewAppointment TO 'FrontDesk'@'%'$$


DROP PROCEDURE IF EXISTS CancelAnAppointment$$
CREATE PROCEDURE CancelAnAppointment(appointment_id INT)
SQL SECURITY DEFINER
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        ROLLBACK;

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
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
    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Update the appointment status to 'Cancelled' in the Appointments table
    UPDATE Appointments
    SET appointment_status = 'Cancelled'
    WHERE Appointments.id = appointment_id;

    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.CancelAnAppointment TO 'FrontDesk'@'%'$$




DELIMITER ;