import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

import { MenuComponent } from "../menu/menu";

@Component({
  selector: 'app-setting',
  imports: [MenuComponent],
  templateUrl: './setting.html',
  styleUrl: './setting.css'
})
export class SettingComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }





}
