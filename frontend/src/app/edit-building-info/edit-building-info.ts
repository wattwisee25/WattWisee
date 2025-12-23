import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../project.service';
import { environment } from '../../environments/environment';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButton } from '../back-button/back-button';
import { Menu } from '../menu/menu';

// ================= INTERFACES =================

interface WallDetail {
  constructionType: string;
  insulationMaterials: string;
  insideMaterials: string;
  constructionMaterials: string;
  uValue: number;
  heatLossMeter: number;
  heatLossTotal: number;
}

interface Wall {
  totalArea: number;
  number: number;
  wallsDetails: WallDetail[];
}

interface WindowDetail {
  windowType: string;
  uValue: number;
  solarGain: number;
  orientation: string;
  heatLoss: number;
}

interface Window {
  totalArea: number;
  number: number;
  windowsDetails: WindowDetail[];
}

interface DoorDetail {
  doorType: string;
  uValue: number;
  doorSealingMechanism: string;
  doorLeakTest: string;
  heatLoss: number;
}

interface Door {
  totalArea: number;
  number: number;
  doorsDetails: DoorDetail[];
}

interface RoofDetail {
  insulationType: string;
  area: number;
  uValue: number;
  heatLoss: number;
}

interface Roof {
  totalArea: number;
  number: number;
  roofsDetails: RoofDetail[];
}

interface Room {
  name: string;
  walls: Wall[];
  windows: Window[];
  doors: Door[];
  roofs: Roof[];
}

interface Lighting {
  lightingType: string;
  number: number;
  lightingControls: string;
  totalEnergyUsed: number;
}

interface Auxiliary {
  currentUsage: number;
  baselineUsage: number;
  lightingControls: string;
  totalEnergyUsed: number;
}

interface SignificantEnergyUser {
  name: string;
  consumption: number;
  efficiency: string;
  notes: string;
}

interface ChecklistItem {
  label: string;
  yes: boolean;
  no: boolean;
  na: boolean;
  comment: string;
}

interface Building {
  name: string;
  imageUrl?: string;
  generalInfo: any;
  buildingEnvelope: any;
  lighting: Lighting[];
  auxiliaryUsage: Auxiliary[];
  significantEnergyUsers: SignificantEnergyUser[];
  checklist: ChecklistItem[];
  bills: any[];
}

// ================= COMPONENT =================

@Component({
  selector: 'app-edit-building-info',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButton, Menu],
  templateUrl: './edit-building-info.html',
  styleUrls: ['./edit-building-info.css']
})
export class EditBuildingInfo implements OnInit, OnDestroy {

  buildingId!: string;
  building!: Building;

  isLoading = false;
  errorMessage: string | null = null;

  showRoomModal = false;
  roomForm: Room = this.createEmptyRoom();
  editingRoomIndex: number | null = null;

  autosaveSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  // ================= LIFECYCLE =================

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.errorMessage = 'No building ID provided';
        return;
      }

      this.buildingId = id;
      this.loadBuilding();
    });
  }

  ngOnDestroy(): void {
    this.autosaveSubscription?.unsubscribe();
  }

  // ================= LOAD & SAVE =================

  loadBuilding(): void {
    this.isLoading = true;

    this.projectService.getBuildingById(this.buildingId).subscribe({
      next: (data: any) => {

        this.building = data;

        // inizializzazioni sicure
        this.building.generalInfo ??= {};
        this.building.buildingEnvelope ??= { rooms: [] };
        this.building.buildingEnvelope.rooms ??= [];
        this.building.lighting ??= [];
        this.building.auxiliaryUsage ??= [];
        this.building.significantEnergyUsers ??= [];
        this.building.checklist ??= [];
        this.building.bills ??= [];

        this.startAutosave();
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Error loading building';
        this.isLoading = false;
      }
    });
  }

  saveBuilding(): void {
    if (!this.building) return;

    console.log('AUTOSAVE → sending building', this.building);

    this.http.put(
      `${environment.apiUrl}/api/projects/buildings/${this.buildingId}`,
      this.building,
      { withCredentials: true }
    ).subscribe({
      next: () => console.log('Saved'),
      error: err => console.error('Save error:', err)
    });
  }

  startAutosave(): void {
    this.autosaveSubscription?.unsubscribe();

    this.autosaveSubscription = interval(30000).subscribe(() => {
      this.saveBuilding();
    });
  }

  // ================= ROOMS =================

  addRoom(): void {
    this.roomForm = this.createEmptyRoom();
    this.editingRoomIndex = null;
    this.showRoomModal = true;
  }

  editRoom(index: number): void {
    this.roomForm = structuredClone(this.building.buildingEnvelope.rooms[index]);
    this.editingRoomIndex = index;
    this.showRoomModal = true;
  }

  saveRoom(): void {
    if (this.editingRoomIndex !== null) {
      this.building.buildingEnvelope.rooms[this.editingRoomIndex] = this.roomForm;
    } else {
      this.building.buildingEnvelope.rooms.push(this.roomForm);
    }
    this.showRoomModal = false;
  }

  closeRoomModal(): void {
    this.showRoomModal = false;
  }

  // ================= ADD HELPERS =================

   // --- ADD WALL / WINDOW / DOOR / ROOF ---

  addWallToForm() {
    this.roomForm.walls.push({
      totalArea: 0,
      number: 0,
      wallsDetails: [
        {
          constructionType: '',
          insulationMaterials: '',
          insideMaterials: '',
          constructionMaterials: '',
          uValue: 0,
          heatLossMeter: 0,
          heatLossTotal: 0
        }
      ]
    });
  }

  addWindowToForm() {
    this.roomForm.windows.push({
      totalArea: 0,
      number: 0,
      windowsDetails: [
        { windowType: '', uValue: 0, solarGain: 0, orientation: '', heatLoss: 0 }
      ]
    });
  }

  addDoorToForm() {
    this.roomForm.doors.push({
      totalArea: 0,
      number: 0,
      doorsDetails: [
        { doorType: '', uValue: 0, doorSealingMechanism: '', doorLeakTest: '', heatLoss: 0 }
      ]
    });
  }

  addRoofToForm() {
    this.roomForm.roofs.push({
      totalArea: 0,
      number: 0,
      roofsDetails: [
        { insulationType: '', area: 0, uValue: 0, heatLoss: 0 }
      ]
    });
  }


  addLighting(): void {
    this.building.lighting.push({ lightingType: '', number: 0, lightingControls: '', totalEnergyUsed: 0 });
  }

  addAuxiliary(): void {
    this.building.auxiliaryUsage.push({ currentUsage: 0, baselineUsage: 0, lightingControls: '', totalEnergyUsed: 0 });
  }

  addSEU(): void {
    this.building.significantEnergyUsers.push({ name: '', consumption: 0, efficiency: '', notes: '' });
  }

  private createEmptyRoom(): Room {
    return { name: '', walls: [], windows: [], doors: [], roofs: [] };
  }

  activeForm: 'room' | 'lighting' | 'aux' | 'seu' | null = null;

toggleForm(form: 'room' | 'lighting' | 'aux' | 'seu') {
  this.activeForm = this.activeForm === form ? null : form;
}

}

