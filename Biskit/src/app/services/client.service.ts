import { Injectable } from '@angular/core';
import { Client } from '../modelo/Client/client';
import { ClientCL } from '../modelo/Client/client-cl';
import { PetCl } from '../modelo/Pets/Pet/pet-cl';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor() {}

  private createPet(
    id: number,
    nombre: string,
    fechaNacimiento: Date,
    peso: number,
    urlFoto: string,
    enfermedadId: number,
    enfermedadNombre: string,
    razaId: number,
    razaNombre: string,
    especieId: number,
    especieNombre: string,
  ): PetCl {
    return new PetCl(
      id,
      nombre,
      true,
      fechaNacimiento,
      peso,
      urlFoto,
      { id: enfermedadId, nombre: enfermedadNombre },
      undefined as unknown as ClientCL,
      {
        id: razaId,
        nombre: razaNombre,
        especie: { id: especieId, nombre: especieNombre },
      },
      [],
    );
  }

  private linkPetsToOwner(client: ClientCL): ClientCL {
    client.pets.forEach((pet) => {
      pet.owner = client;
    });

    return client;
  }

  clients: ClientCL[] = [
    this.linkPetsToOwner(
      new ClientCL(
        1,
        'Juan Pérez',
        '123456789',
        'juan.perez@example.com',
        '555-1234',
        { usuario: 'juanp', password: 'password' },
        [
          this.createPet(
            1,
            'Firulais',
            new Date(2020, 5, 15),
            25,
            'https://eq2imhfmrcc.exactdn.com/wp-content/uploads/2016/08/golden-retriever.jpg?strip=all',
            1,
            'Gripe',
            1,
            'Labrador',
            1,
            'Perro',
          ),
          this.createPet(
            4,
            'Luna',
            new Date(2022, 1, 5),
            3.5,
            'https://cdn2.thecatapi.com/images/bpc.jpg',
            4,
            'Parásitos',
            4,
            'Siames',
            2,
            'Gato',
          ),
          this.createPet(
            6,
            'Nala',
            new Date(2020, 6, 14),
            4.2,
            'https://cdn2.thecatapi.com/images/9j5.jpg',
            6,
            'Gripe',
            6,
            'Bengalí',
            2,
            'Gato',
          ),
        ],
      ),
    ),

    this.linkPetsToOwner(
      new ClientCL(
        2,
        'Ana Gómez',
        '987654321',
        'ana.gomez@example.com',
        '555-5678',
        { usuario: 'anag', password: 'password' },
        [
          this.createPet(
            2,
            'Michi',
            new Date(2021, 3, 10),
            4,
            'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
            2,
            'Alergia',
            2,
            'Criollo',
            2,
            'Gato',
          ),
          this.createPet(
            5,
            'Max',
            new Date(2018, 11, 25),
            28,
            'https://www.zooplus.es/magazine/wp-content/uploads/2019/03/deutscher-sch%C3%A4ferhund-768x511.webp',
            5,
            'Otitis',
            5,
            'Pastor Alemán',
            1,
            'Perro',
          ),
          this.createPet(
            9,
            'Bruno',
            new Date(2016, 4, 18),
            35,
            'https://cdn-ilbfemn.nitrocdn.com/SMbNqQVgokVBOKPHqgPbhvowhPKWFJah/assets/images/optimized/rev-4009443/canna-pet.com/wp-content/uploads/2017/07/rottweiler-temperament-and-personality_canna-pet-1024x683.jpg',
            9,
            'Artritis',
            9,
            'Rottweiler',
            1,
            'Perro',
          ),
          this.createPet(
            12,
            'Milo',
            new Date(2020, 0, 3),
            4.5,
            'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
            12,
            'Parásitos',
            12,
            'Criollo',
            2,
            'Gato',
          ),
        ],
      ),
    ),

    this.linkPetsToOwner(
      new ClientCL(
        3,
        'Carlos Ruiz',
        '5553434554',
        'carlos.ruiz@example.com',
        '555-5555',
        { usuario: 'carlosr', password: 'password' },
        [
          this.createPet(
            3,
            'Rocky',
            new Date(2019, 8, 20),
            30,
            'https://images.dog.ceo/breeds/boxer/n02108089_1353.jpg',
            3,
            'Dolor articular',
            3,
            'Boxer',
            1,
            'Perro',
          ),
          this.createPet(
            7,
            'Toby',
            new Date(2017, 2, 8),
            12,
            'https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg',
            7,
            'Obesidad',
            7,
            'Beagle',
            1,
            'Perro',
          ),
          this.createPet(
            11,
            'Zeus',
            new Date(2019, 10, 12),
            40,
            'https://www.akc.org/wp-content/uploads/2017/11/Doberman-Pinscher-standing-outdoors.jpg',
            11,
            'Gripe',
            11,
            'Doberman',
            1,
            'Perro',
          ),
          this.createPet(
            13,
            'Rex',
            new Date(2015, 6, 22),
            32,
            'https://images.dog.ceo/breeds/husky/n02110185_1469.jpg',
            13,
            'Displasia',
            13,
            'Husky',
            1,
            'Perro',
          ),
          this.createPet(
            15,
            'Bobby',
            new Date(2018, 2, 27),
            20,
            'https://pet-health-content-media.chewy.com/wp-content/uploads/2024/09/11180825/202105cocker-spaniel-4.jpg',
            15,
            'Otitis',
            15,
            'Cocker Spaniel',
            1,
            'Perro',
          ),
        ],
      ),
    ),

    this.linkPetsToOwner(
      new ClientCL(
        4,
        'Camila Rojas',
        '486928398',
        'camila.rojas@example.com',
        '555-4444',
        { usuario: 'camilar', password: 'password' },
        [
          this.createPet(
            8,
            'Simba',
            new Date(2021, 9, 1),
            5,
            'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
            8,
            'Dermatitis',
            8,
            'Criollo',
            2,
            'Gato',
          ),
          this.createPet(
            10,
            'Kira',
            new Date(2022, 7, 30),
            3,
            'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
            10,
            'Infección',
            10,
            'Persa',
            2,
            'Gato',
          ),
          this.createPet(
            14,
            'Coco',
            new Date(2021, 11, 11),
            3.8,
            'https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg',
            14,
            'Gripe',
            14,
            'Siames',
            2,
            'Gato',
          ),
        ],
      ),
    ),
  ];
  addClient(client: Client): void {
    this.clients.push(client);
  }

  getClients(): ClientCL[] {
    return this.clients;
  }

  deleteClient(clientId: number): void {
    this.clients = this.clients.filter((client) => client.id !== clientId);
  }

  findById(clientId: number): ClientCL {
    const client = this.clients.find((c) => c.id === clientId);
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    return client;
  }

  saveClient(client: ClientCL): void {
    if (client.id) {
      const index = this.clients.findIndex((c) => c.id === client.id);
      if (index !== -1) {
        this.clients[index] = client;
      }
    } else {
      // Busca el id máximo de los clientes y le suma 1
      const nuevoId =
        this.clients.length > 0
          ? Math.max(...this.clients.map((c) => c.id || 0)) + 1
          : 1;
      client.id = nuevoId;
      this.clients.push(client);
    }
  }
}
