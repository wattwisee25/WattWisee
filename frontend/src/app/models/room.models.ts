// Room dimension and design models
// this file defines interfaces (interfaces are used to define types, types are used to define objects) for room dimensions, walls, openings, ceilings, and overall room design.
export interface RoomDimension {
    id: number;
    name: string;
    length: number;
    height: number;
    width?: number;
    unit: 'feet' | 'meters' | 'inches';
}

export interface Opening {
    id: number;
    type: 'window' | 'door';
    width: number;
    height: number;
    positionX: number; // Distance from left edge of wall
    positionY: number; // Distance from floor
}

export interface RoomWall {
    id: number;
    name: string;
    length: number;
    height: number;
    openings: Opening[];
    color?: string;
}

export interface Ceiling {
    hasLighting: boolean;
    height: number;
    material?: string;
    openings: Opening[]; // For skylights
}

export interface RoomDesign {
    name: string;
    dimensions: RoomDimension;
    walls: RoomWall[];
    ceiling: Ceiling;
    floorArea: number;
    wallArea: number;
    ceilingArea: number;
    totalVolume: number;
}
