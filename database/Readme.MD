
<!-- Create Full text Indexes for staff full names and patient names -->

ALTER TABLE Staff ADD FULLTEXT INDEX idx_staff_fullname (first_name, last_name);
ALTER TABLE Patients ADD FULLTEXT INDEX idx_patient_name (first_name, last_name);

<!-- Create index for drugs, allergies (using ids) -->
ALTER TABLE Drugs ADD INDEX idx_drug_id (drug_id);
ALTER TABLE Allergies ADD INDEX idx_allergy_id (allergy_id);


<!-- Appointment Dates (Appointments) Staffid(Appointments) -->
In what order? 
Merge or Separate? 
ALTER TABLE Appointments ADD INDEX idx_appointment_staff_date (staff_id, appointment_date);


<!-- Staffid( Staff Schedule) ScheduleDate(Staff Schedule) -->
In what order? 
Merge or Separate? 
ALTER TABLE StaffSchedule ADD INDEX idx_staff_schedule_date (staff_id, schedule_date);
 

<!-- DepartmentId (Staff)  -->
ALTER TABLE Staff ADD INDEX idx_department_id (department_id);
 
<!-- Appointments Endtime Starttime (Appointments) -->
ALTER TABLE Appointments ADD INDEX idx_appointment_time (start_time, end_time);


Concurrencies:
- When 2 doctors are perscribing at the same time ( Select for Update)
- When scheduling 2 different meeting with 1 doctor at the same time
- When scheduling a meeting with a doctor who just changed his department (or be demoted)
