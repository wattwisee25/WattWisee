const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth.middleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'supersegreto'; // chiave di test

let transporter;

// Inizializza Nodemailer con account Ethereal
(async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Nodemailer pronto con account Ethereal');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
  } catch (err) {
    console.error('Errore creazione account Ethereal:', err);
  }
})();

// ==================== REGISTRAZIONE ====================
router.post('/', async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...rest, password: hashedPassword });
    await newUser.save();

    // Email di conferma
    const mailOptions = {
      from: '"WattWisee Support" <no-reply@wattwisee.com>',
      to: newUser.email,
      subject: 'Confirmation Email - WattWisee',
      text: `Hi ${newUser.contact_name || ''}, thank you for your registration!`,
      html: `<p>Hi ${newUser.contact_name || ''},</p><p>Thank you for registering on <b>WattWisee</b>!</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Mail inviata: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.status(201).json({ message: 'Registration successful! Check console for Ethereal preview URL.' });
  } catch (err) {
    console.error('Errore registrazione:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    // Genera OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const info = await transporter.sendMail({
      from: '"WattWisee Support" <no-reply@wattwisee.com>',
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}, if you did not request this, please ignore this email.`,
      html: `<p>Your OTP code is: <b>${otp}</b></p></br> <p>If you did not request this, please ignore this email.</p>`,
    });

    console.log('Preview OTP URL: %s', nodemailer.getTestMessageUrl(info));
    res.json({ message: 'OTP sent. Check console for Ethereal preview URL.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== VERIFICA OTP ====================
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Reset OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Genera JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== UPDATE PROFILO ====================
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

// ==================== LOGOUT ====================
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logout successful' });
});

// ==================== FORGOT PASSWORD ====================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If this email exists, you will receive reset instructions.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:4200/reset-password/${token}`;

    const mailOptions = {
      from: '"WattWisee Support" <no-reply@wattwisee.com>',
      to: email,
      subject: 'Password Reset Request - WattWisee',
      text: `Reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Preview reset password URL: %s', nodemailer.getTestMessageUrl(info));

    res.json({ message: 'If this email exists, you will receive reset instructions.' });
  } catch (err) {
    console.error('Errore forgot-password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== RESET PASSWORD ====================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password required' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Reset token invalid or expired' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Errore reset-password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== DELETE ACCOUNT ====================
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Errore delete user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
