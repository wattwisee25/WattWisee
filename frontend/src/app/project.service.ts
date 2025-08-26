import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) { }

  saveProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project, { withCredentials: true });
  }
}
