import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../../../models/Chat/chat-message';
import { ChatPerson } from '../../../../models/Chat/chat-person';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatPersonInfoComponent } from '../chat-person-info/chat-person-info.component';
import { ChatService } from '../../../../services/chat.service';
import { MensajeDto } from '../../../../models/dtos/mensaje-dto';
import { ParticipanteChatDto } from '../../../../models/dtos/participante-chat-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [FormsModule, ChatMessageComponent, ChatPersonInfoComponent],
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.css'],
})
export class ChatModalComponent implements OnChanges, OnDestroy, OnInit {
  @Input() chatID = 0;
  @Input() visible = false;
  @Input() person: ChatPerson | null = null;
  @Input() title = 'Chat';
  @Input() subtitle = '';
  @Input() petName = '';
  @Input() petSummary = '';
  @Input() treatmentDate = '';
  @Input() isClientView = false;
  @Input() isVetView = false;

  @Output() close = new EventEmitter<void>();

  renderModal = false;
  isExiting = false;
  private closeAnimationTimeout: ReturnType<typeof setTimeout> | null = null;
  private pollIntervalId: ReturnType<typeof setInterval> | null = null;
  private originalParent: Node | null = null;
  private originalNextSibling: Node | null = null;
  private isLoadingChat = false;
  participantes: ParticipanteChatDto[] = [];
  messages: ChatMessage[] = [];
  selfId: number = 0;
  messageText = '';

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document,
    private chatService: ChatService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.moveHostToBody();

    if (this.visible && !this.renderModal) {
      this.openModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatID'] && this.visible) {
      this.openModal();
      return;
    }

    if (changes['visible']) {
      if (this.visible) {
        this.openModal();
      } else {
        this.beginCloseAnimation();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearCloseAnimationTimeout();
    this.stopPolling();
    this.restoreHostPosition();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  requestClose(): void {
    if (!this.renderModal || this.isExiting) {
      return;
    }

    this.close.emit();
  }

  sendCurrentMessage(): void {
    console.log('Intentando enviar mensaje:', this.messageText);
    const text = this.messageText.trim();

    if (!text || this.chatID <= 0 || this.selfId <= 0) {
      return;
    }

    const mensaje: MensajeDto = {
      id: 0,
      contenido: text,
      remitenteId: this.selfId,
      timestamp: new Date(),
    };

    this.chatService.sendMessage(this.chatID, mensaje).subscribe({
      next: () => {
        this.messageText = '';
        this.loadChat();
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
      },
    });
  }

  selfEmiterId(): number {
    if (this.isClientView) {
      return this.participantes.find((p) => p.rol === 'CLIENT')?.id || 0;
    } else if (this.isVetView) {
      console.log(
        'Buscando ID del veterinario entre los participantes:',
        this.participantes,
      );
      return this.participantes.find((p) => p.rol === 'VET')?.id || 0;
    }
    return 0;
  }

  castMessage(message: MensajeDto): ChatMessage {
    const direction = this.getDirection(message.remitenteId);
    return {
      id: message.id,
      senderName: this.getSenderName(message.remitenteId),
      text: message.contenido,
      time: this.formatTimestamp(message.timestamp),
      direction: direction,
      avatarUrl: direction === 'incoming' ? this.person?.avatarUrl : undefined,
    };
  }

  getDirection(remitenteId: number): 'incoming' | 'outgoing' {
    return remitenteId === this.selfId ? 'outgoing' : 'incoming';
  }
  getSenderName(remitenteId: number): string {
    if (remitenteId === this.selfId) {
      return 'Tú';
    }
    return this.person?.name || 'Desconocido';
  }

  private openModal(): void {
    this.clearCloseAnimationTimeout();
    this.renderModal = true;
    this.isExiting = false;
    this.startPolling();
    this.loadChat();
  }

  private loadChat(): void {
    if (this.chatID <= 0 || this.isLoadingChat) {
      return;
    }

    this.isLoadingChat = true;

    this.chatService.getChat(this.chatID).subscribe({
      next: (chat) => {
        this.participantes = chat.participantes;
        this.selfId = this.selfEmiterId();
        this.messages = [...chat.mensajes]
          .sort((firstMessage, secondMessage) => {
            const firstTime = this.getTimestampValue(firstMessage.timestamp);
            const secondTime = this.getTimestampValue(secondMessage.timestamp);

            return firstTime - secondTime;
          })
          .map((msg: MensajeDto) => this.castMessage(msg));
        this.isLoadingChat = false;
      },
      error: (err) => {
        console.error('Error al cargar el chat:', err);
        this.isLoadingChat = false;
      },
    });
  }

  private beginCloseAnimation(): void {
    if (!this.renderModal) {
      return;
    }

    this.clearCloseAnimationTimeout();
    this.isExiting = true;
    this.stopPolling();
    this.closeAnimationTimeout = setTimeout(() => {
      this.renderModal = false;
      this.isExiting = false;
      this.clearCloseAnimationTimeout();
    }, 180);
  }

  private startPolling(): void {
    this.stopPolling();

    this.pollIntervalId = setInterval(() => {
      if (!this.renderModal || this.isExiting) {
        return;
      }

      this.loadChat();
    }, 2000);
  }

  private stopPolling(): void {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  }

  private clearCloseAnimationTimeout(): void {
    if (this.closeAnimationTimeout) {
      clearTimeout(this.closeAnimationTimeout);
      this.closeAnimationTimeout = null;
    }
  }

  private moveHostToBody(): void {
    const hostElement = this.elementRef.nativeElement;

    this.originalParent = hostElement.parentNode;
    this.originalNextSibling = hostElement.nextSibling;
    this.document.body.appendChild(hostElement);
  }

  private restoreHostPosition(): void {
    const hostElement = this.elementRef.nativeElement;

    if (!this.originalParent) {
      return;
    }

    if (this.originalNextSibling?.parentNode === this.originalParent) {
      this.originalParent.insertBefore(hostElement, this.originalNextSibling);
      return;
    }

    this.originalParent.appendChild(hostElement);
  }

  private getTimestampValue(timestamp: Date | string): number {
    return new Date(timestamp).getTime();
  }

  private formatTimestamp(timestamp: Date | string): string {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
