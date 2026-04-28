import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DrogaTratamientosCountDto } from '../models/dtos/droga-tratamientos-count-dto';
import { TratamientoMesDto } from '../models/dtos/tratamiento-mes-dto';
import { TopDto } from '../models/dtos/top-dto';
import { StockDrogaDto } from '../models/dtos/stock-droga-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAdminById(id: string): Observable<any> {
    return this.http.get(`http://localhost:8080/admin/${id}`);
  }

  getLastTreatmentCount(): Observable<TratamientoMesDto[]> {
    return this.http.get<TratamientoMesDto[]>('http://localhost:8080/admin/ultimos-tratamientos-count');
  }

  getNumTratamientosPorDrogaUltimoMes(): Observable<DrogaTratamientosCountDto[]> {
    return this.http.get<DrogaTratamientosCountDto[]>('http://localhost:8080/admin/droga-tratamientos-mes-count');
  }

  getNumVeterinarios(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/vets-count');
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

  getNumMascotasActivas(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/admin/mascotas-activas-count');
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

  getTop5Drogas(): Observable<TopDto[]>{
    return this.http.get<TopDto[]>('http://localhost:8080/admin/top5-drogas');
  }

  getTop5Enfermedades(): Observable<TopDto[]>{
    return this.http.get<TopDto[]>('http://localhost:8080/admin/top5-enfermedades');
  }

  getDrogasBajasEnStock(): Observable<StockDrogaDto[]> {
    return this.http.get<StockDrogaDto[]>('http://localhost:8080/admin/drogas-bajas-stock');
  }
}
