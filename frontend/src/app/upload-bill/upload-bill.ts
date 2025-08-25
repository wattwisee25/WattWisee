import { Component, OnInit } from '@angular/core';
import { BuildingService, Building } from '../services/building.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-bill',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-bill.html',
  styleUrls: ['./upload-bill.css'],
})
export class UploadBillComponent implements OnInit {
  selectedFile: File | null = null;
  selectedBuildingId: string | null = null;

  buildings: Building[] = [];

  constructor(
    private http: HttpClient,
    private buildingService: BuildingService
  ) {}

  ngOnInit(): void {
    this.buildingService.getBuildings().subscribe({
      next: (data) => this.buildings = data,
      error: (err) => console.error('Errore caricamento buildings:', err)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload() {
    if (!this.selectedFile) return alert('Seleziona un file!');
    if (!this.selectedBuildingId) return alert('Seleziona una struttura!');

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('buildingId', this.selectedBuildingId);

    this.http.post('http://localhost:3000/api/deepseek/upload', formData)
      .subscribe({
        next: (res) => {
          console.log('Dati estratti:', res);
          alert('File caricato ed elaborato!');
        },
        error: (err) => {
          console.error('Errore:', err);
          alert('Errore durante l’elaborazione');
        }
      });
  }
}