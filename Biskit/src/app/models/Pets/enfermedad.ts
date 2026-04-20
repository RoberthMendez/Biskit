export class Enfermedad {
  public id: number | null;
  public nombre: string;

  constructor(
    id: number | null = null,
    nombre: string = '',
  ) {
    this.id = id;
    this.nombre = nombre;
  }
}
