export class TipoCita {
  nombre: string;
  duracionMinutos: number;

  constructor(nombre: string = '', duracionMinutos: number = 0) {
    this.nombre = nombre;
    this.duracionMinutos = duracionMinutos;
  }
}
