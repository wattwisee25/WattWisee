// routes/projects.ts
import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware per verificare il token JWT
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Token not valid:", err);
    return res.status(401).json({ message: "Token not valid" });
  }
};

// ==================== ALL USER'S PROJECT ====================
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error while retrieving projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== NEW PROJECT ====================
router.post("/", verifyToken, async (req, res) => {
  try {
    const owner = await User.findById(req.userId);
    if (!owner) return res.status(404).json({ message: "User not found" });

    const { projectName, buildings } = req.body;
    if (!projectName) return res.status(400).json({ message: "Project name required" });

    const newProject = new Project({ projectName, buildings, owner: owner._id });
    await newProject.save();

    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (err) {
    console.error("Project saving error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== PROJECT BY ID ====================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // verifica che l'utente sia il proprietario
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error("Project recovery error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== ADD NEW BUILDINGS TO AN EXISTING PROJECT ====================
router.put("/:id/buildings", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // verifica che l'utente sia il proprietario
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    const { buildings } = req.body;
    if (!buildings || !Array.isArray(buildings)) {
      return res.status(400).json({ message: "Missing buildings or invalid format" });
    }

    project.buildings.push(...buildings);
    await project.save();

    res.status(201).json({ message: "Edifici aggiunti con successo", project });
  } catch (err) {
    console.error("Errore aggiunta edifici:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});

// ==================== GET ALL BUILDINGS OF A PROJECT ====================
router.get('/:id/buildings', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select('buildings');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project.buildings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== GET SINGLE BUILDING BY ID ====================
router.get('/buildings/:buildingId', verifyToken, async (req, res) => {
  try {
    const { buildingId } = req.params;

    // trova il progetto che contiene questo building
    const project = await Project.findOne({ 'buildings._id': buildingId });
    if (!project) return res.status(404).json({ message: 'Building not found' });

    // verifica che l'utente sia il proprietario
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // trova l'edificio
    const building = project.buildings.id(buildingId);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }

    // restituisci l'edificio
    res.status(200).json(building);
  } catch (err) {
    console.error('Errore nel recupero edificio:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;