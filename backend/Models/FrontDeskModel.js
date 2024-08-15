const {poolFrontDesk} = require('./dbConnectionConfiguration')
const queries = {};

// To view the Patients List
queries.getPatientsList = async () => {
    try {
        const result = await poolFrontDesk
        .query(
            `SELECT 
                p.id,
                p.ssn,
                p.first_name,
                p.last_name,
                p.birth_date,
                p.phone_number,
                p.email,
                p.home_address
            FROM 
                Patients p`
        );
        return result;
    } catch (err) {
        return err;
    }
};

// Get Patient information with Allergy
queries.getPatientInfoWithAllergy = async () => {
    try {
        const result = await poolFrontDesk.query(
            `SELECT 
                p.id,
                p.first_name,
                p.last_name,
                a.name AS allergy_name,
                a.allergy_type,
                pa.record_date
            FROM 
                Patients p
            JOIN 
                PatientAllergy pa ON p.id = pa.patient_id
            JOIN 
                Allergies a ON pa.allergy_id = a.id`
        );
        return result;
    } catch (err) {
        return err;
    }
};

// Create a new Patient

// Update Patient Information 

// View Staff Schedule

//
