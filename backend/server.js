const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// For production, restrict CORS origins
const corsOptions = {
  origin: '*path',
};
app.use(cors(corsOptions));

app.use(express.json());

// Connect to MongoDB with proper error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit app if DB connection fails
  });

  
app.use((req, res, next) => {
  res.setHeader(
  'Content-Security-Policy',
  "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'"
  ); 
  next();
});

// Routes
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/api', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/records', require('./routes/records'));
app.use('/api/reportcards', require('./routes/reportcards'));

// get requests
app.get('*path', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));