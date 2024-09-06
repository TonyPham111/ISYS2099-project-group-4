DELIMITER $$
DROP PROCEDURE IF EXISTS AuthenticateUser$$
CREATE PROCEDURE AuthenticateUser(
	para_email VARCHAR(50)
)
SQL SECURITY DEFINER
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        DECLARE returned_message TEXT;
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;
		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    
	SELECT staff_password, Staff.id, job_id, job_name, department_id  
    FROM Staff INNER JOIN Jobs ON Jobs.id = Staff.job_id 
    WHERE email = para_email;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AuthenticateUser TO 'HR'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AuthenticateUser TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AuthenticateUser TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AuthenticateUser TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.AuthenticateUser TO 'BusinessOfficers'@'%'$$


DROP PROCEDURE IF EXISTS FetchPatientsPersonalInfo$$
CREATE PROCEDURE FetchPatientsPersonalInfo()
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Select various fields related to the patient's personal information
    SELECT
        id,                                   -- Patient ID
        full_name,                            -- Full name of the patient
		DATE_FORMAT(Patients.birth_date, '%d/%m/%Y') AS birth_date, -- Formatted birth date
        gender,                               -- Gender of the patient
        phone_number AS contact_phone_number, -- Contact phone number
        home_address                          -- Home address of the patient
    FROM Patients;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfo TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfo TO 'BusinessOfficers'@'%'$$


