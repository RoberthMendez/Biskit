export class Especialidad {
  public id?: number;
  public nombre: string;

  constructor(
    id?: number,
    nombre: string = '',
  ) {
    this.id = id;
    this.nombre = nombre;
  }
}
