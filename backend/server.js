const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('./database'); // Initialize database

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON body

// Routes
app.use('/api', apiRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Backend sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});
