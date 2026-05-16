export class TipoCita {
  id?: number; // Opcional porque el backend lo genera (IDENTITY)
  nombre: string;
  duracionMinutos: number;

  constructor(
    id?: number,
    nombre: string = '',
    duracionMinutos: number = 0
  ) {
    this.id = id;
    this.nombre = nombre;
    this.duracionMinutos = duracionMinutos;
  }
}
