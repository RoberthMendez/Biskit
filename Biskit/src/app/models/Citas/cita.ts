import { Pet } from "../Pets/pet";
import { Vet } from "../Vets/vet-cl";
import { TipoCita } from "./tipo-cita";

export class Cita {
  id?: number;

  // Se usa string para respetar el formato "yyyy-MM-dd hh:mm a" de Jackson
  fechaHora: string;

  // Relaciones @ManyToOne
  tipoCita: TipoCita;
  vet: Vet;
  pet: Pet;

  constructor(data?: Partial<Cita>) {
    this.id = data?.id;
    this.fechaHora = data?.fechaHora || '';
    
    // Inicialización de objetos para evitar errores de "undefined"
    this.tipoCita = data?.tipoCita || new TipoCita();
    this.vet = data?.vet || new Vet();
    this.pet = data?.pet || new Pet();
  }
}
