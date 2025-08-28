import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Building {
  name: string;
  imageUrl: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './first-new-project.html',
  styleUrls: ['./first-new-project.css']
})
export class NewProjectComponent {
  projectName: string = '';
  buildingName: string = '';
  selectedImage: File | null = null;
  selectedImagePreview: string | ArrayBuffer | null = null;
  buildings: Building[] = [];

  private apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedImage = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.selectedImagePreview = reader.result;
    reader.readAsDataURL(this.selectedImage);
  }

  addBuilding() {
    if (!this.buildingName || !this.selectedImagePreview) return;

    this.buildings.push({
      name: this.buildingName,
      imageUrl: this.selectedImagePreview
    });

    // Reset campi
    this.buildingName = '';
    this.selectedImage = null;
    this.selectedImagePreview = null;
  }

  saveProject() {
    if (!this.projectName || this.buildings.length === 0) {
      alert('Inserisci il nome del progetto e almeno un edificio.');
      return;
    }

    const projectData = {
      projectName: this.projectName,
      buildings: this.buildings
    };

    // Invia la richiesta con i cookie (contiene il token)
    this.http.post(this.apiUrl, projectData, { withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log('Progetto salvato con successo:', res);
          this.router.navigate(['/upload-bills']); // redirect dopo salvataggio
        },
        error: (err) => {
          console.error('Errore nel salvataggio del progetto:', err);
          alert(err.error?.message || 'Errore durante il salvataggio del progetto.');
        }
      });
  }
}
