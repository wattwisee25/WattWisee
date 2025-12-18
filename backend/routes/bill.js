import express from 'express';
import Bill from "../models/Bill.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

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

// ==================== OTTIENI UNA BOLLETTA PER ID ====================
router.get('/id/:id', async (req, res) => {
  const id = req.params.id?.trim();
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bill not found' });
  }

  try {
    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    console.error("❌ Error fetching bill by ID:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== CREA O AGGIORNA UNA BOLLETTA ====================
router.post('/', upload.single('bill'), async (req, res) => {
  try {
    const { buildingId, type, data } = req.body;
    if (!buildingId || !type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const billData = JSON.parse(data);

    // Se arriva un file, aggiornalo nei dati
    if (req.file) {
      billData.filePath = req.file.path;
      billData.fileName = req.file.originalname;
    }

    // ========= 🔍 SE ESISTE _id → UPDATE =========
    if (billData._id) {
      const id = billData._id;

      // rimuovi _id dai dati per evitare errori di mongo
      delete billData._id;

      const updated = await Bill.findByIdAndUpdate(
        id,
        { buildingId, type, data: billData },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: 'Bill not found' });

      return res.json(updated);
    }

    // ========= 🟢 SE NON ESISTE → CREA =========
    const newBill = new Bill({
      buildingId,
      type,
      data: billData
    });

    await newBill.save();
    return res.status(201).json(newBill);

  } catch (err) {
    console.error("❌ Error saving/updating bill:", err);
    res.status(500).json({ error: err.message });
  }
});


// ==================== CHECK IF BUILDING HAS ANY BILLS ====================
router.get('/check/:buildingId', async (req, res) => {
  try {
    const { buildingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
      return res.status(400).json({ exists: false });
    }

    const count = await Bill.countDocuments({ buildingId });

    res.status(200).json({ exists: count > 0 });
  } catch (err) {
    console.error('❌ Error checking bills existence:', err);
    res.status(500).json({ exists: false });
  }
});


// ==================== OTTIENI BOLLETTE PER BUILDING E TYPE ====================
router.get('/:buildingId/:type', async (req, res) => {
  try {
    const { buildingId, type } = req.params;
    if (!['electricity', 'oil', 'lpg'].includes(type)) return res.status(400).json({ error: 'Invalid bill type' });

    const bills = await Bill.find({ buildingId, type }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    console.error("❌ Error fetching bills:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== ELIMINA UNA BOLLETTA ====================
router.delete('/:id', async (req, res) => {
  const id = req.params.id?.trim();
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'Bill not found' });

  try {
    const deleted = await Bill.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Bill not found' });

    // Rimuove il file fisico se esiste
    if (deleted.data) {
      for (const key in deleted.data) {
        const fileObj = deleted.data[key];
        if (fileObj?.filePath && fs.existsSync(fileObj.filePath)) {
          fs.unlinkSync(fileObj.filePath);
        }
      }
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting bill:", err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
