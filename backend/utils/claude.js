// utils/claude.js
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { fromPath } from 'pdf2pic';
import { queryClaudeWithImage } from '../services/anthropicClaude.js';

/**
 * Processes an uploaded PDF or image file and returns extracted text via Claude
 * @param {string} filePath - Path of the uploaded file (from multer)
 * @returns {Promise<{ text: string }>}
 */
export async function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  let extractedText = { text: '' };

  try {
    if (ext === '.pdf') {
      extractedText = await extractTextFromPdf(filePath);
    } else if (ext.match(/\.(jpg|jpeg|png|bmp|tiff)$/)) {
      extractedText = await extractTextFromImage(filePath);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  } catch (err) {
    console.error('Error processing file:', err.message);
    throw err;
  } finally {
    // Remove uploaded file after processing
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (cleanupErr) {
      console.warn('Could not delete uploaded file:', filePath, cleanupErr.message);
    }
  }

  return extractedText;
}

/**
 * Extract text from a PDF; if empty, fallback to converting pages to images and using Claude
 */
async function extractTextFromPdf(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdf(dataBuffer);
  const text = pdfData.text.trim();

  if (text.length > 0) {
    console.log('Digital PDF text found, length:', text.length);
    return { text };
  }

  console.log('No digital text found in PDF, using images + Claude');
  return await pdfToImagesAndClaude(pdfPath);
}

/**
 * Convert PDF to images and extract text from each page using Claude
 */
async function pdfToImagesAndClaude(pdfPath) {
  const outputDir = path.join(process.cwd(), 'uploads', 'temp');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const convert = fromPath(pdfPath, {
    density: 150,
    savePath: outputDir,
    saveFilename: 'page',
    format: 'png',
  });

  const pages = [];
  let pageNum = 1;

  while (true) {
    try {
      const page = await convert(pageNum);
      if (!page || !page.path) break;
      pages.push(page.path);
      pageNum++;
    } catch {
      break; // no more pages
    }
  }

  console.log('Pages converted to images:', pages.length);

  let fullText = '';
  for (const imgPath of pages) {
    try {
      const pageText = await queryClaudeWithImage(
        imgPath,
        'Extract all text from this document page.'
      );
      fullText += pageText + '\n';
    } catch (err) {
      console.warn('Claude error for page:', imgPath, err.message);
    } finally {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); // cleanup temp image
    }
  }

  return { text: fullText.trim() };
}

/**
 * Extract text from an image using Claude
 */
async function extractTextFromImage(imgPath) {
  const text = await queryClaudeWithImage(
    imgPath,
    'Extract all text from this image.'
  );
  return { text };
}
