import mongoose from "mongoose";
import Bill from "./Bill.js";

// --- SCHEMI ---
const windowSchema = new mongoose.Schema({
  length: { type: Number },
  width: { type: Number },
  totalArea: { type: Number },
  number: { type: Number },
  windowsDetails: [
    {
      windowType: { type: String },
      uValue: { type: Number },
      solarGain: { type: Number },
      orientation: { type: String },
      heatLoss: { type: Number },
    },
  ],
});

const doorSchema = new mongoose.Schema({
  length: { type: Number },
  width: { type: Number },
  totalArea: { type: Number },
  number: { type: Number },
  doorsDetails: [
    {
      doorType: { type: String },
      uValue: { type: Number },
      doorSealingMechanism: { type: String },
      doorLeakTest: { type: String },
      heatLoss: { type: Number },
    },
  ],
});

const wallSchema = new mongoose.Schema({
  length: { type: Number },
  width: { type: Number },
  totalArea: { type: Number },
  description: { type: String },
  number: { type: Number },
  orientation: { type: String },
  exposure: { type: String },
  windows: [windowSchema],
  doors: [doorSchema],
  wallsDetails: [
    {
      constructionType: { type: String },
      insulationMaterials: { type: String },
      insideMaterials: { type: String },
      constructionMaterials: { type: String },
      uValue: { type: Number },
      heatLossMeter: { type: Number },
      heatLossTotal: { type: Number },
    },
  ],
});


const roofSchema = new mongoose.Schema({
  totalArea: { type: Number },
  number: { type: Number },
  roofsDetails: [
    {
      insulationType: { type: String },
      area: { type: Number },
      uValue: { type: Number },
      heatLoss: { type: Number },
    },
  ],
});

const floorSchema = new mongoose.Schema({
  length: Number,
  width: Number,
  totalArea: Number,
  floorsDetails: Array
});

const roomSchema = new mongoose.Schema({
  name: { type: String },
  walls: [wallSchema],
  roofs: [roofSchema],
  floors: [floorSchema]
});

const lightingSchema = new mongoose.Schema({
  lightingType: { type: String },
  number: { type: Number },
  lightingControls: { type: String },
  totalEnergyUsed: { type: Number },
});

const auxiliarySchema = new mongoose.Schema({
  currentUsage: { type: Number },
  baselineUsage: { type: Number },
  lightingControls: { type: String },
  totalEnergyUsed: { type: Number },
});

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },

  generalInfo: {
    mprn: { type: String },
    address: { type: String },
    city: { type: String },
    eircode: { type: String },
  },

  buildingEnvelope: {
    buildingType: { type: String },
    yearBuilt: { type: Number },
    surfaceArea: { type: Number },
    rooms: [roomSchema],
  },

  lighting: [lightingSchema],
  auxiliaryUsage: [auxiliarySchema],

  significantEnergyUsers: [
    {
      name: { type: String },
      consumption: { type: Number },
      efficiency: { type: String },
      notes: { type: String },
    },
  ],

  checklist: [
    {
      label: String,
      yes: Boolean,
      no: Boolean,
      na: Boolean,
      comment: String,
    },
  ],

  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
});

// --- MODELLI ---

const Building = mongoose.model("Building", buildingSchema);

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    buildings: [buildingSchema],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

// --- EXPORT ESM ---

export { Project, Building };
