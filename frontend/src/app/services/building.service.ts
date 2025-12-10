import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Building {
  _id: string;
  name: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private apiUrl = `${environment.apiUrl}/api/buildings`; // indirizzo backend

  constructor(private http: HttpClient) {}

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiUrl);
  }
}
