import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { fromPath } from 'pdf2pic';
import Tesseract from 'tesseract.js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.ai';

// Main function to process a file
export async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === '.pdf') {
      // Try Deepseek first
      try {
        return await sendToDeepseek(filePath);
      } catch (err) {
        console.warn('Deepseek failed, falling back to OCR:', err.message);
        return await pdfToTextWithOCR(filePath);
      }
    } else {
      // Image file → direct OCR
      return await imageToText(filePath);
    }
  } finally {
    // Remove the uploaded file after processing
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

// Sends PDF or image to Deepseek API
async function sendToDeepseek(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const formData = new FormData();
  formData.append('file', fileStream);

  const response = await axios.post(`${DEEPSEEK_BASE_URL}/extract`, formData, {
    headers: {
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      ...formData.getHeaders(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return response.data;
}

// Convert PDF to images and run OCR on each page
async function pdfToTextWithOCR(pdfPath) {
  const outputDir = path.join(process.cwd(), 'uploads', 'temp');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const convert = fromPath(pdfPath, {
    density: 150,
    savePath: outputDir,
    format: 'png',
    saveFilename: 'page'
  });

  // Convert all pages
  const pages = [];
  let pageNum = 1;
  while (true) {
    try {
      const page = await convert(pageNum);
      pages.push(page.path);
      pageNum++;
    } catch {
      break; // no more pages
    }
  }

  // OCR each page
  let fullText = '';
  for (const imgPath of pages) {
    const text = await imageToText(imgPath);
    fullText += text.text + '\n';
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); // clean up temp image
  }

  return { text: fullText.trim() };
}

// OCR an image with Tesseract
async function imageToText(imgPath) {
  const result = await Tesseract.recognize(imgPath, 'eng', { logger: m => console.log(m) });
  return { text: result.data.text };
}
