DELIMITER $$

DROP PROCEDURE IF EXISTS CreateDiagnosis$$
CREATE PROCEDURE CreateDiagnosis(
    diagnosis_date DATE,
    diagnosis_note TEXT,
    condition_code_string TEXT
)
BEGIN
	DECLARE random_doctor_id INT;
    DECLARE random_patient_id INT;
    DECLARE doctor_job_id INT;
    
    SELECT id INTO doctor_job_id FROM Jobs WHERE job_name = 'Doctor' LIMIT 1;

	-- Select a random doctor and patient
	SELECT id INTO random_doctor_id FROM Staff WHERE job_id = doctor_job_id ORDER BY RAND() LIMIT 1;
	SELECT id INTO random_patient_id FROM Patients ORDER BY RAND() LIMIT 1;
	
	CALL AddNewDiagnosis(random_doctor_id, random_patient_id, diagnosis_date, diagnosis_note, condition_code_string);
END$$

DELIMITER ;

CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 1', 'A001,A009');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 2', 'A0100,A0101');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 3', 'A0102,A0103');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 4', 'A0104,A0105');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 5', 'A0109');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 6', 'A011');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 7', 'A012');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 8', 'A013');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 9', 'A014');
CALL CreateDiagnosis(CURDATE(), 'Diagnosis note 10', 'A020');
