const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Import routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const projectsRouter = require('./routes/projects');
app.use('/api/projects', projectsRouter);

const buildingsRouter = require('./routes/buildings');
app.use('/api/buildings', buildingsRouter);


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
