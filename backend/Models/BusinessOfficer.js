const {poolBusinessOfficers} = require('./dbConnectionConfiguration')
const queries = {};

queries.insertNewBills = async (appointmentID, prescriptionID, testID) =>{
    
}

queries.getBillDetails = async (appointmentID, prescriptionID, testID) => {
    try {
        const [result1, result2, result3] = await poolBusinessOfficers.query('CALL GetBillingDetails(?,?,?)', [appointmentID, prescriptionID, testID])
        return {"appointment detail": result1, "prescription detail": result2, "test detail": result3}
    } catch (err){
        return err
    }
}