import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu {
  sidebarOpen = false;
  isDesktop = window.innerWidth >= 768;

    menuItems = [
  { label: 'Home', route: '/home', icon: '<i class="bi bi-house"></i>' },
  { label: 'Projects', route: '/projects', icon: '<i class="bi bi-folder"></i>' },
  { label: 'Add your bills', route: '/project-list', icon: '<i class="bi bi-upload"></i>' },
  { label: 'Action plan', route: '/action-plan', icon: '<i class="bi bi-map"></i>' },
  { label: 'Green impact', route: '/renewable', icon: '<i class="bi bi-sun"></i>' },
  { label: 'Audit report', route: '/audit-report', icon: '<i class="bi bi-check2-square"></i>' },
  { label: 'Glossary', route: '/glossary', icon: '<i class="bi bi-book"></i>' },
  { label: 'Profile', route: '/profile', icon: '<i class="bi bi-person"></i>' },
];


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop && !wasDesktop) {
      this.sidebarOpen = false;
    }
  }

isActive(menuRoute: string): boolean {
  // Ritorna true se l'URL corrente inizia con il percorso principale
  return this.router.url.startsWith(menuRoute);
}

}
