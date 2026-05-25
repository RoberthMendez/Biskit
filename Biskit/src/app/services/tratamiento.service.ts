import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from '../models/Tratamiento/tratamiento';
import { HttpClient } from '@angular/common/http';
import { TratamientoDto } from '../models/dtos/tratamiento-dto';
import { TratamientoDetalleDto } from '../models/dtos/tratamiento-detalle-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TratamientoService {
  constructor(private http: HttpClient) {}

  // ----- Crear y Actualizar Tratamiento (CREATE/UPDATE) -----
  saveTratamiento(tratamientoDto: TratamientoDto): Observable<Tratamiento> {
    if (tratamientoDto.id != null)
      return this.http.put<Tratamiento>(
        `${environment.apiUrl}/tratamientos/update/${tratamientoDto.id}`,
        tratamientoDto,
      );
    else
      return this.http.post<Tratamiento>(
        `${environment.apiUrl}/tratamientos/add`,
        tratamientoDto,
      );
  }

  // ----- Mostrar Tratamiento por ID (READ) -----
  findById(id: number): Observable<TratamientoDetalleDto> {
    return this.http.get<TratamientoDetalleDto>(
      `${environment.apiUrl}/tratamientos/${id}`,
    );
  }

  // ----- Eliminar Tratamiento (DELETE) -----
  deleteTratamiento(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/tratamientos/delete/${id}`,
    );
  }
}
