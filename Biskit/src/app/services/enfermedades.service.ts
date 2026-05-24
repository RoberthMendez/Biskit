import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enfermedad } from '../models/Pets/enfermedad';

@Injectable({
  providedIn: 'root'
})
export class EnfermedadesService {

  constructor( private http: HttpClient) { }

  // ----- Obtener todas las enfermedades (READ) -----
  findAll(): Observable<Enfermedad[]> {
    return this.http.get<Enfermedad[]>('https://biskitserver.onrender.com/enfermedades');
  }

  // ----- Agregar una nueva enfermedad (CREATE) -----
  addEnfermedad(enfermedad: Enfermedad): Observable<Enfermedad> {
    return this.http.post<Enfermedad>('https://biskitserver.onrender.com/enfermedades/add', enfermedad);
  }

}

