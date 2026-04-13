import { Client } from '../../Client/client';
import { Tratamiento } from '../../Tratamiento/tratamiento';
import { Raza } from '../raza';

export interface Pet {
  id?: number;
  nombre: string;
  estado: boolean;
  fechaNacimiento: Date;
  peso: number;
  URLFoto: string;
  enfermedad: string;
  owner: Client;
  raza: Raza;
  tratamientos: Tratamiento[];
}
