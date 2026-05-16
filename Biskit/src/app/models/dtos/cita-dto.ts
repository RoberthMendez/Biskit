export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export class CitaDto {
  
  id?: number;
  diaSemana: DiaSemana | string;
  hora: string;
  tipoCitaNombre: string;
  duracionMinutos: number;
  petId: number;
  vetId: number;

  constructor(
    id?: number,
    diaSemana: DiaSemana | string = '',
    hora: string = '',
    tipoCitaNombre: string = '',
    duracionMinutos: number = 0,
    petId: number = 0,
    vetId: number = 0
  ) {
    this.id = id;
    this.diaSemana = diaSemana;
    this.hora = hora;
    this.tipoCitaNombre = tipoCitaNombre;
    this.duracionMinutos = duracionMinutos;
    this.petId = petId;
    this.vetId = vetId;
  }
}
