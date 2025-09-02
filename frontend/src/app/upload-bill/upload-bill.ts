import { Component, OnInit } from '@angular/core';
import { ProjectService, Project, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-bill',
  standalone: true,
  imports: [CommonModule, MenuComponent, FormsModule, RouterModule],
  templateUrl: './upload-bill.html',
  styleUrls: ['./upload-bill.css']
})
export class UploadBillComponent implements OnInit {
  project!: Project;
  isLoading = true;

  searchTerm = '';
  filteredBuildings: Building[] = [];

  selectedFile: File | null = null;            // file selezionato
  selectedBuildingId: string | null = null;    // building selezionato

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // legge l'id dalla URL ad ogni cambio di rotta
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.loadProject(projectId);
      }
    });
  }

  loadProject(projectId: string): void {
    this.isLoading = true;
    this.projectService.getProjectById(projectId).subscribe({
      next: (data: Project) => {
        this.project = data;
        this.filteredBuildings = data.buildings ?? [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Errore nel caricamento progetto', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload() {
    if (!this.selectedFile) return alert('Seleziona un file!');
    if (!this.selectedBuildingId) return alert('Seleziona una struttura!');

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('buildingId', this.selectedBuildingId);

    this.http.post('http://localhost:3000/api/deepseek/upload', formData, { withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log('Dati estratti:', res);
          alert('File caricato ed elaborato!');
        },
        error: (err) => {
          console.error('Errore durante l’elaborazione:', err);
          alert('Errore durante l’elaborazione');
        }
      });
  }
}
