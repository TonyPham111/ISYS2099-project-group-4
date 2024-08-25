const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { poolHR, poolBusinessOfficers, poolDoctors, poolFrontDesk, poolNurses } = require('../Models/dbConnectionConfiguration');
const { verify } = require('jsonwebtoken');

passport.use(
    new LocalStrategy(
        { usernameField: 'username', passwordField: 'password' }, 
        async  function verify(username, password, done) {
            try {
                let pool;
                // Select the appropriate database pool based on the role 
  
                if (role === 'nurse') pool = poolNurses;
                else if (role === 'doctor') pool = poolDoctors;
                else if (role === 'frontDesk') pool = poolFrontDesk;
                else if (role === 'hr') pool = poolHR;
                else if (role === 'businessOfficer') pool = poolBusinessOfficers;
                else return done(null, false, { message: 'Invalid role provided' });
                const [rows] = await pool.query('SELECT * FROM staff WHERE username = ?', [username]);
                if (rows.length === 0) {
                    return done(null, false, { message: 'Invalid credentials' });
                }
                const user = rows[0];
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return done(null, false, { message: 'Invalid credentials' });
                }
                return done(null, user); // Authentication succeeded
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        let pool = poolDoctors; // Assume role is doctor; adjust based on your logic
        const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [id]);

        if (rows.length === 0) {
            return done(new Error('User not found'));
        }

        done(null, rows[0]);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
