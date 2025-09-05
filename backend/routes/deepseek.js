import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processFile } from '../utils/deepseek.js';
import Project from '../models/Project.js'; // Only using Project model

const router = express.Router();

// Temporary upload folder
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/deepseek/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { projectId, buildingId, type } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!projectId) return res.status(400).json({ error: 'No project selected' });
    if (!buildingId) return res.status(400).json({ error: 'No building selected' });
    if (!type) return res.status(400).json({ error: 'No bill type specified' });

    console.log('File received:', req.file.path);

    // 1️⃣ Extract data using Deepseek / OCR fallback
    const extractedData = await processFile(req.file.path);

    const bill = {
      type,
      filename: req.file.filename,
      uploadDate: new Date(),
      extractedData
    };

    // 2️⃣ Find project and building, save bill
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const building = project.buildings.id(buildingId);
    if (!building) return res.status(404).json({ error: 'Building not found in project' });

    if (!building.bills) building.bills = [];
    building.bills.push(bill);

    await project.save();

    // 3️⃣ Respond to frontend
    res.status(200).json({
      message: 'File uploaded and saved successfully',
      projectId,
      buildingId,
      bill
    });

  } catch (error) {
    console.error('Error during upload:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
