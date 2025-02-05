const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes');

const app = express();

// Add CORS and security middleware
app.use(cors());
app.use(express.json());
app.disable('x-powered-by'); // Removes the X-Powered-By header

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Welcome message for root route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Expert Ease API');
});

// API routes
app.use('/api', apiRoutes);

// Catch all other routes
app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
module.exports = app;