import { Client } from '../../Client/client';
import { ClientCL } from '../../Client/client-cl';
import { Tratamiento } from '../../Tratamiento/tratamiento';
import { Enfermedad } from '../enfermedad';
import { Raza } from '../raza';

export class PetCl {
  public id?: number;
  public nombre: string;
  public estado: boolean;
  public fechaNacimiento: Date;
  public peso: number;
  public urlFoto: string;
  public enfermedad: Enfermedad;
  public owner: ClientCL;
  public raza: Raza;
  public tratamientos?: Tratamiento[];

  constructor(
    id?: number,
    nombre: string = '',
    estado: boolean = true,
    fechaNacimiento: Date = new Date(),
    peso: number = 0,
    urlFoto: string = '',
    enfermedad: Enfermedad = new Enfermedad(),
    owner: Client = new ClientCL(),
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

  getEdad(): number {
    if (!this.fechaNacimiento) {
      return 0;
    }
    const hoy = new Date();
    const edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - this.fechaNacimiento.getMonth();
    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < this.fechaNacimiento.getDate())
    ) {
      return edad - 1;
    }
    return edad;
  }
}
