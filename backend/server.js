const express = require('express');
const authRoutes = require('./Authenticate/authRoutes');
const authenticateToken = require('./Authenticate/authenticate');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

// Protect any routes that require authentication
app.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'You have accessed a protected route' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
