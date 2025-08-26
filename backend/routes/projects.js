import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middlewares/auth.middleware.js";

 // importa il middleware di autenticazione

const router = express.Router();

// POST: crea un nuovo progetto
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { projectName, buildings } = req.body;

    console.log("Project received", projectName, buildings);

    // Creazione del progetto collegato all'utente loggato
    const newProject = new Project({
      projectName,
      buildings,
      owner: req.user._id   // 🔑 qui usiamo l'id dell'utente autenticato
    });

    await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      project: newProject
    });
  } catch (err) {
    console.error("Error while saving:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
