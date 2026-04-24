import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Droga } from '../models/Droga/droga';
import { Enfermedad } from '../models/Pets/enfermedad';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getLastTreatmentCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/ultimos-tratamientos-count');
  }

  getTreatmentsDrugMonthCount(id: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/admin/droga/${id}/tratamientos-mes-count`);
  }

  getNumVeterinariosActivos(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/vets-activos-count');
  }

  getNumVeterinariosInactivos(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/vets-inactivos-count');
  }

  getNumMascotas(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/mascotas-count');
  }

  getNumMascotasInactivas(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/mascotas-inactivas-count');
  }

  getVentasTotales(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/ventas-totales');
  }

  getGananciasTotales(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/ganancias-totales');
  }

  getTop5Drogas(): Observable<{ drug: Droga, top: number }[]> {
    return this.http.get<{ drug: Droga, top: number }[]>('http://localhost:8080/admin/top5-drogas');
  }

  getTop5Enfermedades(): Observable<{ enfermedad: Enfermedad, top: number }[]> {
    return this.http.get<{ enfermedad: Enfermedad, top: number }[]>('http://localhost:8080/admin/top5-enfermedades');
  }
}
