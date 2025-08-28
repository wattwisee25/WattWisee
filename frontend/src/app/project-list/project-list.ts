import { Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../project.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];       // Tutti i progetti dal server
  filteredProjects: Project[] = []; // Progetti filtrati da mostrare
  searchTerm: string = '';        // Termine di ricerca

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data; // inizialmente tutti i progetti
        console.log('Progetti ricevuti:', data);
      },
      error: (err) => {
        console.error('Errore nel caricamento progetti', err);
      }
    });
  }

  // Metodo chiamato ad ogni input nell'input di ricerca
  filterProjects() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.projectName.toLowerCase().includes(term)
    );
  }
}
