DELIMITER $$

DROP FUNCTION IF EXISTS CheckStaffExists; -- $$
CREATE FUNCTION CheckStaffExists(para_staff_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
    DECLARE staff_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_staff_id) INTO staff_exists;

    RETURN staff_exists;
END; -- $$

DROP FUNCTION IF EXISTS CheckPatientExists; -- $$
CREATE FUNCTION CheckPatientExists(para_patient_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE patient_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Patients WHERE id = para_patient_id) INTO patient_exists;

    RETURN patient_exists;
END; -- $$

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
END; -- $$

DROP FUNCTION IF EXISTS CheckJobExists; -- $$
CREATE FUNCTION CheckJobExists(para_job_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
    DECLARE job_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Jobs WHERE id = para_job_id) INTO job_exists;

    RETURN job_exists;
END; -- $$

DROP FUNCTION IF EXISTS CheckDepartmentExists; -- $$
CREATE FUNCTION CheckDepartmentExists(para_department_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
    DECLARE department_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Departments WHERE id = para_department_id) INTO department_exists;

    RETURN department_exists;
END; -- $$


DROP FUNCTION IF EXISTS CheckTestOrderExists; -- $$
CREATE FUNCTION CheckTestOrderExists(para_test_order_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE test_order_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Test_Details WHERE test_id = para_test_order_id) INTO test_order_exists;

    RETURN test_order_exists;
END; -- $$

DROP FUNCTION IF EXISTS CheckTestTypeExists; -- $$
CREATE FUNCTION CheckTestTypeExists(para_test_type_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE test_type_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Test_Types WHERE id = para_test_type_id) INTO test_type_exists;

    RETURN test_type_exists;
END; -- $$

DROP FUNCTION IF EXISTS CheckAppointmentExists; -- $$
CREATE FUNCTION CheckAppointmentExists(para_appointment_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE appointment_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Appointments WHERE id = para_appointment_id) INTO appointment_exists;

    RETURN appointment_exists;
END; -- $$

DROP FUNCTION IF EXISTS CheckPrescriptionExists; -- $$
CREATE FUNCTION CheckPrescriptionExists(para_prescription_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE prescription_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Prescription_Details WHERE id = para_prescription_id) INTO prescription_exists;

    RETURN prescription_exists;
END; -- $$

DROP FUNCTION IF EXISTS CheckTestDetailsExists; -- $$
CREATE FUNCTION CheckTestDetailsExists(para_test_details_id INT)
RETURNS BIT
DETERMINISTIC
BEGIN
	DECLARE test_details_exists BIT;

    SELECT EXISTS(SELECT 1 FROM Test_Details WHERE id = para_test_details_id) INTO test_details_exists;

    RETURN test_details_exists;
END; -- $$


-- Drop the function if it already exists to avoid errors when creating it
DROP FUNCTION IF EXISTS FindPatientWithAppointmentCurrently; -- $$

-- Create a new function named FindPatientWithAccommodationCurrently
CREATE FUNCTION FindPatientWithAppointmentCurrently(
    para_patient_id INT,  -- Input parameter: ID of the patient to check
    para_doctor_id INT    -- Input parameter: ID of the doctor to check
)
RETURNS INT               -- The function returns an integer value
DETERMINISTIC             -- Indicates that the function will always produce the same result for the same input parameters
SQL SECURITY DEFINER      -- Specifies that the function executes with the privileges of the user who defined it
BEGIN
    -- Declare a variable to store the checked patient ID, initialized to 0
    DECLARE checked_patient_id INT DEFAULT 0;

    -- Select the patient_id from the Appointments table that matches the following criteria:
    -- 1. The appointment date is today (CURDATE())
    -- 2. The current time is after the appointment's start time (start_time < CURRENT_TIME())
    -- 3. The current time is before the appointment's end time (end_time > CURRENT_TIME())
    -- 4. The appointment is with the specified doctor (doctor_id = para_doctor_id)
    -- 5. The appointment is for the specified patient (patient_id = para_patient_id)
    -- The result is stored into the checked_patient_id variable
    SELECT Appointments.patient_id INTO checked_patient_id
    FROM Appointments
    WHERE appointment_date = CURDATE()
      AND start_time < CURRENT_TIME()
      AND end_time > CURRENT_TIME()
      AND doctor_id = para_doctor_id
      AND patient_id = para_patient_id
    LIMIT 1;

    -- Return the checked_patient_id
    -- If a matching appointment is found, this will be the patient_id; otherwise, it remains 0
    RETURN checked_patient_id;

END;  -- $$

DELIMITER ;
