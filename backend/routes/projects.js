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

// ==================== UPDATE SINGLE BUILDING BY ID ====================
router.put('/buildings/:buildingId', verifyToken, async (req, res) => {
  try {
    const { buildingId } = req.params;
    const updatedData = req.body;

    const project = await Project.findOne({ 'buildings._id': buildingId });
    if (!project) return res.status(404).json({ message: 'Building not found' });

    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const building = project.buildings.id(buildingId);
    if (!building) return res.status(404).json({ message: 'Building not found' });


    // Aggiorna solo campi definiti
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] !== undefined) {
        building[key] = updatedData[key];
      }
    });

    await project.save();

    res.status(200).json({
      message: 'Building updated successfully',
      building: building.toObject()
    });

  } catch (err) {
    console.error('Errore aggiornamento edificio:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ==================== SAVE CHECKLIST ====================
// Recupera la checklist di un building o di tutti i building
router.get('/:projectId/buildings/:buildingId/checklist', verifyToken, async (req, res) => {
  try {
    const { projectId, buildingId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // verifica ownership
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (buildingId === 'all') {
      // Aggrega le checklist di tutti i building
      const allChecklists = project.buildings.map(b => b.checklist || []);

      // Uniamo tutti i commenti e selezioni: se almeno un building ha yes/no/na selezionato, lo mostriamo
      const mergedChecklist = [];
      if (allChecklists.length > 0) {
        const length = allChecklists[0].length; // assumiamo checklist uguale per tutti i building
        for (let i = 0; i < length; i++) {
          mergedChecklist.push({
            label: allChecklists[0][i].label,
            yes: allChecklists.some(cl => cl[i].yes),
            no: allChecklists.some(cl => cl[i].no),
            na: allChecklists.some(cl => cl[i].na),
            // commenti concatenati con separatore
            // Merge checklist per "all buildings" evitando duplicati
            comment: Array.from(
              new Set(   // Set rimuove i duplicati
                allChecklists
                  .map(cl => cl[i].comment?.trim()) // prendi solo i commenti e trim
                  .filter(c => c && c.length > 0)   // filtra i vuoti
              )
            ).join('; ')

          });
        }
      }

      return res.status(200).json({ checklist: mergedChecklist });
    }

    // singolo building
    const building = project.buildings.id(buildingId);
    if (!building) return res.status(404).json({ message: 'Building not found' });

    res.status(200).json({ checklist: building.checklist || [] });
  } catch (err) {
    console.error('Error fetching checklist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Aggiorna o crea la checklist di un building
router.put('/:projectId/buildings/:buildingId/checklist', verifyToken, async (req, res) => {
  try {
    const { projectId, buildingId } = req.params;
    const { checklist } = req.body;

    if (!checklist || !Array.isArray(checklist)) {
      return res.status(400).json({ message: 'Missing or invalid checklist data' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // verifica ownership
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // 🔹 Se buildingId === 'all', aggiorna tutti i building
    if (buildingId === 'all') {
      project.buildings.forEach(building => {
        building.checklist = checklist;
      });
      await project.save();
      return res.status(200).json({ message: 'Checklist saved for all buildings', checklist });
    }

    // 🔹 Altrimenti aggiorna solo il building specifico
    const building = project.buildings.id(buildingId);
    if (!building) return res.status(404).json({ message: 'Building not found' });

    building.checklist = checklist;
    await project.save();

    res.status(200).json({ message: 'Checklist updated successfully', checklist });
  } catch (err) {
    console.error('Error updating checklist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




export default router;