import dotenv from 'dotenv';


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes (attenzione: devi scrivere l’estensione .js)
import usersRouter from "./routes/users.js";
import projectsRouter from "./routes/projects.js";
import buildingsRouter from "./routes/buildings.js";
import deepseekRoutes from './routes/deepseek.js';

dotenv.config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('JWT_SECRET:', process.env.JWT_SECRET);


const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));


app.use(cors({
  origin: 'http://localhost:4200', // il tuo frontend Angular
  credentials: true,               // ⚠️ necessario per cookie
}));


app.use(cookieParser());

// Usa le routes
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/buildings", buildingsRouter);
app.use('/api/deepseek', deepseekRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/wattWisee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB!");
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
