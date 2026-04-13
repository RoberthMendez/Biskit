import { Credenciales } from '../Credenciales/credenciales';

export class Admin {
  id?: number;
  nombre: string;
  correo: string;
  cedula: string;
  credenciales: Credenciales;

  constructor(
    id?: number,
    nombre: string = '',
    correo: string = '',
    cedula: string = '',
    credenciales: Credenciales = new Credenciales(),
  ) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.cedula = cedula;
    this.credenciales = credenciales;
  }
}
