// import required modules
require("dotenv").config();
const parser = require("body-parser");
const mongoose = require("mongoose");
const express = require('express');
const cookieParser = require("cookie-parser");




//import  routes 
const doctorRoutes = require("./Routers/doctorRoutes.js");
const nurseRoutes = require("./Routers/hrRoutes.js");
const frontDeskRoutes = require("./Routers/frontDeskRoutes.js");
const hrRoutes = require("./Routers/hrRoutes.js");
const businessOfficerRoutes = require("./Routers/bussinessOffcierRoutes.js");
const authenticateToken = require("./Authenticate/authRoutes.js");
const app = express();
const SERVER_PORT = process.env.SERVER_PORT;

// Middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());
app.use(parser.json());


// Use routes
app.use('/api/business-officer', businessOfficerRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/front-desk', frontDeskRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/nurse', nurseRoutes);






  

// Start the server
app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});