import doctorQueries from "./Models/DoctorModel.js";    
import businessOfficerQueriesqueries from "./Models/BusinessOfficerModel.js";
import frontDeskQueries from "./Models/FrontDeskModel.js";
import hrQueries from "./Models/HrModel.js";
import nurseQueries from "./Models/NurseModel.js";



describe("Testing BusinessOfficerModels Queries", () => {
  
    // Test GetPatientsInfo
    test("GetPatientsInfo should return patients' information", async () => {
      const result = await queries.GetPatientsInfo();
      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Array); // Assuming it returns an array of patients
      // Add more expectations based on the result format
    });
  
    // Test FetchStaffInfoById
    test("FetchStaffInfoById should return staff info by ID", async () => {
      const staff_id = 1; // Use a valid staff ID for your test
      const result = await queries.FetchStaffInfoById(staff_id);
      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Array); // Assuming it returns an array of staff info
      // Add more expectations based on the result format
    });
  
    // Test Schedule
    test("Schedule should create a new schedule", async () => {
      const result = await queries.Schedule(1, 2, '2024-09-01', '09:00:00', '17:00:00', 'Test Schedule');
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('affectedRows'); // Assuming it returns affected rows
      // Add more expectations based on the result format
    });

    // Repeat similar tests for each function...
  
  test("GetSubordinates should return subordinates under a manager", async () => {
    const manager_id = 1; // Replace with a valid manager ID
    const result = await queries.GetSubordinates(manager_id);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Array); // Assuming it returns an array
  });

  test("CreateNewBilling should create a new billing entry", async () => {
    const result = await queries.CreateNewBilling(1, 1, 1, 1); // Replace with valid IDs
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('affectedRows'); // Assuming it returns affected rows
  });

  // Add similar test cases for other functions in BusinessOfficerModels.js

});