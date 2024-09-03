DELIMITER $$

DROP PROCEDURE IF EXISTS TimeFormatCheck$$
CREATE FUNCTION TimeFormatCheck(
    para_start_time TIME,  -- Input parameter: Start time to be checked
    para_end_time TIME     -- Input parameter: End time to be checked
) RETURNS int
    DETERMINISTIC
BEGIN
    -- Check if the start time and end time are in a valid format:
    -- 1. The minutes part of both times should be multiples of 30 (e.g., 00 or 30).
    -- 2. The end time should be later than the start time.
    IF MOD(MINUTE(para_start_time), 30) <> 0 
       OR MOD(MINUTE(para_end_time), 30) <> 0 
       OR para_end_time < para_start_time THEN
       
        -- If any of the above conditions are met, trigger an error with a custom message
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect time format. Please check again';
    END IF;
    
    IF @parent_proc IS NULL THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;

    -- If all checks pass, return 1 indicating success
    RETURN 1;
END$$

DROP PROCEDURE IF EXISTS ScheduleCheck$$
CREATE FUNCTION ScheduleCheck(
    para_staff_id INT,          -- Input parameter: Staff ID to be checked
    para_schedule_date DATE,    -- Input parameter: The date for the schedule
    para_start_time TIME,       -- Input parameter: The start time of the schedule
    para_end_time TIME          -- Input parameter: The end time of the schedule
) RETURNS int
    READS SQL DATA
BEGIN
    DECLARE schedule_count INT;            -- Variable to store the number of existing schedules
    DECLARE timeFormatCheckResult INT;     -- Variable to store the result of the time format check
    DECLARE staffCheckResult INT;          -- Variable to store the result of the staff existence check
    
	IF @parent_proc IS NULL THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    
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
END$$

DROP PROCEDURE IF EXISTS CheckIfBookingTimeOutsideSchedule$$
CREATE FUNCTION CheckIfBookingTimeOutsideSchedule(
    para_doctor_id INT,          -- Input parameter: Doctor ID to be checked
    para_appointment_date DATE,  -- Input parameter: The date of the appointment
    para_start_time TIME,        -- Input parameter: The start time of the appointment
    para_end_time TIME           -- Input parameter: The end time of the appointment
) RETURNS int
    READS SQL DATA
BEGIN
    DECLARE shift_start TIME;             -- Variable to store the start time of the doctor's shift
    DECLARE shift_end TIME;               -- Variable to store the end time of the doctor's shift
    DECLARE timeFormatCheckResult INT;    -- Variable to store the result of the time format check
    IF @parent_proc IS NULL THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the provided time format is correct by calling TimeFormatCheck function
    SELECT TimeFormatCheck(para_start_time, para_end_time) INTO timeFormatCheckResult;
    
    -- Retrieve the doctor's shift start and end times for the given appointment date
    SELECT Staff_Schedule.start_time, Staff_Schedule.end_time
    INTO shift_start, shift_end
    FROM Staff_Schedule
    WHERE staff_id = para_doctor_id AND schedule_date = para_appointment_date LIMIT 1
    FOR UPDATE;
    

    -- Check if the appointment time is within the doctor's schedule
    -- Return 0 if the appointment time is outside the doctor's schedule
    IF
		shift_start IS NULL 
			OR
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
END$$

DROP PROCEDURE IF EXISTS CheckAppointmentClash$$
CREATE FUNCTION CheckAppointmentClash(
    para_doctor_id INT,          -- Input parameter: Doctor ID to be checked
    para_appointment_date DATE,  -- Input parameter: The date of the appointment
    para_start_time TIME,        -- Input parameter: The start time of the appointment
    para_end_time TIME           -- Input parameter: The end time of the appointment
) RETURNS int
    READS SQL DATA
BEGIN
    DECLARE clash_count INT;            -- Variable to store the count of appointment clashes
    DECLARE timeFormatCheckResult INT;  -- Variable to store the result of the time format check
    IF @parent_proc IS NULL THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
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
END$$

DELIMITER ;
