import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enfermedad } from '../models/Pets/enfermedad';

@Injectable({
  providedIn: 'root'
})
export class EnfermedadesService {

  constructor( private http: HttpClient) { }

  findAll(): Observable<Enfermedad[]> {
    return this.http.get<Enfermedad[]>('http://localhost:8080/enfermedades');
  }

  add(nombre: string): Observable<Enfermedad> {
    return this.http.post<Enfermedad>('http://localhost:8080/enfermedades/add', { nombre });
  }

}
