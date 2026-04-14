import { Client } from '../Client/client';
import { Tratamiento } from '../Tratamiento/tratamiento';
import { Enfermedad } from './enfermedad';
import { Raza } from './raza';

export class Pet {
  public id?: number;
  public nombre: string;
  public estado: boolean;
  public fechaNacimiento: Date;
  public peso: number | null;
  public urlFoto: string;
  public enfermedad: Enfermedad;
  public owner: Client;
  public raza: Raza;
  public tratamientos?: Tratamiento[];

  constructor(
    id?: number,
    nombre: string = '',
    estado: boolean = true,
    fechaNacimiento: Date = new Date(),
    peso: number | null = null,
    urlFoto: string = '',
    enfermedad: Enfermedad = new Enfermedad(),
    owner: Client = new Client(),
    raza: Raza = new Raza(),
    tratamientos?: Tratamiento[],
  ) {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;
    this.fechaNacimiento = fechaNacimiento;
    this.peso = peso;
    this.urlFoto = urlFoto;
    this.enfermedad = enfermedad;
    this.owner = owner;
    this.raza = raza;
    this.tratamientos = tratamientos ?? [];
  }

}

export { Pet as PeT };
