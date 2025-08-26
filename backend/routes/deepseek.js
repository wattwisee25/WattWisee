import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processFile } from '../utils/deepseek.js';

const router = express.Router();

// Cartella temporanea per gli upload
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurazione Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Rotta POST per processare il file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }

    console.log('File ricevuto:', req.file.path);

    // Chiamata alla funzione che manda il file a DeepSeek
    const result = await processFile(req.file.path);

    // Risposta al frontend
    res.status(200).json({
      message: 'File processato con successo',
      deepseekData: result
    });

  } catch (error) {
    console.error('Errore durante l’upload/analisi:', error);
    res.status(500).json({ error: 'Errore interno durante l’analisi del file' });
  }
});

export default router;
