DELIMITER $$

DROP PROCEDURE IF EXISTS CreatePrescription$$
CREATE PROCEDURE CreatePrescription(
    treatment_end_time DATETIME,
    prescription_note TEXT,
    drug_code_quantity_string TEXT
)
BEGIN
	DECLARE random_diagnosis_id INT;
    DECLARE patient_id INT;
	DECLARE doctor_id INT;
    
	-- Select a random exsisting diagnosis
	SELECT Diagnoses.id, Diagnoses.patient_id, Diagnoses.doctor_id 
    INTO random_diagnosis_id, patient_id, doctor_id 
    FROM Diagnoses ORDER BY RAND() LIMIT 1;
	
	CALL AddNewPrescription(doctor_id, patient_id, treatment_end_time, random_diagnosis_id, prescription_note, drug_code_quantity_string);
END$$

DELIMITER ;

-- Must add diagnoses first, otherwise this won't work
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 1', '1:1,2:2,3:3');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 2', '4:1,5:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 3', '6:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 4', '7:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 5', '8:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 6', '9:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 7', '10:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 8', '11:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 9', '12:2');
CALL CreatePrescription(CURDATE() + 1, 'Prescription note 10', '13:2');
