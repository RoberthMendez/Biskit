import { Credenciales } from "../Credenciales/credenciales";
import { PetCl } from "../Pets/Pet/pet-cl";

export class ClientCL {
  id?: number;
  nombre: string;
  cedula: string;
  correo: string;
  celular: string;
  credenciales: Credenciales;
  pets: PetCl[];

  constructor(
    id?: number,
    nombre: string = '',
    cedula: string = '',
    correo: string = '',
    celular: string = '',
    credenciales: Credenciales = new Credenciales(),
    pets: PetCl[] = []
  ) {
    this.id = id;
    this.nombre = nombre;
    this.cedula = cedula;
    this.correo = correo;
    this.celular = celular;
    this.credenciales = credenciales;
    this.pets = pets;
  }

}