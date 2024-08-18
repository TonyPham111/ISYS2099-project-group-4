  async function createStaffDocuments(db) {
    await db.createStaffDocuments("staff_documents");
    console.log("Created Staff Document database and collections.");
  }
  
  exports.createStaffDocuments = createStaffDocuments;