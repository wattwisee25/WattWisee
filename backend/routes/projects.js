const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Salvataggio progetto
router.post('/', async (req, res) => {
  try {
    const { projectName, buildings } = req.body;

    if (!projectName) {
      return res.status(400).json({ message: 'Il nome del progetto è obbligatorio' });
    }

    const newProject = new Project({ projectName, buildings });
    await newProject.save();

    res.status(201).json({ message: 'Progetto creato con successo', project: newProject });
  } catch (err) {
    console.error('Errore salvataggio progetto:', err);
    res.status(500).json({ message: 'Errore del server' });
  }
});

module.exports = router;
