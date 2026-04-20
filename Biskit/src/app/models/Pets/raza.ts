import { Especie } from './especie';

export class Raza {
  public id: number | null;
  public nombre: string;
  public especie: Especie;

  constructor(
    id: number | null = null,
    nombre: string = '',
    especie: Especie = new Especie(),
  ) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie;
  }
}
