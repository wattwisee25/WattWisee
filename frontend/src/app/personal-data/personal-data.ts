import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuComponent } from "../menu/menu";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.html',
  styleUrls: ['./personal-data.css'],
  standalone: true,
  imports: [FormsModule, MenuComponent, CommonModule]  // IMPORTANTE FormsModule qui!
})
export class PersonalDataComponent implements OnInit {
   personalData: any = {
    contact_name: '',
    company_name: '',
    register_as: '',
    SEAI_number: '',
    phone: '',
    email: '',
    password: '',
    repeat_password: '',
    permission_contact: false
  };
  loading: boolean = true;
  errorMessage: string = '';
   constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.personalData = {
          contact_name: user.contact_name || '',
          company_name: user.company_name || '',
          register_as: user.register_as || '',
          SEAI_number: user.SEAI_number || '',
          phone: user.phone || '',
          email: user.email || '',
          password: '',
          repeat_password: '',
          permission_contact: user.permission_contact || false
        };
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Errore nel caricamento dati';
        this.loading = false;
      }
    });
  }

  onSubmit(form: any) {
     console.log('Submit chiamato', form);
    if (form.invalid) {
      this.errorMessage = 'Per favore, compila tutti i campi richiesti correttamente.';
      return;
    }

    if (this.personalData.password !== this.personalData.repeat_password) {
      this.errorMessage = 'Le password non corrispondono';
      return;
    }

    const { repeat_password, ...dataToSend } = this.personalData;

    this.authService.updateUser(dataToSend).subscribe({
      next: () => {
        alert('Dati aggiornati con successo!');
        this.errorMessage = '';
        this.personalData.password = '';
        this.personalData.repeat_password = '';
      },
      error: () => alert('Errore durante l\'aggiornamento')
    });
  }
}