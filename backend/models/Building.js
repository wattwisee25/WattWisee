const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String }, // URL o base64 dell'immagine
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' } // se collegato a un progetto
});

const Building = mongoose.model('Building', buildingSchema);

module.exports = Building;
