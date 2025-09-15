// upload.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-example',
  imports: [CommonModule],
  templateUrl: './bill-example.html',
})
export class BillExampleComponent {
  selectedFile: File | null = null;
  extractedData: any = null;
  isUploading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.extractedData = null;
    this.errorMessage = null;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:3000/api/upload', formData)
      .subscribe({
        next: (res: any) => {
          this.extractedData = res;
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.errorMessage = 'Errore durante il caricamento del file';
          this.isUploading = false;
        }
      });
  }
}
