const mongoose = require('mongoose');

const employmentDocumentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    staffContracts,
    staffPersonalInfoSchema

}, { timestamps: true });


// Schema for Employee Contracts
const staffContracts = new mongoose.Schema({
    contract_id: mongoose.Schema.Types.ObjectId,
    contract: String, // This will store the encoded string of the contract
    contract_start_date: Date,
    contract_end_date: Date,
    contract_info: String,
}, { timestamps: true });


// Schema for qualifications
const qualificationSchema = new mongoose.Schema({
    provider: String,
    date: Date,
    certificate: String, // This will store the encoded string of the certificate document
});


// Schema for Staff Information 
const staffPersonalInfoSchema = new mongoose.Schema({
    full_name: String,
    ssn: String,
    department_name: String,
    job_name: String,
    manager_name: String,
    birth_date: Date,
    gender: String,
    phone_number: String,
    home_address: String,
    email: String,
    staff_password: String,
    wage: Number,
    employment_type: String,
    employment_document_id: mongoose.Schema.Types.ObjectId,
    qualifications: [qualificationSchema], // Array of qualifications
    employment_document_info: String,
}, { timestamps: true });

const EmploymentDocument = mongoose.model('EmploymentDocument', EmploymentDocument);

module.exports = EmploymentDocument;




