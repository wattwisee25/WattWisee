import express from 'express';
const router = express.Router();
import Bill from "../models/Bill.js"

// Salva nuova bolletta
router.post('/', async (req, res) => {
  try {
    const { buildingId, type, data } = req.body;
    const newBill = new Bill({ buildingId, type, data });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prendi tutte le bollette di un edificio e tipo
router.get('/:buildingId/:type', async (req, res) => {
  try {
    const { buildingId, type } = req.params;
    const bills = await Bill.find({ buildingId, type }).sort({ createdAt: 1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna una bolletta
router.put('/:id', async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, { data: req.body.data }, { new: true });
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
