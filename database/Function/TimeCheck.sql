-- DELIMITER $$
DROP FUNCTION TimeFormatCheck; -- $$

-- Create a function named TimeFormatCheck
CREATE FUNCTION TimeFormatCheck(
    para_start_time TIME,  -- Input parameter: Start time to be checked
    para_end_time TIME     -- Input parameter: End time to be checked
)
RETURNS INT               -- The function returns an integer value (0 if the format is correct, error if not)
DETERMINISTIC             -- Indicates that the function will always produce the same result for the same input parameters
SQL SECURITY DEFINER      -- Specifies that the function executes with the privileges of the user who defined it
BEGIN
    -- Check if the start time and end time are in a valid format:
    -- 1. The minutes part of both times should be multiples of 30 (e.g., 00 or 30).
    -- 2. The end time should be later than the start time.
    IF MOD(MINUTE(para_start_time), 30) <> 0 
       OR MOD(MINUTE(para_end_time), 30) <> 0 
       OR para_end_time < para_start_time THEN
       
        -- If any of the above conditions are not met, trigger an error with a custom message
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect time format. Please check again';
    END IF;

    -- If all checks pass, return 0 indicating success
    RETURN 0;
END; -- $$

-- Grant execution privilege for the TimeFormatCheck function to the 'FrontDesk' role
GRANT EXECUTE ON FUNCTION hospital_management_system.TimeFormatCheck TO 'FrontDesk'@'host';

-- Drop the function ScheduleCheck if it already exists
DROP FUNCTION IF EXISTS ScheduleCheck;

-- Create a function named ScheduleCheck
CREATE FUNCTION ScheduleCheck (
    para_staff_id INT,          -- Input parameter: Staff ID to be checked
    para_schedule_date DATE,    -- Input parameter: The date for the schedule
    para_start_time TIME,       -- Input parameter: The start time of the schedule
    para_end_time TIME          -- Input parameter: The end time of the schedule
)
RETURNS INT                    -- The function returns an integer value (0 if no clash, error if clash)
READS SQL DATA                 -- Indicates that the function only reads data without modifying it
SQL SECURITY DEFINER           -- Specifies that the function executes with the privileges of the user who defined it
BEGIN
    DECLARE schedule_count INT;            -- Variable to store the number of existing schedules
    DECLARE timeFormatCheckResult INT;     -- Variable to store the result of the time format check
    DECLARE staffCheckResult INT;          -- Variable to store the result of the staff existence check
    
    -- Check if the provided time format is correct by calling TimeFormatCheck function
    SELECT TimeFormatCheck(para_start_time, para_end_time) INTO timeFormatCheckResult;
    
    -- Check if the staff exists by calling a hypothetical CheckStaffExists function
    SELECT CheckStaffExists(para_staff_id) INTO staffCheckResult;

    -- Check if there is already a schedule for the given staff on the same date
    SELECT COUNT(*) INTO schedule_count
    FROM Staff_Schedule
    WHERE schedule_date = para_schedule_date
    GROUP BY staff_id;

    -- If there is an existing schedule (i.e., schedule_count = 1), trigger an error
    IF schedule_count = 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This staff already has a schedule';
    END IF;

    -- If no existing schedule is found, return 0 indicating success
    RETURN 0;
END; -- $$

-- Grant execution privilege for the ScheduleCheck function to the 'FrontDesk' role
GRANT EXECUTE ON FUNCTION hospital_management_system.ScheduleCheck TO 'FrontDesk'@'host';

-- Drop the function CheckIfBookingTimeOutsideSchedule if it already exists
DROP FUNCTION IF EXISTS CheckIfBookingTimeOutsideSchedule; -- $$

