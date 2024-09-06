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
        const educationQualifications = await educationQualificationSchema.find({ _id: { $in: idsToFetch } });
        const experiences = await experienceSchema.find({ _id: { $in: idsToFetch } });
        const licenses = await licenseSchema.find({ _id: { $in: idsToFetch } });

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
export async function fetchLabResultsWithImagesByDocumentId(documentId) {
    const document =  await TestResult.findOne({ 'testDocument._id': documentId })
     // Convert the PDF to Base64
     const base64PDF = document.lab_result_document ? document.lab_result_document.toString('base64') : null;
    
     // Convert each image to Base64
     const base64Images = document.sample_image.map(imageBuffer => imageBuffer.toString('base64'));
     
     const response = {
       _id: document._id,
       lab_result_document: base64PDF, // Send Base64 encoded PDF
       sample_image: base64Images, // Send Base64 encoded JPEG images
     };
    return response
        
    
    
    //.populate('testDocument.sample_image');
}

// Create new lab result Document
export async function createNewLabResultDocument(labResultData, sampleImageData) {
    const labResult = window.atob(labResultData)
    const sampleImage = window.atob(sampleImageData)
    const newLabResult = new TestResult({ 
        lab_result_document: labResult,
        sample_image:sampleImage
    });
    return await newLabResult.save();
}

// Create new Training Documents based on job, department and file
export async function createNewTrainingMaterial(req, res) {
    try {
      const user_info = req.user;
      const { job_id, department_id, base64EncodedFile } = req.body;
  
      if (user_info.role === 'HR') {
        const result = await createNewTrainingDocument(job_id, department_id, base64EncodedFile);
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

