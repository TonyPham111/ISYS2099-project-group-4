DELIMITER $$

DROP PROCEDURE IF EXISTS CreateTest$$
CREATE PROCEDURE CreateTest(
    administering_date DATE, 
    administering_time TIME, 
    ordering_date DATE, 
    test_id_string TEXT
)
BEGIN
	DECLARE random_doctor_id INT;
    DECLARE random_patient_id INT;
    DECLARE doctor_job_id INT;
    
    SELECT id INTO doctor_job_id FROM Jobs WHERE job_name = 'Doctor' LIMIT 1;

	-- Select a random doctor and patient
	SELECT id INTO random_doctor_id FROM Staff WHERE job_id = doctor_job_id ORDER BY RAND() LIMIT 1;
	SELECT id INTO random_patient_id FROM Patients ORDER BY RAND() LIMIT 1;
	
	CALL OrderTest(random_doctor_id, random_patient_id, administering_date, administering_time, ordering_date, test_id_string);
END$$

DELIMITER ;

CALL CreateTest(CURDATE(), '09:00:00', CURDATE(), '1,2,3');
CALL CreateTest(CURDATE(), '09:30:00', CURDATE(), '4,5,6');
CALL CreateTest(CURDATE(), '10:00:00', CURDATE(), '7,8,9');
CALL CreateTest(CURDATE(), '10:30:00', CURDATE(), '10,11');
CALL CreateTest(CURDATE(), '11:00:00', CURDATE(), '12,13');
CALL CreateTest(CURDATE(), '11:30:00', CURDATE(), '14,15');
CALL CreateTest(CURDATE(), '12:00:00', CURDATE(), '16,17');
CALL CreateTest(CURDATE(), '12:30:00', CURDATE(), '18');
CALL CreateTest(CURDATE(), '13:00:00', CURDATE(), '19');
CALL CreateTest(CURDATE(), '13:30:00', CURDATE(), '20');
