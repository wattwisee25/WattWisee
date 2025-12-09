import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BackButton } from "../back-button/back-button";
import { environment } from '../../environments/environment';

interface Building {
  name: string;
  imageUrl: string | ArrayBuffer | null;
}

interface Project {
  _id: string;
  projectName: string;
  buildings: any[];
}

interface CreateProjectResponse {
  message: string;
  project: Project;
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, BackButton],
  templateUrl: './first-new-project.html',
  styleUrls: ['./first-new-project.css']
})
export class NewProject {
  projectName: string = '';
  buildingName: string = '';
  selectedImage: File | null = null;
  selectedImagePreview: string | ArrayBuffer | null = null;
  buildings: Building[] = [];

  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedImage = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.selectedImagePreview = reader.result;
    reader.readAsDataURL(this.selectedImage);
  }

  addBuilding() {
    if (!this.buildingName || !this.selectedImagePreview) return;

    this.buildings.push({
      name: this.buildingName,
      imageUrl: this.selectedImagePreview
    });

    // Reset campi
    this.buildingName = '';
    this.selectedImage = null;
    this.selectedImagePreview = null;
  }

saveProject() {
  if (!this.projectName || this.buildings.length === 0) {
    alert('Please enter a project name and at least one building.');
    return;
  }

  const projectData = {
    projectName: this.projectName,
    buildings: this.buildings
  };

  // Send the request with cookies (contains the token)
  this.http.post<CreateProjectResponse>(this.apiUrl, projectData, { withCredentials: true })
    .subscribe({
      next: (res) => {
        console.log('Project saved successfully:', res);

        const projectId = res.project._id;
        if (!projectId) {
          console.error('Project ID is undefined. Cannot navigate!');
          return;
        }

        // Navigate to /upload-first-bills using route param
        this.router.navigate(['/upload-first-bill', projectId]);
      },
      error: (err) => {
        console.error('Error saving the project:', err);
        alert(err.error?.message || 'An error occurred while saving the project.');
      }
    });
}

}
