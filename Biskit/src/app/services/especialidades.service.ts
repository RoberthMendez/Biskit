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
    new Especialidad(2, 'CirugÃ­a'),
    new Especialidad(3, 'DermatologÃ­a'),
    new Especialidad(4, 'CardiologÃ­a'),
    new Especialidad(5, 'NeurologÃ­a'),
    new Especialidad(6, 'OncologÃ­a'),
    new Especialidad(7, 'OftalmologÃ­a'),
    new Especialidad(8, 'OdontologÃ­a'),
    new Especialidad(9, 'Fisioterapia'),
    new Especialidad(10, 'Medicina interna'),
  ];

  
  findAll(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>('https://biskitserver.onrender.com/especialidades');
  }

  addEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>('https://biskitserver.onrender.com/especialidades/add', especialidad);
  }

  
}

