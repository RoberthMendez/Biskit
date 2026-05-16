export class PetDTO {
  id?: number;
  nombre: string;
  estado: boolean;
  edad: number;
  peso: number;
  urlFoto: string;
  enfermedad: string;
  owner: string;
  raza: string;
  especie: string;

  constructor(
    id?: number,
    nombre: string = '',
    estado: boolean = true,
    edad: number = 0,
    peso: number = 0,
    urlFoto: string = '',
    enfermedad: string = '',
    owner: string = '',
    raza: string = '',
    especie: string = '',
  ) {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;
    this.edad = edad;
    this.peso = peso;
    this.urlFoto = urlFoto;
    this.enfermedad = enfermedad;
    this.owner = owner;
    this.raza = raza;
    this.especie = especie;
  }
}
