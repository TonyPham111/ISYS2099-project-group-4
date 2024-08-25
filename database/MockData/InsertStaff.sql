CALL AddNewStaff(
    'Sato Jiro',                  -- Manager's full name in Romaji
    123456780,                    -- Random SSN for the manager
    2,                            -- Job title for the manager
    4,                            -- Department for the manager (randomly selected)
    NULL,                         -- Manager's manager (None for top-level doctor manager)
    'M',                          -- Gender (M for Male)
    '1975-01-15',                 -- Random birth date for the manager
    'Tokyo-to Shibuya-ku 2-3-4',  -- Manager's home address in Romaji
    '090-1111-2222',              -- Manager's random phone number
    'jiro.sato@example.jp',       -- Manager's random email address
    'managersafe',             -- Manager's random password
    9000.00,                      -- Random wage within the doctor range (8862.23 to 9863.3)
    'full_time',                  -- Employment type (full_time for doctors)
    NULL   -- Random employment document ID for the manager
);


-- Now insert the new doctor under this manager (Example 1)
CALL AddNewStaff(
    'Yamada Taro',                 -- Full name in Romaji
    123456789,                     -- Random SSN
    2,                             -- Job title (Doctor)
    4,                             -- Department (randomly selected)
    LAST_INSERT_ID(),              -- Manager's id
    'M',                           -- Gender (M for Male)
    '1985-03-22',                  -- Random birth date
    'Tokyo-to Shibuya-ku 1-2-3',   -- Home address in Romaji
    '090-1234-5678',               -- Random phone number
    'taro.yamada@example.jp',      -- Random email address
    'password123',                 -- Random password
    9500.00,                       -- Random wage within the doctor range (8862.23 to 9863.3)
    'full_time',                   -- Employment type (full_time for doctors)
    NULL    -- Random employment document ID
);

-- Insert the nurse manager first (Example 2)
CALL AddNewStaff(
    'Tanaka Ichiro',               -- Manager's full name in Romaji
    345678901,                     -- Random SSN for the manager
    1,                             -- Job title for the manager
    1,                             -- Department for the manager (randomly selected)
    NULL,                          -- Manager's manager (None for top-level nurse manager)
    'M',                           -- Gender (M for Male)
    '1972-07-10',                  -- Random birth date for the manager
    'Osaka-shi Chuo-ku 8-9-10',    -- Manager's home address in Romaji
    '090-3344-5566',               -- Manager's random phone number
    'ichiro.tanaka@example.jp',    -- Manager's random email address
    'nursepass456',                -- Manager's random password
    5000.00,                       -- Random wage within the nurse range (3579.35 to 5381.45)
    'shift_based',                 -- Employment type (shift_based for nurses)
    NULL    -- Random employment document ID for the manager
);

-- Now insert the new nurse under this nurse manager (Example 2)
CALL AddNewStaff(
    'Suzuki Hanako',               -- Full name in Romaji
    987654323,                     -- Random SSN
    1,                             -- Job title (Nurse)
    1,                             -- Department (randomly selected)
    LAST_INSERT_ID(),              -- Manager's id
    'F',                           -- Gender (F for Female)
    '1990-08-25',                  -- Random birth date
    'Osaka-shi Kita-ku 4-5-6',     -- Home address in Romaji
    '090-9876-5432',               -- Random phone number
    'hanako.suzuki@example.jp',    -- Random email address
    'securepass6',                 -- Random password
    4800.0,                        -- Random wage within the nurse range (3579.35 to 5381.45)
    'shift_based',                 -- Employment type (shift_based for nurses)
    NULL    -- Random employment document ID
);
