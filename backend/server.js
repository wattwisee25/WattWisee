// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import usersRouter from "./routes/users.js";
import projectsRouter from "./routes/projects.js";
import billRouter from "./routes/bill.js";
import uploadsRouter from "./routes/s-upload.js";

const app = express();

// Per avere __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(cookieParser());

// Rotte API
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/bill", billRouter);
app.use("/api/uploads", uploadsRouter);

// Serve la cartella uploads (backend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve gli assets del frontend (logo, immagini ecc.)
app.use('/assets', express.static(path.join(__dirname, '../frontend/src/assets')));

// Esempio: servire il logo direttamente
app.get('/logo', (req, res) => {
  const logoPath = path.join(__dirname, '../../frontend/src/assets/img/logo.png');
  res.sendFile(logoPath, err => {
    if (err) {
      console.error('Errore nel servire il logo:', err);
      res.status(500).send('Errore interno del server');
    }
  });
});

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://wattwisee25_db_user:Fi7W7YI8TDUTGuIA@wattwisee.9chzy5q.mongodb.net/wattWisee")
  .then(() => {
    console.log("✅ Connected to MongoDB!");
   // Use the PORT environment variable provided by Render/Heroku, fallback to 3000 locally
const port = process.env.PORT || 3000;

// Start Express server only after MongoDB connection is established
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
  })
  .catch(err => console.error("MongoDB connection error:", err));
