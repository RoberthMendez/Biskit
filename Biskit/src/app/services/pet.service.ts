import { Injectable } from '@angular/core';
import { PetCl } from '../modelo/Pets/Pet/pet-cl';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor() { }

  private pets: PetCl[] = [];
  private nextId = 1;

  getPets(): PetCl[] {
    return this.pets;
  }

  addPet(pet: PetCl): void {
    pet.id = this.nextId++;
    this.pets.push(pet);
  }

}
