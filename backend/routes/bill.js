import express from 'express';
import Bill from "../models/Bill.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// ==================== CONFIGURAZIONE MULTER ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/bills';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

// ==================== CREA NUOVA BOLLETTA CON FILE ====================
router.post('/', upload.single('bill'), async (req, res) => {
  try {
    const { buildingId, type, data } = req.body;
    if (!buildingId || !type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const billData = JSON.parse(data); // i dati della bolletta arrivano come JSON string
    if (req.file) {
      billData.filePath = req.file.path; // salva il path del PDF
      billData.fileName = req.file.originalname;
    }

    const newBill = new Bill({ buildingId, type, data: billData });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    console.error("❌ Error saving bill:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== AGGIORNA UNA BOLLETTA CON FILE ====================
router.put('/:id', upload.single('bill'), async (req, res) => {
  try {
    const billData = req.body.data ? JSON.parse(req.body.data) : {};

    if (req.file) {
      billData.filePath = req.file.path;
      billData.fileName = req.file.originalname;
    }

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      { data: billData },
      { new: true }
    );

    if (!updatedBill) return res.status(404).json({ error: 'Bill not found' });
    res.json(updatedBill);
  } catch (err) {
    console.error("❌ Error updating bill:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== OTTIENI BOLLETTE PER BUILDING E TYPE ====================
router.get('/:buildingId/:type', async (req, res) => {
  try {
    const { buildingId, type } = req.params;
    if (!['electricity', 'oil', 'lpg'].includes(type)) {
      return res.status(400).json({ error: 'Invalid bill type' });
    }

    const bills = await Bill.find({ buildingId, type }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    console.error("❌ Error fetching bills:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== ELIMINA UNA BOLLETTA ====================
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Bill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Bill not found' });

    // elimina il file dal server se esiste
    if (deleted.data.filePath && fs.existsSync(deleted.data.filePath)) {
      fs.unlinkSync(deleted.data.filePath);
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting bill:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
