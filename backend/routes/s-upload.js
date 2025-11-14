import express from "express";
import mongoose from "mongoose";
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

router.get("/", async (req, res) => {
  try {
    const { ids, action, term } = req.query;

    console.log("Query params:", { ids, action, term });

    if (!ids || !action || !term) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const supplierIds = ids.split(",").map(id => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    console.log("Converted supplierIds:", supplierIds);

    // ✅ Prendi tutti i campi, inclusi supplierId
    const uploads = await Upload.find({
      supplierId: { $in: supplierIds },
      macroCategory: { $regex: `^${action}$`, $options: "i" },
      term: { $regex: `^${term}$`, $options: "i" }
    });

    console.log("Uploads found:", uploads);

    res.json(uploads);

  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



export default router;
