CREATE PROCEDURE AddNewPatient(                            -- Parameter for the patient ID
    para_ssn INT,                         -- Parameter for the patient's SSN (Social Security Number)
    para_full_name VARCHAR(50),           -- Parameter for the full name of the patient
    para_gender CHAR(1),                  -- Parameter for the patient's gender (e.g., 'M' or 'F')
    para_birth_date DATE,                 -- Parameter for the patient's birth date
    para_phone_number VARCHAR(15),        -- Parameter for the patient's phone number
    para_email VARCHAR(50),               -- Parameter for the patient's email address
    para_home_address VARCHAR(155),       -- Parameter for the patient's home address
    para_allergy_index_string TEXT        -- Parameter for a comma-separated string of allergy IDs
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE new_patient_id TEXT;
    DECLARE error_message TEXT;
    DECLARE error_code INT;
    DECLARE para_allergy_id INT;
    DECLARE current_index INT DEFAULT 1;                   -- Variable to keep track of the current index in the allergy ID string
    DECLARE current_string_index VARCHAR(1000) DEFAULT ''; -- Variable to accumulate the current allergy ID being processed

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            ROLLBACK;  -- Rollback any changes made during the transaction
            SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
        END;
    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Patients table with the provided parameters
    INSERT INTO Patients (ssn, full_name, birth_date, phone_number, email, home_address, gender)
    VALUES (para_ssn, para_full_name, para_birth_date, para_phone_number, para_email, para_home_address, para_gender);
    SELECT LAST_INSERT_ID() INTO new_patient_id;

    -- Begin a loop to process the comma-separated allergy IDs in para_allergy_index_string
    WHILE current_index <= LENGTH(para_allergy_index_string) DO
        -- Check if the current character is a comma, indicating the end of an allergy ID
        IF SUBSTRING(para_allergy_index_string, current_index, 1) = ',' THEN
            SELECT id INTO para_allergy_id FROM Allergies WHERE allergy_name = current_string_index LIMIT 1;
            -- Raise an exception in case of incorrectly input allergy name
            IF para_allergy_id IS NULL THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Cannot find allergy. Please check your input';
            END IF;

            SELECT para_allergy_id;
            -- Insert the processed allergy ID into the PatientAllergy table
            INSERT INTO PatientAllergy (allergy_id, patient_id, record_date)
            VALUES (para_allergy_id, new_patient_id, CURDATE());

            -- Reset the accumulated string index for the next iteration
            SET current_string_index = '';
        ELSE
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(para_allergy_index_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last allergy ID in the string (if there is any remaining)
    SELECT id INTO para_allergy_id FROM Allergies WHERE allergy_name = current_string_index LIMIT 1;
    IF para_allergy_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot find allergy. Please check your input';
    END IF;
    -- Insert the processed allergy ID into the PatientAllergy table
    INSERT INTO PatientAllergy (allergy_id, patient_id, record_date)
    VALUES (para_allergy_id, new_patient_id, CURDATE());

    -- Commit the transaction to save all changes
    COMMIT;
END;
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewPatient TO 'FrontDesk'@'host';




CREATE PROCEDURE CheckAvailability(
    booked_date DATE,                      -- Parameter for the date when the booking is intended
    booked_start_time TIME,                -- Parameter for the start time of the booking
    booked_end_time TIME,                  -- Parameter for the end time of the booking
    department_name VARCHAR(50)            -- Parameter for the name of the department
)
SQL SECURITY DEFINER
BEGIN
    -- Declare a variable to store the department ID
    DECLARE para_department_id INT;

    -- Retrieve the department ID based on the provided department name
    SELECT id INTO para_department_id
    FROM Departments
    WHERE Departments.department_name = department_name
    LIMIT 1;

    -- Common Table Expression (CTE) to identify staff who are unavailable during the requested time slot
    WITH Unavailable_Staff AS (
        SELECT
            staff_id                             -- Selecting the staff ID of unavailable staff
        FROM
            Staff_Schedule                        -- Checking the Staff_Schedule table for conflicts
        WHERE
            schedule_date = booked_date          -- Matching the booking date with the schedule date
        AND
            (
                -- Checking if the start time of the existing schedule conflicts with the requested booking time
                (start_time > booked_start_time AND start_time < booked_end_time)
            OR
                -- Checking if the end time of the existing schedule conflicts with the requested booking time
                (start_time <= booked_start_time AND end_time > booked_start_time)
            )
    )

    -- Selecting the staff in the specified department and their availability
    SELECT
        Staff.id,                                -- The staff ID
        Staff.full_name,                         -- The full name of the staff member
        CASE
            -- If the staff ID is not in the list of unavailable staff, they are 'Available'
            WHEN id NOT IN (
                SELECT staff_id FROM Unavailable_Staff
            ) THEN 'Available'
            -- Otherwise, they are 'Occupied'
            ELSE 'Occupied'
        END AS availability                      -- The availability status of the staff member

    FROM
        Staff                                    -- Querying the Staff table to get staff details
    WHERE
        Staff.job_id = 2                         -- Filtering for staff who are doctors (assuming job_id = 2 represents doctors)
    AND
        Staff.department_id = para_department_id; -- Filtering for staff in the specified department

END;
GRANT EXECUTE ON PROCEDURE hospital_management_system.CheckAvailability TO 'FrontDesk'@'host';


CREATE PROCEDURE AddNewAppointment(
    para_doctor_id INT,                        -- Parameter for the doctor ID who will handle the appointment
    para_patient_name VARCHAR(50),                       -- Parameter for the patient ID who is scheduling the appointment
    para_appointment_purpose TEXT,             -- Parameter for the purpose of the appointment
    para_appointment_date DATE,                -- Parameter for the date of the appointment
    para_start_time TIME,                      -- Parameter for the start time of the appointment
    para_end_time TIME,                        -- Parameter for the end time of the appointment
    para_note TEXT,                            -- Parameter for any notes related to the appointment's schedule
    para_appointment_notes_document_id VARCHAR(24) -- Parameter for the document ID of appointment notes
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE new_schedule_id INT; -- Variable to store the newly generated schedule id
    DECLARE error_message TEXT; -- Variable to store the error message
    DECLARE business_start TIME DEFAULT '09:00:00'; -- Variable to store the start of the business hour
    DECLARE business_end TIME DEFAULT '17:00:00'; -- Variable to store the end of the business hour
    DECLARE para_patient_id INT;
    DECLARE appointment_duration INT;             -- Variable to store the duration of the appointment in minutes
    DECLARE para_appointment_charge DECIMAL(6,2) DEFAULT 400.5;      -- Variable to store the charge for the appointment

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS CONDITION 1
                error_message = MESSAGE_TEXT;
            ROLLBACK;
            SELECT error_message AS ErrorMessage;  -- Return an error message
        END;

    -- Find the id of the patient based on their name
    SELECT
        Patients.id
    INTO
        para_patient_id
    FROM
        Patients
    WHERE full_name = para_patient_name;

    -- Raise an exception if no patient is found
    IF para_patient_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot find patient. Please try again';
    END IF;

    -- Check if the input time is within business hour. Raise an exception if it isn't
    IF
        para_start_time < business_start
            OR
        para_start_time > business_end
            OR
        para_end_time < business_start
            OR
        para_end_time > business_end THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Outside of business hour. Please choose other times';
    END IF;

    -- Calculate the duration of the appointment in minutes
    SET appointment_duration = TIME_TO_SEC(TIMEDIFF(para_end_time, para_start_time)) / 60;

    -- Calculate the charge for the appointment based on the duration (assuming appointment_charge is predefined)
    SET para_appointment_charge = para_appointment_charge * appointment_duration / 30;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;
        -- Insert the appointment schedule into the Staff_Schedule table
        INSERT INTO Staff_Schedule (staff_id, schedule_date, start_time, end_time, note)
        VALUES (
            para_doctor_id,                    -- The doctor ID linked to the schedule
            para_appointment_date,             -- The date of the appointment
            para_start_time,                   -- The start time of the appointment
            para_end_time,                     -- The end time of the appointment
            para_note                          -- Any notes related to the schedule
        );
        SELECT LAST_INSERT_ID() INTO new_schedule_id;

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
            schedule_id,                       -- The schedule ID linked to the appointment
            appointment_notes_document_id      -- The document ID for any appointment notes
        )
        VALUES (
            para_patient_id,                   -- The provided patient ID
            para_doctor_id,                    -- The provided doctor ID
            para_appointment_purpose,          -- The provided appointment purpose
            para_appointment_date,             -- The provided appointment date
            para_start_time,                   -- The provided start time
            para_end_time,                     -- The provided end time
            para_appointment_charge,                -- The calculated appointment charge
            'Active',                          -- Setting the appointment status as 'Active'
            new_schedule_id,                  -- The provided schedule ID
            para_appointment_notes_document_id -- The provided document ID for appointment notes
        );

    -- Commit the transaction to save all changes
    COMMIT;
END;
GRANT EXECUTE ON PROCEDURE hospital_management_system.AddNewAppointment TO 'FrontDesk'@'host';




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

    -- Retrieve the schedule ID associated with the appointment
    SELECT Appointments.schedule_id INTO schedule_id
    FROM Appointments
    WHERE Appointments.id = appointment_id
    LIMIT 1;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Update the appointment status to 'Cancelled' in the Appointments table
    UPDATE Appointments
    SET appointment_status = 'Cancelled'
    WHERE Appointments.id = appointment_id;

    -- Delete the corresponding schedule from the Staff_Schedule table using the retrieved schedule ID
    DELETE FROM Staff_Schedule
    WHERE Staff_Schedule.id = schedule_id;

    -- Commit the transaction to save all changes
    COMMIT;
END;
GRANT EXECUTE ON PROCEDURE hospital_management_system.CancelAnAppointment TO 'FrontDesk'@'host';



CREATE PROCEDURE RescheduleAnAppointment(
    appointment_id INT,          -- Parameter for the ID of the appointment to be rescheduled
    appointment_date DATE,       -- Parameter for the new date of the appointment
    start_time TIME,             -- Parameter for the new start time of the appointment
    end_time TIME                -- Parameter for the new end time of the appointment
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE schedule_id INT;                 -- Variable to store the schedule ID associated with the appointment
    DECLARE appointment_duration INT;        -- Variable to store the duration of the appointment in minutes
    DECLARE appointment_charge DEC(6,2);     -- Variable to store the updated charge for the appointment

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Calculate the duration of the appointment in minutes
    SET appointment_duration = TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 60;

    -- Calculate the charge for the appointment based on the new duration (assuming appointment_charge is predefined)
    SET appointment_charge = appointment_charge * appointment_duration / 30;

    -- Retrieve the schedule ID associated with the appointment
    SELECT Appointments.schedule_id INTO schedule_id
    FROM Appointments
    WHERE Appointments.id = appointment_id
    LIMIT 1;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

        -- Update the appointment details in the Appointments table
        UPDATE Appointments
        SET appointment_date = appointment_date,     -- Update the appointment date
            start_time = start_time,                 -- Update the start time
            end_time = end_time                      -- Update the end time
        WHERE id = appointment_id;                   -- Specify the appointment to update by its ID

        -- Update the schedule details in the Staff_Schedule table
        UPDATE Staff_Schedule
        SET schedule_date = appointment_date,        -- Update the schedule date
            start_time = start_time,                 -- Update the start time
            end_time = end_time                      -- Update the end time
        WHERE id = schedule_id;                      -- Specify the schedule to update by its ID

    -- Commit the transaction to save all changes
    COMMIT;
END;
GRANT EXECUTE ON PROCEDURE hospital_management_system.RescheduleAnAppointment TO 'FrontDesk'@'host';