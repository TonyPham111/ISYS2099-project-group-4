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

queries.createPatient = async (ssn, firstName, lastName, birthDate, homeAddress, phoneNumber, email) => {
    try {
        const result = await poolFrontDesk.query(
            `INSERT INTO Patients (ssn, first_name, last_name, birth_date, home_address, phone_number, email) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [ssn, firstName, lastName, birthDate, homeAddress, phoneNumber, email]
        );
        return result;
    } catch (err) {
        return err;
    }
};


// Update Patient Information 

queries.updatePatientInfo = async (patientId, firstName, lastName, birthDate, homeAddress, phoneNumber, email) => {
    try {
        const result = await poolFrontDesk.query(
            `UPDATE Patients 
             SET 
                first_name = ?, 
                last_name = ?, 
                birth_date = ?, 
                home_address = ?, 
                phone_number = ?, 
                email = ? 
             WHERE 
                id = ?`, 
            [firstName, lastName, birthDate, homeAddress, phoneNumber, email, patientId]
        );
        return result;
    } catch (err) {
        return err;
    }
};


// View Staff Schedule

queries.viewStaffSchedule = async (staffId) => {
    try {
        const result = await poolFrontDesk.query(
            `SELECT 
                ds.doctor_id, 
                ds.start_time, 
                ds.end_time, 
                ds.date 
             FROM Doctor_Schedule ds
             JOIN Staff s 
             ON ds.doctor_id = s.id
             WHERE s.id = ?`,
            [staffId]
        );
        return result;
    } catch (err) {
        return err;
    }
};


//View Doctor Schedules/ Appointments with Patient

queries.viewDoctorAppointments = async (doctorId) => {
    try {
        const result = await poolFrontDesk.query(
            `SELECT 
                a.id AS appointment_id,
                p.first_name AS patient_first_name, 
                p.last_name AS patient_last_name,
                a.appointment_purpose,
                a.appointment_date,
                a.start_time,
                a.end_time
             FROM Appointments a
             JOIN Patients p ON a.patient_id = p.id
             WHERE a.doctor_id = ?`,
            [doctorId]
        );
        return result;
    } catch (err) {
        return err;
    }
};


// Create A new appointment with Patient
queries.createPatientWithScheduleAndAppointment = async (patientData, doctorId, scheduleData, appointmentData) => {
    const connection = await poolFrontDesk.getConnection();
    try {
        await connection.beginTransaction();

        // Insert new patient
        const [patientResult] = await connection.query(
            `INSERT INTO Patients (first_name, last_name, ssn, birth_date, gender, home_address, phone_number, email) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [patientData.first_name, patientData.last_name, patientData.ssn, patientData.birth_date, patientData.gender, patientData.home_address, patientData.phone_number, patientData.email]
        );

        const patientId = patientResult.insertId;

        // Insert schedule for the doctor
        await connection.query(
            `INSERT INTO Doctor_Schedule (doctor_id, date, start_time, end_time) 
             VALUES (?, ?, ?, ?)`,
            [doctorId, scheduleData.date, scheduleData.start_time, scheduleData.end_time]
        );

        // Insert appointment
        await connection.query(
            `INSERT INTO Appointments (patient_id, doctor_id, appointment_purpose, appointment_date, start_time, end_time) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [patientId, doctorId, appointmentData.appointment_purpose, appointmentData.appointment_date, appointmentData.start_time, appointmentData.end_time]
        );

        await connection.commit();
        return { success: true, patientId };
    } catch (err) {
        await connection.rollback();
        return { success: false, error: err };
    } finally {
        connection.release();
    }
};

// Update an appointment

queries.updatePatientWithScheduleAndAppointment = async (patientId, updatedPatientData, doctorId, updatedScheduleData, updatedAppointmentData) => {
    const connection = await poolFrontDesk.getConnection();
    try {
        await connection.beginTransaction();

        // Update patient information
        await connection.query(
            `UPDATE Patients 
             SET first_name = ?, last_name = ?, ssn = ?, birth_date = ?, gender = ?, home_address = ?, phone_number = ?, email = ? 
             WHERE id = ?`,
            [updatedPatientData.first_name, updatedPatientData.last_name, updatedPatientData.ssn, updatedPatientData.birth_date, updatedPatientData.gender, updatedPatientData.home_address, updatedPatientData.phone_number, updatedPatientData.email, patientId]
        );

        // Update doctor's schedule
        await connection.query(
            `UPDATE Doctor_Schedule 
             SET date = ?, start_time = ?, end_time = ? 
             WHERE doctor_id = ?`,
            [updatedScheduleData.date, updatedScheduleData.start_time, updatedScheduleData.end_time, doctorId]
        );

        // Update appointment
        await connection.query(
            `UPDATE Appointments 
             SET appointment_purpose = ?, appointment_date = ?, start_time = ?, end_time = ? 
             WHERE patient_id = ? AND doctor_id = ?`,
            [updatedAppointmentData.appointment_purpose, updatedAppointmentData.appointment_date, updatedAppointmentData.start_time, updatedAppointmentData.end_time, patientId, doctorId]
        );

        await connection.commit();
        return { success: true };
    } catch (err) {
        await connection.rollback();
        return { success: false, error: err };
    } finally {
        connection.release();
    }
};


// Delete an appointment
queries.deletePatientWithScheduleAndAppointment = async (patientId, doctorId) => {
    const connection = await poolBusinessOfficers.getConnection();
    try {
        await connection.beginTransaction();

        // Delete appointment
        await connection.query(
            `DELETE FROM Appointments 
             WHERE patient_id = ? AND doctor_id = ?`,
            [patientId, doctorId]
        );

        // Delete schedule
        await connection.query(
            `DELETE FROM Doctor_Schedule 
             WHERE doctor_id = ?`,
            [doctorId]
        );

        // Delete patient
        await connection.query(
            `DELETE FROM Patients 
             WHERE id = ?`,
            [patientId]
        );

        await connection.commit();
        return { success: true };
    } catch (err) {
        await connection.rollback();
        return { success: false, error: err };
    } finally {
        connection.release();
    }
};

