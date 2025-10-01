import mongoose from "mongoose";
import Bill from './Bill.js';

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
    bills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }]
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buildings: [buildingSchema]
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
