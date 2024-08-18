async function createPatientDocuments(db) {
  await db.createPatientDocuments("patient_documents");
  console.log("Created Patient Document database and collections.");
}

exports.createPatientDocuments = createPatientDocuments;