import { Tratamiento } from '../Tratamiento/tratamiento';

export class Droga {
  id?: number;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  unidadesDisponibles: number;
  unidadesVendidas: number;
  tratamientos?: Tratamiento[];

  constructor(
    id?: number,
    nombre: string = '',
    precioCompra: number = 0,
    precioVenta: number = 0,
    unidadesDisponibles: number = 0,
    unidadesVendidas: number = 0,
    tratamientos: Tratamiento[] = [],
  ) {
    this.id = id;
    this.nombre = nombre;
    this.precioCompra = precioCompra;
    this.precioVenta = precioVenta;
    this.unidadesDisponibles = unidadesDisponibles;
    this.unidadesVendidas = unidadesVendidas;
    this.tratamientos = tratamientos;
  }
}
