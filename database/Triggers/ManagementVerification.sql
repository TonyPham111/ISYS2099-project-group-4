DELIMITER $$
CREATE TRIGGER VerifyingManagementRelationshipForScheduling
BEFORE INSERT ON Staff_Schedule
FOR EACH ROW
BEGIN
  	-- Check if the manager is authorized to evaluate the staff member
	IF NOT CheckManagementRelationship(@para_management_id, para_emloyee_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to evaluate this staff';
    END IF;

END$$

CREATE TRIGGER VerifyingManagementRelationshipForEvaluation
BEFORE INSERT ON PerformanceEvaluation
FOR EACH ROW
BEGIN
  	-- Check if the manager is authorized to evaluate the staff member
	IF NOT CheckManagementRelationship(@para_management_id, para_emloyee_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to evaluate this staff';
    END IF;

END$$

CREATE TRIGGER VerifyingManagementRelationshipForSchedulingDeleting
BEFORE DELETE ON Staff_Schedule
FOR EACH ROW
BEGIN
  	-- Check if the manager is authorized to evaluate the staff member
	IF NOT CheckManagementRelationship(@para_management_id, para_emloyee_id) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have the authority to evaluate this staff';
    END IF;

END$$



DELIMITER ;