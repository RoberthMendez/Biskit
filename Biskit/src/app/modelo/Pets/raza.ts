import { Especie } from './especie';

export class Raza {
  public id: number;
  public nombre: string;
  public especie: Especie;

  constructor(
    id: number = 0,
    nombre: string = '',
    especie: Especie = new Especie(),
  ) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie;
  }
}
