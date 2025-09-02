import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MenuComponent } from "../menu/menu";
import { ProjectService } from '../project.service';

interface Building {
  name: string;
  imageUrl: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MenuComponent],
  templateUrl: './add-building.html',
  styleUrl: './add-building.css'
})


export class AddBuildingComponent {
  buildingName: string = '';
  selectedImage: File | null = null;
  selectedImagePreview: string | ArrayBuffer | null = null;
  buildings: Building[] = [];

  private projectId: string | null = null;

  constructor(
    private projectService: ProjectService, // ✅ uso il service
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // ✅ prendo l'id del progetto dall'url (es: /projects/:id/add-building)
    this.projectId = this.route.snapshot.paramMap.get('id');
  }

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

    // ✅ reset campi
    this.buildingName = '';
    this.selectedImage = null;
    this.selectedImagePreview = null;
  }

  saveProject() {
    if (this.buildings.length === 0) {
      alert('Inserisci almeno un edificio.');
      return;
    }

    if (!this.projectId) {
      alert('ID progetto non trovato nell’URL.');
      return;
    }

    // ✅ uso del service
    this.projectService.addBuildingsToProject(this.projectId, this.buildings)
      .subscribe({
        next: (res) => {
          console.log('Edifici salvati con successo:', res);
          this.router.navigate(['/upload-bills']);
        },
        error: (err) => {
          console.error('Errore nel salvataggio:', err);
          alert(err.error?.message || 'Errore durante il salvataggio.');
        }
      });
  }
}
