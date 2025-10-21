import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  buildingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Building' },
  type: { type: String, enum: ['electricity','oil','lpg'], required: true },
  data: { type: Object, required: true },
  filePath: { type: String }, // Percorso del file sul server
  createdAt: { type: Date, default: Date.now }
});

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
