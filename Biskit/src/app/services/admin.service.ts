import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Droga } from '../models/Droga/droga';
import { Enfermedad } from '../models/Pets/enfermedad';
import { DrogaTratamientosCountDto } from '../models/dtos/droga-tratamientos-count-dto';
import { TratamientoMesDto } from '../models/dtos/tratamiento-mes-dto';
import { TopDrogaDto } from '../models/dtos/top-droga-dto';
import { TopEnfermedadDto } from '../models/dtos/top-enfermedad-dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getLastTreatmentCount(): Observable<TratamientoMesDto[]> {
    return this.http.get<TratamientoMesDto[]>('http://localhost:8080/admin/ultimos-tratamientos-count');
  }

  getNumTratamientosPorDrogaUltimoMes(): Observable<DrogaTratamientosCountDto[]> {
    return this.http.get<DrogaTratamientosCountDto[]>('http://localhost:8080/admin/droga-tratamientos-mes-count');
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

  getTop5Drogas(): Observable<TopDrogaDto[]>{
    return this.http.get<TopDrogaDto[]>('http://localhost:8080/admin/top5-drogas');
  }

  getTop5Enfermedades(): Observable<TopEnfermedadDto[]>{
    return this.http.get<TopEnfermedadDto[]>('http://localhost:8080/admin/top5-enfermedades');
  }
}
