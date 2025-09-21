// routes/ocr.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import { fromPath } from 'pdf2pic';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execAsync = promisify(exec);

// ------------------------------
// Multer upload
// ------------------------------
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Formato file non supportato'));
    }
    cb(null, true);
  }
});

// ------------------------------
// Check Poppler
// ------------------------------
async function checkPoppler() {
  try {
    await execAsync('pdftoppm -h');
    return true;
  } catch {
    return false;
  }
}

// ------------------------------
// PDF → immagini via pdftoppm
// ------------------------------
async function pdfToImagesWithPdftoppm(pdfPath) {
  const outputDir = path.join('temp_images', path.basename(pdfPath, path.extname(pdfPath)));
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPrefix = path.join(outputDir, 'page');
  await execAsync(`pdftoppm -png -r 150 "${pdfPath}" "${outputPrefix}"`, {
    timeout: 60000,
    maxBuffer: 50 * 1024 * 1024
  });

  const files = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.png'))
    .map(f => path.join(outputDir, f))
    .sort();

  if (!files.length) throw new Error('Nessuna immagine generata dal PDF');
  return files;
}

// ------------------------------
// PDF → immagini via pdf2pic (fallback)
// ------------------------------
async function pdfToImagesWithPdf2pic(pdfPath) {
  const outputDir = path.join('temp_images', path.basename(pdfPath, path.extname(pdfPath)));
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const pdfData = await pdfParse(fs.readFileSync(pdfPath));
  const numPages = pdfData.numpages;
  const converter = fromPath(pdfPath, {
    density: 150,
    saveFilename: 'page',
    savePath: outputDir,
    format: 'png',
    width: 1200,
    height: 1600
  });

  const images = [];
  for (let i = 1; i <= numPages; i++) {
    try {
      const res = await converter(i, { responseType: 'image' });
      images.push(res.path);
      await new Promise(r => setTimeout(r, 50));
    } catch (err) {
      console.error(`Errore conversione pagina ${i}:`, err.message);
    }
  }

  if (!images.length) throw new Error('Nessuna pagina convertita con pdf2pic');
  return images;
}

// ------------------------------
// Wrapper PDF → immagini
// ------------------------------
async function pdfToImages(pdfPath) {
  if (await checkPoppler()) {
    try {
      return await pdfToImagesWithPdftoppm(pdfPath);
    } catch (err) {
      console.warn('pdftoppm fallito, uso pdf2pic:', err.message);
    }
  }
  return await pdfToImagesWithPdf2pic(pdfPath);
}

// ------------------------------
// Crea worker Tesseract
// ------------------------------
async function createTesseractWorker() {
  const worker = await createWorker({
    langPath: path.join(process.cwd(), 'tessdata'), // cartella locale con .traineddata
    logger: m => m.status === 'recognizing text' && console.log(`OCR progress: ${Math.round(m.progress * 100)}%`)
  });
await worker.loadLanguage('eng');
await worker.initialize('eng');

  return worker;
}

// ------------------------------
// Endpoint OCR
// ------------------------------
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nessun file caricato' });

  const filePath = req.file.path;
  const originalName = req.file.originalname;
  let tempImageDir = null;

  try {
    let text = '';
    let pagesProcessed = 0;

    if (originalName.toLowerCase().endsWith('.pdf')) {
      const data = await pdfParse(fs.readFileSync(filePath));
      if (data.text.trim().length > 20) {
        text = data.text;
        pagesProcessed = data.numpages;
      } else {
        const images = await pdfToImages(filePath);
        tempImageDir = path.dirname(images[0]);

        const worker = await createTesseractWorker();
        for (let i = 0; i < images.length; i++) {
          try {
            const result = await worker.recognize(images[i]);
            if (result.data.text.trim().length > 5) {
              text += `=== Pagina ${i + 1} ===\n${result.data.text}\n\n`;
              pagesProcessed++;
            }
          } catch {
            text += `=== Pagina ${i + 1} ===\n[Errore OCR]\n\n`;
          } finally {
            if (fs.existsSync(images[i])) fs.unlinkSync(images[i]);
          }
        }
        await worker.terminate();
      }
    } else {
      const worker = await createTesseractWorker();
      const result = await worker.recognize(filePath);
      text = result.data.text;
      pagesProcessed = 1;
      await worker.terminate();
    }

    res.json({
      success: true,
      originalName,
      text: text.trim(),
      extractedChars: text.trim().length,
      pagesProcessed
    });

  } catch (err) {
    console.error('Errore OCR:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (tempImageDir && fs.existsSync(tempImageDir)) {
      fs.rmSync(tempImageDir, { recursive: true, force: true });
    }
  }
});

// ------------------------------
// Middleware errori Multer
// ------------------------------
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File troppo grande (max 50MB)' });
  }
  if (error.message === 'Formato file non supportato') {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: 'Errore server: ' + error.message });
});

export default router;
