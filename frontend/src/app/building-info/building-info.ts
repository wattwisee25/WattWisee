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
  isLoading = false;
  errorMessage: string | null = null; // messaggio di errore da mostrare nel template

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
}