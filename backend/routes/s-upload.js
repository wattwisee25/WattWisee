import express from "express";
import Upload from "../models/Upload.js"; // importa il modello

const router = express.Router();

// POST /api/uploads
router.post("/", async (req, res) => {
  try {
    const newUpload = new Upload(req.body);
    await newUpload.save();
    res.status(201).json({ 
      message: "Upload saved successfully", 
      data: newUpload 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error saving upload", 
      error: error.message 
    });
  }
});

export default router;
