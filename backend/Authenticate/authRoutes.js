const express = require('express');
const login = require('./loginController');
const register = require('./registerController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

module.exports = router;
