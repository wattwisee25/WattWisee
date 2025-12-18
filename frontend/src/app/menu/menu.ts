import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AuthService } from '../auth.service';
import { ProgressBar } from "../progress-bar/progress-bar";
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgressBar],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit {
  sidebarOpen = false;
  isDesktop = window.innerWidth >= 768;


  /** MENU PRINCIPALE */
  mainMenu = [
    { label: 'Home', route: '/home', icon: '<i class="bi bi-folder"></i>', exact: true },
    { label: 'Glossary', route: '/glossary', icon: '<i class="bi bi-book"></i>', exact: true },
    { label: 'Profile', route: '/profile', icon: '<i class="bi bi-person"></i>', exact: true },
  ];

  /** MENU PROGETTO (sotto Projects) */
  projectMenu = [
    { label: 'Building info', route: '/building-list', icon: '<i class="bi bi-building"></i>' },
    { label: 'Add your bills', route: '/upload-bills-id', icon: '<i class="bi bi-upload"></i>' },
    { label: 'Significant energy users', route: '/home', icon: '<i class="bi bi-lightning"></i>' },
    { label: 'Audit report', route: '/audit-report', icon: '<i class="bi bi-check2-square"></i>' },
    { label: 'Action plan & Green impact', route: '/action-plan', icon: '<i class="bi bi-recycle"></i>' },
  ];

  /** Flag: se un progetto è selezionato */
  projectSelected = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // Controlla subito se c'è un progetto salvato in localStorage
    const savedProjectId = localStorage.getItem('selectedProjectId');
    this.projectSelected = !!savedProjectId;

    // Aggiorna se il localStorage cambia
    window.addEventListener('storage', () => {
      const id = localStorage.getItem('selectedProjectId');
      this.projectSelected = !!id;
    });

 
  }

  toggleSidebar() {
    if (!this.isDesktop) {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.sidebarOpen = false;
        this.router.navigate(['/']);
      },
      error: (error) => console.error('Logout error:', error)
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop && !wasDesktop) this.sidebarOpen = false;
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  /** Naviga ad una route del progetto usando l'ID salvato in localStorage */
  navigateProjectRoute(route: string) {
    const projectId = localStorage.getItem('selectedProjectId');
    if (!projectId) {
      alert('No project selected!');
      this.router.navigate(['/home']);
      return;
    }

    // Tutte le rotte del progetto leggono l'ID da localStorage
    this.router.navigate([route]);
  }
}
