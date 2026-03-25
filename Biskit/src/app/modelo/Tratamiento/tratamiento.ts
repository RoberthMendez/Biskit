import { Droga } from "../Droga/droga";
import { PetCl } from "../Pets/Pet/pet-cl";
import { VetCl } from "../Vets/vet-cl";

export interface Tratamiento {
    id?: number;
    fecha: Date;
    pet: PetCl;
    vet: VetCl;
    drogas: Droga[];
}
