const express = require('express');
const authenticateController = require('../Authenticate/authenticateController');
const session = require('express-session');
const passport =require('../Authenticate/passportConfig');
const router = express.Router();

// Initialize session management
router.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);

// Initialize Passport.js
router.use(passport.initialize());
router.use(passport.session());


// Login route
router.get('/login', authenticateController.loginPage);
router.post('/login', authenticateController.login);

// Logout route
router.get('/logout', authenticateController.logout);


// Register routes
router.get('/register', authenticateController.registerPage);
router.post('/register', authenticateController.register);

module.exports = router;