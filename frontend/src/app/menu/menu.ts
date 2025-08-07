import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class MenuComponent {
  sidebarOpen = false;
  isDesktop = window.innerWidth >= 768;

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
}
