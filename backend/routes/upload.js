// routes/upload.js
import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Caricamento multiplo: massimo 20 file (puoi aumentare il limite)
router.post('/', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ error: 'DB not available' });
    }

    const bucket = new GridFSBucket(db, { bucketName: 'bills' });

    // `req.body.types` può arrivare come stringa o array, normalizziamo
    const types = Array.isArray(req.body.types) ? req.body.types : [req.body.types];

    // Funzione helper per salvare un file con il tipo corrispondente
    const saveFile = (file, type) => {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          metadata: {
            buildingId: req.body.buildingId,
            type: type,
          },
        });

        uploadStream.end(file.buffer);

        uploadStream.on('finish', () => {
          resolve({
            filename: file.originalname,
            type: type,
            fileId: uploadStream.id,
          });
        });

        uploadStream.on('error', (err) => reject(err));
      });
    };

    // Associa ogni file al rispettivo tipo (stesso ordine di append)
    const results = await Promise.all(
      req.files.map((file, index) => {
        const type = types[index] || 'unknown';
        return saveFile(file, type);
      })
    );

    res.json({
      message: 'File(s) uploaded successfully',
      files: results,
    });

  } catch (err) {
    console.error('Server error: ', err);
    res.status(500).json({ error: 'Error while saving.' });
  }
});

export default router;
