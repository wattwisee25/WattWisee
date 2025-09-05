import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { CommonModule } from '@angular/common';

// PDF.js worker path
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';

@Component({
  selector: 'app-bill-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-example.html',
  styleUrls: ['./bill-example.css']
})
export class BillExample {
  extractedText: string = '';
  processing: boolean = false;
  progress: number = 0;
  parsedData: { totals: number[], kwh: number[] } | null = null;

  constructor(private http: HttpClient) {}

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files.length) return;

    this.extractedText = '';
    this.parsedData = null;
    this.processing = true;
    this.progress = 0;

    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const baseProgress = (i / totalFiles) * 100;

      let text = '';
      if (file.type === 'application/pdf') {
        text = await this.readPdf(file, baseProgress, totalFiles);
      } else if (file.type.startsWith('image/')) {
        text = await this.readImage(file, baseProgress);
      }

      this.extractedText += text + '\n';
      await this.sendFileToBackend(file);
      this.progress = ((i + 1) / totalFiles) * 100;
    }

    this.parsedData = this.parseBillData(this.extractedText);
    this.processing = false;
  }

  private readPdf(file: File, baseProgress: number, totalFiles: number): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          if (textContent.items.length > 0) {
            for (const item of textContent.items) {
              if ('str' in item) fullText += item.str + ' ';
            }
          } else {
            // OCR per pagina scansionata
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d')!;
            await page.render({ canvasContext: context, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/png');

            const ocrResult = await Tesseract.recognize(dataUrl, 'eng', {
              logger: (m) => {
                if (m.status === 'recognizing text') {
                  this.progress = baseProgress + (m.progress / totalFiles) * 100;
                }
              }
            });

            fullText += ocrResult.data.text + ' ';
          }
        }

        resolve(fullText);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private readImage(file: File, baseProgress: number): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const ocrResult = await Tesseract.recognize(reader.result as string, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              this.progress = baseProgress + m.progress * 50; // peso OCR immagine
            }
          }
        });
        resolve(ocrResult.data.text);
      };
      reader.readAsDataURL(file);
    });
  }

  private sendFileToBackend(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/deepseek/upload', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress = (event.loaded / event.total) * 100;
          } else if (event.type === HttpEventType.Response) {
            console.log('Backend response:', event.body);
            resolve();
          }
        },
        error: (err) => {
          console.error('Backend error:', err);
          reject(err);
        }
      });
    });
  }

  private parseBillData(text: string): { totals: number[], kwh: number[] } {
    const totals: number[] = [];
    const kwh: number[] = [];

    const totalRegex = /(\d+(?:[.,]\d{2}))\s?(?:€|EUR)/gi;
    const kwhRegex = /(\d+(?:[.,]\d+)?)\s?kWh/gi;

    let match;
    while ((match = totalRegex.exec(text)) !== null) {
      const value = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(value)) totals.push(value);
    }

    while ((match = kwhRegex.exec(text)) !== null) {
      const value = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(value)) kwh.push(value);
    }

    return { totals, kwh };
  }

  get totalAmount(): number | null {
  if (!this.parsedData || this.parsedData.totals.length === 0) return null;
  return this.parsedData.totals.reduce((sum, val) => sum + val, 0);
}

get totalKwh(): number[] {
  return this.parsedData?.kwh || [];
}

}
