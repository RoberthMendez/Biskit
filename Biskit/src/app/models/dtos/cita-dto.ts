export type DiaSemana =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';

export class CitaDto {
  id?: number | null;
  diaSemana: DiaSemana | string;
  hora: string;
  tipoCitaNombre: string;
  duracionMinutos: number;
  petId: number;
  petNombre?: string;
  ownerNombre?: string;
  vetId: number;

  constructor(
    id: number | null = null,
    diaSemana: DiaSemana | string = '',
    hora: string = '',
    tipoCitaNombre: string = '',
    duracionMinutos: number = 0,
    petId: number = 0,
    petNombre: string = '',
    ownerNombre: string = '',
    vetId: number = 0,
  ) {
    this.id = id;
    this.diaSemana = diaSemana;
    this.hora = hora;
    this.tipoCitaNombre = tipoCitaNombre;
    this.duracionMinutos = duracionMinutos;
    this.petId = petId;
    this.petNombre = petNombre;
    this.ownerNombre = ownerNombre;
    this.vetId = vetId;
  }
}
