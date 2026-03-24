import { Injectable } from '@angular/core';
import { PetCl } from '../modelo/Pets/Pet/pet-cl';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly storageKey = 'biskit_pets';
  private pets: PetCl[] = [];
  private nextId = 1;

  constructor() {
    this.loadPets();
  }

  getPets(): PetCl[] {
    return this.pets;
  }

  addPet(pet: PetCl): void {
    pet.id = this.nextId++;
    this.pets.push(pet);
    this.persistPets();
  }

  private loadPets(): void {
    const rawPets = localStorage.getItem(this.storageKey);
    if (!rawPets) {
      return;
    }

    const parsedPets = JSON.parse(rawPets) as Array<
      PetCl & { fechaNacimiento?: string }
    >;

    this.pets = parsedPets.map(
      (pet) =>
        new PetCl(
          pet.id,
          pet.nombre,
          pet.estado,
          pet.fechaNacimiento ? new Date(pet.fechaNacimiento) : undefined,
          pet.peso,
          pet.urlFoto,
          pet.enfermedad,
          pet.owner,
          pet.raza,
          pet.tratamientos,
        ),
    );

    const currentMaxId = this.pets.reduce(
      (maxId, pet) => Math.max(maxId, pet.id ?? 0),
      0,
    );
    this.nextId = currentMaxId + 1;
  }

  private persistPets(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.pets));
  }
}
