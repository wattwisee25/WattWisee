const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Import routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/wattWisee')
.then(() => {
  console.log('Connected to MongoDB!');
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
