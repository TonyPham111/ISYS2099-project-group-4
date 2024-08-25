const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {poolHR, poolBusinessOfficers, poolDoctors, poolFrontDesk, poolNurses} = require('../Models/dbConnectionConfiguration');

async function login(req, res) {
    const { username, password } = req.body;
    let pool;

    // Select the appropriate database pool based on the role
    if (role === 'nurse') pool = poolNurses;
    else if (role === 'doctor') pool = poolDoctors;
    else if (role === 'frontDesk') pool = poolFrontDesk;
    else if (role === 'hr') pool = poolHR;
    else if (role === 'businessOfficer') pool = poolBusinessOfficers;
    else return res.status(400).json({ message: 'Invalid role provided' });

    try {
        const [rows] = await pool.query('SELECT * FROM staff WHERE username = ?', [username]);

        if (rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Logged in successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = login;