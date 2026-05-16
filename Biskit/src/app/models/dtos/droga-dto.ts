export class DrogaDto {
  id?: number;
  nombre: string;
  unidadesDisponibles: number;

  constructor(
    id?: number,
    nombre: string = '',
    unidadesDisponibles: number = 0,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.unidadesDisponibles = unidadesDisponibles;
  }
}
