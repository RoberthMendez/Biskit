import { Credenciales } from "../Credenciales/credenciales";
import { PetCl } from "../Pets/Pet/pet-cl";

export interface Client {
  id?: number;
  nombre: string;
  cedula: string;
  correo: string;
  celular: string;
  credenciales: Credenciales;
  pets: PetCl[];
}

