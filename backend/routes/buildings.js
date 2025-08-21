import express from "express";
import Building from "../models/Building.js"; // attenzione al .js

const router = express.Router();

// GET - restituisce tutti i buildings
router.get("/buildings", async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
