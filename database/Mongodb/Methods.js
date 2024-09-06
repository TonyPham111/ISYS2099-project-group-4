import AppointmentNotes from './schemas/AppointmentNotes.js';
import TestResult from './schemas/LabTestResults.js';
import TrainingMaterials from './schemas/TrainingMaterials.js';
import { EducationQualification, ExperienceQualification, LicenseQualification } from './schemas/StaffQualifications.js';


// Fetch Appointment Note By Document ID
export async function fetchAppointmentNoteByDocumentId(documentId) {
    return await AppointmentNotes.findOne({ _id: documentId });
}

// Update DuringAppointment Note By Document ID
export async function updateDuringAppointmentNote(documentId, duringNote) {
    return await AppointmentNotes.findByIdAndUpdate(
        documentId,
        { during_document_note: duringNote },
        { new: true }
    );
}

export async function fetchQualifications(idsToFetch) {
    try {
        // Fetch documents from all three collections based on _id
        const educationQualifications = await EducationQualification.find({ _id: { $in: idsToFetch } });
        const experiences = await ExperienceQualification.find({ _id: { $in: idsToFetch } });
        const licenses = await LicenseQualification.find({ _id: { $in: idsToFetch } });

        // Map the results to encode blob fields (certificate, letter_of_reference, document) as Base64
        const educationResults = educationQualifications.map(qualification => ({
            _id: qualification._id,
            qualification_name: qualification.qualification_name || null,
            institution_name: qualification.institution_name || null,
            level: qualification.level || null,
            qualification_grade: qualification.qualification_grade || null,
            qualification_date: qualification.qualification_date || null,
            certificate: qualification.certificate
        }));

        const experienceResults = experiences.map(experience => ({
            _id: experience._id,
            job_title: experience.job_title || null,
            hospital_name: experience.hospital_name || null,
            job_description: experience.job_description || null,
            letter_of_reference: experience.letter_of_reference ? experience.letter_of_reference.toString('base64') : null,
            start_date: experience.start_date || null,
            end_date: experience.end_date || null
        }));

        const licenseResults = licenses.map(license => ({
            _id: license._id,
            document: license.document ? license.document.toString('base64') : null
        }));

        // Combine results from all collections
        const combinedResults = {
            educationQualifications: educationResults,
            experiences: experienceResults,
            licenses: licenseResults
        };

        return combinedResults;
    } catch (err) {
        throw new Error('Error fetching documents: ' + err.message);
    }
}



export async function createNewQualificationDocument(qualifications) {
    const response = [];
    for (const qualification of qualifications) {
        let document;
        switch (qualification.type) {
            case 'Education':
                document = await EducationQualification.create(qualification);
                break;
            case 'Experience':
                document = await ExperienceQualification.create(qualification);
                break;
            case 'License':
                document = await LicenseQualification.create(qualification);
                break;
            default:
                throw new Error(`Unknown qualification type: ${qualification.type}`);
        }
        response.push({
            _id: document._id,
            type: qualification.type
        });
    }
    return response;
}

// Update Post Appointment Note By Document ID
export async function updatePostAppointmentNote(documentId, postNote) {
    return await AppointmentNotes.findByIdAndUpdate(
        documentId,
        { post_appointment_note: postNote },
        { new: true }
    );
}

// Create Appointment Note from Pre Note
export async function createAppointmentNoteFromPreNote(preNote) {
    const newNote = new AppointmentNotes({
        pre_appointment_note: preNote,
        post_appointment_note: '',
        during_document_note: ''
    });
    return await newNote.save();
}

// Fetch All Lab Results with Images based on lab_result_document_id
export async function getAllImagesWithLabResult(testDocumentId) {
    try {
        // Find the test result document by its _id
        const testResult = await TestResult.findById(testDocumentId);

        // If no document is found, return an error
        if (!testResult) {
            return { error: 'Test document not found' };
        }

        // Retrieve the lab result document and sample images
        const labResultDocument = testResult.lab_result_document;
        const sampleImages = testResult.sample_image;

        // Encode the lab result document in Base64
        const encodedLabResult = {
            file_name: labResultDocument.file_name,
            file: labResultDocument.file.toString('base64') // Convert Buffer to Base64
        };

        // Encode each sample image in Base64
        const encodedSampleImages = sampleImages.map(image => ({
            file_name: image.file_name,
            file: image.file.toString('base64') // Convert Buffer to Base64
        }));

        // Combine the lab result document with the sample images in the response
        const response = {
            lab_result_document: encodedLabResult,
            sample_images: encodedSampleImages
        };

        // Return the combined result
        return response;
    } catch (error) {
        console.error('Error retrieving images:', error);
        throw new Error('Unable to retrieve images');
    }
}


// Create new lab result Document
export async function createNewLabResultDocument(labResultData, sampleImageData) {
    const newLabResult = new TestResult({ 
        lab_result_document: labResultData,
        sample_image:sampleImageData
    });
    return await newLabResult.save();
}

// Create new Training Documents based on job, department and file
export async function createNewTrainingMaterial(req, res) {
    try {
      const user_info = req.user;
      const { job_id, department_id, base64EncodedFile } = req.body;
  
      if (user_info.role === 'HR') {
        const result = await TrainingMaterials.save(req.body);
        res.status(201).json({
          message: 'Training material created successfully',
          documentId: result._id
        });
      } else {
        res.status(403).json({ message: 'Unauthorized access' });
      }
    } catch (error) {
      console.error('Error creating training material:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

// Fetch All Training Documents based on jobid and department id
export async function fetchTrainingDocuments(job_id, department_id) {
    const document = await TrainingMaterials.find({
        job_id: job_id,
        department_id: department_id
    });
    // Convert the PDF to Base64
    const base64PDF = document.training_document ? document.training_document.toString('base64') : null;
    const response = {
        job_id: document.job_id,
        department_id: document.department_id,
        base64PDF
    }
    return response
}

