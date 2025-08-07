const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User'); // Make sure the path is correct

router.post('/', async (req, res) => {
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

    // Login successful - create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.json({ message: 'Login successful!', user: { email: user.email, name: user.contact_name } });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ message: 'Logout successful' });
    });
  } else {
    res.json({ message: 'Logout successful' }); // No session to destroy, but still success
  }
});

// Check authentication status
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ 
      authenticated: true, 
      user: { email: req.session.userEmail } 
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
