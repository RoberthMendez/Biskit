import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
})
export class DeleteModalComponent implements OnChanges, OnDestroy, OnInit {
  @Input() visible = true;
  @Input() title = 'Confirmar Eliminacion';
  @Input() entityLabel = 'objeto';
  @Input() message = '';
  @Input() cancelLabel = 'Cancelar';
  @Input() confirmLabel = 'Eliminar';
  @Input() successMessage = '';
  @Input() successCloseDelayMs = 600;
  @Input() busy = false;
  @Input() portalToBody = true;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  renderModal = false;
  isExiting = false;
  showSuccess = false;
  private successTimeout: ReturnType<typeof setTimeout> | null = null;
  private closeAnimationTimeout: ReturnType<typeof setTimeout> | null = null;
  private originalParent: Node | null = null;
  private originalNextSibling: Node | null = null;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    if (this.portalToBody) {
      this.moveHostToBody();
    }

    if (this.visible) {
      this.openModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible) {
        this.openModal();
      } else {
        this.beginCloseAnimation();
      }
    }

    if (changes['successMessage']) {
      const nextMessage = this.successMessage.trim();
      if (nextMessage.length > 0) {
        this.startSuccessFlow();
      } else {
        this.resetSuccessState();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearSuccessTimeout();
    this.clearCloseAnimationTimeout();

    if (this.portalToBody) {
      this.restoreHostPosition();
    }
  }

  onCancel(): void {
    if (this.showSuccess || this.isExiting || this.busy) {
      return;
    }

    this.close.emit();
  }

  onConfirm(): void {
    if (this.showSuccess || this.isExiting || this.busy) {
      return;
    }

    this.confirm.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.showSuccess || this.isExiting || this.busy) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    this.close.emit();
  }

  get modalMessage(): string {
    return (
      this.message ||
      `Estas seguro de que deseas eliminar este ${this.entityLabel}? Esta accion no se puede deshacer.`
    );
  }

  private openModal(): void {
    this.clearSuccessTimeout();
    this.clearCloseAnimationTimeout();
    this.renderModal = true;
    this.isExiting = false;
    this.showSuccess = false;
  }

  private beginCloseAnimation(): void {
    if (!this.renderModal) {
      return;
    }

    this.clearCloseAnimationTimeout();
    this.isExiting = true;
    this.closeAnimationTimeout = setTimeout(() => {
      this.renderModal = false;
      this.isExiting = false;
      this.showSuccess = false;
      this.clearCloseAnimationTimeout();
    }, 180);
  }

  private startSuccessFlow(): void {
    this.showSuccess = true;
    this.clearSuccessTimeout();

    this.successTimeout = setTimeout(() => {
      this.close.emit();
    }, this.successCloseDelayMs);
  }

  private resetSuccessState(): void {
    this.showSuccess = false;
    this.clearSuccessTimeout();
  }

  private clearSuccessTimeout(): void {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = null;
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
}
