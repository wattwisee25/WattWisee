import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersegreto'; // fallback

let transporter;

// ==================== INIZIALIZZA NODEMAILER ====================
(async () => {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log("Nodemailer ready with Gmail:", process.env.EMAIL_USER);
  } catch (err) {
    console.error("Error creating transporter:", err);
  }
})();

// ==================== REGISTRAZIONE ====================
router.post('/', async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creo il nuovo utente
    const newUser = new User({ ...rest, password: hashedPassword });
    await newUser.save(); // Utente salvato nel DB

    // Provo a inviare email ma non blocco la registrazione se fallisce
    if (transporter) {
const mailOptions = {
  from: '"WattWisee Support" <no-reply@wattwisee.com>',
  to: newUser.email,
  subject: 'Welcome to WattWisee!',
  text: `Hi ${newUser.contact_name || ''}, thank you for registering!`,
  html: `
    <div style="font-family: "Space grotesk", sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #c1dbe3; padding: 20px; text-align: center; color: white;">
      <img src="cid:logo" alt="WattWisee Logo" style="height: 60px; margin-bottom: 20px;" />
        <h2 style="color: #31545b">Welcome to WattWisee!</h2>
      </div>
      <div style="padding: 20px; color: #333;">
        <p>Hi <strong>${newUser.contact_name || 'there'}</strong>,</p>
        <p>Thank you for registering on <b>WattWisee</b>! We're excited to have you on board.</p>
        <p>To get started, log in to your account and explore our features.</p>
        <p style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:4200/login" 
             style="background-color: #c1dbe3; color: #31545b; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
             Login to Your Account
          </a>
        </p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © 2025 WattWisee. All rights reserved.
      </div>
    </div>
  `,
    attachments: [
    {
      filename: 'logo.png',
      path: 'C:/Users/ilari/Documents/WattWisee/frontend/src/assets/img/logo.png', // percorso relativo al backend
      cid: 'logo' // deve corrispondere al src
    }
  ]
};


      transporter.sendMail(mailOptions)
        .then(() => console.log('Confirmation email sent'))
        .catch((err) => console.error('Email sending failed:', err));
    }

    // Rispondo subito ad Angular
    res.status(201).json({ message: 'User registered successfully. Confirmation email sent.' });

  } catch (err) {
    console.error('Registration error:', err);

    // Controllo specifico per email già registrata
    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Qualsiasi altro errore
    res.status(500).json({ message: 'Registration failed' });
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    if (transporter) {
     await transporter.sendMail({
  from: '"WattWisee Support" <no-reply@wattwisee.com>',
  to: user.email,
  subject: 'Your OTP Code - WattWisee',
  text: `Your OTP code is: ${otp}. If you did not request this, please ignore this email.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="cid:logo" alt="WattWisee Logo" style="height: 60px; margin-bottom: 20px;" />
      </div>
      <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
      <p style="font-size: 16px; color: #555;">Hi ${user.contact_name || ''},</p>
      <p style="font-size: 16px; color: #555;">
        Your OTP code for WattWisee is:
      </p>
      <p style="font-size: 24px; font-weight: bold; color: #31545b; text-align: center; margin: 20px 0;">
        ${otp}
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:4200/login" style="background-color: #31545b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Go to WattWisee</a>
      </div>
      <p style="font-size: 14px; color: #888; text-align: center;">
        If you did not request this code, please ignore this email.
      </p>
    </div>
  `,
  attachments: [
    {
      filename: 'logo.png',
      path: 'C:/Users/ilari/Documents/WattWisee/frontend/src/assets/img/logo.png', // percorso relativo al backend
      cid: 'logo' // deve corrispondere al src
    }
  ]
});

    }

    res.json({ message: 'OTP sent via email.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== VERIFY OTP ====================
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== GET PROFILE ====================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('GET /me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== UPDATE PROFILE ====================
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
    console.error('PUT /me error:', err);
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
    if (transporter) {
      await transporter.sendMail({
        from: '"WattWisee Support" <no-reply@wattwisee.com>',
        to: email,
        subject: 'Password Reset Request - WattWisee',
        text: `Reset your password: ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      });
    }

    res.json({ message: 'If this email exists, you will receive reset instructions.' });
  } catch (err) {
    console.error('Forgot-password error:', err);
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
    console.error('Reset-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== DELETE ACCOUNT ====================
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (transporter) {
      try {
        await transporter.sendMail({
          from: '"WattWisee Support" <no-reply@wattwisee.com>',
          to: user.email,
          subject: 'Account Deletion Confirmation - WattWisee',
          text: `Hi ${user.contact_name || ''}, your account has been successfully deleted from WattWisee.`,
          html: `<p>Hi ${user.contact_name || ''},</p><p>Your account has been <b>successfully deleted</b> from <b>WattWisee</b>.</p>`,
        });
      } catch (mailErr) {
        console.error("Error sending account deletion email:", mailErr);
      }
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
