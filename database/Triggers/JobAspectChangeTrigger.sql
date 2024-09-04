DELIMITER $$
DROP TRIGGER IF EXISTS before_wage_change_insert$$
CREATE TRIGGER Update_Job_Aspects
BEFORE UPDATE ON Staff
FOR EACH ROW
BEGIN
    DECLARE max_job_wage DECIMAL(6,2);
    DECLARE min_job_wage DECIMAL(6,2);
    
    IF @aspect IS NOT NULL THEN
		IF @aspect = 'Wage' OR @aspect = 'Job' THEN
			-- Retrieve the max and min wages for the given job
			SELECT Jobs.max_wage, Jobs.min_wage
			INTO max_job_wage, min_job_wage
			FROM Jobs
			WHERE Jobs.id = New.job_id;

			-- Check if the new wage falls within the correct wage range
			IF NEW.wage > max_job_wage OR NEW.wage < min_job_wage THEN
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Wage does not fall within the correct range';
			END IF;	
		END IF;
            
		IF @aspect = 'Department' OR @aspect = 'Job' THEN
			IF NOT CheckDepartmentExists(NEW.department_id) THEN
					SIGNAL SQLSTATE '45000'
					SET MESSAGE_TEXT = 'Incorrect department id. Please check your input';
			END IF;
			IF ((NEW.job_id = 1 OR NEW.job_id = 2) AND NEW.department_id = 13) OR (NEW.job_id > 2 AND NEW.department_id < 13) THEN
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Incompatible job and department. Please try again';
			END IF;
			IF NEW.manager_id IS NOT NULL THEN
				IF NOT CheckManagerDepartmentAndJob(NEW.manager_id, NEW.department_id, NEW.job_id) THEN
					SIGNAL SQLSTATE '45000'
					SET MESSAGE_TEXT = 'Manager cannot be found for this department and job. Please try again';
				END IF;
			END IF;
		END IF;
		
        IF @aspect = 'Job' THEN
			IF NOT CheckJobExists(NEW.job_id) THEN
				SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Cannot find job id. Please try again';
            END IF;
        END IF;
        
    END IF;
END$$
DELIMITER ;