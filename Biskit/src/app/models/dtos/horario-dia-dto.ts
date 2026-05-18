export type DiaSemana =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';

export class HorarioDiaDto {
  diaSemana: DiaSemana | string;
  horaInicio: string;
  horaFin: string;

  constructor(
    diaSemana: DiaSemana | string = '',
    horaInicio: string = '',
    horaFin: string = '',
  ) {
    this.diaSemana = diaSemana;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }
}
