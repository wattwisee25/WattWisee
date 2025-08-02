import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account',
  imports: [MenuComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {
    constructor(private http: HttpClient, private router: Router) {}

    personalData() {
  this.router.navigate(['/personal-data']);
}
settings() {
  this.router.navigate(['/settings']);
}
}
