import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from '../models/Tratamiento/tratamiento';
import { HttpClient } from '@angular/common/http';
import { TratamientoDto } from '../models/dtos/tratamiento-dto';


@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  constructor( private http: HttpClient ) { }

  // ----- Crear y Actualizar Tratamiento (CREATE/UPDATE) -----
  saveTratamiento(tratamientoDto: TratamientoDto): Observable<Tratamiento> {

    if (tratamientoDto.id)
      return this.http.put<Tratamiento>(`http://localhost:8080/tratamientos/update/${tratamientoDto.id}`, tratamientoDto);
    else
      return this.http.post<Tratamiento>('http://localhost:8080/tratamientos/add', tratamientoDto);

  }
  
  // ----- Mostrar Tratamientos por ID de Mascota (READ) -----
  findTratamientosByPetId(petId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`http://localhost:8080/tratamientos/pet/${petId}`);
  }

  // ----- Mostrar Tratamiento por ID (READ) -----
  findById(id: number): Observable<Tratamiento> {
    return this.http.get<Tratamiento>(`http://localhost:8080/tratamientos/${id}`);
  }

  // ----- Eliminar Tratamiento (DELETE) -----
  deleteTratamiento(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/tratamientos/delete/${id}`);
  }

}
