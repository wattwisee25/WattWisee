import { Component, OnInit } from '@angular/core';
import { ProjectService, Project } from '../project.service';
import { CommonModule } from '@angular/common';
import { Menu } from '../menu/menu';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButton } from "../back-button/back-button";

// Extend Project to add UI-only fields
interface ProjectWithOpen extends Project {
  open?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Menu, RouterModule, FormsModule, BackButton],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  projects: ProjectWithOpen[] = [];         // All projects from server
  filteredProjects: ProjectWithOpen[] = []; // Filtered list for display
  searchTerm: string = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // Load all projects from backend
  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        // Add UI field "open" to each project
        this.projects = data.map(p => ({ ...p, open: false }));
        this.filteredProjects = [...this.projects];
        console.log('Projects loaded:', this.projects);
      },
      error: (err) => console.error('Error loading projects', err)
    });
  }

  // Called when the user types in the search bar
  filterProjects() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProjects = this.projects.filter(p =>
      p.projectName.toLowerCase().includes(term)
    );
  }

  // Toggle dropdown under the project image
  toggleDropdown(project: ProjectWithOpen) {
    project.open = !project.open;
  }

  // Sum of bills inside the project
 /* getTotalBills(project: ProjectWithOpen): number {
    if (!project.bills || project.bills.length === 0) return 0;

    return project.bills.reduce(
      (sum, bill) => sum + (bill.amount || 0), 
      0
    );
  }
*/
  // Save selected project in localStorage
  selectProject(projectId?: string) {
    if (!projectId) return;
    localStorage.setItem('selectedProjectId', projectId);
  }
}
