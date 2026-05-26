export class ParticipanteChatDto {
  id: number;
  rol: string;

  constructor(id: number = 0, rol: string = '') {
    this.id = id;
    this.rol = rol;
  }
}
