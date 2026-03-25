import { Injectable } from '@angular/core';
import { PetCl } from '../modelo/Pets/Pet/pet-cl';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  constructor() {}

  // Base de datos falsa

  pets: PetCl[] = [
    new PetCl(
      1,
      'Firulais',
      true,
      new Date(2020, 5, 15),
      25,
      'https://eq2imhfmrcc.exactdn.com/wp-content/uploads/2016/08/golden-retriever.jpg?strip=all',
      { id: 1, nombre: 'Gripe' },
      { id: 1, nombre: 'Juan Pérez' },
      { id: 1, nombre: 'Labrador', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),

    new PetCl(
      2,
      'Michi',
      true,
      new Date(2021, 3, 10),
      4,
      'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
      { id: 2, nombre: 'Alergia' },
      { id: 2, nombre: 'Ana Gómez' },
      { id: 2, nombre: 'Criollo', especie: { id: 2, nombre: 'Gato' } },
      [],
    ),

    new PetCl(
      3,
      'Rocky',
      true,
      new Date(2019, 8, 20),
      30,
      'https://images.dog.ceo/breeds/boxer/n02108089_1353.jpg',
      { id: 3, nombre: 'Dolor articular' },
      { id: 3, nombre: 'Carlos Ruiz' },
      { id: 3, nombre: 'Boxer', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),

    new PetCl(
      4,
      'Luna',
      true,
      new Date(2022, 1, 5),
      3.5,
      'https://cdn2.thecatapi.com/images/bpc.jpg',
      { id: 4, nombre: 'Parásitos' },
      { id: 1, nombre: 'Juan Pérez' },
      { id: 4, nombre: 'Siames', especie: { id: 2, nombre: 'Gato' } },
      [],
    ),

    new PetCl(
      5,
      'Max',
      true,
      new Date(2018, 11, 25),
      28,
      'https://picartpetcare.com/wp-content/uploads/2020/05/PASTOR-ALEM%C3%81N.jpg',
      { id: 5, nombre: 'Otitis' },
      { id: 2, nombre: 'Ana Gómez' },
      { id: 5, nombre: 'Pastor Alemán', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),

    new PetCl(
      6,
      'Nala',
      true,
      new Date(2020, 6, 14),
      4.2,
      'https://cdn2.thecatapi.com/images/9j5.jpg',
      { id: 6, nombre: 'Gripe' },
      { id: 1, nombre: 'Juan Pérez' },
      { id: 6, nombre: 'Bengalí', especie: { id: 2, nombre: 'Gato' } },
      [],
    ),

    new PetCl(
      7,
      'Toby',
      true,
      new Date(2017, 2, 8),
      12,
      'https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg',
      { id: 7, nombre: 'Obesidad' },
      { id: 3, nombre: 'Carlos Ruiz' },
      { id: 7, nombre: 'Beagle', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),

    new PetCl(
      8,
      'Simba',
      true,
      new Date(2021, 9, 1),
      5,
      'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
      { id: 8, nombre: 'Dermatitis' },
      { id: 4, nombre: 'Camila Rojas' },
      { id: 8, nombre: 'Criollo', especie: { id: 2, nombre: 'Gato' } },
      [],
    ),

    new PetCl(
      9,
      'Bruno',
      true,
      new Date(2016, 4, 18),
      35,
      'https://cdn-ilbfemn.nitrocdn.com/SMbNqQVgokVBOKPHqgPbhvowhPKWFJah/assets/images/optimized/rev-4009443/canna-pet.com/wp-content/uploads/2017/07/rottweiler-temperament-and-personality_canna-pet-1024x683.jpg',
      { id: 9, nombre: 'Artritis' },
      { id: 2, nombre: 'Ana Gómez' },
      { id: 9, nombre: 'Rottweiler', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),

    new PetCl(
      10,
      'Kira',
      true,
      new Date(2022, 7, 30),
      3,
      'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
      { id: 10, nombre: 'Infección' },
      { id: 4, nombre: 'Camila Rojas' },
      { id: 10, nombre: 'Persa', especie: { id: 2, nombre: 'Gato' } },
      [],
    ),

    new PetCl(
      11,
      'Zeus',
      true,
      new Date(2019, 10, 12),
      40,
      'https://www.akc.org/wp-content/uploads/2017/11/Doberman-Pinscher-standing-outdoors.jpg',
      { id: 11, nombre: 'Gripe' },
      { id: 3, nombre: 'Carlos Ruiz' },
      { id: 11, nombre: 'Doberman', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),

    new PetCl(
      12,
      'Milo',
      true,
      new Date(2020, 0, 3),
      4.5,
      'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
      { id: 12, nombre: 'Parásitos' },
      { id: 2, nombre: 'Ana Gómez' },
      { id: 12, nombre: 'Criollo', especie: { id: 2, nombre: 'Gato' } },
      [],
    ),

    new PetCl(
      13,
      'Rex',
      true,
      new Date(2015, 6, 22),
      32,
      'https://images.dog.ceo/breeds/husky/n02110185_1469.jpg',
      { id: 13, nombre: 'Displasia' },
      { id: 3, nombre: 'Carlos Ruiz' },
      { id: 13, nombre: 'Husky', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),

    new PetCl(
      14,
      'Coco',
      true,
      new Date(2021, 11, 11),
      3.8,
      'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
      { id: 14, nombre: 'Gripe' },
      { id: 4, nombre: 'Camila Rojas' },
      { id: 14, nombre: 'Siames', especie: { id: 2, nombre: 'Gato' } },
      [],
    ),

    new PetCl(
      15,
      'Bobby',
      true,
      new Date(2018, 2, 27),
      20,
      'https://pet-health-content-media.chewy.com/wp-content/uploads/2024/09/11180825/202105cocker-spaniel-4.jpg',
      { id: 15, nombre: 'Otitis' },
      { id: 3, nombre: 'Carlos Ruiz' },
      { id: 15, nombre: 'Cocker Spaniel', especie: { id: 1, nombre: 'Perro' } },
      [],
    ),
  ];

  findAll(): PetCl[] {
    return this.pets;
  }

  findById(id: number): PetCl {
    const pet = this.pets.find((p) => p.id === id);
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }
    return pet;
  }

  updateEstado(id: number, estado: boolean): void {
    const pet = this.findById(id);
    pet.estado = estado;
  }

  savePet(pet: PetCl): void {
    if (pet.id) {
      const index = this.pets.findIndex((p) => p.id === pet.id);
      if (index !== -1) {
        this.pets[index] = pet;
      }
    } else {
      // Busca el id de la ultima mascota y le suma 1
      const nuevoId =
        this.pets.length > 0 ? this.pets[this.pets.length - 1].id + 1 : 1;
      pet.id = nuevoId;
      this.pets.push(pet);
    }
  }

  getPetById(id: number): PetCl {
    const pet = this.pets.find((p) => p.id === id);
    if (!pet) {
      throw new Error('Mascota no encontrada');
    }
    return pet;
  }
}
