import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ClaudeService } from './services/claude.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // CORRETTO
})
export class App {
  title = 'WattWisee';
  users: any[] = [];
  selectedFile: File | null = null;
  extractedData: any = null;
  isUploading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private claudeService: ClaudeService) {}


  loadUsers() {
    this.http.get<any[]>(environment.apiUrl).subscribe({
      next: data => this.users = data,
      error: err => console.error('Error loading users:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.extractedData = null;
    this.errorMessage = null;
  }

  uploadFile(projectId: string, buildingId: string, type: string) {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.claudeService.uploadFile(this.selectedFile, projectId, buildingId, type)
      .subscribe({
        next: res => {
          this.extractedData = res;
          this.isUploading = false;
        },
        error: err => {
          console.error('Upload error:', err);
          this.errorMessage = 'Errore durante il caricamento del file';
          this.isUploading = false;
        }
      });
  }
}

