import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

@Injectable({ providedIn: 'root' })
export class ClaudeService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, projectId: string, buildingId: string, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('buildingId', buildingId);
    formData.append('type', type);

    return this.http.post('${environment.apiUrl}/api/claude/upload', formData);

  }
}