DROP PROCEDURE IF EXISTS FetchPatientsPersonalInfoByName$$
CREATE PROCEDURE FetchPatientsPersonalInfoByName(
	para_full_name VARCHAR(50)
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Select various fields related to the patient's personal information
    SELECT
        id,                                   -- Patient ID
        full_name,                            -- Full name of the patient
		DATE_FORMAT(Patients.birth_date, '%d/%m/%Y') AS birth_date, -- Formatted birth date
        gender,                               -- Gender of the patient
        phone_number AS contact_phone_number, -- Contact phone number
        home_address                          -- Home address of the patient
    FROM Patients
    WHERE full_name = para_full_name;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfoByName TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsPersonalInfoByName TO 'BusinessOfficers'@'%'$$


DROP PROCEDURE IF EXISTS FetchStaffInfoById$$
CREATE PROCEDURE FetchStaffInfoById(
    staff_id INT  -- Parameter for the ID of the staff member whose details are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Select various fields related to the staff member's information
    WITH Non_Manager AS (
		SELECT
			Staff.id,                     -- The ID of the staff member
			Staff.full_name,              -- The full name of the staff member
			Jobs.job_name,                      -- The job title of the staff member
			Departments.department_name,        -- The department name where the staff member works
            Staff.manager_id,
			Staff.gender,                 -- The gender of the staff member
			DATE_FORMAT(Staff.birth_date, '%d/%m/%Y') AS birth_date,             -- The birth date of the staff member
			Staff.home_address,           -- The home address of the staff member
			Staff.phone_number,           -- The phone number of the staff member
			Staff.email,                  -- The email address of the staff member
			Staff.staff_password,         -- The password of the staff member
			Staff.wage,                   -- The wage of the staff member
			DATE_FORMAT(Staff.hire_date, '%d/%m/%Y') AS hire_date_date,              -- The hire date of the staff member
			Staff.employment_status,      -- The employment status (e.g., 'Active')
			Staff.employment_document_id, -- The employment document ID of the staff member
			Qualifications.document_id AS qualification_document
		FROM Qualifcations
        INNER JOIN Staff ON Staff.id = Qualifications.staff_id
        INNER JOIN Jobs ON Jobs.id = Staff.job_id
        INNER JOIN Departments ON Departments.id = Staff.job_id
        WHERE Staff.id = staff_id
    ),
    Manager AS (
		SELECT id, full_name FROM Staff
    )
    SELECT Non_Manager.*, Manager.full_name AS manager_name FROM Non_Manager INNER JOIN Manager ON Manager.id = Non_Manager.manager_id;
    
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'HR'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffInfoById TO 'BusinessOfficers'@'%'$$

DROP PROCEDURE IF EXISTS FetchPatientsAllergies$$
CREATE PROCEDURE FetchPatientsAllergies(
    patient_id INT  -- Parameter for the ID of the patient whose allergies are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		ROLLBACK;  -- Rollback the transaction in case of an error
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Select various fields related to the patient's allergies
    SELECT
        DATE_FORMAT(PatientAllergy.record_date, '%d/%m/%Y') AS record_date,          -- Date when the allergy was recorded
        Allergies.allergy_name,              -- Name of the allergy
        Allergies.allergy_type,              -- Type of the allergy
        Allergies.allergen,                  -- Allergen causing the allergy
        Allergies.allergy_group              -- Group/category of the allergy
    FROM Patients
    INNER JOIN
        PatientAllergy                        -- Join with PatientAllergy table
    ON
        Patients.id = PatientAllergy.patient_id
    INNER JOIN
        Allergies                             -- Join with Allergies table
    ON
        PatientAllergy.allergy_id = Allergies.id
    WHERE Patients.id = patient_id;           -- Filter by patient ID
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsAllergies TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPatientsAllergies TO 'Nurses'@'%'$$

DROP PROCEDURE IF EXISTS FetchDiagnosesByPatientId$$
CREATE PROCEDURE FetchDiagnosesByPatientId(
    patient_id INT  -- Parameter for the ID of the patient whose diagnoses are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Select various fields related to diagnoses for the specified patient
    SELECT
        Diagnoses.id AS diagnosis_id,         -- The ID of the diagnosis
        Staff.full_name AS doctor_name,       -- The full name of the doctor who made the diagnosis
        DATE_FORMAT(Diagnoses.diagnosis_date, '%d/%m/%Y') AS diagnosis_date, -- The date when the diagnosis was made
        Diagnoses.diagnosis_note,             -- Any notes related to the diagnosis
        Conditions.condition_code,            -- Code for the diagnosed condition
        Conditions.condition_name,            -- The name of the diagnosed condition
        Conditions.condition_description      -- Description of the diagnosed condition
    FROM
        Conditions                            -- The Conditions table, which contains information about medical conditions
    INNER JOIN
        DiagnosesDetails                      -- The DiagnosesDetails table, linking diagnoses with conditions
    ON
        Conditions.condition_code = DiagnosesDetails.condition_code -- Join on condition_code to link with DiagnosesDetails
    INNER JOIN
        Diagnoses                             -- The Diagnoses table, containing details about each diagnosis
    ON
        Diagnoses.id = DiagnosesDetails.diagnosis_id -- Join on diagnosis_id to link DiagnosesDetails with Diagnoses
    INNER JOIN
        Staff                                 -- The Staff table, to retrieve the name of the doctor who made the diagnosis
    ON
        Diagnoses.doctor_id = Staff.id        -- Join on doctor_id to link Diagnoses with Staff
    WHERE
        Diagnoses.patient_id = patient_id;    -- Filter to include only the diagnoses for the specified patient
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientId TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientId TO 'Nurses'@'%'$$


DROP PROCEDURE IF EXISTS FetchDiagnosesByPatientIdAndDates$$
CREATE PROCEDURE FetchDiagnosesByPatientIdAndDates(
    patient_id INT,  -- Parameter for the ID of the patient whose diagnoses are to be fetched
    from_date DATE,
    to_date DATE
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    IF from_date = NULL THEN
		SET from_date = '1000-01-01';
	END IF;
    
    IF end_date = NULL THEN
		SET to_date = '9999-12-31';
    END IF;

    -- Select various fields related to diagnoses for the specified patient
    SELECT
        Diagnoses.id AS diagnosis_id,         -- The ID of the diagnosis
        Staff.full_name AS doctor_name,       -- The full name of the doctor who made the diagnosis
        DATE_FORMAT(Diagnoses.diagnosis_date, '%d/%m/%Y') AS diagnosis_date, -- The date when the diagnosis was made
        Diagnoses.diagnosis_note,             -- Any notes related to the diagnosis
        Conditions.condition_code,            -- Code for the diagnosed condition
        Conditions.condition_name,            -- The name of the diagnosed condition
        Conditions.condition_description      -- Description of the diagnosed condition
    FROM
        Conditions                            -- The Conditions table, which contains information about medical conditions
    INNER JOIN
        DiagnosesDetails                      -- The DiagnosesDetails table, linking diagnoses with conditions
    ON
        Conditions.condition_code = DiagnosesDetails.condition_code -- Join on condition_code to link with DiagnosesDetails
    INNER JOIN
        Diagnoses                             -- The Diagnoses table, containing details about each diagnosis
    ON
        Diagnoses.id = DiagnosesDetails.diagnosis_id -- Join on diagnosis_id to link DiagnosesDetails with Diagnoses
    INNER JOIN
        Staff                                 -- The Staff table, to retrieve the name of the doctor who made the diagnosis
    ON
        Diagnoses.doctor_id = Staff.id        -- Join on doctor_id to link Diagnoses with Staff
    WHERE
        Diagnoses.patient_id = patient_id    -- Filter to include only the diagnoses for the specified patient
			AND
		diagnosis_date BETWEEN from_date AND to_date;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientIdAndDates TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchDiagnosesByPatientIdAndDates TO 'Nurses'@'%'$$



DROP PROCEDURE IF EXISTS FetchPrescriptionsByPatientId$$
CREATE PROCEDURE FetchPrescriptionsByPatientId(
    para_patient_id INT  -- Parameter for the ID of the patient whose prescriptions are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Select various fields related to the prescriptions for the specified patient
    SELECT
        TreatmentHistory.id,                 -- ID of the treatment history record
        DATE_FORMAT(TreatmentHistory.treatment_start_date, '%d/%m/%Y') AS start_date, -- Start date of the treatment
        Staff.full_name AS doctor_name,      -- The full name of the doctor who prescribed the drug
        Drugs.drug_name,                     -- The name of the drug prescribed
        Prescription_Details.quantity,       -- The quantity of the drug prescribed
        Drugs.unit,                          -- The unit of the drug (e.g., capsule, tablet)
        Prescription_Details.price           -- The price of the prescription
    FROM
        Drugs                                -- The Drugs table, which contains details about drugs
    INNER JOIN
        Prescription_Details                 -- The Prescription_Details table, linking prescriptions with drugs
    ON
        Drugs.drug_code = Prescription_Details.drug_code -- Join on drug_code to link with Prescription_Details
    INNER JOIN
        TreatmentHistory                     -- The TreatmentHistory table, which tracks treatments and prescriptions
    ON
        Prescription_Details.prescription_id = TreatmentHistory.id -- Join on prescription_id to link with TreatmentHistory
    INNER JOIN
        Staff                                -- The Staff table, to retrieve the name of the prescribing doctor
    ON
        TreatmentHistory.doctor_id = Staff.id -- Join on doctor_id to link TreatmentHistory with Staff
    WHERE
        TreatmentHistory.patient_id = para_patient_id; -- Filter to include only the prescriptions for the specified patient
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientId TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientId TO 'Nurses'@'%'$$


DROP PROCEDURE IF EXISTS FetchPrescriptionsByPatientIdAndDates$$
CREATE PROCEDURE FetchPrescriptionsByPatientIdAndDates(
    para_patient_id INT,  -- Parameter for the ID of the patient whose prescriptions are to be fetched
    from_date DATE,
    to_date DATE
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    
	IF from_date = NULL THEN
		SET from_date = '1000-01-01';
	END IF;
    
    IF end_date = NULL THEN
		SET to_date = '9999-12-31';
    END IF;

    -- Select various fields related to the prescriptions for the specified patient
    SELECT
        TreatmentHistory.id,                 -- ID of the treatment history record
        DATE_FORMAT(TreatmentHistory.treatment_start_date, '%d/%m/%Y') AS start_date, -- Start date of the treatment
        Staff.full_name AS doctor_name,      -- The full name of the doctor who prescribed the drug
        Drugs.drug_name,                     -- The name of the drug prescribed
        Prescription_Details.quantity,       -- The quantity of the drug prescribed
        Drugs.unit,                          -- The unit of the drug (e.g., capsule, tablet)
        Prescription_Details.price           -- The price of the prescription
    FROM
        Drugs                                -- The Drugs table, which contains details about drugs
    INNER JOIN
        Prescription_Details                 -- The Prescription_Details table, linking prescriptions with drugs
    ON
        Drugs.drug_code = Prescription_Details.drug_code -- Join on drug_code to link with Prescription_Details
    INNER JOIN
        TreatmentHistory                     -- The TreatmentHistory table, which tracks treatments and prescriptions
    ON
        Prescription_Details.prescription_id = TreatmentHistory.id -- Join on prescription_id to link with TreatmentHistory
    INNER JOIN
        Staff                                -- The Staff table, to retrieve the name of the prescribing doctor
    ON
        TreatmentHistory.doctor_id = Staff.id -- Join on doctor_id to link TreatmentHistory with Staff
    WHERE
        TreatmentHistory.patient_id = para_patient_id -- Filter to include only the prescriptions for the specified patient
			AND
		treatment_start_date BETWEEN from_date AND to_date;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientIdAndDates TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchPrescriptionsByPatientIdAndDates TO 'Nurses'@'%'$$





DROP PROCEDURE IF EXISTS FetchTestDetailsByPatientId$$
CREATE PROCEDURE FetchTestDetailsByPatientId(
    patient_id INT    -- Parameter for the ID of the patient whose test details are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Common Table Expression (CTE) to gather test order details along with the ordering doctor's name
    WITH Test_Orders_Details AS (
        SELECT
            Test_Orders.id,                    -- The ID of the test order
            Test_Orders.ordering_date,         -- The date the test was ordered
            Test_Orders.patient_id,            -- The ID of the patient for whom the test was ordered
            Staff.full_name AS ordering_doctor -- The full name of the doctor who ordered the test
        FROM
            Test_Orders                        -- The Test_Orders table, which contains test order details
        INNER JOIN
            Staff                              -- The Staff table to retrieve the ordering doctor's name
        ON
            Test_Orders.ordering_staff_id = Staff.id  -- Join on the staff ID to get the ordering doctor's name
    )

    -- Main SELECT query to retrieve test details for the specified patient
    SELECT
        Test_Orders_Details.id,                -- The ID of the test order
        Test_Orders_Details.ordering_doctor,   -- The name of the doctor who ordered the test
        DATE_FORMAT(Test_Orders_Details.ordering_date, '%d/%m/%Y') AS ordering_date,   -- The date the test was ordered
        Test_Types.test_name,                  -- The name of the test
        Staff.id AS administrating_nurse,      -- The ID of the nurse who administered the test
		DATE_FORMAT(Test_Details.administering_date, '%d/%m/%Y') AS administering_date,       -- The date the test was administered
        Test_Details.administering_time,       -- The time the test was administered
        Test_Details.lab_result_document_id    -- The ID of the document containing the lab results
    FROM
        Test_Types                             -- The Test_Types table, which contains test type details
    INNER JOIN
        Test_Details                           -- The Test_Details table, which contains details about the tests administered
    ON
        Test_Details.test_type_id = Test_Types.id -- Join on the test type ID to get the test name
    LEFT OUTER JOIN
        Staff                                  -- The Staff table to retrieve the name of the nurse who administered the test
    ON
        Test_Details.administering_staff_id = Staff.id -- Join on the staff ID to get the administering nurse's name
    INNER JOIN
        Test_Orders_Details                    -- The CTE to link the test details with the test orders
    ON
        Test_Details.test_id = Test_Orders_Details.id -- Join on the test ID to get the order details
    WHERE
        Test_Orders_Details.patient_id = patient_id;  -- Filter to include only the tests for the specified patient
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientId TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientId TO 'Nurses'@'%'$$



DROP PROCEDURE IF EXISTS FetchTestDetailsByPatientIdByDates$$
CREATE PROCEDURE FetchTestDetailsByPatientIdByDates(
    patient_id INT,    -- Parameter for the ID of the patient whose test details are to be fetched
    from_date DATE,
    to_date DATE
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    
	IF from_date = NULL THEN
		SET from_date = '1000-01-01';
	END IF;
    
    IF end_date = NULL THEN
		SET to_date = '9999-12-31';
    END IF;

    -- Common Table Expression (CTE) to gather test order details along with the ordering doctor's name
    WITH Test_Orders_Details AS (
        SELECT
            Test_Orders.id,                    -- The ID of the test order
            Test_Orders.ordering_date,         -- The date the test was ordered
            Test_Orders.patient_id,            -- The ID of the patient for whom the test was ordered
            Staff.full_name AS ordering_doctor -- The full name of the doctor who ordered the test
        FROM
            Test_Orders                        -- The Test_Orders table, which contains test order details
        INNER JOIN
            Staff                              -- The Staff table to retrieve the ordering doctor's name
        ON
            Test_Orders.ordering_staff_id = Staff.id  -- Join on the staff ID to get the ordering doctor's name
    )

    -- Main SELECT query to retrieve test details for the specified patient
    SELECT
        Test_Orders_Details.id,                -- The ID of the test order
        Test_Orders_Details.ordering_doctor,   -- The name of the doctor who ordered the test
        DATE_FORMAT(Test_Orders_Details.ordering_date, '%d/%m/%Y') AS ordering_date,   -- The date the test was ordered
        Test_Types.test_name,                  -- The name of the test
        Staff.id AS administrating_nurse,      -- The ID of the nurse who administered the test
		DATE_FORMAT(Test_Details.administering_date, '%d/%m/%Y') AS administering_date,       -- The date the test was administered
        Test_Details.administering_time,       -- The time the test was administered
        Test_Details.lab_result_document_id    -- The ID of the document containing the lab results
    FROM
        Test_Types                             -- The Test_Types table, which contains test type details
    INNER JOIN
        Test_Details                           -- The Test_Details table, which contains details about the tests administered
    ON
        Test_Details.test_type_id = Test_Types.id -- Join on the test type ID to get the test name
    LEFT OUTER JOIN
        Staff                                  -- The Staff table to retrieve the name of the nurse who administered the test
    ON
        Test_Details.administering_staff_id = Staff.id -- Join on the staff ID to get the administering nurse's name
    INNER JOIN
        Test_Orders_Details                    -- The CTE to link the test details with the test orders
    ON
        Test_Details.test_id = Test_Orders_Details.id -- Join on the test ID to get the order details
    WHERE
        Test_Orders_Details.patient_id = patient_id  -- Filter to include only the tests for the specified patient
			AND
		administering_date BETWEEN from_date AND to_date;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientIdByDates TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchTestDetailsByPatientIdByDates TO 'Nurses'@'%'$$

DROP PROCEDURE IF EXISTS GetStaffUnderManager;
CREATE PROCEDURE GetStaffUnderManager(
    IN managerId INT  -- Parameter for the ID of the manager whose staff members are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;

    -- Select various fields related to the staff members under the specified manager
    SELECT 
        s.id AS staff_id,                    -- The ID of the staff member
        s.full_name,                         -- The full name of the staff member
        j.job_name,                          -- The job title of the staff member
        s.gender,                            -- The gender of the staff member
        s.birth_date,                        -- The birth date of the staff member
        s.email,                             -- The email address of the staff member
        s.phone_number                       -- The phone number of the staff member
    FROM 
        Staff s
    INNER JOIN 
        Jobs j ON s.job_id = j.id            -- Join with the Jobs table to get job titles
    INNER JOIN 
        Departments d ON s.department_id = d.id -- Join with the Departments table to get department names
    WHERE 
        s.manager_id = managerId             -- Filter to include only staff members under the specified manager
        AND s.employment_status = 'Active';  -- Only include staff members with 'Active' employment status
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'HR'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetStaffUnderManager TO 'FrontDesk'@'%'$$


DROP PROCEDURE IF EXISTS GetAppointmentsAndSchedulesByStaffByDate$$
CREATE PROCEDURE GetAppointmentsAndSchedulesByStaffByDate(
    para_manager_id INT,        -- Parameter for the ID of the manager requesting the schedules and appointments
    para_staff_id INT,           -- Parameter for the ID of the staff whose schedules and appointments are to be fetched
    from_date DATE,
    to_date DATE
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
	SET @parent_proc = TRUE;
    -- Check if the manager is authorized to view the schedules and appointments of the staff member
    IF NOT CheckManagementRelationship(para_staff_id, para_manager_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You are not allowed to view this staff';
    END IF;
    
	IF from_date = NULL THEN
		SET from_date = '1000-01-01';
	END IF;
    
    IF end_date = NULL THEN
		SET to_date = '9999-12-31';
    END IF;


    -- Select the schedules for the specified staff member
    SELECT Staff_Schedule.id,
           Staff_Schedule.schedule_date,
           Staff_Schedule.start_time,
           Staff_Schedule.end_time
    FROM Staff_Schedule
    WHERE Staff_Schedule.staff_id = para_staff_id AND schedule_date BETWEEN from_date AND to_date;

    -- Select the appointments for the specified staff member (assuming the staff member is a doctor)
    SELECT Appointments.id,
           Appointments.patient_id,
           Appointments.appointment_date,
           Appointments.start_time,
           Appointments.end_time
    FROM Appointments 
    WHERE doctor_id = para_staff_id AND appointment_date BETWEEN from_date AND to_date;
    SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAppointmentsAndSchedulesByStaffByDate TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAppointmentsAndSchedulesByStaffByDate TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAppointmentsAndSchedulesByStaffByDate TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAppointmentsAndSchedulesByStaffByDate TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAppointmentsAndSchedulesByStaffByDate TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS GetOwnAppointmentsAndSchedules$$
CREATE PROCEDURE GetOwnAppointmentsAndSchedules(
    para_staff_id INT           -- Parameter for the ID of the staff trying to fetch his schedules
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    



    -- Select the schedules for the specified staff member
    SELECT Staff_Schedule.id,
           Staff_Schedule.schedule_date,
           Staff_Schedule.start_time,
           Staff_Schedule.end_time
    FROM Staff_Schedule
    WHERE Staff_Schedule.staff_id = para_staff_id;

    -- Select the appointments for the specified staff member (assuming the staff member is a doctor)
    SELECT Appointments.id,
           Appointments.patient_id,
           Appointments.appointment_date,
           Appointments.start_time,
           Appointments.end_time
    FROM Appointments
    WHERE doctor_id = para_staff_id;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedules TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedules TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedules TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedules TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedules TO 'HR'@'%'$$


DROP PROCEDURE IF EXISTS GetOwnAppointmentsAndSchedulesByDates$$
CREATE PROCEDURE GetOwnAppointmentsAndSchedulesByDates(
    para_staff_id INT,           -- Parameter for the ID of the staff trying to fetch his schedules
    from_date DATE,
    to_date DATE
)
SQL SECURITY DEFINER
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    
	IF from_date = NULL THEN
		SET from_date = '1000-01-01';
	END IF;
    
    IF end_date = NULL THEN
		SET to_date = '9999-12-31';
    END IF;

    -- Select the schedules for the specified staff member
    SELECT Staff_Schedule.id,
           Staff_Schedule.schedule_date,
           Staff_Schedule.start_time,
           Staff_Schedule.end_time
    FROM Staff_Schedule
    WHERE Staff_Schedule.staff_id = para_staff_id AND schedule_date BETWEEN from_date AND to_date;

    -- Select the appointments for the specified staff member (assuming the staff member is a doctor)
    SELECT Appointments.id,
           Appointments.patient_id,
           Appointments.appointment_date,
           Appointments.start_time,
           Appointments.end_time
    FROM Appointments
    WHERE doctor_id = para_staff_id AND appointment_date BETWEEN from_date AND to_date;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedulesByDates TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedulesByDates TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedulesByDates TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedulesByDates TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetOwnAppointmentsAndSchedulesByDates TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS Scheduling$$
CREATE PROCEDURE Scheduling(
    manager_id INT,                -- Parameter for the ID of the manager scheduling the staff
    para_staff_id INT,             -- Parameter for the ID of the staff being scheduled
    schedule_string TEXT           -- Parameter for the schedule string
)
SQL SECURITY DEFINER
BEGIN
	DECLARE current_index INT DEFAULT 1;          -- Variable to track the current position in the schedule string
    DECLARE current_string_index TEXT DEFAULT ''; -- Variable to accumulate the current schedule entry being processed
    DECLARE error_message TEXT;                   -- Variable to store error messages
    DECLARE returned TEXT;                        -- Variable to store returned values from parsing functions
    DECLARE returned_statement TEXT;              -- Variable to store the parsed SQL statement
    DECLARE original_insert_statement TEXT DEFAULT 'INSERT INTO Staff_Schedule (staff_id, schedule_date, start_time, end_time) VALUES ';
    DECLARE original_update_statement TEXT DEFAULT 'UPDATE Staff_Schedule SET ';

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		ROLLBACK;
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
	SET @parent_proc = TRUE;

    -- Check if the manager is authorized to schedule the staff member
    IF NOT CheckManagementRelationship(para_staff_id, manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to schedule for this staff';
    END IF;

    SET @insert_statement = 'INSERT INTO Staff_Schedule (staff_id, schedule_date, start_time, end_time) VALUES ';
    SET @update_statement = 'UPDATE Staff_Schedule SET ';
    SET @update_statement_start_time = 'start_time = CASE \n';
    SET @update_statement_end_time = 'end_time = CASE \n';
    SET @update_where_statement = 'WHERE id IN (';

    -- Start a transaction to ensure that all operations succeed or fail together
    START TRANSACTION;

    -- Loop through each character in the schedule_string
    WHILE current_index <= LENGTH(schedule_string) DO
        -- Check if the current character is a comma, indicating the end of a schedule entry
        IF SUBSTRING(schedule_string, current_index, 1) = ',' THEN
			SELECT ParseScheduleString(para_staff_id, current_string_index, 0) INTO returned;
            SET returned_statement = SUBSTRING_INDEX(returned, '/', -1);
            IF SUBSTRING_INDEX(returned, '/', 1) = '1' THEN
                -- Insert new schedule
				SET @insert_statement = CONCAT(@insert_statement, returned_statement, '),');
            ELSE
                -- Update existing schedule
				SET @update_where_statement = CONCAT(@update_where_statement, SUBSTRING_INDEX(returned_statement, ';', 1), ', ');
				SET @update_statement_start_time = CONCAT(@update_statement_start_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', 1), '\n');
				SET @update_statement_end_time = CONCAT(@update_statement_end_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', -1), '\n');
            END IF;
            -- Reset the accumulated schedule entry string for the next iteration
            SET current_string_index = '';
        ELSE
            -- If the current character is not a comma, accumulate it as part of the schedule entry
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(schedule_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- Handle the last schedule entry after the loop ends
    SELECT ParseScheduleString(para_staff_id, current_string_index, 1) INTO returned;
    SET returned_statement = SUBSTRING_INDEX(returned, '/', -1);
    IF SUBSTRING_INDEX(returned, '/', 1) = '1' THEN
		SET @insert_statement = CONCAT(@insert_statement, returned_statement, ');');
    ELSE
		SET @update_where_statement = CONCAT(@update_where_statement, SUBSTRING_INDEX(returned_statement, ';', 1), ');');
		SET @update_statement_start_time = CONCAT(@update_statement_start_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', 1), '\n', 'ELSE start_time \n END,\n');
		SET @update_statement_end_time = CONCAT(@update_statement_end_time, SUBSTRING_INDEX(SUBSTRING_INDEX(returned_statement, ';', -1), '-', -1), '\n', 'ELSE end_time \n END\n');
		SET @update_statement = CONCAT(@update_statement, @update_statement_start_time, @update_statement_end_time, @update_where_statement);
    END IF;
    SELECT returned_statement;
    SELECT @update_statement_start_time;
    SELECT @update_statement_end_time;
    SELECT @update_where_statement;

    -- Execute insert statement if necessary
    IF original_insert_statement <> @insert_statement THEN
		PREPARE insert_statement FROM @insert_statement;
		EXECUTE insert_statement;
		DEALLOCATE PREPARE insert_statement;
    END IF;
	
    SELECT @update_statement;
    -- Execute update statement if necessary
    IF original_update_statement <> @update_statement THEN
		PREPARE update_statement FROM @update_statement;
		EXECUTE update_statement;
		DEALLOCATE PREPARE update_statement;
    END IF;
	SET @parent_proc = NULL;
    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.Scheduling TO 'HR'@'%'$$


DROP PROCEDURE IF EXISTS DeleteSchedules$$
CREATE PROCEDURE DeleteSchedules(
	para_staff_id INT,             -- Parameter for the ID of the staff whose schedules are to be deleted
    para_manager_id INT,           -- Parameter for the ID of the manager deleting the schedules
    schedule_id_string TEXT        -- Parameter for the string of schedule IDs to be deleted
)
SQL SECURITY DEFINER
BEGIN
    DECLARE current_index INT DEFAULT 1;          -- Variable to track the current position in the schedule ID string
    DECLARE current_string_index TEXT DEFAULT ''; -- Variable to accumulate the current schedule ID being processed

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		ROLLBACK;
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
	SET @parent_proc = TRUE;

    -- Check if the manager is authorized to delete schedules for the staff member
    IF NOT CheckManagementRelationship(para_staff_id, para_manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to make changes to this staff schedule';
    END IF;

    -- Initialize the base DELETE statement
    SET @delete_query = 'DELETE FROM Staff_Schedule WHERE id IN (';
    SET @single_value = '';  -- Variable to store the individual schedule ID to delete


    -- Start a transaction to ensure that all operations succeed or fail together
    START TRANSACTION;

    -- Loop through each character in the schedule_id_string
    WHILE current_index <= LENGTH(schedule_id_string) DO
        -- Check if the current character is a comma, indicating the end of a schedule ID
        IF SUBSTRING(schedule_id_string, current_index, 1) = ',' THEN
            -- Process the current schedule ID
            SELECT ParsingScheduleIdString(current_string_index, 0) INTO @single_value;

            -- Append the processed value to the DELETE query
            SET @delete_query = CONCAT(@delete_query, @single_value);

            -- Reset the accumulated schedule ID string for the next iteration
            SET current_string_index = '';
        ELSE
            -- If the current character is not a comma, accumulate it as part of the schedule ID
            SET current_string_index = CONCAT(current_string_index, SUBSTRING(schedule_id_string, current_index, 1));
        END IF;

        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- Handle the last schedule ID after the loop ends
    IF current_string_index != '' THEN
        -- Process the current schedule ID
		SELECT ParsingScheduleIdString(current_string_index, 1) INTO @single_value;
		-- Append the processed value to the DELETE query
		SET @delete_query = CONCAT(@delete_query, @single_value);
    END IF;

    -- Prepare and execute the final DELETE query
    PREPARE statement FROM @delete_query;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
	SET @parent_proc = NULL;
    -- Commit the transaction to finalize the changes in the database
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.DeleteSchedules TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS FetchStaffQualifications$$
CREATE PROCEDURE FetchStaffQualifications(para_manager_id INT, para_staff_id INT)
SQL SECURITY DEFINER
BEGIN
 BEGIN
        DECLARE returned_sqlstate CHAR(5) DEFAULT '';
        DECLARE returned_message TEXT;
        ROLLBACK;

        -- Retrieve the SQLSTATE of the current exception
        GET STACKED DIAGNOSTICS CONDITION 1
            returned_sqlstate = RETURNED_SQLSTATE,
            returned_message = MESSAGE_TEXT;
		
        -- Check if the SQLSTATE is '45000'
        IF returned_sqlstate = '45000' THEN
            -- Resignal with the original message
            RESIGNAL;
        ELSE
            -- Set a custom error message and resignal with SQLSTATE '45000'
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
        END IF;
    END;
    SET @parent_proc = TRUE;
	-- Check if the manager is authorized to view the evaluations for the staff member
	IF NOT CheckManagementRelationship(para_staff_id, para_manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to view this staff';
    END IF;
    
    SELECT document_id FROM Qualifications WHERE staff_id = para_staff_id;
    SET @parent_proc = FALSE;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffQualifications TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffQualifications TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffQualifications TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffQualifications TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.FetchStaffQualifications TO 'HR'@'%'$$


DROP PROCEDURE IF EXISTS StaffEvaluate$$
CREATE PROCEDURE StaffEvaluate(
	para_manager_id INT,         -- Parameter for the ID of the manager performing the evaluation
    para_staff_id INT,           -- Parameter for the ID of the staff being evaluated
    evaluation_string TEXT       -- Parameter for the string containing evaluation criteria and scores
)
SQL SECURITY DEFINER
BEGIN
    -- Declare variables to be used in the procedure
    DECLARE latest_evaluation_id INT;             -- Variable to store the ID of the newly inserted evaluation
    DECLARE current_index INT DEFAULT 1;          -- Variable to keep track of the current position in the evaluation string
    DECLARE current_string_code TEXT DEFAULT '';  -- Variable to accumulate the current evaluation criteria and score being processed

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		ROLLBACK;
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    SET @parent_proc = TRUE;

	-- Check if the manager is authorized to evaluate the staff member
	IF NOT CheckManagementRelationship(para_staff_id, para_manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to evaluate this staff';
    END IF;

    -- Start a transaction to ensure that all operations either succeed or fail together
    START TRANSACTION;

    -- Insert a new record into the PerformanceEvaluation table
    INSERT INTO PerformanceEvaluation (evaluator_staff_id, evaluated_staff_id, evaluation_date)
    VALUES (para_manager_id, para_staff_id, CURDATE());
    SELECT LAST_INSERT_ID() INTO latest_evaluation_id;

    -- Initialize the base SQL INSERT statement for the EvaluationCriteria table
    SET @insert_query = 'INSERT INTO EvaluationCriteria (evaluation_id, criteria_id, criteria_score) VALUES ';
    
    -- Loop through the evaluation_string to process each criteria and score
    WHILE current_index <= LENGTH(evaluation_string) DO
        -- Check if the current character is a comma, indicating the end of a criteria and score pair
        IF SUBSTRING(evaluation_string, current_index, 1) = ',' THEN
            -- Process the current criteria and score
            SELECT ParsingCriteriaScoreString(latest_evaluation_id, current_string_code, 0) INTO @single_value;
            -- Append the processed value to the INSERT query
            SET @insert_query = CONCAT(@insert_query, @single_value);
            -- Reset the accumulated criteria and score string for the next iteration
            SET current_string_code = '';
        ELSE
            -- Accumulate the current criteria and score character
            SET current_string_code = CONCAT(current_string_code, SUBSTRING(evaluation_string, current_index, 1));
        END IF;
        -- Move to the next character in the string
        SET current_index = current_index + 1;
    END WHILE;

    -- Process the last criteria and score in the string
    SELECT ParsingCriteriaScoreString(latest_evaluation_id, current_string_code, 1) INTO @single_value;
    -- Append the final processed value to the INSERT query
    SET @insert_query = CONCAT(@insert_query, @single_value);

    -- Prepare and execute the final INSERT statement for EvaluationCriteria
    PREPARE statement FROM @insert_query;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
	SET @parent_proc = NULL;
    -- Commit the transaction to save all changes
    COMMIT;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.StaffEvaluate TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.StaffEvaluate TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.StaffEvaluate TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.StaffEvaluate TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.StaffEvaluate TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS GetAllPerformanceEvaluationByStaff$$
CREATE PROCEDURE GetAllPerformanceEvaluationByStaff(
	para_manager_id INT,         -- Parameter for the ID of the manager requesting the evaluations
    para_staff_id INT            -- Parameter for the ID of the staff whose evaluations are to be fetched
)
SQL SECURITY DEFINER
BEGIN
     DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;
            
		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
	SET @parent_proc = TRUE;
	-- Check if the manager is authorized to view the evaluations for the staff member
	IF NOT CheckManagementRelationship(para_staff_id, para_manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to view this staff';
    END IF;

    -- Select the evaluations for the specified staff member
    WITH subquery AS (
		SELECT PerformanceEvaluation.id, 
				Staff.full_name AS manager,
				PerformanceEvaluation.evaluated_staff_id,
                PerformanceEvaluation.evaluation_date
		FROM PerformanceEvaluation
        INNER JOIN Staff
        ON PerformanceEvaluation.evaluator_staff_id = Staff.id
        WHERE evaluated_staff_id = para_staff_id
    )
    SELECT 
		subquery.id, 
		subquery.manager, 
		Staff.full_name AS evaluated_staff, 
        subquery.evaluation_date 
    FROM subquery 
    INNER JOIN Staff 
    ON subquery.evaluated_staff_id = Staff.id;
    SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaff TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaff TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaff TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaff TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaff TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS GetAllPerformanceEvaluationByStaffByDates$$
CREATE PROCEDURE GetAllPerformanceEvaluationByStaffByDates(
	para_manager_id INT,         -- Parameter for the ID of the manager requesting the evaluations
    para_staff_id INT,            -- Parameter for the ID of the staff whose evaluations are to be fetched
    from_date DATE,
    to_date DATE
)
SQL SECURITY DEFINER
BEGIN
     DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;
            
		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    
	IF from_date = NULL THEN
		SET from_date = '1000-01-01';
	END IF;
    
    IF end_date = NULL THEN
		SET to_date = '9999-12-31';
    END IF;
    
	SET @parent_proc = TRUE;
	-- Check if the manager is authorized to view the evaluations for the staff member
	IF NOT CheckManagementRelationship(para_staff_id, para_manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to view this staff';
    END IF;

    -- Select the evaluations for the specified staff member
    WITH subquery AS (
		SELECT PerformanceEvaluation.id, 
				Staff.full_name AS manager,
				PerformanceEvaluation.evaluated_staff_id,
                PerformanceEvaluation.evaluation_date
		FROM PerformanceEvaluation
        INNER JOIN Staff
        ON PerformanceEvaluation.evaluator_staff_id = Staff.id
        WHERE evaluated_staff_id = para_staff_id AND evaluation_date BETWEEN from_date AND to_date
    )
    SELECT 
		subquery.id, 
		subquery.manager, 
		Staff.full_name AS evaluated_staff, 
        subquery.evaluation_date 
    FROM subquery 
    INNER JOIN Staff 
    ON subquery.evaluated_staff_id = Staff.id;
    SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaffByDates TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaffByDates TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaffByDates TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaffByDates TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetAllPerformanceEvaluationByStaffByDates TO 'HR'@'%'$$

DROP PROCEDURE IF EXISTS GetEvaluationDetails$$
CREATE PROCEDURE GetEvaluationDetails(
	para_manager_id INT,         -- Parameter for the ID of the manager requesting the evaluation details
	para_evaluation_id INT       -- Parameter for the ID of the evaluation whose details are to be fetched
)
SQL SECURITY DEFINER
BEGIN
	DECLARE para_staff_id INT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		DECLARE returned_sqlstate CHAR(5) DEFAULT '';
		-- Retrieve the SQLSTATE of the current exception
		GET STACKED DIAGNOSTICS CONDITION 1
			returned_sqlstate = RETURNED_SQLSTATE;

		-- Check if the SQLSTATE is '45000'
		IF returned_sqlstate = '45000' THEN
			-- Resignal with the original message
			RESIGNAL;
		ELSE
			-- Set a custom error message and resignal with SQLSTATE '45000'
			SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Something is wrong. Please try again.';
		END IF;
	END;
    SET @parent_proc = TRUE;

	-- Check if the evaluation exists
	IF NOT CheckEvaluationExists(para_evaluation_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Evaluation does not exist. Please try again';
    END IF;
    
    SELECT staff_id INTO para_staff_id FROM PerformanceEvaluation WHERE id = para_evaluation_id;

	-- Check if the manager is authorized to view the evaluation details for the staff member
    IF NOT CheckManagementRelationship(para_staff_id, para_manager_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to view this staff';
    END IF;

    -- Select the evaluation criteria and scores for the specified evaluation
    SELECT EvaluationCriteria.evaluation_id,
			Criteria.id,
            Criteria.criteria_name,
            Criteria.criteria_description,
            EvaluationCriteria.criteria_score
	FROM EvaluationCriteria 
    INNER JOIN Criteria
    ON EvaluationCriteria.criteria_id = Criteria.id
    WHERE EvaluationCriteria.evaluation_id = para_evaluation_id;
    SET @parent_proc = NULL;
END$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetEvaluationDetails TO 'Doctors'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetEvaluationDetails TO 'BusinessOfficers'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetEvaluationDetails TO 'Nurses'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetEvaluationDetails TO 'FrontDesk'@'%'$$
GRANT EXECUTE ON PROCEDURE hospital_management_system.GetEvaluationDetails TO 'HR'@'%'$$
