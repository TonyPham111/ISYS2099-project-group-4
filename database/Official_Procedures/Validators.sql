DELIMITER $$

DROP FUNCTION IF EXISTS CheckPatientExists$$
CREATE FUNCTION CheckPatientExists(para_patient_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE patient_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;

    -- Check if the patient ID exists in the Patients table
    SELECT EXISTS(SELECT 1 FROM Patients WHERE id = para_patient_id) INTO patient_exists;

    RETURN patient_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPatientExists TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPatientExists TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPatientExists TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPatientExists TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS CheckStaffExists$$
CREATE FUNCTION CheckStaffExists(para_staff_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE staff_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the staff ID exists in the Staff table
    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_staff_id FOR UPDATE) INTO staff_exists;
    RETURN staff_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPatientExists TO 'HR'@'%'$$


DROP FUNCTION IF EXISTS CheckDoctorExists$$
CREATE FUNCTION CheckDoctorExists(para_doctor_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE doctor_exists BIT;
    DECLARE para_doctor_job_id INT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;

    -- Retrieve the job ID for 'Doctor' based on the job name
    SELECT id INTO para_doctor_job_id FROM Jobs WHERE job_name = 'Doctor' LIMIT 1;

    -- Check if the doctor exists with the specific job ID
    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_doctor_id AND job_id = para_doctor_job_id) INTO doctor_exists;

    RETURN doctor_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'FrontDesk'@'%'$$


DROP FUNCTION IF EXISTS CheckDoctorExistsInDepartment$$
CREATE FUNCTION CheckDoctorExistsInDepartment(para_doctor_id INT, para_department_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE doctor_exists BIT;
    DECLARE para_doctor_job_id INT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;

    -- Retrieve the job ID for 'Doctor' based on the job name
    SELECT id INTO para_doctor_job_id FROM Jobs WHERE job_name = 'Doctor' LIMIT 1;

    -- Check if the doctor exists in the specified department
    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_doctor_id AND job_id = para_doctor_job_id AND department_id = para_department_id FOR UPDATE) INTO doctor_exists;

    RETURN doctor_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'FrontDesk'@'%'$$

DROP FUNCTION IF EXISTS CheckManagementRelationship$$
CREATE FUNCTION CheckManagementRelationship(para_staff_id INT, para_manager_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE staff_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the staff member is managed by the specified manager
    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_staff_id AND manager_id = para_manager_id) INTO staff_exists;

    RETURN staff_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagementRelationship TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagementRelationship TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagementRelationship TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagementRelationship TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagementRelationship TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS CheckNurseExists$$
CREATE FUNCTION CheckNurseExists(para_nurse_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE nurse_exists BIT;
    DECLARE para_nurse_job_id INT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;

    -- Retrieve the job ID for 'Nurse' based on the job name
    SELECT id INTO para_nurse_job_id FROM Jobs WHERE job_name = 'Nurse' LIMIT 1;

    -- Check if the nurse exists with the specific job ID
    SELECT EXISTS(SELECT 1 FROM Staff WHERE id = para_nurse_id AND job_id = para_nurse_job_id) INTO nurse_exists;

    RETURN nurse_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'Nurses'@'%'$$

DROP FUNCTION IF EXISTS CheckManagerDepartmentAndJob$$
CREATE FUNCTION CheckManagerDepartmentAndJob(
    para_manager_id INT,
    para_department_id INT,
    para_job_id INT
) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE manager_exist BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the input manager id belongs to the input department and job
    SELECT EXISTS (SELECT 1 FROM Staff WHERE id = para_manager_id AND job_id = para_job_id AND department_id = para_department_id) INTO manager_exist;
    RETURN manager_exist;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'HR'@'%'$$

DROP FUNCTION IF EXISTS CheckEvaluationExists$$
CREATE FUNCTION CheckEvaluationExists(
    evaluation_id INT
) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE evaluation_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    SELECT EXISTS(SELECT 1 FROM PerformanceEvaluation WHERE id = evaluation_id) INTO evaluation_exists;
    RETURN evaluation_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckEvaluationExists TO 'HR'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckEvaluationExists TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckEvaluationExists TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckEvaluationExists TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckEvaluationExists TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS CheckAppointmentExists$$
CREATE FUNCTION CheckAppointmentExists(para_appointment_id INT, para_patient_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE appointment_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the appointment ID exists in the Appointments table
    SELECT EXISTS(SELECT 1 FROM Appointments WHERE id = para_appointment_id AND patient_id = para_patient_id) INTO appointment_exists;

    RETURN appointment_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckManagerDepartmentAndJob TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS CheckDepartmentExists$$
CREATE FUNCTION CheckDepartmentExists(para_department_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE department_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the department ID exists in the Departments table
    SELECT EXISTS(SELECT 1 FROM Departments WHERE id = para_department_id) INTO department_exists;

    RETURN department_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckDepartmentExists TO 'HR'@'%'$$

DROP FUNCTION IF EXISTS CheckJobExists$$
CREATE FUNCTION CheckJobExists(para_job_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE job_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the job ID exists in the Jobs table
    SELECT EXISTS(SELECT 1 FROM Jobs WHERE id = para_job_id) INTO job_exists;

    RETURN job_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckJobExists TO 'HR'@'%'$$

DROP FUNCTION IF EXISTS CheckScheduleExists$$
CREATE FUNCTION CheckScheduleExists(
	para_staff_id INT,
    para_date DATE
)
RETURNS BIT
READS SQL DATA
SQL SECURITY DEFINER
BEGIN
	DECLARE schedule_exists BIT;
	IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    SELECT EXISTS(SELECT 1 FROM Staff_Schedule WHERE staff_id = para_staff_id AND schedule_date = para_date FOR UPDATE) INTO schedule_exists;
    RETURN schedule_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckScheduleExists TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckScheduleExists TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckScheduleExists TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckScheduleExists TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckScheduleExists TO 'HR'@'%'$$

    



DROP FUNCTION IF EXISTS CheckPrescriptionExists$$
CREATE FUNCTION CheckPrescriptionExists(para_prescription_id INT, para_patient_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE prescription_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the prescription ID exists in the Prescription_Details table
    SELECT EXISTS(SELECT 1 FROM TreatmentHistory WHERE id = para_prescription_id AND patient_id = para_patient_id) INTO prescription_exists;

    RETURN prescription_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPrescriptionExists TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPrescriptionExists TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckPrescriptionExists TO 'BusinessOfficers'@'%'$$


DROP FUNCTION IF EXISTS CheckTestOrderExists$$
CREATE FUNCTION CheckTestOrderExists(para_test_order_id INT, para_patient_id int) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE test_order_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the test order ID exists in the Test_Details table
    SELECT EXISTS(SELECT 1 FROM Test_Orders WHERE id = para_test_order_id AND patient_id = para_patient_id) INTO test_order_exists;

    RETURN test_order_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckTestOrderExists TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckTestOrderExists TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckTestOrderExists TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS CheckTestTypeExists$$
CREATE FUNCTION CheckTestTypeExists(para_test_type_id INT) RETURNS bit(1)
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    DECLARE test_type_exists BIT;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;
    -- Check if the test type ID exists in the Test_Types table
    SELECT EXISTS(SELECT 1 FROM Test_Types WHERE id = para_test_type_id) INTO test_type_exists;

    RETURN test_type_exists;
END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckTestTypeExists TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckTestTypeExists TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.CheckTestTypeExists TO 'BusinessOfficers'@'%'$$

DROP FUNCTION IF EXISTS FindPatientWithAppointmentCurrently$$
CREATE FUNCTION FindPatientWithAppointmentCurrently(
    para_patient_id INT,  -- Input parameter: ID of the patient to check
    para_doctor_id INT    -- Input parameter: ID of the doctor to check
) RETURNS int
    READS SQL DATA
    SQL SECURITY DEFINER
BEGIN
    -- Declare a variable to store the checked patient ID, initialized to 0
    DECLARE checked_patient_id INT DEFAULT 0;
    IF @parent_proc IS NULL THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Something is wrong. Please try again';
    END IF;

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

END$$
GRANT EXECUTE ON FUNCTION hospital_management_system.FindPatientWithAppointmentCurrently TO 'Doctors'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.FindPatientWithAppointmentCurrently TO 'Nurses'@'%'$$
GRANT EXECUTE ON FUNCTION hospital_management_system.FindPatientWithAppointmentCurrently TO 'FrontDesk'@'%'$$

DELIMITER ;