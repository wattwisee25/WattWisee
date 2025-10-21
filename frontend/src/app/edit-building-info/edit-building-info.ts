import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from '../menu/menu';
import { ProjectService } from '../project.service';
import { RouterModule } from '@angular/router';
import { BackButton } from "../back-button/back-button";


@Component({
  selector: 'app-edit-building-info',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, RouterModule, BackButton],
  templateUrl: './edit-building-info.html',
  styleUrls: ['./edit-building-info.css']
})
export class EditBuildingInfo implements OnInit {
  isLoading = false;
  errorMessage: string | null = null;

  buildingId!: string;

  // Inizializziamo tutte le proprietà annidate per evitare undefined
  building: any = {
    envelope: {
      walls: '',
      constructionType: '',
      insulationMaterials: '',
      insideMaterials: '',
      constructionMaterials: '',
      surfaceArea: null,
      uValue: null,
      heatLossMeter: null,
      heatLossTotal: null
    },
    windows: {
      currentWindowType: '',
      totalWindowsArea: null,
      uValue: null,
      solarGain: null,
      orientation: '',
      heatLoss: null
    },
    doors: {
      currentDoorType: '',
      totalAreaDoors: null,
      uValue: null,
      doorSealingMechanism: '',
      doorLeakTest: '',
      heatLossTotal: null
    },
    roof: {
      currentInsulationType: '',
      totalAreaRoof: null,
      uValue: null,
      heatLossTotal: null
    },
    lighting: {
      currentLightingType: '',
      numberOfLightUsed: null,
      lightingControls: '',
      totalEnergyUsed: null
    },
    auxiliary: {
      currentUsage: null,
      baselineUsage: null,
      lightingControls: null,
      totalEnergyUsed: null
    },
    seu1: {
      numberOfOvensUsed: null,
      averageKwUsedPerDay: null,
      totalEnergyUsedForMonths: null
    },
    seu2: {
      numberUsed: null,
      averageKwUsedPerDay: null,
      totalEnergyUsedForMonths: null
    },
    seu3: {
      coefficientOfPerformance: null,
      averageKwUsedPerDay: null,
      totalEnergyUsedForMonths: null
    }
  };

  constructor( private route: ActivatedRoute,
  private http: HttpClient,
  private projectService: ProjectService,
  private location: Location) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const buildingId = params.get('id');
      if (buildingId) {
        this.buildingId = buildingId;
        this.loadBuilding(buildingId);
      } else {
        this.errorMessage = 'No building ID provided in the URL';
      }
    });
  }

  loadBuilding(buildingId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.projectService.getBuildingById(buildingId).subscribe({
      next: (buildingData: any) => {
        // Sovrascriviamo solo le proprietà esistenti per non perdere l'inizializzazione
        this.building = { ...this.building, ...buildingData };
        this.isLoading = false;
      },
      error: err => {
        console.error('Error while loading building', err);
        this.errorMessage = err.error?.message || 'Error while loading building';
        this.isLoading = false;
      }
    });
  }

saveBuilding() {
  this.http.put(
    `http://localhost:3000/api/projects/buildings/${this.buildingId}`,
    this.building,
    { withCredentials: true }
  ).subscribe({
    next: () => {
      // Torna indietro alla pagina precedente
      this.location.back();
    },
    error: (err) => {
      console.error('Error while saving:', err);
      // puoi mostrare un messaggio UI oppure loggare, senza alert
    }
  });
}



}
