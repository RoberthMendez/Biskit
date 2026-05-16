import { DrogaDto } from '../dtos/droga-dto';
import { Pet } from '../Pets/pet';
import { Vet } from '../Vets/vet-cl';

export class Tratamiento {
  id?: number;
  fecha: Date;
  pet: Pet;
  vet: Vet;
  drogas: DrogaDto[];

  constructor(
    id?: number,
    fecha: Date = new Date(),
    pet: Pet = new Pet(),
    vet: Vet = new Vet(),
    drogas: DrogaDto[] = [],
  ) {
    this.id = id;
    this.fecha = fecha;
    this.pet = pet;
    this.vet = vet;
    this.drogas = drogas;
  }
}
