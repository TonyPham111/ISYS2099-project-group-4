const bcrypt = require('bcrypt');
const {poolHR, poolBusinessOfficers, poolDoctors, poolFrontDesk , poolNurses} = require('../Models/dbConnectionConfiguration');


async function register(req, res) {
    const { username, password, role, department } = req.body;
    let pool;

    if (role === 'nurse') pool = poolNurses;
    else if (role === 'doctor') pool = poolDoctors;
    else if (role === 'frontDesk') pool = poolFrontDesk;
    else if (role === 'hr') pool = poolHR;
    else if (role === 'businessOfficer') pool = poolBusinessOfficers;
    else return res.status(400).json({ message: 'Invalid role provided' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('CALL AddNewStaff(?, ?, ?, ?)', [username, hashedPassword, role, department]);

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.sqlState === '45000') {
            res.status(400).json({ message: err.sqlMessage });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = register;