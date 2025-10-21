import { Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BackButton } from "../back-button/back-button";


@Component({
  selector: 'app-account',
  imports: [Menu, FormsModule, CommonModule, RouterModule, BackButton],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
    constructor(private http: HttpClient, private router: Router) {}

    personalData() {
  this.router.navigate(['/personal-data']);
}
settings() {
  this.router.navigate(['/settings']);
}
}
