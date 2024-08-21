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
    DECLARE business_start TIME DEFAULT '09:00:00'; -- Variable to store the start of the business hour
    DECLARE business_end TIME DEFAULT '17:00:00'; -- Variable to store the end of the business hour



    -- Check if the input time is in correct format
        IF MOD(MINUTE(para_start_time), 30) <> 0
               OR MOD(MINUTE(para_end_time), 30) <> 0
               OR para_end_time < para_start_time THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Incorrect time format. Please check again';
        end if;
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