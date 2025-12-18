import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';


export interface Building {
  mprn: any;
floors: any;
surface: any;
city: any;
address: any;
  _id?: string;
  name: string;
  imageUrl: string | ArrayBuffer | null;
}

export interface Project {
  _id?: string;
  projectName: string;
  buildings: Building[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;


  constructor(private http: HttpClient) { }

  // Recupera tutti i progetti dell'utente
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl, { withCredentials: true });
  }

  // Crea un nuovo progetto
  createProject(project: Project): Observable<any> {
    return this.http.post(this.apiUrl, project, { withCredentials: true });
  }

  // Recupera un progetto per ID
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getBuildingById(buildingId: string): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/buildings/${buildingId}`, { withCredentials: true });
  }

updateBuilding(buildingId: string, buildingData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/buildings/${buildingId}`, buildingData, { withCredentials: true });
}

getSingleBuilding(buildingId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/buildings/${buildingId}`, { withCredentials: true });
}

// Aggiorna (o crea) la checklist di un building
updateChecklist(projectId: string, buildingId: string, checklist: any[]): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${projectId}/buildings/${buildingId}/checklist`,
    { checklist },
    { withCredentials: true }
  );
}

// Recupera la checklist esistente di un building
getChecklist(projectId: string, buildingId: string): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/${projectId}/buildings/${buildingId}/checklist`,
    { withCredentials: true }
  );
}




  // Aggiunge edifici a un progetto esistente (usa PUT come nel backend)
  addBuildingsToProject(id: string, buildings: Building[]): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/buildings`,
      { buildings },
      { withCredentials: true }
    );
  }

  // Recupera se ci sono o meno i dati in un building

  private hasMeaningfulBuildingData(building: any): boolean {
  const meaningfulFields = [
    'mprn',
    'floors',
    'surface',
    'city',
    'address'
  ];

  return meaningfulFields.some(field => {
    const value = building?.[field];
    return value !== null && value !== undefined && value !== '';
  });
}

  // Verifica se esiste il building (dato un buildingId)
hasBuilding(buildingId: string): Observable<boolean> {
  return this.getSingleBuilding(buildingId).pipe(
    map(building => {
      if (!building) {
        return false;
      }

      return this.hasMeaningfulBuildingData(building);
    })
  );
}


// Verifica se sotto il building ci sono bollette
hasBills(buildingId: string): Observable<boolean> {
  return this.http
    .get<{ exists: boolean }>(
      `${environment.apiUrl}/api/bill/check/${buildingId}`,
      { withCredentials: true }
    )
    .pipe(map(res => res.exists));
}


}

