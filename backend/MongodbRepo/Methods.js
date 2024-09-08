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

export async function fetchQualifications(qualifications) {
    try {
        const educationQualifications = [];
        const experiences = []
        const licenses = []
        for (let i = 0; i < qualifications.length; i++){
            if (qualifications[i].qualification_type === 'Education'){
                educationQualifications.push(await EducationQualification.findById(qualifications[i].document_id))
            }
            else if (qualifications[i].qualification_type === 'Experience'){
                experiences.push(await ExperienceQualification.findById(qualifications[i].document_id))
            }
            else {
                licenses.push(await LicenseQualification.findById(qualifications[i].document_id))
            }
        }
        console.log(educationQualifications)
        // Fetch documents from all three collections based on _id
        

        // Map the results to encode blob fields (certificate, letter_of_reference, document) as Base64
        const educationResults = educationQualifications.map(qualification => ({
            _id: qualification._id,
            qualification_name: qualification.qualification_name || null,
            institution_name: qualification.institution_name || null,
            level: qualification.level || null,
            qualification_grade: qualification.qualification_grade || null,
            qualification_date: qualification.qualification_date || null,
            certificate: {
                file_name: qualification.certificate.file_name,
                file: qualification.certificate.toString('base64')
        }
    }
    ));

        const experienceResults = experiences.map(experience => ({
            _id: experience._id,
            job_title: experience.job_title || null,
            hospital_name: experience.hospital_name || null,
            job_description: experience.job_description || null,
            letter_of_reference: {
                file_name: experience.letter_of_reference.file_name,
                file: experience.letter_of_reference.toString('base64')
            },
            start_date: experience.start_date || null,
            end_date: experience.end_date || null
        }));

        const licenseResults = licenses.map(license => ({
            _id: license._id,
            document: {
                file_name: license.document.file_name,
                file: license.document.toString('base64')
            }
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
        switch (qualification.qualification_type) {
            case 'Education':
                
                document = new EducationQualification({
                    qualification_name: qualification.qualification_name,
                    institution_name: qualification.institution_name,
                    level: qualification.level,
                    qualification_grade: qualification.qualification_grade,
                    qualification_date: qualification.qualification_date,
                    certificate: qualification.certificate
                })
                break;
            case 'Experience':
                document = new ExperienceQualification(
                    {
                        qualification_type: qualification.qualification_type,
                        job_title: qualification.job_title,
                        hospital_name: qualification.hospital_name,
                        job_description: qualification.job_description,
                        letter_of_reference: qualification.letter_of_reference,
                        start_date: qualification.start_date
                    }
                );
                break;
            case 'License':
                document = new LicenseQualification(
                    {
                        document: qualification.document
                    }
                );
                break;
            default:
                throw new Error(`Unknown qualification type: ${qualification.type}`);
        }
        response.push({
            _id: document._id,
            type: qualification.qualification_type
        });
        document.save()
    }
    return response;
}

// Update Post Appointment Note By Document ID
export async function updatePostAppointmentNote(documentId, duringNote, postNote) {
    return await AppointmentNotes.findByIdAndUpdate(
        documentId,
        { post_appointment_note: postNote },
        {during_document_note: duringNote },
        { new: true }
    );
}

// Create Appointment Note from Pre Note
export async function createAppointmentNoteFromPreNote(preNote, {transaction}) {
    const newNote = new AppointmentNotes({
        pre_appointment_note: preNote,
        post_appointment_note: '',
        during_document_note: ''
    });
    return (await newNote.save({session: transaction}));
}

// Fetch All Lab Results with Images based on lab_result_document_id
export async function getAllImagesWithLabResult(testDocumentId) {
    try {
        // Find the test result document by its _id
        const testResult = await TestResult.findById(testDocumentId);
        console.log(testResult);
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
export async function createNewLabResultDocument(labResultData, sampleImageData, {transaction}) {
    const newLabResult = new TestResult({ 
        lab_result_document: labResultData,
        sample_image:sampleImageData
    });
    return await newLabResult.save({session: transaction});
}

// Create new Training Documents based on job, department and file
export async function createNewTrainingMaterial(trainingMaterialObject) {
    try {
        const trainingMaterial = new TrainingMaterials({
            department_id: trainingMaterialObject.department_id,
            job_id: trainingMaterialObject.job_id,
            training_material: trainingMaterialObject.training_material
        });
        return await trainingMaterial.save()
     
    } catch (error) {
      console.error('Error creating training material:', error);
     
    }
  }

// Fetch All Training Documents based on jobid and department id
export async function fetchTrainingDocuments(job_id, department_id) {
    const documents = await TrainingMaterials.find({
        job_id: job_id,
        department_id: department_id
    });
    console.log(documents);
    // Convert the PDF to Base64
    const responses = documents.map(document => {
        return {
            file_name: document.training_material.file_name ? document.training_material.file_name : null,
            training_material: document.training_material.file ? document.training_material.file.toString('base64') : null,
        }
    })
   
    return responses
}

