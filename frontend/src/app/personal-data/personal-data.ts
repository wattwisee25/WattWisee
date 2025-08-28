import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../menu/menu";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.html',
  styleUrls: ['./personal-data.css'],
  standalone: true,
  imports: [FormsModule, MenuComponent, CommonModule]
})
export class PersonalDataComponent implements OnInit {
  personalData = {
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

  backupData: any = {};
  loading = true;
  editing = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.personalData = { ...user, password: '', repeat_password: '' };
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error loading user data';
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.editing = true;
    this.backupData = { ...this.personalData };
  }

  cancelEdit() {
    this.editing = false;
    this.personalData = { ...this.backupData };
    this.errorMessage = '';
  }

  onSubmit(form: any) {
  console.log('Submit chiamato', form.value);
  if (form.invalid) {
    this.errorMessage = 'Please fill out all required fields correctly.';
    return;
  }

  if (this.personalData.password !== this.personalData.repeat_password) {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  const { repeat_password, ...dataToSend } = this.personalData;
  console.log('Dati da inviare:', dataToSend);

  this.authService.updateUser(dataToSend).subscribe({
    next: (updatedUser) => {
      console.log('UpdateUser success', updatedUser);
      this.editing = false;  //s
    },
    error: (err) => {
      console.error('UpdateUser error', err);
    }
  });
}

}
