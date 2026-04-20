import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Droga } from '../models/Droga/droga';

@Injectable({
  providedIn: 'root'
})
export class DrogasService {

  constructor(private http: HttpClient) { }

  // ----- Crear o Actualizar Droga (CREATE/UPDATE) -----
  saveDroga(droga: Droga): Observable<Droga> {
    if (droga.id)
      return this.http.put<Droga>(`http://localhost:8080/drogas/update/${droga.id}`, droga);
    else
      return this.http.post<Droga>('http://localhost:8080/drogas/add', droga);
  }

  // ----- Obtener todas las drogas (READ) -----
  findAll(): Observable<Droga[]> {
    return this.http.get<Droga[]>('http://localhost:8080/drogas');
  }


}
