const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Import user routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes); // All user routes start with /api/users

// Import login routes
const loginRoutes = require('./routes/login');
app.use('/api/login', loginRoutes); // All login routes start with /api/login

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/wattWisee', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB!');
  // Start server only after DB connection
  app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
