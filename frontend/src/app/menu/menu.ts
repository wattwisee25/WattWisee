import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  toggleSidebar() {
    if (!this.isDesktop) {
      this.sidebarOpen = !this.sidebarOpen;
    }
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
