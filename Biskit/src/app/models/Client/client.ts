import { Credenciales } from '../Credenciales/credenciales';
import { Pet } from '../Pets/pet';

export class Client {
  id?: number;
  nombre: string;
  cedula: string;
  correo: string;
  celular: string;
  credenciales?: Credenciales;
  pets?: Pet[];

  constructor(
    id?: number,
    nombre: string = '',
    cedula: string = '',
    correo: string = '',
    celular: string = '',
    credenciales?: Credenciales ,
    pets?: Pet[],
  ) {
    this.id = id; 
    this.nombre = nombre;
    this.cedula = cedula;
    this.correo = correo;
    this.celular = celular;
    this.credenciales = credenciales ?? new Credenciales();
    this.pets = pets ?? [];
  }
}

