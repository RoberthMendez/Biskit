import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../../models/Chat/chat-message';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  @Input() message: ChatMessage = {
    id: 0,
    senderName: '',
    text: '',
    time: '',
    direction: 'incoming',
  };

  get senderInitial(): string {
    return this.message.senderName.trim().charAt(0).toUpperCase() || '?';
  }
}
