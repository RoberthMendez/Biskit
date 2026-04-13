import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
})
export class DeleteModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
