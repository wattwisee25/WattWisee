import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Imposta il worker dal percorso assets
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';

@Component({
  selector: 'app-bill-example',
  templateUrl: './bill-example.html',
  styleUrls: ['./bill-example.css']
})
export class BillExample {
  extractedText: string = '';
  processing: boolean = false;

  constructor(private http: HttpClient) {}

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files.length) return;

    this.extractedText = '';
    this.processing = true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;

      if (fileType === 'application/pdf') {
        const text = await this.readPdf(file);
        this.extractedText += text + '\n';
      } else if (fileType.startsWith('image/')) {
        const text = await this.readImage(file);
        this.extractedText += text + '\n';
      }
    }

    // Invio al backend AI
    await this.sendToBackend(this.extractedText);
    this.processing = false;
  }

  private readPdf(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let textContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();

          for (const item of text.items) {
            if ('str' in item) textContent += item.str + ' ';
          }
        }
        resolve(textContent);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private readImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = await Tesseract.recognize(reader.result as string, 'ita');
        resolve(result.data.text);
      };
      reader.readAsDataURL(file);
    });
  }

  private sendToBackend(text: string): Promise<void> {
    if (!text.trim()) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/deepseek', { text }).subscribe({
        next: (response) => {
          console.log('Risposta AI:', response);
          resolve();
        },
        error: (error) => {
          console.error('Errore backend:', error);
          reject(error);
        }
      });
    });
  }
}
