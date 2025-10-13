import mongoose from "mongoose";
import Bill from "./Bill.js";

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },

  //Nuove informazioni generali
  mprn: { type: String },
  address: { type: String },
  city: { type: String },
  postcode: { type: String },
  buildingType: { type: String }, // es. residenziale, commerciale...
  yearBuilt: { type: Number },

  //Sezioni tecniche che puoi compilare da edit-building-info
  envelope: {
    walls: { type: String },
    roof: { type: String },
    doors: { type: String },
    windows: { type: String }
  },
  lighting: {
    currentLighting: { type: String },
    baselineLighting: { type: String },
    lightingSavings: { type: String }
  },
  auxiliary: {
    currentUsage: { type: String },
    baselineUsage: { type: String },
    auxiliarySavings: { type: String }
  },
  significantEnergyUsers: [
    {
      name: { type: String },
      consumption: { type: String },
      efficiency: { type: String },
      notes: { type: String }
    }
  ],

  //Bollette collegate
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }]
});

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    buildings: [buildingSchema]
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
