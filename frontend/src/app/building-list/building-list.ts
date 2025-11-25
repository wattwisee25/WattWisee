import { Component, OnInit } from '@angular/core';
import { ProjectService, Project, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { Menu } from '../menu/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [CommonModule, Menu, FormsModule, RouterModule, BackButton],
  templateUrl: './building-list.html',
  styleUrls: ['./building-list.css'] // ⚠️ corretto
})
export class BuildingList implements OnInit {
  project!: Project;
  isLoading = true;

  searchTerm = '';
  filteredBuildings: Building[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
      private router: Router 
  ) {}

ngOnInit(): void {
  const projectId = localStorage.getItem('selectedProjectId');
  if (!projectId) {
    alert('No project selected!');
    this.router.navigate(['/projects']);
    return;
  }
  this.loadProject(projectId);
}



  loadProject(projectId: string): void {
    this.isLoading = true;
    this.projectService.getProjectById(projectId).subscribe({
      next: (data: Project) => {
        this.project = data;
        this.filteredBuildings = data.buildings ?? [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Errore nel caricamento progetto', err);
        this.isLoading = false;
      }
    });
  }

  filterBuildings(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredBuildings = (this.project?.buildings ?? []).filter(b =>
      (b.name ?? '').toLowerCase().includes(term)
    );
  }

  trackByBuilding(index: number, building: Building): string {
    return building?._id ?? index.toString();
  }

  /** 👉 SALVA L'ID DEL BUILDING IN LOCALSTORAGE */
selectBuilding(buildingId?: string) {
  if (!buildingId) return;
  localStorage.setItem('selectedBuildingId', buildingId);
  console.log('Building selezionato:', buildingId);
}

}

