import { Component, Input, Output, EventEmitter } from '@angular/core';  //import necessary Angular core modules
import { Ceiling, Opening } from '../../models/room.models'; //import Ceiling and Opening interfaces from room models
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ceiling-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ceiling-config">
      <h3>Ceiling Configuration</h3>
      
      <div class="ceiling-options">
        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              [(ngModel)]="ceiling.hasLighting"
              (ngModelChange)="onCeilingChange()"
            />
            Built-in Lighting
          </label>
        </div>

        <div class="form-group">
          <label for="material">Ceiling Material:</label>
          <select 
            id="material"
            [(ngModel)]="ceiling.material"
            (ngModelChange)="onCeilingChange()"
            class="form-control"
          >
            <option value="">Select material</option>
            <option value="Drywall">Drywall</option>
            <option value="Plaster">Plaster</option>
            <option value="Wood Panels">Wood Panels</option>
            <option value="Acoustic Tiles">Acoustic Tiles</option>
            <option value="Exposed Beams">Exposed Beams</option>
          </select>
        </div>
      </div>

      <div class="skylights-section">
        <h4>Skylights / Ceiling Openings</h4>
        
        <div class="skylight-form">
          <div class="form-row">
            <div class="form-group">
              <label for="skylightWidth">Width ({{ unitSymbol }}):</label>
              <input 
                type="number" 
                id="skylightWidth"
                [(ngModel)]="newSkylight.width"
                min="0.5"
                step="0.1"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label for="skylightHeight">Height ({{ unitSymbol }}):</label>
              <input 
                type="number" 
                id="skylightHeight"
                [(ngModel)]="newSkylight.height"
                min="0.5"
                step="0.1"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="skylightPosX">Position X ({{ unitSymbol }}):</label>
              <input 
                type="number" 
                id="skylightPosX"
                [(ngModel)]="newSkylight.positionX"
                min="0"
                step="0.5"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label for="skylightPosY">Position Y ({{ unitSymbol }}):</label>
              <input 
                type="number" 
                id="skylightPosY"
                [(ngModel)]="newSkylight.positionY"
                min="0"
                step="0.5"
                class="form-control"
              />
            </div>
          </div>

          <button 
            class="btn-add-skylight"
            (click)="addSkylight()"
            [disabled]="!isValidSkylight()"
          >
            Add Skylight
          </button>
        </div>

        <div class="skylights-list" *ngIf="ceiling.openings.length > 0">
          <div *ngFor="let skylight of ceiling.openings" class="skylight-item">
            <div class="skylight-info">
              <span class="skylight-type">Skylight</span>
              <span>{{ skylight.width }} × {{ skylight.height }} {{ unitSymbol }}</span>
              <span>Position: ({{ skylight.positionX }}, {{ skylight.positionY }})</span>
            </div>
            <button class="btn-remove" (click)="removeSkylight(skylight.id)">×</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ceiling-config {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .ceiling-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px solid #ddd;
    }
    
    .skylights-section {
      margin-top: 20px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .btn-add-skylight {
      background: #9b59b6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .btn-add-skylight:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
    
    .btn-add-skylight:hover:not(:disabled) {
      background: #8e44ad;
    }
    
    .skylights-list {
      margin-top: 20px;
    }
    
    .skylight-item {
      background: white;
      padding: 12px 15px;
      margin-bottom: 10px;
      border-radius: 4px;
      border-left: 3px solid #9b59b6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .skylight-info {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: #555;
    }
    
    .skylight-type {
      font-weight: bold;
      color: #9b59b6;
    }
    
    .btn-remove {
      background: #e74c3c;
      color: white;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
    
    .btn-remove:hover {
      background: #c0392b;
    }
    
    h3 {
      margin-top: 0;
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    
    h4 {
      margin: 0 0 15px 0;
      color: #2c3e50;
    }
  `]
})
export class CeilingConfigComponent {
  @Input() ceiling!: Ceiling;
  @Input() unitSymbol: string = 'ft';
  @Output() ceilingChange = new EventEmitter<Partial<Ceiling>>();
  @Output() skylightAdded = new EventEmitter<Omit<Opening, 'id'>>();
  @Output() skylightRemoved = new EventEmitter<number>();

  newSkylight: Omit<Opening, 'id'> = {
    width: 2,
    height: 1,
    positionX: 0,
    positionY: 0,
    type: 'window'
  };

  onCeilingChange(): void {
    this.ceilingChange.emit(this.ceiling);
  }

  addSkylight(): void {
    if (this.isValidSkylight()) {
      this.skylightAdded.emit({ ...this.newSkylight });
      this.resetSkylightForm();
    }
  }

  removeSkylight(skylightId: number): void {
    this.skylightRemoved.emit(skylightId);
  }

  isValidSkylight(): boolean {
    return this.newSkylight.width > 0 &&
      this.newSkylight.height > 0;
  }

  private resetSkylightForm(): void {
    this.newSkylight = {
      width: 2,
      height: 1,
      positionX: 0,
      positionY: 0,
      type: 'window'
    };
  }
}
