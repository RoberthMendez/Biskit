import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
})
export class DeleteModalComponent implements OnChanges, OnDestroy {
  @Input() visible = true;
  @Input() entityLabel = 'objeto';
  @Input() successMessage = '';
  @Input() successCloseDelayMs = 600;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  showSuccess = false;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !this.visible) {
      this.resetSuccessState();
      return;
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
    this.clearCloseTimeout();
  }

  onCancel(): void {
    if (this.showSuccess) {
      return;
    }

    this.close.emit();
  }

  onConfirm(): void {
    if (this.showSuccess) {
      return;
    }

    this.confirm.emit();
  }

  private startSuccessFlow(): void {
    this.showSuccess = true;
    this.clearCloseTimeout();

    this.closeTimeout = setTimeout(() => {
      this.close.emit();
    }, this.successCloseDelayMs);
  }

  private resetSuccessState(): void {
    this.showSuccess = false;
    this.clearCloseTimeout();
  }

  private clearCloseTimeout(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }
}