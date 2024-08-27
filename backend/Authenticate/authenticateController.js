const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {poolHR, poolBusinessOfficers, poolDoctors, poolFrontDesk, poolNurses} = require('../Models/dbConnectionConfiguration');


exports.loginPage = (req, res) => {
  try {
      res.json("This is login Page");
  } catch (error) {
      res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
      // Authentication failed
          return res.status(400).json({ message: info.message });
      }

      // Authentication successful
      req.login(user, async (err) => {
          if (err) {
              return next(err);
          }
          const token = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

          res.json({ message: 'Logged in successfully', token });
      });
  })(req, res, next);
};

// logout
exports.logout = (req, res) => {
  try {
    res.clearCookie("userToken");
    return res.json('Logged out successfully');
  } catch {
    console.log(error)
    return res.status(500).json({ error: "Cannot logout" })
  }
};

//register a new staff
exports.registerPage = (req, res) => {
  try {
      res.json("This is Register Page");
  } catch (error) {
      res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

exports.register = async (req, res) => {
    const { username, password, role, department } = req.body;
    let pool;

    // if (role === 'nurse') pool = poolNurses;
    // else if (role === 'doctor') pool = poolDoctors;
    // else if (role === 'frontDesk') pool = poolFrontDesk;
    // else if (role === 'hr') pool = poolHR;
    // else if (role === 'businessOfficer') pool = poolBusinessOfficers;
    // else return res.status(400).json({ message: 'Invalid role provided' });

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

