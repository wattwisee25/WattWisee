import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import usersRouter from "./routes/users.js";
import projectsRouter from "./routes/projects.js";
import fileRouter from "./routes/uploadFile.js";

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/files", fileRouter); // ✅ corretto

mongoose.connect("mongodb://localhost:27017/wattWisee")
  .then(() => {
    console.log("✅ Connected to MongoDB!");
    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
  })
  .catch(err => console.error("MongoDB connection error:", err));

