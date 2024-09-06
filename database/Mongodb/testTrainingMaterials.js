const { createNewTrainingMaterial } = require('./Methods');
const TrainingMaterials = require('./schemas/TrainingMaterials');

// Mock the TrainingMaterials model
jest.mock('./schemas/TrainingMaterials');

describe('createNewTrainingMaterial', () => {
  it('should create a new training material for HR role', async () => {
    // Mock request and response objects
    const req = {
      user: { role: 'HR' },
      body: {
        job_id: 'job123',
        department_id: 'dept456',
        base64EncodedFile: 'base64encodedstring'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock the TrainingMaterials.create method
    TrainingMaterials.create.mockResolvedValue({ _id: 'newDocumentId' });

    // Call the function
    await createNewTrainingMaterial(req, res);

    // Assertions
    expect(TrainingMaterials.create).toHaveBeenCalledWith({
      job_id: 'job123',
      department_id: 'dept456',
      training_document: expect.any(Buffer)
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Training material created successfully',
      documentId: 'newDocumentId'
    });
  });

  it('should return 403 for non-HR role', async () => {
    const req = {
      user: { role: 'Employee' },
      body: {
        job_id: 'job123',
        department_id: 'dept456',
        base64EncodedFile: 'base64encodedstring'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createNewTrainingMaterial(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access' });
  });

  // Add more test cases as needed
});
