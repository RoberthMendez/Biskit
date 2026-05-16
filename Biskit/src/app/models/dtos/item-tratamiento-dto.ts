export class ItemTratamientoDto {
  id?: number;
  fecha: string;
  petNombre: string;
  drogasNombres: string[];

  constructor(
    id?: number,
    fecha: string = '',
    petNombre: string = '',
    drogasNombres: string[] = [],
  ) {
    this.id = id;
    this.fecha = fecha;
    this.petNombre = petNombre;
    this.drogasNombres = drogasNombres;
  }
}
