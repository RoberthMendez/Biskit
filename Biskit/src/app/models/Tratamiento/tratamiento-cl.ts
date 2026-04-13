import { Droga } from '../Droga/droga';
import { PetCl } from '../Pets/Pet/pet-cl';
import { VetCl } from '../Vets/vet-cl';

export class TratamientoCl {
  id?: number;
  fecha: Date;
  pet: PetCl;
  vet: VetCl;
  drogas: Droga[];

  constructor(
    id?: number,
    fecha: Date = new Date(),
    pet: PetCl = new PetCl(),
    vet: VetCl = new VetCl(),
    drogas: Droga[] = [],
  ) {
    this.id = id;
    this.fecha = fecha;
    this.pet = pet;
    this.vet = vet;
    this.drogas = drogas;
  }
}
