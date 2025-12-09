import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Bill {
  _id?: string;
  buildingId: string;
  type: 'electricity' | 'oil' | 'lpg';
  data: any;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillService {
 private apiUrl = `${environment.apiUrl}/users`;


  constructor(private http: HttpClient) {}

  // Recupera bollette di un edificio per tipo
  getBills(buildingId: string, type: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/${buildingId}/${type}`);
  }

  // Crea una nuova bolletta
  addBill(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.apiUrl, bill);
  }

  // Aggiorna una bolletta
  updateBill(id: string, data: any): Observable<Bill> {
    return this.http.put<Bill>(`${this.apiUrl}/${id}`, { data });
  }

  // Elimina una bolletta
  deleteBill(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
