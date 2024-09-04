DELIMITER $$

CREATE TRIGGER ValidateAppointmentConstraints
BEFORE INSERT ON Appointments
FOR EACH ROW
BEGIN
    DECLARE appointment_schedule_check INT;
    DECLARE clash_count INT;
    
    -- Check if the doctor still belongs to the department the patient is booking
    IF NOT CheckDoctorExistsInDepartment(NEW.doctor_id, NEW.department_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect doctor id. Please check your input';
    END IF;

    -- Raise an exception if no patient is found
    IF NOT CheckPatientExists(NEW.patient_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot find patient. Please try again';
    END IF;

    -- Check if the doctor has a schedule on the given appointment date
    IF NOT CheckScheduleExists(NEW.doctor_id, NEW.appointment_date) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No schedule has been planned for the doctor on that date. Please try again';
    END IF;

    -- Check if the input time is within the doctor's schedule
    SELECT CheckIfBookingTimeOutsideSchedule(NEW.doctor_id, NEW.appointment_date, NEW.start_time, NEW.end_time)
    INTO appointment_schedule_check;
    IF appointment_schedule_check = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Appointment out of schedule range. Please try again';
    END IF;

    -- Check if there is any booking clash
    SELECT CheckAppointmentClash(NEW.doctor_id, NEW.appointment_date, NEW.start_time, NEW.end_time)
    INTO clash_count;
    IF clash_count <> 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Time slot has already been reserved. Please try again';
    END IF;

END$$

DELIMITER ;