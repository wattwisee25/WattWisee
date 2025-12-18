import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  id: number;
  label: string;
  percentage: string;
}

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrls: ['./progress-bar.css']
})
export class ProgressBar {

  /** Stato passato dal componente genitore */
  @Input() hasBuilding = false;
  @Input() hasBills = false;
  @Input() analysisCompleted = false;

  /** Step corrente calcolato dinamicamente */
  get currentStep(): 1 | 2 | 3 {
    if (!this.hasBuilding || !this.hasBills) return 1;
    if (!this.analysisCompleted) return 2;
    return 3;
  }

  /** Step definiti staticamente per label */
  steps: Step[] = [
    { id: 1, label: 'Data gathering', percentage: '0%' }, 
    { id: 2, label: 'Analysis', percentage: '' }, 
    { id: 3, label: 'Recommendations', percentage: '' }
  ];

  /** Evidenzia gli step attivi */
  isActive(stepId: number): boolean {
    return stepId <= this.currentStep;
  }

  /** Calcola la percentuale dinamica in base allo stato reale */
getPercentage(stepId: number): string {
  if (stepId === 1) {
    if (!this.hasBuilding && !this.hasBills) return '0%';
    if (this.hasBuilding && this.hasBills) return '50%';
    return '25%';
  }

  if (stepId === 2) {
    return this.analysisCompleted ? '75%' : '';
  }

  if (stepId === 3) {
    return this.analysisCompleted ? '100%' : '';
  }

  return '0%';
}

getCircleBorder(stepId: number): string {
  const perc = parseInt(this.getPercentage(stepId)) || 0;
  let deg = (perc / 100) * 360;

  // Se stepId è 1, raddoppia l'angolo
  if (stepId === 1) {
    deg *= 2;
  }

  // Solo bordo colorato, il centro sarà coperto dal cerchio interno bianco
  return `conic-gradient(#4caf50 0deg ${deg}deg, #e0e0e0 ${deg}deg 360deg)`;
}


}
