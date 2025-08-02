import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  standalone: true,   // 👈 standalone component
  imports: [FormsModule, CommonModule, RouterModule], // 👈 importa FormsModule e CommonModule
  templateUrl: './new-project.html',
  styleUrls: ['./new-project.css']
})
export class NewProjectComponent {
  constructor(private http: HttpClient, private router: Router) {}
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

saveProject() {
  this.router.navigate(['/upload-bills']);
}
}