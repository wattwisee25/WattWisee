import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu';
import { HttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DeepseekService } from './services/deepseek.service';


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
  query: string = '';
  results: any;

  constructor(private http: HttpClient, private deepseekService: DeepseekService) {}

  loadUsers() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(data => {
      this.users = data;
    });
  }

   onSearch() {
    this.deepseekService.search(this.query).subscribe({
      next: (data) => this.results = data,
      error: (err) => console.error(err)
    });
  }
}

