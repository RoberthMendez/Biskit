import { Client } from '../../Client/client';
import { Tratamiento } from '../../Tratamiento/tratamiento';

export interface Pet {
  id?: number;
  nombre: string;
  estado: boolean;
  fechaNacimiento: Date;
  peso: number;
  URLFoto: string;
  enfermedad: string;
  specie: string;
  owner: Client;
  raza: string;
  tratamientos: Tratamiento[];
}
