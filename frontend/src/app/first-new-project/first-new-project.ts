import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  standalone: true,   // standalone component
  imports: [FormsModule, CommonModule, RouterModule], // importa FormsModule e CommonModule
  templateUrl: './first-new-project.html',
  styleUrls: ['./first-new-project.css']
})
export class NewProjectComponent {
  constructor(private http: HttpClient, private router: Router) {}

  selectedImage: File | null = null;
  selectedImagePreview: string | ArrayBuffer | null = null;
  buildingName: string = '';
  projectName: string = ''; 

  buildings: { name: string, imageUrl: string | ArrayBuffer | null }[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = () => this.selectedImagePreview = reader.result;
      reader.readAsDataURL(this.selectedImage);
    }
  }

  addBuilding() {
    if (this.buildingName && this.selectedImagePreview) {
      this.buildings.push({
        name: this.buildingName,
        imageUrl: this.selectedImagePreview
      });

      // Reset campi
      this.buildingName = '';
      this.selectedImage = null;
      this.selectedImagePreview = null;
    }
  }

  saveProject() {
  const projectData = {
    projectName: this.projectName,   // da aggiungere in ngModel nell'input "Project name"
    buildings: this.buildings        // tutti i buildings aggiunti
  };

  this.http.post('http://localhost:3000/api/projects', projectData)
    .subscribe({
      next: (res) => {
        console.log('Progetto salvato:', res);
        this.router.navigate(['/upload-bills']);
      },
      error: (err) => {
        console.error('Errore nel salvataggio:', err);
      }
    });
}

  }