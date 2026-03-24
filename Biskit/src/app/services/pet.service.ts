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

  getPetById(id: number): PetCl | undefined {
    return this.pets.find((pet) => pet.id === id);
  }

  addPet(pet: PetCl): void {
    pet.id = this.nextId++;
    this.pets.push(pet);
    this.persistPets();
  }

  updatePet(pet: PetCl): boolean {
    if (!pet.id) {
      return false;
    }

    const index = this.pets.findIndex((currentPet) => currentPet.id === pet.id);
    if (index === -1) {
      return false;
    }

    this.pets[index] = pet;
    this.persistPets();
    return true;
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
