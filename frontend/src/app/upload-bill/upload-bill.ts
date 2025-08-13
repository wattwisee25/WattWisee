import { Component, OnInit } from '@angular/core';
import { BuildingService, Building } from '../services/building.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-bill',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-bill.html',
  styleUrls: ['./upload-bill.css'],
})
export class UploadBillComponent implements OnInit {
  buildings: Building[] = [];
  selectedBuilding: Building | null = null;

  selectedFile: File | null = null;
  selectedFilePreview: string | ArrayBuffer | null = null;

  constructor(private buildingService: BuildingService) {}

  ngOnInit(): void {
    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.getBuildings().subscribe({
      next: (data) => (this.buildings = data),
      error: (err) => console.error('Errore caricamento buildings', err),
    });
  }

  selectBuilding(building: Building) {
    this.selectedBuilding = building;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.selectedFilePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadBill() {
    if (!this.selectedBuilding) {
      alert('Seleziona prima un building');
      return;
    }
    if (!this.selectedFile) {
      alert('Seleziona prima un file');
      return;
    }

    // Qui metti la logica di upload associata a this.selectedBuilding._id e this.selectedFile
    // ad esempio chiamando un altro servizio backend
  }
}
