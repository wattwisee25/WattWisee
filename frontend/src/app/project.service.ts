import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/projects';

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
  return this.http.get(`/api/buildings/${buildingId}`);
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
}

