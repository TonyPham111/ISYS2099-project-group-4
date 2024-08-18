REATE PROCEDURE AddNewPatients(
    id INT,                               -- Parameter for the patient ID
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
    DECLARE current_index INT DEFAULT 1;                   -- Variable to keep track of the current index in the allergy ID string
    DECLARE current_string_index VARCHAR(1000) DEFAULT ''; -- Variable to accumulate the current allergy ID being processed

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the Patients table with the provided parameters
    INSERT INTO Patients (id, ssn, full_name, birth_date, phone_number, email, home_address, gender)
    VALUES (id, para_ssn, para_full_name, para_birth_date, para_phone_number, para_email, para_home_address, para_gender);

    -- Begin a loop to process the comma-separated allergy IDs in para_allergy_index_string
    WHILE current_index <= LENGTH(para_allergy_index_string) DO
        -- Check if the current character is a comma, indicating the end of an allergy ID
        IF SUBSTRING(para_allergy_index_string, current_index, 1) = ',' THEN
            -- Insert the processed allergy ID into the PatientAllergy table
            INSERT INTO PatientAllergy (allergy_id, patient_id, record_date)
            VALUES (CAST(current_string_index AS UNSIGNED), id, CURDATE());

            -- Reset the accumulated string index for the next iteration
            SET current_string_index = '';
        ELSE
            -- If not a comma, continue accumulating the allergy ID
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(para_allergy_index_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- After exiting the loop, handle the last allergy ID in the string (if there is any remaining)
    IF current_string_index != '' THEN
        INSERT INTO PatientAllergy (allergy_id, patient_id, record_date)
        VALUES (CAST(current_string_index AS UNSIGNED), id, CURDATE());
    END IF;

    -- Commit the transaction to save all changes
    COMMIT;
END;



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



CREATE PROCEDURE AddNewAppointment(
    para_doctor_id INT,                        -- Parameter for the doctor ID who will handle the appointment
    para_patient_id INT,                       -- Parameter for the patient ID who is scheduling the appointment
    para_appointment_id INT,                   -- Parameter for the appointment ID
    para_schedule_id INT,                      -- Parameter for the schedule ID corresponding to the appointment
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
    DECLARE appointment_duration INT;             -- Variable to store the duration of the appointment in minutes
    DECLARE appointment_charge DECIMAL(6,2);      -- Variable to store the charge for the appointment

    -- Error handling: In case of any SQL exception, rollback the transaction and return an error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- Rollback any changes made during the transaction
        SELECT 'An error occurred. Transaction rolled back.' AS ErrorMessage;  -- Return an error message
    END;

    -- Calculate the duration of the appointment in minutes
    SET appointment_duration = TIME_TO_SEC(TIMEDIFF(para_end_time, para_start_time)) / 60;

    -- Calculate the charge for the appointment based on the duration (assuming appointment_charge is predefined)
    SET appointment_charge = appointment_charge * appointment_duration / 30;

    -- Start a transaction to ensure all operations succeed or fail together
    START TRANSACTION;

        -- Insert the appointment schedule into the Staff_Schedule table
        INSERT INTO Staff_Schedule (id, staff_id, schedule_date, start_time, end_time, note)
        VALUES (
            para_schedule_id,                  -- The schedule ID for the staff schedule
            para_doctor_id,                    -- The doctor ID linked to the schedule
            para_appointment_date,             -- The date of the appointment
            para_start_time,                   -- The start time of the appointment
            para_end_time,                     -- The end time of the appointment
            para_note                          -- Any notes related to the schedule
        );

        -- Insert the appointment details into the Appointments table
        INSERT INTO Appointments (
            id,                                -- The appointment ID
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
            para_appointment_id,               -- The provided appointment ID
            para_patient_id,                   -- The provided patient ID
            para_doctor_id,                    -- The provided doctor ID
            para_appointment_purpose,          -- The provided appointment purpose
            para_appointment_date,             -- The provided appointment date
            para_start_time,                   -- The provided start time
            para_end_time,                     -- The provided end time
            appointment_charge,                -- The calculated appointment charge
            'Active',                          -- Setting the appointment status as 'Active'
            para_schedule_id,                  -- The provided schedule ID
            para_appointment_notes_document_id -- The provided document ID for appointment notes
        );

    -- Commit the transaction to save all changes
    COMMIT;
END;



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