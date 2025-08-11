const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth.middleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'supersegreto';

let transporter;

(async () => {
  try {
    // Crea account Ethereal di test
    const testAccount = await nodemailer.createTestAccount();

    // Configura il trasporto SMTP con credenziali Ethereal generate
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    console.log('Nodemailer transporter configurato con account Ethereal');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
  } catch (error) {
    console.error('Errore creazione account Ethereal:', error);
  }
})();

// Registrazione utente
router.post('/', async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea nuovo utente
    const newUser = new User({
      ...rest,
      password: hashedPassword
    });

    await newUser.save();

    // Prepara email di conferma
    const mailOptions = {
      from: '"WattWisee Support" <no-reply@wattwisee.com>',
      to: newUser.email,
      subject: 'Conferma registrazione WattWisee',
      text: `Ciao ${newUser.contact_name || ''}, grazie per esserti registrato su WattWisee!`,
      html: `<p>Ciao ${newUser.contact_name || ''},</p><p>Grazie per esserti registrato su <b>WattWisee</b>!</p>`
    };

    // Invia email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Mail di conferma inviata: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (mailError) {
      console.error('Errore invio mail conferma:', mailError);
    }

    res.status(201).json({ message: 'Registration successful! Controlla la mail di conferma.' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Email already exists.' });
  }
});


// Login utente
router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful!',
      user: { email: user.email, name: user.contact_name }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /me aggiorna dati
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; 
    delete updates.email;
    delete updates.registered_as;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logout successful' });
});

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
  console.log('1');
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  console.log('2');
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If this email exists, you will receive reset instructions.' });
    }
    console.log('3');
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    console.log('4');
    const mailOptions = {
      from: '"WattWisee Support" <no-reply@wattwisee.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click here to reset: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    };
    console.log('5');
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (mailErr) {
      console.error('Errore invio mail:', mailErr);
      return res.status(500).json({ message: 'Error sending email' });
    }
    console.log('6');
    res.json({ message: 'If this email exists, you will receive reset instructions.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// POST /reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/me
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Verifica se l'utente esiste
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Elimina l'utente
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
