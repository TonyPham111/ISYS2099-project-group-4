CREATE DATABASE hospital_management_system;
USE hospital_management_system;

CREATE TABLE Patients (
	id INT AUTO_INCREMENT PRIMARY KEY,
    ssn INT UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(50),
    home_address VARCHAR(255) NOT NULL);

CREATE TABLE Allergies (
    id INT AUTO_INCREMENT PRIMARY KEY,
	icd9_code CHAR(7),
    name VARCHAR(50),
    allergy_group VARCHAR(20)
    allergent VARCHAR(20),
    type VARCHAR(20)
);

CREATE TABLE PatientAllergy (
	allergy_id INT,
    patient_id INT,
    record_date DATE NOT NULL,
	PRIMARY KEY (allergy_id, patient_id),
    FOREIGN KEY (allergy_id) REFERENCES Allergies (id),
    FOREIGN KEY (patient_id) REFERENCES Patients (id) ON DELETE CASCADE    
);

CREATE TABLE Conditions (
	code CHAR(7) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE Departments (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Jobs (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    min_wage DECIMAL(6,2) NOT NULL,
    max_wage DECIMAL(6,2) NOT NULL,
    description TEXT,
    job_document_id VARCHAR(24) NOT NUll
);

CREATE TABLE Staff(
	id INT AUTO_INCREMENT PRIMARY KEY,
    ssn INT UNIQUE NOT NULL,
    manager_id INT NOT NULL,
    department_id INT NOT NULL,
    job_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL, 
    gender ENUM('M', 'F') NOT NULL,
    birth_date DATE NOT NULL,
    home_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    staff_password VARCHAR(12) NOT NULL,
    wage DECIMAL(6,2),
    hire_date DATE NOT NULL,
    employment_type ENUM ('Full_Time', 'Shift_Based') NOT NULL,
    employment_status ENUM ('Active', 'Terminated') NOT NULL,
    employment_document_id VARCHAR(24) NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES Staff(id),
    FOREIGN KEY (department_id) REFERENCES Departments (id),
    FOREIGN KEY (job_id) REFERENCES Jobs (id) ON DELETE SET NULL);


CREATE TABLE Staff_Schedule (
	id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    note TEXT NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES Staff(id)
);

CREATE TABLE Appointments (
	id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_purpose TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    appointment_charge DECIMAL(6,2) NOT NULL,
    schedule_id INT NOT NULL,
    status ENUM('Active', "Finished", 'Cancelled') NOT NULL,
    appointment_notes_document_id VARCHAR(24) NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES Staff_Schedule (id),
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (doctor_id) REFERENCES Staff (id)    
);

CREATE TABLE Diagnoses (
	id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis_date DATE NOT NULL,
    diagnosis_note TEXT,
    FOREIGN KEY (doctor_id) REFERENCES Staff (id)
);

CREATE TABLE DiagnosesDetails (
    diagnosis_id INT,
    condition_code CHAR(7),
    PRIMARY KEY (diagnosis_id, condition_code),
    FOREIGN KEY (diagnosis_id) REFERENCES Diagnoses (id),
    FOREIGN KEY (condition_code) REFERENCES Conditions (code)
);


CREATE TABLE TreatmentHistory (
	id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    diagnosis_id INT,
    treatment_start_date DATETIME NOT NULL,
    treatment_start_time TIME NOT NULL,
    treatment_end_date DATETIME NOT NULL,
    treatment_end_time TIME NOT NULL,
    FOREIGN kEY (diagnosis_id) REFERENCES Diagnoses (id),
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (doctor_id) REFERENCES Staff (id)
);


CREATE TABLE Drugs (
	code CHAR(7) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    inventory INT NOT NULL,
    unit ENUM('capsule', 'tablet', 'patch', 'bottle', 'injection', 'mg', 'ml', 'tube'),
    price_per_unit DECIMAL(6,2)
);


CREATE TABLE Prescription_Details (
	drug_code CHAR(7),
    prescription_id INT,
    quantity INT NOT NULL,
    unit ENUM('capsule', 'tablet', 'patch', 'bottle', 'injection', 'mg', 'ml', 'tube'), 
    price DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (prescription_id, drug_code),
    FOREIGN KEY (prescription_id) REFERENCES TreatmentHistory(id),
    FOREIGN KEY (drug_code) REFERENCES Drugs (code)
    
);

CREATE TABLE Test_Types(
	id INT PRIMARY KEY AUTO_INCREMENT,
    test_name VARCHAR(5) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    description TEXT
);

CREATE TABLE Tests (
	id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    ordering_staff_id INT,
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (ordering_staff_id) REFERENCES Staff(id)
    
);

CREATE TABLE Test_Details (
	test_id INT,
    test_type_id INT,
    administrating_staff_id INT,
    administrating_date INT,
    lab_result_document_id VARCHAR(24) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (test_id, test_type_id),
    FOREIGN KEY (test_id) REFERENCES Tests (id),
    FOREIGN KEY (test_type_id) REFERENCES Test_Types (id),
     FOREIGN KEY (administrating_staff_id) REFERENCES Staff(id)
);

CREATE TABLE Billings (
	id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    billing_date DATE NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    appointment_id INT,
    test_id INT,
    prescription_id INT,
    FOREIGN KEY (appointment_id) REFERENCES Appointments (id),
    FOREIGN KEY (prescription_id) REFERENCES TreatmentHistory (id),
    FOREIGN KEY (test_id) REFERENCES Tests(id),
	FOREIGN KEY (patient_id) REFERENCES Patients (id)
);



CREATE TABLE Salary_Change(
    staff_id INT,
    wage_change_from DECIMAL(6,2),
    wage_change_to DECIMAL(6,2),
    date_change DATE,
    PRIMARY KEY (staff_id, wage_change_from, wage_change_to, date_change),
    FOREIGN KEY (staff_id) REFERENCES Staff (id)
);

CREATE TABLE Job_Movement(
	staff_id INT,
    job_id_from INT,
    job_id_to INT,
    date_change DATE,
    PRIMARY KEY (staff_id, job_id_from, job_id_to, date_change),
    FOREIGN KEY (staff_id) REFERENCES Staff (id),
    FOREIGN KEY (job_id_from) REFERENCES Jobs (id),
    FOREIGN KEY (job_id_to) REFERENCES Jobs (id)
);