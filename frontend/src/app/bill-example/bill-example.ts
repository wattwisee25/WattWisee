import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bill-example',
  templateUrl: './bill-example.html'
})
export class BillExampleComponent {
  selectedFile!: File;
  extractedText: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{ text: string }>('http://localhost:3000/api/files', formData)
      .subscribe(response => {
        this.extractedText = response.text;
      });
  }
}
