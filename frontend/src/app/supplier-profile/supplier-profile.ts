import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SupplierMenu } from "../supplier-menu/supplier-menu";


@Component({
  selector: 'app-supplier-profile',
  imports: [FormsModule, CommonModule, RouterModule, SupplierMenu],
  templateUrl: './supplier-profile.html',
  styleUrl: './supplier-profile.css'
})
export class SupplierProfile {
    constructor(private http: HttpClient, private router: Router) {}

    personalData() {
  this.router.navigate(['/supplier-personal-data']);
}
settings() {
  this.router.navigate(['/supplier-settings']);
}
}
