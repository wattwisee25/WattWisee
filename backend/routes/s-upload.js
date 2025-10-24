// /routes/uploads.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Schema e modello
const uploadSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  term: { type: String, required: true },
  action: { type: String, required: true },
  costWork: String,
  costSavings: String,
  emissionReduction: String,
  paybackPeriod: String,
  size: String,
  warrantyHardware: String,
  warrantyLabour: String,
  multipleItems: String,
  installationDate: String,
  installationTime: String,
  requirements: String,
  notes: String
}, { timestamps: true });

const Upload = mongoose.model('Upload', uploadSchema);

// POST /api/uploads
router.post('/', async (req, res) => {
  try {
    const newUpload = new Upload(req.body);
    await newUpload.save();
    res.status(201).json({ message: 'Upload saved successfully', data: newUpload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving upload', error });
  }
});

export default router;
