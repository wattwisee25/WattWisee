import { Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../project.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        console.log('Progetti ricevuti:', data);
      },
      error: (err) => {
        console.error('Errore nel caricamento progetti', err);
      }
    });
  }
}
