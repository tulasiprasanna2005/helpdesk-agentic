// server.js (updated)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Routes
const authRoutes = require('./routes/auth');
const kbRoutes= require('./routes/kb');
const ticketRoutes = require('./routes/tickets');
const configRoutes= require('./routes/config');


app.use('/api/auth',authRoutes);
app.use('/api/kb', kbRoutes); 
app.use('/api/tickets', ticketRoutes);
app.use('/api/config', configRoutes)
// New line for KB routes

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));