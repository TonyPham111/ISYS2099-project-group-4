const express = require('express');
const app = express();
const PORT = 3000;	// Set the server port to 3000

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
