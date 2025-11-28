import { Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { CommonModule } from '@angular/common';
import { BackButton } from "../back-button/back-button";
import { Filter } from '../filter/filter';
import { ProjectService } from '../project.service';

interface EfficiencyLevel {
  code: string;
  range: string;
  value?: number;
}

@Component({
  selector: 'app-audit-report',
  imports: [Menu, BackButton, Filter, CommonModule],
  templateUrl: './audit-report.html',
  styleUrls: ['./audit-report.css']
})
export class AuditReport {
  checklist = [
    { label: 'Physical Condition of Building(s)', yes: false, no: false, na: false, comment: '' },
    { label: 'Insulation of Walls, Roofs', yes: false, no: false, na: false, comment: '' },
    { label: 'Windows and external doors', yes: false, no: false, na: false, comment: '' },
    { label: 'Space Heating', yes: false, no: false, na: false, comment: '' },
    { label: 'Water Heating', yes: false, no: false, na: false, comment: '' },
    { label: 'Heating Controls', yes: false, no: false, na: false, comment: '' },
    { label: 'ICT & office equipment', yes: false, no: false, na: false, comment: '' },
    { label: 'Ventilation & Air Conditioning', yes: false, no: false, na: false, comment: '' },
    { label: 'Lighting', yes: false, no: false, na: false, comment: '' },
    { label: 'Refrigeration & Cooling', yes: false, no: false, na: false, comment: '' },
    { label: 'Compressed air', yes: false, no: false, na: false, comment: '' },
    { label: 'Pumps', yes: false, no: false, na: false, comment: '' },
    { label: 'Industrial processes', yes: false, no: false, na: false, comment: '' },
    { label: 'Transport', yes: false, no: false, na: false, comment: '' },
    { label: 'Evidence of Energy Awareness (posters etc.)', yes: false, no: false, na: false, comment: '' }
  ];

  showFilter = true;
  selectedProjectId = '';
  selectedProjectName = '';
  selectedBuildingId = '';
  selectedBuildingName = '';
  selectedBuilding: any = null;
  userId: string = '';

  calculatedEUI = 0;
  berLevel: EfficiencyLevel | null = null;

  currentLevel: EfficiencyLevel = { code: 'A3', range: '≥ 0.34', value: 0.36 };
  co2Value = 0.27;
  selectedRating: string | null = null;

  efficiencyLevels: EfficiencyLevel[] = [
    { code: 'A1', range: '< 0.17' }, { code: 'A2', range: '≥ 0.17' }, { code: 'A3', range: '≥ 0.34' },
    { code: 'B1', range: '≥ 0.50' }, { code: 'B2', range: '≥ 0.67' }, { code: 'B3', range: '≥ 0.84' },
    { code: 'C1', range: '≥ 1.00' }, { code: 'C2', range: '≥ 1.17' }, { code: 'C3', range: '≥ 1.34' },
    { code: 'D1', range: '≥ 1.50' }, { code: 'D2', range: '≥ 1.75' },
    { code: 'E1', range: '≥ 2.00' }, { code: 'E2', range: '≥ 2.25' },
    { code: 'F', range: '≥ 2.50' }, { code: 'G', range: '≥ 3.00' }
  ];

  constructor(private projectService: ProjectService) {
    this.userId = localStorage.getItem('userId') || '';
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  toggleSelection(item: any, field: 'yes' | 'no' | 'na') {
    item.yes = field === 'yes';
    item.no = field === 'no';
    item.na = field === 'na';
  }

  updateComment(event: Event, item: any) {
    const target = event.target as HTMLElement;
    if (target) item.comment = target.innerText;
  }

  // 🔹 Recupera checklist esistente per il building selezionato
  loadChecklist() {
    if (!this.selectedProjectId || !this.selectedBuildingId) return;

    this.projectService.getChecklist(this.selectedProjectId, this.selectedBuildingId).subscribe({
      next: (res) => {
        this.checklist = res.checklist || [];
      },
      error: (err) => {
        console.error('Error loading checklist', err);
      }
    });
  }

  // 🔹 Salvataggio / aggiornamento checklist
  saveChecklist() {
    if (!this.selectedProjectId || !this.selectedBuildingId) {
      console.error('Project or building ID missing');
      alert('Missing project or building');
      return;
    }

    this.projectService.updateChecklist(this.selectedProjectId, this.selectedBuildingId, this.checklist)
      .subscribe({
        next: (res) => {
          console.log('Checklist updated successfully', res);
          alert('Checklist saved!');
        },
        error: (err) => {
          console.error('Error updating checklist', err);
          alert('Error saving checklist');
        }
      });
  }

  onBuildingSelected(event: { projectId: string; projectName: string; buildingId: string; buildingName: string; buildingData: any }) {
    this.selectedProjectId = event.projectId;
    this.selectedProjectName = event.projectName;
    this.selectedBuildingId = event.buildingId;
    this.selectedBuildingName = event.buildingName;
    this.selectedBuilding = event.buildingData;

    this.showFilter = false;
    this.calculateBER(this.selectedBuilding);

    // 🔹 Carica la checklist esistente appena si seleziona il building
    this.loadChecklist();
  }

  showRating(value: string) {
    this.selectedRating = value;
    const level = this.efficiencyLevels.find(l => l.code === value);
    if (level) this.currentLevel = { ...level, value: this.generateValueForLevel(level.code) };
  }

  calculateBER(building: any) { //calcolo livello energetico (A1,A2, ecc.)
    if (!building) return;
    const ΔT = 20;
    const hoursPerYear = 8760;
    const η_system = 0.9;

    const wallLoss = building.envelope?.uValue && building.envelope?.surfaceArea
      ? building.envelope.uValue * building.envelope.surfaceArea * ΔT * hoursPerYear / 1000 : 0;
    const roofLoss = building.roof?.uValue && building.roof?.totalAreaRoof
      ? building.roof.uValue * building.roof.totalAreaRoof * ΔT * hoursPerYear / 1000 : 0;
    const windowLoss = building.windows?.uValue && building.windows?.totalWindowsArea
      ? building.windows.uValue * building.windows.totalWindowsArea * ΔT * hoursPerYear / 1000 : 0;
    const doorLoss = building.doors?.uValue && building.doors?.totalAreaDoors
      ? building.doors.uValue * building.doors.totalAreaDoors * ΔT * hoursPerYear / 1000 : 0;

    const transmissionLossTotal = wallLoss + roofLoss + windowLoss + doorLoss;
    const V_building = building.envelope?.surfaceArea || 500;
    const n = 0.5;
    const ρ = 1.2;
    const c_p = 1000;
    const ventilationLoss = V_building * n * ρ * c_p * ΔT * hoursPerYear / 1000;
    const heatingEnergy = (transmissionLossTotal + ventilationLoss) / η_system;
    const lightingEnergy = building.lighting?.totalEnergyUsed || 0;
    const auxiliaryEnergy = building.auxiliary?.totalEnergyUsed || 0;

    const totalEnergy = heatingEnergy + lightingEnergy + auxiliaryEnergy;
    const floorArea = building.envelope?.surfaceArea || 100;
    const EUI = totalEnergy / floorArea;
    this.calculatedEUI = EUI;

    this.berLevel = this.efficiencyLevels.slice().reverse().find(level => EUI >= this.generateValueForLevel(level.code)) || this.efficiencyLevels[0];
    this.currentLevel = { ...this.berLevel, value: EUI };
  }

  generateValueForLevel(code: string): number {
    switch (code) {
      case "A1": return 0.10; case "A2": return 0.20; case "A3": return 0.35;
      case "B1": return 0.55; case "B2": return 0.70; case "B3": return 0.85;
      case "C1": return 1.05; case "C2": return 1.20; case "C3": return 1.35;
      case "D1": return 1.55; case "D2": return 1.80;
      case "E1": return 2.10; case "E2": return 2.30;
      case "F": return 2.60; case "G": return 3.10;
      default: return 0;
    }
  }

  get currentIndicatorPosition(): number {
    const index = this.efficiencyLevels.findIndex(l => l.code === this.currentLevel.code);
    return index / (this.efficiencyLevels.length - 1) * 100;
  }

  get currentCO2Position(): number {
    const max = 3;
    return (this.co2Value / max) * 100;
  }
}