-- Create a function named CheckIfBookingTimeOutsideSchedule
CREATE FUNCTION CheckIfBookingTimeOutsideSchedule(
    para_doctor_id INT,          -- Input parameter: Doctor ID to be checked
    para_appointment_date DATE,  -- Input parameter: The date of the appointment
    para_start_time TIME,        -- Input parameter: The start time of the appointment
    para_end_time TIME           -- Input parameter: The end time of the appointment
)
RETURNS INT                     -- The function returns an integer value (1 if booking is valid, 0 if outside schedule)
READS SQL DATA                  -- Indicates that the function only reads data without modifying it
SQL SECURITY DEFINER            -- Specifies that the function executes with the privileges of the user who defined it
BEGIN
    DECLARE shift_start TIME;             -- Variable to store the start time of the doctor's shift
    DECLARE shift_end TIME;               -- Variable to store the end time of the doctor's shift
    DECLARE timeFormatCheckResult INT;    -- Variable to store the result of the time format check
    
    -- Check if the provided time format is correct by calling TimeFormatCheck function
    SELECT TimeFormatCheck(para_start_time, para_end_time) INTO timeFormatCheckResult;
    
    -- Retrieve the doctor's shift start and end times for the given appointment date
    SELECT Staff_Schedule.start_time, Staff_Schedule.end_time
    INTO shift_start, shift_end
    FROM Staff_Schedule
    WHERE staff_id = para_doctor_id AND schedule_date = para_appointment_date
    FOR UPDATE;

    -- Check if the appointment time is within the doctor's schedule
    -- Return 0 if the appointment time is outside the doctor's schedule
    IF
        (para_start_time > shift_start
            AND
        para_start_time > shift_end
        )
            OR
        (para_start_time < shift_start
            AND
        para_end_time > shift_start
        )
    THEN 
        RETURN 0;
    ELSE
        -- Return 1 if the appointment time is within the doctor's schedule
        RETURN 1;
    END IF;
END; -- $$

-- Grant execution privilege for the CheckIfBookingTimeOutsideSchedule function to the 'FrontDesk' role
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckIfBookingTimeOutsideSchedule TO 'FrontDesk'@'host';

-- Drop the function CheckAppointmentClash if it already exists
DROP FUNCTION IF EXISTS CheckAppointmentClash; -- $$

-- Create a function named CheckAppointmentClash
CREATE FUNCTION CheckAppointmentClash(
    para_doctor_id INT,          -- Input parameter: Doctor ID to be checked
    para_appointment_date DATE,  -- Input parameter: The date of the appointment
    para_start_time TIME,        -- Input parameter: The start time of the appointment
    para_end_time TIME           -- Input parameter: The end time of the appointment
)
RETURNS INT                     -- The function returns an integer value (number of appointment clashes)
READS SQL DATA                  -- Indicates that the function only reads data without modifying it
SQL SECURITY DEFINER            -- Specifies that the function executes with the privileges of the user who defined it
BEGIN
    DECLARE clash_count INT;            -- Variable to store the count of appointment clashes
    DECLARE timeFormatCheckResult INT;  -- Variable to store the result of the time format check
    
    -- Check if the provided time format is correct by calling TimeFormatCheck function
    SELECT TimeFormatCheck(para_start_time, para_end_time) INTO timeFormatCheckResult;

    -- Check for any appointment clashes for the given doctor on the specified date and time range
    SELECT COUNT(*) INTO clash_count
    FROM Appointments
    WHERE
        Appointments.doctor_id = para_doctor_id
            AND
        Appointments.appointment_date = para_appointment_date
            AND
        (
            Appointments.start_time > para_start_time AND Appointments.start_time < para_end_time
                OR
            Appointments.start_time <= para_start_time AND Appointments.end_time > para_start_time
        )
            AND Appointments.appointment_status = 'Active'
    GROUP BY Appointments.doctor_id;

    -- Return the count of appointment clashes
    RETURN clash_count;
END; -- $$

-- Grant execution privilege for the CheckAppointmentClash function to the 'FrontDesk' role
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckAppointmentClash TO 'FrontDesk'@'host';

-- DELIMITER ;



