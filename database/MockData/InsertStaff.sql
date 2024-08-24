CALL AddNewStaff(
    'John Doe',               -- para_full_name
    123456789,                -- para_ssn
    'Doctor',                 -- para_job_name
    'Neurology',              -- para_department_name
    NULL,                     -- para_manager_name
    'M',                      -- para_gender
    '1985-01-15',             -- para_birth_date
    '123 Main St, City, State, 12345', -- para_home_address
    '0901234567',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    9123.45,                  -- para_wage (random value between 8862.23 and 9863.3)
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);

CALL AddNewStaff(
    'Jane Smith',             
    987654321,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'F',                      
    '1990-04-25',             
    '456 Elm St, City, State, 67890', 
    '0902345678',             
    'janesmith@example.com',  
    'password123',            
    9584.76,                  
    'Full_Time',              
    'EMP09876543210987654321'
);

CALL AddNewStaff(
    'Alice Johnson',          
    112233445,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'F',                      
    '1980-07-20',             
    '789 Maple Ave, City, State, 13579', 
    '0903456789',             
    'alicejohnson@example.com',
    'mypassword',             
    9753.82,                  
    'Full_Time',              
    'EMP11223344556677889900'
);

CALL AddNewStaff(
    'Robert Brown',           
    554433221,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'M',                      
    '1975-03-10',             
    '1010 Oak St, City, State, 24680', 
    '0904567890',             
    'robertbrown@example.com',
    'password456',            
    8950.67,                  
    'Full_Time',              
    'EMP55443322199887766554'
);

CALL AddNewStaff(
    'Emily Davis',            
    667788990,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'F',                      
    '1988-09-05',             
    '1212 Pine St, City, State, 36912', 
    '0905678901',             
    'emilydavis@example.com', 
    'passw0rd',               
    9234.21,                  
    'Full_Time',              
    'EMP66778899099887766554'
);

CALL AddNewStaff(
    'Michael Wilson',         
    443322110,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'M',                      
    '1982-12-12',             
    '1313 Cedar Ave, City, State, 48260', 
    '0906789012',             
    'michaelwilson@example.com',
    'admin123',               
    9056.43,                  
    'Full_Time',              
    'EMP44332211000998877654'
);

CALL AddNewStaff(
    'Sophia Martinez',        
    998877665,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'F',                      
    '1992-02-28',             
    '1414 Birch St, City, State, 59130', 
    '0907890123',             
    'sophiamartinez@example.com',
    'mypassword123',          
    9745.12,                  
    'Full_Time',              
    'EMP99887766555443322100'
);

CALL AddNewStaff(
    'David Lee',              
    223344556,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'M',                      
    '1978-11-11',             
    '1515 Willow St, City, State, 67543', 
    '0908901234',             
    'davidlee@example.com',   
    'letmein',                
    8912.54,                  
    'Full_Time',              
    'EMP22334455666778899000'
);

CALL AddNewStaff(
    'Olivia King',            
    556677889,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'F',                      
    '1984-06-06',             
    '1616 Aspen Ave, City, State, 78901', 
    '0909012345',             
    'oliviaking@example.com', 
    'newpass',                
    8862.89,                  
    'Full_Time',              
    'EMP55667788999887766554'
);

CALL AddNewStaff(
    'James Taylor',           
    334455667,                
    'Doctor',                 
    'Neurology',              
    NULL,                     
    'M',                      
    '1981-08-15',             
    '1717 Maple St, City, State, 89012', 
    '0901234567',             
    'jamestaylor@example.com',
    'qwerty123',              
    9678.34,                  
    'Full_Time',              
    'EMP33445566799887766554'
);

-- Eddie TIME
-- First added these departments and jobs:
INSERT INTO hospital_management_system.departments (department_name) VALUES ('test'), ('test1'), ('test2');
INSERT INTO hospital_management_system.jobs (job_name, min_wage, max_wage) VALUES ('job1', 0, 10), ('job2', 10, 20), ('job3', 20, 30);
-- The test call purpose is in the parameter full_name (first one)
CALL AddNewStaff(
    'Cannot find job',               -- para_full_name
    111111111,                -- para_ssn
    'job0',                 -- para_job_name
    'test',              -- para_department_name
    NULL,                     -- para_manager_name
    'M',                      -- para_gender
    '1980-01-01',             -- para_birth_date
    '123 Generic Address 1', -- para_home_address
    '9999999999',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    9,                  -- para_wage (random value between 8862.23 and 9863.3)
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);

CALL AddNewStaff(
    'Wrong Wage Range',               -- para_full_name
    111111111,                -- para_ssn
    'job1',                 -- para_job_name
    'test',              -- para_department_name
    NULL,                     -- para_manager_name
    'M',                      -- para_gender
    '1980-01-01',             -- para_birth_date
    '123 Generic Address 1', -- para_home_address
    '9999999999',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    15,                  -- para_wage 
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);

CALL AddNewStaff(
    'Cannot find Manager',               -- para_full_name
    111111111,                -- para_ssn
    'job1',                 -- para_job_name
    'test',              -- para_department_name
    '1',                     -- para_manager_name
    'M',                      -- para_gender
    '1980-01-01',             -- para_birth_date
    '123 Generic Address 1', -- para_home_address
    '9999999999',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    9,                  -- para_wage (random value between 8862.23 and 9863.3)
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);

CALL AddNewStaff(
    'Cannot find department',               -- para_full_name
    111111111,                -- para_ssn
    'job1',                 -- para_job_name
    'none',              -- para_department_name
    NULL,                     -- para_manager_name
    'M',                      -- para_gender
    '1980-01-01',             -- para_birth_date
    '123 Generic Address 1', -- para_home_address
    '9999999999',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    9,                  -- para_wage (random value between 8862.23 and 9863.3)
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);

CALL AddNewStaff(
    'Valid Staff 1',               -- para_full_name
    111111111,                -- para_ssn
    'job1',                 -- para_job_name
    'test',              -- para_department_name
    NULL,                     -- para_manager_name
    'M',                      -- para_gender
    '1980-01-01',             -- para_birth_date
    '123 Generic Address 1', -- para_home_address
    '9999999999',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    9,                  -- para_wage (random value between 8862.23 and 9863.3)
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);

CALL AddNewStaff(
    'Invalid Manager',               -- para_full_name
    222222222,                -- para_ssn
    'job2',                 -- para_job_name
    'test',              -- para_department_name
    '2',                     -- para_manager_name
    'M',                      -- para_gender
    '1980-01-01',             -- para_birth_date
    '123 Generic Address 1', -- para_home_address
    '9999999999',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    15,                  -- para_wage (random value between 8862.23 and 9863.3)
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);

CALL AddNewStaff(
    'Valid Staff 2',               -- para_full_name
    222222222,                -- para_ssn
    'job2',                 -- para_job_name
    'test',              -- para_department_name
    'Valid Staff 1',                     -- para_manager_name
    'M',                      -- para_gender
    '1980-01-01',             -- para_birth_date
    '123 Generic Address 1', -- para_home_address
    '9999999999',             -- para_phone_number
    'johndoe@example.com',    -- para_email
    'securepass',             -- para_staff_password
    15,                  -- para_wage (random value between 8862.23 and 9863.3)
    'Full_Time',              -- para_employment_type
    'EMP12345678901234567890' -- para_employment_document_id
);


