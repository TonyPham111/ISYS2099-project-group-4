CREATE USER 'Doctors'@'host' IDENTIFIED BY '1222132332ABCDEFG';
CREATE USER 'Nurses'@'host' IDENTIFIED BY '21213333444ABCDEFG';
CREATE USER 'FrontDesk'@'host' IDENTIFIED BY '22245629444ABC211G';
CREATE USER 'HR'@'host' IDENTIFIED BY '22245629444ACCD542';
CREATE USER 'BusinessOfficers' IDENTIFIED BY '22245629444ABDAKKK'



/*BusinessOfficers are allowed to view, insert, and update Billings table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Billings TO 'BusinessOfficers'@'host';

/*FrontDesk is allowed to select, insert, and update Patients*/
/*Doctors are allowed to view the Patients Table*/
/*Nurses are allowed to view the Patients Table*/
/*BusinessOfficer are allowed to view the Patients Table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Patients TO 'FrontDesk'@'host';
GRANT SELECT ON hospital_management_system.Patients TO 'Doctors'@'host';
GRANT SELECT ON hospital_management_system.Patients TO 'Nurses'@'host';
GRANT SELECT ON hospital_management_system.Patients TO 'BusinessOfficers'@'host';

/*FrontDesk are allowed to view, insert, and update the PatientAllergy Table*/
/*Doctors are allowed to view, insert, and update the PatientAllergy Table*/
/*Nurses are allowed to view, insert, and update the PatientAllergy Table*/
GRANT SELECT  ON hospital_management_system.PatientAllergy TO 'FrontDesk'@'host';
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.PatientAllergy TO 'Doctors'@'host';
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.PatientAllergy TO 'Nurses'@'host';

/*FrontDesks are allowed to view the allergies table*/
/*Doctors are allowed to view the allergies table*/
/*Nurses are allowed to view the allergies table*/
GRANT SELECT ON hospital_management_system.Allergies TO 'FrontDesk'@'host';
GRANT SELECT ON hospital_management_system.Allergies TO 'Doctors'@'host';
GRANT SELECT ON hospital_management_system.Allergies TO 'Nurses'@'host';

/*BusinessOfficers are allowed to view, insert, and update the Drugs table*/
/*Nurses and Doctors are allowed to view the Drugs table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Drugs TO 'BusinessOfficers'@'host';
GRANT SELECT ON hospital_management_system.Drugs TO 'Nurses'@'host';
GRANT SELECT ON hospital_management_system.Drugs TO 'Doctors'@'host';

/*Doctors and Nurses are allowed to view the Diagnoses table */
GRANT SELECT ON hospital_management_system.Diagnoses TO 'Doctors'@'host';
GRANT SELECT ON hospital_management_system.Diagnoses TO 'Nurses'@'host';

/*Doctors and Nurses are allowed to view the Conditions table */
GRANT SELECT ON hospital_management_system.Conditions TO 'Doctors'@'host';
GRANT SELECT ON hospital_management_system.Conditions TO 'Nurses'@'host';

/*Only Doctors are allowed to view, insert, and update the TreatmentHistory table*/
/*Nurse can only  view the TreatmentHistory Table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.TreatmentHistory TO 'Doctors'@'host';
GRANT SELECT ON hospital_management_system.TreatmentHistory TO 'Nurses'@'host';


/*Only Doctors are allowed to view, insert, and update the DiagnosesDetails Table*/
/*Nurse can only  view the TreatmentHistory Table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.DiagnosesDetails TO 'Doctors'@'host';
GRANT SELECT  ON hospital_management_system.DiagnosesDetails TO 'Nurses'@'host';


/*Only Doctors are allowed to view, insert, and update the PrescriptionDetail Table*/
/*Nurss are allowed to view the PrescriptionDetail Table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Prescription_Details TO 'Doctors'@'host';
GRANT SELECT ON hospital_management_system.Prescription_Details TO 'Nurses'@'host';

/*Only Doctors are allowed to view the Appointments Table*/
/*FrontDesk are allowed to view, insert, and update the Appointments Table*/
GRANT SELECT ON hospital_management_system.Appointments TO 'Doctors'@'host';
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Appointments TO 'FrontDesk'@'host';

/*Only HR is allowed to view, insert, and update the Staff table*/
/*Other staff types could only view their employee info via a procedure*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Staff TO 'HR'@'host';

/*Only HR is allowed to view, insert, and update the Departments, Jobs, Job_Movement, and Salary_Change tables*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Departments TO 'HR'@'host';
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Jobs TO 'HR'@'host';
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Job_Movement TO 'HR'@'host';
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Salary_Change TO 'HR'@'host';


/*FrontDesk is allowed to view, insert, and update the Doctor_Schedule table*/
/*Doctors are only allowed to view their respective row, which will be granted via procedure or view*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Doctor_Schedule TO 'FrontDesk'@'host';

/*BusinessOfficers are allowed to insert, view, and update the Test_Types table*/
/*Nurse and Doctors are allowed to view the Test_Types table*/
GRANT SELECT ON hospital_management_system.Test_Types TO 'Doctors'@'host';
GRANT SELECT ON hospital_management_system.Test_Types TO 'Nurses'@'host';
GRANT SELECT ON hospital_management_system.Test_Types TO 'BusinessOfficers'@'host';


/*Nurses are allowed to insert and update the Test_Details Table */
/*Doctors could only view the Test_Details Table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Test_Details TO 'Nurses'@'host';
GRANT SELECT ON hospital_management_system.Test_Details TO 'Doctors'@'host';

/*Doctors are allowed to insert, view, and update the Tests Table*/
/*Nurses could only view the Tests Table*/
GRANT SELECT, INSERT, UPDATE ON hospital_management_system.Tests TO 'Nurses'@'host';
GRANT SELECT ON hospital_management_system.Tests TO 'Nurses'@'host';


GRANT EXECUTE ON hospital_management_system.GetBillingDetails TO 'BusinessOfficers'@'host'
GRANT EXECUTE ON hospital_management_system.InsertNewBilling TO 'BusinessOfficers'@'host'





