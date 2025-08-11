import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MenuComponent } from "../menu/menu";

@Component({
  selector: 'app-setting',
  imports: [MenuComponent, FormsModule, CommonModule],
  templateUrl: './setting.html',
  styleUrl: './setting.css'
})
export class SettingComponent {
  showDeleteModal = false;
  deleteEmail = '';
  deleteError = '';
    errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  openDeleteModal() {
    this.showDeleteModal = true;
    this.deleteEmail = '';
    this.deleteError = '';
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteEmail = '';
    this.deleteError = '';
  }

deleteAccount() {
    if (confirm('Sei sicura di voler eliminare il tuo account? Questa azione è irreversibile.')) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          alert('Account eliminato con successo');
          // qui pulisci eventuali dati di sessione/localStorage
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Errore durante l\'eliminazione dell\'account: ' + (err.error?.message || err.message);
        }
      });
    }

}
}
