USE hospital_management_system;
CREATE INDEX idx_doctor_appointment_date 
ON Appointments (appointment_date, doctor_id);

CREATE INDEX idx_staff_schedule_date 
ON Staff_Schedule (staff_id, schedule_date);

CREATE INDEX idx_treatment_start_date 
ON TreatmentHistory (treatment_start_date);


-- Create an index on billing_date
CREATE INDEX idx_billing_date 
ON Billings (billing_date);

-- Create an index on total_amount
CREATE INDEX idx_total_amount 
ON Billings (total_amount);

-- Create an index on hire_date
CREATE INDEX idx_hire_date 
ON Staff (hire_date);

-- Create an index on wage
CREATE INDEX idx_wage 
ON Staff (wage);

ALTER TABLE Salary_Change ADD INDEX idx_date_change_salary (date_change);
ALTER TABLE Job_Movement ADD INDEX idx_date_change_job (date_change);
ALTER TABLE Department_Change ADD INDEX idx_date_change_department (date_change);
ALTER TABLE PerformanceEvaluation ADD INDEX idx_evaluation_date (evaluation_date);
ALTER TABLE Diagnoses ADD INDEX idx_diagnosis_date (diagnosis_date);
ALTER TABLE TreatmentHistory ADD INDEX idx_treatment_start_date (treatment_start_date);
ALTER TABLE Test_Details ADD INDEX idx_administering_date (administering_date);


 
 

