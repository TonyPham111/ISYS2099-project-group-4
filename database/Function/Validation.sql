DELIMITER $$

DROP FUNCTION IF EXISTS CheckStaffExists$$
CREATE FUNCTION CheckStaffExists(para_staff_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
    DECLARE staff_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_staff_id) INTO staff_exists;

    RETURN staff_exists;
END$$

DROP FUNCTION IF EXISTS CheckPatientExists$$
CREATE FUNCTION CheckPatientExists(para_patient_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE patient_exists BIT;
    
    SELECT EXISTS(SELECT 1 FROM Patients WHERE id = para_patient_id) INTO patient_exists;
    
    RETURN patient_exists;
END$$

DROP FUNCTION IF EXISTS CheckDoctorExists$$
CREATE FUNCTION CheckDoctorExists(para_doctor_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
    DECLARE doctor_exists BIT;
	DECLARE para_doctor_job_id INT;

	-- Retrieve the job ID for 'Doctor' based on the job name
    SELECT id INTO para_doctor_job_id FROM Jobs WHERE job_name = 'Doctor' LIMIT 1;

    -- Check if the doctor exists
    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_doctor_id AND job_id = para_doctor_job_id) INTO doctor_exists;

    RETURN doctor_exists;
END$$

DROP FUNCTION IF EXISTS CheckTestOrderExists$$
CREATE FUNCTION CheckTestOrderExists(para_test_order_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE test_order_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Test_Details WHERE test_id = para_test_order_id) INTO test_order_exists;
    
    RETURN test_order_exists;
END$$

DROP FUNCTION IF EXISTS CheckTestTypeExists$$
CREATE FUNCTION CheckTestTypeExists(para_test_type_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE test_type_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Test_Types WHERE id = para_test_type_id) INTO test_type_exists;
    
    RETURN test_type_exists;
END$$

DROP FUNCTION IF EXISTS CheckAppointmentExists$$
CREATE FUNCTION CheckAppointmentExists(para_appointment_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE appointment_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Appointments WHERE id = para_appointment_id) INTO appointment_exists;
    
    RETURN appointment_exists;
END$$

DROP FUNCTION IF EXISTS CheckPrescriptionExists$$
CREATE FUNCTION CheckPrescriptionExists(para_prescription_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE prescription_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Prescription_Details WHERE id = para_prescription_id) INTO prescription_exists;
    
    RETURN prescription_exists;
END$$

DROP FUNCTION IF EXISTS CheckTestDetailsExists$$
CREATE FUNCTION CheckTestDetailsExists(para_test_details_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE test_details_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Test_Details WHERE id = para_test_details_id) INTO test_details_exists;
    
    RETURN test_details_exists;
END$$

DELIMITER ;
