//this service manages room design data, including dimensions, walls, openings, and ceiling configurations.
import { Injectable } from '@angular/core';
import { RoomDesign, RoomDimension, RoomWall, Opening, Ceiling } from '../models/room.models';
import { from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    private currentDesign: RoomDesign;

    constructor() {
        this.currentDesign = this.initializeDesign();
        this.calculateTotals();
    }

    private initializeDesign(): RoomDesign { // Initialize with default values for a sample room
        const dimensions: RoomDimension = {
            id: 1,
            name: 'Living Room',
            length: 20,
            height: 10,
            width: 15,
            unit: 'feet'
        };

        const walls = this.initializeWalls(dimensions); // Create walls based on dimensions

        return { // Return the complete room design object
            name: 'Living Room',
            dimensions,
            walls,
            ceiling: {
                hasLighting: true,
                height: dimensions.height,
                material: 'Drywall',
                openings: [
                    { id: 1, type: 'window', width: 3, height: 2, positionX: 5, positionY: 1 }
                ]
            },
            floorArea: 0,
            wallArea: 0,
            ceilingArea: 0,
            totalVolume: 0
        };
    }

    private initializeWalls(dimensions: RoomDimension): RoomWall[] { //ceate 4 walls based on room dimensions and default openings
        const { length, width, height } = dimensions;

        return [
            {
                id: 1,
                name: 'North Wall',
                length,
                height,
                color: '#fff',
                openings: [
                    { id: 1, type: 'window', width: 4, height: 3, positionX: 2, positionY: 3 },
                    { id: 2, type: 'door', width: 3, height: 7, positionX: 8, positionY: 0 }
                ]
            },
            {
                id: 2,
                name: 'South Wall',
                length,
                height,
                color: '#fff',
                openings: [
                    { id: 3, type: 'window', width: 3, height: 4, positionX: 6, positionY: 2 }
                ]
            },
            {
                id: 3,
                name: 'East Wall',
                length: width || 0,
                height,
                color: '#fff',
                openings: []
            },
            {
                id: 4,
                name: 'West Wall',
                length: width || 0,
                height,
                color: '#fff',
                openings: [
                    { id: 4, type: 'door', width: 2.5, height: 7, positionX: 2, positionY: 0 }
                ]
            }
        ];
    }


    // Service methods to get and update room design data 
    // Get the current room design
    getRoomDesign(): RoomDesign { //Return a copy of the current room design object to prevent direct mutation of the object
        return { ...this.currentDesign };
    }
    // Update room dimensions and recalculate walls and totals
    updateDimensions(dimensions: Partial<RoomDimension>): void { //Update room dimensions and recalculate walls and totals 
        this.currentDesign.dimensions = { ...this.currentDesign.dimensions, ...dimensions };
        this.currentDesign.walls = this.initializeWalls(this.currentDesign.dimensions);
        this.calculateTotals();
    }

    // Add a new opening to a specified wall and recalculate totals
    addOpeningToWall(wallId: number, opening: Omit<Opening, 'id'>): void { //Add a new opening to a specified wall and recalculate totals
        const wallIndex = this.currentDesign.walls.findIndex(w => w.id === wallId);
        if (wallIndex !== -1) {
            const newId = Math.max(...this.currentDesign.walls[wallIndex].openings.map(o => o.id), 0) + 1;
            this.currentDesign.walls[wallIndex].openings.push({ ...opening, id: newId });
            this.calculateTotals();
        }
    }

    // Remove an opening from a specified wall and recalculate totals
    removeOpeningFromWall(wallId: number, openingId: number): void {
        const wallIndex = this.currentDesign.walls.findIndex(w => w.id === wallId);
        if (wallIndex !== -1) {
            this.currentDesign.walls[wallIndex].openings =
                this.currentDesign.walls[wallIndex].openings.filter(o => o.id !== openingId);
            this.calculateTotals();
        }
    }

    // Add a skylight to the ceiling and recalculate totals
    addSkylightToCeiling(skylight: Omit<Opening, 'id'>): void {
        const newId = Math.max(...this.currentDesign.ceiling.openings.map(o => o.id), 0) + 1;
        this.currentDesign.ceiling.openings.push({ ...skylight, id: newId, type: 'window' });
        this.calculateTotals();
    }

    // Remove a skylight from the ceiling and recalculate totals
    updateCeiling(updates: Partial<Ceiling>): void {
        this.currentDesign.ceiling = { ...this.currentDesign.ceiling, ...updates };
        this.calculateTotals();
    }

    // Remove a skylight from the ceiling and recalculate totals
    private calculateTotals(): void {
        const { length, width, height } = this.currentDesign.dimensions;

        // Calculate floor area
        const floorArea = length * (width || 0);

        // Calculate wall area minus openings
        let wallArea = 0;
        this.currentDesign.walls.forEach(wall => {
            const wallTotalArea = wall.length * wall.height;
            const openingsArea = wall.openings.reduce((total, opening) =>
                total + (opening.width * opening.height), 0);
            wallArea += (wallTotalArea - openingsArea);
        });

        // Calculate ceiling area minus skylights
        const ceilingTotalArea = floorArea;
        const skylightsArea = this.currentDesign.ceiling.openings.reduce((total, opening) =>
            total + (opening.width * opening.height), 0);
        const ceilingArea = ceilingTotalArea - skylightsArea;

        // Calculate volume
        const volume = floorArea * height;

        this.currentDesign.floorArea = Math.round(floorArea * 100) / 100;
        this.currentDesign.wallArea = Math.round(wallArea * 100) / 100;
        this.currentDesign.ceilingArea = Math.round(ceilingArea * 100) / 100;
        this.currentDesign.totalVolume = Math.round(volume * 100) / 100;
    }

    // Get unit symbol for display purposes
    getUnitSymbol(): string {
        switch (this.currentDesign.dimensions.unit) {
            case 'feet': return 'ft';
            case 'meters': return 'm';
            case 'inches': return 'in';
            default: return 'ft';
        }
    }
}