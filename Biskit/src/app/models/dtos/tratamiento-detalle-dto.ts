import { Client } from '../Client/client';
import { PetDTO } from './pet-dto';
import { DrogaDto } from './droga-dto';
import { Vet } from '../Vets/vet-cl';

export class TratamientoDetalleDto {
  id?: number;
  fecha: string;
  drogas: DrogaDto[];
  pet: PetDTO;
  client: Client;
  vet: Vet;

  constructor(
    id?: number,
    fecha: string = '',
    drogas: DrogaDto[] = [],
    pet: PetDTO = new PetDTO(),
    client: Client = new Client(),
    vet: Vet = new Vet(),
  ) {
    this.id = id;
    this.fecha = fecha;
    this.drogas = drogas;
    this.pet = pet;
    this.client = client;
    this.vet = vet;
  }
}
