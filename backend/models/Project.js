// backend/models/Project.js
const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true } // qui salviamo la stringa Base64 o il path
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  buildings: [buildingSchema] // array di buildings
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
