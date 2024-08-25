CREATE PROCEDURE GetStaffUnderManager(
    IN managerId INT
)
BEGIN
    SELECT 
        s.id AS staff_id,
        s.full_name,
        s.gender,
        s.birth_date,
        s.email,
        s.job_id,
        s.department_id,
        s.wage,
        s.hire_date,
        s.employment_type,
        s.employment_status,
        j.job_name,
        d.department_name,
        pe.id AS evaluation_id,
        pe.evaluation_date,
        ec.criteria_id,
        c.criteria_name,
        c.criteria_description,
        ec.criteria_score
    FROM 
        Staff s
    INNER JOIN 
        Jobs j ON s.job_id = j.id
    INNER JOIN 
        Departments d ON s.department_id = d.id
    LEFT JOIN 
        PerformanceEvaluation pe ON s.id = pe.evaluated_staff_id
    LEFT JOIN 
        EvaluationCriteria ec ON pe.id = ec.evaluation_id
    LEFT JOIN 
        Criteria c ON ec.criteria_id = c.id
    WHERE 
        s.manager_id = managerId;
END$$

