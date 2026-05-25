import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DrogaDto } from '../models/dtos/droga-dto';
import { environment } from '../../environments/environment';

interface DrogaResponse {
  id: number;
  nombre: string;
  unidadesDisponibles: number;
}

@Injectable({
  providedIn: 'root',
})
export class DrogasService {
  constructor(private http: HttpClient) {}

  // ----- Obtener todas las drogas (READ) -----
  findAll(): Observable<DrogaDto[]> {
    return this.http
      .get<DrogaResponse[]>(`${environment.apiUrl}/drogas`)
      .pipe(
        map((drogas) =>
          drogas.map(
            (droga) =>
              new DrogaDto(droga.id, droga.nombre, droga.unidadesDisponibles),
          ),
        ),
      );
  }
}
