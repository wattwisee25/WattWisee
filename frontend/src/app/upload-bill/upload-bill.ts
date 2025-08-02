import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-bill',
  imports: [],
  templateUrl: './upload-bill.html',
  styleUrl: './upload-bill.css'
})
export class UploadBillComponent {
selectedImage: File | null = null;
selectedImagePreview: string | ArrayBuffer | null = null;
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    this.selectedImage = input.files[0];
    
    // Creazione preview
    const reader = new FileReader();
    reader.onload = () => this.selectedImagePreview = reader.result;
    reader.readAsDataURL(this.selectedImage);
  }
}
}
