// backend/models/Project.js
import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true } // qui salviamo la stringa Base64 o il path
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buildings: [buildingSchema] // array di buildings
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
