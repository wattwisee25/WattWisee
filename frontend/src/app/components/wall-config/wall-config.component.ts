import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WallDetail {
  constructionType: string;
  insulationMaterials: string;
  insideMaterials: string;
  constructionMaterials: string;
  uValue: number;
  area: number;
  heatLossWK: number;
}

interface Window {
  length: number;
  width: number;
  totalArea: number;
  number: number;
  windowsDetails: any[];
}

interface Door {
  length: number;
  width: number;
  totalArea: number;
  number: number;
  doorsDetails: any[];
}

interface Wall {
  length: number;
  width: number;
  totalArea: number;
  number: number;
  orientation: 'North' | 'South' | 'East' | 'West';
  exposure: 'exterior' | 'interior';
  windows: Window[];
  doors: Door[];
  wallsDetails: WallDetail[];
}

@Component({
  selector: 'app-wall-config',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="room-iso" *ngIf="walls.length > 0; else noWalls">

    <div
      *ngFor="let wall of walls"
      class="wall"
      [ngClass]="wall.orientation.toLowerCase()"
      [style.width.px]="(wall.orientation === 'East' || wall.orientation === 'West' ? wall.width : wall.length) * 30"
      [style.height.px]="(wall.orientation === 'East' || wall.orientation === 'West' ? wall.length : wall.width) * 30"
      [style.transform]="getWallTransform(wall)"
    >
      {{ wall.orientation }}
    </div>

  </div>

  <ng-template #noWalls>
    <p style="text-align:center; color:#888">
      Add walls to see the room representation
    </p>
  </ng-template>
`,
  styles: [`
  .room-iso {
    position: relative;
    width: 400px;
    height: 300px;
    margin: 80px auto 40px;
    transform: rotateX(60deg) rotateZ(-45deg);
    transform-style: preserve-3d;
  }

  .wall {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    opacity: 0.85;
    border: 1px solid #333;
    left: 50%;
    top: 50%;
  }

  .north {
    background: lightblue;
    transform-origin: center;
  }

  .south {
    background: #f6ffa2;
    transform-origin: center;
  }

  .east {
    background: lightgreen;
    transform-origin: center;
  }

  .west {
    background: lightcoral;
    transform-origin: center;
  }
`]
})
export class WallConfigComponent {
  @Input() walls: Wall[] = [];

  private readonly SCALE = 30;

  // distance North–South (depends on East + West)
  get roomDepth(): number {
    const depths = this.walls
      .filter(w => w.orientation === 'East' || w.orientation === 'West')
      .map(w => w.length);

    return depths.length ? Math.max(...depths) * this.SCALE : 0;
  }

  // distance East–West (depends on North + South)
  get roomLength(): number {
    const lengths = this.walls
      .filter(w => w.orientation === 'North' || w.orientation === 'South')
      .map(w => w.length);

    return lengths.length ? Math.max(...lengths) * this.SCALE : 0;
  }

  // Calculate wall position and rotation
  getWallTransform(wall: Wall): string {
    const halfDepth = this.roomDepth / 2;
    const halfLength = this.roomLength / 2;

    switch (wall.orientation) {
      case 'North':
        return `translate(-50%, -50%) rotateX(-90deg) translateZ(${halfDepth}px)`;

      case 'South':
        return `translate(-50%, -50%) rotateX(-90deg) translateZ(${-halfDepth}px)`;

      case 'East':
        return `translate(-50%, -50%) rotateY(-90deg) translateZ(${halfLength}px)`;

      case 'West':
        return `translate(-50%, -50%) rotateY(-90deg) translateZ(${-halfLength}px)`;

      default:
        return 'translate(-50%, -50%)';
    }
  }

  onAddOpening(wallId: number, opening: any) {
    // For future use
  }

  onRemoveOpening(wallId: number, openingId: number) {
    // For future use
  }
}
