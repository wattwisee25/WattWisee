//This component allows users to add and manage openings (windows/doors) on a wall in a room design application. 
//i provides a form for specifying the type, width, height, and position of the opening. 

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Opening, RoomWall } from '../../models/room.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opening-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="opening-editor">
      <h4>Add Window/Door</h4>
      
      <div class="form-group">
        <label for="openingType">Type:</label>
        <select id="openingType" [(ngModel)]="newOpening.type" class="form-control">
          <option value="window">Window</option>
          <option value="door">Door</option>
        </select>
      </div>

      <div class="dimension-row">
        <div class="form-group">
          <label for="width">Width ({{ unitSymbol }}):</label>
          <input 
            type="number" 
            id="width"
            [(ngModel)]="newOpening.width"
            [max]="maxWidth"
            min="0.1"
            step="0.1"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="height">Height ({{ unitSymbol }}):</label>
          <input 
            type="number" 
            id="height"
            [(ngModel)]="newOpening.height"
            [max]="maxHeight"
            min="0.1"
            step="0.1"
            class="form-control"
          />
        </div>
      </div>

      <div class="dimension-row">
        <div class="form-group">
          <label for="positionX">From Left ({{ unitSymbol }}):</label>
          <input 
            type="number" 
            id="positionX"
            [(ngModel)]="newOpening.positionX"
            [max]="wall.length - newOpening.width"
            min="0"
            step="0.1"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="positionY">From Floor ({{ unitSymbol }}):</label>
          <input 
            type="number" 
            id="positionY"
            [(ngModel)]="newOpening.positionY"
            [max]="wall.height - newOpening.height"
            min="0"
            step="0.1"
            class="form-control"
          />
        </div>
      </div>

      <button 
        class="btn-add"
        (click)="addOpening()"
        [disabled]="!isValidOpening()"
      >
        Add {{ newOpening.type === 'window' ? 'Window' : 'Door' }}
      </button>

      <div class="openings-list" *ngIf="wall.openings.length > 0">
        <h5>Existing Openings:</h5>
        <div *ngFor="let opening of wall.openings" class="opening-item">
          <div class="opening-info">
            <span class="opening-type">{{ opening.type | titlecase }}</span>
            <span>{{ opening.width }} × {{ opening.height }} {{ unitSymbol }}</span>
            <span>Position: ({{ opening.positionX }}, {{ opening.positionY }})</span>
          </div>
          <button class="btn-remove" (click)="removeOpening(opening.id)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .opening-editor {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #ddd;
      margin-top: 15px;
    }
    
    h4 {
      margin-top: 0;
      color: #2c3e50;
      font-size: 16px;
    }
    
    h5 {
      margin: 15px 0 10px;
      color: #555;
      font-size: 14px;
    }
    
    .dimension-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .form-group {
      margin-bottom: 10px;
    }
    
    label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 3px;
    }
    
    .form-control {
      width: 100%;
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .btn-add {
      background: #27ae60;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      width: 100%;
      margin-top: 10px;
    }
    
    .btn-add:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
    
    .btn-add:hover:not(:disabled) {
      background: #219653;
    }
    
    .openings-list {
      margin-top: 15px;
    }
    
    .opening-item {
      background: white;
      padding: 10px;
      margin-bottom: 8px;
      border-radius: 4px;
      border-left: 3px solid #3498db;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .opening-info {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: #555;
    }
    
    .opening-type {
      font-weight: bold;
      color: #2c3e50;
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
  `]
})
export class OpeningEditorComponent {
  @Input() wall!: RoomWall;
  @Input() unitSymbol: string = 'ft';
  @Output() add = new EventEmitter<Omit<Opening, 'id'>>();
  @Output() remove = new EventEmitter<number>();

  newOpening: Omit<Opening, 'id'> = {
    type: 'window',
    width: 2,
    height: 3,
    positionX: 0,
    positionY: 3
  };

  get maxWidth(): number {
    return this.wall.length - this.newOpening.positionX;
  }

  get maxHeight(): number {
    return this.wall.height - this.newOpening.positionY;
  }

  isValidOpening(): boolean {
    return this.newOpening.width > 0 &&
      this.newOpening.height > 0 &&
      this.newOpening.positionX + this.newOpening.width <= this.wall.length &&
      this.newOpening.positionY + this.newOpening.height <= this.wall.height;
  }

  addOpening(): void {
    if (this.isValidOpening()) {
      this.add.emit({ ...this.newOpening });
      this.resetForm();
    }
  }

  removeOpening(openingId: number): void {
    this.remove.emit(openingId);
  }

  private resetForm(): void {
    this.newOpening = {
      type: 'window',
      width: 2,
      height: 3,
      positionX: 0,
      positionY: 3
    };
  }
}
