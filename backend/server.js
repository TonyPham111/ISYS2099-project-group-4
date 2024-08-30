
// import required modules
require("dotenv").config();
const parser = require("body-parser");
const express = require('express');
const cookieParser = require("cookie-parser");

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;

// Middleware to parse JSON data
app.use(express.json());
app.use(cookieParser());
app.use(parser.json());

// Import routes
const businessOfficerRoutes = require('./Routers/businessOfficerRoutes');
const doctorRoutes = require('./Routers/doctorRoutes');
const frontDeskRoutes = require('./Routers/frontDeskRoutes');
const hrRoutes = require('./Routers/hrRoutes');
const nurseRoutes = require('./Routers/nurseRoutes');

// Use routes
app.use('/api/business-officer', businessOfficerRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/front-desk', frontDeskRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/nurse', nurseRoutes);

app.use('/', authRouter);


// Start the server
app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});

