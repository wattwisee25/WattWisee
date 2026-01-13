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
import { RoomService } from '../services/room.service';
import { WallConfigComponent } from '../components/wall-config/wall-config.component';


// ================= INTERFACES =================

interface WallDetail {
  constructionType: string;
  insulationMaterials: string;
  insideMaterials: string;
  constructionMaterials: string;
  uValue: number;
  area: number;
  heatLossWK: number;    // W/K = U × Area
}

interface Wall {
  length: number;
  width: number;
  totalArea: number;
  description: string;
  number: number;

  orientation: 'North' | 'South' | 'East' | 'West';
  exposure: 'exterior' | 'interior';

  windows: Window[];
  doors: Door[];
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
  length: number;
  width: number;
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
  length: number;
  width: number;
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
  length: number;
  width: number;
  totalArea: number;
  number: number;
  roofsDetails: RoofDetail[];
}

interface FloorDetail {
  area: number;
  uValue: number;
  heatLoss: number;
}

interface Floor {
  length: number;
  width: number;
  totalArea: number;
  floorsDetails: FloorDetail[];
}

interface Room {
  name: string;
  walls: Wall[];
  roofs: Roof[];
  floors: Floor[];
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
  imports: [CommonModule, FormsModule, BackButton, Menu, WallConfigComponent],
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
    private projectService: ProjectService,
    public roomService: RoomService
  ) { }

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

  calculateArea(element: { length: number; width: number }): number {
    return Number((element.length * element.width).toFixed(2));
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

    this.roomForm.floors ??= [];
    this.roomForm.walls ??= [];
    this.roomForm.roofs ??= [];

    this.editingRoomIndex = index;
    this.showRoomModal = true;
  }

  saveRoom(): void {
    if (this.editingRoomIndex !== null) {
      this.building.buildingEnvelope.rooms[this.editingRoomIndex] = this.roomForm;
    } else {
      this.building.buildingEnvelope.rooms.unshift(this.roomForm);
    }
    this.showRoomModal = false;

    this.saveBuilding();
  }

  calculateWallHeatLoss(wall: Wall, detail: WallDetail) {
    const netArea = this.getWallNetArea(wall);
    detail.area = netArea;
    detail.heatLossWK = Number((detail.uValue * netArea).toFixed(2));
  }


  getWallNetArea(wall: Wall): number {
    const windowsArea = wall.windows.reduce((sum, w) => sum + w.totalArea, 0);
    const doorsArea = wall.doors.reduce((sum, d) => sum + d.totalArea, 0);
    return Math.max(wall.totalArea - windowsArea - doorsArea, 0);
  }

  getRoomWindowsCount(room: Room): number {
    return room.walls?.reduce((sum, wall) => sum + (wall.windows?.length || 0), 0) || 0;
  }

  getRoomDoorsCount(room: Room): number {
    return room.walls?.reduce((sum, wall) => sum + (wall.doors?.length || 0), 0) || 0;
  }

  addWindowToWall(wall: Wall) {
    wall.windows ??= [];
    wall.windows.push({
      length: 0,
      width: 0,
      totalArea: 0,
      number: 1,
      windowsDetails: [
        { windowType: '', uValue: 0, solarGain: 0, orientation: '', heatLoss: 0 }
      ]
    });
  }

  addDoorToWall(wall: Wall) {
    wall.doors ??= [];
    wall.doors.push({
      length: 0,
      width: 0,
      totalArea: 0,
      number: 1,
      doorsDetails: [
        { doorType: '', uValue: 0, doorSealingMechanism: '', doorLeakTest: '', heatLoss: 0 }
      ]
    });
  }


  closeRoomModal(): void {
    this.showRoomModal = false;
  }

  // ================= ADD HELPERS =================

  // --- ADD WALL / WINDOW / DOOR / ROOF ---

  addWallToForm() { //add a new wall to the walls array in the room form
    this.roomForm.walls.unshift({ //unshift adds to the beginning of the array, push adds to the end
      length: 0,
      width: 0,
      totalArea: 0,
      description: '',
      number: 1,

      orientation: 'North',
      exposure: 'exterior',

      windows: [],
      doors: [],

      wallsDetails: [
        {
          constructionType: '',
          insulationMaterials: '',
          insideMaterials: '',
          constructionMaterials: '',
          uValue: 0,
          area: 0,
          heatLossWK: 0
        }
      ]
    });
  }


  // addWindowToForm() {
  //   this.roomForm.windows.push({
  //     totalArea: 0,
  //     number: 0,
  //     windowsDetails: [
  //       { windowType: '', uValue: 0, solarGain: 0, orientation: '', heatLoss: 0 }
  //     ]
  //   });
  // }

  // addDoorToForm() {
  //   this.roomForm.doors.push({
  //     totalArea: 0,
  //     number: 0,
  //     doorsDetails: [
  //       { doorType: '', uValue: 0, doorSealingMechanism: '', doorLeakTest: '', heatLoss: 0 }
  //     ]
  //   });
  // }

  addRoofToForm() {
    this.roomForm.roofs.push({
      length: 0,
      width: 0,
      totalArea: 0,
      number: 0,
      roofsDetails: [
        { insulationType: '', area: 0, uValue: 0, heatLoss: 0 }
      ]
    });
  }


  addFloorToForm() {
    this.roomForm.floors.push({
      length: 0,
      width: 0,
      totalArea: 0,
      floorsDetails: [
        { area: 0, uValue: 0, heatLoss: 0 }
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
    return { name: '', walls: [], roofs: [], floors: [] };
  }


  activeForm: 'room' | 'lighting' | 'aux' | 'seu' | null = null;

  toggleForm(form: 'room' | 'lighting' | 'aux' | 'seu') {
    this.activeForm = this.activeForm === form ? null : form;
  }
}