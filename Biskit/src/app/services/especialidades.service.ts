import { Injectable } from '@angular/core';
import { Especialidad } from '../modelo/Vets/Especialidad/especialidad';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  constructor() {}

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

  getAll(): Especialidad[] {
    return this.especialidades;
  }

  addEspecialidad(especialidad: Especialidad): void {
    especialidad.id =
      this.especialidades.length > 0
        ? Math.max(...this.especialidades.map((e) => e.id || 0)) + 1
        : 1;
    this.especialidades.push(especialidad);
  }

  
}
