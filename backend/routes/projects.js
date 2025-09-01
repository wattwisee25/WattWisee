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


export default router;