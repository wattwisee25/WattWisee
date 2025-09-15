import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-building-info',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, RouterModule],
  templateUrl: './building-info.html',
  styleUrls: ['./building-info.css']
})
export class BuildingInfoComponent implements OnInit {
  selectedBuilding: Building | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage: string | null = null;
  newImageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const buildingId = params.get('id');
      if (buildingId) {
        this.loadBuilding(buildingId);
      } else {
        this.errorMessage = 'No building ID provided in the URL';
      }
    });
  }

  loadBuilding(buildingId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.projectService.getBuildingById(buildingId).subscribe({
      next: (building: Building) => {
        this.selectedBuilding = building;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error while loading building', err);
        this.errorMessage = err.error?.message || 'Error while loading building';
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  save() {
    if (!this.selectedBuilding?._id) return;

    this.projectService.updateBuilding(this.selectedBuilding._id, this.selectedBuilding)
      .subscribe({
        next: updated => {
          this.selectedBuilding = updated;
          this.isEditing = false;
        },
        error: err => {
          console.error('Errore aggiornamento edificio', err);
          this.errorMessage = 'Errore durante il salvataggio';
        }
      });
  }

  addImage() {
    if (!this.selectedBuilding?._id || !this.newImageUrl.trim()) return;

    const updatedBuilding = {
      ...this.selectedBuilding,
      imageUrl: this.newImageUrl
    };

    this.projectService.updateBuilding(this.selectedBuilding._id, updatedBuilding)
      .subscribe({
        next: updated => {
          this.selectedBuilding = updated;
          this.newImageUrl = '';
        },
        error: err => {
          console.error('Errore aggiunta immagine', err);
          this.errorMessage = 'Errore durante l\'aggiunta dei dati';
        }
      });
  }
}
