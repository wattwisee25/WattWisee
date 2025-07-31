const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User'); // Make sure the path is correct

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Generic message for security
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Login successful - here you can add JWT token generation if needed
    res.json({ message: 'Login successful!' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
