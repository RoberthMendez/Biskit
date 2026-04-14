import { Droga } from '../Droga/droga';
import { Pet } from '../Pets/pet';
import { Vet } from '../Vets/vet-cl';

export class Tratamiento {
    id?: number;
    fecha: Date;
    pet: Pet;
    vet: Vet;
    drogas: Droga[];

    constructor(
        id?: number,
        fecha: Date = new Date(),
        pet: Pet = new Pet(),
        vet: Vet = new Vet(),
        drogas: Droga[] = [],
    ) {
        this.id = id;
        this.fecha = fecha;
        this.pet = pet;
        this.vet = vet;
        this.drogas = drogas;
    }
}
