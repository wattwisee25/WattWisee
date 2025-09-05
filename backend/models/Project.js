import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  type: { type: String, required: true }, // electricity, oil, lpg
  filename: { type: String, required: true }, // nome file sul server
  uploadDate: { type: Date, default: Date.now },
  extractedData: {} // opzionale, risultato Deepseek/Tesseract
});

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  bills: [billSchema] // array di bollette per edificio
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buildings: [buildingSchema]
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
