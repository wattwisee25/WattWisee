import { Component, OnInit } from '@angular/core';
import { ProjectService, Project, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BackButton } from "../back-button/back-button";
import { environment } from '../../environments/environment.prod';

type BillType = 'electricity' | 'oil' | 'lpg';

@Component({
  selector: 'app-upload-first-bill',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButton],
  templateUrl: './upload-first-bill.html',
  styleUrls: ['./upload-first-bill.css']
})
export class UploadFirstBill implements OnInit {
  project!: Project;
  isLoading = true;

  filteredBuildings: Building[] = [];
  selectedBuildingId: string | null = null;

  selectedFilesByType: Record<BillType, File[]> = {
    electricity: [],
    oil: [],
    lpg: []
  };

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) this.loadProject(projectId);
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
        console.error('Error loading project', err);
        this.isLoading = false;
      }
    });
  }

  selectBuilding(id?: string) {
    if (!id) return;
    this.selectedBuildingId = id;
  }

  onFilesSelected(event: Event, type: BillType) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedFilesByType[type] = [
        ...this.selectedFilesByType[type],
        ...newFiles
      ];
    }
  }

  hasSelectedFiles(): boolean {
    return Object.values(this.selectedFilesByType).some(files => files.length > 0);
  }

  // 👇 nuovo metodo per reindirizzare alla pagina di compilazione bolletta
  goToBillForm(type: BillType) {
    if (!this.selectedBuildingId) {
      return alert('Please select a building first!');
    }
    this.router.navigate(['/bill-information', type], {
      queryParams: { buildingId: this.selectedBuildingId }
    });
  }
}
