import express from 'express';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const originalName = req.file.originalname;

  try {
    let text = '';

    if (originalName.endsWith('.pdf')) {
      // tenta estrazione testo
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);

      if (data.text.trim()) {
        text = data.text;
      } else {
        // PDF scansionato → OCR
        text = await Tesseract.recognize(filePath, 'eng')
                              .then(result => result.data.text);
      }
    } else {
      // immagine
      text = await Tesseract.recognize(filePath, 'eng')
                            .then(result => result.data.text);
    }

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante l\'estrazione del testo' });
  } finally {
    fs.unlinkSync(filePath);
  }
});

export default router;
