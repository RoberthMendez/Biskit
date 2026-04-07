// delete-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {

  @Input() visible = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}