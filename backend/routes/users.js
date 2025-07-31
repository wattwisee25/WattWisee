// backend/routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// User registration
router.post('/', async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      ...rest,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful!' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ message: 'Login successful!' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
