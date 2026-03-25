export class Enfermedad {
  public id: number;
  public nombre: string;

  constructor(
    id: number = 0,
    nombre: string = '',
  ) {
    this.id = id;
    this.nombre = nombre;
  }
}
