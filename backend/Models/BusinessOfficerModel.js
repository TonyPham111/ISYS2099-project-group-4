const {poolBusinessOfficers} = require('./dbConnectionConfiguration')
const queries = {
    GetPatientsInfo: async () => {
        try {
            const sql = `CALL FetchPatientsPersonalInfo()`;
            const [results] = await poolFrontDesk.query(sql, []);
            return results;
        } catch (error) {
            console.error("Error executing FetchPatientsPersonalInfo:", error);
            return { error: "An error occurred while executing FetchPatientsPersonalInfo. Please try again later." };
        }
    }
}

module.exports = queries;


