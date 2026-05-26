import { ParticipanteChatDto } from './participante-chat-dto';
import { MensajeDto } from './mensaje-dto';

export class ChatDto {
  id: number;
  participantes: ParticipanteChatDto[];
  mensajes: MensajeDto[];

  constructor(
    id: number = 0,
    participantes: ParticipanteChatDto[] = [],
    mensajes: MensajeDto[] = [],
  ) {
    this.id = id;
    this.participantes = participantes;
    this.mensajes = mensajes;
  }
}
