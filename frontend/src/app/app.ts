import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu';
import { HttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'WattWisee';
  users: any[] = [];

  constructor(private http: HttpClient) {}

  loadUsers() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(data => {
      this.users = data;
    });
  }
}

