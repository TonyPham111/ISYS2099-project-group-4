DELIMITER $$

DROP PROCEDURE IF EXISTS CreateAppointment$$
CREATE PROCEDURE CreateAppointment(
    appointment_purpose TEXT,
    appointment_date DATE,
    start_time TIME,
    end_time TIME,
    note TEXT
)
BEGIN
	DECLARE random_doctor_id INT;
    DECLARE random_patient_name VARCHAR(50);
    DECLARE doctor_job_id INT;
    
    SELECT id INTO doctor_job_id FROM Jobs WHERE job_name = 'Doctor' LIMIT 1;

	-- Select a random doctor and patient
	SELECT id INTO random_doctor_id FROM Staff WHERE job_id = doctor_job_id ORDER BY RAND() LIMIT 1;
	SELECT full_name INTO random_patient_name FROM Patients ORDER BY RAND() LIMIT 1;
	
	CALL AddNewAppointment(random_doctor_id, random_patient_name, appointment_purpose, appointment_date, start_time, end_time, note, NULL);
END$$

DELIMITER ;

CALL CreateAppointment('Routine Checkup', CURDATE(), '09:00:00', '10:00:00', 'Regular annual checkup');
CALL CreateAppointment('Follow-up', CURDATE(), '10:30:00', '11:30:00', 'Follow-up on last visit');
CALL CreateAppointment('Consultation', CURDATE(), '12:00:00', '13:00:00', 'Consultation for coughing');
CALL CreateAppointment('X-ray', CURDATE(), '14:00:00', '14:30:00', 'Scheduled for chest x-ray');
CALL CreateAppointment('Blood Test', CURDATE(), '15:00:00', '15:30:00', 'Routine blood test');
CALL CreateAppointment('Dental Checkup', CURDATE(), '16:00:00', '17:00:00', 'Annual dental checkup');
CALL CreateAppointment('Vaccination', CURDATE(), '11:30:00', '12:00:00', 'COVID-19 vaccination');
CALL CreateAppointment('MRI Scan', CURDATE(), '15:30:00', '16:30:00', 'MRI scan for back pain');
