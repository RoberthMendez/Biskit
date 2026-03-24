import { Tratamiento } from '../../Tratamiento/tratamiento';

export interface Pet {
  id: number;
  nombre: string;
  estado: boolean;
  fechaNacimiento: Date;
  peso: number;
  URLFoto: string;
  enfermedad: string;
  specie: string;
  owner: string;
  raza: string;
  tratamientos: Tratamiento[];
}
