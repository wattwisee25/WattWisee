import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Building {
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

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl, { withCredentials: true });
  }

  createProject(project: Project): Observable<any> {
    return this.http.post(this.apiUrl, project, { withCredentials: true });
  }

  getProjectById(id: string): Observable<Project> {
  return this.http.get<Project>(`${this.apiUrl}/${id}`, { withCredentials: true });
}
}
