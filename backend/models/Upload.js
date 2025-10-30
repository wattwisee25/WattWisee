import mongoose from "mongoose";
import { time } from "speakeasy";

const uploadSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  macroCategory: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  costWork: String,
  costSavings: String,
  emissionReduction: String,
  paybackPeriod: String,
  size: String,
  warrantyHardware: String,
  warrantyLabour: String,
  multipleItems: String,
  installationDate: Date,
  installationTime: String,
  requirements: String,
  notes: String,
}, { timestamps: true });

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload;
