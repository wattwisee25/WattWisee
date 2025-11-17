import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProjectService, Project, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu],
  templateUrl: './filter.html',
  styleUrls: ['./filter.css']
})
export class Filter implements OnInit {
  projects: Project[] = [];
  selectedProjectId: string = '';
  buildings: Building[] = [];
  selectedBuildingId: string = '';

  @Output() buildingSelected = new EventEmitter<{
    projectId: string;
    projectName: string;
    buildingId: string;
    buildingName: string;
    buildingData: any;
  }>();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
    this.restoreFilter();
  }

  // -------------------------
  // LOAD PROJECTS
  // -------------------------
  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => (this.projects = data),
      error: (err) => console.error(err)
    });
  }

  // -------------------------
  // RESTORE FILTER FROM LOCALSTORAGE
  // -------------------------
  restoreFilter() {
    const savedProjectId = localStorage.getItem('selectedProjectId');
    const savedBuildingId = localStorage.getItem('selectedBuildingId');

    if (savedProjectId) {
      this.selectedProjectId = savedProjectId;
      this.onProjectChange(savedProjectId); // Carica buildings

      // Attendi un minimo per permettere il caricamento buildings
      setTimeout(() => {
        if (savedBuildingId) {
          this.selectedBuildingId = savedBuildingId;

          // Emissione automatica
          this.emitSelection();
        }
      }, 150);
    }
  }

  // -------------------------
  // PROJECT CHANGE
  // -------------------------
  onProjectChange(projectId: string) {
    this.selectedProjectId = projectId;
    localStorage.setItem('selectedProjectId', projectId || '');

    if (projectId) {
      this.projectService.getProjectById(projectId).subscribe({
        next: (project: Project) => {
          this.buildings = project.buildings ?? [];
        },
        error: (err) => console.error(err)
      });

      this.selectedBuildingId = '';
      localStorage.removeItem('selectedBuildingId');

    } else {
      this.buildings = [];
      this.selectedBuildingId = '';
      localStorage.removeItem('selectedBuildingId');
    }
  }

  // -------------------------
  // BUILDING CHANGE
  // -------------------------
  onBuildingChange(buildingId: string) {
    this.selectedBuildingId = buildingId;
    localStorage.setItem('selectedBuildingId', buildingId || '');

    this.emitSelection();
  }

  // -------------------------
  // EMIT FUNCTION
  // -------------------------
  private emitSelection() {
    if (!this.selectedProjectId || !this.selectedBuildingId) return;

    const project = this.projects.find(p => p._id === this.selectedProjectId);
    const building = this.buildings.find(b => b._id === this.selectedBuildingId);

    if (project && building) {
      this.buildingSelected.emit({
        projectId: project._id!,
        projectName: project.projectName,
        buildingId: building._id!,
        buildingName: building.name,
        buildingData: building
      });
    }
  }
}
