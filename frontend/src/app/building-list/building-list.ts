import { Component, OnInit } from '@angular/core';
import { ProjectService, Project, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, RouterModule],
  templateUrl: './building-list.html',
  styleUrls: ['./building-list.css'] // ⚠️ corretto
})
export class BuildingListComponent implements OnInit {
  project!: Project;
  isLoading = true;

  searchTerm = '';            // testo inserito nella search bar
  filteredBuildings: Building[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // legge l'id dalla URL ad ogni cambio di rotta
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.loadProject(projectId);
      }
    });
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
}
