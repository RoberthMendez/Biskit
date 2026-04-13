import { Credenciales } from '../Credenciales/credenciales';
import { Tratamiento } from '../Tratamiento/tratamiento';
import { Especialidad } from './Especialidad/especialidad';

export class VetCl {
  public id?: number;
  public nombre: string;
  public estado: boolean;
  public correo: string;
  public cedula: string;
  public urlFoto: string;
  public credenciales: Credenciales;
  public especialidad: Especialidad;
  public tratamientos: Tratamiento[];

  constructor(
    id?: number,
    nombre: string = '',
    estado: boolean = true,
    correo: string = '',
    cedula: string = '',
    urlFoto: string = '',
    credenciales: Credenciales = new Credenciales(),
    especialidad: Especialidad = new Especialidad(),
    tratamientos: Tratamiento[] = [],
  ) {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;
    this.correo = correo;
    this.cedula = cedula;
    this.urlFoto = urlFoto;
    this.credenciales = credenciales;
    this.especialidad = especialidad;
    this.tratamientos = tratamientos;
  }
}
