import { Vet } from "../Vets/vet-cl";
import { Turno } from "./turno";

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export class HorarioDia {
  
  id?: number;
  turno: Turno;
  vet: Vet;
  diaSemana: DiaSemana;

  constructor(
    id?: number,
    turno: Turno = new Turno(), 
    vet: Vet = new Vet(), 
    diaSemana: DiaSemana = 'Lunes'
  ) {
    this.id = id;
    this.turno = turno;
    this.vet = vet;
    this.diaSemana = diaSemana;
  }
}
