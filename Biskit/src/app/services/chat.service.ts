import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ChatDto } from '../models/dtos/chat-dto';
import { ChatCrearDto } from '../models/dtos/chat-crear-dto';
import { MensajeDto } from '../models/dtos/mensaje-dto';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatID(IdCliente: number, IdVeterinario: number): Observable<number> {
    return this.http.get<number>(
      `${environment.apiUrl}/chat/getId/${IdCliente}/${IdVeterinario}`,
    );
  }
  getChat(id: number): Observable<ChatDto> {
    return this.http.get<ChatDto>(`${environment.apiUrl}/chat/${id}`);
  }
  sendMessage(chatId: number, mensaje: MensajeDto) {
    return this.http.put(`${environment.apiUrl}/chat/send/${chatId}`, mensaje);
  }

  addChat(chat: ChatCrearDto): Observable<number> {
    return this.http.post<number>(`${environment.apiUrl}/chat/add`, chat);
  }
}
