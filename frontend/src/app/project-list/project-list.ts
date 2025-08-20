import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu';
import { ProjectService } from '../services/project.service';


@Component({
  selector: 'app-project-list',
  imports: [MenuComponent],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }
}
