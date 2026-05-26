export class MensajeDto {
  id: number;
  remitenteId: number;
  contenido: string;
  timestamp: Date;

  constructor(
    id: number = 0,
    remitenteId: number = 0,
    contenido: string = '',
    timestamp: Date = new Date(),
  ) {
    this.id = id;
    this.remitenteId = remitenteId;
    this.contenido = contenido;
    this.timestamp = timestamp;
  }
}
