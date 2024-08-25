const express = require('express');
const loginController = require('../Authenticate/authenticateController');
const session = require('express-session');
const passport =require('../Authenticate/passportConfig');
const authRouter = express.Router();

// Initialize session management
authRouter.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);

// Initialize Passport.js
authRouter.use(passport.initialize());
authRouter.use(passport.session());


// Login route
authRouter.get('/login', loginController.loginPage);
authRouter.post('/login', loginController.login);

authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            return res.json({ message: info.message });
        }

        // Authentication success
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            const userToken = generateToken(user); // create access token 
            res.cookie('userToken', userToken, {  
                httpOnly: true,
                sameSite: 'none',
                secure: true }); // pass access token into the cookies
            return res.json({ user: user, message: info.message });
        });
    })(req, res, next);
});


module.exports = authRouter;