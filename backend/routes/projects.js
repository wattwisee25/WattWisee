import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST: creare un progetto (già esistente)
router.post("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token mancante" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const owner = await User.findById(userId);
    if (!owner) return res.status(404).json({ message: "Utente non trovato" });

    const { projectName, buildings } = req.body;
    if (!projectName) return res.status(400).json({ message: "Il nome del progetto è obbligatorio" });

    const newProject = new Project({ projectName, buildings, owner: owner._id });
    await newProject.save();

    res.status(201).json({ message: "Progetto creato con successo", project: newProject });
  } catch (err) {
    console.error("Errore salvataggio progetto:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// GET: ottenere tutti i progetti dell'utente loggato
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token mancante" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const projects = await Project.find({ owner: userId }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Errore nel recupero progetti:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// esempio Express + Mongoose
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    res.json(project);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
