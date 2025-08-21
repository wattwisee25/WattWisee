import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-project-list',
  imports: [MenuComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        console.log('Progetti ricevuti:', data); // controlla in console
      },
      error: (err) => {
        console.error('Errore nel caricamento progetti', err);
      }
    });
  }
}