CREATE FUNCTION CheckBookingTime(
    para_doctor_id INT,
    para_appointment_date DATE,                -- Parameter for the date of the appointment
    para_start_time TIME,                      -- Parameter for the start time of the appointment
    para_end_time TIME
)
RETURNS INT
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
    DECLARE clash_count INT; -- Count the number of timetable clashes and put it here
    DECLARE shift_start TIME; -- Variable to store the start of the business hour
    DECLARE shift_end TIME; -- Variable to store the end of the business hour



    -- Check if the input time is in correct format
        IF MOD(MINUTE(para_start_time), 30) <> 0
               OR MOD(MINUTE(para_end_time), 30) <> 0
               OR para_end_time < para_start_time THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Incorrect time format. Please check again';
        end if;
    -- Check if the input time is within the doctor's schedule on that date
        SELECT Staff_Schedule.start_time, Staff_Schedule.end_time
        INTO shift_start, shift_end
        FROM Staff_Schedule
        WHERE staff_id = para_doctor_id AND schedule_date = para_appointment_date;

    IF
        para_start_time < shift_start
            OR
        para_start_time > shift_end
            OR
        para_end_time < shift_start
            OR
        para_end_time > shift_end THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Incorrect time. Please choose other times';
    END IF;

    -- Check if there is a timetable clash
    SELECT COUNT(*) INTO clash_count
    FROM Staff_Schedule
    WHERE
        Staff_Schedule.staff_id = para_doctor_id
            AND
        Staff_Schedule.schedule_date = para_appointment_date
            AND
        (
            Staff_Schedule.start_time > para_start_time AND Staff_Schedule.start_time < para_end_time
                OR
            Staff_Schedule.start_time <= para_start_time AND Staff_Schedule.end_time > para_start_time
        )
    GROUP BY Staff_Schedule.staff_id;

    IF clash_count IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Schedule clash detected. Please choose another time';
    END IF ;
    RETURN 0;

END;
