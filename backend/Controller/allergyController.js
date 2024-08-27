export async function getAllAllergy(req, res){
    try {
       //verify job role = doctor
       //return data
       /*
       data structure: 
       [
        icd9_code: String,
        name: String,
        group: String,
        allergent: String,
        type: String
       ]
       */
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}