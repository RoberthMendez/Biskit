import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getLastTreatmentCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/ultimos-tratamientos-count');
  }

  getTreatmentsDrugCount(id: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/admin/droga/${id}/tratamientos-count`);
  }
}
