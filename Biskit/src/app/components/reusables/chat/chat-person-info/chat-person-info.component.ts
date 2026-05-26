import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatPerson } from '../../../../models/Chat/chat-person';

@Component({
  selector: 'app-chat-person-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-person-info.component.html',
})
export class ChatPersonInfoComponent {
  @Input() person: ChatPerson | null = null;

  get personInitial(): string {
    return this.person?.name.trim().charAt(0).toUpperCase() || '?';
  }
}
