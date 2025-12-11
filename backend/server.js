import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: true,      // permette tutte le origini
  credentials: true  // necessario se usi cookie o JWT
}));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/bill", billRouter);
app.use("/api/uploads", uploadsRouter);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connessione MongoDB e avvio server
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
