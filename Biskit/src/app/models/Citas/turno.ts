export class Turno {
  id?: number; // Opcional porque el backend lo genera (IDENTITY)
  nombre: string;
  horaInicio: string;
  horaFin: string;

  constructor(
    id?: number,
    nombre: string = '',
    horaInicio: string = '',
    horaFin: string = ''
  ) {
    this.id = id;
    this.nombre = nombre;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }
}
