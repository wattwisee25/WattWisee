// routes/claude.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processFile } from '../utils/claude.js';

const router = express.Router();

// Upload folder
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ✅ POST /api/claude/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', req.file.path);

    let extractedData;
    try {
      extractedData = await processFile(req.file.path);
    } catch (err) {
      console.error('Error in processFile:', err);
      return res.status(500).json({ 
        error: 'Error processing file', 
        details: err.message 
      });
    }

    // ✅ qui puoi prendere extractedData.text in sicurezza
    const extractedText = extractedData.text;

    res.status(200).json({
      message: 'File processed successfully',
      fileName: req.file.originalname,
      extractedData: {
        text: extractedText
      }
    });

  } catch (error) {
    console.error('Generic upload error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

export default router;
