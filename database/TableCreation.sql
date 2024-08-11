CREATE DATABASE hospital_management_system;
USE hospital_management_system;

CREATE TABLE Patients (
	id INT PRIMARY KEY,
    ssn INT UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(50),
    home_address VARCHAR(255) NOT NULL);

CREATE TABLE Allergies (
	code CHAR(7) PRIMARY KEY,
    name VARCHAR(50),
    description TEXT);

CREATE TABLE PatientAllergy (
	allergy_code CHAR(7),
    patient_id INT,
    record_date DATE NOT NULL,
	PRIMARY KEY (allergy_code, patient_id),
    FOREIGN KEY (allergy_code) REFERENCES Allergies (code),
    FOREIGN KEY (patient_id) REFERENCES Patients (id) ON DELETE CASCADE    
);

CREATE TABLE Diagnoses (
	code CHAR(7) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE Departments (
	id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Jobs (
	id INT PRIMARY KEY,
    name VARCHAR(50),
    min_wage DECIMAL(6,2) NOT NULL,
    max_wage DECIMAL(6,2) NOT NULL,
    description TEXT,
    job_document_id VARCHAR(24) NOT NUll
);

CREATE TABLE Staff(
	id INT PRIMARY KEY,
    ssn INT UNIQUE,
    manager_id INT,
    department_id INT,
    job_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL, 
    gender ENUM('M', 'F') NOT NULL,
    birth_date DATE NOT NULL,
    home_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    wage DECIMAL(6,2),
    hire_date DATE NOT NULL,
    employment_type ENUM ('Full_Time', 'Shift_Based'),
    employment_status ENUM ('Active', 'Terminated'),
    job_change_history_document_id VARCHAR(24) NOT NULL,
    employment_document_id VARCHAR(24) NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES Staff(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES Departments (id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES Jobs (id) ON DELETE SET NULL);




CREATE TABLE Appointments (
	id INT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    document_id VARCHAR(24),
    appointment_purpose TEXT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    appointment_charge DECIMAL(6,2) NOT NULL,
    appointment_notes_document_id VARCHAR(24) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (doctor_id) REFERENCES Staff (id)    
);


CREATE TABLE TreatmentHistory (
	id INT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    treatment_start_date DATE NOT NULL,
    treatment_end_date DATE NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (doctor_id) REFERENCES Staff (id)
);

CREATE TABLE TreatmentDiagnoses (
	treatment_id INT,
    diagnosis_code CHAR(7),
    PRIMARY KEY (treatment_id, diagnosis_code),
    FOREIGN KEY (treatment_id) REFERENCES TreatmentHistory(id),
    FOREIGN KEY (diagnosis_code) REFERENCES Diagnoses (code)
);

CREATE TABLE Drugs (
	code CHAR(7) PRIMARY KEY,
    name VARCHAR(50),
    unit ENUM('capsule', 'tablet', 'patch', 'bottle', 'injection', 'mg', 'ml', 'tube'),
    price_per_unit DECIMAL(6,2)
);

CREATE TABLE Prescriptions(
	id INT PRIMARY KEY,
    treatment_id INT,
    prescription_date DATE NOT NULL,
    FOREIGN KEY (treatment_id) REFERENCES TreatmentHistory (id),
    prescription_note_document_id VARCHAR(24) NOT NULL
);

CREATE TABLE Prescription_Details (
	drug_code CHAR(7),
    prescription_id INT,
    quantity INT NOT NULL,
    unit ENUM('capsule', 'tablet', 'patch', 'bottle', 'injection', 'mg', 'ml', 'tube'), 
    price DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (prescription_id, drug_code),
    FOREIGN KEY (prescription_id) REFERENCES Prescriptions(id),
    FOREIGN KEY (drug_code) REFERENCES Drugs (code)
    
);

CREATE TABLE Test_Types(
	id INT PRIMARY KEY,
    test_name VARCHAR(5) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    description TEXT
);

CREATE TABLE Tests (
	id INT PRIMARY KEY,
    patient_id INT,
    administrating_staff_id INT,
    ordering_staff_id INT,
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (administrating_staff_id) REFERENCES Staff(id),
    FOREIGN KEY (ordering_staff_id) REFERENCES Staff(id)
    
);

CREATE TABLE Test_Details (
	test_id INT,
    test_type_id INT,
    lab_result_document_id VARCHAR(24) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (test_id, test_type_id),
    FOREIGN KEY (test_id) REFERENCES Tests (id),
    FOREIGN KEY (test_type_id) REFERENCES Test_Types (id)
);

CREATE TABLE Billings (
	id INT PRIMARY KEY,
    patient_id INT,
    billing_date DATE NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    appointment_id INT,
    test_id INT,
    prescription_id INT,
    FOREIGN KEY (appointment_id) REFERENCES Appointments (id),
    FOREIGN KEY (prescription_id) REFERENCES Prescriptions (id),
    FOREIGN KEY (test_id) REFERENCES Tests(id),
	FOREIGN KEY (patient_id) REFERENCES Patients (id)
);

CREATE TABLE Doctor_Schedule (
	id INT PRIMARY KEY,
    doctor_id INT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES Staff(id)
);
