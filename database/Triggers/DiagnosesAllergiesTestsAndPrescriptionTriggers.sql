DELIMITER $$
CREATE TRIGGER ValidatePatientsAllergies
BEFORE INSERT ON PatientAllergy
FOR EACH ROW
BEGIN
    DECLARE checked_patient_id INT; -- Variable to store patient id
    DECLARE doctor_has_privilege INT;

    -- Check if the action is not in testing mode (testing = 0), then enforce doctor-patient privilege
		IF @testing = 0 THEN
            -- Check if the doctor has the privilege to edit the patient's allergy information
            SELECT FindPatientWithAppointmentCurrently(NEW.patient_id, @doctor_id) INTO checked_patient_id;
            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
            END IF;
		ELSE
            -- Check if patient id exists in the system (if testing = 1)
            SELECT COUNT(*) INTO checked_patient_id
            FROM Patients
            WHERE id = NEW.patient_id;

            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Incorrect patient id. Please try again';
            END IF;
        END IF;
END$$

CREATE TRIGGER ValidateDiagnoses
BEFORE INSERT ON Diagnoses
FOR EACH ROW
BEGIN
    DECLARE checked_patient_id INT; -- Variable to store patient id
    DECLARE doctor_has_privilege INT;

    -- Check if the action is not in testing mode (testing = 0), then enforce doctor-patient privilege
		IF @testing = 0 THEN
            -- Check if the doctor has the privilege to edit the patient's allergy information
            SELECT FindPatientWithAppointmentCurrently(NEW.patient_id, @doctor_id) INTO checked_patient_id;
            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
            END IF;
		ELSE
            -- Check if patient id exists in the system (if testing = 1)
            SELECT COUNT(*) INTO checked_patient_id
            FROM Patients
            WHERE id = NEW.patient_id;

            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Incorrect patient id. Please try again';
            END IF;
        END IF;
END$$

CREATE TRIGGER ValidateTreatment
BEFORE INSERT ON TreatmentHistory
FOR EACH ROW
BEGIN
    DECLARE checked_patient_id INT; -- Variable to store patient id
    DECLARE doctor_has_privilege INT;

    -- Check if the action is not in testing mode (testing = 0), then enforce doctor-patient privilege
		IF @testing = 0 THEN
            -- Check if the doctor has the privilege to edit the patient's allergy information
            SELECT FindPatientWithAppointmentCurrently(NEW.patient_id, @doctor_id) INTO checked_patient_id;
            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
            END IF;
		ELSE
            -- Check if patient id exists in the system (if testing = 1)
            SELECT COUNT(*) INTO checked_patient_id
            FROM Patients
            WHERE id = NEW.patient_id;

            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Incorrect patient id. Please try again';
            END IF;
        END IF;
END$$


CREATE TRIGGER ValidateTests
BEFORE INSERT ON Test_Orders
FOR EACH ROW
BEGIN
    DECLARE checked_patient_id INT; -- Variable to store patient id
    DECLARE doctor_has_privilege INT;

    -- Check if the action is not in testing mode (testing = 0), then enforce doctor-patient privilege
		IF @testing = 0 THEN
            -- Check if the doctor has the privilege to edit the patient's allergy information
            SELECT FindPatientWithAppointmentCurrently(NEW.patient_id, @doctor_id) INTO checked_patient_id;
            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Either the patient id is incorrect or you do not have the privilege to perform this action currently';
            END IF;
		ELSE
            -- Check if patient id exists in the system (if testing = 1)
            SELECT COUNT(*) INTO checked_patient_id
            FROM Patients
            WHERE id = NEW.patient_id;

            IF checked_patient_id = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Incorrect patient id. Please try again';
            END IF;
        END IF;
END$$

DELIMITER ;
