import { Injectable } from '@angular/core';
import { Especialidad } from '../models/Vets/Especialidad/especialidad';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {

  constructor(private http: HttpClient) {}

  especialidades: Especialidad[] = [
    new Especialidad(1, 'Medicina General'),
    new Especialidad(2, 'Cirugía'),
    new Especialidad(3, 'Dermatología'),
    new Especialidad(4, 'Cardiología'),
    new Especialidad(5, 'Neurología'),
    new Especialidad(6, 'Oncología'),
    new Especialidad(7, 'Oftalmología'),
    new Especialidad(8, 'Odontología'),
    new Especialidad(9, 'Fisioterapia'),
    new Especialidad(10, 'Medicina interna'),
  ];

  
  findAll(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>('http://localhost:8080/especialidades');
  }

  addEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>('http://localhost:8080/especialidades/add', especialidad);
  }

  
}
