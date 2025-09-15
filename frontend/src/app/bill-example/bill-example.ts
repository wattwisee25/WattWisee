// bill-example.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-example',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './bill-example.html',
  styleUrls: ['./bill-example.css']
})
export class BillExampleComponent {
  selectedFile: File | null = null;
  extractedData: { text: string } | null = null;
  isUploading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.extractedData = null;
    this.errorMessage = null;
  }

  uploadFile(projectId: string, buildingId: string, type: string) {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('projectId', projectId);
    formData.append('buildingId', buildingId);
    formData.append('type', type);

    this.http.post<{ extractedData: { text: string } }>(
      'http://localhost:3000/api/claude/upload', formData
    ).subscribe({
      next: (res) => {
        this.extractedData = res.extractedData; // <-- attenzione qui
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.errorMessage = 'Error uploading file';
        this.isUploading = false;
      }
    });
  }
}
