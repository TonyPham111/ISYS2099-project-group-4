const {poolBusinessOfficers} = require('./dbConnectionConfiguration')
const queries = {};

queries.insertNewDrug = async (code, drug_name, inventory, unit, price_per_unit) =>{
    try{
        const result = await poolBusinessOfficers.query(
            'INSERT INTO Drugs (code, name, unit, inventory, price_per_unit) VALUES (?,?,?,?,?)', [code, drug_name, inventory, unit, price_per_unit]
        )
        return result
    } catch (err){
        return err
    }
}

queries.updateDrugInventory = async (code, new_inventory) => {
    try{
        const result = await poolBusinessOfficers.query(
            'UPDATE Drugs SET inventory = ? WHERE code = ? ', [new_inventory, code]
        )
        return result
    } catch (err){
        return err
    }
   
}

queries.updateDrugPrice = async (code, new_price) => {
    try{
        const result = await poolBusinessOfficers.query(
            'UPDATE Drugs SET price_per_unit = ? WHERE code = ? ', [new_price, code]
        )
        return result
    } catch (err){
        return err
    }
   
}

queries.insertNewTestType = async (test_name, price, description) => {
    try{
        const result = await poolBusinessOfficers.query(
            'INSERT INTO Test_Types (test_name, price, description) VALUES (?,?,?)', [test_name, price, description]
        )
        return result
    } catch (err){
        return err
    }

}

queries.updateTestPrice = async (id, new_price) => {
    try {
        const result = await poolBusinessOfficers.query(
            'UPDATE Test_Types SET price = ? WHERE id = ?', [id, new_price]
        )
        return result
    } catch (err){
        return err
    }
}

queries.insertNewBills = async (patientID, appointmentID, prescriptionID, testID) =>{
    try{
      const result =  await poolBusinessOfficers.query(
        'CALL InsertNewBilling(?,?,?,?)', [patientID, appointmentID, prescriptionID, testID]
      )
      return result  
    } 
    catch (err){
        return err;
    }
}

queries.getBillDetails = async (appointmentID, prescriptionID, testID) => {
    try {
        const [result1, result2, result3] = await poolBusinessOfficers.query(
            'CALL GetBillingDetails(?,?,?)', [appointmentID, prescriptionID, testID]
        )
        return {"appointment detail": result1, "prescription detail": result2, "test detail": result3}
    } catch (err){
        return err
    }
}