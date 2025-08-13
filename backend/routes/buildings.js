const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
// modello mongoose dei buildings

// GET - restituisce tutti i buildings
router.get('/buildings', async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
